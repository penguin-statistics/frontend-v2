// The files that tell crawlers and agents about the site (llms.txt and the like), checked offline. With --online,
// it also checks what can break without a change to them: that their links answer 200 (the MCP server 405), but those
// to files of this build (in SITE), which may not be live yet, and that security.txt does not expire within 30 days.
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const https = require('https');
const { SITE } = require('../scripts/cdn-envelope.cjs');
const root = path.resolve(__dirname, '../..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const nginx = read('build/nginx-default.conf');
const llms = read('src/templates/web/llms.txt');
const robots = read('public/robots.txt');
const catalog = JSON.parse(read('src/templates/web/.well-known/api-catalog'));
const security = read('src/templates/web/.well-known/security.txt');
const expires = new Date((/^Expires: (\S+)$/m.exec(security) || [])[1]);
const urls = text => [...text.matchAll(/https?:\/\/[^\s)<>"]+/g)].map(m => m[0].replace(/[.,]$/, ''));
// the read-only MCP server (meta#20) and the guide to set it up in a client, both on their own host
const mcp = 'https://mcp.penguin-stats.io/mcp';
const mcpGuide = 'https://mcp.penguin-stats.io/';
const links = urls(llms);
let count = 0;
function test(name, fn) { fn(); count++; console.log(`ok ${count} - ${name}`); }
// the directives of an exact location, with the blocks in it (an "if"), which nest none
function location(uri) {
  const match = new RegExp(`\\n\\s*location = ${uri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{((?:[^{}]|\\{[^{}]*\\})*)\\}`).exec(nginx);
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
test('llms.txt names the MCP server and its setup guide, in its summary and in a section before the API', () => {
  assert.match(llms.split('\n').find(l => l.startsWith('> ')), /\bMCP server\b/);
  const section = llms.indexOf('\n## MCP server\n');
  assert(section > 0 && section < llms.indexOf('\n## API\n'), 'no "## MCP server" section before "## API"');
  const lines = llms.slice(section + 1).split('\n## ')[0].split('\n');
  for (const url of [mcp, mcpGuide]) assert(lines.some(l => l.startsWith('- [') && l.includes(`](${url}): `)), url);
});
test('robots.txt gives each named group the rules of "*", as groups do not inherit them (RFC 9309)', () => {
  const groups = [];
  for (const line of robots.split('\n').map(l => l.replace(/#.*/, '').trim()).filter(Boolean)) {
    const [, field, value] = /^([A-Za-z-]+):\s*(.*)$/.exec(line);
    if (/^user-agent$/i.test(field)) {
      if (!groups.length || groups[groups.length - 1].rules.length) groups.push({ agents: [], rules: [] });
      groups[groups.length - 1].agents.push(value);
    } else if (!/^sitemap$/i.test(field)) groups[groups.length - 1].rules.push(`${field.toLowerCase()}: ${value}`);
  }
  const all = groups.find(g => g.agents.includes('*'));
  assert(all && all.rules.some(r => r.startsWith('content-signal: ')), 'no Content-Signal for "*"');
  for (const g of groups) assert.deepEqual(g.rules, all.rules, g.agents.join(', '));
  assert.match(robots, /^Sitemap: https:\/\/penguin-stats\.io\/sitemap\.xml$/m);
});
test('the API catalog is an RFC 9727 linkset of absolute HTTPS links', () => {
  assert(Array.isArray(catalog.linkset) && catalog.linkset.length > 0);
  for (const { anchor, ...relations } of catalog.linkset) {
    assert(anchor.startsWith('https://'), anchor);
    assert(Object.keys(relations).length > 0, anchor);
    for (const [rel, targets] of Object.entries(relations)) {
      assert(Array.isArray(targets) && targets.length > 0, `${anchor} ${rel}`);
      for (const { href } of targets) assert(href.startsWith('https://'), `${anchor} ${rel} ${href}`);
    }
  }
});
test('nginx serves the API catalog as a linkset with its Link header', () => {
  const block = location('/.well-known/api-catalog');
  assert.match(block, /^\s*default_type 'application\/linkset\+json; profile="https:\/\/www\.rfc-editor\.org\/info\/rfc9727"';$/m);
  assert.match(block, /^\s*add_header 'Link' '<\/\.well-known\/api-catalog>; rel="api-catalog"';$/m);
});
test('the pages point to the API catalog and llms.txt, in their head and Link header', () => {
  const head = read('src/templates/web/index.html').split('</head>')[0];
  assert(head.includes('<link rel="api-catalog" href="/.well-known/api-catalog">'));
  assert(head.includes('<link rel="describedby" type="text/plain" href="/llms.txt">'));
  assert.match(location('/index.html'), /^\s*add_header 'Link' '<\/\.well-known\/api-catalog>; rel="api-catalog", <\/llms\.txt>; rel="describedby"; type="text\/plain"';$/m);
});
// an Expires less than a year ahead stays so as time passes; whether it has passed is checked --online, so that the
// date alone never fails a pull request
test('security.txt is the same at both paths and expires in less than a year (RFC 9116)', () => {
  assert.equal(read('src/templates/web/security.txt'), security);
  assert(!isNaN(expires), 'security.txt has no valid Expires');
  assert(expires - Date.now() < 366 * 86400000, 'RFC 9116 recommends an Expires less than a year ahead');
});
// the official MCP Registry reads this line from penguin-stats.io, and lets the key in it publish io.penguin-stats/*
test('the MCP Registry proof of penguin-stats.io is one line with an Ed25519 public key, served as text', () => {
  const key = /^v=MCPv1; k=ed25519; p=([A-Za-z0-9+/]{43}=)\n$/.exec(read('src/templates/web/.well-known/mcp-registry-auth'));
  assert(key, 'not "v=MCPv1; k=ed25519; p=<public key in base64>" and a newline');
  assert.equal(Buffer.from(key[1], 'base64').length, 32, 'an Ed25519 public key has 32 bytes');
  const block = location('/.well-known/mcp-registry-auth');
  assert.match(block, /^\s*default_type 'text\/plain; charset=utf-8';$/m);
  assert.match(block, /^\s*add_header 'Cache-Control' 'no-cache';$/m);
});
test('nginx redirects penguin-stats.io/mcp: a browser to the setup guide, an MCP client to the MCP server', () => {
  let block = location('/mcp');
  // 308, unlike 301 and 302, keeps the method and the body of the request. An MCP client sends POSTs, and a GET for
  // its event stream, which the guide would answer with a page that the client reads as a stream to reopen
  for (const [request, condition] of [
    ['anything but a GET or HEAD', /^\s*if \(\$request_method !~ \^\(GET\|HEAD\)\$\) \{\s*return 308 (\S+);\s*\}$/m],
    ['a request for an event stream', /^\s*if \(\$http_accept ~\* text\/event-stream\) \{\s*return 308 (\S+);\s*\}$/m],
  ]) {
    const other = condition.exec(block);
    assert(other, `no "if" that answers ${request} with a 308`);
    assert.equal(other[1], mcp);
    block = block.replace(other[0], '');
  }
  assert.deepEqual(block.match(/^\s*return .*$/gm).map(l => l.trim()), [`return 302 ${mcpGuide};`]);
  // the "if"s run in order, so the 302 must come after them
  assert.match(location('/mcp'), /return 302 \S+;\s*$/, 'the 302 is not the last directive');
  assert.match(block, /^\s*add_header 'Cache-Control' 'no-store' always;$/m);
});
for (const file of ['/llms.txt', '/robots.txt']) test(`nginx serves ${file} as UTF-8 text with an edge cache of an hour`, () => {
  const block = location(file);
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
  // the catalog's link targets, not its anchors: an anchor is the base URI of an API, not an endpoint, and answers 404
  const hrefs = catalog.linkset.flatMap(({ anchor, ...relations }) => Object.values(relations).flat().map(t => t.href));
  for (const url of [...new Set([...links, ...urls(robots), ...hrefs])].filter(url => !own(url))) {
    const code = await status(url).catch(error => error.message);
    // the MCP server is stateless and answers MCP's POSTs only: a GET gets 405, which shows that it is up
    const expected = url === mcp ? 405 : 200;
    if (code !== expected) failures++;
    console.log(`${code === expected ? 'ok' : 'not ok'} - ${code} ${url}`);
  }
  const days = Math.floor((expires - Date.now()) / 86400000);
  if (days < 30) failures++;
  console.log(`${days < 30 ? 'not ok' : 'ok'} - security.txt expires on ${expires.toISOString().slice(0, 10)}, in ${days} days${days < 30 ? ': renew its Expires in both files' : ''}`);
  assert.equal(failures, 0, `${failures} online checks failed`);
}

console.log(`${count} tests passed`);
if (process.argv.includes('--online')) online().catch(e => { console.error(e.message); process.exitCode = 1; });
