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
  get(key) {
    const target = this.raw
    const had = target.has(key)
    track(target, key)
    if(had){
      const res = target.get(key)
      return typeof res === 'object' ? reactive(res) : res
    }
  }
  set(key, value) {
    const target = this.raw
    const had = target.has(key)
    const oldVal = target.get(key)
    const rawVal = value.raw || value
    target.set(key, rawVal)
    if(!had){
      trigger(target, key, 'ADD')
    }else if(oldVal !== value || (oldVal === oldVal || value === value)){
      trigger(target, key, 'SET')
    }
  }
  forEach(callback, thisArg) {
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val
    const target = this.raw
    track(target, ITERATE_KEY)
    target.forEach((v, k) => {
      callback(thisArg, wrap(v), wrap(k), this)
    })
  }
  [Symbol.iterator]() {
    const target = this.raw
    const itr = target[Symbol.iterator]()
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val
    track(target, ITERATE_KEY)
    return {
      next() {
        const { value, done } = itr.next()
        return {
          value: value ? [wrap(value[0]), wrap(value[1])] : value,
          done
        }
      }
      [Symbol.iterator]() {
        return this
      }
    }
  }
  // entries, values, keys 等方法的实现方式与上面可迭代协议类似, 但keys需要再trigger中额外处理
}
function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target)
  if(!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if(effectFn !== activeEffect){
      effectsToRun.add(effectFn)
    }
  })
  // 添加set操作类型， 触发与Iterate_key相关的副作用函数
  if(type === 'ADD' || type === 'DELETE' || (type === 'SET' && Object.prototype.toString.call(target) === '[object Map]')){
    const iterateEffects = depsMap.get(ITERATE_KEY)
    iterateEffects && iterateEffects.forEach(effectFn => {
      if(effectFn !== activeEffect){
        effectsToRun.add(effectFn)
      }
    })
  }
  // 省略部分代码
}
```

### 原始值的响应式方案

proxy的代理目标是非原始值， 对原始值的拦截只能通过一个非原始值的包装对象来实现

```js
function ref(val) {
  const wrapper = {
    value: val
  }
  // 定义一个不可枚举对象， 用于区分ref对象和普通对象
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return reactive(wrapper)
}
```

toRef和toRefs解决，当响应式对象进行结构赋值的，响应式丢失的问题

```js
function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    }
    set value(val) {
      obj[key] = val
    }
  }
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return wrapper
}

