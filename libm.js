"use strict"
var colors = require('colors')
var fs = require('fs')
var util = require('davidhq-util').util

var NpmJs = require("./providers/npmjs")
let npmjs = new NpmJs()

var Projects = require('./projects')
var projects = new Projects()

function nameEmail(name, email) {
  return email ? `${name} <${email}>` : name
}

let args = process.argv.slice(2)
let filter = args[0]

let path = process.cwd()
let project = projects.info(path)

let deps = project ? projects.depsWithInfo(project) : projects.depsWithInfoPath(path)
deps = util.arraySortByKey(deps, 'name')

util.asyncMap(deps, function(dep, callback) {
  if(dep.missing) {
    npmjs.info(dep.name, callback)
  } else {
    callback(dep)
  }
}).then(deps => {
  for(let dep of deps) {
    if(!filter || (filter && util.cointainsStringInsensitive(dep.name, filter))) {
      projects.showDep(dep)
    }
  }
}).catch(error => {
  console.log(error)
})
