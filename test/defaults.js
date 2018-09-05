'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('defaults', async t => {

   let options = {
      '-w, --watch'(argv) {
         t.ok(false)
      },
      '-a, --async'(argv) {
         t.ok(false)
      },
      '-a -w'(argv) {
         t.deepEqual({
            '-a': null,
            '--async': null,
            '-w': null,
            '--watch': null
         }, argv)
      }
   }

   argvRouter(options, '-a -w')

})