function toRefs(obj) {
  const ret = {}
  for(const key in obj) {
    ret[key] = toRef(obj, key)
  }
  return ret
}
```

ref对象的值必须通过value进行访问， 为了方便使用， 需要提供自动脱ref功能

```js
function proxyRefs(target) { // setup函数返回时会调用类似的函数, 对ref对象调用reactive也会有类似过程
  return new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return res.__v_isRefs ? res.value : res
    },
    set(target, key, val, receiver) {
      const value = target[key]
      if(value.__v_isRef){
        value.value = val
        return true
      }
      return Reflect.set(target, key, val, receiver)
    }
  })
}
```

## 渲染器

### 渲染器的设计

渲染器将虚拟DOM渲染为特定平台上的真实元素， 渲染器与渲染函数不同， 渲染器是更宽泛的概概念， 可以用来渲染和激活已有的DOM元素(与服务端渲染相关)

```js
function createRenderer(options) {
  const { // 通过options传入操作DOM的API实现渲染器的平台无关能力
    createElement,
    insert,
    setElementText,
    patchProps,
    createText,
    setText,
  } = options
  function render(vnode, container) {
    if(vnode){
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode) {
        // 旧的vnode 存在， 且新的vnode不存在， 则卸载
        unmount(container._vnode)
      }
    }
    container._vnode = vnode // 渲染完成后， 将vnode挂载到container上
  }
  function hydrate(vnode, container) {

  }
  function patch(n1, n2, container, anchor = null) {
    if(n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }
    const { type } = n2
    if(typeof type === 'string') {
      if(!n1) { // n1不存在， 则直接挂载
        mountElement(n2, container, anchor) // 支持指定位置挂载
      } else {
        patchElement(n1, n2)
        // n1 存在需要打补丁
      }
    } else if (typeof type === 'object') {
      // 如何n2.type的值时对象类型，则它是组件
    } else if (type === Text) {
      // 处理其他类型的vnode
      if(!n1){
        const el = n2.el = createText(n2.children)
        insert(el, container)
      } else {
        cosnt el = n2.el = n1.el
        if(n2.children !== n1.children) {
          setText(el, n2.children)
        }
      }
    } else if (type === Fragment) { // Fragment类型，支持多根节点
      if(!n1){
        n2.children.forEach(c => patch(null, c, container))
      } else {
        patchChildren(n1, n2, container)
      }
    }

  }
  function mountElement(vnode, container, anchor) { // 挂载vnode
    const el = vnode.el = createElement(vnode.type)
    if(typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) { // 处理数组型子节点
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if(vnode.props) {
      for(const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key])
      }
    }
    insert(el, container, anchor) // 支持在指定位置插入
  }
  function shouldSetAsProps(el, key, value) {
    if(key === 'form' && el.tagName === 'INPUT') return false
    return key in el
  }
  function unmount(vnode) {
    if(vnode.type === Fragment) { // unmount兼容Fragment类型节点
      vnode.children.forEach(c => unmount(c))
      return
    }
    const parent = vnode.el.parentNode
    if(parent) {
      parent.removeChild(vnode.el)
    }
  }
  function patchElement(n1, n2) {
    const el = n2.el = n1.el
    const oldProps = n1.props
    const newProps = n2.props
    for(const key in newProps) {
      if(newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }
    for(const key in oldProps) {
      if(!(key in newProps)) {
        patchProps(el, key, oldProps[key], null)
      }
    }
    function patchChildren(n1, n2, container) {
      if(typeof n2.children === 'string') { // 新子节点是文本节点
        if(Array.isArray(n1.children)) { // 若旧子节点是一组子节点，则逐个卸载
          n1.children.forEach(c => unmount(c))
        }
        setElementText(container, n2.children) // 将新的文本节点内容设置到容器上
      } else if(Array.isArray(n2.children)) {
        if(Array.isArray(n1.children)) {
          // 新旧子节点均为一组子节点，需要进行diff算法
        } else { // 此时旧子节点为文本节点或不存在， 因此只需将容器清空， 然后将子节点逐个挂载
          setElementText(container, '')
          n2.children.forEach(c => patch(null, c, container))
        }
      } else { // 新子节点是空节点
        if(Array.isArray(n1.children)) { // 逐个卸载旧的子节点
          n1.children.forEach(c => unmount(c))
        } else if(typeof n1.children === 'string') { // 直接置空容器
          setElementText(container, '')
        }
      }
    }
  }
  // ...
  return {
    render,
    hydrate,
    // ...
  }
}
// 浏览器中options实现示例
const options = {
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text){
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  createText(text) {
    return document.createTextNode(text)
  },
  setText(el, text) {
    el.nodeValue = text
  },
  patchProps(el, key, preValue, nextValue) {
    if(/^on/.test(key)) { // 处理绑定事件
      const invokers = el._vei || (el._vei = {}) // 存储事件名称到函数的映射
      let invoker = invokers[key] // 尝试获取事件对应的函数缓存
      const name = key.slice(2).toLowerCase()
      if(nextValue) { // 更新或新增事件
        if(!invoker) { // 新增事件
          invoker = el._vei[key] = e => { // 包装事件函数
            if(e.timeStamp < invoker.attached) return // 事件发生事件早于事件绑定时间， 则不处理
            if(Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e))
            } else {
              invoker.value(e)
            }
          }
          invoker.value = nextValue // 存储回调函数， 通过value调用
          invoker.attached = performance.now() // 存储事件绑定时间
          el.addEventListener(name, invoker) // 绑定包装函数
        } else { // 更新事件，仅需直接替换，而不需要remove原来的回调函数，提升性能
          invoker.value = nextValue
        }
      } else if(invoker) { // 未传入回调函数，则表明移除事件
        el.removeEventListener(name, invoker)
      }
    } else if(key === 'class') { // 对class特殊处理
      el.className = nextValue || ''
    } else if(shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key]
      if(type == 'boolean' && nextValue == '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  }
}

