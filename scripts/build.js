/*
Copyright © 2021 The Sage Group plc or its licensors. All Rights reserved
 */

const { readdirSync } = require('fs-extra')
const { dictionary, groups } = require('./style-dictionary')

const platforms = readdirSync('./data/tokens/Platforms/')
const modes = readdirSync('./data/tokens/Modes/')

const getSplit = (modeName, format, subType, suffix) => {
  return [
    {
      destination: `${subType}${modeName}/all.${suffix}`,
      format: format
    },
    {
      destination: `${subType}${modeName}/color.${suffix}`,
      filter: (token) => token.type === 'color' && token.path.indexOf('origin') === -1,
      format: format
    },
    {
      destination: `${subType}${modeName}/borders.${suffix}`,
      filter: (token) => (token.type === 'borderRadius' || token.type === 'borderWidth') && token.path.indexOf('origin') === -1,
      format: format
    },
    {
      destination: `${subType}${modeName}/shadows.${suffix}`,
      filter: (token) => token.type === 'boxShadow' && token.path.indexOf('origin') === -1,
      format: format
    },
    {
      destination: `${subType}${modeName}/sizing.${suffix}`,
      filter: (token) => token.type === 'sizing' && token.path.indexOf('origin') === -1,
      format: format
    },
    {
      destination: `${subType}${modeName}/spacing.${suffix}`,
      filter: (token) => token.type === 'spacing' && token.path.indexOf('origin') === -1,
      format: format
    },
    {
      destination: `${subType}${modeName}/typography.${suffix}`,
      filter: (token) => token.type === 'typography' && token.path.indexOf('origin') === -1,
      format: format
    }
  ]
}

const getConfig = (platform, mode) => {
  const modeName = mode.split('.json')[0]

  return {
    source: [
      './data/tokens/origin.json',
      './data/tokens/Global/*.json',
      `./data/tokens/Modes/${mode}`,
      './data/tokens/Components/*.json',
      `./data/tokens/Platforms/${platform}/*.json`
    ],
    platforms: {
      web: {
        buildPath: 'dist/web/',
        transforms: groups.web,
        files: [
          ...getSplit(modeName, 'javascript/module-flat', 'js/common/', 'js'),
          ...getSplit(modeName, 'custom/js/es6-module-flat', 'js/es6/', 'js'),
          ...getSplit(modeName, 'css/variables', 'css/', 'css'),
          ...getSplit(modeName, 'scss/variables', 'scss/', 'scss')
        ]
      },
      android: {
        buildPath: 'dist/android/',
        transforms: groups.mobile,
        files: [
          ...getSplit(modeName, 'android/resources', '', 'xml')
        ]
      },
      ios: {
        buildPath: 'dist/ios/',
        transforms: groups.mobile,
        files: [
          ...getSplit(modeName, 'ios/macros', '', 'h')
        ]
      }
    }
  }
}

platforms.forEach((platform) => {
  modes.forEach((mode) => {
    console.log(`\r\nBuilding platform: ${platform} \r\nBuilding mode: ${mode}`)

    const StyleDictionary = dictionary.extend(getConfig(platform, mode))

    if (platform === 'small-viewports') {
      StyleDictionary.buildPlatform('web')
    } else if (platform === 'IOS') {
      StyleDictionary.buildPlatform('ios')
    } else if (platform === 'android') {
      StyleDictionary.buildPlatform('android')
    }

    console.log('\r\nDone.\r\n')
  })
})
