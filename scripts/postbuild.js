/*
Copyright © 2024 The Sage Group plc or its licensors. All Rights reserved
 */
const { resolve } = require('path')
const {
  readJsonSync,
  outputJsonSync,
  copySync,
  outputFileSync,
  readFileSync
} = require('fs-extra')
const pick = require('lodash/pick')
const camelCase = require('lodash/camelCase')
const glob = require('glob').sync

const filename = require('./utils/filename')
const headerContents = require('./utils/file-header')

function copyPackageJSON () {
  try {
    const packageDef = readJsonSync(resolve(__dirname, '../package.json'))
    const filteredPackageDef = pick(
      packageDef,
      ['name', 'dependencies', 'repository', 'description', 'author', 'version', 'peerDependencies', 'license', 'tags']
    )

    filteredPackageDef.private = false

    // Writes to package.json in dist
    outputJsonSync(
      resolve(__dirname, '../dist/package.json'),
      filteredPackageDef,
      {
        spaces: 2
      }
    )
  } catch (err) {
    console.log('Error copying package.json')
    console.log(err)
  }
}

function copyReadme () {
  try {
    copySync(
      resolve(__dirname, '../README.md'),
      resolve(__dirname, '../dist/README.md')
    )
  } catch (err) {
    console.log('Error copying readme to dist')
    console.log(err)
  }
}

function addEntryFile () {
  const jsFilePaths = glob('./dist/js/*/{base,global}/*.js')
  const jsComponentPaths = glob('./dist/js/*/*/components/*/*.js')
  const entryFilePath = resolve(__dirname, '../dist/index.js')

  const fileExports = jsFilePaths
    .map((filePath) => {
      const [mode, theme, type, fullName] = filePath.split('/').slice(-4)
      const name = filename(fullName)
      return {
        mode,
        theme,
        type,
        name
      }
    })
    .map((file) => {
      const exportName = camelCase(`${file.mode} ${file.theme} ${file.type} ${file.name}`)
      return `export * as ${exportName} from './js/${file.mode}/${file.theme}/${file.type}/${file.name}'`
    }).join('\n')
  const componentExports = jsComponentPaths
    .map((filePath) => {
      const [mode, theme, components, component, fullName] = filePath.split('/').slice(-5)
      const name = filename(fullName)
      return {
        mode,
        theme,
        components,
        component,
        name
      }
    })
    .map((file) => {
      const exportName = camelCase(`${file.mode} ${file.theme} ${file.component} ${file.name}`)
      return `export * as ${exportName} from './js/${file.mode}/${file.theme}/${file.component}/${file.name}'`
    }).join('\n')
  outputFileSync(entryFilePath, '\n' + fileExports + '\r\n\r\n' + componentExports + '\n')
}

function addFileHeader () {
  const files = glob('dist/**/*.@(css|js|ts|d.ts|scss|less)')
  files.forEach((file) => {
    try {
      const filePath = resolve(__dirname, '../', file)
      const outputData = headerContents(filename(filePath), file) + '\r\n\r\n' + readFileSync(filePath)

      outputFileSync(filePath, outputData)
    } catch (er) {
      console.error(`Error adding header to ${file}`, er)
    }
  })
}

function copyAssets () {
  try {
    copySync(
      resolve(__dirname, '../assets'),
      resolve(__dirname, '../dist/assets/')
    )
  } catch (err) {
    console.log('Error copying assets to dist')
    console.log(err)
  }
}

async function main () {
  copyPackageJSON()
  copyReadme()
  copyAssets()
  addEntryFile()
  addFileHeader()
  await require('./icons')
}

main()
