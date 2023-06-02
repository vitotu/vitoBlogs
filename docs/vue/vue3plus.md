# vue设计与实现读书笔记

该书以vue3为基础，讲述vue框架的底层实现原理

## 框架设计概念

### 权衡的艺术

视图层框架通常分为命令式和声明式；命令式如jquery，通过js操作dom，声明式如vue.js的template模板，直接声明视图。  
vue.js底层实现是命令式的，暴露给开发者的则是声明式。  

声明式的代码性能不优于命令式的代码性能，但可维护性要高于命令式的代码  
声明式的代码更新性能消耗=找出差异的性能消耗+直接修改的性能消耗，而虚拟DOM的是未来最小化找出差异的性能消耗  
因此虚拟DOM的性能理论上不可能比js原生DOM操作效率更高，即理论上原生DOM操作性能更好，但要求写出极致优化的命令式代码  
而虚拟DOM在实践中，如频繁更新大量DOM的操作等场景下，性能可能会优于原生DOM操作  

因此vue框架设计权衡了性能和开发效率(上手难易程度，可维护性)采用了声明式的视图  

::: tip 框架的一种分类方式
运行时：拿到开发者输入的代码不加额外的处理，由渲染函数输出  
编译时：拿到开发者的代码，分析内容，加工过后提供给渲染函数，由渲染函数输出  
运行时的框架更为灵活，编译时的框架性能会更好，vue.js为运行时+编译时的架构，在保证灵活性的基础上尽可能的去优化  
:::

### 框架设计的核心要素

vue3预定义了__DEV__变量实现仅在开发环境打印告警信息，在生产环境不包含这些代码，减小代码体积  

vue3框架在设计时考虑了以下要素：
在开发环境提供友好的警告信息  
合理利用Tree-Shaking机制，配置构建工具控制生产环境打包大小  
输出多种不同格式的打包资源  
对于灵活性与兼容性提供不同的解决且不互斥的解决方案  

### Vue3的设计思路

声明式ui，即以类似html的模板，声明式的描述UI界面结构(声明式的好处是直接描述结果，无需关注过程)  
随后通过编译器将模板编译生成渲染函数  
最后通过渲染函数返回的js对象(以js对象形式描述UI界面，即虚拟DOM)  
将虚拟DOM通过渲染器渲染为真实DOM  

渲染器通过`document.createElement`等API创建虚拟DOM描述的元素，从虚拟DOM上取出props、事件，为新创建的真实DOM绑定属性及事件，随后递归的处理children节点，处理完毕后获得的真实DOM树，使用`container.appendChild(el)`的方式挂载到container容器上，至此完成了初始渲染过程  
在更新阶段，渲染器会通过diff算法找到变更点，并只更新需要更新的内容  

vue中组件的本质就是一组虚拟DOM元素的封装，若用函数来描述，即函数的返回值为组件渲染的内容，可以是虚拟DOM的形式  
虚拟DOM描述组件，通过tag属性来区分其与普通DOM，对于函数式组件tag是函数，对于对象型组件tag是包含render函数的对象，仅需在渲染器中调用对应的函数即可取得虚拟DOM  

## 响应系统

### 响应系统的作用与实现

副作用函数：函数执行会直接或间接影响其他函数的执行，这种函数称为副作用函数
响应式数据：即当响应式数据发生变化时，自动重新执行副作用函数

vue3通过`Object.defineProperty`或`Proxy`API在数据的读取环节收集副作用函数effect存储到“桶”中，
在数据的写入(修改)阶段从桶中取出副作用函数，并执行

vue3定义了effect函数用于注册作用用函数，通过传入副作用函数，在effect内部执行，并通过全局变量临时存储副作用函数，方便响应式数据的getter收集副作用函数  
对于收集副作用函数的数据结构，需要能建立读取字段与副作用函数数组（使用set实现，方便去重）之间的联系  

```js
const bucket = new WeakMap()

const obj = new Proxy(data, {
  get(target, key){
    track(target, key)
    return target[kay]
  },
  set(target, key, newVal){
    target[key] = newVal
    trigger(target, key)
  }
})

function track(target, key){
  if(!activeEffect) return
  let depsMap = bucket.get(target) // bucket中存储所有收集的副作用函数
  if(!depsMap) bucket.set(target, (depsMap = new Map()))
  let deps = depsMap.get(key) // 再根据key取出对应的副作用函集
  if(!deps) depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect) // 收集副作用函数
}

function trigger(target, key){
  const depsMap = bucket.get(target)
  if(!depsMap) return
  const effects = depsMap.get(key)
  
}

let activeEffect
function effect(fn){ // effect注册函数中设置全局变量activateEffect，方便getter收集
  activeEffect = fn // 简单实现，手续将完善注册函数的功能
  fn()
}
```

