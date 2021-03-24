/*
Copyright © 2021 The Sage Group plc or its licensors. All Rights reserved
 */
const path = require('path')
const fs = require('fs-extra')
const pick = require('./_utils/pick')
const filename = require('./_utils/filename')
const globAsync = require('./_utils/globAsync')
const tsc = require('node-typescript-compiler')

async function copyAssets () {
  try {
    await fs.copy(
      path.resolve(__dirname, '../assets'),
      path.resolve(__dirname, '../dist/assets')
    )
  } catch (err) {
    console.log('Error copying assets to dist')
    console.log(err)
  };
}

async function copyCommon () {
  try {
    await fs.copy(
      path.resolve(__dirname, '../common'),
      path.resolve(__dirname, '../dist/common')
    )
  } catch (err) {
    console.log('Error copying common to dist')
    console.log(err)
  }
}

async function copyPackageJSON () {
  try {
    const packageDef = await fs.readJson(path.resolve(__dirname, '../package.json'))
    const filteredPackageDef = pick(
      packageDef,
      ['name', 'dependencies', 'repository', 'private', 'description', 'author', 'version', 'peerDependencies', 'license', 'tags']
    )
    await fs.writeJson(
      path.resolve(__dirname, '../dist/package.json'),
      filteredPackageDef,
      {
        spaces: 4
      }
    )
  } catch (err) {
    console.log('Error copying package.json')
    console.log(err)
  }
}

async function copyData () {
  try {
    await fs.copy(
      path.resolve(__dirname, '../data'),
      path.resolve(__dirname, '../dist/data')
    )
  } catch (err) {
    console.log('Error copying data to dist')
    console.log(err)
  };
}

async function generateTSDefinitions () {
  await tsc.compile({
    project: path.resolve(__dirname, '../tsconfig.json')
  })
}

async function addEntryFile () {
  const jsFiles = await globAsync('dist/js/*.js')
  const entryFilePath = path.resolve(__dirname, '../dist/index.js')

  const fileExports = jsFiles
    .map(filename)
    .map((name) => {
      return `export * as ${name.toUpperCase()} from './js/${name}'`
    }).join('\n')
  await fs.writeFile(entryFilePath, '\n' + fileExports + '\n')
}

async function addFileHeader () {
  const files = await globAsync('dist/**/*.@(js|css|ts|d.ts|scss|less)')
  await files.forEach(async (file) => {
    try {
      const filePath = path.resolve(__dirname, '../', file)

      const data = fs.readFileSync(filePath)
      const fd = fs.openSync(filePath, 'w+')
      const buffer = Buffer.from('/*\nCopyright © 2021 The Sage Group plc or its licensors. All Rights reserved\n */\n')

      fs.writeSync(fd, buffer, 0, buffer.length, 0)
      fs.writeSync(fd, data, 0, data.length, buffer.length)
      fs.close(fd)
    } catch (er) {
      console.error(`Error adding header to ${file}`, er)
    }
  })
}

async function main () {
  await Promise.all([
    copyAssets(),
    copyCommon(),
    copyPackageJSON(),
    copyData()
  ])
  await addEntryFile()
  await generateTSDefinitions()
  addFileHeader()
}

main()