```

### 简单diff算法

diff算法是当新旧vnode的子节点都是一组节点是，为了最小的性能开销完成更新的算法

先遍历新子节点序列，查找对应的旧子节点调整顺序并进行复用，对于不存在的节点删除，新增节点则进行挂载

```js
function patchChildren(n1, n2, container, anchor) {
  if(typeof n2.children === 'string') { // 省略部分代码
  } else if(Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children

    let lastIndex = 0 // 旧子节点的索引
    for(let i = 0; i < newChildren.length; i++) {
      const newVNode = newChildren[i]
      let find = false // 是否找到对应的旧子节点，初始值为false
      for(let j = 0; j < oldChildren.length; j++) {
        const oldVNode = oldChildren[j]
        if(newVNode.key === oldVNode.key) { // 新旧子节点的key相同
          find = true
          patch(oldVNode, newVNode, container)
          if(j < lastIndex) { // 旧子节点的位置在当前位置之前，需要移动
            const preVNode = newChildren[i - 1]
            if(preVNode) { // 若非第一个节点， 则需要移动真实DOM
              const anchor = preVNode.el.nextSibling // 获取下一个兄弟节点作为锚点
              insert(newVNode.el, container, anchor)
            }
          } else {
            lastIndex = j
          }
          break
        }
        if(!find) { // 若仍未找到旧子节点，则新增节点
          const preVNode = newChildren[i - 1]
          let anchor = null
          if(preVNode) {
            anchor = preVNode.el.nextSibling
          } else {
            anchor = container.firstChild // 新增节点为第一个节点
          }
          patch(null, newVNode, container, anchor)
        }
      }
    }

    for(let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i]
      const has = newChildren.find(newVNode => newVNode.key === oldVNode.key)
      if(!has) {
        unmount(oldVNode)
      }
    }
  } else { // 省略部分代码
  }
}
```

### 双端Diff算法

利用首尾指针，比较与交叉比较尽可能的减少DOM的移动次数，以提升DOM更新性能

```js
function patchChildren(n1, n2, container) {
  if(typeof n2.children === 'string') {
    // 省略部分代码
  } else if(Array.isArray(n2.children)) {
    patchKeyedChildren(n1, n2, container)
  } else {
    // 省略部分代码
  }
}