- 分支切换与cleanup

当副作用函数中存在条件分支，且条件分支依赖于响应式数据，当进入a分支时，不希望b分支的响应式数据变化时触发副作用函数，反之亦然  
因此需要在副作用函数执行时将其从与之关联的所有依赖集合中删除，执行完毕后会重新建立联系，但在新的联系中不会包含遗留的副作用函数  
为了实现这一点，在 track 函数中我们将当前执行的副作用函数activeEffect 添加到依赖集合 deps 中, 也把deps添加到activeEffect.deps 数组中,这样就完成了对依赖集合的收集

```js
let activateEffect
function effect(fn){
  const effectFn = () => {
    cleanup(effectFn)
    activateEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}
function cleanup(effectFn){
  for(let i = 0; i < effectFn.deps.length; i++){
    const deps = effectFn.deps[i]
    if(deps) deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}
function track(target, key){
  activateEffect.deps.push(deps) // ... 省略其他代码，末尾新增以下代码
}
function trigger(target, key){
  // 删除此行 effects && effects.forEach(fn => fn())
  const effectsToRun = new Set(effects) // 末尾新增以下两行
  effectsToRun.forEach(effectFn => effectFn())
}
```

- 嵌套的effect与effect栈

由于嵌套的用于临时存储effect的全局变量activeEffect只有一个，当出现effect嵌套调用时，会出现内层函数覆盖外层的情况，导致副作用函数收集及调用出现异常，因此需要引入一个副作用函数栈effectStack，在副作用函数执行时，将当前副作用函数压入栈中，执行完毕后弹出，这样就避免了副作用函数嵌套带来的问题

```js
const effectStack = [] // 新增代码
function effectFn(fn){
  const effectFn() => { // 新增如下代码
    // 省略其他代码
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activateEffect = effectStack[effectStack.length - 1]
  }
  // 省略其他代码
}
```

- 调度执行

另外为了更灵活的调用副作用函数，effect函数支持传入options对象，通过其中的scheduler选项，传递用户的调度函数，在trigger阶段，若发现有scheduler选项则，将副作用函数传递给scheduler函数，将执行权交由调度器处理  

```js
function effect(fn, options = {}){
  // 省略其他代码
  effectFn.options = options // 将options挂载到effectFn上
  effectFn.deps = []
}
function trigger(target, key){
  const depsMap = bucket.get(target)
  if(!depsMap) return
  const effects = depsMap.get(key)
  // 防止无限递归
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn =>{
    if(effectFn !== activateEffect) effectsToRun.add(effectFn)
  })
  // 若options中传入了scheduler调度函数，则交出执行权给用户
  effectsToRun.forEach(effectFn => {
    if(effectFn.options.scheduler){
      effectFn.options.scheduler(effectFn)
    }else{
      effectFn()
    }
  })
}
```

- 计算属性 computed 与 lazy

计算属性具有懒计算， 缓存结果等特性，其通过在effect入参的options选项中提供lazy属性，在effect函数内部，将副作用函数的执行逻辑定义effectFn函数中，档options.lazy为false时执行effectFn，否则返回effectFn将执行全交给用户  
在computed中添加value缓存上次计算结果，调用effect函数，并传入lazy参数获得返回的effectFn，当用户访问computed属性时，根据是否为脏数据标志重新计算或返回缓存  
当计算属性发生嵌套时，会导致外层effect不会被内层响应式数据收集，因此当读取计算属性时需要手动调用track，数据发生变化时手动trigger触发响应

```js
function computed() {
  let value // 缓存上次计算的值
  let dirty = true // 是否需要重新计算flag
  const effectFn = effect(getter, { // effect函数返回对getter函数包装后的函数
    lazy: true,
    scheduler(){
      if(!dirty){
        dirty = true // 每次执行重置dirty为true，避免数据不变时的重复计算
        trigger(obj, 'value') // 手动触发，解决computed嵌套问题
      }
    }
  })
  const obj = {
    get value(){
      if(dirty){
        value = effectFn() // 执行包装后的函数获取getter函数执行的返回值
        dirty = false // 重置dirty
      }
      track(obj, 'value') // 手动追踪，解决computed嵌套问题
      return value
    }
  }
  return obj
}

function effect(fn, options = {}){
  const effectFn = () => {
    // ...
    const res = fn() // 存储执行结果
    // ...
    return res // 返回执行结果
  }
  // ...
  return effectFn
}
```

