var fs = require('fs');
var pth = require('path');
var colors = require('colors');

var util = require('./utilities');

var GitHub = require('./providers/github');
let github = new GitHub();

class Projects {
  scan(path) {
    return util
      .scanDirSync(path)
      .filter(dir => this.valid(dir))
      .map(dir => this.info(dir));
  }

  valid(path) {
    return util.fileExists(`${path}/package.json`);
  }

  // returns the info for one project
  info(path) {
    if (this.valid(path)) {
      let pkg = JSON.parse(fs.readFileSync(`${path}/package.json`));

      return {
        name: pkg.name,
        folder: pth.basename(path),
        version: pkg.version,
        path: path,
        dependencies: pkg.dependencies,
        bin: pkg.bin
      };
    }
  }

  depList(project) {
    return project.dependencies ? Object.keys(project.dependencies) : [];
  }

  hasDep(project, term) {
    return project.dependencies && this.findDeps(project, term).length > 0;
  }

  findDeps(project, term) {
    return util.listSearch(this.depList(project), term);
  }

  projectDepInfoFormat(projectPath, dep) {
    let pkgFile = `${projectPath}/package.json`;
    if (util.fileExists(pkgFile)) {
      let pkg = JSON.parse(fs.readFileSync(pkgFile));

      let obj = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        homepage: pkg.homepage,
        author: pkg.author, // email, name, url
        npmuser: pkg._npmUser // email, name, url
      };

      if (pkg['repository']) {
        if (pkg['repository']['url']) {
          let repo = github.repoName(pkg['repository']['url']);
          obj.github = `https://github.com/${repo}`;
        } else {
          // "repository": "expressjs/express"
          obj.github = `https://github.com/${pkg['repository']}`;
        }
      } else {
        obj.github = '<missing>';
      }

      return obj;
    } else {
      return {
        missing: true,
        name: dep,
        description: '<missing>',
        github: '<missing>',
        homepage: '<missing>'
      };
    }
  }

  depInfo(projectPath, dep) {
    return this.projectDepInfoFormat(`${projectPath}/node_modules/${dep}`, dep);
  }

  // scans all the dependencies for the project and reads the package.json of each one
  depsWithInfo(project) {
    return this.depList(project).map(function(dep) {
      return Object.assign(this.depInfo(project.path, dep), {
        project: project.name
      });
    }, this);
  }

  // get all unique dependencies across all projects
  // if some project doesn't have node_modules currently but another one has, then dependency info is still gathered from where it can be
  // each dependency has to be present only once across all scanned projects
  depsWithInfoPath(path) {
    let depProjects = {};

    let list = this.scan(path).reduce(
      (deps, project) =>
        deps.concat(
          this.depsWithInfo(project).filter(dep => {
            if (!depProjects[dep.name]) {
              depProjects[dep.name] = [];
            }
            depProjects[dep.name] = depProjects[dep.name].concat(dep.project);
            let match = deps.find(d => d.name == dep.name);
            return !match || match.missing;
          })
        ),
      []
    );

    // remove missing but only if they are not the only occurence
    let condition = dep => dep.missing && list.filter(d => d.name == dep.name && !d.missing).length > 0;
    return list.filter(dep => !condition(dep)).map(dep => Object.assign(dep, { projects: depProjects[dep.name].sort() }));
  }

  showDep(dep) {
    console.log(colors.yellow(`${dep.name} >>> `) + colors.green(dep.description));
    if (dep.github) {
      console.log('GitHub: ' + colors.cyan(dep.github));
    }
    if (dep.homepage) {
      console.log('Homepage: ' + colors.cyan(dep.homepage));
    }
    console.log('Version: ' + colors.green(dep.version));
    if (dep.projects) {
      console.log('Projects: ' + colors.yellow(dep.projects.join(', ')));
    }
    //if(dep.author) console.log('Author: ' + nameEmail(dep.author.name, dep.author.email))
    //console.log('Npm User: ' + nameEmail(dep.npmuser.name, dep.npmuser.email))
    console.log();
  }
}

module.exports = Projects;
