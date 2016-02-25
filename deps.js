"use strict"
var colors = require('colors')
var fs = require('fs')
var util = require('utilities').util
var Projects = require('./projects')

let args = process.argv.slice(2)
let dep = args[0]

let project = new Projects().info(process.cwd())

function hasDep(project, dep) {
  if(project.dependencies) {
    let deps = Object.keys(project.dependencies)
    return !!deps.find(d => d.toLowerCase().indexOf(dep.toLowerCase()) > -1)
  }
}

function showProject(project) {
  let path = process.cwd()

  console.log(colors.cyan(`<${project.name}>`))

  if (project.dependencies) {
    let deps = Object.keys(project.dependencies)
    console.log(`${colors.yellow(deps.join(', '))}`)

    if(dep) {
      for(let match of deps.filter(d => d.toLowerCase().indexOf(dep.toLowerCase()) > -1)) {
        console.log(colors.green(`https://www.npmjs.com/package/${match}`))
      }
    }
  }

  // check for linked npm projects
  let modulesPath = `${project.path}/node_modules`
  if(util.isDirectory(modulesPath)) {
    fs.readdir(modulesPath, function(err, dirs) {
      for(let dir of dirs) {
        fs.lstat(`${modulesPath}/${dir}`, function(err, stats) { //fs.statSync can't read isSymbolicLink()
          if (err) throw err;
          if (stats.isSymbolicLink()) {
            console.log(colors.red(`<${project.name}> linked package: ${dir}`))
          }
        })
      }
    })
  }

  console.log("")
}

if(project) {
  showProject(project)
} else {
  let projects = new Projects().scan(process.cwd())
  if(projects.length) {
    for(let project of projects) {
      if((dep && hasDep(project, dep)) || !dep) {
        showProject(project)
      }
    }
  }
}