- watch的实现原理

利用scheduler选项触发用户传入的回调函数，  
定义traverse函数，兼容对象类型的响应式数据，让对象的每个属性变化时都能触发回调函数  
定义getter变量，兼容用户传入getter函数的情况  
定义oldValue和newValue，在scheduler中收集新旧值，并传递给回调函数  

```js
function watch(source, cb, options = {}){
  let getter // 兼容传入getter函数的情况
  if(typeof source === 'function') getter = source
  else getter = () => traverse(source)
  let oldValue, newValue
  let cleanup // 存储过期的回调函数, 解决竞态问题
  function onInvalidate(fn){
    cleanup = fn // 存入过期的回调函数到cleanup中
  }

  const job = () => {  // 将scheduler封装为job方便调用
    newValue = effectFn()
    if(cleanup) cleanup() // 在调用cb之前先调用过期的回调
    cb(newValue, oldValue, onInvalidate) // 传入第三个参数方便用户使用
    oldValue = newValue
  }
  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler: () => { // 支持flush选项
        if(options.flush === 'post'){
          const p = Promise.resolve()
          p.then(job)
        } else job()
      }
    }
  )
  if(options.immediate) job() // 若传入立即调用则执行job
  else oldValue = effectFn()
}

function traverse(value, seen = new Set()){
  // 原始值或已被读取过则不进行操作
  if(typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value) // 避免死循环
  for(const k in value){ // 若为对象，则递归的读取对象的每个值
    traverse(value[k], seen)
  }
  return value
}
```

### 非原始值的响应式方案

当对象中存在存在getter，setter时，Proxy代理读取时其中this指向为原始数据，因此无法触发响应式收集，Vue3使用Reflect方法的第三个参数receiver，重新绑定Proxy对象，通过Proxy对象访问原始对象属性，并触发响应式收集  

读取操作  
obj.foo, --> Reflect.get
key in obj, --> HasProperty方法 --> Reflect.has
for...in --> 依赖iteration迭代对象 --> Reflect.ownKeys
添加新属性set --> Reflect.set
删除属性delete --> Reflect.deleteProperty

```js
const ITERATE_KEY = Symbol('iterate')
const p = new Proxy(obj, {
  get(target, key, receiver){
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  has(target, key){
    track(target, key)
    return Reflect.has(target, key)
  },
  ownKeys(target){ // 此操作不予任何key绑定，因此使用标识ITERATE_KEY
    track(target, ITERATE_KEY) // 将副作用函数与ITERATE_KEY绑定
    return Reflect.ownKeys(target)
  }, // 为配合ITERATE_KEY key, 同时调整set
  set(target, key, newVal, receiver){
    const type = Object.prototype.hasOwnProperty.call(target,
    key) ? 'SET' : 'ADD' // 判断是修改还是添加
    const res = Reflect.set(target, key, newVal, receiver)
    trigger(target, key, type) // 触发时传入操作类型
    return res
  },

  deleteProperty(target, key) {
    // 检查被操作的属性是否是对象自己的属性
    const hadKey = Object.prototype.hasOwnProperty.call(target,
  key)
    // 使用 Reflect.deleteProperty 完成属性的删除
    const res = Reflect.deleteProperty(target, key)
    if (res && hadKey) {
      // 只有当被删除的属性是对象自己的属性并且成功删除时,才触发更新
      trigger(target, key, 'DELETE')
    }
    return res
  }
})

function trigger(target, key, type) { // 增加入参type，用于区分add和modify
  // ... 省略其他代码
  if(type === 'ADD' || type === 'DELETE'){ // 若为添加操作，则触发ITERATE_KEY
    const iterateEffects = depsMap.get(ITERATE_KEY)
    iterateEffects && iterateEffects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })
  }
  // ... 省略其他代码
}
```

想要合理的触发响应，需要解决如下场景：新旧值相同时，不触发响应；访问原型上属性时重复触发响应等问题，可通过封装reactive函数创建响应式数据

