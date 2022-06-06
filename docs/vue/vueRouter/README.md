# vueRouter从基础到原理

## 基本概念

vue-router封装了一个全局混入，定义了两个挂载在原型上的变量，注册了两个组件;  
支持三种路由方式：hash, history, abstract  
提供两种组件:`<router-link>`、 `<router-view>`  
定义两个变量：`$router`, `$route`  
暴露了一系列实例方法和钩子函数  
vue-router 3.*.* 版本[项目地址](https://github.com/vuejs/vue-router)

路由导航解析流程:

1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

## 基础使用

详细使用方法见:[官方文档](https://router.vuejs.org/zh/)  

- 路由的绑定与vuex类似  

```js
// router/index.js  
import VueRouter from 'vue-router'  
import MyComponent from '../component/MyComponent' // 引入自定义组件  
export default new VueRouter({  
  routes:[  
    {path:'/myComponent', component: MyComponent}, // 配置项  
    {  
      path: '/mutilRouter',  
      name:'namedRouter', // 命名路由  
      components: {default:MyComponent1, a:MyComponent2}, // 对应命名视图  
      children:[ // 多级路由children配置与routes类似  
        {path：'child1', component:child1} // 子路由中可省略根路径'/'字符  
        {path：'child2/:arg1/:arg2', component:child2} // 配置:arg1占位表示params方式路由传参  
      ]  
    }  
  ]  
})  
// main.js  
import VueRouter from 'vue-router'  
import router from './router'  
Vue.use(VueRouter)  
new Vue({  
  router:router,  
  ... // 此处省略了其他配置项  
})  
```  

- 路由的使用  
  
```html  
<!-- 导航组件中 -->  
<router-link to="/myComponent">我的组件</router-link> <!-- 最终会被编译为<a>标签 -->  
<router-link to="/mutilRouter/child1">子组件中的多级路由</router-link>  
<!-- 导航组件中内容展示区占位 -->  
<router-view>路由占位符/多级路由也适用</router-view>  
<router-view name="a">命名视图占位符</router-view>  
  
<!-- 路由传参 -->  
<router-link :to="`/mutilRouter/child1?arg1=${this.arg1}&arg2=${this.arg2}`">拼字符串的形式传递路由query参数</router-link>  
<router-link :to="`/mutilRouter/child2/${this.arg1}/${this.arg2}`">拼字符串的形式传递路由params参数</router-link>  
<router-link :to="{  
  path:'/mutilRouter/child1',  
  // name:namedRouter, // 若定义了命名路由可直接写name不用写path属性  
  query:{arg1:this.arg1, arg2:this.arg2},  
  // params:{arg1:this.arg1, arg2:this.arg2} //params方式传参  
}">传对象形式传递路由query参数</router-link>  
<!-- 被路由的组件中 -->  
<div>{{$route.query.arg1}}</div>  
```  

路由配置中可传递固定参数props,子组件中能够通过props属性访问到对应的参数  
  
- 路由方式与编程式路由导航  
  
默认路由方式为push模式,url访问历史以push的方式记录,设置标签replace属性:`<router-link replace>`该路由模式改为replace模式,新的url访问历史将不断替换上一条记录  

```js
this.$router.push(Object) // Object参数与标签中to参数类似  
this.$router.replace(Object) // 以replace模式路由  
this.$router.back() // 后退  
this.$router.forward() // 前进  
this.$router.go(n) // 前进或后退n条记录  
```  
  
- 路由中的生命周期函数  
  
通过一下方式可以缓存路由组件,以便进行快速路由切换.被缓存的组件中定时器等回调不会停止运行  

```html  
<keep-alive include="要缓存的路由组件名">  
<!-- <keep-alive :include="['组件1', '组件2']"> -->  
  <router-view></router-view>  
</keep-alive>  
<!-- 若跳转至其上级路由，由于父组件被销毁，因此子组件也会被销毁 -->  
```  

路由组件中独有的两个声明周期函数  

```js
activated(){  
  // 被路由展示时触发  
  // 在此函数中启动激活交互所需的事件/定时器  
}  
deactivated() {  
  // 路由切走,组件被缓存时触发  
  // 在此事件中停止失活后不需要的事件/定时器  
}  
```  
  
- 路由守卫  
  
```js
// 全局路由守卫,初始化及每次路由切换之前被调用  
router.beforeEach((to, from, next) => {  
  // to 要路由到的目标route  
  // from 发起跳转的来源  
  // next回调函数,调用对该路由请求放行  
})  
// 后置路由守卫,初始化及每次路由切换后调用  
router.afterEach((to, from) => {  
})  
// 独享路由守卫,通过beforeEnter属性添加到routes配置对应的路由中  
{  
  name:'要守卫的路由', path:'/before', component: Home,  
  beforeEnter: (to, from, next) => {  
    // 仅该路由及其子路由会被拦截  
  }  
}  
// 组件内路由守卫路由规则卸载组件内,与生命周期函数平级  
{  
  mounted(){},  
  beforeRouteEnter(to, from, next) {  
    // 通过路由规则进入该组件时被调用  
  }  
  beforeRouteLeave(to, from, next) {  
    // 通过路由规则离开该组件时被调用  
  }  
}  
```

## 原理

TODO

## 源码核心简读

## 手写实现
