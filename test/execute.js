'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('execute', async t => {

   let router = argvRouter({
      '-w, --watch'(argv) {
         t.deepEqual(['-w'], argv)
      },
      '-a, --async'(argv) {
         t.deepEqual(['-a'], argv)
      },
      '-s, --sync'(argv) {
         t.deepEqual(['-s'], argv)
      },
      '-a -w'(argv) {
         t.deepEqual(['-a', '-w'], argv)
      },
      '-a -s'(argv) {
         t.deepEqual(['-a', '-s'], argv)
      },
      '-a -s -w -g'(argv) {
         t.ok(true)
      },
      '*.js'(argv) {
         console.log(argv)
         t.ok(true)
      },
      '*.js -w'(argv) {
         console.log(argv)
         t.ok(true)
      },
      '*.js -a'(argv) {
         console.log(argv)
         t.ok(true)
      },
      '-n <user>'(argv) {
         console.log(argv)
         t.ok(true)
      },
      'sd'(argv) {
         console.log(argv)
         t.ok(true)
      }
   })

   router.execute('-v')

   router.execute('-watch')

   router.execute('-a')

   router.execute('-a -w')

   router.execute('-a -s -w -g')

   router.execute('12*3.js -w')

   router.execute('tj.js -w')

   router.execute('12*3.js -a')

})