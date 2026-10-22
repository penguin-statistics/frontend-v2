// The files that tell crawlers and agents about the site (llms.txt and the like), checked offline. With --online,
// it also checks that their links answer 200, but those to files of this build (in SITE), which may not be live yet.
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const https = require('https');
const { SITE } = require('../scripts/cdn-envelope.cjs');
const root = path.resolve(__dirname, '../..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const nginx = read('build/nginx-default.conf');
const llms = read('src/templates/web/llms.txt');
const links = [...llms.matchAll(/https?:\/\/[^\s)<>"]+/g)].map(m => m[0]);
let count = 0;
function test(name, fn) { fn(); count++; console.log(`ok ${count} - ${name}`); }
// the directives of an exact location; none of them nests a block
function location(uri) {
  const match = new RegExp(`\\n\\s*location = ${uri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^{}]*)\\}`).exec(nginx);
  assert(match, `nginx-default.conf has no "location = ${uri}"`);
  return match[1];
}
function files(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? files(path.join(dir, entry.name), `${prefix}${entry.name}/`) : [`${prefix}${entry.name}`]);
}
// a file of this build, which may not be live before its release; the cdn-envelope check fails if it is not built
const own = url => url.startsWith('https://penguin-stats.io/') && SITE.includes(new URL(url).pathname.slice(1));

test('every static file of the web build is in the SITE list of the mainland envelope', () => {
  for (const dir of ['public', 'src/templates/web']) {
    for (const p of files(path.join(root, dir))) {
      assert(SITE.includes(p), `${dir}/${p} is not in SITE of .github/scripts/cdn-envelope.cjs: its check fails with "Unclassified build output"`);
    }
  }
});
test('llms.txt has the title of meta#17 and does not mention the upload forms or the advanced query', () => {
  assert.equal(llms.split('\n')[0], '# Penguin Statistics (企鹅物流数据统计)');
  // meta#17: agents get pointed at the data, not at its submission or the advanced query
  assert.equal(llms.match(/report|advanced/gi), null);
});
// the llms.txt format: a heading only for the title and the sections, and in the sections nothing but lists of
// "[name](url)" links, each with a description here (meta#17); its reference parser fails on the file otherwise
test('llms.txt links are absolute HTTPS URLs, and its sections lists of links with a description', () => {
  assert(links.length > 0);
  for (const url of links) assert(url.startsWith('https://'), url);
  const sections = llms.indexOf('\n## ') + 1;
  assert(sections > 0, 'llms.txt has no "## " section');
  assert.doesNotMatch(llms.slice(llms.indexOf('\n'), sections), /^#/m, 'a heading before the first section');
  for (const line of llms.slice(sections).split('\n').filter(l => l && !l.startsWith('## '))) {
    assert.match(line, /^- \[[^\]]+\]\(https:\/\/[^\s)]+\): \S/, `not "- [name](url): description" in a section: ${line}`);
  }
});
test('nginx serves llms.txt as UTF-8 text with an edge cache of an hour', () => {
  const block = location('/llms.txt');
  assert.match(block, /^\s*charset utf-8;$/m);
  assert.match(block, /^\s*add_header 'Cache-Control' 'public, max-age=3600';$/m);
});

function status(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'penguin-stats-frontend-ci (https://github.com/penguin-statistics/frontend-v2)' }, timeout: 30000 }, res => {
      res.resume();
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
        resolve(status(new URL(res.headers.location, url).href, redirects - 1));
      } else resolve(res.statusCode);
    }).on('timeout', function () { this.destroy(new Error('timeout')); }).on('error', reject);
  });
}
async function online() {
  let failures = 0;
  for (const url of [...new Set(links)].filter(url => !own(url))) {
    const code = await status(url).catch(error => error.message);
    if (code !== 200) failures++;
    console.log(`${code === 200 ? 'ok' : 'not ok'} - ${code} ${url}`);
  }
  assert.equal(failures, 0, `${failures} links do not answer 200`);
}

console.log(`${count} tests passed`);
if (process.argv.includes('--online')) online().catch(e => { console.error(e.message); process.exitCode = 1; });
