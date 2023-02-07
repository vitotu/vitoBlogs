# 常见题解汇总

## 最小大堆

最小/最大堆对应的ts和js实现如下：

```ts
type compareFn<T> = (a:T, b:T) => boolean;
class Heap<T>{
  private compare:compareFn<T>;
  private arr:T[];
  constructor(compare:compareFn<T>, arr:T[] = []){
    this.compare = compare;
    this.arr = arr;
    if(this.arr.length > 0){
      this.buildDown2Top();
    }
  }
  get size():number {
    return this.arr.length
  }
  get data():T[]{
    return this.arr;
  }
  private compareNode(nodes:number[], type:string, end:number):void{
    let [parent, left, right] = nodes;
    if(parent < 0) return;
    let target = parent;
    if(left <= end && this.compare(this.arr[target],this.arr[left])) target = left;
    if(right <= end && this.compare(this.arr[target], this.arr[right])) target = right;
    if(target !== parent){
      let temp = this.arr[target];
      this.arr[target] = this.arr[parent];
      this.arr[parent] = temp;
      type === 'up' ? this.up(parent, end): this.down(target, end)
    }
  }
  private up(child:number, end:number):void{
    if(child < 0 || child > end) return;
    let parent = Math.floor((child - 1) / 2);
    let left = parent * 2 + 1, right = left + 1;
    this.compareNode([parent, left, right], 'up', end);
  }
  private down(parent:number, end:number):void{
    if(parent < 0 || parent > end) return;
    let left = parent * 2 + 1, right = left + 1;
    this.compareNode([parent, left, right], 'down', end); 
  }
  private buildDown2Top(){
    for(let i = this.size - 1; i >= 0; i--) this.down(i, this.size - 1);
  }
  private buildTop2Down(){
    for(let i = 0; i < this.size; i++) this.up(i, this.size - 1);
  }
  public push(item:T){
    this.arr.push(item);
    if(this.size > 1) this.up(this.size - 1, this.size - 1);
  }
  public pop():T | undefined{
    if(this.size <= 0) return undefined;
    let result = this.arr[0];
    this.arr[0] = this.arr[this.size - 1];
    this.arr.pop();
    if(this.size > 1) this.down(0, this.size - 1);
    return result;
  }
  public peek():T|undefined{
    if(this.size <= 0) return undefined;
    return this.arr[0];
  }
  public replace(item:T):void{
    if(this.size <= 0) return;
    this.arr[0] = item;
    if(this.size > 1) this.down(0, this.size - 1);
  }
}
```

```js
class Heap { // 先实现了堆数据结构
  constructor(compare, arr=[]){
    this.compare = compare; // 比较函数，用于控制生产最大堆或最小堆
    this.arr = arr; // 初始化array
    if(arr && Array.isArray(arr)){ // 建堆代码与此题无关
      this._buildDown2Top(); // 若初始化arr不为空，则对arr建堆
    }
  }
  get size() {
    return this.arr.length;
  }
  _buildDown2Top() { // 建堆代码与此题无关
    for(let i = this.size - 1; i >= 0; i--){
      this._down(i, this.size - 1);
    }
  }
  _buildTop2Down() { // 建堆代码与此题无关
    for(let i = 0; i < this.size; i++){
      this._up(i, this.size - 1);
    }
  }
  _down(parent, end) { // 向下递归堆化
    if(parent < 0 || parent > end) return;
    let left = parent * 2 + 1;
    let right = left + 1;
    this._compareNode(parent, left, right, 'down', end);
  }
  _up(child, end){ // 向上递归堆化
    if(child < 0 || child > end) return;
    let parent = Math.floor((child - 1) / 2);
    let left = parent * 2 + 1;
    let right = left + 1;
    this._compareNode(parent, left, right, 'up', end);
  }
  _compareNode(parent, left, right, type, end){ // 每个节点对通用对比函数
    let target = parent;
    if(left <= end && this.compare(this.arr[target], this.arr[left])){
      target = left;
    }
    if(right <= end && this.compare(this.arr[target], this.arr[right])){
      target = right;
    }
    if(target !== parent){
      let temp = this.arr[target];
      this.arr[target] = this.arr[parent];
      this.arr[parent] = temp;
      type === 'up' ? this._up(parent, end) : this._down(target, end);
    }
  }
  push(num) {
    this.arr.push(num);
    this._up(this.size - 1, this.size - 1);
  }
  pop() {
    if(this.size <= 0) return undefined;
    let result = this.arr[0];
    this.arr[0] = this.arr[this.size - 1];
    this.arr.pop();
    this._down(0, this.size - 1);
    return result;
  }
  peek(){
    if(this.size <= 0) return undefined;
    return this.arr[0];
  }
}
```

