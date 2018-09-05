### Install

```
npm install argv-router
```

### 匹配表达式

匹配表达式分为单参数和组合参数两种，不可混合使用

#### 单参数

单参数时直接指定参数名即可，使用简写、全称命名时用英文逗号分隔

```js
const argvRouter = require('argv-router')

argvRouter({
   '-v'(argv) {
      console.log(argv)
   },
   '-w, --watch'(argv) {
      console.log(argv)
   }
})
```

#### 组合参数

组合参数时，多个参数使用空格分隔

```js
const argvRouter = require('argv-router')

argvRouter({
   '-a -w'(argv) {
      console.log(argv)
   },
})
```

### 自动扩展

在使用组合参数时可以搭配单参数实现自动扩展，使用单参数中的任意简写或全称命名。如以下示例中组合参数“-a -w”会尝试匹配“-a -w”、“-a --watch”、“--async -w”、“--async --watch”。

```js
let options = {
   '-w, --watch'(argv) {

   },
   '-a, --async'(argv) {

   },
   '-a -w'(argv) {

   }
}

argvRouter(options)
```

### 参数值匹配

通过“<>”占位符号定义使用启用参数值

```js
const argvRouter = require('argv-router')

argvRouter({
   '-a <> -w <>'(argv) {
      console.log(argv)
   },
})
```

### 快速赋值

通过“[$name]”定义是否启用无参数名的快捷赋值选项，在argv中返回一个以“$name”命名的匹配项数组

```js
const argvRouter = require('argv-router')

argvRouter({
   '[files] -a <> -w <>'(argv) {
      console.log(argv.files)
   },
})
```

### 匹配优先级

首先按匹配参数数量进行升级，匹配参数越多优先级越高。在等量参数数量下，包含快速赋值的匹配项先级高于其它选项。


### 默认匹配

在参数为空时指定默认行为

```js
let options = {
   '-w, --watch'(argv) {

   },
   '-a, --async'(argv) {

   }
}

let router = argvRouter(options, '-w')
```


### 动态执行

在js中动态执行指定的cli命令

```js
let router = argvRouter(options)

router.execute('-v')

router.execute('-w -a')
```