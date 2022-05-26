# vuex基础到原理

## 基本概念与性质

Vuex是vue的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
Vuex实现了一个单项数据流，通过创建一个全局的 State 数据，组件通过commit操作触发mutation或通过dispatch触发action间接触发mutation来操作state中的数据  
通常Mutation用于同步的修改state中的数据，而action用于异步的使用mutation，保证不会有写入冲突  
state的响应式借用vue组件的data选项实现，getter方法及响应式则与vue组件的computed属性相似

## 基础使用

vuex用于同一管理全局组件共享的数据,[官方文档](https://vuex.vuejs.org/zh/)  
![vuex.png](https://vuex.vuejs.org/vuex.png)  
  
- 绑定vuex插件  
  
vuex需要在vm实例化时,绑定实例对象到vm上,因此通常的做法时,创建一个js文件引入vue和vuex,在文件中使用Vue.use(Vuex)应用插件,随后创建并暴露`const store = new Vuex.Store({actions, mutations,state})`对象.  
在main.js文件中引入该对象,并配置到vue实例配置对象中`new Vue({...,store})`  
  
- vuex配置项 
如上图vuex常用配置项有  
  - actions: 响应组件中对应的`this.$store.dispatch('key', params)`动作(通常与后端api进行交互，异步的提交mutation操作数据)
  - mutations: 响应组件或actions中的`this.$store.commit('KEY', params)`动作,用于同步操作数据
  - state: 用于存储数据  
  - getters: 用于将state中的数据加工,类似于组件的计算属性，通过属性方式访问时会缓存结果，通过方法的方式访问时，每次都会进行调用
  - modules：用于配置其他子模块，子模块中可配置namespaced开启命名空间
  - plugins:`Array<function>`，所有的function都将被传入store实例用于插件功能扩展，插件中不允许直接修改state

- vuex库上的map方法  
  
`mapState(['state1', 'state2'])`和`mapGetters(['getter1'])`均可用于生成计算属性从state或getters中获取对应的数据  
`mapMutations({fun1:'MUTA1', fun2:'MUTA2'})`和`mapActions({fun1:'act1', fun2:'act2'})`可用于生成mutations或actions中的方法  
  
上述map*方法返回值均为对象,需要配合解构赋值使用,这些方法均支持数组或对象的方式传参  
  
- vuex模块化  
  
将不同种类的数据拆分成文件a.js和b.js  

```JavaScript  
// store/a.js  
export default {  
  namespaced: true, // 用于与b文件的数据进行区分  
  actions...,  
  mutations...,  
  state...,  
  ...  // 更多配置项见官方文档  
}  
// store/index.js  
import a from './a'  
export default new Vuex.Store({  
  modules:{a:a, b:b}  
})  
// 调用方  
this.$store.state.a.state1 // 获取state数据  
this.$store.getters['a/get1'] // 获取a命名空间中的get1  
this.$store.dispatch('a/act1', params) // 触发a命名空间中act1,并传入params参数  
this.$store.commit('a/MUTA1', params) // 与上类似  
...mapState('a', {val1:'state1', val2:'state2'}) // 使用解构赋值放在对应的方法中  
...mapGetters('a', {val1:'getter1'})  
...mapMutations('a', ['MUTA1', 'MUTA2'])  
...mapActions('a', ['act1', 'act2'])  
```

默认情况下(namespaced为false)的情况，模块内部的mutations、actions、getters是注册到全局命名空间的，仅state是局部作用  
vuex的根模块和子模块之间是通过树形结构组织起来的

## 源码核心简读

源码[项目地址](https://github.com/vuejs/vuex.git)  
查看版本3.6.2的src目录主要文件：  
├── module  // vuex模块化处理 主要是对state的处理，最后构建成一棵 module tree  
│   ├── module.js // 主要导出一个Module类 vuex中模块的功能  
│   └── module-collection.js // 主要导出一个ModuleCollection类  
├── plugins  // 两个插件  
│   ├── devtool.js  // 调试  
│   ├── logger.js   // 日志  
├── helpers.js  // map系列辅助函数 api  
├── index.esm.js  // 用于es module的打包  
├── index.js   // 入口文件 抛出 Store和 mapActions 等api 用于commonjs的打包  
├── mixin.js   // 提供install方法，用于注入$store  
├── store.js  // vuex的核心代码 store 仓库  
├── util.js  // 一些工具函数库，如deepClone、isPromise、assert  

```js
// vuex的使用需要经历以下阶段(伪代码中省略了需要引入的库)
Vue.use(Vuex); // 插件机制
const store = new Vuex.Store({...options}) // 实例化store
new Vue({ // 挂载到vm实例上
  store,
  ...
}).$mount('#app');
```

- 全局安装

index.js文件中暴露了源自store.js的Store和install方法，以及辅助函数和日志插件  

install方法中判断是否重复安装否则利用Vue.mixin将vuexInit混入beforeCreate钩子中  

vuexInit方法将vue的options.store挂载到`this.$store`上,若不存在则从父组件的`$store`上取，借助vue组件实例化过程能够保证所有组件中`$store`指向同一对象store  

- 实例化Store

Store中实例化了一个vue对象，借助该vue对象的data和computed属性实现state和getters的响应式，内部维持了一个ModuleCollection对象，用于收集子模块依赖和处理namespaced命名空间，保存module树  
Store实例提供了commit、dispatch、get/set state等方法，在构造函数中主要过程有：

  1. 利用ModuleCollection递归的注册子模块形成模块树
  2. installModule函数将options(state、actions、mutations等配置)依次注册到store对象上，其中state为树形结构，而mutation、action等方法均以namespace字符串为key进行wrap并挂载到store的对应属性上，对于childModule则进行递归调用注册安装
  3. resetStoreVM函数中新建一个vm实例利用data和computed属性设置state和getters的响应式，并在oldVM存在时销毁oldVM

ps：不要在生产环境将strict设置为true，strict通过`_withCommit`拦截非commit的方式修改state的行为，需要深度监听state树，严重影响性能  
不可在v-model中使用store属性，因为严格模式中仅支持使用commit方法修改store属性，需要进行双向绑定时需要通过`get/set`的computed属性或通过监听input或change事件去修改

- 模块动态注册与卸载

调用store实例的registerModule(path, module)方法可动态注册模块，逻辑与初始化store逻辑相同，先挂载到模块树上，然后调用installModule和resetStoreVM方法  
unregisterModule(path)用于卸载动态注册的模块，不可卸载创建store时的注册的模块，方法中将通过Vue.delete删除state，重置并重载getters、mutations等方法，从模块树中删除该模块

## 手写实现

TODO
