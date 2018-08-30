'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('defaults', async t => {

   let options = {
      '-v, --version'(argv) {
         t.ok(false)
      },
      '-w, --watch'(argv) {
         t.ok(true)
      },
      '-a, --async'(argv) {
         t.ok(true)
      },
      '-a -w'(argv) {
         t.ok(false)
      },
      '*.js'(argv) {
         t.ok(false)
      }
   }

   argvRouter(options, '-a')

})