```js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver){
      if(key === 'raw') return target // 代理对象可通过raw访问原始属性
      if(!isReadonly && typeof key !== 'symbol') track(target, key) // 只读属性不收集副作用函数
      const res = Reflect.get(target, key, receiver)
      if(isShallow) return res
      if(typeof res === 'object' && res !== null){
        return isReadonly ? readonly(res) : reactive(res) // 递归处理嵌套对象
      }
      return res
    }
    set(target, key, newVal, receiver){
      if(isReadonly) return true // 只读属性直接返回
      const oldVal = target[key]
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newVal, receiver)
      if(target === receiver.raw) {
        if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) trigger(target, key, type)
      }
      return res
    }
    deleteProperty(target, key){
      if(isReadonly) return true
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if(res && hadKey) trigger(target, key, 'DELETE')
      return res
    }
    // ... 省略其他拦截函数
  })
}

function reactive(obj){
  return createReactive(obj)
}
function shallowReactive(obj){
  return createReactive(obj, true)
}
function readonly(obj){
  return createReactive(obj, false, true)
}
function shallowReadonly(obj){
  return createReactive(obj, true /* shallow */, true)
}
```

代理数组  

js中的对象分为普通对象和异质对象，异质对象是在普通对象的基础上修改了内部方法的对象，如数组修改了 `[[DefineOwnProperty]]`方法  
当数组长度发生改变时，需要通过length为key，记录相关副作用函数，如遍历

```js
const originMethod = Array.prototype.includes
const arrayInstrumentations = {
  includes: function(...args){
    let res = originMethod.apply(this, args) // 先尝试从代理对象中查找
    if(res === false){
      res = originMethod.apply(this.raw, args)
    }
    return res
  }
} // 对于includes， indexOf， lastIndexOf的处理方法相同

// 解决隐式修改数组长度，导致循环触发栈溢出问题
let shouldTrack = true
// 重写数组的 push、pop、shift、unshift 以及 splice 方法
;['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method =>{
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    shouldTrack = false
    let res = originMethod.apply(this, args)
    shouldTrack = true
    return res
  }
})
function track(target, key){
  // 当禁止追踪时，直接返回
  if(!activeEffect || !shouldTrack) return
  // 省略部分代码
}

function createReactive(obj, isShallow=false, isReadonly=false){
  return new Proxy(obj, {
    set(target, key, newVal, receiver){
      if(isReadonly) return true
      const oldVal = target[key]
      const type = Array.isArray(target) ? 
        Number(key) < target.length ? 'SET':'ADD' : 
        Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, newVal, receiver)
      if(target === receiver.raw){
        if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) trigger(target, key, type, newVal)
      }
      return res
    },
    ownKeys(target){
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    get(target, key, receiver){
      if(key === 'raw') return target
      if(Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key))) { // 若为数组对象则返回定义在 arrayInstrumentations的值，用于解决includes 方法问题
        return Reflect.get(arrayInstrumentations, key, receiver)
      }
      //... 省略其他代码
    }
  })
}
function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  // 省略部分内容

  // 当操作类型为 ADD 并且目标对象是数组时,应该取出并执行那些与 length属性相关联的副作用函数
  if (type === 'ADD' && Array.isArray(target)) {
    // 取出与 length 相关联的副作用函数
    const lengthEffects = depsMap.get('length')
    // 将这些副作用函数添加到 effectsToRun 中,待执行
    lengthEffects && lengthEffects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn)
      }
    })
  }
  if(Array.isArray(target) && key === 'length'){
    // 当目标对象是数组并且修改了 length 属性时,应该取出并执行那些与索引相关联的副作用函数
    depsMap.forEach((effects, key) => {
      if(key > newVal){
        effects.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

const reactiveMap = new Map()
function reactive(obj){
  const existionProxy = reactiveMap.get(obj) // 避免创建重复的代理对象
  if(existionProxy) return existionProxy
  const proxy = createReactive(obj)
  reactiveMap.set(obj, proxy)
  return proxy
}
```

代理Set， Map对象  

```js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') return target
      // size是属性访问器，执行时需要指向target
      if (key === 'size') {
        track(target, ITERATE_KEY)
        return Reflect.get(target, key, target)
      }
      // 将返回的方法与原始数据对象target绑定
      return  mutableInstrumentations[key]
    }
  })
}
// 自定义对象实现自定义的add等方法
const mutableInstrumentations = {
  add(key) {
    const target = this.raw
    const hadKey = target.has(key)
    const res = target.add(key)
    if (!hadKey) {
      trigger(target, key, 'ADD')
    }
    return res
  }
  delete(key) {
    const target = this.raw
    const hadKey = target.has(key)
    const res = target.delete(key)
    if (!hadKey) {
      trigger(target, key, 'DELETE')
    }
    return res
  }
}
```

## 渲染器

## 组件化

## 编译器

## 服务端渲染
