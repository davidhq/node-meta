"use strict"
var colors = require('colors')
var fs = require('fs')
var util = require('utilities').util

var Projects = require('./projects')
var projects = new Projects()

let args = process.argv.slice(2)
let filter = args[0]

let path = process.cwd()
let project = projects.info(path)

function nameEmail(name, email) {
  return email ? `${name} <${email}>` : name
}

let deps = project ?
  projects.depsWithInfo(project) :
  // get all unique dependencies across all projects
  projects.scan(path).reduce((deps, project) => deps.concat(projects.depsWithInfo(project).filter(dep => !deps.find(dep2 => dep.name == dep2.name))), [])

for(let dep of util.arraySortByKey(deps, 'name')) {
  if(!filter || (filter && dep.name.toLowerCase().indexOf(filter.toLowerCase())) > -1) {
    console.log(colors.yellow(`${dep.name} >>> `) + colors.green(dep.description))
    console.log('GitHub: ' + colors.cyan(dep.github))
    console.log('Homepage: ' + colors.cyan(dep.homepage))
    //if(dep.author) console.log('Author: ' + nameEmail(dep.author.name, dep.author.email))
    //console.log('Npm User: ' + nameEmail(dep.npmuser.name, dep.npmuser.email))
    console.log()
  }
}
