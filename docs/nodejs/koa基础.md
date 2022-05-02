# 概述
koa是在express基础上发展而来的node服务框架，具有轻量，易于开发的特点(通过async避免嵌套回调)
# koa基础使用
koa依赖node 7.6.0以上版本，依赖async语法支持
## 安装
安装koa`npm i koa`，  
创建service.js文件，写入如下内容  
```js
const Koa = require('koa');
const app =  new Koa();

const main = async (ctx, next) => {
  ctx.body = 'hello koa';
}
app.use(main)

app.listen(3000);
```
启动koa`node service.js`，访问3000端口即可获得响应字符串  
开发环境中推荐使用nodemon启动服务，可支持热重载
# 中间件middleware
因此处于http的request和response之间，因此称为中间件；  
koa的大部分功能由中间件完成,上例中main就是一个中间件。  
中间件默认接收context和next函数两个参数，
## 中间件栈
中间件之间按照书写顺序级联，  
遇到next()调用时，入栈并暂时将执行权交给下一个中间件，  
最后出栈，逐步向上恢复next后方的代码执行，过程类似于DOM的事件捕获与事件冒泡
## 中间件合成
中间件过多时，可通过koa-compose模块将多个中间件合为一个
# app.listen
`app.listen(3000)`是`http.createServer(app.callback()).listen(3000)`的语法糖

# context上下文
koa Context 将node的request和response封装到了单个context对象中，  
上例中间件的第一个参数ctx即为上下文,`ctx.request`和`ctx.response`分别为请求和响应对象。  
为了方便使用许多上下文及方法被委托给了ctx(类似vue中_data属性中的数据被委托到组件上)，如`ctx.type`, `ctx.length`,`ctx.body`委托了response对象,`ctx.path`, `ctx.method` 委托了request对象
# 路由
通过`ctx.request.path`可实现简单的原生路由  
也可以使用koa-route模块：
```js
const route = require('koa-route');
const about = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = '<a href=" ">Index Page</a >';
  // ctx.response.redirect('/') // 重定向到'/'路由
};
const main = ctx => {
  ctx.response.body = 'Hello World';
};
app.use(route.get('/', main));
app.use(route.get('/about', about));
```
# 静态资源
向外暴露静态资源可通过koa-static模块
```js
const path = require('path');
const serve = require('koa-static');

const main = serve(path.join(__dirname));
app.use(main);
```
# 错误处理
响应错误信息可用ctx.throw(500)方法，  
在最外层的中间件中使用try...catch 用于捕获所有中间件的错误，并进行处理，  
运行过程中出错，koa也会触发一个error事件，通过以下代码监听并处理error事件：`app.on('error', (err,ctx) => {} )`  
被try...catch捕获的error不会触发error事件，可通过ctx.app.emit()手动触发error事件

[官方文档](http://koajs.cn/#)  
[阮一峰的koa教程](http://www.ruanyifeng.com/blog/2017/08/koa.html)