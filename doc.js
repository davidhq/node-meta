"use strict"
var open = require('open')
var fs = require('fs')
let util = require('utilities').util
let docs = require('utilities').config.load(__dirname + '/doc.json')
var colors = require('colors')

let args = process.argv.slice(2)

let platform = args[0]
let term = args[1]
let url = ''

function listDocs(data) {
  for(let name in data) {
    let url = data[name]
    if(Array.isArray(data[name])) {
      url = data[name].join(', ')
    }
    console.log(colors.yellow(name) + ` ${url}`)
  }
}

function findShortestMatch(data, term) {
  if(data && term) {
    let matches = Object.keys(data).filter(name => util.cointainsStringInsensitive(name, term))
    if(matches) {
      return matches.sort((a, b) => a.length - b.length)[0]
    }
  }
}

function handleNpm(term) {
  var Projects = require('./projects')
  var projects = new Projects()

  let path = process.cwd()
  let project = projects.info(path)

  let deps = project ? projects.depsWithInfo(project) : projects.depsWithInfoPath(path)

  let dep = deps.find(dep => dep.name == term)

  if(dep) {
    open(dep.github)
  } else {
    var NpmJs = require("./providers/npmjs")
    let npmjs = new NpmJs()

    npmjs.info(term, function(info) {
      open(info.github)
    })
  }
}

switch(platform) {

  case 'node':
    url = "https://nodejs.org/api"
    if(term) {
      url = `${url}/${term}.html`
    }
    break

  case 'npm':
    if(term) {
      handleNpm(term)
    }
    break

  default:
    if(term) {
      if(docs[platform]) {
        let match = findShortestMatch(docs[platform], term)

        if(match) {
          let urls = docs[platform][match]

          if(Array.isArray(urls)) { // multiple urls
            for(let u of urls) {
              console.log(colors.yellow(u))
            }
          } else {
            url = urls
          }
        }
      } else {
        //console.log(platform)
        //handleNpm(platform)
        console.log(colors.red(`No key "${platform}" in docs.json`))
      }
    } else {
      if(util.isString(docs[platform])) {
        url = docs[platform]
      } else if(docs[platform]) {
        listDocs(docs[platform])
      } else {
        handleNpm(platform)
      }
    }

}

if(url) open(url)
