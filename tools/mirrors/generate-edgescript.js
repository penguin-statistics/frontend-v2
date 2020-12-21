// Generates EdgeScript for CN mirror Aliyun using the opensearch.xml under /public directory

const fs = require("fs")
const path = require("path")

function relativePath(file) {
  return path.join(__dirname, file)
}

function escapeContent(s) {
  return JSON.stringify(s.split("\n").map(el => el.trim()).join(""))
    .replace(/((^")|("$))/g, "")
    .replace(/\\"/g, "\"")
    .replace(/penguin-stats\.io/g, "penguin-stats.cn")
    .trim()
}

const fileContent = fs.readFileSync(relativePath("../../public/opensearch.xml")).toString()

const generated = `# AUTO GENERATED FILE: generate-edgescript.js under this directory generates this file.
# This file is to Open Source the EdgeScript we used on our CN mirror with Aliyun.
#
# You can learn more about the Aliyun EdgeScript at here: https://help.aliyun.com/document_detail/126565.html
# (please note that the EdgeScript documentation is written pretty poorly and testing on the EdgeScript you produce is essential.)

# Delete Cache-Control from upstream which is tuned only for better CDN-side cache
if match_re($uri, '^/PenguinStats') {
  del_rsp_header('Cache-Control')
  add_rsp_header('Cache-Control', 'no-cache')
}

# Echo the /opensearch.xml file which:
#   - Requires to have origin hostname in it but we've got different mirrors, so separated file is needed for each mirror
#   - We don't want to add extra server load since this is just unnecessary
if match_re($uri, '^/opensearch\\.xml$') {
  add_rsp_header('Content-Type', 'application/opensearchdescription+xml')
  add_rsp_header('Cache-Control', 'private')
  exit(200, '${escapeContent(fileContent)}')
}`

fs.writeFileSync(relativePath("cn-edgescript.edgescript"), generated)