function patchKeyedChildren(n1, n2, container){
  const oldChildren = n1.children
  const newChildren = n2.children
  // 四个索引值
  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1
  // 四个节点
  let oldStartVNode = oldChildren[oldStartIdx]
  let oldEndVNode = oldChildren[oldEndIdx]
  let newStartVNode = newChildren[newStartIdx]
  let newEndVNode = newChildren[newEndIdx]

  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
    if(!oldStartVNode){ // 若节点已被处理则跳过
      oldStartVNode = oldChildren[++oldStartIdx]
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIdx]
    } else if(oldStartVNode.key === newStartVNode.key) {
      patch(oldStartVNode, newStartVNode, container) // 头部相等仅打补丁
      oldStartVNode = oldChildren[++oldStartIdx]
      newStartVNode = newChildren[++newStartIdx]
    } else if(oldEndVNode.key === newEndVNode.key) { // 尾部相等，仅需打补丁
      patch(oldEndVNode, newEndVNode, container)
      oldEndVNode = oldChildren[--oldEndIdx]
      newEndVNode = newChildren[--newEndIdx]
    } else if(oldStartVNode.key === newEndVNode.key) { // 交叉相等，则打补丁并移动节点
      patch(oldStartVNode, newEndVNode, container)
      insert(oldStartVNode.el, container, newEndVNode.el)
      oldStartVNode = oldChildren[++oldStartIdx]
      newEndVNode = newChildren[--newEndIdx]
    } else if(oldEndVNode.key === newStartVNode.key) {
      patch(oldEndVNode, newStartVNode, container) // 调用patch打补丁
      insert(oldEndVNode.el, container, oldStartVNode.el) // 移动尾部节点到头部
      oldEndVNode = oldChildren[--oldEndIdx] // 更新对应索引
      newStartVNode = newChildren[++newStartIdx]
    } else {
      const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key)
      if(idxInOld > 0){ // 找到可复用的旧子节点
        const vnodeToMove = oldChildren[idxInOld]
        patch(vnodeToMove, newStartVNode, container)
        insert(vnodeToMove.el, container, oldStartVNode) // 移动旧子节点到头部
        oldChildren[idxInOld] = undefined // 标记已处理的节点
        newStartVNode = newChildren[++newStartIdx]
      } else { // 新增节点
        patch(null, newStartVNode, container, oldStartVNode.el)
        newStartVNode = newChildren[++newStartIdx]
      }
    }
  }
  if(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
    // 挂载遗漏的新增节点
    for(let i = newStartIdx; i <= newEndIdx; i++){
      patch(null, newChildren[i], container, oldStartVNode.el)
    }
  } else if(newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx){
    // 移除多余的旧节点
    for(let i = oldStartIdx; i <= oldEndIdx; i++){
      unmount(oldChildren[i])
    }
  }
}
```

### 快速Diff算法

该算法最早应用于ivi和inferno两个框架中，vue3中借鉴并扩展之。  
扩展后该算法先对新旧子节点序列的相同前置元素和后置元素进行预处理，分离出，仅需要插入节点或仅需要删除节点的情况  
随后对处理后新子节点序列的剩余部分构造source数组用于存储对应旧子节点的位置索引，并计算出最长递增子序列，辅助完成DOM移动的操作  

```js
function patchKeyedChildren(n1, n2, container){
  const newChildren = n2.children
  const oldChildren = n1.children
  let j = 0
  let oldVNode = oldChildren[j], newVNode = newChildren[j]
  while(oldVNode.key === newVNode.key){ // 预处理前置节点
    patch(oldVNode, newVNode, container)
    j++
    oldVNode = oldChildren[j]
    newVNode = newChildren[j]
  }
  let oldEnd = oldChildren.length - 1, newEnd = newChildren.length - 1
  oldVNode = oldChildren[oldEnd]
  newVNode = newChildren[newEnd]
  while(oldVNode.key === newVNode.key){ // 预处理后置节点
    patch(oldVNode, newVNode, container)
    oldEnd--
    newEnd--
    oldVNode = oldChildren[oldEnd]
    newVNode = newChildren[newEnd]
  }

  if(j > oldEnd && j <= newEnd){ // 仅存在新增节点的情况，插入节点
    const anchorIndex = newEnd + 1
    const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
    while(j <= newEnd){
      patch(null, newChildren[j++], container, anchor)
    }
  } else if(j > newEnd && j <= oldEnd){ // 仅存在删除节点的情况，删除剩余节点
    while(i <= oldEnd) unmount(oldChildren[j++])
  } else { // 处理需要移动节点等复杂情况
    // 处理新子节点序列的剩余部分，构造source数组存储其对应旧子节点中的位置索引(未处理部分，从0开始)
    const count = newEnd - j + 1
    const source = new Array(count).fill(-1) // -1标志为未在旧子节点序列中匹配到
    // 构造keyIndex索引表，存储剩余新子节点的key到节点位置索引的映射，辅助填充source
    const oldStart = j, newStart = j, keyIndex = {}
    let moved = false, pos = 0
    for(let i = newStart; i <= newEnd; i++){
      keyIndex[newChildren[i].key] = i
    }
    let patched = 0 // 记录已更新过的节点数量
    for(let i = oldStart; i <= oldEnd; i++){
      oldVNode = oldChildren[i]
      if(patched <= count){
        const k = keyIndex[oldVNode.key] // 利用索引表在旧的序列中寻找相同key的新节点
        if(typeof k !== 'undefined') { // 找到则，做patch，并标记索引方便后续移动
          newVNode = newChildren[k]
          patch(oldVNode, newVNode, container) // 发现相同的节点做patch
          patched++
          source[k - newStart] = i // 以newStart为起点记录其在就子节点中的索引i
          if(k < pos){ // 若非递增顺序，则标记需要移动节点
            moved = true
          } else pos = k
        } else {
          unmount(oldVNode) // 未找到节点则卸载旧节点
        }
      } else { // 已更新节点数超过需要更新的节点数(剩余新子节点)，则说明需要卸载多余的节点
        unmount(oldVNode)
      }
    }
    if(moved){ // 处理DOM移动操作
      const seq = list(source) // 计算最长增长子序列，返回其对应的索引数组
      // 最长增长子序列尽可能的减少移动操作，因此seq对应的节点不需要进行移动
      let s = seq.length -1 // 指向增长子序列的末尾
      let i = count - 1 // 指向剩余新子节点的末尾
      for(i; i >= 0; i--){ // 向头部遍历
        if(source[i] === -1) { // i节点为新增节点，进行挂载
          const pos = i + newStart
          const newVNode = newChildren[pos]
          const nextPos = pos + 1
          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
          patch(null, newVNode, container, anchor)
        } else if(i !== seq[s]){ // i节点需要移动
          const pos = i + newStart
          const newVNode = newChildren[pos]
          const nextPos = pos + 1
          const anchor = nextPos < newChildren.length ? newChildren[nextPos].e : null
          insert(newVNode.el, container, anchor)
        } else { // i节点无需移动
          s--
        }
      }
    }
  }
}
```

求解最长递增子序列，元素可不连续，返回对应元素的索引

```js
function list(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for(i = 0; i < len; i++){
    const arrI = arr[i]
    if(arrI !== 0) {
      j = result[result.length - 1]
      if(arr[j] < arrI){
        p[i] = j
        result.push[i]
        continue
      }
      u = 0
      v = result.length - 1
      while(u < v){
        c = ((u + v) / 2) | 0
        if(arr[result[c]] < arrI) {
          u = c + 1
        } else v = c
      }
      if(arrI < arr[result[u]]){
        if(u > 0) p[i] = result[u - 1]
      }
      result[u] = i
    }
  }
  u = result.length
  v = result[u - 1]
  while(u-- > 0){
    result[u] = v
    v = p[v]
  }
  return result
}
```

## 组件化

### 组件实现原理

从框架使用者角度看，组件是一个选项对象，从渲染器内部实现看，组件是一种特殊类型的虚拟DOM节点，其type为Object类型，需要调用组件的挂载mountComponent或更新patchComponent方法

```js
function patch(n1, n2, container, anchor) {
  // 省略其他代码
  const { type } = n2
  if(typeof type === 'string'){
    // 
  } else if(typeof type === 'object'){
    if(!n1) mountComponent(n2, container, anchor)
    else patchComponent(n1, n2, anchor)
  }
}
```

以自定义render函数的组件为例

```js
const MyComponent = { // 样例组件
  name: 'MyComponent',
  data() {
    return {
      foo: 'hello component'
    }
  },
  render() {
    return {
      type: 'div',
      children: `foo's value is: ${this.foo}`
    }
  }
}

