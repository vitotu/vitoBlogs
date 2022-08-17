# labuladong算法学习笔记

labuladong文档中代码没有使用js，故这篇学习笔记主要用于记录使用js/ts实现对应部分的代码，详细算法解析等推荐配合原著阅读[labuladong的github站](https://labuladong.github.io/algo/)|[labuladong的gitee站](https://labuladong.gitee.io/algo/)

## 二叉树

二叉树既可以递归(前中后序遍历)也可以遍历(层序遍历)，其中递归的三种方式对应这三个处理问题的不同节点：前序位置仅能获取从父节点传来的参数，后序位置还能获取子树函数返回值  

另外，二叉树的递归还可从遍历一遍二叉树(回溯法)和分解问题(动态规划)两个角度来看待  

设计例题：leetcode 的104题二叉树的最大深度

```ts
// 分解问题的解法
function maxDepth(root: TreeNode | null): number {
  if(root === null) return 0;
  let leftMax:number = maxDepth(root.left);
  let rightMax:number = maxDepth(root.right);
  let res = Math.max(leftMax, rightMax) + 1;
  return res;
};
// 遍历或者说回溯的解法
class Solution {
  res:number = 0;
  deep:number = 0;
  maxDepth(root: TreeNode | null):number{
    this.traverse(root);
    return this.res;
  }
  traverse(root: TreeNode | null):void {
    if(root === null) return;
    this.deep++;
    if(root.left === null && root.right === null) {
      this.res = Math.max(this.deep, this.res);
    }
    this.traverse(root.left);
    this.traverse(root.right);
    this.deep--;
  }
  static test(root){
    let demo = new Solution();
    let res = demo.maxDepth(root);
    return res;
  }
}
```

leetcode 144题：二叉树的前序遍历

```ts
// 由于分解问题的方式代码看起来简洁
function preorderTraversal(root: TreeNode | null): number[] {
  if(!root || root.val===undefined) return [];
  let left:number[] = preorderTraversal(root.left);
  let right:number[] = preorderTraversal(root.right);
  return [].concat(root.val, left, right);
};
// 遍历的做法
class Solution {
  private res:number[] = [];

  preorderTraversal(root: TreeNode | null): number[]{
    this.traverse(root);
    return this.res;
  }

  traverse(root: TreeNode | null):void{
    if(!root || root.val ===undefined) return;
    this.res.push(root.val);
    this.traverse(root.left);
    this.traverse(root.right);
  }
  static test(root: TreeNode | null):number[]{
    let demo = new Solution();
    return demo.preorderTraversal(root);
  }
}
```

leetcode 543题：二叉树的直径  
直径即节点间的距离，即两个节点之间相距一个单位，由此可得：每一条二叉树的「直径」长度，就是一个节点的左右子树的最大深度之和

```ts
class Solution {
  private MaxPath = 0;
  diameterOfBinaryTree(root:TreeNode | null):number{
    this.deepMax(root);
    return this.MaxPath;
  }
  deepMax(root:TreeNode | null):number{
    if(!root || root.val === undefined) return 0;
    let leftMax = this.deepMax(root.left);
    let rightMax = this.deepMax(root.right);
    this.MaxPath = Math.max(this.MaxPath, leftMax + rightMax); // 在后续位置计算最大直径
    return 1 + Math.max(leftMax, rightMax); // 函数返回作为子树时的最大深度
  }
  static test(root: TreeNode | null): number {
    if(!root || root.val === undefined) return 0;
    let demo = new Solution();
    return demo.diameterOfBinaryTree(root);
  }
}
```

## 动态规划

动态规划三要素：重叠子问题、最优子结构、状态转移方程  
动态规划离不开递归算法(自顶向下分解问题)/递推算法(自底向上递推结果)  
ps:递归算法的时间复杂度怎么计算？就是用子问题个数乘以解决一个子问题需要的时间。

- 重叠子问题:通常使用备忘录(即打表)的方式避免重复的计算
- 状态转移方程：递推，确定状态转移方程的基本模式是：`明确 base case -> 明确「状态」-> 明确「选择」 -> 定义 dp 数组/函数的含义。`
- 最优子结构：子问题间相互独立，不相互影响

关联题：

leetcode 322 零钱兑换  
如对于目标金额 amount=11 ，coins=[1, 2, 5], 分解问题可由 10+1, 9+2, 5+6的方式凑成，因此记`dp[i]`为凑成金额i的最少硬币数，仅此`dp[11] = min(dp[10], dp[9], dp[6]) + 1`, 初始base `dp[0] = 0`, 部分不能凑成的数额则记为-1，因此上述例子即可抽象出状态转移方程

```ts
function coinChange(coins: number[], amount: number): number {
  // 初始化dp为amount+1，就因为凑成amount最多使用amount个硬币
  let dp:number[] = new Array(amount+1).fill(amount+1);
  dp[0] = 0; // 初始话起始值
  for(let i = 0; i < dp.length; i++){ // 循环计算每个金额所需要的最少硬币数
    for(let coin of coins){ // 遍历尝试每个硬币组合
      if(i - coin < 0) continue; // 若遇到无法达成的组合则直接跳过
      dp[i] = Math.min(dp[i], 1 + dp[i - coin]); // 比较与更新硬币组合数
    }
  }
  // 若目标金额仍等于初始值，则返回无法凑成的结果
  return (dp[amount] === amount + 1) ? -1 : dp[amount]; 
};
```

leetcode 509 斐波那契数
取初始值`dp[1] = 1`, `dp[2] = 1`,则从第3个数开始循环,计算`dp[n] = dp[n-1] + dp[n-2]`，并更新响应的两个缓存值，直到`i=n`则，返回此时的最新缓存值即可

```ts
function fib(n: number): number {
  let dp:[number, number] = [1, 1];
  if(n <= 0) return 0;
  if(n === 1 || n === 2) return dp[0];
  for(let i = 3; i <= n; i++) {
    let tmp = dp[0] + dp[1];
    dp[0] = dp[1];
    dp[1] = tmp;
  }
  return dp[1];
};
```

## 回溯法

回溯法需要考虑三个要素：路径、选择列表、结束条件;其本质是多叉树的遍历，在前序位置操作记录，在后续位置操作删除

leetcode 46 全排列

```ts
interface Visited {[key:number]: boolean};

function permute(nums: number[]): number[][] {
  if(nums.length === 0) return [[]];
  if(nums.length === 1) return [nums];
  let demo = new Solution();
  return demo.permute(nums);
};

class Solution {
  res:number[][] = [];
  permute(nums: number[]): number[][] {
    // 主函数中初始化visited记录访问过的数字，track记录访问路径，即排列
    let visited:Visited = {};
    let track:number[] = [];
    this.backtrack(nums, track, visited);
    return this.res;
  }
  backtrack(nums:number[], track:number[], visited:Visited){
    if(track.length === nums.length){ // 终止条件，存储一种排列并返回
      this.res.push([...track]);
      return
    }
    for(let i = 0; i < nums.length; i++) {
      const val = nums[i];
      if(visited[val]) continue; // 跳过已访问的数字
      visited[val] = true; // 递归前标记访问，并记录节点
      track.push(val)
      this.backtrack(nums, track, visited);
      visited[val] = false; // 递归返回后，删除标记，并删除节点
      track.pop();
    }
  }
}
```

leetcode 51 N皇后问题

```ts
function solveNQueens(n: number): string[][] {
  let demo = new Solution();
  return demo.solveNQueens(n);
};

class Solution {
  res:string[][] = [];
  solveNQueens(n: number): string[][] {
    let solve:string[][] = new Array(n).fill(0).map(item => new Array(n).fill('.'))
    solve[0][0] = 'Q';
    this.backtrack(solve, 0)
    return this.res;
  }
  backtrack(track:string[][], row:number){
    if(row === track.length){ // 本轮递归超过最后一行，因此收集结果结束递归
      this.res.push(track.map(item => item.join('')));
      return;
    }
    for(let col = 0; col < track.length; col++){ // 遍历当前列
      if(!this.isValid(col, row, track)) continue;
      track[row][col] = 'Q'; // 递归前标记
      this.backtrack(track, row+1); // 递归新的行
      track[row][col] = '.'; // 递归后回溯
    }

  }
  isValid(col:number, row:number, track:string[][]):boolean {
    let n = track.length; // 判断该位置是否能放置一个皇后
    for(let i = 0; i < row; i++){
      if(track[i][col] === 'Q') return false;
    }
    for(let i = row - 1, j = col - 1; i >=0 && j >= 0; i--, j--){
      if(track[i][j] === 'Q') return false;
    }
    for(let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++){
      if(track[i][j] === 'Q') return false
    }
     return true;
  }
}
```

## BFS算法框架

其核心思想是，把问题抽象成图，从一个点向四周扩散，使用队列暂存扩散点，方便进行下一轮迭代

leetcode 111题 二叉树的最小深度

```ts
function minDepth(root: TreeNode | null): number {
  if(root == null) return 0;
  let queue:TreeNode[] = [];
  queue.push(root);
  let deep = 1; // 初始化层数
  while(queue.length > 0){
    let length = queue.length;
    for(let i = 0; i < length; i++) { // 仅对长度进行循环，不使用索引
      let cur:TreeNode = queue.shift(); // 每次从队头推出一个节点
      if(cur.left === null && cur.right === null) return deep; // 找到叶子节点则直接返回
      if(cur.left !== null) queue.push(cur.left); // 依次推入左右节点
      if(cur.right !== null) queue.push(cur.right);
    }
    deep++; // 遍历完一层更新层数
  }
  return deep;
};
```

leetcode 752 打开转盘锁  
每次只能转动一个轮盘且轮盘只能转动一个数组，即当前状态下一步可能有8种转法(4个数字，上下2中转法)，使用最少的步骤转动轮盘到target组合，且过程中须避开deadends

```ts
function openLock(deadends: string[], target: string): number {
  let visited:Set<string> = new Set(); // 使用set记录访问记录，在visited中的组合不会被分析
  for(let key of deadends) visited.add(key); // 将deadends加入到visited中便于跳过
  let queue:string[] = ['0000']; // 初始化队列
  let step = 0;
  while(queue.length > 0) { // 队列不为空时进行遍历
    let len = queue.length;
    for(let i = 0; i < len; i++) { // 取当前层剩余的节点数作为遍历次数，而不用做索引
      let cur = queue.shift(); // 从队头中推出当前组合(节点)
      if(visited.has(cur)) continue // 当前节点已访问过或在deadends中则跳过该组合分析
      else visited.add(cur); // 将当前节点加入到visited中，避免后续重复分析
      if(cur == target) return step; // 若当前节点刚好等于目标密码，则直接返回步数
      for(let j = 0; j < 4; j++){ // 收集该组合(节点)的下一步可能状态，8种
        let tmp = plusOne(cur, j); // j position add number
        if(!visited.has(tmp)){ // node  visited then add to queue
          queue.push(tmp);
        }
        tmp = minusOne(cur, j); // j position minus number
        if(!visited.has(tmp)){
          queue.push(tmp);
        }
      }
    }
    step++; // analyze one node then add step
  }
  return -1; // not found solution then return -1
};
// circular add one
function plusOne(s:string, j:number):string{
  let tmp = Array.from(s);
  if(tmp[j] == '9') tmp[j] = '0'
  else tmp[j] = String(Number(tmp[j]) + 1)
  return tmp.join('');
}
// circular minus one
function minusOne(s:string, j:number):string{
  let tmp = Array.from(s);
  if(tmp[j] == '0') tmp[j] = '9'
  else tmp[j] = String(Number(tmp[j]) - 1);
  return tmp.join('');
}
```

## 回溯法解排列/组合/子集问题

排列/组合/子集问题可以归结为从nums数组中取出若干元素，对应情形有a：无重复不可复选，b：有重复不可复选，c:无重复可复选，按排列/组合/子集进行划分，则总共有9种情况

算法框架使用两种回溯递归树即可，子集/组合可归为一类递归树，而排列则单独一类，所有情况均在这两种树上进行剪枝/扩增

### 子集(元素无重复不可复选)

LeetCode 78 子集:返回nums中能组合出的所有子集  
子集与顺序无关，因此遵循递归树1

```ts
function subsets(nums: number[]): number[][] {
  let demo = new Solution();
  return demo.subsets(nums);
};

class Solution {
  res:number[][] = [];
  subsets(nums: number[]): number[][] {
    let trace:number[] = [];
    this.backtracks(nums, trace, 0);
    return this.res;
  }
  backtracks(nums: number[], trace:number[] , start:number) {
    this.res.push([...trace]); // every iteration collect the trace(every node)
    for(let i = start; i < nums.length; i++) { 
      // use start control end of recursion
      trace.push(nums[i]); // pre-order push to trace
      // next recursion start from i+1 to avoid duplicates subsets
      this.backtracks(nums, trace, i+1); 
      // when i+1 equals nums.length,the recursion will stopped
      trace.pop(); // backtracking
    }
  }
}
```

### 组合(元素无重复不可复选)

leetcode 77 组合:给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。  

解题思路接上题，大小为k的组合就是大小为k的子集，因此仅需在上题算法中取大小为k的结果进行输出即可  

```ts
function combine(n: number, k: number): number[][] {
  let demo = new Solution();
  return demo.subCombine(n, k);
};
class Solution {
  res:number[][] = [];
  subCombine(n: number, k: number): number[][] {
    let trace:number[] = [];
    this.backtrack(n, trace, 1, k);
    return this.res;
  }
  backtrack(n:number, trace:number[], start:number, k:number){
    if(k === trace.length){
      this.res.push([...trace]);
      return;
    }
    for(let i = start; i <= n; i++) {
      trace.push(i);
      this.backtrack(n, trace, i+1, k);
      trace.pop();
    }
  }
}
```

### 排列(元素无重复不可复选)

leetcode 46 全排列 给定不重复的数组nums输出其元素的全排列，不可复选  

由于是全排列，则不可类似上述算法一样使用start限制后续的元素选择，因此采用used辅助数组用于记录已访问的元素，用于避免重复选择， 算法主体与上述类似  

```ts
function permute(nums: number[]): number[][] {
  let demo = new Solution();
  return demo.permuteUnique(nums);
};
class Solution {
  res:number[][] = [];
  permuteUnique(nums:number[]):number[][]{
    let used:boolean[] = new Array(nums.length).fill(false);
    let trace:number[] = [];
    this.traceback(nums, trace, used);
    return this.res;
  }
  traceback(nums:number[], trace:number[], used:boolean[]){
    if(trace.length === nums.length){
      this.res.push([...trace]);
      return;
    }
    for(let i = 0; i < nums.length; i++){
      if(used[i]) continue;
      used[i] = true;
      trace.push(nums[i]);
      this.traceback(nums, trace, used);
      used[i] = false;
      trace.pop();
    }
  }
}
```

### 子集(元素重复不可复选)

leetcode 90 子集(二) 整数数组 nums ，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。  
解集 不能 包含重复的子集。返回的解集中，子集可以按 任意顺序 排列。

```ts
function subsetsWithDup(nums: number[]): number[][] {
  let demo = new Solution();
  return demo.subsetsWithDup(nums);
};
class Solution {
  res:number[][] = [];
  subsetsWithDup(nums:number[]):number[][]{
    nums.sort(); // 先排序，保证相同的元素在相邻的位置
    let trace:number[] = [];
    this.traceback(nums, trace, 0);
    return this.res;
  }
  traceback(nums:number[], trace:number[], start:number){
    this.res.push([...trace]);
    for(let i = start; i < nums.length; i++){
      // 遍历时跳过相同的元素，避免产生重复的组合
      if(i > start && nums[i] === nums[i-1]) continue;
      trace.push(nums[i]);
      this.traceback(nums, trace, i +1);
      trace.pop();
    }
  }
}
```

### 组合(元素重复不可复选)

leetcode 40 组合总数(二) 给定一个候选人编号的集合 candidates(有重复编号) 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的无重复组合。  
candidates 中的每个数字在每个组合中只能使用 一次 。

```ts
function combinationSum2(candidates: number[], target: number): number[][] {
  let demo = new Solution();
  return demo.combinationSum2(candidates, target);
};
class Solution {
  res:number[][] = [];
  curSum = 0;
  target:undefined|number = undefined;
  combinationSum2(cand:number[], target:number):number[][]{
    cand.sort();
    this.target = target;
    let trace:number[] = [];
    this.traceback(cand, trace, 0);
    return this.res;
  }
  traceback(cand:number[], trace:number[], start:number){
    if(this.curSum === this.target) {
      this.res.push([...trace]);
      return;
    }
    if(this.curSum > this.target) return;
    for(let i = start; i < cand.length; i++){
      if(i > start && cand[i] === cand[i-1]) continue;
      this.curSum += cand[i];
      trace.push(cand[i]);
      this.traceback(cand, trace, i+1);
      this.curSum -= cand[i];
      trace.pop();
    }
  }
}
```

### 排列(元素重复不可复选)

leetcode 47 全排列 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。  

```ts
function permuteUnique(nums: number[]): number[][] {
  let demo = new Solution();
  return demo.permuteUnique(nums);
};
class Solution {
  res:number[][] = [];
  permuteUnique(nums:number[]):number[][]{
    nums.sort(); // 同样需要先进行排序
    let used:boolean[] = new Array(nums.length).fill(false);
    let trace:number[] = [];
    this.traceback(nums, trace, used);
    return this.res;
  }
  traceback(nums:number[], trace:number[], used:boolean[]){
    if(trace.length === nums.length){
      this.res.push([...trace]);
      return;
    }
    for(let i = 0; i < nums.length; i++){
      if(used[i]) continue;
      // 新增去重条件，跳过重复的元素，!used[i-1]保证了相同的元素位置相对固定
      // 元素相同时，当前一个元素未被选中，则当前元素不可越过前一个元素进行排列
      if(i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;
      used[i] = true;
      trace.push(nums[i]);
      this.traceback(nums, trace, used);
      used[i] = false;
      trace.pop();
    }
  }
}
```

### 子集/组合(元素无重复可复选)

leetcode 39 组合总数 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回  
candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。  

```ts
function combinationSum(candidates: number[], target: number): number[][] {
  let demo = new Solution();
  return demo.combinationSum(candidates, target);
};
class Solution {
  res:number[][] = [];
  curSum = 0;
  target:undefined|number = undefined;
  combinationSum(cand:number[], target:number):number[][]{
    let trace:number[] = [];
    this.target = target;
    this.traceback(cand, trace, 0);
    return this.res;
  }
  traceback(cand:number[], trace:number[], start:number){
    if(this.curSum === this.target) {
      this.res.push([...trace]);
      return;
    }
    // 增加跳出条件，当前和大于目标时结束本次递归
    if(this.curSum > this.target) return;
    for(let i = start; i < cand.length; i++){
      this.curSum += cand[i];
      trace.push(cand[i]);
      // 递归传入起点i 而不是i+1 可重复使用i位置的元素
      this.traceback(cand, trace, i);
      this.curSum -= cand[i];
      trace.pop();
    }
  }
}
```

### 排列(元素无重复可复选)

leetcode上没有对应的题目，长度为3的数组全排列为3^3=27种，之前的算法使用了used数组进行剪枝，现在可重复选在元素，去掉used数组即可  

```ts
class Solution {
  res:number[][] = [];
  permuteUnique(nums:number[]):number[][]{
    let trace:number[] = [];
    this.traceback(nums, trace);
    return this.res;
  }
  traceback(nums:number[], trace:number[]){
    if(trace.length === nums.length){
      this.res.push([...trace]);
      return;
    }
    for(let i = 0; i < nums.length; i++){
      trace.push(nums[i]);
      this.traceback(nums, trace);
      trace.pop();
    }
  }
}
```

子集与组合问题本质相同，仅递归终止条件不同
