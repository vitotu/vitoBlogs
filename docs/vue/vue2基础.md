# 概述  
vue2基础语法(解决怎么用问题)
# vue2  
参考尚硅谷的vue2教程
视频教程[地址](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=1)  

## 模板语法：  
  
在html中书写`{{表达式}}`,`v-指令:属性='表达式'`等语法样式，这些语法样式由Vue实例来解析。这种方式被成为模板语法  
  
## 响应式  
- 响应式基础特性
  1. Vue2在组件实例上设置属性,代理访问data配置项中的数据(vm.key与vm._data.key同源).  
  2. data配置项中数组对象的响应式是通过数组包装Array类型的原生`push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()`等函数来实现的，因此在修改数组类型的数据时，想要响应式的更新都各调用处，需要使用数组方法来修改数组而不是直接使用索引。  
  3. data配置项中的对象都设置的了数据代理，新加的属性想要获得响应式，需要通过`Vue.set(target，propertyName/index，value)`方法或方法内`vm.$set(target，propertyName/index，value)`进行设置  
  4. 特别注意：`Vue.set()`和`vm.$set()`不能给vm 或 vm的根数据对象 添加属性！！！  


## data配置项  
  
在vm实例中data的配置项可以写成对象形式,但在组件中由于组件的复用特性,data对象必须写成回调函数的形式  
  
Vue获取配置项中的data对象后,对data对象进行代理(深度遍历对象给属性添加getter,setter等),然后将改造后的data对象赋给vm实例的`_data`属性,同时覆盖原有的对象引用,伪代码表示如下:  
```JavaScript  
let a = {} // data对象  
let b = a  
const vm = new Vue({  
  data:a // 省略其他配置项  
})  
console.log(vm._data === a) // true  
console.log(vm._data === b) // false  
// 原有的对象引用a被覆盖了,因此不等于b对象  
```  
  
## 根实例vm  
  
vm取名字'mvvm'模型中的最后两个字符vm;model(数据),view(视图html),view-model(视图模型之间的映射)  
  
## 事件处理  
  
* Vue中的事件修饰符：  
  
1. prevent：阻止默认事件（常用）；  
2. stop：阻止事件冒泡（常用）；  
3. once：事件只触发一次（常用）；  
4. capture：使用事件的捕获模式；  
5. self：只有event.target是当前操作的元素时才触发事件；  
6. passive：事件的默认行为立即执行，无需等待事件回调执行完毕；  
7. native: 使用浏览器原生事件  
  
* 按键  
  
1. Vue中常用的按键别名：  
	回车 => enter  
	删除 => delete (捕获“删除”和“退格”键)  
	退出 => esc  
	空格 => space  
	换行 => tab (特殊，必须配合keydown去使用)  
	上 => up  
	下 => down  
	左 => left  
	右 => right  
  
2. Vue未提供别名的按键，可以使用按键原始的key值去绑定，但注意要转为kebab-case（短横线命名）  
  
3. 系统修饰键（用法特殊）：ctrl、alt、shift、meta  
	(1).配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。  
	(2).配合keydown使用：正常触发事件。  
  
4. 也可以使用keyCode去指定具体的按键（不推荐）  
  
5. Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名  
  
  
* 自定义事件  
  
自定义事件也可用于父子组件通信  
标签中绑定自定义事件的方式:  
`<MyComponent @自定义事件='处理函数'/>`或  
```html  
<MyComponent ref='myComponent'/>  
<script>  
  this.$refs.myComponent.$on('自定义事件', 处理函数)   
  // 触发后处理函数的调用方仍然是该组件,  
  // 若采用箭头函数,则无法读取当前组件的实例this,因此推荐使用在methods中定义的函数  
  this.$refs.myComponent.$once('自定义事件a', 处理函数) // 仅触发一次  
</script>  
```  
被绑上自定义事件的子组件可触发对应的事件并回传数据,如:`this.$emit('自定义事件a',params)`  
  
子组件在被销毁前需在beforeDestroy生命周期函数中进行解绑自定义事件`beforeDestroy(){this.$off(String单个事件|Array多个事件|不传参默认所有事件)}`  
  
* 事件总线  
  
