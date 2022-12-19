# es6基础教程

ECMAScript6.0是JavaScript语言的下一代标准  
本笔记参考了[尚硅谷的es6教程]()和[阮一峰的es6入门教程](https://es6.ruanyifeng.com/)  

## babel插件

Babel是一个广泛使用的ES6转码器，可以将ES6代码转为ES5代码，从而在老版本的浏览器执行。  
目前新版的浏览器、node等运行环境对es6支持较好，不需要使用babel转换就可以直接运行，仅学习语法可以跳过此章节  

### 安装

在脚手架环境中一般会安装好该插件  
手动安装方式`npm install --save-dev @babel/core`  
  
命令行转码工具安装:`npm install --save-dev @babel/cli`  
使用方法`npx babel filename/dir <-o/-d> <outFileName/outDir> <-s保存source map文件>`  
  
@babel/node模块的babel-node命令，提供一个支持ES6的REPL(交互式)环境。它支持Node的REPL环境的所有功能，可以直接运行ES6代码。  
安装`npm install --save-dev @babel/node`,启动`npx babel-node`,执行文件`npx babel-node es6.js`  
  
### 配置

`.babelrc`或`babel.config.js`文件是Babel插件的配置文件  
文件书写规则一般如下:  

```JSON  
{  
  "presets":[  
    "@babel/env",  
    "@babel/preset-react"  
  ], // 设定转码规则  
  "plugins":[] // 设定插件  
}  
```

规则集和插件也需要安装`npm install --save-dev @babel/preset-env`  
  
### polyfill

Babel默认只转换JS语法，不转换api，如`Iterator, Generator, Set, Proxy`等  
因此还需要额外安装`core-js`和`regenerator-runtime(generator函数的转码)`作为执行环境的基础  
  
## 基础新特性  
  
### let和const命令

let声明没有变量提升,在块级作用域中如果在let命令之前使用了该变量会报错,如:  

```javascript
var tmp = 123;  
if(true){  
  tmp = 'abc'; // ReferenceError  
  let tmp;  // 若块级作用域中始终不声明tmp则，首次tmp将使用外部全局变量tmp  
}  
```

函数在块级作用域中声明es5规定中是非法的,es6中是合法的,但由于浏览器环境和其他环境对标准支持不同,实际表现也与规范不大一样.因此尽量避免在块级作用域中声明函数,取而代之使用函数表达式  
  
const声明大体上与let一致,const仅能锁定对象的引用，即const声明的基本类型变量初始化后无法修改，但对象类型，只能锁定其引用，不可修改为指向另一对象，但可修改对象上的属性  
  
+ es6中声明变量的方法:var,function,let,const,import,class  
  
let,const,class声明的全局变量将不会挂载在全局对象window/global上,各环境中全局对象在es2020上通过globalThis可以取到  
  
### 解构赋值  

+ 数组的解构赋值:  
  
凡具有Iterator接口的数据结构,都可以用数组形式的解构赋值(等号左侧数组形式)  
解构赋值中设定默认值,仅当右方数据严格===undefined时,默认值才生效`let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'`  
  
+ 对象的解构赋值  
  
`let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };`  
简写为`let {foo, bar} = { foo: 'aaa', bar: 'bbb' }`前者为key模式,后者为变量.  
可以取得继承的属性,同数组一样也支持默认值  
  
+ 解构赋值注意的点  
  
1. 已声明的变量用于解构赋值  
  
```js
let x;  
// 错误写法  
{x} = {x:1}; // 左边会被解释为代码块,解决方法为整体包一层括号  
({x} = {x:1});  
// 变量声明语句不可使用圆括号  
let ({x} = {x:1}); // 报错  
// 只有赋值语句的非模式部分，可以使用圆括号,如:  
[(b)] = [3]; // 正确,非声明语句,模式为数组索引0  
({ p: (d) } = {}); // 正确,非声明语句,模式为p  
[(parseInt.prop)] = [3]; // 正确  
```  

2. 数组特殊解构  
  
数组本质是,特殊的对象,因此下列数组的解构赋值有效  

```js
let arr = [1, 2, 3];  
let {0 : first, [arr.length - 1] : last} = arr;  
```  

字符串进行解构赋值将按数组规则进行,其他类型的数据将先转换为对象  
  
### 字符串扩展  

+ 字符的Unicode表示法相关特性  
  
方式1:`\u0000~\uFFFF`,超出范围的字符采用双字节形式表示  
方式2:`\u{*****}`,使用`{}`可避免方式1的问题  
  
字符串添加了Iterator接口支持for...of遍历循环相比于传统的for循环能够正确遍历`\u{*****}`表示的字符  
  
由于JSON的字符规定与js略有不同,es6对JSON.parse和stringify方法进行了改造,具体来说涉及`\u2029`等字符的处理  
  
+ 模板字符串  
  
模板字符串使用反引号\`标识,包含多行字符串时,所有的空格、换行、缩进都会被保留,通过`${}`的方式嵌入js表达式,模板字符串还可以嵌套,如:  

```js
const tmpl = addrs => `  
  <table>  
  ${addrs.map(addr => `  
    <tr><td>${addr.first}</td></tr>  
    <tr><td>${addr.last}</td></tr>  
  `).join('')}  
  </table>  
`;  
```

通过`${}`嵌入的表达式最终都会被转换为字符串输出，如:`${new Promise(()=>{console.log()})}` 输出为`[object Promise]`  
模板字符串可用于模板编译,如vue中插值语法,脚手架中的index.html文件中  
`<title><%= htmlWebpackPlugin.options.title %></title>`webpack插件句法  
  
+ 标签模板  
  
函数后紧跟一个模板字符串,被称为标签模板,是函数调用的一种特殊形式,模板字符串将作为参数,如：console.log\`123\`  
  
带变量的模板字符串作为参数时，会将模板字符串处理为多个参数，然后调用函数：  

```js
let a = 5;  
let b = 10;  
tag`Hello ${ a + b } world ${ a * b }`;  
// 等同于  
tag(['Hello ', ' world ', ''], 15, 50);  
```  
  
标签模板可用于过滤html字符串,防止恶意输入、国际化处理、嵌入其他编程语言。模板字符串会对特殊字符进行转义导致嵌入其他编程语言时的一些麻烦  
  
### 字符串的新增方法  

String.fromCodePoint() 用于从 Unicode 码点返回对应字符  
String.raw() 返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法。  
实例方法：codePointAt() 能够正确处理4个字节储存的字符，返回一个字符的码点  
实例方法：normalize() Unicode 正规化  
实例方法：includes(), startsWith(), endsWith()等  
[更多方法](https://es6.ruanyifeng.com/#docs/string-methods)  
  
### 正则的扩展  

+ u修饰符:用来正确处理大于\uFFFF的 Unicode 字符  
+ y修饰符:与g修饰符类似,但y修饰符确保匹配必须从剩余的第一个位置开始,与之前的匹配结果'粘连',隐含了头部匹配的标志^  
+ s 修饰符：dotAll模式,使得.可以匹配任意单个字符  
+ 后行断言,`/(?<=y)x/`x只有在y后面才匹配,先行断言`/x(?=y)/`x只有在y前面才匹配,其否定形式都是将`=`换成`!`  
+ Unicode属性类 写法\p{...}和\P{...}，允许正则表达式匹配符合 Unicode 某种属性的所有字符  
+ 具名组匹配:在圆括号内部，模式的头部添加“问号 + 尖括号 + 组名”如`(?<year>)`,返回结果的groups属性上引用该组名  
  
### 数值的扩展  

+ 0b/0B表示二进制数值,0o/0O表示八进制数值,通过Number()方法转换为十进制  
+ 增加了'_'作为数值分隔符,以方便书写  
+ 新增Number.isFinite(),Number.isNaN(),Number.isInteger()方法  
+ 新增Number.EPSILON极小常量，表示1与大于1的最小浮点数之间的差  
+ 新增Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER常量表示整数的上下限,Number.isSafeInteger()方法判断整数是否在该范围内  
+ 在Math对象上新增了Math.trunc()截取取整,Math.sign()判断正负0等方法  
+ 新增BigInt数据类型,可以表示更大范围的数值,在数字后面跟n来表示  
  
### 函数的扩展  

+ 支持默认参数,使用默认参数时不能有同名参数,  
+ 指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。默认参数是惰性的调用重新计算  
+ 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域  
+ 引入rest参数（形式为...变量名），用于以数组的形式获取函数的多余参数  
+ 支持箭头函数，箭头函数没有自己的this，不可当做构造函数或生成器函数使用。在定义对象时使用箭头函数将导致this指向其上级作用域  
+ 尾调用:在函数的最后一步调用另一个函数(仅调用),由于调用位置处于函数,尾调用优化不会保留调用函数的"调用帧"(保存着调用位置和内部变量),从而大幅节省内存.尾调用优化函数内需开启严格模式,递归函数通过这种优化方式能避免内存溢出  
  
### 数组的扩展  

+ 扩展运算符`...`类似于解构赋值,可与解构赋值结合,任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组。  
+ Array.from()将类数组对象和可遍历对象转换成Array对象，扩展运算符依赖Symbol.iterator接口,Array.from()方法依赖length属性  
+ 数组空位,一个位置没有任何值,与该位置值为undefined不同  
  
更多新增方法参见MDN  
  
### 对象的扩展  

属性名表达式,es6中可以在字面量定义对象时通过中括号传入表达式作为属性名  

```js
let obj = {  
  [propKey]: true,  
  ['a' + 'bc']: 123  
};  
```  
  
对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。  

```js
let obj = { foo: 123 };  
Object.getOwnPropertyDescriptor(obj, 'foo')  
//  {  
//    value: 123,  
//    writable: true,  
//    enumerable: true,  /可枚举性  
//    configurable: true  
```  
  
属性遍历:  
`for...in`遍历对象自身和继承的可枚举属性(不含Symbol属性)  
`Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名  
Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名  
Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名  
Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。  
  
super关键字只能在对象的方法中使用,指向当前对象的原型对象  
  
AggregateError错误对象可以同时构造多个错误对象,同时抛出多个错误  
  
### 对象的新增方法  

Object.is()同值相等  
Object.assign()方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。实现了对象的浅拷贝  
  
es6不推荐直接操作对象隐式原型对象__proto__,而是通过Object.setPrototypeOf()写,Object.getPrototypeOf()读,Object.create()生成等方法来操作原型对象  
  
Object.entries()获取对象自身的可枚举键值对数组,Object.fromEntries()则是对应的反向操作  
  
### 运算符扩展  

+ 指数运算符`**`,表示指数计算,以右结合的方式进行,从右向左计算  
+ 链判断运算符`?.`,示例`const firstName = message?.body?.user?.firstName || 'default';`层层判断上级对象或属性是否存在,如果不存在直接返回undefined  
被圆括号包裹时不会影响括号外面的代码.  
不得用于构造函数实例化,右侧不能有模板字符串或十进制数字,不可用于super关键字,不可用于赋值运算左侧  
  
+ Null判断运算符  
`??`相对于`||`,`??`的仅左侧为`null, undefined`,时右侧默认值生效,为`'', false, 0`时则不生效.  
`??`也是逻辑运算符,与`&&`和`||`混用时需加上括号表示优先级否则会报错,  
这三种运算符还可与赋值结合`??=`, `||=`, `&&=`,将左边和右边先进行逻辑判断,最后一次惰性判断的表达式的值赋给左边  
  
### Symbol  
  
原始类型Symbol表示独一无二的值,需要调用Symbol()函数生成,函数参数仅为描述信息,相同的参数生成的Symbol也不同,不可与其他类型的值运算,可转换为bool和String.  
Symbol常用作属性名,避免重名,其定义的属性名为非私有属性  
  
由于对象的key默认为字符串,使用Symbol定义key时需使用方括号,使用也相同  
  
Symbol.for()传入字符串,先搜索同参数的symbol值，未找到再创建  
Symbol.keyFor()返回一个已登记的Symbol类型的key  
ES6还提供了11个内置的Symbol值，指向语言内部使用的方法.详情参考官方文档  
  
### Set和Map  

Set类似数组,但没有重复值,去重算法类似与`===`,但NaN被认为等于自身,  
通过size方法返回成员总数，遍历顺序就是插入顺序  
  
WeakSet与Set类似,但成员只能是对象,对象都是弱引用(垃圾回收不会考虑WeakSet中的引用),因此WeakSet也不可遍历  
  
es6之前Object对象的key只能是字符串,Map则没有这个限制.Map通过`new Map()`来创建,传入参数由键值对数组组成的二维数组,提供了get和set方法.  
  
类似的es6也提供了WeakMap类与WeakSet性质类似,其键名key为弱引用，该对象的其他强引用消除后，对象会被垃圾回收机制回收，不会考虑弱引用，因此WeakMap中的键值对会自动消失(类比linux系统的软连接和硬链接与文件实体inode之间的关系)
  
WeakRef用于直接创建对象的弱引用,`new WeakRef(Object)`,传入对象,返回对象的弱引用,deref()方法返回原始对象或undefined  
  
FinalizationRegistry用来指定目标对象被垃圾回收机制清除以后，所要执行的回调函数。  

```js
const registry = new FinalizationRegistry(heldValue => {  
  // ....  
});  
registry.register(theObject, "some value"); // thisObject要观察的对象  
```  
  
### Proxy  

Proxy在目标对象之前架设"拦截",修改某些操作的默认行为,属于元编程(对编程语言进行编程)`var proxy = new Proxy(target, handler);`target是要拦截的对象,handler对象定义拦截行为,对返回proxy实例的操作会被相应的拦截.proxy实例作为其他对象的原型时,对该对象操作也会相应的拦截  
  
Proxy支持get, set, has, deleteProperty, ownKeys, getOwnPropertyDescriptor, defineProperty, preventExtensions, getPrototypeOf, isExtensible, setPrototypeOf, apply, construct 一共13中行为  
  
`get(target, propKey, receiver)`拦截读取操作,传入目标对象,属性名,Proxy实例操作对象(可选)  
`set(target, propKey, value, receiver)`拦截某个属性的赋值操作  
`apply(target, ctx, args)`拦截函数的调用,call,apply操作,传入目标对象,上下文,参数  
  
Proxy.revocable()返回一个可取消的Proxy实例  

```js
let target = {};  
let handler = {};  
let {proxy, revoke} = Proxy.revocable(target, handler);  
proxy.foo = 123;  
proxy.foo // 123  
revoke(); // 取消代理实例  
proxy.foo // TypeError: Revoked  
```  

代理情况下被代理目标对象内部的this关键字会指向Proxy代理,而proxy拦截对象内部的this指向handler,这两个问题会导致某些对象无法代理需要特别注意  
TODO:proxy和Object.defineProperty在代理数据时的区别
  
### Reflect  
  
原来属于Object对象的一些语言内部的方法,均放置到Reflect对象上,Object操作都变成了函数式的行为，操作成功与失败返回bool值  
Reflect对象的方法与Proxy对象的方法一一对应  
13个静态方法：  
Reflect.apply(target, thisArg, args)  
Reflect.construct(target, args)  
Reflect.get(target, name, receiver)  
Reflect.set(target, name, value, receiver)  
Reflect.defineProperty(target, name, desc)  
Reflect.deleteProperty(target, name)  
Reflect.has(target, name)  
Reflect.ownKeys(target)  
Reflect.isExtensible(target)  
Reflect.preventExtensions(target)  
Reflect.getOwnPropertyDescriptor(target, name)  
Reflect.getPrototypeOf(target)  
Reflect.setPrototypeOf(target, prototype)  
  
### Promise对象  

主要用于异步编程，Promise对象状态不受外界影响，只有pending，fulfilled，rejected三种状态，一旦状态改变就不会再变。  
一旦新建就无法取消，没有设置回调函数就会内部报错，处于pending状态是无法得知进度  
  
调用resolve或reject并不会结束Promise参数函数的执行,所以最好在调用这两个函数时return,并将后续要处理的逻辑放入then方法中  
  
+ Promise.prototype.then()方法将返回一个新的Promise,因此可以使用链式调用.  
+ Promise.Prototype.catch()是.then(null/undefined, rejection)的别名,指定发生错误时的回调函数.推荐使用then,catch的组合,以便catch可以捕获到之前所有then的错误,若没有指定catch,Promise的错误不会冒泡到对象外面  
+ Promise.prototype.finally()方法无论Promise最后状态如何,都会执行操作,其本质时then的特例  
  
+ Promise.all()方法将多个Promise实例包装成一个新的Promise实例,入参为数组或具有Iterator接口的对象,每个成员为Promise实例;  
  
只有所有的Promise实例都为fulfilled状态时,返回的Promise才为fulfilled状态取得返回值数组,否则就为rejected并且获取到rejected实例的返回值  
  
+ 与Promise.all()类似的方法还有Promise.race(),Promise.allSettled(),Promise.any()等  
  
### Iterator 和 for...of 循环  
  
Iterator机制,是一种接口,为不同的数据提供统一的访问机制,主要供for...of循环遍历消费.  
其本质是包含next方法的指针对象,next方法会返回成员信息和done(bool类型,表遍历是否结束),  
原生数据结构的Iterator接口键值为`[Symbol.iterator]`,解构赋值、扩展运算符、yield*等运算符依赖于该接口  
  
for...of循环提前退出时,就会调用指针对象的return方法  
  
### Generator函数  
  
+ Generator函数内封装了多个状态,执行函数会返回一个遍历器Iterator,调用遍历器的next方法依次返回每个内部状态,定义与使用：  

```js
function* GenFun() {  
  yield 'status1';  
  yield 'status2';  
  return 'ending';  
}  
  
let iter = GenFun()  
iter.next() // {value : 'status1'， done:false}  
```  

+ yield表达式是暂停标志,采用了惰性求值只有调用next指向该语句时,表达式才会执行.和return语句类似,但只能在Generator函数内部使用  
  
+ next方法携带参数时,参数会被当做上一个yield表达式的返回值res`let res = yield i`,若没有带参数,则表达式返回值为undefined  
  
+ Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获  
  
+ next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的传入语句替换yield表达式。  
+ yield* 表达式用于在一个Generator函数中调用另一个Generator函数或实现了Iterator接口的对象,其结果将被整合进调用方的Generator函数中  
+ Generator函数作为对象属性时可简写为`*GenFunAttr(){}`,Generator函数返回遍历器的this并不指向Generator  
  
Generator是实现状态机的最佳结构,通过调用next实现状态翻转.Generator函数是ES6对协程的不完全实现。  
ps：协程通常用于单线程程序实现并发，其调用栈为冻结交换执行权的方式，与子例程(一个调用栈嵌套)相比和线程的工作默认更像  
Generator函数多用于将异步操作同步化表达、控制流管理、部署Iterator接口等场景  
  
### Generator函数的异步应用  

+ 异步是指一个任务不连续完成，Generator函数能够暂停函数的执行,向外部交出函数执行权,因此也能实现异步应用  
  
+ Thunk函数类似于包装函数,是自动执行(将执行权交回Generator函数)Generator函数的一种方法  
  
Thunk函数的思想源于传名调用,即传入参数为表达式时,不立即计算表达式,而是用到对应参数时,再计算表达式参数,这个过程可以通过将参数放入临时函数(Thunk函数)中再将函数传入函数体,使用时调用来实现  
JS是传值调用的,Thunk函数被用来包装其他函数,可将多参数函数变为单参数函数,对应的库有Thunkify等  
Thunk函数与Generator函数结合,自动执行Generator函数,实例代码如下:  

```js
var fs = require('fs');  
var thunkify = require('thunkify');  
var readFileThunk = thunkify(fs.readFile); // 准备Thunk函数  
// 基于Thunk函数的Generator执行器  
function run(fn) {  
  var gen = fn();  
  function next(err, data) {  
    var result = gen.next(data);  
    if (result.done) return;  
    result.value(next);  
  }  
  next();  
}  
var g = function* (){  
  var f1 = yield readFileThunk('fileA');  
  var f2 = yield readFileThunk('fileB');  
  // ... yield表达式中必须为Thunk函数  
  var fn = yield readFileThunk('fileN');  
};  
run(g); // 开始自动执行Generator函数  
```  

+ 进一步的co模块将两种自动执行器(Thunk函数和Promise对象)进行包装,传入Generator函数yield表达式后面必须为Thunk或Promise  
  
### async 函数  

async函数是Generator函数的语法糖,表现形式为async代替函数的*号,await代替yield.  
async的改进有:内置执行器,不再需要co等模块;await表达式可以跟原始类型值(但会被转换为立即resolved的Promise对象);返回值为Promise;  
  
函数返回值会作为then()回调函数的参数.  
若async函数中某个await报错,后续的await都不会执行,整个函数将变为rejected状态,为避免此情况可主动捕获错误(try或.catch()均可)  
  
顶层await可将,await关键字用于异步加载模块而无需写在async函数中(仅es6的import模块支持)  
  
### Class语法  

+ class语法关键字是语法糖,定义的类的所有方法都在Prototype上,类中定义的所有方法都是不可枚举的  
+ 类的内部可以使用get,set关键字修饰的函数拦截属性的读/写行为,这类函数都是设置在属性的Descriptor对象上的  
+ 使用class表达式时,类名只能在内部使用,外部使用表达式左边的变量.利用表达式可以写出立即执行的class  
  
+ class中由static修饰的静态方法不会被实例所继承,方法内使用的this指向类而非普通方法中的实例对象,父类的静态方法可被子类继承  
  
+ 与方法同级的属性定义也属于实例属性,因此可以不必将属性都定义在constructor()中,这种定义方式不必书写this  
  
+ 截止目前类的静态属性不支持通过static关键字定义在类的内部,只能在类定义完成后再进行挂载  
目前有个提案使用static在内中定义静态属性,仅部分环境实现,未来可能全面支持  
  
+ es6暂不支持私有属性和方法,只能通过约定的命名,Symbol键值等方式模拟实现.  
私有属性和方法也有个提案,使用#作为命名前缀表示私有属性和方法  
  
in运算符可用于判断私有属性是否在对象中存在  
  
+ ES2022引入了静态块,允许在类的内部设置一个代码块，在类生成时运行一次，主要作用是对静态属性进行初始化。  
类的内部只能有一个静态块,静态属性声明后运行,块内不能有return语句,块内可使用this或类名  
  
new.target属性一般用于构造函数中,返回new命令作用的那个构造函数,如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。可以利用这个属性可以实现只能继承,不能实例化的类(类似于其他语言中的接口)  
  
### Class的继承  

+ class通过extends关键字实现继承  
  
+ Object.getPrototypeOf方法可以用来从子类上获取父类,可用这个方法判断一个类是否继承另一个类  
+ super关键字  
  
作为super()方法时,只能在constructor()中调用,且必须调用一次super()否则子类得不到this对象.es6中先通过super()方法实例化父类实例对象的属性和方法,加到this上,然后再由子类构造函数修改this(此过程中this始终是指向子类的)  
  
作为对象使用时在普通方法中指向父类的原型对象;在静态方法中,指向父类;通过super调用父类方法时,方法内部this指向子类实例,静态方法中调用时,则指向子类  
  
+ 类的Prototype和__proto__属性  
  
类同时有prototype属性和__proto__属性,同时存在两条继承链.  

1. 子类的__proto__属性，表示构造函数的继承，总是指向父类  
2. 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性  
  
这两条继承链，可以这样理解：作为一个对象时，子类（B）的原型（__proto__属性）是父类（A）；作为一个构造函数时，子类（B）的原型对象（prototype属性）是父类的原型对象（prototype属性）的实例。  
  
### Module的语法  

ES6模块使用的是编译时加载(静态加载)，与ES6的模块语法import相比CommonJS模块是运行时加载的方式引入，无法做到按需引入  
  
ES6模块自动采用严格模式;export命令必须与模块内部变量建立一一对应关系，输出的接口与对应的值是动态绑定关系，可通过接口获取模块内实时的值  
  
CommonJS和import混用时，import会被首先执行而与位置无关  
  
默认导出和导入都相当与导入导出default，export default命令的本质是将后面的值，赋给default变量  
  
`export { foo, bar } from 'myModule'`相当于没有在当前模块引入，仅做了转发，通过这点可以实现模块之间的继承  
  
import关键字在作为方法使用时是动态加载的，import(path)返回一个Promise对象，传入参数可以是js表达式，返回路径字符串  
  
### Module的加载实现  

+ 浏览器加载，`<script></script>`标签的defer或async属性用于指定脚本异步加载，defer是渲染完后执行，async是下载完后执行，这两个属性对内联脚本都无效，同时使用时defer属性将失效。加载ES6模块时还需加上type="module"属性，脚本会异步加载等渲染完后再按模块出现的顺序执行  
+ ES6模块与CommonJS模块  
  
ES6模块输出的值是引用，编译时就输出接口，import命令是异步加载依赖解析；而CommonJS是输出值拷贝，运行时加载，require()是同步加载模块  
  
+ Node.js的模块加载方法  
  
CommonJS是Node.js专用的模块，采用reqiure(),module.exports方式引入和暴露，Node.js v13.2版本开始对ES6模块提供支持，但要求ES6模块后缀文件后缀名改为.mjs或在项目文件package.json中设置属性`"type":"module"`  
  
`.mjs`总是以ES6模块加载，`.cjs`总是以CommonJS模块加载，两种模式尽量不要混用  
  
package.json文件中main和exports字段都可以执行模块的入口文件。exports字段的优先级较高，其字段别名为`.`时代表模块的主入口，exports字段还可实现条件加载  
  
在CommonJS模块中加载ES6模块只能使用import()方法，而ES6中加载CommonJS模块之只能整体加载  
  
+ 循环加载  
  
两个模块相互依赖的情况为循环加载。  
CommonJS循环加载时只返回当前已执行部分的值.  
ES6循环加载时，先加载的模块a会保留引用，后加载的模块b在发现依赖a时，会认为a已经成功加载，因此此时引用a中的变量会引发not defiend错误，若引用的是a中的函数时，由于函数具有提升作用，因此会正常执行函数  
  
## 编程风格  

字符串一律使用单引号；优先使用解构赋值；单行定义对象时不以逗号结尾，多行时以逗号结尾;少用 self/_this/that 绑定 this，简单的、单行的、不会复用的函数，建议采用箭头函数；所有配置项参数都应该集中在一个对象，放在最后一个参数；需要用到哈希映射时，尽量使用Map数据结构，而非Object，因为Map中有遍历机制；模块输出时export与export default尽量不要同时使用  
  
## 读懂规格  

规格文件是计算机语言的官方标准，详细描述语法规则和实现方法，[ES6规格](https://www.ecma-international.org/ecma-262/6.0/),如果有语法实在无法理解，找不到答案时，可以去看看规格文件  
  
### 异步遍历器  

类似于同步遍历器的对称  
(暂简单了解，笔记待完善)  

### ArrayBuffer二进制数组  

ArrayBuffer对象、TypedArray视图和DataView视图是 JavaScript 操作二进制数据的一个接口，可用于AJAX，Canvas，File API，多线程等场景  
(暂简单了解，笔记待完善)  

### 最新提案  

do表达式使代码块也可有返回值；  
throw表达式;函数的部分执行；  
管道运算符|>;  
`Math.signbit()`判断符号位是否被设置;  
双冒号元算符`thisObj::Fun`将左边的this对象绑定到右边的函数中；  
Realm API 提供沙箱功能，提供单独的new Realm().global全局对象；  

`#!`命令，功能类似bash或python中的对应命令  

import.meta提供当前模块的元信息；  
允许import命令加载JSON模块；  

### 装饰器  

装饰器仅可用于类或类的方法，具体作用与java的注解，python的装饰器类似  
装饰器提案仍未定稿  
