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

小程序js代码会在启动时运行，直到小程序销毁，类似于ServiceWorker, 逻辑层也称为App Service

在app.js文件中，调用`App()`方法注册小程序实例，与vue类似，整个小程序只有一个app实例，全页面共享，`可通过getApp`方法获取到这个唯一的实例  
在各页面的js文件中，使用`Page()`方法注册页面，与vue的mixin类似，小程序通过引入behaviors选项可实现，多个页面有相同的数据字段和方法  
对于复杂页面可以使用`Component`方法来构造页面，语法上与`Page()`的主要区别是方法要放在`methods()`选项中  

- 页面路由

小程序页面路由全部由框架管理，维护有页面栈，可通过wx.navigate*等api进行手动跳转，也可使用`<navigator open-type="navigate*"></navigator>`等组件  

- 模块化

小程序仅支持module.exports和require的方式进行模块导出和导入  
TODO：npm包管理器的使用

- API

小程序通过API开放微信的能力，主要分为同步API和异步API； 异步api支持回调和promise两种方式，若结构参数Object中不含`success/fail/complete`时，默认返回promise对象，但部分结构`downloadFile, request, createCamera`等还需要自行promisify封装  
wx.onUnhandledRejection可以监听未处理的Promise拒绝事件  

## 生命周期

