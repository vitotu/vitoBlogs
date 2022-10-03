# vue2基础使用

参考尚硅谷的vue2教程  
视频教程[地址](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=1)  

## 模板语法

vue的`.vue`文件是SFC(Single File Components 单文件组件)风格的编码，即一个文件中包含了`<template>`，`<script>`，`<style>`，详细如下：  

```vue
<template>
<!-- 在这里书写html及模板语法
此部分将通过@vue/complier-dom的处理，预编译为js的渲染函数render
template本身最终将不会被渲染为DOM结构，并且内部可以多层嵌套template -->
</template>

<script>
// 在这里书写js
</script>

<style>
/* 在这里书写css */
</style>
```

与之对应的`.jsx`风格即是在js中书写xml格式语法用于表示html结构，vue想要使用jsx风格需要自己书写render函数  
vue在`<template>`中书写`{ {js表达式}}`,`v-指令:参数='表达式'`等语法样式，这些语法样式由Vue实例来解析。这种方式统称为模板语法  

- `{ { js表达式 }}`:插值语法，其中可以引用组件上的属性，js表达式运行于沙盒中，只能访问[白名单](https://github.com/vuejs/vue/blob/v2.6.10/src/core/instance/proxy.js#L9)中的全局变量  
- 标签/自定义组件上的attribute需要使用[指令](#指令)来进行绑定，2.6.0版本后参数支持以`[参数js表达式]`的形式通过js表达式指定动态参数  

## data配置项与响应式
  
在vm实例中data的配置项可以写成对象形式,但在组件中由于组件的复用特性,data对象必须写成回调函数的形式，如  

```js
export default { // 到处vue options配置项对象用于创建组件或页面
  data(){
    return {
      a:'value of a',
    }
  },
  mounted(){
    this.a // 可直接读写data中定义的属性
  }
}
```

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

从data配置向中返回的对象将都具有响应式，即当该数据被修改后所有引用到的地方都会被同步修改

- 响应式基础特性
  1. Vue2在组件实例上设置属性,代理访问data配置项中的数据(vm.key与vm._data.key同源).  
  2. data配置项中数组对象的响应式是通过数组包装Array类型的原生`push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()`等函数来实现的，因此在修改数组类型的数据时，想要响应式的更新都各调用处，需要使用数组方法来修改数组而不是直接使用索引。  
  3. data配置项中的对象都设置的了数据代理，新加的属性想要获得响应式，需要通过`Vue.set(target，propertyName/index，value)`方法或方法内`vm.$set(target，propertyName/index，value)`进行设置  
  4. 特别注意：`Vue.set()`和`vm.$set()`不能给vm 或 vm的根数据对象 添加属性！！！

更深层次的响应式原理参见[响应式原理](./vue2plus/README.md#双向绑定与响应式)  

## 计算属性computed与监听属性watch

直接在模板语法中无法使用过于复杂的js表达式，computed属性可以用于解决此问题  
类似于属性的getter/setter，仅配置一个函数时默认为getter  
与methods中的方法相比，computed有基于响应式依赖进行缓存，只有依赖发生变化时才会重新求值，相对而言适用于计算量较大的场景  
与watch属性相比，watch属性是更通用的监听数据变化的方法，适用于当数据变化时需要执行异步或开销较大的操作时  
更多参见[computed和watch原理](./vue2plus/README.md#computed原理)  

## 根实例vm  
  
vm取名字'mvvm'模型中的最后两个字符vm;model(数据),view(视图html),view-model(视图模型之间的映射)  
  
## 事件处理  
  
- Vue中的事件修饰符：`v-on:事件名.修饰符=""`  
  
  1. .prevent：阻止默认事件（常用）；  
  2. .stop：阻止事件冒泡（常用）；  
  3. .once：事件只触发一次（常用）；  
  4. .capture：使用事件的捕获模式；  
  5. .self：只有event.target是当前操作的元素时才触发事件；  
  6. .passive：事件的默认行为立即执行，无需等待事件回调执行完毕；与.prevent同时使用时.prevent会被忽略  
  7. .native: 使用浏览器原生事件  

事件修饰符可以叠加，但会以从左到右顺序生效

- 按键`v-on:[keyup/keydown等].[按键名]=""`

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
    1).配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。  
    2).配合keydown使用：正常触发事件。  
  4. 也可以使用keyCode去指定具体的按键（已被废弃）  
  5. Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名  
  6. .exact用于精确控制系统修饰符组合触发的事件(有且仅有该键被按下时触发)

- 鼠标修饰符  
  .left  
  .right  
  .middle  

- 自定义事件  
  
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
  
- 事件总线  
  
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
  
## 绑定样式与class  
  
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

使用v-model绑定收集表单数据，对于不同的输入元素将绑定不同的property和事件：  

- `<input type="text"/>` 和 `<textarea/>` 元素使用 `value` property 和 `input` 事件；  
- `<input type="checkbox"/>` 和 `<input type="radio"/>` 使用 `checked` property 和 `change` 事件；多个checkbox可绑定到同一数组上  
- `<select>` 字段将 `value` 作为 prop 并将 `change` 作为事件。  

PS：v-model的三个修饰符：  
  lazy：失去焦点再收集数据  
  number：输入字符串转为有效的数字  
  trim：输入首尾空格过滤  
关于v-model本质是语法糖，更多详细参见[指令](#指令)中v-model和v-bind.sync对比

## 过滤器  

过滤器：(在vue3中被移除)  
 定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）。  
 语法：  
    1.注册过滤器：Vue.filter(name,callback) 或 new Vue{filters:{}}  
    2.使用过滤器：{{ xxx | 过滤器名}}  或  v-bind:属性 = "xxx | 过滤器名"  
 备注：  
    1.过滤器也可以接收额外参数、多个过滤器也可以串联  
    2.并没有改变原本的数据, 是产生新的对应的数据  
  
## 指令  

- 常用的指令：  
    v-bind : 单向绑定解析表达式, 可简写为 `:xxx`  
    v-model : 双向数据绑定  
    v-for   : 遍历数组/对象/字符串(`item in items`和`item of items`在Vue中没有区别)  
    v-on    : 绑定事件监听, 可简写为@  
    v-if    : 条件渲染（动态控制节点是否存存在）  
    v-else  : 条件渲染（动态控制节点是否存存在）  
    v-show  : 条件渲染 (动态控制节点是否展示)  
- v-text指令：  
    1.作用：向其所在的节点中渲染文本内容。  
    2.与插值语法的区别：v-text会替换掉节点中的内容，{{xx}}则不会。  
- v-html指令：  
    1.作用：向指定节点中渲染包含html结构的内容。  
    2.与插值语法的区别：  
      (1).v-html会替换掉节点中所有的内容，{{xx}}则不会。  
      (2).v-html可以识别html结构。  
    3.严重注意：v-html有安全性问题！！！！  
      (1).在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击(如：通过插入html向特定网站发送用户的cookie等数据)。  
      (2).一定要在可信的内容上使用v-html，永不要用在用户提交的内容上！  
- v-cloak指令（没有值）：  
    1.本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。  
    2.使用css `diaplay:none`配合v-cloak可以解决网速慢时页面展示出模板`{{xxx}}`的问题。  
- v-once指令：  
    1.v-once所在节点在初次动态渲染后，就视为静态内容了。  
    2.以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。  
- v-pre指令：  
    1.跳过其所在节点的编译过程。  
    2.可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。  
- 自定义指令总结：  
  1. 定义语法：  
    1).局部指令：  
      `new Vue({directive:{指令名:配置对象}})`或  
      `new Vue({directive{指令名:回调函数}})` 简写模式回调函数默认是指bind和update  
    2).全局指令：  
      `Vue.directive(指令名,配置对象/回调函数)`  

  2. 配置对象中常用的3个回调：  
    1)`bind(element, binding)`：指令与元素成功绑定时调用。  
    2)`inserted(element, binding)`：指令所在元素被插入页面时调用。  
    3)`update(element, binding)`：指令所在模板结构被重新解析时调用。  
    4)`componentUpdated`指令所在组件的VNode及其子VNode全部更新后调用
    5)`unbind`只调用一次，指令与元素解绑时调用

  3. 回调函数的参数：

        ```js
          element // 指令所绑定的元素，可直接操作DOM
          binding:{
            name // 指令名，不含v-前缀
            value // 绑定的值
            oldValue // 绑定的旧值
            expression // 字符串形式的指令表达式
            arg // 传给指令的参数, 如v-bind:arg=""中的arg
            modifiers // 修饰符对象, 如v-bind.sync => {sync:true}
          }
          vnode // 生成的虚拟节点
          oldVnode // 上一个虚拟节点
        ```

  4. 备注：  
    1.指令定义时不加v-，但使用时要加v-；  
    2.指令名如果是多个单词，要使用kebab-case命名方式，不要用camelCase命名。  
    3.指令绑定参数可以动态绑定

