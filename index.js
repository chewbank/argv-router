'use strict';

const argvRouter = {
   /**
    * 解析options
    * @param {Object} options 
    */
   analyse(options) {

      let link = {} // 扁平化引用关系网
      let combination = {} //多参数组合类型
      let container = [] // 解析后的结构化匹配队列

      // 单数类型，与组合类型分开处理
      for (let express in options) {

         let action = options[express]

         // 逗号分隔表示单数类型
         if (express.indexOf(',') >= 0) {

            let argv = {}

            let [logogram, fullName, value] = express.split(/\s*,\s*/)

            if (logogram) {
               argv[logogram] = value
               link[logogram] = argv
            }

            if (fullName) {
               argv[fullName] = value
               link[fullName] = argv
            }

            container.push({ argv: [argv], value: {}, action })

         }

         // 组合类型
         else {

            combination[express] = action

         }

      }

      // 组合类型，在单数类型处理完毕后，尝试进行参数关联
      for (let express in combination) {

         let action = combination[express]

         let argv = [], other
         let argvArray = express.split(/\s+/)

         let key = 0
         while (key < argvArray.length) {

            let name = argvArray[key]
            if (name.match(/^-{1,2}.+/)) {

               let value = argvArray[key + 1]
               if (value && value.match(/^<.*>$/)) {
                  key += 2
               } else {
                  key++
               }

               if (link[name]) {
                  argv.push(link[name])
               } else {
                  link[name] = { [name]: value || null }
                  argv.push(link[name])
               }

            } else {

               let match = name.match(/^\[(.*)\]$/)

               if (match) {
                  other = match[1]
               }

               key++

            }

         }

         container.push({ argv, value: {}, action, other })

      }

      this.container = container

   },
   /**
    * argv参数解析、过滤
    * @param {Array} argv 原始argv数组
    */
   filter(argv) {

      let last // 上一个参数
      let cache = {} // 带有key的键值对
      let other = [] // 没有key的其它参数

      // 解析argv
      for (let item of argv) {

         if (item.match(/^-{1,2}.+/)) {
            cache[item] = null
         } else {
            if (cache[last] === null) {
               cache[last] = item
            } else {
               other.push(item)
            }
         }

         last = item

      }

      let filter = []

      for (let item of this.container) {

         let andMatch = true
         let itemOther = []

         // and匹配，必须同时满足多个条件
         for (let orItemArgv of item.argv) {

            let orMatch = false

            // or匹配，满足多个条件中的一个即可
            for (let name in orItemArgv) {

               let value = cache[name]
               if (value !== undefined) {
                  if (orItemArgv[name] !== '<>') {
                     if (value) {
                        itemOther.push(value)
                     }
                     value = null
                  }
                  // 将值同时赋值给全称和别称
                  for (let name in orItemArgv) {
                     item.value[name] = value
                  }
                  orMatch = true
                  break
               }

            }

            if (orMatch === false) {
               andMatch = false
               break
            }

         }

         if (andMatch) {
            if (item.other) {
               item.value[item.other] = other.concat(itemOther)
            }
            filter.push(item)
         }

      }

      // 复数，竞选模式
      if (filter.length > 1) {

         this.competition(filter)

      }

      // 单数
      else if (filter.length === 1) {

         let [item] = filter

         item.action(item.value)

      }

   },
   /**
    * 竞选、执行最高匹配项
    * @param {Array} filter 
    */
   competition(filter = []) {

      // 按匹配参数数量优先级过滤
      let maxArgv
      let maxLength = 0

      // 按argv长度取最大值
      for (let item of filter) {

         let { length } = item.argv
         if (length > maxLength) {
            maxLength = length
            maxArgv = item
         }

         // 存在多个平级匹配分歧，不做任何操作
         else if (length === maxLength) {
            if (!Array.isArray(maxArgv)) {
               maxArgv = [maxArgv]
            }
            maxArgv.push(item)
         }

      }

      if (maxArgv.action) {

         maxArgv.action(maxArgv.value)

      } else {

         let maxValue

         // 带有other的匹配项，优先级高于其它匹配项
         for (let item of maxArgv) {
            if (item.other && item.value[item.other].length) {
               maxValue = item
            }
         }

         if (maxValue) {
            maxValue.action(maxValue.value)
         } else {
            let [maxValue] = maxArgv
            maxValue.action(maxValue.value)
         }

      }

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


/**
 * 
 * @param {Object} options 选项
 * @param {String} defaults 默认配置
 */
module.exports = function (options, defaults) {

   if (!options) return

   argvRouter.analyse(options)

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