![生命周期](https://res.wx.qq.com/wxdoc/dist/assets/img/page-lifecycle.2e646c86.png)  

TODO:

冷启动：用户首次打开或小程序销毁后用户再次打开，再次打开时，若带有path则进入对应path页面，若无path则进入首页或遵循重新启动策略`restartStrategy`  
热启动：已打开过小程序，小程序未被销毁，从后台切换到前台为热启动，热启动可利用场景值和path再次回到小程序或对应的页面  

前台：界面被展示给用户，称为前台状态  
后台：关闭小程序时，小程序并没有真正关闭，而是进入后台状态，此时小程序还可短暂运行一小段时间，但部分api受限(常规切后台方式外，前台运行时锁屏或直接将微信切后台均可进入后台方式)  
小程序进入后台后5秒，会停止小程序js线程执行，随后进入挂起状态，此时会保存小程序内存状态，但代码会停止执行，事件及接口回调会在再次进入前台时触发  
当使用了后台音乐播放、后台地理位置等能力时小程序可以在后台持续运行  
当小程序可能将要被销毁前`onSaveExitState`函数会被调用，在回调中可以通过返回数据对象的方式缓存一些数据，返回对象格式：`{data:Object, expireTimeStamp: time}`  

## 组件化开发

创建自定义组件：在js中通过`Component()`来注册组件，在json文件中声明`"component":true`字段  
使用组件: 在json文件使用声明`"usingComponents":{"component-tag-name":"自定义组件的路径"}"`

### 模板语法

与vue类似，小程序wxml可以通过`{{xxx}}`引用data选项中的数据xxx,并且xxx支持简单的js表达式  
同时支持数据绑定、条件渲染、列表渲染等  

- 数据绑定

如在wxml中`<input value="{{valueOfData}}"/>`的方式单项绑定data配置项中的数据，使用`this.setData()`更相关数据后wxml也会做出相应更新  
简易双向绑定`<input model:value="{{valueOfData}}">`当输入框值被改变时，`this.data.valueOfData`也会被改变，`valueOfData`不能为路径形式(如a.b)  
TODO: 自定义组件的双向绑定  

- 列表渲染

如`<view wx:for="{{array}}">{{index}}:{{item}}</view>`遍历array默认数据的当前项下标为index，值为item,可通过`wx:for-index="i"`和`wx:for-item="itemName"`属性指定下标和值变量名  
`wx:key`属性与vue和react中类似，指定列表项目中的唯一标识，其值为字符串(标识item的某个属性，该属性是字符串或数字类型)或`*this`保留关键字(标识item本身)  

ps：花括号和引号之间如果有空格，将最终被解析成为字符串`wx:for="{{[1,2]}} "`等价于`wx:for="{{[1,2]+' '}}"`  

- 条件渲染

通过指令`wx:if="{{condition}}"`、`wx:elif="{{}}"`、`wx:else`组合使用可以控制标签或组件是否渲染  
通过与`<block></block>`标签配合可一次性控制多个标签的渲染，并且block本身不会在页面中做任何渲染，不影响DOM结构  
与vue类似，条件渲染包含了组件的创建销毁或重新渲染，与hidden属性直接控制显示与隐藏不同  

- 模板`<template/>`

与vue中的`<template/>`标签不同，小程序中模板标签更类似于在wxml中定义“标签变量”，通过name属性和is属性用于定义和指定使用的“变量”  
使用时通过data prop传入模板中使用的数据，PS：模板有自己的独立作用于，只能使用data传入的数据以及模板定义文件中定义的`<wxs/>`模块  

```xml
<template name="odd">
  <view>odd{{index}}</view>
</template>
<template name="even">
  <view>even{{index}}</view>
</template>

<block wx:for=""{{[1,2,3,4,5]}}>
  <template is="{{item % 2 === 0 ? 'even' : 'odd'}}" data="{{index}}"></template>
</block>
```

- 引用

`<import src="filePath.wxml"/>`可以引用filePath.wxml中定义的template“标签变量”，而后在当前文件中使用  
import有作用域，不能做到“深度”引用，如 C import B , B import A, B中可以使用A中的template，但C不可直接使用A中的template  

`<include src="filePath.wxml"/>`可以引入filePath.wxml中除了template和wxs外的全部代码，并替换include标签位置  

### data配置项

这里data在页面加载时将数据传至渲染层，随后与react风格类似通过`this.setData()`对数据进行更新  

```js
Component({ // Page() 页面构造器也相同
  data:{
    a:'value of a',
  },
  onLoad(){
    this.data.a // 读取data中定义的属性
    this.setData({a:'new value of a'}); // 设置data中对应属性
  }
})
```

`this.setData(Object, callback)`函数异步的将数据从逻辑层发送到视图层，同步的改变对应this.data的值。因此不推荐直接修改this.data，会导致数据与页面状态不一致  
其中Object中的key对应data配置项中的key，支持数据路径形式给出`a[1].b.`，也不需要在data中预先定义  
[详细规则参考](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page-prototype-setData-Object-data-Function-callback)

### observers数据监听器

与vue的watch选项类似，监听数据变化，并且可同时监听多个

```js
Component({
  observers:{
    'numberA, numberB':function(numberA, numberB){}, // 同时监听多个数据
    'some.subfield.*':function(subfield){}, // 支持监听子属性，也支持使用通配符*
    'arr[12]':function(arr12){} // 监听特定索引值
  }
})
```

### 实例

通过`getApp()`方法可以获取到小程序的全局唯一app实例  

`getCurrentPages()`获取当前页面栈，数组中第一个元素为首页，最后一个元素为当前页面  

[节点查询api](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html)则与`document.querySelector()`api类似可获取节点实例，但能进行的操作有限  

### 事件

- 内置事件(原生事件)

在wxml标签属性中，可以使用bind*="callback" (或bind:*="callback") 来绑定一个事件；  
也可以使用catch绑定来阻止事件向上冒泡；  
使用mut-bind绑定则会在在mut-bind各级绑定中仅有一个绑定函数会被触发；  
给上述绑定加上capture-前缀则可在事件捕获阶段监听事件  

wxs从2.4.4基础库版本后支持函数绑定事件，接收2个参数event和ownerInstance对象，具体用法[详见](https://developers.weixin.qq.com/miniprogram/dev/framework/view/interactive-animation.html)  
事件分为冒泡事件与非冒泡事件，冒泡事件包含touch*, tap, longpress, longtap以及动画相关事件，其他如无特殊声明均为非冒泡事件  

事件对象的种类即其包含的属性方法[详见](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)  

TODO

组件wxml模板中支持`<slot></slot>`标签，与vue中插槽类似，默认情况只能有一个slot，多个slot需要在js中声明启用  
多个slot用不同的name区别，使用时通过`<view slot="name"/>`方式指定要插入的slot，与具名插槽类似  

```js
Component({
  options:{multipleSlots:true}
})
```

小程序中也支持类似vue的prop的方式传参

使用Component构造页面时，组件的properties属性可用于接收页面query参数，页面的生命周期方法应该写在methods中

### 组件样式

组件对应wxss仅对组件内节点生效，组件定义与使用时仅能使用class选择器，避免使用后代选择器，继承样式会影响到组件内，其他样式则不会影响  
与vue的scoped类似，组件的样式也存在隔离，可以通过js的的方式来指定隔离选项  

```js
Component({
  options:{
    styleIsolation:'isolated', // 默认值，自定义组件内外，使用 class 指定的样式将不会相互影响
    // apply-shared // 页面wxss样式将影响到自定义组件，组件不会影响页面
    // shared // 页面影响组件，组件会影响其他设置了apply-shared或shared的组件
    // page-isolated // 组件作为页面时，页面禁用app.wxss，同时页面不会影响其他组件
    // page-apply-shared // 同上，但设为shared的组件会影响页面
    // page-shared // 禁用app.wxss，其他与shared相同
    addGlobalClass:true, // 等价与 styleIsolation:apply-shared,但styleIsolation会屏蔽此选项
  },
  externalClasses:['my-class'], // 支持外部传入 className
  virtualHost:true, // 将组件节点虚拟化，类似于vue中template节点
})
```

2.10.1版本后也支持在json文件中配置styleIsolation字段  
另外使用标签选择器或其他特殊选择器，则对应样式会全局生效  
通过`class="~class-name"`的方式组件可以引用页面中对应的样式, 通过`^`前缀的方式可以引用父组件中对应的样式，该系列前缀可连续使用  
css中background-image不支持本地url()，仅可使用网络图片或base64

### 组件生命周期

与vue类似，小程序组件也有其生命周期函数，可以直接定义在Component一级参数中，也可以使用lifetimes字段声明(推荐方式，优先级最高)  

组件可用的生命周期函数

- create 组件实例刚创建号，setData还不能调用
- attached 组件初始化完成，进入页面节点树后，
- ready 组件在视图层布局完成后执行
- moved 组件实例被移动到节点树的另一位置时执行
- detached 组件离开页面节点树后
- error 组件方法抛出错误时执行

组件所在页面的生命周期函数

- show 组件所在页面被展示时执行
- hide 组件所在页面被隐藏时执行
- resize 组件所在页面尺寸变化时执行

behavior中也可声明同名的生命周期函数，并且不会与其他behavior中的同名相互覆盖

### 组件间通信

- wxml数据绑定：定义properties选项用于接收绑定的数据，与vue中props类似，可用于父传子通信
- 事件： 自定义事件，父组件`bind:myevent="callback"`， 子组件`this.triggerEvent('myevent', detailObject, eventOption)`与vue中emit类似 子传父

另外还可通过父组件还可通过`this.selectComponent('.children-component')`方法获取子组件实例对象  
默认情况下，小程序与插件，插件之间的不同组件无法通过该方法获取组件实例，可通过子组件中`behaviors:wx://component-export`配置及`export(){return customObject}`方法指定`this.selectComponent('.children-component')`的返回值  

### behaviors

类似于vue中的mixin混入, 组件中引入时，对应的属性、数据和方法会被合并到组件中，生命周期函数会在对应的时机调用  
behavior中也可以引入其他behavior  

- 合并规则

同名生命周期函数和observers，behavior中先于组件中执行，嵌套式被引用者先于引用者，靠前先于靠后；  
同名属性或方法组件中生效，behavior引用其他behavior时，引用者生效；  
同名数据字段，对象类型进行合并，其他情况引用者覆盖被引用者，靠后的behavior覆盖靠前的behavior；  

- 内置behavior

wx://form-field 为自定义组件添加表单控件行为，使form组件识别自定义组件  
wx://form-field-group 添加表单空间组行为，与上类似  
wx://form-field-button 使form识别表单内部button  
wx://component-export 使组件支持export定义，可用于执行组件被`selectComponent`调用时的返回值  

- 自定义组件扩展

在behavior中可使用definitionFilter函数对自检进行扩展，函数接收两个参数:defFields为使用方对象(component/behaviors)  definitionFilterArr是该behavior所引入的behavior的definitionFilter函数列表  
示例：A使用了B，A的声明就会调用B的definitionFilter函数，并传入A的定义对象  
若B还使用了C和D则，B可以决定要不要通过definitionFilterArr调用C和D的definitionFilter函数  
TODO：不确定时B决定还是A决定，此处待详细学习  

### relations组件间关系

relations字段可用于指定组件间关系，并绑定对应的生命周期函数，如：

```html
<custom-ul>
  <custom-li>item1</custom-li>
  <custom-li>item2</custom-li>
</custom-ul>
```

```js
// custom-ul.js
Component({
  relations:{
    'custom-li':{
      type:'child',
      linked:function(target){}, // custom-li被插入时执行，target为该节点的实例对象，在attached之后触发
      linkChanged:function(target){}, // custom-li被移动后执行，在触发该节点的moved之后
      unlinked:function(target){}, // custom-li被移除时执行，detached之后触发
    }
  },
  ready:function(){
    var nodes = this.getRelationNodes('path to custom-li') // 获取nodes数组，包含所有已关联的custom-li，有序
  }
})
// custom-li.js
Component({
  relations:{
    './custom-ul':{
      type:'parent',
      linked:function(target){}, // 被插入到custom-ul中时执行，触发在attached之后，target时custom-ul的实例对象
      linkChanged:function(target){}, // 与上类比对应
      unlinked:function(target){}, // 与上类比对应
    }
  }
})
// 两组件定义中需要都加入relations定义才能生效
```

另外子组件使用了共同的behaviors选项后，path key可以用对用behaviors来代替并在父组件中设置target为对应behaviors，type可分别设置为ancestor, descendant  

### 纯数据字段

纯数据字段类似于vue中无响应式的字段(但不完全)，仅用于组件内部，不可用于wxml中，也不可能传递给其他组件  
纯数据字段可用于提升页面性能  
通过`Component({options:{pureDatePattern:正则表达式}})`  
或json中`{"pureDatePattern":"正则表达式"}`的pureDatePattern选项配置正则表达式  
被正则匹配中的properties和data中的字段都将被执行为纯数据字段  
但数据监听器observers仍然可以监听纯数据字段

### 抽象节点

类似于vue中的内置组件component, 具体组件使用的组件由传入参数决定  
与vue中component不同的是，小程序中抽象节点可自定义，如：  

```xml
<!-- selectable-group.wxml -->
<view wx:for="{{labels}}">
  <label>
    <selectable disabled="{{false}}"></selectable>
    {{item}}
  </label>
</view>
<!-- 父组件中， 其中custom-radio仅支持静态值 -->
<selectable-group generic:selectable="custom-radio"/>
```

```json
// 对应selectable-group.json
{
  "componentGenerics":{
    "selectable":true,
    // "selectable":{"default":"path to default component"} // 设定默认虚拟节点
  }
}
// 对应父组件json中
{
  "usingComponent":{"custom-radio":"path to custom-radio"}
}
```

### 占位组件

使用分包异步化或用时注入等特性时，自定义组件所引用的其他组件处于暂时不可用状态，可使用其他可用的组件进行占位，称为占位组件  

```json
// 在页面json文件中
{
  "usingComponent":{
    "comp-a":"path to comp-a",
  },
  "componentPlaceHolder":{
    // comp-a 的占位组件为内置组件view,也可指定为其他注册过的自定义组件如comp-b
    // 当comp-b被指定为占位组件后，为comp-b指定占位组件是无效的
    "comp-a":"view",
  }
}
```

## 页面栈(路由)
