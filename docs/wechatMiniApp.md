# 微信小程序基础

hybrid app包含小程序(微信、抖音、支付宝等平台)， native app、H5页面等；  
[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)  
本文用于记录小程序的入门用法，会经常与vue进行类比学习，因此要求读者具备一定的vue知识  

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
sitemap.json用于配置微信索引，类似于SEO，[完整配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/sitemap.html)  
app.js入口文件  
app.css/app.wxss全局样式  
pages目录，存放页面文件  

页面目录结构以index为例通常为：  

::: tip 目录结构
pages/index/  
├── index.json 当前[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)与app.json类似，在当页会覆盖app.json中的部分相同配置  
├── index.wxss 页面样式，类似于css  
├── index.js 页面逻辑  
└── index.wxml 页面结构， 类似于vue的template，但仅支持微信中提供的标签或自定义的组件  
:::

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

## 小程序框架

小程序框架主要分为逻辑层和视图层，并在两层间提供的数据传输和事件系统  

[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html)描述用户进入小程序的路径  

### 视图层

视图层主要由wxml和wxss编写，将逻辑层的数据映射为视图，同时将视图层的事件发送给逻辑层  
小程序的数据也是响应式的，wxml中同样支持类似于vue的模板语法：  

- wxml

```xml
<!-- wxml -->
<view bindtap="tapMessage">{{message}}</view>
<input model:value="{{value}}"/> 双向绑定(只能绑定单个字段，不支持路径)
<custom-component model:properties-name="{{value}}"> 自定义组件的双向绑定
与vue中类似，自定义组件需设置properties属性，子组件内部通过this.setData({name:''})的方式主动触发更新
<view wx:for="{{array}}">{{item}}</view> 列表渲染
<view wx:if="{{view == 'webview}}">webview</view> 条件渲染
<view wx:elif="{{view == 'app}}">app</view>
<view wx:else="{{view == 'MINA}}">MINA</view>
```

```js
Page({
  data:{
    message:'Hello',
    array:[1,2,3,4,5],
    view:'MINA',
    value: 'input',
  },
  tapName:function(event){console.log(event);},
})
```

- wxss

wxss具有css大部分特性，同时对css进行了两点扩展：

  1. 尺寸单位：rpx，以iPhone6屏幕为参考，iPhone屏幕宽度为375px，共有750个物理像素，对应750rpx的宽度
  2. 样式导入：使用@import导入外联样式时，使用相对路径并以`;`结束

目前仅支持类选择器、id选择器、元素选择器、群组选择器、`::after`、`::before`这6种

- wxs

wxs是小程序的一套脚本语言，类似于`<script>`标签，但有其独特的语法，  
运行环境与其他js代码隔离，不依赖于运行时的基础库版本  
基础库版本低于2.4.4时，其函数不能作为组件的事件回调  
[参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/)  

```xml
<wxs module="m1">
  var msg = "hello world";
  module.exports.message = msg;
</wxs>
<wxs module="m2" src="./test.wxs"></wxs>
<view>{{m1.message}}</view>
```

- 事件系统

在wxml标签属性中，可以使用bind*="callback" (或bind:*="callback") 来绑定一个事件；  
也可以使用catch绑定来阻止事件向上冒泡；  
使用mut-bind绑定则会在在mut-bind各级绑定中仅有一个绑定函数会被触发；  
给上述绑定加上capture-前缀则可在事件捕获阶段监听事件  

wxs从2.4.4基础库版本后支持函数绑定事件，接收2个参数event和ownerInstance对象，具体用法[详见](https://developers.weixin.qq.com/miniprogram/dev/framework/view/interactive-animation.html)  
事件分为冒泡事件与非冒泡事件，冒泡事件包含touch*, tap, longpress, longtap以及动画相关事件，其他如无特殊声明均为非冒泡事件  

事件对象的种类即其包含的属性方法[详见](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)  

- 获取界面上的节点信息(类似DOM api)

```js
// 生成SelectorQuery对象，可用于在指定范围内找到wxml节点对象
const query = wx.createSelectQuery(); // 自定义组件中推荐使用this.createSelectorQuery()
query.select('#app') // 返回NodesRef对象实例，类似于DOM节点
```

[SelectorQuery文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/SelectorQuery.html)  
[NodesRef对象文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.html)  

wx.createInterSectionObserver api则与浏览器的IntersectionObserver api 类似  

- 初始渲染缓存

小程序初始化逻辑层时，先初始化页面this对象，然后发送相关数据到视图层，视图层等待逻辑层初始化完毕后，渲染页面  
冷启动时，逻辑层初始化事件较长，启用初始渲染缓存可以让视图层直接使用缓存的数据而无需等待逻辑层初始化完毕，从而加速启动过程  
通过json文件中增加`"initialRenderingCache":"static"`配置项开启渲染缓存，小程序首次打开后页面初始数据将被缓存，在第二次打开时检查缓存命中  

### 逻辑层

TODO:
