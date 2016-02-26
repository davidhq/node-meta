import test from 'ava'

test('github', t => {
  var GitHub = require("./providers/github")
  let github = new GitHub()

  t.is(github.repoName("https://github.com/davidhq/cryptonite"), "davidhq/cryptonite")
  t.is(github.repoName("https://GitHub.com/davidhq/cryptonite"), "davidhq/cryptonite")
  t.is(github.repoName("https://github.com/visionmedia/superagent#readme"), "visionmedia/superagent")
  t.is(github.repoName("git+ssh://git@github.com/Marak/colors.js.git"), "Marak/colors.js")
})
