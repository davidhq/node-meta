    cd Projects
    git clone git@github.com:davidhq/node-util.git
    cd node-util
    npm install
    npm link

    cd Projects
    git clone git@github.com:davidhq/node-meta.git
    cd node-meta
    npm install
    npm link utilities

    alias lib="node ~/Projects/node-meta/lib.js"
    alias libm="node ~/Projects/node-meta/libm.js"
    alias doc="node ~/Projects/node-meta/doc.js"

- go to any npm repo (or directory with many repos) and run `lib` or `libm`
- to filter dependencies by search term: `lib term` / `libm term`
- try `doc node fs` / `doc eth js` / `doc npm superagent` / `doc api nasa` (see `doc.json`)
