'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('execute', async t => {

   let options = {
      '-v, --version'(argv) {
         t.deepEqual(['-v'], argv)
      },
      '-w, --watch'(argv) {
         t.deepEqual(['-w'], argv)
      },
      '-a, --async'(argv) {
         t.deepEqual(['-a'], argv)
      },
      '-s, --sync'(argv) {
         t.deepEqual(['-s'], argv)
      },
      '-g, --global'(argv) {
         t.deepEqual(['-g'], argv)
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
   }

   let router = argvRouter(options)

   router.execute('-v')

   router.execute('-w')

   router.execute('-a')

   router.execute('-a -w')

   router.execute('-a -s -w -g')

   router.execute('12*3.js -w')

   router.execute('tj.js -w')

   router.execute('12*3.js -a')

})