function mountComponent(vnode, container, anchor){
  const componentOptions = vnode.type
  // 从options中获取选项式api的生命周期hook
  const { render, data, beforeCreate, created, beforeMount, beforeUpdate, updated, props: propsOption, setup } = componentOptions
  beforeCreate && beforeCreate() // 调用选项式生命周期钩子（如有下同）
  const state = reactive(data())
  const [props, attrs] = resolveProps(propsOption, vnode.props)
  const slots = vnode.children || [] // 从children中获取插槽引用
  const instance = { // 组件实例
    state,
    props: shallowReactive(props),
    isMounted: false, // 是否已挂载
    subTree: null,
    slots,
    mounted: [], // 存储setup中通过onMounted函数注册的生命周期函数
  }
  function emit(event, ...payload) {
    // 从props中读取绑定的事件处理函数并执行
    const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
    const handler = instance.props[eventName]
    if(handler) handler(payload)
    else console.error('event not found')
  }
  const setupContext = { attrs, emit, slots }
  setCurrentInstance(instance) // 执行setup函数之前设置当前组件实例，
  const setupResult = setup(shallowReadonly(instance.props), setupContext)
  setCurrentInstance(null) // 执行后释放全局变量
  let setupState = null
  if(typeof setupResult === 'function'){ // setup返回了render函数的情况
    if(render) console.error('setup() should not return a Function when used with render().')
    render = setupResult
  } else { // setup返回了状态的情况
    setupState = setupResult
  }
  vnode.component = instance
  // 创建渲染上下文, 作为组件实例的代理
  const renderContext = new Proxy(instance, {
    get(t, k, r){
      const { props, state, slots } = t
      if(k === '$slots') return slots // 返回插槽对象，以便在render函数中可以使用this.$slots
      if(state && k in state) {
        return state[k]
      } else if(k in props){
        return props[k]
      } else if(setupState && k in setupState){ // 使用上下文读取setup返回的状态暴露出的state
        return setupState[k]
      } else console.log('not found')
    },
    set(t, k, v, r) {
      const { props, state } = t
      if(state && k in state) {
        state[k] = v
      } else if(k in props){
        console.warn('props is readonly')
      } else if(setupState && k in setupState) {
        setupState[k] = v
      } else console.error('not found')
    }
  })

  created && created.call(state) // 调用选项式created钩子
  effect(() => {
    const subTree = render.call(renderContext, renderContext) // 修改this指向
    if(!instance.isMounted){
      beforeMount && beforeMount.call(state) // 调用beforeMount钩子
      patch(null, subTree, container, anchor)
      instance.isMounted = true
      instance.mounted && instance.mounted.forEach(hook => hook.call(renderContext)) // 调用mounted钩子
    } else {
      beforeUpdate && beforeUpdate.call(state) // 调用beforeUpdate钩子
      patch(instance.subTree, subTree, container, anchor)
      updated && updated.call(state) // 调用updated钩子
    }
    instance.subTree = subTree // 组件所渲染的内容，子vnode(子组件)
  }, {
    scheduler: queueJob
  })
}
// 实现一个微任务队列与调度器，可通过调度器对重复的任务去重
const queue = new Set() // 任务队列
let isFlushing = false // 是否正在刷新锁
const p = Promise.resolve()

