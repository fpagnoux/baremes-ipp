const express = require('express')
const next = require('next')

const loader = require('./loader')

const dev = process.env.NODE_ENV != 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


Promise.all([loader.loadRoutes(), app.prepare()])
.then(([routes, _]) => {
  const server = express()

  for (const route of routes) {
    server.get(route.route, (req, res) => {
      app.render(req, res, route.page, route.query)
    })
  }

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
