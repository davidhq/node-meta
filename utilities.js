"use strict"
var fs = require('fs')
var colors = require('colors')

class Utilities {

  testing() {
    global.testing = true
  }

  isTesting() {
    return process.env.NODE_ENV == "test" || process.env.TESTING || global.testing || this.fileExists(`${process.cwd()}/.testing`)
  }

  debug() {
    return process.env.DEBUG || this.fileExists(`${process.cwd()}/.debug`)
  }

  log(msg) {
    if(this.debug()) {
      console.log(colors.yellow(msg))
    }
  }

  listFindShortestMatch(array, term) {
    if(array && term) {
      let matches = array.filter(el => this.cointainsStringInsensitive(el, term))
      if(matches) {
        return matches.sort((a, b) => a.length - b.length)[0]
      }
    }
  }

  isString(s) {
    return typeof(s) === 'string' || s instanceof String
  }

  // todo: JSDOC
  arraySortByKey(array, key, num) {
    let maxVal = num ? Number.MAX_VALUE : "zzzzzzzzzzzzzz"
    return array.sort((a, b) => {
      let x = a[key] || maxVal
      let y = b[key] || maxVal
      return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    })
  }

  arrayUnique(arr) {
    return [...new Set( arr )];
  }

  /* USAGE:
     function double(num, callback) { callback(2 * num) }
     util.asyncMap([1,2,3], double).then(xs => console.log(xs))
  */
  asyncMap(arr, f) {
    // use Promise.prototype.catch otherwise exceptions are swallowed
    // after the last .then make a .catch
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
    return Promise.all(arr.map(v => new Promise((s, r) => f(v, s))))
  }

  cointainsStringInsensitive(str, term) {
    if(str && term) {
      return str.toLowerCase().indexOf(term.toLowerCase()) > -1
    }
  }

  listSearch(list, term) {
    return list.filter(el => this.cointainsStringInsensitive(el, term))
  }

  countOccurences(str, char) {
    return str.split(char).length - 1
  }

  isDirectory(path) {
    try
    {
        return fs.lstatSync(path).isDirectory()
    }
    catch (err)
    {
        return false
    }
  }

  fileExists(filePath)
  {
      // what about fs.existsSync("index.js") ?
      // modern:
      // if(fs.existsSync(path)) {
      //   // Do something
      // }
      try
      {
          return fs.statSync(filePath).isFile()
      }
      catch (err)
      {
          return false
      }
  }

  scanDir(path, callback) {
    fs.readdirSync(path).map(file => `${path}/${file}`).forEach(path => callback(path))
  }

  // like readdirSync but it returns the full path instead of just file/folder names
  scanDirSync(path) {
    return fs.readdirSync(path).map(file => `${path}/${file}`)
  }

}

module.exports = new Utilities()
