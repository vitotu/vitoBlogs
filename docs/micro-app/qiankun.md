# 微前端之qiankun框架

[qiankun](https://qiankun.umijs.org/zh/guide)是一个基于[single-spa](https://github.com/single-spa/single-spa)的[微前端](https://micro-frontends.org/)实现库

## 微前端简介

借鉴后端微服务的思想，微前端将复杂应用拆分，并采用主应用与子应用的组织方式构成复杂引用。  
微前端具备以下特点：

- 技术栈无关：主应用不限制子应用的技术栈
- 独立开发，独立部署：子应用仓库独立，可独立开发，部署后主框架自动同步更新
- 增量升级：由于技术栈无关，因此适用于复杂系统的渐进式重构等重大调整
- 独立运行：每个子应用之间的状态隔离，运行时的状态不共享

对于复杂应用和参与人员、团队较多的系统开发来说，微前端是个不错的解决方案  

## qiankun

[官方文档](https://qiankun.umijs.org/zh/guide)  
[qiankun解析博客](https://juejin.cn/post/6844904158085021704)  
TODO：解析博客，源码阅读

### 特性

基于single-spa封装，更加易用；  
技术栈无关，可以在任意技术栈开发的项目中引入qiankun；  
html entry接入方式；  
样式隔离， 微应用之间的样式互不干扰；  
js沙箱，微应用间的变量、事件互不冲突；  
资源预加载；  
umi插件；  

### 主应用中的基本使用

主应用中需要安装qiankun  
TODO：主应用中也有生命周期函数，待完善

```js
// 入口文件，通常是main.js中
import { registerMicroApps, start, loadMicroApp } from 'qiankun';
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);
registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100', // 微应用地址
    container: '#yourContainer', // 微应用挂载节点
    activeRule: '/yourActiveRule', // 微应用激活条件

    // 当主应用为history模式或部署在非根路径，且子应用为hash路由模式时，激活规则必须使用函数形式
    // activeRule: getActiveRule('#/yourActiveRule2')
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
    // 当微应用中存在路由时，需调整主应用路由(包含前端路由和静态资源路由)将
    // 激活条件下的所有路由重定向为微应用(挂载节点或地址)
  },
]);

start();

// --也可在需要的地方手动加载微应用---
loadMicroApp({
  name: 'app',
  entry: '//localhost:7100',
  container: '#yourContainer',
});
```

### 微应用中的基础使用

微应用中无需额外安装qiankun依赖，仅需在入口文件中导出生命周期钩子以便主应用在合适时机调用即可

- 生命周期函数

```js
// 使用vite打包时需要借助vite-plugin-qiankun插件，直接导出生命周期函数无效
export async function bootstrap() { // 仅在微应用初始化时调用一次
  console.log('react app bootstraped');
}
export async function mount(props) { // 每次进入微应用都会调用
  // 通常在此处触发应用的渲染方法
}
export async function unmount(props) { // 从应用切出会调用此方法
  // 此处卸载微应用实例
}
export async function update(props) { // 仅在loadMicroApp方式加载微应用时生效(可选)
  console.log('update props', props);
}
function render(props = {}){
  const { container } = props; // 从父应用中获取的容器，也可通过props传递其他参数
  // 子应用实例化与挂载过程，以Vue为例，此处应运行new Vue().$mount()相关的代码
}
if (!window.__POWERED_BY_QIANKUN__) { // 独立运行时调用
  render();
}
```

更多的微应用生命周期[文档](https://single-spa.js.org/docs/building-applications/#registered-application-lifecycle)  

- webpack调整

除了暴露对应的生命周期函数钩子之外，微应用的打包配置需要做出相应的调整，以webpack为例:

```js
const packageName = require('./package.json').name;
module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
```

- public-path

新增 public-path.js 文件并在入口文件中引入，用于修改运行时的 publicPath。(运行时的publicPath与构建时是不同的)  

```js
if (window.__POWERED_BY_QIANKUN__) { // public-path.js
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

- 微应用路由调整

微应用若有路由，其路由base需与activeRule保持一致

### 路由调整

如果主应用和微应用同时使用了路由，共用了url的状态，则需要调整对应的路由配置

以vue-router的使用为例，主要分为以下几种情况：

- 主应用history路由，子应用hash路由

此时主应用与子应用监听了不同的url变化情况，兼容性最好。
TODO：路由以及资源打包base路径调整方案待补充

- 主应用history路由，子应用history路由

主应用与子应用共用了url变化情况，若使用路由作为触发条件，则对应路由规则及其子路由配置都需重定向为对应容器：

```js
// 主应用路由注册配置
{
  path:'/sub-app/', // 子应用路由激活条件
  component: SubAppContainer, // 子应用容器组件
  children:[ // 对应path子路径下所有情况均需导航到子应用容器组件或重定向为子应用容器
    { // 以便子应用处理对应的路由
      path: '/sub-app/:chapters*',
      component:SubAppContainer,
    }
  ]
}
// 子应用在main.js入口文件中导入路由注册文件修改
import routes form 'routes'; // 导入routes注册文件
addRouterPrefix('/sub-app', routes); // 手动给每个配置路径添加对应前缀
// 也可尝试通过base配置项添加前缀(更为推荐这种方式)

/**
 * 退出子应用时，通常会销毁对应的应用实例vm，如vm.$destroy()等
 * 但main.js的作用域并未销毁，因此其导入的库及变量都存在
 * 通过手动添加注册路公共前缀时，若判断是重新进入子应用则无需在此添加前缀
 * 从而避免重复添加路由而导致子路由出错 
 * PS: 此问题可能是使用vite打包，ESM导致
 * 
*/
let reEnterFlag = false;
function addRouterPrefix(prefixPath, routes){
  if(!reEnterFlag && prefixPath){
    routes.forEach(i => {
      i.path = `${prefixPath}${i.path}`;
      if (i.redirect) i.redirect = `${prefixPath}${i.redirect}`;
    })
  }
  if(!reEnterFlag) reEnterFlag = true;
}
```

- 主应用hash路由，子应用history路由

兼容性差，不推荐此方式  
TODO：待完善方案

- 主应用hash路由，子应用hash路由

与主history，子history基本一致

::: tip
子应用在打包部署时，对应的资源加载路径以及主应用配置的入口需要相互配合

子应用打包html中的资源引用一般为相对url，  
由于通过主应用访问，一般公共基础url与子应用部署地址不同，因此建议在打包配置中修改为完整的url，  
避免仅能加载到子应用的html而不能加载到资源  

这部分也是public-path.js文件的最终目的  

:::

### 应用间通信

qiankun的微应用应按业务拆分，子应用应能独立运行，因此应用间通信应尽量少，减少耦合度  

- Actions

Actions是qiankun官方提供了应用间通信方式，基于发布订阅模式，通过setGlobalState更改全局状态，通知观察者  
通过onGlobalStateChange、offGlobalStateChange方法添加观察者或移除观察者  
[!ActionsFLow](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/8/171f3c48e01117fa~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)  

actions适合于通信业务较少的场景  

在主应用中

```js
// 创建文件actions.ts(此处也可删掉类型声明使用js扩展名) 初始化MicroAppStateActions并导出
import { initGlobalState, MicroAppStateActions } from "qiankun";
const initialState = {}; // initGlobalState 疑似会自动绑定actions到props中
const actions: MicroAppStateActions = initGlobalState(initialState);
export default actions;
// 业务组件中
import actions from './actions.ts';
actions.onGlobalStateChange((curState, prevState) => {}); // 在主应用中添加观察者函数
actions.setGlobalState({a:'1'}); // 在主应用中设置全局state
```

在微应用中

```js
// 创建actions.js文件
function emptyAction() { console.warn("current execute action is empty!") }
class Actions {
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  }
  setActions(actions) { this.actions = actions; }
  onGlobalStateChange(...args) { return this.actions.onGlobalStateChange(...args)}
  setGlobalState(...args) { return this.acthins.setGlobalState(...args)}
}
const actions = new Actions();
export default actions;
// 在main.js入口文件中，通过props上接收主应用中传来的真实actions
import actions from './actions.js';
function render(props){
  if(props) actions.setActions(props); // 注入actions实例
}
// 业务组件中使用与主应用中类似
```

- state共享

常见业务场景使用actions即可基本满足要求，但也有不少限制：  
子应用需要额外配置独立运行时没有actions的逻辑、需要了解状态池的细节再进行通信、无法跟踪状态池变更，通信场景较多时容易出现状态混乱，维护困难等问题  

state共享即通过vuex、pinia、redux等共享存储库维护状态池，并通过shared实例暴露一些方法给子应用  
与actions模式类似，通过props手动将shared实例传递给子应用  

主应用中

```js
import shared from 'shared'; // 自行实现shared类，通过shared类代理读写vuex等状态存储库
registerMicroApps([
  {
    name:'sub-app';
    // ...
    props:{ shared }, // 注册微应用时通过props手动传递shared实例
  }
])
```

子应用中

```js
// 子应用中应该实现类似的shared用于独立运行时处理兼容
// main.js 入口文件中尝试读取并初始化shared
function render(props = {}){ // 若props中传入了shared则使用并重载，若无则使用子应用中的shared
  const { shared = SharedModule.getShared() } = props;
  SharedModule.overloadShared(shared);
}
```

这样通过自由选择的状态存储库可实现跟踪变化，子应用仅需了解shared规范，无需了解状态池细节  
但对应的主应用需要耽误维护一套状态池，子应用需要单独维护shared  

### 其他问题

### 源码解读
