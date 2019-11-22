/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('pkg')

const SERVER_ENTRYPOINT = '../build/main.js'
const TARGET = 'node12-win-x64'
const PKG_OUTPUT = './dist/foobar2000-web-ui.exe'

exec([SERVER_ENTRYPOINT, '--target', TARGET, '--output', PKG_OUTPUT])
    .then(() => console.info('✅ .exe built!'))
    .catch(console.error)
