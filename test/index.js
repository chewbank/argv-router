'use strict';

const test = require('jtf');
const argvRouter = require('..')

test('index', async t => {

   let options = {
      '-v, --version'(argv) {
         t.deepEqual({ '-v': null, '--version': null }, argv)
      },
      '-w, --watch, <>'(argv) {
         t.deepEqual({ '-w': null, '--watch': null }, argv)
      },
      '-a, --async, <>'(argv) {
         t.deepEqual({ '-a': '222', '--async': '222' }, argv)
      },
      '[arr] -a'(argv) {
         t.deepEqual({
            '-a': '123',
            '--async': '123',
            'arr': ['666', '5656', '7878']
         }, argv)
      },
      '-a -w'(argv) {
         t.deepEqual({
            '-a': null,
            '--async': null,
            '-w': '999',
            '--watch': '999'
         }, argv)
      },
      '-j <> [files]'(argv) {
         t.deepEqual({
            '-j': '123',
            'files': ['a.js', 'c/sd/t.js']
         }, argv)
      }
   }

   let router = argvRouter(options)

   router.execute('-v')

   router.execute('--version')

   router.execute('-w')

   router.execute('--watch')
   
   router.execute('--async 222')

   router.execute('-a 222')

   router.execute('666 --async 123 5656 7878')

   router.execute('-j 123 a.js c/sd/t.js')

   router.execute('--async -w 999')

})