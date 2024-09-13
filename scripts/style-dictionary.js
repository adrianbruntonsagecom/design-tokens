/*
Copyright © 2024 The Sage Group plc or its licensors. All Rights reserved
 */

const styleDictionary = require('style-dictionary')
const { registerTransforms } = require('@tokens-studio/sd-transforms')

const groups = {
  css: [
    'name/cti/kebab',
    'ts/descriptionToComment',
    'ts/size/px',
    'ts/opacity',
    'ts/size/lineheight',
    'ts/typography/fontWeight',
    'ts/resolveMath',
    'ts/size/css/letterspacing',
    'ts/typography/css/shorthand',
    'ts/border/css/shorthand',
    'ts/shadow/css/shorthand',
    'ts/color/modifiers'
  ],
  scss: [
    'name/cti/kebab',
    'ts/descriptionToComment',
    'ts/size/px',
    'ts/opacity',
    'ts/size/lineheight',
    'ts/typography/fontWeight',
    'ts/resolveMath',
    'ts/size/css/letterspacing',
    'ts/typography/css/shorthand',
    'ts/border/css/shorthand',
    'ts/shadow/css/shorthand',
    'ts/color/modifiers'
  ],
  js: [
    'name/cti/camel',
    'ts/descriptionToComment',
    'ts/size/px',
    'ts/opacity',
    'ts/size/lineheight',
    'ts/typography/fontWeight',
    'ts/resolveMath',
    'ts/size/css/letterspacing',
    'ts/typography/css/shorthand',
    'ts/border/css/shorthand',
    'ts/shadow/css/shorthand',
    'ts/color/modifiers'
  ],
  json: [
    'name/cti/camel',
    'ts/descriptionToComment',
    'ts/size/px',
    'ts/opacity',
    'ts/size/lineheight',
    'ts/typography/fontWeight',
    'ts/resolveMath',
    'ts/size/css/letterspacing',
    'ts/typography/css/shorthand',
    'ts/border/css/shorthand',
    'ts/shadow/css/shorthand',
    'ts/color/modifiers'
  ],
  mobile: [
    'name/cti/camel',
    'ts/descriptionToComment',
    'ts/size/px',
    'ts/opacity',
    'ts/size/lineheight',
    'ts/typography/fontWeight',
    'ts/resolveMath',
    'ts/size/css/letterspacing',
    'ts/typography/css/shorthand',
    'ts/border/css/shorthand',
    'ts/shadow/css/shorthand',
    'ts/color/modifiers'
  ]
}

registerTransforms(styleDictionary, {
  'ts/color/modifiers': {
    format: 'hex'
  }
})

module.exports = {
  dictionary: styleDictionary,
  groups
}
