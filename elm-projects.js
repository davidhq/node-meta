'use strict';
var fs = require('fs');
var pth = require('path');
var util = require('davidhq-util').util;
var colors = require('colors');

class ElmProjects {
  // scan(path) {
  //   return util.scanDirSync(path)
  //     .filter(dir => this.valid(dir))
  //     .map(dir => this.info(dir))
  // }

  valid(path) {
    return util.fileExists(`${path}/elm-package.json`);
    //return util.fileExists(`${path}/elm-stuff/exact-dependencies.json`)
  }

  // returns the info for one project
  info(path) {
    if (this.valid(path)) {
      let pkg = require(`${path}/elm-package.json`);
      return pkg;
    }
  }

  exactDeps(path) {
    return new Promise((s, r) => {
      let exactDepsPath = `${path}/elm-stuff/exact-dependencies.json`;
      if (util.fileExists(exactDepsPath)) {
        s(require(exactDepsPath));
      } else {
        r('Run "elm package install" first');
      }
    });
  }

  exactDepsFullInfo(path) {
    if (this.valid(path)) {
      return new Promise((s, r) => {
        let info = this.info(path);
        this.exactDeps(path)
          .then(projectInfo => {
            s(
              Object.keys(projectInfo).map(dep => {
                let depPkg = require(`${path}/elm-stuff/packages/${dep}/${projectInfo[dep]}/elm-package.json`);
                let original = !!Object.keys(info.dependencies).find(d => d == dep);
                return {
                  name: dep,
                  original: original,
                  version: projectInfo[dep],
                  summary: depPkg.summary
                };
              })
            );
          })
          .catch(e => r(e));
      });
    }
  }
}

module.exports = ElmProjects;
