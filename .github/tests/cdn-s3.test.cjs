const assert = require('assert').strict;
const { Readable } = require('stream');
const sdk = require('../s3/node_modules/@aws-sdk/client-s3');
const { upyun } = require('../scripts/cdn-envelope.cjs');

// Exercise the real SDK signer/serializer without network access or real credentials.
async function run() {
  const requests = [];
  const store = upyun({ UPYUN_SERVICE: 'penguin-statistics', UPYUN_S3_ACCESS_KEY_ID: 'fixture-id',
    UPYUN_S3_SECRET_ACCESS_KEY: 'fixture-secret' }, {
    ...sdk,
    S3Client: class extends sdk.S3Client {
      constructor(options) {
        super({ ...options, requestHandler: { handle: async request => {
          requests.push(request);
          const missing = request.path.endsWith('/missing.js');
          return { response: { statusCode: missing ? 404 : 200,
            headers: { 'content-type': missing ? 'application/xml' : 'application/javascript' },
            body: Readable.from([Buffer.from(missing ? '<Error><Code>NoSuchKey</Code></Error>' : 'asset')]) } };
        } } });
      }
    },
  });
  assert.deepEqual((await store('GET', 'release/a.js')).body, Buffer.from('asset'));
  assert.equal((await store('GET', 'release/missing.js')).status, 404);
  assert.equal((await store('PUT', 'release/a.js', Buffer.from('asset'), 'application/javascript')).status, 200);
  for (const request of requests) {
    assert.equal(request.protocol, 'https:');
    assert.equal(request.hostname, 's3.api.upyun.com');
    assert(request.path.startsWith('/penguin-statistics/release/'));
    assert(request.headers.authorization.startsWith('AWS4-HMAC-SHA256 '));
    assert(!request.headers['x-amz-security-token']);
    assert(!request.headers['x-amz-trailer']);
    assert(!request.headers['content-md5']);
  }
  const put = requests.find(request => request.method === 'PUT');
  assert.equal(put.headers['content-type'], 'application/javascript');
  assert.equal(put.headers['cache-control'], 'public, max-age=31536000, immutable');
  assert.equal(put.headers['x-amz-content-sha256'], require('crypto').createHash('sha256').update('asset').digest('hex'));
  console.log('PASS: real S3 SDK SigV4, endpoint/path, object bytes, NoSuchKey, MIME and cache headers');
}
run().catch(() => { console.error('S3 SDK integration test failed'); process.exitCode = 1; });