由于直接使用自定义事件在组件直接进行通讯有局限性,事件总线通过在vue原型上绑定vue根实例vm作为公共组件`$bus`,在`$bus`上绑定和触发事件来实现任意组件间的通信,如下代码  
```JavaScript  
// 原型上$bus绑定根实例vm  
new Vue({  
	el:'#app',  
	render: h => h(App),  
	beforeCreate() {  
		Vue.prototype.$bus = this //安装全局事件总线  
	},  
})  
// 任意组件上绑定事件,解绑时请慎用解绑全部事件的写法  
this.$bus.$on('hello',(data)=>{  
  console.log('我是School组件，收到了数据',data)  
})  
// 另一组件上触发  
this.$bus.$emit('hello',this.name)  
```  
与事件总线相类似的还有使用第三方库pubsub-js的消息发布订阅方式，用法与事件总线类似  
  
  
## 绑定样式  
  
1. class样式  
写法`:class="xxx"` xxx可以是字符串、对象、数组。  
    字符串写法适用于：类名不确定，要动态获取。  
    对象写法适用于：要绑定多个样式，个数不确定，名字也不确定。  
    数组写法适用于：要绑定多个样式，个数确定，名字也确定，但不确定用不用。  
2. style样式  
   `:style="{fontSize: xxx}"`其中xxx是动态值。  
   `:style="[a,b]"`其中a、b是样式对象。  
  
## 列表渲染  
可遍历：数组、对象、字符串（用的很少）、指定次数（用的很少）  
  
> react、vue中的key有什么作用？（key的内部原理）  
1. 虚拟DOM中key的作用：  
	key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据【新数据】生成【新的虚拟DOM】,   
	随后Vue进行【新虚拟DOM】与【旧虚拟DOM】的差异比较，比较规则如下：  
2. 对比规则：  
  (1). 旧虚拟DOM中找到了与新虚拟DOM相同的key：  
      ①.若虚拟DOM中内容没变, 直接使用之前的真实DOM！  
      ②.若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM。  
  (2). 旧虚拟DOM中未找到与新虚拟DOM相同的key  
      创建新的真实DOM，随后渲染到到页面。	  
3. 用index作为key可能会引发的问题：  
  a. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:  
    会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。  
  b. 如果结构中还包含输入类的DOM：  
    会产生错误DOM更新 ==> 界面有问题。  
4. 开发中如何选择key?:  
  a. 最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。  
  b. 如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，  
  使用index作为key是没有问题的。  
  
  
  
## 表单  
  
收集表单数据：  
若：`<input type="text"/>`，则v-model收集的是value值，用户输入的就是value值。  
若：`<input type="radio"/>`，则v-model收集的是value值，且要给标签配置value值。  
若：`<input type="checkbox"/>`  
  1.没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）  
  2.配置input的value属性:  
    (1)v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）  
    (2)v-model的初始值是数组，那么收集的的就是value组成的数组  
备注：v-model的三个修饰符：  
  lazy：失去焦点再收集数据  
  number：输入字符串转为有效的数字  
  trim：输入首尾空格过滤  
  
## 过滤器  
过滤器：  
	定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）。  
	语法：  
    1.注册过滤器：Vue.filter(name,callback) 或 new Vue{filters:{}}  
    2.使用过滤器：{{ xxx | 过滤器名}}  或  v-bind:属性 = "xxx | 过滤器名"  
	备注：  
    1.过滤器也可以接收额外参数、多个过滤器也可以串联  
    2.并没有改变原本的数据, 是产生新的对应的数据  
  
## 指令  
* 常用的指令：  
    v-bind	: 单向绑定解析表达式, 可简写为 `:xxx`  
    v-model	: 双向数据绑定  
    v-for  	: 遍历数组/对象/字符串  
    v-on   	: 绑定事件监听, 可简写为@  
    v-if 	 	: 条件渲染（动态控制节点是否存存在）  
    v-else 	: 条件渲染（动态控制节点是否存存在）  
    v-show 	: 条件渲染 (动态控制节点是否展示)  
* v-text指令：  
    1.作用：向其所在的节点中渲染文本内容。  
    2.与插值语法的区别：v-text会替换掉节点中的内容，{{xx}}则不会。  
* v-html指令：  
    1.作用：向指定节点中渲染包含html结构的内容。  
    2.与插值语法的区别：  
      (1).v-html会替换掉节点中所有的内容，{{xx}}则不会。  
      (2).v-html可以识别html结构。  
    3.严重注意：v-html有安全性问题！！！！  
      (1).在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击(如：通过插入html向特定网站发送用户的cookie等数据)。  
      (2).一定要在可信的内容上使用v-html，永不要用在用户提交的内容上！  
* v-cloak指令（没有值）：  
    1.本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。  
    2.使用css `diaplay:none`配合v-cloak可以解决网速慢时页面展示出模板`{{xxx}}`的问题。  
* v-once指令：  
    1.v-once所在节点在初次动态渲染后，就视为静态内容了。  
    2.以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。  
