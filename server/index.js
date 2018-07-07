const express = require('express')
const next = require('next')
const Promise = require('bluebird')

const dev = process.env.NODE_ENV != 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const fs = require('fs')
const yaml = require('js-yaml');
const flatten = require('lodash.flatten')

const tableResolver = require('./tableResolver')
const routeBuilder = require('./routeBuilder')


async function loadSectionFile(file) {
  const fileName = file.replace('.yaml', '')
  const textContent = fs.readFileSync(`./tables/${file}`, 'utf8')
  const yamlContent = yaml.safeLoad(textContent)
  const resolvedDesc = await tableResolver.resolveSectionDesc(yamlContent)
  return routeBuilder.extractRoutes(resolvedDesc, `/${fileName}`)
}

async function loadRoutes() {
  const sectionsFiles = fs.readdirSync('./tables')
  const routes = await Promise.all(sectionsFiles.map(loadSectionFile))
  return flatten(routes)
}

Promise.all([loadRoutes(), app.prepare()])
.then(([routes, _]) => {
  const server = express()

  for (const route of routes) {
    server.get(route.route, (req, res) => {
      app.render(req, res, route.page, route.params)
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
