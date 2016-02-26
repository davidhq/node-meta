"use strict"
var colors = require('colors')
var fs = require('fs')
var util = require('utilities').util

var Projects = require('./projects')
var projects = new Projects()

let args = process.argv.slice(2)
let dep = args[0]

function showProject(project, dep) {
  if((dep && projects.hasDep(project, dep)) || !dep) {

    let dir = ''
    if(project.name != project.folder) {
      dir = ` (directory: ${project.folder})`
    }

    console.log(colors.cyan(`<${project.name}>`) + dir)

    if (project.dependencies) {
      console.log(`${colors.yellow(projects.depList(project).join(', '))}`)

      if(dep) {
        for(let match of projects.findDeps(project, dep)) {
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
}

let path = process.cwd()
let project = projects.info(path)

if(project) {
  showProject(project, dep)
} else {
  for(let project of projects.scan(path)) {
    showProject(project, dep)
  }
}
