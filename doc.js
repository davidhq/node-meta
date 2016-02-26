"use strict"
var open = require('open')
let docs = require('utilities').config.load('./doc.json')

let args = process.argv.slice(2)

let platform = args[0]
let term = args[1]
let url = ''

if(platform == 'node') {
  url = "https://nodejs.org/api"
  if(term) url = `${url}/${term}.html`
}

if(platform == 'eth') {
  url = term ? docs.ethereum[term] : docs.ethereum['main']
}

if(platform == 'npm' && term) {
  var Projects = require('./projects')
  var projects = new Projects()

  let path = process.cwd()
  let project = projects.info(path)

  let deps = project ? projects.depsWithInfo(project) : projects.depsWithInfoPath(path)

  let dep = deps.find(dep => dep.name == term)

  if(dep) {
    open(dep.github)
  } else {
    var NpmJs = require("./providers/npmjs")
    let npmjs = new NpmJs()

    npmjs.info(term, function(info) {
      open(info.github_url)
    })
  }
}

if(url) open(url)
