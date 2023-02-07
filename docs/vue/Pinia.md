# Pinia状态存储库

## 概述

Pinia是vue的专属状态存储库，与vuex处于同一生态位，但pinia同时支持组合式api和选项式api，同时兼容vue2和vue3两个版本

与vuex相比,Pinia删除了mutation，扁平化结构无需嵌套，无需包装器来支持ts  

在vue3中：

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

在vue2中

```js
import { createPinia, PiniaVuePlugin } from 'pinia'
Vue.use(PiniaVuePlugin)
const pinia = createPinia()
new Vue({
  el: '#app',
  pinia, // 请注意，同一个`pinia'实例，可以在同一个页面的多个 Vue 应用中使用。 
})
```

## Store

- 定义Store

```js
import { defineStore } from 'pinia';
// Store由defineStore定义， 其返回值命名应当以use开头，且已Store结尾
export const useStore = defineStore('main', { // 第一个参数为id
  // 第二个参数可以是option或setup函数类型
  state:() => ({count:0}),
  getters:{ double:(state)=>state.count*2},
  actions:{increment(){this.count++}}
})
export const useSetUpStore = defineStore('sub', ()=>{
  // setup函数类型
  const count = ref(0); // state
  const double = computed(()=>count.value*2); // getters
  function increment(){count.value++} // actions
  return {count, double, increment }
})
```

- 使用Store

```vue
<script setup> // vue3中
import { useStore } from '@/store/counter';
const store = useStore(); // 调用后store才会被创建
// store 是一个用 reactive 包装的对象,可使用storeToRefs()函数解构出其属性且保留了响应式
</script>
```

## state

state与组件中的data类似，定义成一个返回初始状态的函数；  
使用store实例即可直接访问和修改state：`store.count++`;通过`store.$reset()`重置state为初始值  

- 辅助函数

在选项式api中同样有`mapState()`辅助函数可以映射state为计算属性

```js
import {mapState, mapWritableState} from 'pinia;
import { useCounterStore } from './stores/counter';
// ...
export default {
  computed:{
    ...mapState(useCounterStore, ['count']),
    ...mapState(useCounterStore, {
      myOwnName:'count',
      double: store => store.count*2, // 可以通过函数获取访问权
      calNum(store){ // 可访问this，获取之前定义过的data或computed
        return store.someGetter + this.count + this.double;
      }
    })
    ...mapWritableState(useCounterStore, ['count']), // 此方法的映射可直接修改state
  }
}
```

- `$patch`

除了直接修改state外，给store.$patch()传递一个对象或函数可以可以用于同时修改多个state属性  
不可对`store.$state`完全替换(整体赋值)，只能通过`$patch`进行更新  

- `$subscribe`

通过`store.$subscribe(callback, options)`方法侦听state的变化，与普通watch相比，`$subscribe`在patch后仅更新一次  
在setup中使用时，订阅器会被绑定到它们的组件上，组件被卸载时，将被自动删除，若要在卸载后继续保留，需要传递options参数`{detached:true}`

## getter

getter完全等同于store的计算值，函数接收state为参数，但也可通过this访问到整个store实例  
向getter传递参数需要在getter中返回一个接收参数的函数，然后就可以像函数调用一样使用getter，但这样做getter将不再被缓存  
上节中的mapState辅助函数同样也可以用来映射getter

## action

Action 相当于组件中的 method，action同样也可以用this访问到store实例，并且action可以是异步的

- 辅助函数

mapActions()可以将action属性映射为组件中的方法

- `$onAction()`

使用`store.$onAction(callback, options)`监听action和它们的结果，callback将在action本身之前执行

```js
const callback = ({ // callback函数
  name, // action名称
  store,// store实例
  args, // 传递给action的参数数组
  after, // 在action返回或resolve后的钩子函数，类似生命周期函数
  onError, // action抛出或拒绝的钩子函数
}) => {
  after(afterCallback);
  onError(onErrorCallback);
}
// 与state中的订阅相同，若要在组件卸载后保留，需传递第二个参数true
const unsubscribe = store.$onAction(callback, true); // 传递true在组件卸载后保留订阅
unsubscribe() // 手动删除监听器
```

## 插件

`pinia.use()`方法支持扩展pinia实例的功能(添加属性、选项、方法、包装、副作用，修改、取消action等)  

```js
import { createPinia } from 'pinia'
// 在安装此插件后创建的每个 store 中都会添加一个名为 `secret` 的属性。
function SecretPiniaPlugin({  // 插件可以保存在不同的文件中，本质是一个函数
  pinia, // 接收可选参数context，包含属性pinia，可使用createPinia()方法
  app, // 用createApp() 创建的当前应用(仅限Vue3)
  store, // 想扩展的store
  options // 定义传给 `defineStore()` 的 store 的可选对象
}) { // 直接返回对象扩展store或通过store参数添加属性
  return { secret: 'the cake is a lie' }
}
const pinia = createPinia()
pinia.use(SecretPiniaPlugin) // 将该插件交给 Pinia,此后创建的store才会生效
// 在另一个文件中使用， 每个store都有secret属性
const store = useStore()
store.secret // 'the cake is a lie'
```

- 添加新的state

给store添加新的state属性，需要在store和store.$state上同时添加，并且使用ref或其他响应式api以便在不同的读取方式中共享相同的值  
插件对state的变更或添加(包括`store.$patch()`调用)都是在store激活之前，因此不会触发任何订阅函数  

- 添加新的外部属性

当添加外部属性、第三方类库实例或非响应式的简单之时，应该使用`markRow()`来包装

- 在插件中订阅

`store.$subscribe()`, `store.$onAction()`

- 添加新的选项

定义store时，可以创建与state、actions等同一级别的新选项，插件可以读取该选项来对action进行包装，并替换action  
在setup定义语法中，新的自定义选项作为第三个参数传递  

```js
defineStore('search', () => {}, { /* 自定义选项 */})
```

使用ts和nuxt详见[官方文档](https://pinia.vuejs.org/zh/core-concepts/plugins.html#nuxt-js)  

## 组件外使用store

大多数时候store依靠pinia实例在所有调用中共享一个store实例, 在组件中调用useStore()函数时自动给app注入了pinia实例，因此在组件外使用时需要手动给useStore函数提供pinia实例

## SSR

服务端渲染等更详细的使用方法参见[官方文档](https://pinia.vuejs.org/zh/ssr/)
