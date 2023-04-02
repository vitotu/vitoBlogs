# nodejs概述

nodejs 是一种脚本程序，基于node环境运行js脚本而无需浏览器  
nodejs最常使用的场景还是服务端程序，通常为web应用程序，或数据服务中间层，也可用于读取数据库等后端数据服务  

作为web应用程序时，nodejs常见的应用框架有

express、koa、egg、nest

他们之间的区别是：

express最早出现，现在仍然很流行的一套nodejs web框架

koa相比于Express

中间件使用洋葱模型，让中间件代码根据 next 方法分隔有两次执行时机
几乎不再内置任何中间件，把控制权和复杂度交给了开发者
Koa 1 通过 generator、koa 2 通过 async/await 语法，让 web 中高频出现的异步调用书写简单

由于koa不内置中间件，web应用程序的session，视图模板，路由等常用中间件需要在官方的[Middleware](https://github.com/koajs/koa/wiki#middleware)中寻找，为了规范搭配，提供统一的默认配置、部署方案、技术选型、代码风格等推出了基于社区最佳事件的整合egg.js  
egg是一个生成web框架的框架，目标用户是团队架构师，约定了一套优先配置实现，其底层基于koa2，中间件机制与koa一直，egg也可以被当做web框架直接使用  

由于ts的推出，nest框架基于Express上封装，并增加了TS特性支持，Midway则是基于egg封装增加了TS的特性支持  
