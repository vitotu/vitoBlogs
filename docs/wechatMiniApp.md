# 微信小程序基础

hybrid app包含小程序(微信、抖音、支付宝等平台)， native app、H5页面等；  
[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)  

## 概述

web端通常运行于浏览器，在微信中使用WebView，JSBridge等技术展示页面并提供平台的开放能力；  
网页开发中渲染线程与引擎线程(脚本执行线程)是互斥的，但对应小程序需中的渲染层和逻辑层是分开的  
微信小程序的逻辑层中没有DOM、BOM相关api

## 开发环境搭建

开发微信小程序面对的不是chrome等浏览器，因此需要搭建对应的开发环境，仅需两步：  

1. [申请账号](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html#%E7%94%B3%E8%AF%B7%E5%B8%90%E5%8F%B7)
2. [微信开发这工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

PS：开发者工具仅支持window和macOS两个平台  
TODO：完善利用VScode进行开发的文档  

TODO：代码结构，发布上线等流程