function queueJob(job){ // 添加任务到缓冲队列中，并开始刷新队列
  queue.add(job)
  if(!isFlushing){ // 若未开始刷新队列，则开始
    isFlushing = true // 加锁，避免重复刷新
    p.then(() => {
      try {
        queue.forEach(job => job()) // 执行任务队列
      } finally { // 重置状态
        isFlushing = false
        queue.clear = 0
      }
    })
  }
}

function resolveProps(options, propsData){
  const props = {}
  const attrs = {}
  for(const key in propsData){
    // 以字符串on开头的props， 将其添加到props中
    if(key in options || key.startsWith('on')) props[key] = propsData[key]
    else attrs[key] = propsData[key]
  }
  return [props, attrs]
}

function patchComponent(n1, n2, anchor) {
  const instance = (n2.component = n1.component) // 复用组件实例 
  const { props } = instance // 获取当前props
  if(hasPropsChange(n1.props, n2.props)) {
    const [ nextProps ] = resolveProps(n2.type.props, n2.props)
    for(const k in nextProps){
      props[k] = nextProps[k]
    }
    for(const k in props){
      if(!(k in nextProps)){
        delete props[k]
      }
    }
  }
}

function hasPropsChange(prevProps, nextProps) { // 判定props是否发生变化
  const nextKeys = Object.keys(nextProps)
  if(nextKeys.length !== Object.keys(prevProps).length) return true
  for(let i = 0; i < nextKeys.length; i++){
    const key = nextKeys[i]
    if(nextProps[key] !== prevProps[key]) return true
  }
}

// 存储当前正在初始化的组件实例
let currentInstance = null
function setCurrentInstance(instance) {
  currentInstance = instance
}