* v-pre指令：  
    1.跳过其所在节点的编译过程。  
    2.可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。  
* 自定义指令总结：  
   1. 定义语法：  
      (1).局部指令：  
        `new Vue({directive:{指令名:配置对象}})`或  
        `new Vue({directive{指令名:回调函数}})`  // 简写模式回调函数默认是指bind和update  
      (2).全局指令：  
        `Vue.directive(指令名,配置对象/回调函数)`  
  
   2. 配置对象中常用的3个回调：  
      (1)`.bind(element, binding)`：指令与元素成功绑定时调用。  
      (2)`.inserted(element, binding)`：指令所在元素被插入页面时调用。  
      (3)`.update(element, binding)`：指令所在模板结构被重新解析时调用。  
  
   3. 备注：  
      1.指令定义时不加v-，但使用时要加v-；  
      2.指令名如果是多个单词，要使用kebab-case命名方式，不要用camelCase命名。  
  
>`v-if`指令应该注意的地方
>>`v-if`指定修饰的节点在条件变为不满足时，将摧毁该节点及其子节点；当条件再变为满足时，新创建的节点及子节点与原有节点不同；  
  这点在echarts这类需要持有DOM实例进行渲染的库中，由于持有的旧DOM实例与新节点的DOM实例不同，会出现不能渲染的情况，解决方案是在此类场景中使用`v-show`或重新获取新节点DOM并初始化echarts实例  
  `v-if`与`v-else-if`等条件语句之间还存在着直接子节点复用的情况，添加key值可避免复用的情况发生  
  总结下来高频切换用`v-show`，否则用`v-if`  
  
## 生命周期  
  
