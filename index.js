'use strict';

const argvRouter = {
   /**
    * options分组、合并
    * @param {Object} options 
    */
   analyse(options) {

      let or = [] // or类型类型定义简写和全称
      let and = [] // and类型定义多参数匹配
      let single = []

      // 选项类型分组
      for (let express in options) {

         let action = options[express]

         // or类型
         if (express.indexOf(',') >= 0) {
            let [key, value] = express.split(',')
            or.push({
               'argv': { [key.trim()]: value.trim() },
               action
            })
         }

         // and类型
         else if (express.indexOf(' ') >= 0) {
            let argvArray = express.split(/\s+/)
            let data = { action, 'argv': {} }
            for (let value of argvArray) {
               let reg = this.regExp(value)
               if (reg) {
                  data.argv._reg = reg
               } else {
                  data.argv[value] = null
               }
            }
            and.push(data)
         }

         // 单参数
         else {
            let reg = this.regExp(express)
            if (reg) {
               single.push({ action, 'argv': { _reg: reg } })
            } else {
               single.push({ action, 'argv': { [express]: null } })
            }
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
    * 模糊匹配
    */
   regExp(express) {

      // 单参数模糊匹配，使用正则
      if (express.indexOf('*') >= 0) {
         let reg = express.replace('.', '\\.')
         reg = reg.replace(/\*/, '.*')
         return new RegExp(reg)
      }

   },
   /**
    * 匹配参数过滤
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
            if (typeof value === 'string') {
               if (!(argv.includes(name) || argv.includes(value))) {
                  match = false
                  break
               }
            } else if (value === null) {
               if (!(argv.includes(name))) {
                  match = false
                  break
               }
            } else if (value instanceof RegExp) {
               match = false
               for (let item of argv) {
                  if (value.test(item)) {
                     match = true
                     break
                  }
               }
            }
         }

         if (match) {
            filter.push(item)
         }

      }

      if (filter.length > 1) {

         this.competition(filter)

      }

      // 仅有一个参数
      else if (filter.length === 1) {

         filter[0].action(argv)

      }

   },
   /**
    * 获取并执行匹配度最高的action
    * @param {Array} filter 
    */
   competition(filter) {

      // 按匹配参数数量优先级过滤
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

      // 最终匹配项
      if (maxArgv.action) {
         maxArgv.action(this.argv)
      }

      // 多项匹配时意味着分歧
      // 为了避免行为混乱，这种情况下不再做任何操作
      // else if (Array.isArray(maxArgv)) {
      //    console.log(this.argv)
      //    console.log(maxArgv)
      //    按位置优先级过滤
      //    for (let item of this.argv) {}
      // }

   },
   /**
    * 执行指定参数的命令
    * @param {String} express 命令行参数
    */
   execute(express) {

      if (express) {
         this.filter(express.split(' '))
      }

   }
}

module.exports = function (options, defaults) {

   if (options) {

      argvRouter.analyse(options)

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