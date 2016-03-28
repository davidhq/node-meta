#!/usr/bin/env node
"use strict"
var colors = require('colors')
var fs = require('fs')
var util = require('davidhq-util').util
var path = require("path");

var Projects = require('./projects')
var projects = new Projects()

// Parse command line options
var program = require('commander');

var pkg = require(path.join(__dirname, 'package.json'));

program
  .version(pkg.version)
  .description("Awesomest npm dependencies analysis tool")
  .option('-p, --path <path>', 'Project(s) on which to run the command')
  .parse(process.argv);

let dep = program.args[0];

function highlightDeps(deps) {
  return deps.map(d => dep && d.toLowerCase().indexOf(dep.toLowerCase()) > -1 ? colors.yellow.bold(d) : colors.yellow(d));
}

function showProject(project, dep) {
  if((dep && projects.hasDep(project, dep)) || !dep) {

    let dir = '';
    if(project.name != project.folder) {
      dir = ` (directory: ${project.folder})`;
    }

    console.log(colors.cyan(`[ ${project.name} ]`) + dir);

    if(project.dependencies) {
      console.log(`Deps: ${highlightDeps(projects.depList(project)).join(', ')}`);

      if(dep) {
        for(let match of projects.findDeps(project, dep)) {
          console.log(colors.yellow.bold(match) + ": " + colors.green(`https://www.npmjs.com/package/${match}`));
        }
      }
    }

    // check for linked npm projects
    let modulesPath = `${project.path}/node_modules`;
    if(util.isDirectory(modulesPath)) {
      fs.readdir(modulesPath, function(err, dirs) {
        for(let dir of dirs) {
          fs.lstat(`${modulesPath}/${dir}`, function(err, stats) { //fs.statSync can't read isSymbolicLink()
            if (err) throw err;
            if (stats.isSymbolicLink()) {
              console.log(colors.red(`<${project.name}> linked package: ${dir}`));
            }
          })
        }
      })
    }

    if(project.bin) {
      console.log();
      let bin = project.bin;
      for (let key in bin) {
        if (bin.hasOwnProperty(key)) {
          console.log("%s -> %s", colors.green(`bin/${key}`), bin[key]);
        }
      }
    }

    console.log();
  }
}

let projecPath = program.path || process.cwd();
let project = projects.info(projecPath);

if(project) {
  showProject(project, dep);
  projects.showDep(projects.projectDepInfoFormat(project.path));
} else {
  for(let project of projects.scan(projecPath)) {
    showProject(project, dep);
  }
}