::: tip v-if指令应该注意的地方
`v-if`指定修饰的节点在条件变为不满足时，将摧毁该节点及其子节点；当条件再变为满足时，新创建的节点及子节点与原有节点不同；  
这点在echarts这类需要持有DOM实例进行渲染的库中，由于持有的旧DOM实例与新节点的DOM实例不同，会出现不能渲染的情况，解决方案是在此类场景中使用`v-show`或重新获取新节点DOM并初始化echarts实例  
`v-if`与`v-else-if`等条件语句之间还存在着直接子节点复用的情况，添加key值可避免复用的情况发生  
总结下来高频切换用`v-show`，否则用`v-if`  
另外`v-if`不推荐与`v-for`一起使用，当处于同一节点时`v-for`优先级更高，`v-if`会作用于循环中的每一个item  
:::

- v-model和v-bind.sync

两个指令均可实现双向绑定，即子组件改变prop时变化能同步到父组件中  
其中`v-bind.sync` 通过自定义事件事件，在子组件中使用`this.$emit('update:prop名称', newVal)`的方式触发反向更新  
`v-bind.sync`不能与表达式一起使用，仅能提供property名  
v-bind.sync本质是语法糖  

```html
<custom-component :value.sync="value"></custom-component>
相当于
<custom-component :value="value" @update:value="value = $event"></custom-component>
```

