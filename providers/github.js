let Connection = require('./lib/connection');

class GitHub {
  constructor() {
    this.conn = new Connection('https://api.github.com');
  }

  repoInfo(repo, callback) {
    this.conn.get(`repos/${repo}`, {}, callback);
  }

  repoName(url) {
    url = url.trim();
    if (url.endsWith('.git')) url = url.slice(0, url.length - 4);
    // git@github.com:documentationjs/documentation.git
    // https://github.com/davidhq/superlib
    let matches = /github.com[\/\:]([\w\.\-_]+)\/([\w\.\-_]+)/i.exec(url);
    if (matches) return `${matches[1]}/${matches[2]}`;
  }
}

module.exports = GitHub;
