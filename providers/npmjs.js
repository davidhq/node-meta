"use strict"
var util = require('utilities').util
var Xray = require('x-ray')
var x = Xray()

class NpmJs {

  info(pkg, callback) {
    let url = `https://www.npmjs.com/package/${pkg}`
    x(url, {
      description: '.package-description',
      links: x('.sidebar .box', ['a@href'])
    })((err, obj) => {
      let github_url = obj.links.filter(link => link.startsWith('https://github.com') && util.countOccurences(link, '/') == 4)[0]
      callback({
        name: pkg,
        description: obj.description,
        github_url: github_url,
        github_repo: github_url.replace('https://github.com/', '')
      })
    })
  }
}

module.exports = NpmJs