v-model：v-model实际是v-bind.sync的语法糖，且每个组件仅能绑定一个v-model指令，对应text, textarea 的value属性反向更新绑定为input事件，而checkbox, select等为change事件,且仅能绑定到这些标签对应的固定值上  
在自定义组件中使用需要通过model选项定制其prop和event，否则默认事件为input  
在自定义组件中使用需要通过model选项定制其prop和event，否则默认事件为input，默认绑定prop为value  

```js
export default {
  model:{
    prop: 'props name',
    event: 'change' // set default input event to change event
  },
  props:{
    'props name': String
  }
}
```

ps:在vue3中v-model的使用范围已和v-bind.sync相同，并且移除了v-bind的sync修饰符  
[参考文档](https://v3.cn.vuejs.org/guide/migration/v-model.html#%E6%A6%82%E8%A7%88)  

## 生命周期  
  
![lifecycle](./resource/lifecycle.png)  

- 常用的生命周期钩子：  
    1.mounted: 发送ajax请求、启动定时器、绑定自定义事件、订阅消息等【初始化操作】。  
    2.beforeDestroy: 清除定时器、解绑自定义事件、取消订阅消息等【收尾工作】。  
  
- 关于销毁Vue实例  
    1.销毁后借助Vue开发者工具看不到任何信息。  
    2.销毁后自定义事件会失效，但原生DOM事件依然有效。  
    3.一般不会在beforeDestroy操作数据，因为即便操作数据，也不会再触发更新流程了。  

- 父子组件生命周期执行顺序
    1. 加载过程：父组件beforeCreate => 父组件created => 父组件beforeMount => 子组件beforeCreate => 子组件created => 子组件 beforeMount => 子组件mounted => 父组件mounted
    2. 更新过程：父组件beforeUpdate => 子组件beforeUpdate => 子组件updated => 父组件updated
    3. 销毁过程：父组件beforeDestroy => 子组件 beforeDestroy => 子组件 destroyed => 父组件 destroyed

## 组件化编程  

Vue中使用组件的三大步骤：  

- 一、定义一个组件  
  使用Vue.extend(options)创建，其中options和new Vue(options)时传入的那个options几乎一样，但也有点区别；  
  1.编写组件时不挂载元素,因此不写el属性  
  2.data必须写成函数形式,便于组件实例化时每次都生成新的数据对象  
  3.在脚手架中推荐在options对象中使用name属性，其值命名多单词组成时可使用大驼峰(推荐方式,需在脚手架环境下)或`-`连字符的方式  
  4.组件文件名命名推荐与name属性保持一致  
  备注：使用template可以配置组件结构。  
  全局定义组件时可简写:`const school = Vue.extend(options) => const school = options`  
  
- 二、注册组件  
  1.局部注册：靠new Vue的时候传入components选项  
  2.全局注册：靠Vue.component('组件名',组件)  
  
- 三、使用组件标签：  
  闭合标签和自闭合标签(需脚手架环境)均可,vue解析标签时实例化vue组件对象  
  
- 四、组件与vm之间的关系  
  内置关系：`VueComponent.prototype.__proto__ === Vue.prototype`  
  
组件化编程中main.js文件中用于创建vm,唯一实例化的vue对象作为入口挂载组件,App.vue文件中定义根组件容器用于管理其它组件  
  
ps：构造函数的prototype显式原型属性与其实例化后的实例的__proto__隐式原型属性指向同一个原型对象  
  
- 组件的函数式调用  
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

- 动态组件`<component>`

vue内置元素`<component v-bind:is="switchComponentName">`  
通过`is`prop绑定已注册的组件名或组件的选项对象switchComponentName上，  
组件名也可用于普通的html标签，但普通标签的value等property需要使用`.prop`修饰器修饰，否则功能异常  
还可传入异步组件`defineAsyncComponent(()=>import('component path'))`实现按需加载  
其上绑定的属性将被透传到动态指定的组件上  

- 递归组件

即组件在自己的模板中引用自身，此时要求组件有name选项或在全局注册  
编写递归组件时需要保证递归终止条件，否则会导致栈溢出max stack size exceeded错误  

- 组件间循环引用

组件间的循环引用在打包时就会形成引用悖论，引发编译错误，解决此问题有如下方式：

1. 全都进行全局注册  
2. 在首先引用的那个组件A中通过beforeCreate生命周期钩子进行引入注册`beforeCreate(){ this.$options.components.yourComponent = require('url'); }`  
3. 注册组件时使用异步`() => import('url')`的方式注册

- 函数式组件(无状态无实例)

组件内部没有管理任何状态，没有生命周期，也没有实例(没有this上下文), 仅接收一些props，类似于函数，因此可以设置functional属性`<template functional>`或`Vue.component('myComponent', {functional:true})`，将该组件变为一个函数式组件  

函数式组件若是写成渲染函数的形式，则其render 函数接收第二个参数context作为上下文，context对象包含props, children, slots, scopedSlots, data(传递给组件的整个数据对象区别与普通组件的data选项，此处还包含data.no, data.attrs等), parent, listeners(data.on的别名), injections  

前面有介绍组件的函数式调用，其本质仍然是普通组件，这是其与函数式组件最大的区别  

函数式组件本质是一个函数，与之对应的是普通的类组件，其渲染开销低于类组件。通常用于包装子组件，在将children，props，data传递给子组件前操作这些属性  

## 组件间通信的方式

- props & emit

props/emit仅适用于父子组件间通信，[props属性](#组件属性及配置)只能从父组件单向流向子组件。  
要实现双向通信需配合自定义事件emit, 在父组件使用v-on绑定监听事件回调函数，在子组件中使用this.$emit触发对应事件，并回传相应参数即可实现子组件到父组件的数据流动。  
监听事件的回调函数上下文最终还是父组件。  

::: tip v-model和v-bind.sync
这两个指令基于props和emit实现的双向绑定也也可算作组件间通信的一种方式  
详见[指令](#指令)章节中的辨析
:::

- EventBus 事件总线(发布订阅模式)

基于自定义事件,普通自定义事件父组件通过v-on在子组件上订阅事件，并绑定回调函数，子组件中通过this.$emit触发对应事件并回传参数  
事件总线需要在全局注册发布者bus，一个组件中通过`bus.$emit('消息名', 传递参数)`发布消息，其他需要通信的组件通过`bus.$on('消息名', 回调函数(传递的参数))`订阅此消息。  
由于是全局对象，可以存在多个订阅者，组件间通信也不仅限于父子组件，任意组件间均可进行通信  
在组件销毁时需要通过`bus.$off('消息名', 回调函数)`的方式移除该事件的回调  
另外还有`$once`的方式监听事件对应回到函数仅执行一次  

- provide & inject

provide/inject可以实现祖到孙组件间的通信,没有层级深度限制，且不会为数据增加额外的响应式(传入响应式数据则有响应式，没有则没有响应式)，  
祖组件中设置provide属性，提供可供注入的对象或返回对象的函数，子孙组件中使用inject属性(string[]/object)从提供的注入对象中选择要注入的属性。  

- `$parent` & `$children`或ref

利用`$parent`和`$children`属性获取父组件或子组件的实例，通过读取或操作对应的值即可实现父子组件间通信  
这种组件间通信方式仅应急状况下使用，不推荐大规模应用
PS: 与之相类似的还可通过`$root`访问到根实例  

- `$attrs` & `$listeners`

该组合可进行祖孙组件间通信。  
`$attrs`当前组件包含了除props声明外的所有绑定属性(class、style除外)，可以类比为函数中的`...rest`参数  
当前组件可通过`v-bind="$attrs"`将其接收的绑定属性传递到其子组件上，从而让孙组件可以访问到祖组件上传入的绑定属性  
`$listeners`与`$attrs`类似包含了v-on事件监听器(不含.native修饰的),同样使用`v-on="$listeners"`可将接收的事件监听器传递到子组件中，让孙组件能够访问到事件，并通过`$emit`可触发该事件，并且当当前组件中额外绑定了同名事件时，孙组件会同时触发这两个事件，触发顺序类似于冒泡，因此尽量避免事件名重复  

- vuex

vuex是一个全局状态管理库，详细特性及使用方法见[vuex](./vuex/README.md)

## 脚手架
  
main.js文件中使用`render: h => h(App)`的原因是  
通过脚手架import的vue只包含核心功能没有模板解析器，因此不能使用template配置项，需要使用render函数接收到的createElement函数(简写为h)去指定具体内容  
render函数将App组件放入容器中  
  
## 组件属性及配置  

- ref属性  

```html  
<School ref='sch'>  
this.$refs.sch 可获取到真实的DOM元素或School组件实例对象  
</School>  
```  

- props属性  
  
props类似于函数的参数，数据由父传子单向传递，若要进行子传父，需父组件先传递回调函数，子组件通过调用回调函数的方式向父组件传递数据，在子组件中不推荐直接修改父组件传过来的props数据  
若在子组件中尝试修改传入的props，vue会在控制台抛出错误，但由于js的对象或数组等传递方式是传引用，因此若props属性是一个对象或数组，直接修改其内部属性则可以修改成功并影响父组件  
常用写法如下:  

```jsx
// 在父组件中，使用v-bind传入name属性值data
<child-component v-bind:name="data"/>
<child-component v-bind="data"/> // 传入整个data对象，data对象的key-value将对应props中定义的属性名，类似于函数的参数解构

var childComponent = {
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
}
```

关联话题[组件间通信](#组件间通信的方式)  

- mixin混入  
  
将vue配置项的一部分提取出去,给各组件复用的方式称为混入;  
局部混入:通过import导入对象,在配置项中使用`mixins:[mixinObj1,mixinObj2]`  
全局混入:全局混入将混入每一个vue实例中,导入后,通过`Vue.mixin(mixinObj1)`逐个混入  
混入的配置项若有重复,不会覆盖原配置,  
混入的对象型选项会进行合并，若key值冲突，则组件的属性值将覆盖该选项，hook函数则将合并调用，混入的hook优先被调用

Vue.extend()也采用了同样的策略进行合并  

通过Vue.config.optionMergeStrategies.myOption可以自定义选项合并逻辑

- 插件  
  
在实例化vm之前,调用`Vue.use(plugins,params)`的方式挂载插件,传入plugins对象中必须包含install方法,install可以接收到Vue构造函数和params参数,在此阶段全局过滤器,全局混入,第三方库等功能挂载到原型对象上,增加vue的功能  
  
- scoped  
  
在vue文件中`<styl scoped></style>`中使用该属性,标签中的属性将只在本组件中生效.  
vue是通过将模板中的标签加入`data-生成数字`属性来约束样式的  
  
- `$nextTick`  
  
`$nextTick`属性用于传入一个回调函数,该函数在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM.  
`$nextTick`也算是生命周期图之外的一个生命周期函数  
  
- 过渡动画  
  
vue中还支持使用标签`<transition></transition>`或`<transition-group></transition-group>`设置过渡效果,详见[官方文档](https://cn.vuejs.org/v2/guide/transitions.html)  
  
- vue-resource  
  
vue-resource是vue1.×版本提供的ajax请求插件,vue2.0以后不再维护,推荐使用axios发起ajax请求  
  
## 插槽  

vue通过插槽向子组件中传递html结构  
由于结构是在父组件中定义的,所以结构的样式和数据也可引用父组件  

- 默认插槽  

```html  
<!-- 父组件中 -->  
<子组件>要插入的html结构</子组件>  
<!-- 子组件中 -->  
<slot>默认值/结构</slot> <!-- 要插入的html结构占位符 -->  
```  
  
- 具名插槽  

```html  
<!-- 父组件中 -->  
<子组件>  
  <template v-slot:占位1>
    <!-- 要插入占位1中的结构，v-slot指令仅可用于template标签上(被提供的内容仅有默认插槽时除外) -->
  </template>  
  <template v-slot:占位2>
    <!-- 要插入占位2中的结构 -->
  </template>  
</子组件>  
<!-- 子组件中 -->  
<slot name='占位1'>默认值/结构</slot>  
<slot name='占位2'>默认值/结构</slot>  
```  
  
- 作用域插槽

父级模板中的所有内容都是在父级作用域中编译的；子组件的模板则时在子级作用域的中编译，因此要插入的html结构想要访问子组件中的变量，需要用到作用域插槽  

```html  
<!-- 父组件中 -->  
<template v-slot:default='childrenParams'>
  <!-- 将接收自子组件的变量重命名为了childrenParams -->  
  <html结构>{{childrenParams.params1}}</html结构>  
</template>  
<!-- 子组件中 -->  
<slot :params1="data1" params2='js表达式'></slot> <!-- 可传递多个参数，将被包裹在一个对象中 -->  
```  

另外可以通过`<template v-slot:[动态插槽名]></template>`的方式定义动态的插槽名  
具名插槽中`v-slot:`在`:`后有参数时`v-slot:`部分可缩写为`#`

## 动态组件和异步组件

动态切换的组件上，想要保持组件的状态可以使用`<keep-alive></keep-alive>`包裹，能够避免创建组件，能够在频繁切换的场景下提升性能  
异步组件即以工厂函数的方式定义组件，工厂函数会异步的解析组件定义，vue仅在需要渲染时才会触发工厂函数，并且会缓存结果供未来重新渲染  
异步组件最常见的使用形式是与webpack的code split功能相结合，通过类似`() => import('./my-async-component')`的方式进行注册或导入，从而增强code split的效果，将应用切分成更小的代码块  

## 过渡

vue在插入、更新、移除DOM或组件时提供不同的方式应用过渡效果，主要方式有：

- 在 CSS 过渡和动画中自动应用 class，配合使用第三方 CSS 动画库，如 Animate.css
- 在过渡钩子函数中使用 JavaScript 直接操作 DOM，配合使用第三方 JavaScript 动画库，如 Velocity.js

通过在`<transition>`上绑定hook可直接操作DOM自定义过渡效果，hook绑定支持8种:  

```vue
<transition
  v-on:before-enter="(el) => {}"
  v-on:enter="(el, done) => {done()}"
  v-on:after-enter="(el) => {}"
  v-on:enter-cancelled="(el) => {}"

  v-on:before-leave="(el) => {}"
  v-on:leave="(el, done) => {done()}"
  v-on:after-leave="(el) => {}"
  v-on:leave-cancelled="(el) => {}"
>实际使用过程中推荐使用function的形式绑定
</transition>
```

- 使用vue封装的`<transition></transition>`组件包裹需要动画的标签或组件，这些标签或组件通常需要设置动态状态如:v-if、v-show、动态组件或组件根节点等

当插入或删除包含在 transition 组件中的元素时，Vue 将会做以下处理：

自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。  
主要包含6个类名:
v-enter, v-enter-active, v-enter-to;v-leave, v-leave-active, v-leave-to;
各类名对应的状态及顺序详见[官方文档](https://v2.cn.vuejs.org/v2/guide/transitions.html#%E8%BF%87%E6%B8%A1%E7%9A%84%E7%B1%BB%E5%90%8D)  
若`<transition>`中设置了name属性，则类名前缀`v`会被替换为name属性值,设置`类名-class`的属性则可自定义过渡的类名，设置duration属性则可定制持续时间  

如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。(注意：此指浏览器逐帧动画机制，和 Vue 的 nextTick 概念不同)

- 初始渲染的过渡

通过appear属性设置节点在初始渲染的过渡，与默认的进入离开过渡一样也可以自定义类名与绑定hook

- 多个元素过渡(元素切换)

当元素切换时(通过v-if/v-else或`<component>`等方式)，一个离开过渡的时候另一个开始进入过渡，同时生效的过渡不能满足所有要求，vue的过渡模式提供了in-out属性：新元素先进行过渡，完成之后当前元素过渡离开;out-in：当前元素先进行过渡，完成之后新元素过渡进入;两种模式  

- 列表过渡

列表过渡适用于使用了v-for指令的元素组，需要使用`<transition-group>`组件包裹，组件会转换为真实DOM，默认为`<span>`标签，且过渡模式不可用，内部元素需要指定唯一的key，css过渡的类会应用于内部元素中而不是组或容易本身  
列表过渡的类名在普通过渡的基础上增加了move用于改变定位时使用  

PS：将`<transition-group>`或`<transition>`作为根组件进行封装能够对过渡效果进行复用，更推荐使用函数式组件的方式进行复用  

- 状态过渡

组件中的状态，如节点位置，颜色显示，大小位置等其他属性发生变化可以利用响应式特性和组件结合一些css/js动效库，实现状态切换的过渡

## 渲染函数与jsx

`.vue`文件中的`<template>`经过模板编译阶段会生成render渲染函数，调用render会得到对应的虚拟DOM。  
通过编写render函数跳过模板编译阶段，从而获得更大的模板灵活性，但同时也要求对底层api较为熟悉  
在vue的options配置项中加入render选项:

```js
Vue.component('myComponent', {
  render: function(createElement){
    return createElement(
      // 添加render属性，使用createElement函数生成并返回虚拟DOM 
    )
  },
  props: {} // ...
})
```

- createElement函数的入参

```js
tagName: string| object | Function // 必填项，标签名或组件选项对象
attributeObject:{ // 可选，与模板中attribute对应的数据对象
  'class':{foo:true, bar:false}, // 与v-bind:class api相同
  'style':{color:'red'}, // 与v-bind:style api相同
  attrs:{}, // 普通attribute
  props:{}, // 组件props属性
  domProps:{innerHTML:'baz'}, // DOM properties
  on:{ click:this.clickHandler}, // v-on绑定的事件监听器
  nativeOn:{ click:this.nativeClickHandler}, // 仅用于组件，监听原生事件
  directives:[{}], // 自定义的指令
  scopedSlots:{default:props => {} }, // 作用于插槽
  slot: 'name-of-slot', // 作为子组件时，指定的插槽名称
  key: '',
  ref: string|[], // 若给多个元素都应用了相同的ref名，则会变成一个数组
  refInFot: true

}
childNode: string | Array // 文本节点或子级虚拟节点需要由createElement函数生成
```

PS:VNode必须唯一，因此多个相同的VNode需要用工行函数实现  
渲染函数中v-if/v-for可以用条件判断或map等方式实现，而v-model语法糖则需要自行实现相关逻辑  
对于部分事件修饰符，提供了对应的修饰前缀，如`click.passive => &click; click.capture => !click; click.once => ~click`,而其他修饰符基本可以从event参数中读取到并操作，因此没有对应的修饰符  
通过this.$slots可以访问静态插槽的内容, 通过this.$scopedSlots访问作用于插槽

- jsx

jsx风格的语法允许在js文件中直接书写xml风格的template语法，因此可以借助构建loader，用于代替上述createElement的函数式调用风格，如:  

```jsx
{ // 省略了其他配置项
  render:function(h){
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
}
```

***  

## Cookbook  

参考资料[Cookbook](https://cn.vuejs.org/v2/cookbook/)中主要介绍了vue的编程技巧  
  
## 添加实例property  

`vue.prototype.$appName = 'My App'`其中$符号是为了避免命名冲突而约定的符号。
当在原型时绑定自定义函数时，该函数通过this，能够访问到实例的作用域。
为了保证安全，应尽量避免使用该模式  
  
## 表单校验

## vue-cli

vue-cli是基于webpack等打包工具的

### vue lib模式打包生成umd文件笔记

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