![avatar](https://cn.vuejs.org/images/lifecycle.png)  
* 常用的生命周期钩子：  
    1.mounted: 发送ajax请求、启动定时器、绑定自定义事件、订阅消息等【初始化操作】。  
    2.beforeDestroy: 清除定时器、解绑自定义事件、取消订阅消息等【收尾工作】。  
  
* 关于销毁Vue实例  
    1.销毁后借助Vue开发者工具看不到任何信息。  
    2.销毁后自定义事件会失效，但原生DOM事件依然有效。  
    3.一般不会在beforeDestroy操作数据，因为即便操作数据，也不会再触发更新流程了。  
  
## 组件化编程  
Vue中使用组件的三大步骤：  
* 一、定义一个组件  
  使用Vue.extend(options)创建，其中options和new Vue(options)时传入的那个options几乎一样，但也有点区别；  
  1.编写组件时不挂载元素,因此不写el属性  
  2.data必须写成函数形式,便于组件实例化时每次都生成新的数据对象  
  3.在脚手架中推荐在options对象中使用name属性，其值命名多单词组成时可使用大驼峰(推荐方式,需在脚手架环境下)或`-`连字符的方式  
  4.组件文件名命名推荐与name属性保持一致  
  备注：使用template可以配置组件结构。  
  全局定义组件时可简写:`const school = Vue.extend(options) => const school = options`  
  
* 二、注册组件  
  1.局部注册：靠new Vue的时候传入components选项  
  2.全局注册：靠Vue.component('组件名',组件)  
  
* 三、使用组件标签：  
  闭合标签和自闭合标签(需脚手架环境)均可,vue解析标签时实例化vue组件对象  
  
* 四、组件与vm之间的关系  
  内置关系：`VueComponent.prototype.__proto__ === Vue.prototype`  
  
组件化编程中main.js文件中用于创建vm,唯一实例化的vue对象作为入口挂载组件,App.vue文件中定义根组件容器用于管理其它组件  
  
ps：构造函数的prototype显式原型属性与其实例化后的实例的__proto__隐式原型属性指向同一个原型对象  
  
* 组件的函数式调用  
  通过在父组件的生命周期中调用函数，从而使用子组件的方式。适合于简单组件如非模态的弹窗消息、loading遮罩等
  定义方式示例：
  ```js
  import Vue from 'vue';
  import MyMessage from 'MyMessage.vue'; // 以函数式调用的组件
  const MsgCreator = Vue.extend(MyMessage); // 生成MyMessage组件构造函数
  function createMessage(el, props={}) {
    const MsgVM = new MsgCreator(props).$mount(); // 实例化组件此时可传入props数据,并使用$mount函数生成DOM
    // 在此函数中还可通过事件监听、设置el等方式添加更多功能
    el.appendChild(MsgVM.$el); // 操作DOM将组件追加到传入的el子元素末尾
    return MsgVM // 返回MsgVM实例以便功能扩展
  }
  export {createMessage}  // 暴露函数，调用方引入该函数并调用即可使用MyMessage组件
  ```

## 脚手架  
  
main.js文件中使用`render: h => h(App)`的原因是  
通过脚手架import的vue只包含核心功能没有模板解析器，因此不能使用template配置项，需要使用render函数接收到的createElement函数(简写为h)去指定具体内容  
render函数将App组件放入容器中  
  
## 组件属性及配置  
* ref属性  
```html  
<School ref='sch'>  
this.$refs.sch 可获取到真实的DOM元素或School组件实例对象  
</School>  
```  
* props属性  
  
父传子直接在props中传递数据即可，子传父需父组件先传递回调函数，子组件通过调用回调函数的方式向父组件传递数据，在子组件中不推荐直接修改父组件传过来的props数据  
  
props用于父子组件通信,常用写法如下:  
```JavaScript  
//简单声明接收  
props:['name','age','sex']  
// 类型限制  
props:{name:String}  
// 类型限制+默认值的指定+必要性的限制  
props:{  
  name:{  
    type:String,  
    required:true, // 与default属性二选一  
    // default:'张三'  
  }  
}  
```  
  
* mixin混入  
  
将vue配置项的一部分提取出去,给各组件复用的方式称为混入;  
局部混入:通过import导入对象,在配置项中使用`mixins:[mixinObj1,mixinObj2]`  
全局混入:全局混入将混入每一个vue实例中,导入后,通过`Vue.mixin(mixinObj1)`逐个混入  
混入的配置项若有重复,不会覆盖原配置,  
  
* 插件  
  
在实例化vm之前,调用`Vue.use(plugins,params)`的方式挂载插件,传入plugins对象中必须包含install方法,install可以接收到Vue构造函数和params参数,在此阶段全局过滤器,全局混入,第三方库等功能挂载到原型对象上,增加vue的功能  
  
* scoped  
  
在vue文件中`<style scoped></style>`中使用该属性,标签中的属性将只在本组件中生效.  
vue是通过将模板中的标签加入`data-生成数字`属性来约束样式的  
  
* `$nextTick`  
  
`$nextTick`属性用于传入一个回调函数,该函数在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM.  
`$nextTick`也算是生命周期图之外的一个生命周期函数  
  
* 过渡动画  
  
vue中还支持使用标签`<transition></transition>`或`<transition-group></transition-group>`设置过渡效果,详见[官方文档](https://cn.vuejs.org/v2/guide/transitions.html)  
  
* vue-resource  
  
vue-resource是vue1.×版本提供的ajax请求插件,vue2.0以后不再维护,推荐使用axios发起ajax请求  
  
  
## 插槽  
vue通过插槽向子组件中传递html结构  
由于结构是在父组件中定义的,所以结构的样式和数据也可引用父组件  
* 默认插槽  
```html  
<!-- 父组件中 -->  
<子组件>要插入的html结构</子组件>  
<!-- 子组件中 -->  
<slot>默认值/结构</slot> <!-- 要插入的html结构占位符 -->  
```  
  
* 具名插槽  
```html  
<!-- 父组件中 -->  
<子组件>  
  <html结构1 slot='占位1'></html结构1>  
  <html结构2 slot='占位2'></html结构2>  
</子组件>  
<!-- 子组件中 -->  
<slot name='占位1'>默认值/结构</slot>  
<slot name='占位2'>默认值/结构</slot>  
```  
  
* 作用域插槽  
```html  
<!-- 父组件中 -->  
<template scope='childrenParams'> <!-- 可接收子组件传来的参数childrenParams(可自命令) -->  
  <html结构>{{childrenParams}}</html结构>  
</template>  
<!-- 子组件中 -->  
<slot :params1="data1" params2='string2'></slot> <!-- 可传递多个参数，将被包裹在一个对象中 -->  
```  
## vuex  
vuex用于同一管理全局组件共享的数据,[官方文档](https://vuex.vuejs.org/zh/)  
![avatar](https://vuex.vuejs.org/vuex.png)  
  
* 绑定vuex插件  
  
vuex需要在vm实例化时,绑定实例对象到vm上,因此通常的做法时,创建一个js文件引入vue和vuex,在文件中使用Vue.use(Vuex)应用插件,随后创建并暴露`const store = new Vuex.Store({actions, mutations,state})`对象.  
在main.js文件中引入该对象,并配置到vue实例配置对象中`new Vue({...,store})`  
  
* vuex配置项  
如上图vuex有  
  actions: 响应组件中对应的`this.$store.dispatch('key', params)`动作  
  mutations: 响应组件或actions中的`this.$store.commit('KEY', params)`动作,用于操作数据  
  state: 用于存储数据  
  getters: 用于将state中的数据加工,类似于组件的计算属性  
  
* vuex库上的map方法  
  
`mapState(['state1', 'state2'])`和`mapGetters(['getter1'])`均可用于生成计算属性从state或getters中获取对应的数据  
`mapMutations({fun1:'MUTA1', fun2:'MUTA2'})`和`mapActions({fun1:'act1', fun2:'act2'})`可用于生成mutations或actions中的方法  
  
上述map*方法返回值均为对象,需要配合解构赋值使用,这些方法均支持数组或对象的方式传参  
  
* vuex模块化  
  
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
  
## 路由  
详细使用方法见:[官方文档](https://router.vuejs.org/zh/)  
* 路由的绑定与vuex类似  
```JavaScript  
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
* 路由的使用  
  
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
  
* 路由方式与编程式路由导航  
  
默认路由方式为push模式,url访问历史以push的方式记录,设置标签replace属性:`<router-link replace>`该路由模式改为replace模式,新的url访问历史将不断替换上一条记录  
```JavaScript  
this.$router.push(Object) // Object参数与标签中to参数类似  
this.$router.replace(Object) // 以replace模式路由  
this.$router.back() // 后退  
this.$router.forward() // 前进  
this.$router.go(n) // 前进或后退n条记录  
```  
  
* 路由中的生命周期函数  
  
通过一下方式可以缓存路由组件,以便进行快速路由切换.被缓存的组件中定时器等回调不会停止运行  
```html  
<keep-alive include="要缓存的路由组件名">  
<!-- <keep-alive :include="['组件1', '组件2']"> -->  
  <router-view></router-view>  
</keep-alive>  
<!-- 若跳转至其上级路由，由于父组件被销毁，因此子组件也会被销毁 -->  
```  
路由组件中独有的两个声明周期函数  
```JavaScript  
activated(){  
  // 被路由展示时触发  
  // 在此函数中启动激活交互所需的事件/定时器  
}  
deactivated() {  
  // 路由切走,组件被缓存时触发  
  // 在此事件中停止失活后不需要的事件/定时器  
}  
```  
  
  
* 路由守卫  
  
```JavaScript  
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
  
# Vue3.0  
[笔记](./vue3快速上手.md)  
  
***  
# Cookbook  
参考资料[Cookbook](https://cn.vuejs.org/v2/cookbook/)中主要介绍了vue的编程技巧  
  
## 添加实例property  
`vue.prototype.$appName = 'My App'`其中$符号是为了避免命名冲突而约定的符号。    
当在原型时绑定自定义函数时，该函数通过this，能够访问到实例的作用域。    
为了保证安全，应尽量避免使用该模式  
  
## 表单校验

## vue-cli

## vue lib模式打包生成umd文件笔记
通过使用vue[打包命令](https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%93)中的target参数 指定构建模式为lib，可打包生产umd文件。  
lib模式下默认不会打包vue，若要打包vue可使用命令```vue-cli-service build --target lib --inline-vue```
打包完成后可生成文件  
×××.common.js: 一个给打包器用的 CommonJS 包 (不幸的是，webpack 目前还并没有支持 ES modules 输出格式的包)  
×××.umd.js: 一个直接给浏览器或 AMD loader 使用的 UMD 包  
×××.umd.min.js: 压缩后的 UMD 构建版本  
×××.css: 提取出来的 CSS 文件 (可以通过在 vue.config.js 中设置css: { extract: false } 强制内联)  
## 关联问题js模块化历史
1. 立即执行函数  
通过立即执行函数封装一个局部作用域
2. CommonJS标准  
nodejs出现后为了解决打包文件相互依赖问题，出现了commonjs语法
引入使用var fs = require('fs'), 导出使用module.export a = 1;
3. AMD(异步模块定义)  
Commonjs是同步执行，但浏览器经常需要异步加载资源，于是有了AMD的语法，通过回调方式拿到异步变量 require('vue', (Vue) => {new Vue();})
4. import/export  
为了统一2、3两种方式js委员会发布了标准的import/export语法，通过import导入模块，export导出模块。同时，这种打包方式能够更好的在编译时进行静态优化
这种标准随之es6标准一起出现，因此也称这种模块为es6模块

UMD(统一模块定义):这种模块语法会自动监测开发人员使用的是 Common.js/AMD/import/export 种的哪种方式，然后再针对各自的语法进行导出，这种方式可以兼容所有其他的模块定义方法。