/*
Copyright © 2021 The Sage Group plc or its licensors. All Rights reserved
 */
const DIST = 'dist'
const CHANGELOG = 'docs/CHANGELOG.md'

module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: CHANGELOG
      }
    ],
    [
      '@semantic-release/npm',
      {
        changelogFile: CHANGELOG,
        pkgRoot: DIST,
        tarballDir: DIST
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [CHANGELOG]
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: `${DIST}/*.tgz`
      }
    ]
  ],
  dryRun: false,
  debug: false
}
