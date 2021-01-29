const fs = require('fs')
const path = require('path')

const CONTRACT_PATH = path.resolve(__dirname, '../dist/koi.js')

trim(CONTRACT_PATH)

function trim (path) {
  let contractSrc = fs.readFileSync(path, 'utf8')

  contractSrc = contractSrc.replace('Object.defineProperty(exports, \'__esModule\', { value: true });', '')
  contractSrc = contractSrc.replace('exports.handle = handle;', '')

  fs.writeFileSync(path, contractSrc)
}