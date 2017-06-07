'use strict';
var test = require('tape');

test('github parsing repo from url', function(t) {
  t.plan(4);

  var GitHub = require('./providers/github');
  let github = new GitHub();

  t.equal(github.repoName('https://github.com/davidhq/cryptonite'), 'davidhq/cryptonite');
  t.equal(github.repoName('https://GitHub.com/davidhq/cryptonite'), 'davidhq/cryptonite');
  t.equal(github.repoName('https://github.com/visionmedia/superagent#readme'), 'visionmedia/superagent');
  t.equal(github.repoName('git+ssh://git@github.com/Marak/colors.js.git'), 'Marak/colors.js');
});