## n数之和

常见两数之和题目通常使用哈希表存储差值，通过比较差值解题算法复杂度为O(n)，空间复杂度为O(n)，而其扩展题三数之和则通常将数组进行排序，先固定一位数，然后使用双指针对撞的方式来扫描数组，求取三数之和，对于三数以上的n数之和，则与三数之和类似先遍历固定一个元素，然后使用递归求取n-1数之和，直到将问题转换为三数之和，则使用三数之和的方法进行求解。以下为代码示例  

```ts
class Demo {
  static nSum(nums:number[], target:number, n:number):number[][]{
    let result:number[][] = [];
    nums.sort((a, b) => a -b); // 对数组进行排序，方便使用指针对撞
    Demo.nSumCore(nums, target, n, 0, result, []);
    return result;
  }
  static nSumCore(nums:number[], target:number, n:number, index:number, res:number[][], acc:number[]) {
    if(index >= nums.length || n < 3) return; // 仅当n >= 3时才采用此算法
    for(let i = index;i < nums.length; i++){
      if(i>index && nums[i] === nums[i-1]) continue; // 跳过之前已遍历的重复元素
      if(n>3){ // 当n大于3时递归的调用n数之和，最终转换为3数之和求解
        Demo.nSumCore(nums, target, n-1, i+1, res, [nums[i], ...acc]);
        continue;
      }
      let left = i + 1, right = nums.length - 1;
      while(left < right) { // 固定i值，左右指针对撞
        let accVal = 0 // 当acc为空数组时，直接调用reduce会报错
        if(acc.length > 0) accVal = acc.reduce((pre, cur) => pre + cur);
        let sum = nums[i] + nums[left] + nums[right] + accVal;
        if(sum === target) { // 找到组合，存储结果
          res.push([...acc, nums[i], nums[left], nums[right]]);
          while(left < right && nums[left] === nums[left+1]){
            left++; // 左右指针对撞，若左指针的下一个值与当前值相同，则右移一位
          }
          while(left < right && nums[right] === nums[right-1]){
            right--; // 左右指针对撞，与左指针逻辑类似，可跳过重复的元素
          }
          left++; // 找到组合和左右指针当前值已被存储，需要向右向左移动一位
          right--;
        } else if (sum < target) {
          left++; // 如果求和较小，则右移左指针
        } else {
          right--;
        }
      }
    }
  }
  static test(){
    let data = [-1,0,1,2,-1,-4];
    console.log(Demo.nSum(data, 0, 3));
  }
}
Demo.test();
```

## 接雨水

## topK优先队列问题

背景：求数组中出现频率top k的元素

思路：此类问题需要先进行一次遍历，通过map统计并保存元素出现的频次，然后遍历map可通过维护大小为k的[最小堆(top k)或最大堆(low k)](#最小大堆)实现top k元素的获取

```js
// 通过遍历实现
class Solution {
  static duplicate(nums, k){
    let result;
    let cache = new Map();
    for(const item of nums){
      if(!cache.has(item)){
        cache.set(item, 1)
      }else{
        let tmp = cache.get(item);
        cache.set(item, tmp+1);
      }
    }
    return (Array.from(cache)).sort((a, b) => a[1] <= b[1] ? 1 : -1).slice(0, k).map(item => item[0]);
  }
  static test(){
    let nums = [1,2,3,3,4,5,5];
    let k = 2
    // 重复次数最多的前k个数字
    console.log(Solution.duplicate(nums, k))
  }
}
Solution.test();
```

```ts
// 通过最大/小堆实现
class Solution{
  static topKFrequent<T>(nums:T[], k:number):T[]|undefined{
    if(nums.length < k) return undefined;
    let countMap:Map<T, number>= new Map();
    for(const item of nums){
      if(countMap.has(item)){
        let tmp = countMap.get(item);
        countMap.set(item, tmp+1);
      }else countMap.set(item, 1);
    }
    const compare = (a:[T,number], b:[T, number]) => a[1] > b[1] ? true : false;
    let result:Heap<[T, number]> = new Heap(compare);
    debugger
    for(const item of countMap){
      if(result.size < k) result.push(item);
      else {
        let tmp = result.peek();
        if(item[1] > tmp[1]) {
          result.replace(item);
        }
      }
    }
    return result.data.map(item => item[0])
  }
  static test(){
    let example = [5,3,1,1,1,3,73,1], k = 2;
    console.log(Solution.topKFrequent<number>(example, k));
  }
}
Solution.test();
```
