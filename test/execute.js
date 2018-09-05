'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('execute', async t => {

   let router = argvRouter({
      '-w, --watch'(argv) {
         t.ok(false)
      },
      '-a, --async'(argv) {
         t.ok(false)
      },
      '-s, --sync'(argv) {
         t.ok(false)
      },
      '-a -w'(argv) {
         t.deepEqual({
            '-a': null,
            '--async': null,
            '-w': null,
            '--watch': null
         }, argv)
      },
      '-a -s -w'(argv) {
         t.deepEqual({
            '-a': null,
            '--async': null,
            '-s': null,
            '--sync': null,
            '-w': null,
            '--watch': null
         }, argv)
      },
      '[arr]'(argv) {
         t.deepEqual({
            arr: ['tj.js', '123.js', '456.js']
         }, argv)
      },
      '[arr] -w'(argv) {
         t.deepEqual({
            '-w': null,
            '--watch': null,
            arr: ['123.js', '456.js']
         }, argv)
      },
      '[arr] -g <>'(argv) {
         t.deepEqual({
            '-g': '555',
            arr: ['12*3.js']
         }, argv)
      }
   })

   router.execute('-a -w')

   router.execute('-a -s -w -g')

   router.execute('tj.js 123.js 456.js')

   router.execute('123.js 456.js -w')

   router.execute('12*3.js -g 555')

})