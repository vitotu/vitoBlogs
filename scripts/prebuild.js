const fs = require('fs')

const base = process.env.sourceBase || ''

let config = fs.readFileSync('./docs/.vuepress/config.js', 'utf-8');

config = config.replace(/base: ''/, `base: '${base}'`)

fs.writeFileSync('./docs/.vuepress/config.js', config, 'utf-8')
