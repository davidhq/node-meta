var test = require('tape');
var util = require('../utilities');

test('utilities', function (t) {
  t.plan(5)

  t.true(util.listSearch(['aaa', 'bbb', 'ccc'], 'BB').length == 1)

  t.deepEqual(util.arraySortByKey([ { name: 'b' }, { name: 'z' }, { name: 'a' } ], 'name'), [ { name: 'a' }, { name: 'b' }, { name: 'z' } ])
  t.deepEqual(util.arraySortByKey([ { name: 'b' }, { }, { name: 'a' } ], 'name'), [ { name: 'a' }, { name: 'b' }, { } ])
  t.deepEqual(util.arraySortByKey([ { name: 2 }, { name: 1000 }, { name: 1 } ], 'name', true), [ { name: 1 }, { name: 2 }, { name: 1000 } ])
  t.deepEqual(util.arraySortByKey([ { name: 2 }, { }, { name: 1 } ], 'name', true), [ { name: 1 }, { name: 2 }, { } ])
})
