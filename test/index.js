'use strict';

const test = require('jtf');
const argvRouter = require('..')

test.skip('index', async t => {

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
      '-s, --sync'(argv) {
         t.ok(true)
      },
      '-a -w'(argv) {
         t.ok(false)
      },
      '-a -s'(argv) {
         t.ok(true)
      },
      '*.js'(argv) {
         t.ok(false)
      }
   }

   let router = argvRouter(options, '-w')

   router.execute('-a')

})