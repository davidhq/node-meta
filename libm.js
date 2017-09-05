#!/usr/bin/env node
var colors = require('colors');
var fs = require('fs');
var util = require('./utilities');
var path = require('path');

var npmjs = require('./providers/npmjs');

var Projects = require('./projects');
var projects = new Projects();

// Parse command line options
var program = require('commander');

var pkg = require(path.join(__dirname, 'package.json'));

program
  .version(pkg.version)
  .description('Awesomest npm dependencies analysis tool')
  .option('-p, --path <path>', 'Project(s) on which to run the command')
  .parse(process.argv);

function nameEmail(name, email) {
  return email ? `${name} <${email}>` : name;
}

let filter = program.args[0];

let projecPath = program.path || process.cwd();
let project = projects.info(projecPath);

let deps = project ? projects.depsWithInfo(project) : projects.depsWithInfoPath(projecPath);
deps = util.arraySortByKey(deps, 'name');

util
  .asyncMap(deps, function(dep, callback) {
    if (dep.missing) {
      npmjs.info(dep.name, info => callback(Object.assign(info, { projects: dep.projects })));
    } else {
      callback(dep);
    }
  })
  .then(deps => {
    for (let dep of deps) {
      if (!filter || (filter && util.cointainsStringInsensitive(dep.name, filter))) {
        projects.showDep(dep);
      }
    }
  })
  .catch(error => {
    console.log(error);
  });
