### Install

```
npm install argv-router
```

### 匹配表达式

匹配表达式分为单参数和组合参数两种，不可混合使用

### 单参数

单参数时直接指定参数名即可，使用简写、全称命名时用英文逗号分隔

```js
const argvRouter = require('argv-router')

argvRouter({
   '-v'(argv) {
      console.log('-v')
   },
   '-w, --watch'(argv) {
      console.log('-w, --watch')
   }
})
```

### 组合参数

组合参数时，多个参数使用空格分隔

```js
const argvRouter = require('argv-router')

argvRouter({
   '-a -w'(argv) {
      console.log('-a -w')
   },
})
```

#### 自动扩展

在使用组合参数时可以搭配单参数实现自动扩展，可以使用单参数中的任意简写或全称命名。如以下示例中参数“-a -w”会尝试匹配“-a -w”、“-a --watch”、“--async -w”、“--async --watch”。

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

### 匹配优先级

以匹配参数越多优先级越高原则进行过滤。在同等优先级下为了避免行为分歧，因此不做任何操作。


### 默认匹配

在参数为空时指定默认行为

```js
let router = argvRouter(options, '-w -a')
```


### 通配符匹配

在参数中支持通配符模式，用于模糊匹配

```js
let options = {
   '*.js'(argv) {

   },
   '*.js -w'(argv) {

   },
}

argvRouter(options)
```


### 动态执行

在js中动态执行指定的cli命令

```js
let router = argvRouter(options)

router.execute('-v')

router.execute('-w -a')
```