function onMounted(fn) { // 其他生命周期函数的注册类似
  if(currentInstance) {
    currentInstance.mounted.push(fn)
  } else console.error('onMounted function only allow being called in setup')
}
```

### 异步组件与函数式组件

异步组件以异步的方式加载并渲染一个组件，根据加载器的状态来决定渲染的内容，除需要异步加载的组件外，还支持指定loading、error状态展示的组件

```js
function defineAsyncComponent(options) {
  if(typeof options === 'function') { // 将加载器转换为配置项
    options = {
      loader: options
    }
  }

  const { loader } = options

  let InnerComp = null
  let retries = 0 // 记录重试次数
  function load() {
    return loader().catch(err => {
      if(options.onError){ // 若指定了错误处理函数，则调用
        return new Promise((resolve, reject) => {
          const retry = () => { // 包装重试函数
            resolve(load())
            retries++
          }
          const fail = () => reject(err) // 包装失败函数
          options.onError(retry, fail, retries) // 作为参数传递给错误处理函数，让用户在onError回调中决定调用
        })
      } else throw err
    })
  }
  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false)
      const error = shallowRef(null)
      const loading = ref(false) // 是否正在加载
      let loadingTimer = null
      if(options.delay) {
        loadingTimer = setTimeout(() => {
          loading.value = true
        }, options.delay)
      } else loading.value = true

      loader().then(c => {
        InnerComp = c
        loaded.value = true
      }).catch((err) => error.value = err)
      .finally(() => {
        loading.value = false
        clearTimeout(loadingTimer) // 加载完毕后清除延迟定时器
      })
      let timer = null
      if(options.timeout) { // 指定了超时时长则开启个定时器
        timer = setTimeout(() => {
          const err = new Error(`Async component timeout after ${options.timeout}ms.`)
          error.value = err
        }, options.timeout)
      }
      onUnmounted(() => { // 包装组件被卸载时清除定时器
        clearTimeout(timer)
      })
      const placeholder = { type: Text, children: '' } // 占位内容

      return () => { // 如果异步组件加载成功则渲染组件，否则一个占位内容
        if(loaded.value) { // 异步组件加载成功，则渲染被加载的组件
          return { type: InnerComp }
        } else if (error.value && options.errorComponent) { // 超时或其他错误，渲染错误组件，并传递错误详情
          return { type: options.errorComponent, props: { error: error.value } }
        } else if (loading.value && options.loadingComponent) {
          return { type: options.loadingComponent } // 延迟后异步组件正在加载时， 渲染loading组件
        } else return placeholder
      }
    }
  }
}

options = { // 示例异步组件配置项
  loader: () => import('./MyComponent.js'),
  timeout: 2000,
  delay: 200, // 指定延迟展示loading组件的时长
  loadingComponent: MyLoadingComp, // 用于配置loading组件
  errorComponent: MyErrorComp,
}

function unmount(vnode) { // unmount函数兼容异步组件的内容卸载
  if(vnode.type === Fragment) {
    vnode.children.forEach(c => unmount(c))
    return
  } else if(typeof vnode.type === 'object') {
    // 对于组件的卸载，本质是要卸载组件所渲染的内容，即subTree, 支持loading组件的卸载
    unmount(vnode.component.subTree)
    return
  }
  const parent = vnode.el.parentNode
  if(parent) {
    parent.removeChild(vnode.el)
  }
}
```

函数式组件的本事是普通函数，返回值是虚拟DOM， 在vue3中函数式组件和有状态组件之间的性能差距不大， 使用函数式组件通常是因为其简单性而不是性能  
挂载函数式组件可以复用mountComponent函数  

```js
function patch(n1, n2, container, anchor) {
  if(n1 && n1.type !== n2.type) {
    unmount(n1)
    n1 = null
  }
  const { type } = n2 // patch函数做出响应的调整
  if(typeof type === 'object' || typeof type === 'function'){
    if(!n1) mountComponent(n2, container, anchor)
    else patchComponent(n1, n2, anchor)
  }
}

function mountComponent(vnode, container, anchor) {
  const isFunctional = typeof vnode.type === 'function'
  let componentOptions = vnode.type
  if(isFunctional) { // 若为函数式组件，则将vnode.type作为渲染函数
    componentOptions = {
      render: vnode.type,
      props: vnode.type.props
    }
  }
}
```

## 编译器

## 服务端渲染
