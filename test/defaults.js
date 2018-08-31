'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('defaults', async t => {

   let options = {
      '-w, --watch'(argv) {
         t.ok(true)
      },
      '-a, --async'(argv) {
         t.ok(true)
      },
      '-a -w'(argv) {
         t.deepEqual(['-a', '-w'], argv)
      }
   }

   argvRouter(options, '-a -w')

})