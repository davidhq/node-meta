"use strict"
var request = require('superagent')

class Connection {

  constructor(api_base) {
    this.api_base = api_base
  }

  get(path, options, callback) {
    request
      .get(`${this.api_base}/${path}`)
      .send(options)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (res.ok) {
          callback(res.body)
        } else {
          console.log('Oh no! error ' + res.text)
        }
      })
  }
}

module.exports = Connection
