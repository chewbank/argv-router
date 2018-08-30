'use strict';

const argvRouter = {
   /**
    * options分组、合并
    * @param {Object} options 
    */
   group(options) {

      let or = [] // or类型类型定义简写和全称
      let and = [] // and类型定义多参数匹配
      let single = []

      // 选项类型分组
      for (let express in options) {

         let action = options[express]
         if (express.indexOf(',') >= 0) {
            // or类型
            let [key, value] = express.split(',')
            or.push({
               'argv': { [key.trim()]: value.trim() },
               action
            })
         } else if (express.indexOf(' ') >= 0) {
            // and类型
            let argvArray = express.split(/\s+/)
            let data = { action, 'argv': {} }
            for (let item of argvArray) {
               data.argv[item] = null
            }
            and.push(data)
         } else {
            // 单数类型
            single.push({ action, 'argv': { [express]: null } })
         }

      }

      // 使用or选项为and选项建立关联
      for (let { argv: andArgv } of and) {
         for (let { argv: orArgv } of or) {
            for (let key in orArgv) {
               let value = orArgv[key]
               if (andArgv[key] === null) {
                  andArgv[key] = value
               } else if (andArgv[value] === null) {
                  andArgv[value] = key
               }
            }
         }
      }

      // 合并选项队列
      this.allArgv = [].concat(or, and, single)

   },
   /**
    * 过滤
    * @param {Array} argv 原始argv数组
    */
   filter(argv) {

      this.argv = argv

      // 入参匹配，and过滤
      let filter = []
      for (let item of this.allArgv) {

         let match = true
         for (let name in item.argv) {
            let value = item.argv[name]
            if (!(argv.includes(name) || argv.includes(value))) {
               match = false
               break
            }
         }

         if (match) {
            filter.push(item)
         }

      }

      if (filter.length > 1) {
         this.priority(filter)
      }

      // 仅有一个参数
      else if (filter.length === 1) {
         filter[0].action()
      }

   },
   /**
    * 按最高优先级执行
    * @param {Array} filter 
    */
   priority(filter) {

      // 长度优先过滤
      let maxArgv
      let maxLength = 0
      for (let key in filter) {

         let item = filter[key]
         let { length } = Object.keys(item.argv)
         if (length > maxLength) {
            maxLength = length
            maxArgv = item
         } else if (length === maxLength) {
            if (!Array.isArray(maxArgv)) {
               maxArgv = [maxArgv]
            }
            maxArgv.push(item)
         }

      }

      if (Array.isArray(maxArgv)) {
         // 位置优先匹配
         for (let item of this.argv) {

         }
      } else {
         maxArgv.action()
      }

   },
   /**
    * 执行指定参数的命令
    * @param {String} express 命令行参数
    */
   execute(express) {

      this.filter(express.split(' '))

   }
}

module.exports = function (options, defaults) {

   if (options) {

      argvRouter.group(options)

   } else {

      return

   }

   let [, , ...processArgv] = process.argv

   if (processArgv.length) {

      argvRouter.filter(processArgv)

   }

   // 无参数时的默认行为
   else {

      argvRouter.execute(defaults)

   }

   return argvRouter

}