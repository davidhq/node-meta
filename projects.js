"use strict"
var fs = require('fs')
var util = require('utilities').util

var GitHub = require("./providers/github")
let github = new GitHub()

class Projects {

  scan(path) {
    return util.scanDirSync(path)
      .filter(dir => this.valid(dir))
      .map(dir => this.info(dir))
  }

  valid(path) {
    return util.fileExists(`${path}/package.json`)
  }

  info(path) {
    if (this.valid(path)) {
      let pkg = JSON.parse(fs.readFileSync(`${path}/package.json`))

      return {
        name: pkg.name,
        path: path,
        dependencies: pkg.dependencies
      }
    }
  }

  depList(project) {
    return project.dependencies ? Object.keys(project.dependencies) : []
  }

  hasDep(project, term) {
    return project.dependencies && this.findDeps(project, term).length > 0
  }

  findDeps(project, term) {
    return util.listSearch(this.depList(project), term)
  }

  depsWithInfo(project, callback) {
    return this.depList(project).map(dep => {
      let pkg = JSON.parse(fs.readFileSync(`${project.path}/node_modules/${dep}/package.json`))
      let repo = github.repoName(pkg['repository']['url'])
      return {
        name: pkg.name,
        description: pkg.description,
        github: `https://github.com/${repo}`,
        homepage: pkg.homepage,
        author: pkg.author, // email, name, url
        npmuser: pkg._npmUser // email, name, url
      }
    })
  }

  depInfo(dep, callback) {
    npmjs.info(dep, (info) => {
      github.repoInfo('visionmedia/superagent', (repo) => {
        info.homepage = repo.homepage
        callback(info)
      })
    })
  }
}

module.exports = Projects
