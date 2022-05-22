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
如上图vuex有  
  actions: 响应组件中对应的`this.$store.dispatch('key', params)`动作  
  mutations: 响应组件或actions中的`this.$store.commit('KEY', params)`动作,用于操作数据  
  state: 用于存储数据  
  getters: 用于将state中的数据加工,类似于组件的计算属性  
  
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
