/*
Copyright © 2024 The Sage Group plc or its licensors. All Rights reserved
 */

const { readdirSync } = require('fs-extra')
const { dictionary, groups } = require('./style-dictionary')
const filterComponent = require('./utils/filter-component')

// const platforms = readdirSync('./data/tokens/Platforms/')
const components = readdirSync('./data/tokens/Components/')
const modes = readdirSync('./data/tokens/Modes/')

const getFiles = (modeName, format, subType, suffix) => {
  return [
    ...getSplit('base', modeName, format, subType, suffix, false),
    ...getSplit('global', modeName, format, subType, suffix, false),
    ...getComponents(modeName, format, subType, suffix)
  ]
}

const getComponents = (modeName, format, subType, suffix) => {
  const componentArray = []

  components.forEach((component) => {
    componentArray.push(...getSplit(component.split('.')[0], modeName, format, subType, suffix, true))
  })

  return componentArray
}

const getSplit = (componentName, modeName, format, subType, suffix, outputReferences) => {
  const getPath = (componentName) => {
    const path = {
      base: '/base/',
      global: '/global/'
    }
    return path[componentName] || '/components/' + componentName
  }

  const path = getPath(componentName)

  return [
    {
      destination: `${subType}${modeName}${path}/all.${suffix}`,
      filter: (token) => filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    },
    {
      destination: `${subType}${modeName}${path}/color.${suffix}`,
      filter: (token) => token.type === 'color' && filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    },
    {
      destination: `${subType}${modeName}${path}/borderRadius.${suffix}`,
      filter: (token) => token.type === 'borderRadius' && filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    },
    {
      destination: `${subType}${modeName}${path}/borderWidth.${suffix}`,
      filter: (token) => token.type === 'borderWidth' && filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    },
    {
      destination: `${subType}${modeName}${path}/shadow.${suffix}`,
      filter: (token) => token.type === 'boxShadow' && filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    },
    {
      destination: `${subType}${modeName}${path}/sizing.${suffix}`,
      filter: (token) => token.type === 'sizing' && filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    },
    {
      destination: `${subType}${modeName}${path}/spacing.${suffix}`,
      filter: (token) => token.type === 'spacing' && filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    },
    {
      destination: `${subType}${modeName}${path}/typography.${suffix}`,
      filter: (token) => token.type === 'typography' && filterComponent(token, componentName),
      format,
      options: {
        outputReferences
      }
    }
  ]
}

const getConfig = (mode) => {
  const modeName = mode.split('.json')[0]

  return {
    source: [
      './data/tokens/origin.json',
      './data/tokens/global.json',
      `./data/tokens/Modes/${mode}`,
      './data/tokens/Components/*.json'
      // `./data/tokens/Platforms/${platform}/*.json`
    ],
    platforms: {
      css: {
        buildPath: 'dist/css/',
        transforms: groups.css,
        files: [
          ...getFiles(modeName, 'css/variables', '', 'css')
        ]
      },
      scss: {
        buildPath: 'dist/scss/',
        transforms: groups.scss,
        files: [
          ...getFiles(modeName, 'scss/variables', '', 'scss')
        ]
      },
      js: {
        buildPath: 'dist/js/',
        transforms: groups.js,
        files: [
          ...getFiles(modeName, 'javascript/module', 'common/', 'js'),
          ...getFiles(modeName, 'typescript/module-declarations', 'common/', 'd.ts'),
          ...getFiles(modeName, 'javascript/es6', 'es6/', 'js'),
          ...getFiles(modeName, 'typescript/es6-declarations', 'es6/', 'd.ts'),
          ...getFiles(modeName, 'javascript/umd', 'umd/', 'js'),
          ...getFiles(modeName, 'json', 'json/', 'json')
        ]
      },
      android: {
        buildPath: 'dist/android/',
        transforms: groups.mobile,
        files: [
          ...getFiles(modeName, 'android/resources', '', 'xml')
        ]
      },
      ios: {
        buildPath: 'dist/ios/',
        transforms: groups.mobile,
        files: [
          ...getFiles(modeName, 'ios/macros', '', 'h')
        ]
      }
    }
  }
}

modes.forEach((mode) => {
  console.log(`\r\n\r\nBuilding mode: ${mode}`)

  const StyleDictionary = dictionary.extend(getConfig(mode))

  StyleDictionary.buildPlatform('css')
  StyleDictionary.buildPlatform('scss')
  StyleDictionary.buildPlatform('js')
  StyleDictionary.buildPlatform('ios')
  StyleDictionary.buildPlatform('android')

  console.log('\r\nDone.\r\n')
})
