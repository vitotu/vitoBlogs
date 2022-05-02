# 深拷贝
JSON.parse(JSON.stringify())的方式无法复制函数等数据类型，因此不是完备的深拷贝
Object.assign为浅层拷贝，对象深层嵌套时拷贝的是引用
```js
class Demo {
/**
 * 深拷贝关注点:
 * 1. JavaScript内置对象的复制: Set、Map、Date、Regex等
 * 2. 循环引用问题
 * @param {*} object
 * @returns
 */
  static deepClone(source, memory) {
    const isPrimitive = (value) => {
      return /Number|Boolean|String|Null|Undefined|Symbol|Function/.test(
        Object.prototype.toString.call(value)
      );
    };
    let result = null;
    memory || (memory = new WeakMap());
    if (isPrimitive(source)) { // 原始数据类型及函数
      console.log("current copy is primitive", source);
      result = source;
    }
    else if (Array.isArray(source)) { // 数组
      result = source.map((value) => Demo.deepClone(value, memory));
    }
    // 内置对象Date、Regex
    else if (Object.prototype.toString.call(source) === "[object Date]") {
      result = new Date(source);
    } else if (Object.prototype.toString.call(source) === "[object Regex]") {
      result = new RegExp(source);
    }
    // 内置对象Set、Map
    else if (Object.prototype.toString.call(source) === "[object Set]") {
      result = new Set();
      for (const value of source) {
        result.add(Demo.deepClone(value, memory));
      }
    } else if (Object.prototype.toString.call(source) === "[object Map]") {
      result = new Map();
      for (const [key, value] of source.entries()) {
        result.set(key, Demo.deepClone(value, memory));
      }
    }
    else { // 引用类型
      if (memory.has(source)) { // 利用weakMap解决循环引用问题
        result = memory.get(source);
      } else {
        result = Object.create(null);
        memory.set(source, result);
        Object.keys(source).forEach((key) => {
          const value = source[key];
          result[key] = Demo.deepClone(value, memory);
        });
      }
    }
    return result;
  }
  static test() {
    let data = {
      a:1,
      b:[1,2,3],
      c(){console.log('func c')},
      d:{ config1:'test'}
    }
    let copy = Demo.deepClone(data)
    console.log('origin:', data, 'copy:', copy);
    console.log(data === copy)
  }
}
```
# compose函数
```js
// 传入函数数组，从右向左结合的合并函数
class Demo {
  static compose(...fns){
    return fns.reduce(
      (acc, cur) => (...args) => acc(cur(args))
    )
  }
  static test() {
    let fn1 = x => x*x;
    let fn2 = x => x/10;
    let fn3 = x => console.log(x);
    let result = Demo.compose(fn3, fn2, fn1);
    result(4);
  }
}
```
# LRU缓存机制
LRU (最近最少使用) 缓存机制，命中频次越小越有可能被清理的机制  
利用原生Map是有序的特性
```js
class LRUCache {
  constructor(limit){
    this.limit = limit;
    this.cache = new Map();
  }
  get(key) {
    if(!this.cache.has(key)) return undefined;
    let val = this.cache.get(key); // 保存value
    this.cache.delete(key); // 刷新缓存在map中的位置,保证该缓存在队尾
    this.cache.set(key, val);
    return val;
  }
  put(key, val) {
    if(this.cache.has(key)){ // 若存在key，则刷新缓存在map中的位置
      this.cache.delete(key);
    }else if(this.cache.size >= this.limit){ // 若不存在且map大小溢出则删除未被命中间隔时间最长的一个缓存
      this.cache.delete(this.cache.keys().next().value); // 清理对头的缓存
    }
    this.cache.set(key, val);
  }
  static test() { // 测试用例
    const lruCache = new LRUCache(2);
    lruCache.put(1,1);
    lruCache.put(2,2);
    const res1 = lruCache.get(1);
    lruCache.put(3, 3);
    const res2 = lruCache.get(2);
    lruCache.put(4, 4);
    const res3 = lruCache.get(1);
    const res4 = lruCache.get(3);
    const res5 = lruCache.get(4);
    console.log(res1,res2,res3,res4,res5)
  }
}
LRUCache.test();
```
# 可连续调用的sum函数
```js
class Demo {
  static sum(...args) {
    const f = (...rest) => Demo.sum(...args, ...rest);
    f.valueOf = () => args.reduce((x, y) => x + y, 0);
    return f;
  }
  static test() {
    console.log(Demo.sum(1, 2, 3).valueOf()); //6
    console.log(Demo.sum(2, 3)(2).valueOf()); //7
    console.log(Demo.sum(1)(2)(3)(4).valueOf()); //10
    console.log(Demo.sum(2)(4, 1)(2).valueOf()); //9
    console.log(Demo.sum(1)(2)(3)(4)(5)(6).valueOf()); // 21
  }
}
Demo.test();
```
# 简单的querySting编解码
解码面临：
  1. 如何使用正则解析 qs
  2. 如何正确转义汉字
  3. 如何正确处理数组
  4. 如何处理各种复杂的嵌套对象
等问题
实际工作中推荐使用qs库

简单编码约定条件：
  1. 对 null/undefined/object 编码为空字符
  2. 对 key/value 记得 encodeURIComponent
  3. 不考虑数组及嵌套对象等复杂操作

