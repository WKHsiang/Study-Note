const Vue = require('vue')
const express = require('express')
const fs = require('fs')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync('./index.template.html', 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
// vue-server-renderer 将vue实例转变为html
const renderer = require("vue-server-renderer").createBundleRenderer(serverBundle, {
    template,
    clientManifest
})

const server = express()

server.use('/dist', express.static('./dist'))

server.get('/', (req, res) => {
    renderer.renderToString({
        title: 'KHsiang',
        meta: '<meta name=""></meta>'
    }, (err, html) => {
        if (err) {
           return res.status(500).end('Internal Server Error')
        }
        res.setHeader('Content-Type', 'text/html; charset=utf8')
        res.end(html)
    })
})

server.listen(3000, () => {
    console.log('server running at port 3000')
})

// 运行：终端 node server.js | nodemon server.js