"use strict"
var fs = require('fs')
var util = require('utilities').util

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
}

module.exports = Projects
