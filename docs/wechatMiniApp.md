# 微信小程序基础

hybrid app包含小程序(微信、抖音、支付宝等平台)， native app、H5页面等；  
[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)  

## 概述

web端通常运行于浏览器，在微信中使用WebView，JSBridge,JsCore等技术展示页面并提供平台的开放能力；  
网页开发中渲染线程与引擎线程(脚本执行线程)是互斥的，但对应小程序需中的渲染层和逻辑层是分开的  
微信小程序的逻辑层中没有DOM、BOM相关api

### 开发环境搭建

开发微信小程序面对的不是chrome等浏览器，因此需要搭建对应的开发环境，仅需两步：  

1. [申请账号](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html#%E7%94%B3%E8%AF%B7%E5%B8%90%E5%8F%B7)
2. [微信开发这工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

PS：开发者工具仅支持window和macOS两个平台  
TODO：完善利用VScode进行开发的文档  

### 代码结构简介

通过开发者工具创建的项目，在主目录中通常包含  
app.json文件用于小程序[全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)，及页面注册  
project.config.json开发者工具配置  
sitemap.json用于配置微信索引，类似于SEO  
app.js入口文件  
app.css/app.wxss全局样式  
pages目录，存放页面文件  

页面目录结构以index为例通常为：  
pages/index/
├── index.json // 当前页面配置与app.json类似，在当页会覆盖app.json中的部分相同配置
├── index.wxss // 页面样式，类似于css
├── index.js // 页面逻辑
└── index.wxml // 页面结构， 类似于vue的template，但仅支持微信中提供的标签或自定义的组件

### 宿主环境

小程序运行环境是由微信客户端提供的，分成渲染层(运行WXML和WXSS)和逻辑层(运行js脚本)，分别对应了两个不同的线程管理,网络请求则由native转发  

与VUE的VM类似小程序只有一个app实例，js文件中window对象被wx对象取代，wx对象上包含多种微信开放能力api  
微信客户端在装在页面时会优先读取json配置文件，而后是wxml,wxss文件，最后加载js

```js
// app.js文件中
App({
  onLaunch:function(){}
})
// index.js页面文件中
Page({
  data:{},
  onLoad:function(){}
})
```

### 协作开发与发布上线

依托微信，小程序的上线需要通过开发者工具将代码打包上传至腾讯，由腾讯的服务器负责资源分发  
搜索微信公共平台，使用注册的微信号扫码，选择对应小程序登录，即可访问小程序管理后台  
小程序管理后台可设置开发者权限，体验者权限等进行协作开发  
管理后台进行小程序版本管理，包含提交的版本(开发者工具上提交的版本)、体验版本，上线版本等