```js
class Solution {
 static parse(url) {
   // 一、夹杂在 ? 与 # 之前的字符就是 qs，使用 /\?([^/?#:]+)#?/ 正则来抽取
   // 使用正则从 URL 中解析出 querystring
   // 二、通过 Optional Chain 来避免空值错误
   const queryString = url.match(/\?([^/?#:]+)#?/)?.[1];
   if (!queryString) {
     return {};
   }
   let queryObj = queryString.split("&").reduce((params, block) => {
     // 三、如果未赋值，则默认为空字符串
     const [_k, _v = ""] = block.split("=");
     // 四、通过 decodeURIComponent 来转义字符，切记不可出现在最开头，以防 ?tag=test&title=1%2B1%3D2 出错
     const k = decodeURIComponent(_k);
     const v = decodeURIComponent(_v);
     if (params[k] !== undefined) {
       // 处理 key 出现多次的情况，设置为数组
       params[k] = [].concat(params[k], v);
     } else {
       params[k] = v;
     }
     return params;
   }, {});
   return queryObj;
 }
 static stringify(data) {
   const pairs = Object.entries(data);
   const qs = pairs
     .map(([k, v]) => {
       let noValue = false;
       if (v === null || v === undefined || typeof v === "object") {
         noValue = true;
       }
       return `${encodeURIComponent(k)}=${noValue ? "" : encodeURIComponent(v)}`;
     })
     .join("&");
   return qs;
 }
 static test() {
   let test1 = [
     "https://abc.com",
     "https://abc.com?a",
     "https://abc.com?name=%E5%B1%B1%E6%9C%88",
     "https://abc.com?name=%E5%B1%B1%E6%9C%88&a=3",
     "https://abc.com?name=%E5%B1%B1%E6%9C%88&a=3&a=4",
     "https://abc.com?name=%E5%B1%B1%E6%9C%88&a=3#hash",
     "https://abc.com?name=1%2B1%3D2",
   ]
   let verify1 = [
     {},
     {a: ''},
     {name: '山月'},
     {name: '山月', a: 3},
     {name: '山月', a: [3, 4]},
     {name: '山月', a: 3},
     {name: '1+1=2'}
   ]
   console.log(test1.map( x => Solution.parse(x)));
   console.log(verify1);
   let test2 = [
     Solution.stringify({ a: 3, b: 4 }),
     Solution.stringify({ a: 3, b: null }),
     Solution.stringify({ a: 3, 山: "月" }),
   ]
   let verify2 = [
     'a=3&b=4',
     'a=3&b=',
     'a=3&%E5%B1%B1=%E6%9C%88',
   ]
   console.log(test2.map((x, i) => x === verify2[i]))
 }
}
Solution.test();
```
# 数组系列操作
```js
class Solution {
  /**
   * @description: 展平数组
   * @param {Array} arr
   * @return {*}
   */
  static flatten(arr){
    return arr.reduce((acc, cur) => {
      if(Object.prototype.toString.call(cur) === '[object Array]'){
        return acc.concat(Solution.flatten(cur));
      }else{
        return acc.concat(cur);
      }
    }, []);
  }
  static shuffle(arr){ // 数组洗牌函数，会改变原数组
    return arr.sort((x, y) => Math.random() - 0.5);
  }
  static test() { // 测试用例函数
    let test = [1,2,3,[4,5],[2,'a',['w', 'g']]];
    console.log(Solution.flatten(test));
  }
}
Solution.test()
```
# 0ms的setTimeout
现象：
```js
let a = performance.now();
setTimeout(() => {
  let b = performance.now();
  console.log(b - a);
  setTimeout(() => {
    let c = performance.now();
    console.log(c - b);
    setTimeout(() => {
      let d = performance.now();
      console.log(d - c);
      setTimeout(() => {
        let e = performance.now();
        console.log(e - d);
        setTimeout(() => {
          let f = performance.now();
          console.log(f - e);
          setTimeout(() => {
            let g = performance.now();
            console.log(g - f);
          }, 0);
        }, 0);
      }, 0);
    }, 0);
  }, 0);
}, 0);
// 前面打印都是4ms以下，后面几层大于4ms
```
原因：浏览器团队初始时按照操作系统事件粒度100ms左右设计，后续为了优化性能设计成了1ms左右，但笔记本厂商反馈耗电问题，最后基于benchmark测试设计成了4ms  
详细参考[文档](https://juejin.cn/post/6846687590616137742)

绕过4ms限制的方法：利用window.postMessage()机制
```js
class Demo {
  static zeroTimeout(){
    let timeouts = [];
    const messageName = 'zero-settimeout'
    function setTimeoutZero(fn) {
      timeouts.push(fn);
      window.postMessage(messageName, '*')
    }
    function handleMessage (event) {
      if (event.source == window && event.data === messageName ) {
        if (timeouts.length > 0) {
          const callback = timeouts.shift()
          callback();
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return setTimeoutZero
  }
  static test(){
    const zeroTimeout = Demo.zeroTimeout();
    var i = 0;
    var startTime = Date.now();
    // 通过递归 setZeroTimeout 达到 100 计数
    // 达到 100 后切换成 setTimeout 来实验
    function test1() {
      if (++i == 100) {
        var endTime = Date.now();
        console.log(`100 iterations of zeroTimeout took ${endTime - startTime} milliseconds.`);
        i = 0;
        startTime = Date.now();
        setTimeout(test2, 0);
      } else {
        zeroTimeout(test1);
      }
    }
    zeroTimeout(test1);
    // 通过递归 setTimeout 达到 100 计数
    function test2() {
      if (++i == 100) {
        var endTime = Date.now();
        console.log(`100 iterations of setTimeout(0) took ${endTime - startTime} milliseconds.`);
      } else {
        setTimeout(test2, 0);
      }
    }
  }
}
Demo.test(); // zeroTimeout100次迭代好使远少于setTimeout(fn,0)
```

应用场景：将任务分段交给postMessage的回调函数，让浏览器主线程拿回控制权，执行优先级更高的渲染工作，减少卡顿
[参考文档](https://zhuanlan.zhihu.com/p/379637806)