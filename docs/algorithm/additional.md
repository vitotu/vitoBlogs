# 额外的算法题

## 浅拷贝

实现自定义对象的浅拷贝，不考虑Map,Set,Array,等内置对象，考虑原型链

```js
// 浅拷贝仅对第一层进行复制，因为不考了Map,Set,Array等内置对象，因此对这些对象不做判断
var shallowCopy = function(obj){
  const isPrimitive = x => /Number|String|Boolean|Null|Undefined|Symbol|Function/.test(Object.prototype.toString.call(obj));
  let result = null;
  if(isPrimitive(obj)){
    result = obj;
  } else {
    result = Object.create(Object.getPrototypeOf(obj));
    Object.keys(obj).forEach(key => {
      result[key] = obj[key];
    })
  }
  return result;
}
```

## 随机权重

给你一个下标从0开始的正整数数组w，其中w[i]代表第i个下标的权重。  
请你实现一个函数pickIndex，它可以随机地从范围[0, w.length - 1]内（含0 和w.length - 1）选出并返回一个下标。选取下标i的概率为`w[i]/sum(w)`  
例如，对于`w = [1, 3]`，挑选下标0的概率为`1 / (1 + 3) = 0.25`（即，25%），而选取下标 1 的概率为`3 / (1 + 3) = 0.75`（即，75%）。

+ 解题思路一：
  + 如上例数组`[1,3]`转换为`[0, 1, 1, 1]`然后随机取出其中一位即可
+ 解题思路二：
  + 接思路一，`[1,3]`可划分为两个区间[1, 1], [2, 4]长度恰好为1，3
  + 对于区间左边界是它之前出现的所有元素的和加上1，右边界是到它为止的所有元素的和
  + 因此其右边界表示为`pre[i] = sum(w(k))`,左边界为`pre[i] - w[i] + 1`,随机数在区间内则返回对应区间的i
  + 可通过二分查找法找到i

```js
var Solution = function(w) {
    pre = new Array(w.length).fill(0); // 辅助存储区间(仅存右边界即可)
    pre[0] = w[0];
    for (let i = 1; i < w.length; ++i) {
        pre[i] = pre[i - 1] + w[i];
    }
    this.total = pre[pre.length - 1];
};
// Solution([3,1,2,4,4,6,1,3,7,9,11]);

Solution.prototype.pickIndex = function() {
    const x = Math.floor((Math.random() * this.total)) + 1;
    const binarySearch = (x) => {
        let low = 0, high = pre.length - 1;
        while (low < high) {
            const mid = Math.floor((high - low) / 2) + low;
            if (pre[mid] < x) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
    return binarySearch(x);
};
```

## 异步并发控制

并发类，限制异步并发数，可多次添加任务

```js
class AsyncWorker {
  constructor(capacity){
    this.capacity = capacity;
  }
  thenable(target) { // 判断是否时 thenable对象
    if(target !== null && (
      typeof target === 'object' || typeof target === 'function'
      ) && typeof target.then === 'function'
    ) return true;
    return false;
  }
  exec(task) {
    this.runningCount = this.runningCount || 0;
    this.callback = this.callback || [];
    const next = () => {
      if(this.runningCount < this.capacity && this.callback.length > 0){
        const {task, resolve, reject} = this.callback.shift(); // 出队任务包
        this.runningCount++; // 正在运行任务数加一
        // 输入task类型检查
        let thenable = null;
        if(this.thenable(task)) thenable = task;
        else if (typeof task === 'function') {
          thenable = task();
          if(!this.thenable(thenable)) throw new Error('task function must return a thenable object');
        } else throw new Error('task must be a thenable object or a function return a thenable');
        // 运行task
        thenable.then(r => {
          resolve(r);
        }).catch(e => {
          reject(e);
        }).finally(r => {
          this.runningCount--;
          next(); // 自动触发任务队列中下一个任务
        })
      }
    }
    return new Promise((resolve, reject) => {
      this.callback.push({task, resolve, reject}); // promise exec中入队
      next();
    })
  }
  static async test() { // 测试用例
    const asyncWorker = new AsyncWorker(2);
    const createWork = (error, time) => { // 创建任务函数
      return function() {
        return new Promise((resolve, reject) => {
          setTimeout(()=>{
            if(error){
              reject(error);
            }else{
              resolve(`success, ${time}`);
            }
          }, time)
        })
      }
    }
    let example = [200, 1000, 50, 5000, 300, 100].map(
      x => createWork(null, x)
    ); // 用例任务列表
    await example.forEach(task => {
      // 由于并发限制200一定在50之前触发，300一定在100之前， 1000一定在300之前
      asyncWorker.exec(task).then(r => console.log(r));
    })
    await example.forEach(task => { // 按定时时间长短触发
      task().then(r => console.log('normal: ', r))
    })
  }
}
AsyncWorker.test().then();
```