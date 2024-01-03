/*
Copyright © 2024 The Sage Group plc or its licensors. All Rights reserved
 */

/**
 * Gets the filename for a file
 *
 * @param {string} filePath - the path to the file
 *
 * @returns {string}
 */
const { extname, basename } = require('path')

module.exports = (filePath) => {
  const extension = extname(filePath)
  return basename(filePath, extension)
}
