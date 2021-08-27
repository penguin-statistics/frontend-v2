const fs = require('fs')

const packageJson = fs.readFileSync('package.json')
const pkg = JSON.parse(packageJson.toString())
if (!pkg['version']) {
  console.error('ERR: version not found in package.json')
  process.exit(-1)
}
console.log(pkg['version'])
process.exit(0)
