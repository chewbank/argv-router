'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('index', async t => {

   let options = {
      '-v, --version'(argv) {
         t.deepEqual(['--version'], argv)
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
         t.ok(true)
      },
      '-a -s'(argv) {
         t.ok(true)
      }
   }

   let router = argvRouter(options)

   router.execute('-a')

   router.execute('--version')

})