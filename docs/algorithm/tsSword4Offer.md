# 基于typescript实现剑指offer中的算法

## 单例模式(singleton)实现

```ts
// 利用闭包或静态变量等方式存储instance，分离构造器和单例判断函数
class singleton {
  private static instance:singleton;
  public name:string;
  constructor(name:string) {
    this.name = name;
  }

  /**
   * @description: 单例判断函数，通过此函数获取单例
   * @param {*}
   * @return {*}
   */
  static getSingleton(name:string):singleton {
    return this.instance || (this.instance = new singleton(name));
  }

  /**
   * @description: 测试用例
   * @param {*}
   * @return {*}
   */
  static test() {
    let obj1 = new singleton('obj1');
    let obj2 = singleton.getSingleton('obj2');
    let obj3 = singleton.getSingleton('obj3');
    console.log(obj1 === obj2);
    console.log(obj2 === obj3);
  }
}
singleton.test(); // 运行测试用例
```

## NO. 3：数组中重复的数字

### 题目一：找出数组中重复的数字  

在一个长度为n的数组中素有的数字都在[0, n-1]范围内。  
请找出数组中任意一个重复的数字。  
例如，输入长度为7的数组{2,3,1,0,2,5,3}，那么对应输出的重复数字是2或3，若没有重复的元素则直接返回-1.

+ 解题思路：利用列表下标作为哈希表，通过元素互换逐步构建哈希表，若遇到相等的数字则通过下标索引key必然能检测到重复数字
+ 步骤：

1. 遍历数组，若i位置的值`arr[i]`不等于i，则进行步骤2
2. 以该值为索引判断`arr[i]`是否与`arr[arr[i]]`位置的值相等,若相等则说明找到重复的元素，否则进行值交换。
3. 交换后再次判断，重复步骤2，直到`arr[i] = i`，继续进行遍历
4. 遍历完成还没有找到重复的元素则直接返回-1

+ 总结
算法利用了哈希表思想，利用数组的索引作为key，每个数字最多交换两次就能放到合适的位置，因此时间复杂度为O(n)
+ ts解决方案：

```ts
class Demo {
  static duplicate(arr:number[]):number{
    let length = arr.length;
    if(length < 2) return -1;
    for(let i = 0; i < length; i++){
      // 不满足限定范围则直接返回
      if(arr[i] < 0 || arr[i] > length -1) return -1;
      // 当arr[i] !== arr[arr[i]]时，需交换值，交换后arr[i]位置满足该条件，但i位置不一定满足该条件，因此需要加入内层循环，此举并不会增加时间复杂度，因为后续的位置以基本满足该条件不会继续循环
      while(arr[i] !== i){
        if(arr[i] !== arr[arr[i]]){
          let temp = arr[arr[i]];
          arr[arr[i]] = arr[i];
          arr[i] = temp;
        }else{
          return arr[i]
        }
      }
    }
    return -1
  }
  static test() {
    let testArr = [2,3,1,0,2,5,3];
    console.log(Demo.duplicate(testArr))
  }
}

Demo.test();
```

### 题目二：(接题目一中)增加限定条件：不修改数组找出重复的数字  

+ 解题思路：
开辟一个和arr相同长度的数组，以空间换时间
<!-- 以下方法不能保证100%找到重复的数字 -->
<!-- 利用二分查找法原理，确定中值，统计数组中比中值小或者比中值大的数字的个数，以此确定重复的数字在中值左侧还是右侧 -->

## NO.4 二维数组中的查找

在一个二维数组中，每一行都按照从左到右的递增顺序排列，每一列都按照从上到下递增的顺序排列，请完成一个函数，输入这样的二维数组和一个整数，判断数组中是否含有该整数.  

+ 解题思路:

1. 首先选取数组右上角的数字，如果该数字大于目标数字则排除该列，小于则排除该行
2. 向下或向左移动指针，直到等于目标或者范围为空停止

+ 总结
其本质是二分查找法的变体，时间复杂度为O(m+n)
+ ts实现

```ts
class Demo {
  static findInArr(arr:number[][], target:number):boolean{
    if(arr.length <= 0 || arr[0].length <= 0) return false;
    let i = 0, j = arr[0].length - 1;
    while(i < arr.length && j > 0){
      if(arr[i][j] > target){
        j--;
      }else if(arr[i][j] < target){
        i++;
      }else return true;
    }
    return false
  }
  static test() {
    let testArr = [
      [1,2,8,9],
      [2,4,9,12],
      [4,7,10,13],
      [6,8,11,15]
    ];
    console.log(Demo.findInArr(testArr, 3))
  }
}
Demo.test();
```

## NO.5 替换空格

题目：请实现一个函数，把字符串中的每个空格替换成"%20"。例如，输入"We are happy."，则输出"We%20are%20happy."。  

+ 解题思路：

1. 先遍历一遍字符串统计空格的个数
2. 然后分配足够的存储空间
3. 从后向前的依次替换空格
(算法时间效率O(n))

+ 总结
此题考察数组合并，从后向前填充数组可减少移动次数，时间复杂度为O(n)
ps:使用js原生方法`str.split(' ').join('%20')`方法即可实现，但无法体现考察点
+ ts实现

```ts
class Demo {
  static replaceSpace(s:string):string {
    let data = Array.from(s);
    let length = data.length;
    let count = 0;
    for(let i = 0; i < length; i++){
      if(data[i] === ' ') count++;
    }
    data = data.concat(new Array(count*2).fill(''));
    let tail = data.length - 1, target = length -1;
    while(tail !== target){
      if(data[target] === ' '){
        data[tail--] = '0';
        data[tail--] = '2';
        data[tail--] = '%';
        target--;
      }else{
        data[tail--] = data[target--];
      }
    }
    return data.join('');
  }
  static test() {
    let testArr = 'We Are Happy.'
    console.log(Demo.replaceSpace(testArr))
  }
}
Demo.test();
```

## NO. 6： 从尾到头打印链表

题目：输入一个链表的头节点，从尾到头反过来打印出每个节点的值。  
解题思路：利用栈的先进后出特性存储链表然后再输出(或者利用递归函数)
ts实现

```ts
interface ListNode<T> {
  value:T,
  next:ListNode<T>|undefined
}
class NumberNode implements ListNode<number> {
  value:number;
  next:ListNode<number>|undefined;
  constructor(val:number, next:NumberNode|undefined = undefined){
    this.value = val;
    this.next;
  }
}
class Demo {
  static reverse<T>(head:ListNode<T>):void{
    let res:T[] = [];
    let p = head;
    while(p){
      res.push(p.value);
      p = p.next;
    }
    for(let i = res.length - 1; i >= 0; i--){
      console.log(res[i]);
    }
  }
  static test() {
    let testArr = [1,2,3,4,5]
    const head = new NumberNode(testArr[0]);
    let p = head;
    for(let i = 1; i < testArr.length; i++){
      p.next = new NumberNode(testArr[i]);
      p = p.next;
    }
    Demo.reverse(head);
  }
}
Demo.test();
```

## NO.7 重建二叉树

题目：输入某二叉树的前序遍历和中序遍历的结果，请重建该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复数字。例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建如下入的二叉树并输出它的头节点。  

+ 解析
前序遍历:根左右；中序遍历：左根右；后序遍历：左右根
+ 思路
  1. 前序序列中第一个数为根节点parent
  2. 找到中序序列中parent的位置，其前方为左子树，后方为右子树
  3. 根据中序序列中左右子树的长度在前序序列中分割左右子树
  4. 重复1-3步骤，递归的重建左右子树  
+ 图例
![n7-01.png](./resource/n7-01.png)  

![n7-02.png](./resource/n7-02.png)  

+ ts实现

```ts
class TreeNode<T> {
  val:T
  left:TreeNode<T>|undefined;
  right:TreeNode<T>|undefined;
  constructor(val:T, left:TreeNode<T>|undefined = undefined, right:TreeNode<T>|undefined = undefined){
    this.val = val;
    this.left = left;
    this.right = right;
  }
  static preRoot<T>(root:TreeNode<T>){ // 定义前序遍历算法，用于测试用例校验
    if(root) console.log(root.val);
    if(root?.left) TreeNode.preRoot(root.left);
    if(root?.right) TreeNode.preRoot(root.right);
  }
}
class Demo {
  static rebuildTree<T>(pre:T[], vin:T[], indexArr?:number[]):TreeNode<T>|undefined{
    // 若未传入索引数组，则进行初始化
    if(!indexArr) indexArr = [0, pre.length, 0, vin.length];
    // 若前序和中序长度不相等，则抛出错误
    if(indexArr[1] - indexArr[0] !== indexArr[3] - indexArr[2]) throw new Error('pre.length must eq vin.length');
    // 若长度同为0 则直接返回undefined
    if(indexArr[1] - indexArr[0] === 0 || indexArr[3] - indexArr[2] === 0) return undefined;
    // 经过前面的条件判断，确定前序和中序长度相等，且至少有一个节点，因此初始化根节点
    let root = new TreeNode(pre[indexArr[0]]);
    // 若长度为1则直接返回该根节点
    if(indexArr[1] - indexArr[0] === 1 && indexArr[3] - indexArr[2] === 1) return root;
    // 计算根节点在中序中的索引位置，然后计算左子树和右子树的长度
    let vinRoot = vin.indexOf(pre[indexArr[0]]);
    let leftLen = vinRoot - indexArr[2];
    let rightLen = indexArr[3] - vinRoot - 1; // vinRoot + 1 才是右子树起点
    // 递归的对左子树和右子树进行重建
    root.left = leftLen === 0 ? undefined :Demo.rebuildTree(
      pre, 
      vin,
      // 确定前序，中序中的左子树的起点和终点(不含终点),传入索引数组
      [
        indexArr[0] + 1, 
        indexArr[0] + 1 + leftLen,
        indexArr[2],
        indexArr[2] + leftLen
      ]
    )
    root.right = rightLen === 0 ? undefined : Demo.rebuildTree(
      pre,
      vin,
      [
        indexArr[1] - rightLen,
        indexArr[1],
        indexArr[3] - rightLen,
        indexArr[3]
      ]
    )
    return root;
  }
  static test() {
    let pre = [1,2,4,7,3,5,6,8];
    let vin = [4,7,2,1,5,3,8,6];
    let root = Demo.rebuildTree(pre, vin);
    TreeNode.preRoot(root);
    console.log('前序遍历：', ...pre);
  }
}
Demo.test();
```

## NO.8 二叉树的下一个节点

题目：给定一颗二叉树和其中的一个节点，如何找出中序遍历序列的下一个节点？树中的节点除了有两个分别指向左、右子节点的指针，还有一个指向父节点的指针。

+ 思路：
  1. 若该子节点有右子树，则右子树的中序遍历序列第一个节点即为下一个节点
  2. 若无右子树，且是其父节点的左子节点，则下一个节点为父节点
  3. 若无右子树，且为父节点的右节点，则向上遍历，直到找到一个节点为其父节点的左子节点，则该节点的父节点为下一个节点

+ ts实现

```ts
class Demo {
  static NextVinNode<T>(p:TreeNode<T>):TreeNode<T>|null {
    if(!p) return null;
    if(p.right){
      return Demo.firstVinNode(p.right)
    }else if(p.parent && p.parent.left === p) {
      return p.parent;
    }else {
      let target = p;
      while(target.parent && target.parent.left !== target){
        target = target.parent;
      }
      if(target.parent){
        return target.parent;
      }else {
        return null;
      }
    }
  }
  static firstVinNode<T>(p:TreeNode<T>):TreeNode<T>|null{
    if(!p) return null;
    if(p.left) return Demo.firstVinNode(p.left);
    return p;
  }
  static test() {
    // 本次测试用例需要重建二叉树，且二叉树中含parent父节点，不能共用NO.7中的重建方法
    // 因此暂不实现，算法已在牛客网中验证通过
  }
}
```

## NO.9 用两个栈实现队列

题目：用两个栈实现一个队列。队列的声明如下，请实现它的两个函数appendTail和deleteHead，分别完成在队列尾部插入节点在队列头部删除节点的功能。  

+ 解题思路：
  1. 利用栈1入队，在栈2为空时将栈1中的元素通过出栈，再入栈的方式转移到栈2中实现反序

+ ts实现

```ts
class Queue<T> {
  stack1:T[] = [];
  stack2:T[] = [];
  constructor() {

  }
  push(node:T) {
    if(this.stack2.length === 0&&this.stack1.length !== 0) {
      while(this.stack1.length > 0){
        this.stack2.push(this.stack1.pop())
      }
    }
    this.stack1.push(node);
  }
  pop(): T|undefined {
    if(this.stack2.length === 0&&this.stack1.length !== 0) {
      while(this.stack1.length > 0){
        this.stack2.push(this.stack1.pop())
      }
    }
    return this.stack2.pop()||undefined;
  }

  static test() {
    const queue = new Queue();
    let testData = [1,2,3,4,5];
    for(let i = 0; i < testData.length; i++){
      queue.push(testData[i]);
    }
    for(let i = 0; i < testData.length; i++){
      console.log(queue.pop());
    }
    console.log('result: ', testData);
  }
}

Queue.test();
```

## NO.10 斐波拉契数列

### 题目1：求斐波拉契数列的第n项  

[斐波拉契数列定义] f(n) = f(n-1) + f(n-2)、f(0) = 0、f(1) = 1  

+ 解题思路：
  1. 可以用递归的方式来实现，但算法效率低，使用循环来代替递归会更好，循环的方式时间复杂度为O(n)
  2. 还可通过矩阵快速求幂的方式计算时间复杂度为O(log(n))，进一步的可通过矩阵特征值及特征向量求出数列通项，从而实现O(1)时间复杂度

### 题目2：青蛙跳台阶问题  

一只青蛙一次可以跳上一级台阶，也可以跳上2级台阶。求该青蛙跳上一个n级台阶总共有多少种跳法。  

解题思路：

1. 设有f(n)种方法，
2. n=1时f(1) = 1,
3. n=2时f(2) = 2，
4. n>2时，先跳一级，剩余还有f(n-1)种方法，先跳2级，剩余还有f(n-2)种方法，所以f(n) = f(n-1) + f(n-2)，因此与斐波拉契数列相似
5. 为保证大数相加时整数不溢出，通常需要先对相加结果1e9+7取余

+ ts实现

```ts
class Demo {
  static fibonacci(n:number):number {
    let p = [1, 2]; // 数列约定初始值
    n = Math.floor(n);
    if(n <= 0) return -1;
    if(n < 3) return p[n -1];
    const mod = 1e9+7; // 对该数取余能保证大数相加时不溢出
    for(let i = 3; i <= n; i++) {
      let temp = (p[0] + p[1]) % mod;
      p[0] = p[1];
      p[1] = temp;
    }
    return p[1];
  }
  static test(){
    const testData = [1,2,3,5,8,13];
    let n = 6
    console.log(Demo.fibonacci(n) === testData[n - 1]);
  }
}
Demo.test();
```

## NO.11 旋转数组中的最小数字

题目：把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。例如，数组[3,4,5,1,2]为[1,2,3,4,5]的一个旋转，该数组的最小值为1.

+ 解题思路：
旋转后的排序数组是由两个已排好序的子数组组成，
利用对撞指针的二分查找法逐步缩小查找范围，
但若遇上大量重复数字时，需要遍历子数组进行查找(算法基于二分查找，时间复杂度为O(log(n)))
  1. 定义start、mid、end三个指针，分别指向数组的起始、中间、末尾
  2. 若剩余序列长度为2，则end一定为最小的元素，mid指向end，跳出循环
  3. 取mid = start + (end - start) / 2 即正中间位置
  4. 若start、mid、end所指向的元素都相等，则无法判断最小值位于左子序列还是右子序列，只能对序列进行遍历取得最小值
  5. 若start的元素小于或等于mid的元素，则说明最小元素在右子序列，若end的元素大于或等于mid则说明最小元素在左子序列
  6. 递归的重复2-5步骤，直到start的元素大于或等于end不成立，最后能保证mid指向最小元素

+ ts实现

```ts
class Demo {
  static Min(arr:number[]):number|undefined {
    if(arr.length < 2) return arr[0];
    let start = 0, mid = 0, end = arr.length - 1;
    while(arr[start] >= arr[end]){
      if(end - start === 1) {
        mid = end;
        break;
      }
      mid = Math.floor((end + start) / 2);
      if(arr[start] === arr[end] && arr[mid] === arr[start]){
        return Demo._MinInOrder(arr, start, end);
      }
      if(arr[start] <= arr[mid]){
        start = mid;
      }else if(arr[mid] <= arr[end]){
        end = mid
      }
    }
    return arr[mid];
  }
  static _MinInOrder(arr:number[], start:number, end:number):number {
    let result = arr[start];
    for(let i = start + 1; i <= end; i++){
      if(arr[i] < result){
        result = arr[i]
      }
    }
    return result;
  }
  static test(){
    const testData = [5,8,13,1,2,3];
    console.log(Demo.Min(testData));
  }
}
Demo.test();
```

## NO. 12：矩阵中的路径

题目：
请设计一个函数，用来判断在一个矩阵中是否存在一条包含某字符串的所有字符的路径。  
路径可以从矩阵中的任意一格开始，每一步可以在矩阵中向左、右、上、下移动一格。  
如果一条路径经过了矩阵的某一格，那么该路径不能再次进入该格子。  
例如，在下面的3*4的矩阵中包含一条字符串“bfce”的路径(路径中的字母用大写标出)。  
但矩阵中不包含字符串“abfb”的路径，因为字符串的第一个字符b占据了矩阵中的第一行第二个格子后，路径不能再次进入这个格子。
$$\begin{matrix}
a&B&t&g\\
c&F&C&s\\
j&d&E&h\\
\end{matrix}$$

+ 解题思路：利用回溯法，若当前路径不通，则回溯上一节点，尝试未尝试过的路径
  1. 维护一个访问矩阵visited，若对应位置被占据则记为true，遍历目标矩阵matrix，
  2. 指针p所指向的str中的字符，若等于遍历位置的字符，则将指针p移动一个位置，并标记visited，递归判断字符上下左右位置是否存在移动后的p指向的字符
  3. 若不存在则回溯，p指针回退一步，并还原标记visited，结束该节点的递归
  4. 若一直满足步骤2中的条件，则递归结束条件为p大于str长度，并返回true表示找到路径

+ ts实现

```ts
class Demo {
  static hasPath(mat:string[][], str:string):boolean {
    if(str.length === 0 || mat.length === 0) return false;
    // debugger
    let rows = mat.length, columns = mat[0].length;
    let pathLen = 0;
    let visited:boolean[][] = new Array(rows).fill('').map(item => 
      [...new Array(columns).fill(false)]
    );
    for(let i = 0; i < rows; i++){
      for(let j = 0; j < columns; j++){
        if(Demo._hasPathCore(mat, str, i, j, visited, pathLen)) return true;
      }
    }
    return false;
  }
  static _hasPathCore(mat:string[][], str:string, i:number, j:number, visited:boolean[][], pathLen:number):boolean {
    if(pathLen >= str.length) return true;
    let result = false;
    if(i >= 0 && i < mat.length && j >= 0 && j <mat[0].length && mat[i][j] === str[pathLen] && !visited[i][j]){
      pathLen++;
      visited[i][j] = true;
      result = Demo._hasPathCore(mat, str, i, j-1, visited, pathLen) || 
      Demo._hasPathCore(mat, str, i-1, j, visited, pathLen) || 
      Demo._hasPathCore(mat, str, i, j+1, visited, pathLen) || 
      Demo._hasPathCore(mat, str, i+1, j, visited, pathLen);
      if(!result) {
        pathLen--;
        visited[i][j] = false;
      }
    }
    return result;
  }
  static test(){
    const testData = [
      ['a', 'b', 't', 'g'],
      ['c', 'f', 'c', 's'],
      ['j', 'd', 'e', 'h']
    ];
    console.log(Demo.hasPath(testData, 'abfb'));
  }
}
Demo.test();
```

## NO.13 机器人的运动范围

题目：地上有一个m×n的方格。一个机器人从坐标(0, 0)的格子开始移动，它每次可以向左、右、上、下移动一格，但不能进入行坐标和列坐标的位数之和大于k的格子。例如，当k=18时，机器人能够进入方格(35,37),因为3+5+3+7=18。但它不能进入方格(35, 38)，因为3+5+3+8=19。请问该机器人能够到达多少个格子？

+ 解题思路：因为机器人每次只能移动一格，同样可以利用回溯法逐步遍历能够到达哪些格子
  1. 使用map记录机器人已访问的格子，模拟visited
  2. 设定起点为`[0,0]`，若当前节点满足条件k及visited中不存在，则将节点坐标为key，加入visited中，并将count加1，否则返回count的初始值0
  3. 递归的将节点上下左右位置进行判断，重复2步骤，并将返回值加入到count中
  4. 判断是否满足条件k需要判断左边是否溢出，并计算位数和是否不大于k

+ ts实现

```ts
class Demo {
  static calcSum(num:number):number{
    let result = 0;
    while(num > 0){
      result += num % 10;
      num = Math.floor(num / 10);
    }
    return result;
  }
  static inRange(matRange:number[], pos:number[], target:number) {
    let result = false;
    if(
      pos[0]<matRange[0]&&pos[0]>=0
      &&pos[1]<matRange[1]&&pos[1] >=0
      &&( Demo.calcSum(pos[0]) + Demo.calcSum(pos[1]) )<=target
    ) result = true;
    return result;
  }
  static CountBFC(matRange:number[], visited:Map<string, boolean>, pos:number[], target:number):number {
    let count = 0;
    if(Demo.inRange(matRange, pos, target)&&!visited.has(pos.toString())){
      visited.set(pos.toString(), true);
      count += 1 
        + Demo.CountBFC(matRange, visited, [pos[0]+1, pos[1]], target)
        + Demo.CountBFC(matRange, visited, [pos[0]-1, pos[1]], target)
        + Demo.CountBFC(matRange, visited, [pos[0], pos[1]+1], target)
        + Demo.CountBFC(matRange, visited, [pos[0], pos[1]-1], target);
    }
    return count;
  }
  static movingCount(target:number, rows:number, cols:number):number{
    if(target<0||rows<1||cols<1) return 0;
    // debugger
    let visited:Map<string, boolean> = new Map();
    return Demo.CountBFC([rows, cols], visited, [0,0], target);
  }
  static test(){
    console.log(Demo.movingCount(0,3,1))
  }
}
Demo.test();
```

## NO. 14：剪绳子

题目：给你一根长度为n的绳子，请把绳子剪成m段(m,n都是整数，n>1并且m>1)，每段绳子的长度记为k[0],k[1],...,k[m]。请问k[0]*k[1]*...*k[m]可能的最大乘积是多少？例如，当绳子的长度为8时，我们把他剪成长度分别为2,3,3的三段，此时得到的最大乘积是18.

+ 解题思路：因为是最优化问题，且问题可分，可考虑使用动态规划或者贪婪法，详细见代码文档或剑指offer（注：题目中需补充条件，m为任意整数，且切成的绳子长度必须为整数）
  + 动态规划解法
    1. 创建长度为n的数组maxLens用于存储对应索引i长度的绳子剪断最大乘积，则maxLens[n - 1]程序返回值
    2. 可尝试先剪下一段长度j，然后剩余长度可剪可不剪，
    3. 记长度为n的绳子剪断后的乘积为f(n),则f(n)=j*(n-j)或f(n)=j*f(n-j),可取其中的最大值记为FMax
    4. 从2开始遍历j，直到不满足j <= Math.floor(n / 2)，每次遍历中将较大的FmMx存入`maxLens[i]`
    5. 定义maxLens = [0, 1, 2, 4]为初始值分别表示绳子长度为[1, 2, 3, 4]时绳子剪断后最大乘积，从长度为5开始遍历绳子长度i，直到i <= n，每次遍历执行步骤4,遍历完成后返回maxLens[n - 1]即为长度为n的绳子剪断后的最大乘积

+ 贪婪算法解法
   1. 尽可能的将绳子分为长度为3的段，并且剩余长度尽可能为2或4，不可为1

+ ts实现

```ts
class Demo {
  // 动态规划解法
  static cuttingRope(len:number):number{
    let maxLens = [0, 1, 2, 4];
    if(len < 2) return 0;
    if(len < 5) return maxLens[len - 1];
    maxLens = maxLens.concat(new Array(len - 4).fill(0));
    for(let i = 5; i <= len; i++){
      let j = 2;
      while(j <= Math.floor(i / 2)){
        let product = j*maxLens[i-j-1];
        if(maxLens[i -1] < product) maxLens[i -1] = product;
        if(maxLens[i -1] < j*(i-j)) maxLens[i -1] = j*(i - j)
        j++;
      }
    }
    return maxLens[len - 1];
  }
  // TODO:贪婪解法
  static test(){
    console.log(Demo.cuttingRope(10))
  }
}
Demo.test();
```

## NO.15 二进制中1的个数

题目：请实现一个函数，输入一个整数，输出该数的二进制表示中1的个数。例如，把9表示成二进制是1001，有2位是1，因此，输入9，则函数输出2.

+ 解题思路
  + 逐位扫描
    1. 将数与flag=1进行与操作，每次flag按位左移，遍历整型的二进制位数(32或64)后即可统计出1的个数

  + 减1算法
    1. 将一个整数减1，都是把二进制中最右边的1变成0，并且把它右边的所有0变成1(即：最右边的数为1时，直接变成0，最右边的数为0时，将其前方最近的一个1变为0，其后的所有0变为1)
    2. 因此，将整数n做n&(n-1)相当于将其最右边的1去掉，因此n>0时，可以反复进行此操作，并统计1的个数
    3. n中有多少个1就需要循环多少次

+ ts

```ts
class Demo {
  // 减1算法实现
  static NumberOf1(n:number):number {
    let count = 0;
    while(n){ // n不为0 说明其二进制中还有1，继续遍历；
      count++;
      n = n&(n-1); // 每次减掉二进制中最右边的1
    }
    return count;
  }
  static test(){
    console.log(Demo.NumberOf1(-10));
  }
}
Demo.test();
```

## NO. 16：数值的整数次方

题目：实现函数double Power(double base, int exponent)，求base的exponent次方。不得使用库函数，同时不需要考虑大数问题。

+ 解题思路：利用二分法，对exponent进行分解，每次除2取整，同时对base使用自乘，利用已计算好的值，算法复杂度为O(log2(n))
+ 流程
  1. 判断base，exponent是否为0，若为0则直接分别返回0和1
  2. 若exponent < 0 则将base设置为 1 / base，exponent设置为-exponent转换为正数的情况
  3. 设置res=1用于缓存奇数的结果，pow=base用于自乘，遍历结束后返回res*pow，即默认结果为exponent=1的情况
  4. exponent > 1时进行遍历，每次判断若为奇数，则执行res*=base累乘base，并将exponent/2取整，进行二分，并执行pow*=pow累积自乘，循环结束后返回res*pow

+ ts实现

```ts
class Demo {
  static Power(base:number, exponent:number):number{
    if(base === 0) return 0;
    if(exponent === 0) return 1;
    if(exponent < 0) {
      base = 1 / base;
      exponent = -exponent;
    }
    let result = 1;
    let res = base;
    while(exponent > 1){
      if(exponent % 2){
        result *= base;
      }
      exponent = Math.floor(exponent / 2);
      res *= res;
    }
    return res*result;
  }
  static test(){
    console.log(Demo.Power(2.0, -2))
  }
}
Demo.test();
```

## NO.17 打印从1到最大的n位数

题目：输入数字n，按顺序打印出从1到最大的n位十进制数。比如输入3，则打印输出1,2,3一直到最大的3为数999.

解题思路：
若不涉及大数问题，则使用常规解法
若涉及到大数问题，es6内置类型智能支持大数bigint，但为了表现算法思想不使用内置大数，转而使用list[str]来表示大数

```ts
export function printNumbers(n: number): number[] {
  let number = 1;
  if(n <= 0) return [];
  while(n){
    number*=10;
    n--;
  }
  let result = new Array(number - 1);
  for(let i = 1; i < number; i++){
    result[i-1] = i
  }
  return result;
}
```

## NO.18 删除链表的节点

### 题目一：在O(1)时间内删除链表节点  

给定单向链表的头指针和一个节点指针，定义一个函数在O(1)时间内删除该节点。

+ 思路：
通过复制下一个节点的内容到当前节点的方式删除当前节点，并保存下一个节点的下一个节点，断开链接并重新连上当前节点即可做到删除，  
若要删除的节点没有下一个节点则需要从头指针开始遍历链表  
若要删除的节点就是头指针，则直接将头指针置空即可

+ ts实现

```ts
class LinkNode<T> {
  val:T;
  next:LinkNode<T>|null
  constructor(val:T, next?:LinkNode<T>) {
    this.val = val;
    this.next = next;
  }
}

class Demo {
  static deleteNode<T>(head:LinkNode<T>, p:LinkNode<T>):LinkNode<T>{
    if(head === p){
      head = head.next;
    }
    if(!p.next){
      let parent = head;
      while(parent.next !== p){
        parent = parent.next;
      }
      if(parent) parent.next = null;
    }
    p.val = p.next.val;
    p.next = p.next.next;
    return head;
  }
  static test(){
    const testData:number[] = [4,5,1,9];
    let head = new LinkNode(testData[0]);
    let p = head;
    
    for(let i = 1; i < testData.length; i++){
      p.next = new LinkNode(testData[i]);
      p = p.next;
    }
    
    p = Demo.deleteNode(head, head.next.next);
    while(p){
      console.log(p.val);
      p = p.next;
    }
  }
}
Demo.test();
```

### 题目二：删除链表中重复的节点

删除排序的链表中重复的节点
解题思路与题目1类似

## NO. 19：正则表达式匹配

题目：请实现一个函数用来匹配包含"."和"\*"的正则表达式。模式中的字符"."表示任意一个字符，而"\*"表示它前面的字符可以出现任意次(含0次)。在本题中，匹配是指字符串的所有字符匹配整个模式。例如，字符串"aaa"与模式"a.a"和"ab\*ac\*a"匹配，但与"aa.a"和"ab\*a"均不匹配。

+ 解题思路：递归的进行逐个字符比较，若模式为带'*'的组合，则综合多种匹配情况，有一种为true时，向该模式继续递归，递归结束条件较为复杂，需要分开讨论，详见算法步骤
+ 步骤：
  1. 设置两个比较指针ps和pp，先判断边界条件5，再判断pp+1在范围内且指向字符为'*'时进行步骤2，否则进行步骤4
  2. ps不在范围内或ps和pp不匹配时，说明带'*'组合匹配0次，向后移动pp两个字符，再进行递归判断，若不满足条件则跳至步骤3
  3. 此时ps一定在范围内，字符组合匹配情况如下，多种情况只要有一个能匹配到末尾，则整个表达式匹配，因此用或运算关联起来
    a. 匹配多次，此时只需向后移动ps一位，继续递归匹配
    b. 匹配一次，此时需要将ps向后移动一位，pp向后移动两位，再进行递归匹配
    c. 匹配0次，此时只需将pp向后移动两位再进行递归匹配
  4. 判断ps是否在范围内且ps与pp匹配，则将ps和pp都向后移动一位递归判断，否则说明ps指向末尾且pp其后还有不带'*'的组合，或者对应字符为直接不匹配，均需返回false表示匹配失败
  5. 边界条件：经过上一轮判断，若ps和pp同时超出范围，则说明字符串和模式完全匹配直接返回true，若pp先超出范围则字符串还有剩余直接返回false，若ps先超出范围，则会被步骤2捕获，直到pp后不再有带'*'的组合，最后会被步骤4捕获并返回相应的bool值
+ ts实现：

```ts
class Demo {
  static isMatch(str:string, p:string):boolean {
    if(!p&&str) return false; // 模式为空且字符串不为空时直接返回false
    return Demo.isMatchCore(str, p, [0, 0]);
  }
  static isMatchCore(str:string, p:string, indexes:number[]):boolean {
    if(!indexes) indexes = [0, 0];
    if(indexes[0] >= str.length && indexes[1] >= p.length) return true;
    if(indexes[1] >= p.length && indexes[0] < str.length) return false;
    if(indexes[1]+1 < p.length && p[indexes[1]+1] === '*'){
      if(indexes[0] >= str.length||(str[indexes[0]] !== p[indexes[1]] && p[indexes[1]] !== '.')){ // str已耗尽或(字符不匹配，则通配符匹配0次)，向后移动p指针
        return Demo.isMatchCore(str, p, [indexes[0], indexes[1]+2]); 
      }else {
        return Demo.isMatchCore(str, p, [indexes[0]+1, indexes[1]]) || // 匹配n次的情况
        Demo.isMatchCore(str, p, [indexes[0], indexes[1]+2]) || // 匹配0次的情况
        Demo.isMatchCore(str, p, [indexes[0]+1, indexes[1]+2]) // 只匹配一次的情况
      }
    }
    if(indexes[0] < str.length && (str[indexes[0]] === p[indexes[1]] || p[indexes[1]] === '.')){ // 正常匹配
      return Demo.isMatchCore(str, p, [indexes[0]+1, indexes[1]+1]);
    }else{
      return false;
    }
  }
  static test(){
    let data = 'a';
    let p = '.*..a*'
    console.log(Demo.isMatch(data,p));
  }
}
Demo.test();
```

## NO.20 表示数值的字符串

题目：请实现一个函数用来判断字符串是否表示数值(包括整数和小数)。例如，字符串"+100","5e2","-123","3.1416","-1E-16"都表示数值，但"12e","1a3.14","1.2.3","+-5","12e+5.4"都不是

+ 解题思路：将数字拆解为整数、无符号整数、小数、科学计数等几个部分，从前向后逐部分进行检测
  1. 无符号整数为纯数字，整数由可选的+,-号和无符号整数组成
  2. 小数：小数点前若有数字，必为有符号整数或正负号，小数点后方为无符号整数，两侧不能同时为空，相当于与前方结果或操作
  3. 科学计数法:e前方为小数或整数，后方必为整数，相当于与前方结果与操作
+ 步骤
  1. 定义辅助函数，给定索引位置判断其后无符号整数和有符号整数，返回符合条件数组的末尾索引，表示匹配到的数字长度
  2. 去掉字符串str两侧的空格，从起始位置判断其是否包含整数，并记录bool值result，移动p指针到匹配后的位置
  3. 由于小数点前可以只有符号，因此判断result为false，且p指向为'+-'号时，将p向后移动一位，跳过'+-'号，然后判断是否有小数点为，若有则进行步骤4
  4. 判断小数点后是否能匹配到无符号整数，将其bool结果与result或操作，并移动p指针到新的匹配位置
  5. 判断当前指向是否有字符'eE'，若有则判断其后是否有整数，并将bool结果与result相与，移动p指针
  6. 返回str是否检测完成(p>=str.length)和result状态的与操作结果
+ ts实现:

```ts
class Demo {
  static isNumberic(str:string):boolean {
    if(!str) return false;
    str = str.trim(); // 祛除两侧空格
    let p = 0;
    let temp = Demo.isSignInt(str, p); // 首先检测整数
    let result = temp > 0;
    p = temp;
    if(p<str.length && !result && (str[p] === '+' || str[p] === '-')){
      p = p + 1; // 若没有匹配到整数且检测到了'+-'号则跳过该符号
    }
    if(p < str.length && str[p] === '.') { // 结合前面检测的结果检测小数部分
      temp = Demo.isUnSignInt(str, p + 1);
      result = temp > p + 1 || result;
      p = temp;
    }
    if(p < str.length && (str[p] === 'e' || str[p] === 'E')){ // 结合前面的检测结果，检测科学计数法部分
      temp = Demo.isSignInt(str, p + 1);
      result = result && temp > p + 1;
      p = temp;
    }
    return result && p >= str.length;
  }
  static isSignInt(str:string, index:number):number {
    if(!str || index >= str.length || index < 0) return index;
    if(str[index] === '-' || str[index] === '+'){
      let temp = Demo.isUnSignInt(str, index + 1);
      if(temp === index + 1) return index; // 若只有'+-'号，则整数匹配失败
      return temp;
    }
    return Demo.isUnSignInt(str, index);
  }
  static isUnSignInt(str:string, index:number):number {
    if(!str || index >= str.length || index < 0) return index;
    while(index < str.length && str[index] >= '0' && str[index] <= '9'){
      index++;
    }
    return index;
  }
  static test(){
    // debugger
    let data = '-.1';
    console.log(Demo.isNumberic(data))
  }
}
Demo.test();
```

## NO.21 调整数组顺序使奇数位于偶数前面

题目：输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有的奇数位于数组的前半部分，所有的偶数位于数组的后半部分。

+ 解题思路：使用头尾双指针对撞法，若头指针left指向奇数则向后移动，若尾指针指向偶数则向前移动，若left和right分别指向偶数和奇数，则交换后left和right分别向后向前移动，循环终止条件为left < right不成立，最坏时间复杂度为O(n)
+ ts实现

```ts
class Demo {
  static reOrderArr<T>(arr:T[], fn:(T)=>boolean):T[]{
    if(arr.length < 2) return arr;
    let p1 = 0, p2 = arr.length - 1;
    while(p1 < p2) {
      if(fn(arr[p1])){
        p1++;
        continue;
      }
      if(!fn(arr[p2])) {
        p2--;
        continue;
      }
      if(!fn(arr[p1]) && fn(arr[p2])){
        let temp = arr[p1];
        arr[p1] = arr[p2];
        arr[p2] = temp;
        p1++;
        p2--;
      }
    }
    return arr
  }
  static _isEven(target:number):boolean{
    return (target & 1) === 1;
  }
  static test(){
    // debugger
    let data = [1,2,3,4,5,6,7,8,9]
    Demo.reOrderArr(data, Demo._isEven);
    console.log(data);
  }
}
Demo.test();
```

## NO.22 链表中倒数第K个节点

题目：输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第一个节点。例如，一个链表有6个节点，从头结点开始，它们的值依次是1,2,3,4,5,6。这个链表的倒数第三个节点是值为4的节点。

+ 解题思路：使用快慢指针，fast快指针先走k步，slow再走，当fast指向末尾时，slow刚好指向倒数第k个节点，注意由于从1开始计数，因此初始化时fast就相当于走了一步
+ ts实现

```ts
class ListNode<T> {
  val:T;
  next:ListNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}
class Demo {
  static findKthTail<T>(head:ListNode<T>, k:number):ListNode<T>|null{
    if(!head) return null
    let fast = head;
    let slow = null;
    let i = 1;
    if(i === k) slow = head;
    while(fast.next) {
      fast = fast.next;
      i++;
      if(i === k){
        slow = head;
        
      }else if(i > k) {
        slow = slow.next;
      }
    }
    return slow
  }
  static test(){
    let data = [1]
    let head = new ListNode(data[0]);
    let p = head;
    for(let i = 1; i< data.length; i++) {
      p.next = new ListNode(data[i]);
      p = p.next;
    }
    console.log(Demo.findKthTail(head, 1))
  }
}
Demo.test();
```

## NO.23 链表中环的入口节点

题目：如果一个链表中包含环，如何找出环的入口节点？例如在如图3.8所示的链表中，环的入口节点是3  
1->2->3->4->5->6 and 6->3

+ 解题思路：使用快慢指针确定链表中是否存在环，并输出环中节点数，再次使用双指针，间隔节点个数开始遍历，直到两个指针指向同一个节点，即为环的入口
+ ts实现

```ts
class ListNode<T> {
  val:T;
  next:ListNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}
class Demo {
  static EntryNodeOfLoop<T>(head:ListNode<T>):ListNode<T>|null {
    if(!head?.next) return null;
    let fast = head.next, slow = head;
    while(fast&&fast !== slow){
      slow = slow.next;
      fast = fast?.next?.next;
    }
    if(!fast) return null;
    let count = 1;
    fast = fast.next;
    while(fast !== slow){
      count++;
      fast = fast.next;
    }
    fast = head;
    slow = head;
    for(let i = count; i >0; i--){
      fast = fast.next;
    }
    while(fast!== slow){
      fast = fast.next;
      slow = slow.next;
    }
    return fast;
  }
  static test(){
    let data = [1,2,3,4,5,6,7];
    const target = 3;

    const head = new ListNode(data[0]);
    let p = head, targetNode:ListNode<number>;
    for(let i = 1; i < data.length; i++){
      p.next = new ListNode(data[i]);
      if(i === data.indexOf(target)){
        targetNode = p.next;
      }
      p = p.next;
    }
    p.next = targetNode;
    console.log(Demo.EntryNodeOfLoop(head));
  }
}
Demo.test();
```

## NO.24 反转链表

题目：定义一个函数，输入一个链表的头节点，反转该链表并输出反转后的链表的头结点。

+ 解题思路：使用三个指针，从左到右依次保存反转后的结果result，待添加到反转结果中的节点指针left，链表中下一个节点的指针right，遍历一次链表即可将链表反转；

+ ts实现

```ts
class ListNode<T> {
  val:T;
  next:ListNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}
class Demo {
  static reverseList<T>(head:ListNode<T>):ListNode<T>{
    if(!head?.next) return head;  // 头指针为空或只有一个节点时直接返回
    let result:ListNode<T>|null = head; // 初始化result指针
    let right = head.next, left = head; // 初始化right 和left指针
    result.next = null; // 完成初始化后需要将result与后面的节点断开
    while(right){ // 当下一个指针指向末尾为空时，结束遍历
      left = right; // 因为result总和left，因此向后移动left和right指针，并开始反转操作
      right = right.next;
      left.next = result; // 添加反转节点
      result = left; // 每次遍历后result总与left指向相同节点
    }
    return result;
  }
  static test(){
    let data = [1,2,3,4,5,6,7,8,9];
    let head = new ListNode(data[0]);
    let p = head;
    for(let i = 1; i < data.length; i++){
      p.next = new ListNode(data[i]);
      p = p.next;
    }
    console.log(Demo.reverseList(head));
  }
}
Demo.test();
```

## NO.25 合并两个排序的链表

题目：输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

+ 解题思路：
  1. 使用p1，p2两个指针来遍历两个链表，初始时，保证p1指向较小的那个；
  2. 即合并后结果头指针为p1初始指向，遍历将最先从p1所在链表开始，记flag为true，则p2链表为false
  3. 使用指针pre设为null，其后该指针始终指向正在遍历的链接p指针的前一个节点，方便断开节点并重连
  4. 若p1、p2都不为null时，对较小的链表进行遍历，若判断flag不为要遍历的链表时，pre即时要合并的一个节点，将p指针赋值给pre，并翻转flag，开始遍历对应的链表
  5. 遍历结束后判断flag若为true，则表明p1先遍历完成，将p2剩下的节点链接到pre上即可，反之一样

+ ts实现

```ts
class ListNode<T> {
  val:T;
  next:ListNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}
class Demo {
  static MergeLinkList<T>(head1:ListNode<T>, head2:ListNode<T>):ListNode<T>|null {
    if(!head1||!head2) return head1 || head2;
    let p1 = head1, p2 = head2;
    if(p1.val > p2.val){
      p1 = head2;
      p2 = head1;
    }
    let result = p1, flag = true;
    let pre:ListNode<T>|null = null;
    while(p1&&p2){
      if(p1.val > p2.val){
        if(flag) {
          pre.next = p2;
          flag = false;
        }
        pre = p2;
        p2 = p2.next;
      }else {
        if(!flag) {
          pre.next = p1;
          flag = true;
        }
        pre = p1;
        p1 = p1.next;
      }
    }
    if(flag) {
      pre.next = p2;
    }else {
      pre.next = p1;
    }
    return result
  }
  static test(){
    let data1 = [1,3];
    let data2 = [2,3,5,6];
    const head1 = new ListNode(data1[0]);
    const head2 = new ListNode(data2[0]);
    let p1 = head1, p2 = head2;
    let i = 1;
    while(i < data1.length || i < data2.length){
      if(i < data1.length){
        p1.next = new ListNode(data1[i]);
        p1 = p1.next;
      }
      if(i < data2.length){
        p2.next = new ListNode(data2[i]);
        p2 = p2.next;
      }
      i++;
    }
    console.log('h1: ', head1)
    console.log('h2: ', head2)
    // debugger
    let rhead = Demo.MergeLinkList(head1, head2);
    let result = []
    while(rhead){
      result.push(rhead.val);
      rhead = rhead.next;
    }
    console.log(result);
  }
}
Demo.test();
```

## NO.26 树的子结构

题目：输入两颗二叉树A和B，判断B是不是A的子结构。

+ 解题思路：先递归的判断A中是否包含B的根子节点，若包含，则开始比较其子结构是否相同，递归终止条件为A或B遍历完成
+ 步骤：
  1. 设置默认结果result为false，当两根节点存在时，先递归查找A树中与B根节点相同的点，并递归判断其子结构是否相同，将比较结果保存在result中，便于后续判断是否还要继续遍历A树
  2. 判断子结构时，先判断B树的节点是否为空，若为空表示前置匹配都正确直接返回true，否则A树节点为空或不相等时直接返回false，若相同则递归的判断其左右子树是相同

+ ts实现

```ts
class TreeNode<T> {
  val:T;
  left:TreeNode<T>|null = null;
  right:TreeNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}
class Demo {
  static isEqual(num1:number, num2:number):boolean {
    if(Math.abs(num1 - num2) < 1e-7){
      return true;
    }
    return false;
  }
  static hasSubTree<T>(RootA:TreeNode<T>, RootB:TreeNode<T>, isEqual:(n1:T, n2:T) => boolean):boolean {
    let result = false;
    if(RootA && RootB){
      if(isEqual(RootA.val, RootB.val)) result = Demo.isEqualSubTree(RootA, RootB, isEqual);
      if(!result) result = Demo.hasSubTree(RootA.left, RootB, isEqual);
      if(!result) result = Demo.hasSubTree(RootA.right, RootB, isEqual);
    } 
    return result
  }
  static isEqualSubTree<T>(p1:TreeNode<T>, p2:TreeNode<T>, isEqual:(p1:T, p2:T) => boolean):boolean {
    let result = false;
    if(!p2) return true;
    if(!p1) return false;
    if(!isEqual(p1.val, p2.val)) return false;
    return Demo.isEqualSubTree(p1.left, p2.left, isEqual) && Demo.isEqualSubTree(p1.right, p2.right, isEqual);
    
  }
  static test(){
    const rootA = new TreeNode(8);
    const rootB = new TreeNode(8);
    rootA.left = new TreeNode(8);
    rootA.right = new TreeNode(7);
    rootA.left.left = new TreeNode(9);
    rootA.left.right = new TreeNode(2);
    rootA.left.right.left = new TreeNode(4);
    rootA.left.right.right = new TreeNode(7);
    rootB.left = new TreeNode(9);
    rootB.right = new TreeNode(2);
    console.log(Demo.hasSubTree(rootA, rootB, Demo.isEqual));
  }
}
Demo.test();
```

## NO.27 二叉树的镜像

题目：请完成一个函数，输入一颗二叉树，输出它的镜像。

+ 解题思路：利用递归，当节点为叶子节点时停止递归，否则不断交换该节点的左右节点
+ ts实现

```ts
class TreeNode<T> {
  val:T;
  left:TreeNode<T>|null = null;
  right:TreeNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}
class Demo {
  static mirrorTree<T>(pRoot:TreeNode<T>):TreeNode<T>|null{
    if(!pRoot) return pRoot;
    if(!pRoot.left&&!pRoot.right) return pRoot;
    let temp = pRoot.left;
    pRoot.left = pRoot.right;
    pRoot.right = temp;
    Demo.mirrorTree(pRoot.right);
    Demo.mirrorTree(pRoot.left);
    return pRoot;
  }
  static test(){
    const rootA = new TreeNode(8);
    rootA.left = new TreeNode(8);
    rootA.right = new TreeNode(7);
    rootA.left.left = new TreeNode(9);
    rootA.left.right = new TreeNode(2);
    rootA.left.right.left = new TreeNode(4);
    rootA.left.right.right = new TreeNode(7);
    console.log(Demo.mirrorTree(rootA));
  }
}
Demo.test();
```

## NO.28 对称的二叉树

题目：请实现一个函数，用来判断一颗二叉树是不是对称的。如果一颗二叉树和它的镜像一样，那么它是对称的。

+ 解题思路：前序遍历为 左->根->右，定义右序遍历为 右->根->左，则对称二叉树的前序遍历必然与其镜像的右序遍历相等，因此可以写出前序遍历时，同时判断右序遍历对应节点是否相同
+ ts实现

```ts
class TreeNode<T> {
  val:T;
  left:TreeNode<T>|null = null;
  right:TreeNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}
class Demo {
  static isSymmetric<T>(pRoot:TreeNode<T>):boolean {
    return  Demo.isSymmetricCore(pRoot, pRoot);
  }
  static isSymmetricCore<T>(p1:TreeNode<T>, p2:TreeNode<T>):boolean {
    if(!p1&&!p2) return true;
    if(!p1||!p2) return false;
    if(p1.val !== p2.val) return false;
    return Demo.isSymmetricCore(p1.left, p2.right) && Demo.isSymmetricCore(p1.right, p2.left);
  }
  static test(){
    const rootA = new TreeNode(8);
    rootA.left = new TreeNode(8);
    rootA.right = new TreeNode(7);
    rootA.left.left = new TreeNode(9);
    rootA.left.right = new TreeNode(2);
    rootA.left.right.left = new TreeNode(4);
    rootA.left.right.right = new TreeNode(7);
    console.log(Demo.isSymmetric(rootA));
  }
}
Demo.test();
```

## NO.29 顺时针打印矩阵

题目：输入一个举着，按照从外向里以顺时针的顺序依次打印出每一个数字。例如：
[[1,2,3,4]  
[5,6,7,8]  
[9,10,11,12]  
[13,14,15,16]]  
则依次打印出数字1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10。

+ 解题思路：可先顺时针打印完一圈，再对内圈的数字继续打印，层层嵌套
+ 步骤：
  1. 定义start表示顺时针打印的起点，每次打印一圈start加1，递归打印终点为2*start小于矩阵mat的最小的维度(`2*start < mat.length && 2*start < mat[0].length`)
  2. 顺时针打印可采取贪婪打印方法，打印矩阵范围为`start`向右至`endX = mat[0].length - 1 - start`，向下至`endY = mat.length - 1 - start`从左到右尽量打印完一行，从上到下打印时，则起点为start+1，同样尽量打印完一列。
  3. 从右至左打印时需要先判断是否仅有一行，避免重复打印，起点为endX - 1，终点为start
  4. 从下至上也需要先判断是否只有一列，避免重复打印,起点为endY - 1,终点为start+1

+ ts实现

```ts
class Demo {
  static spiralOrder<T>(mat:T[][]):T[] {
    let result:T[] = [];
    if(!mat||mat.length <= 0||mat[0].length<=0) return result;
    let start = 0
    while(2*start < mat.length&&2*start < mat[0].length){
      Demo._spiralOrderCore(mat, start, result);
      start++;
    }
    return result
  }
  static _spiralOrderCore<T>(mat:T[][], start:number, res:T[]) {
    if(start >= mat.length || start >= mat[0].length) return;
    let endX = mat[0].length - 1 - start;
    let endY = mat.length - 1 - start;
    if(endX < 0 || endY < 0) return
    for(let i = start; i <= endX; i++){
      res.push(mat[start][i]);
    }
    for(let i = start+1; i <= endY; i++){
      res.push(mat[i][endX])
    }
    if(start < endY){
      for(let i = endX - 1; i >= start; i--){
        res.push(mat[endY][i])
      }
    }
    if(start < endX){
      for(let i = endY-1; i > start; i--){
        res.push(mat[i][start])
      }
    }

  }
  static test(){
    let data = [[1,2,3,4],[5,6,7,8],[9,10,11,12], [13,14,15,16]];
    console.log(...Demo.spiralOrder(data));
    console.log(...[1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10])
  }
}
Demo.test();
```

## NO.30 包含min函数的栈

题目：定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的min函数。在该栈中，调用min、push、pop的时间复杂度都是O(1)。

+ 解题思路：内部增加一个辅助栈，每次push时，同时给辅助栈push最小的元素(比较辅助栈中top和传入数值，push较小的进辅助栈)，这样就能保证最小的元素始终在栈顶，每次pop时同时pop辅助栈中的元素
+ ts实现

```ts
class MinStack {
  stack:number[];
  minStack:number[];
  constructor(){
    this.stack = [];
    this.minStack = [];
  }
  push(x:number):void{
    this.stack.push(x);
    if(this.minStack.length <= 0 || this.minStack[this.minStack.length-1] > x){
      this.minStack.push(x);
    }else {
      this.minStack.push(this.minStack[this.minStack.length-1]);
    }
  }
  pop(){
    if(this.stack.length > 0&& this.minStack.length > 0){
      this.minStack.pop();
      return this.stack.pop();
    }else {
      throw(new Error('stack is empty'));
    }
  }
  top(){
    return this.stack[this.stack.length - 1];
  }
  min(){
    return this.minStack[this.minStack.length - 1];
  }
}
class Demo {
  static test(){
    let data = [-2, 0 , -3];
    let testStack = new MinStack();
    for(let n of data){
      testStack.push(n);
    }
    console.log(testStack.min());
    console.log(testStack.pop());
    console.log(testStack.top());
    console.log(testStack.min());
  }
}
Demo.test();
```

## NO.31 栈的压入、弹出序列

题目：输入两个整数的序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如，序列[1,2,3,4,5]是某栈的压入序列，序列[4,5,3,2,1]是该压栈序列对应的一个弹出序列，但[4,3,5,1,2]就不可能是该压栈序列的弹出序列。

+ 解题思路：开辟一个辅助栈stack，按照入栈序列pushed，压入元素，入栈的同时判断是否与出栈序列popped的元素是否相同，若相同则出栈
+ 步骤：
  1. 判断输入序列长度是否相同，若不同则直接返回false
  2. 设置两个指针i,j分别指向两个序列pushed, popped
  3. 先循环遍历pushed序列，按顺序入栈，若判断i若指向的元素与j指向的相同，则可跳过入栈，直接右移i、j指针并跳过本轮循环，若栈顶元素与j的指向相同则先出栈右移j指针并跳过本轮循环，其次才是将i元素入栈，并右移i指针，遍历终止条件为i或j越界
  4. 判断辅助栈stack是否为空，若不为空，则说明未完全出栈，则使用j指针继续对popped进行遍历，相同元素相同则出栈，不同则表明顺序不同，不是弹出序列直接返回false
  5. 最后i、j指针应该索引应该相同，并且辅助栈stack为空，说明popped为弹出序列返回true，否则返回false

+ ts实现

```ts
class Demo {
  static validateStackSequences(pushed: number[], popped: number[]): boolean {
    if(pushed.length !== popped.length) return false;
    let stack:number[] = [];
    let flag = false;
    let i = 0, j = 0;
    while(i<pushed.length&&j<popped.length){
      if(pushed[i] === popped[j]){
        i++;
        j++;
        continue;
      }
      if(popped[j] === stack[stack.length - 1]){
        stack.pop();
        j++;
        continue;
      }
      stack.push(pushed[i]);
      i++;
    }
    if(stack.length !== 0){
      while(j<popped.length){
        if(popped[j] === stack[stack.length - 1]){
          stack.pop();
          j++;
        }else{
          return false;
        }
      }
    }
    if(i === j&&stack.length === 0){
      return true;
    }else {
      return false;
    }
  }
  static test(){
    let testData = [1,2,3,4,5];
    let testData2 = [4,5,3,2,1];
    debugger
    console.log(Demo.validateStackSequences(testData, testData2));
  }
}
Demo.test();
```

## NO.32 从上到下打印二叉树

### 题目一：不分行从上到下打印二叉树  

从上到下打印出二叉树的每个节点，同一层的节点按照从左到右收尾顺序打印。

+ 解题思路：利用队列的先进先出特性，将节点左右节点顺序添加到队列中，判断队列长度，每次出队将节点值保存在结果中，并判断是否右左右子节点，并入队到队列中，遍历完成后返回结果即可
+ ts实现

```ts
class TreeNode<T> {
  val:T;
  left:TreeNode<T>|null = null;
  right:TreeNode<T>|null = null;
  constructor(val:T){
    this.val = val;
  }
}

class Demo {
  static levelOrder(root: TreeNode<number> | null): number[] {
    let result:number[] = [];
    if(root){
      let dequeCache:TreeNode<number>[] = [root];
      while(dequeCache.length){
        let p:TreeNode<number> = dequeCache.shift();
        result.push(p.val);
        if(p.left) dequeCache.push(p.left);
        if(p.right) dequeCache.push(p.right);
      }
    }
    return result
  }
  static test(){
    let head = new TreeNode(3);
    let p = head;
    p.left = new TreeNode(9);
    p.right = new TreeNode(20);
    p.right.left = new TreeNode(15);
    p.right.right = new TreeNode(7);
    console.log(Demo.levelOrder(head));
  }
}
Demo.test();
```

### 题目二：分行从上到下打印二叉树  

从上到下按层打印二叉树，同一层的节点按照从左到右的顺序打印，每一层打印一行。

+ 解题思路：与上题类似，增加记录当前层剩余节点和下一层要遍历节点数的变量，在遍历中更新，并判断当前剩余节点数为0且下层节点数不为0时，将下层节点数推入当前层剩余节点数变量中，重置下层节点数，给result推入新的空数组，用于记录下一层的节点值，进入下一层遍历循环
+ ts实现

```ts
class Demo {
  static levelOrder(root: TreeNode<number> | null): number[][] {
    if(!root) return []; // leetcode要求根节点为空时返回初始值为一维空数组
    let result:number[][] = [[]];
    let dequeCache:TreeNode<number>[] = [root];
    let leftNodes = 1, nextLevel = 0;
    while(dequeCache.length){
      let p:TreeNode<number> = dequeCache.shift();
      leftNodes--;
      result[result.length - 1].push(p.val);
      if(p.left) {
        dequeCache.push(p.left);
        nextLevel++;
      }
      if(p.right) {
        dequeCache.push(p.right);
        nextLevel++;
      }
      if(leftNodes === 0 && nextLevel!== 0){
        result.push([]);
        leftNodes = nextLevel;
        nextLevel = 0;
      }
    }
    return result;
  }
  static test(){
    let head = new TreeNode(3);
    let p = head;
    p.left = new TreeNode(9);
    p.right = new TreeNode(20);
    p.right.left = new TreeNode(15);
    p.right.right = new TreeNode(7);
    console.log(Demo.levelOrder(head));
  }
}
Demo.test();
```

### 题目三：之字形打印二叉树  

请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。

+ 解题思路：利用栈的先进后出特性，翻转打印顺序，维持两个栈分别存储当前行和下一行，出栈时刚好可以实现反序
+ 步骤：
  1. 接上题利用变量存储当前层剩余节点数和下一层节点数，达到按层遍历
  2. 利用双端队列模拟两个栈，当从左向右遍历时，在左边取数据，右边推入数据，推入数据时先推左节点，后推右节点，这样在下一层出栈时就会先出右节点再出左节点达到反序的效果。
  3. 指定一个变量表示左右遍历顺序，当从左向右遍历时，从左边取数据，反之从右边取数据，推入数据时依次类推，当该层遍历完成时翻转该变量

+ ts实现

```ts
class Demo {
  static levelOrder(root: TreeNode<number> | null): number[][] {
    if(!root) return [];
    let result:number[][] = [[]];
    let dequeCache:TreeNode<number>[] = [root];
    let flag = true;
    let leftNodes = 1, nextLevel = 0;
    while(dequeCache.length){
      let p:TreeNode<number> = flag ? dequeCache.shift() : dequeCache.pop();
      leftNodes--;
      result[result.length - 1].push(p.val);
      if(flag){
        if(p.left) {
          dequeCache.push(p.left);
          nextLevel++;
        }
        if(p.right) {
          dequeCache.push(p.right);
          nextLevel++;
        }
      }else{
        if(p.right) {
          dequeCache.unshift(p.right);
          nextLevel++;
        }
        if(p.left) {
          dequeCache.unshift(p.left);
          nextLevel++;
        }
      }
      if(leftNodes === 0 && nextLevel!== 0){
        result.push([]);
        leftNodes = nextLevel;
        nextLevel = 0;
        flag = !flag;
      }
    }
    return result;
  }
  static test(){
    let head = new TreeNode(3);
    let p = head;
    p.left = new TreeNode(9);
    p.right = new TreeNode(20);
    p.right.left = new TreeNode(15);
    p.right.right = new TreeNode(7);
    debugger
    console.log(Demo.levelOrder(head));
  }
}
Demo.test();
```

## NO.33 二叉搜索树的后序遍历序列

题目：输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回true，否则返回false。假设输入的数组的任意两个数字互不相同。

+ 解题思路：利用二叉搜索树的特性。后序遍历序列的最后一个值为根节点，其左子树都小于根节点，右子树都大于根节点，可以找到左右子树后序序列，再递归的判断左右子树是否满足条件
+ 步骤
  1. 约定空数组直接返回true，设定p指针指向第一个右子树的节点
  2. 循环遍历数组，直到p大于根节点root，表明0-p为左子树，遍历右子树，若发现小于root的元素则直接返回false
  3. 若左子树存在则递归判断左子树序列是否满足，右子树同理
  4. 最后合并左右判断结果并返回

+ ts实现

```ts
class Demo {
  static verifyPostorder(postorder: number[]): boolean {
    if(postorder.length <= 0) return true;
    let root = postorder[postorder.length - 1];
    let p = 0;
    while(p < postorder.length - 1){
      if(postorder[p] > root) break;
      p++;
    }
    for(let i = p; i < postorder.length - 1;i++){
      if(postorder[i] < root) return false;
    }
    let left = true, right = true;
    if(p > 0) left = Demo.verifyPostorder(postorder.slice(0, p));
    if(p < postorder.length - 1) right = Demo.verifyPostorder(postorder.slice(p, postorder.length - 1));
    return left && right;
  }
  static test(){
    let testData = [1,3,2,6,5];
    debugger
    console.log(Demo.verifyPostorder(testData));
  }
}
Demo.test();
```

## NO.34 二叉树中和为某一值的路径

题目：输入一颗二叉树和一个整数，打印出二叉树中节点值的和为输入整数的所有路径。从树的根节点开始往下一直到叶节点所经过的节点形成一条路径

+ 解题思路：定义path数组用于存储路径，result用于存储符合条件的路径，对节点进行递归遍历，将该节点的值推入path中，若该节点没有左右子节点则为叶子节点，计算路径和，并与目标数进行比较，若相同则推入result数组中，最后回溯出栈结束该节点的遍历
+ ts实现

```ts
class Demo {
  static pathSum(root: TreeNode<number> | null, target: number): number[][] {
    if(!root) return []
    let result:number[][] = [];
    let path:number[] = [];
    Demo.pathSumCore(root, target, result, path);
    return result;
  }
  static pathSumCore(root:TreeNode<number>|null, target:number, res:number[][], path:number[]){
    if(!root) return;
    path.push(root.val);
    if(root.left) Demo.pathSumCore(root.left, target, res, path);
    if(root.right) Demo.pathSumCore(root.right, target, res, path);
    if(!root.left&&!root.right){
      let sum = path.reduce((acc, cur) => acc + cur);
      if(sum === target){
        res.push([...path]);
      }
    }
    path.pop();
  }
  static test(){
    let head = new TreeNode(5);
    head.left = new TreeNode(4);
    head.right = new TreeNode(8);
    head.left.left = new TreeNode(11);
    head.left.left.left = new TreeNode(7);
    head.left.left.right = new TreeNode(2);
    head.right.left = new TreeNode(13);
    head.right.right = new TreeNode(4);
    head.right.right.left = new TreeNode(5);
    head.right.right.right = new TreeNode(1);
    let target = 22;
    console.log(Demo.pathSum(head, target));
  }
}
Demo.test();
```

## NO.35 复杂链表的复制

题目：请实现函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个next指针指向下一个节点，还有一个pSibling指针指向链表中的任意节点或者nullptr

+ 解题思路：在原链表的基础上，每个节N点后面复制一个节点N',如`1->2->3`变为`1->1'->2->2'->3->3'`。遍历复制后的链表，修复N'节点上的pSibling指针，分离N和N'节点组成两个链表，N'节点所在的链表即为复制好的链表
+ js实现(由于leetcode未支持ts，改为js实现)

```js
class LinkNode {
  val;
  next = null;
  random = null;
  constructor(val, next=null, random=null){
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

class Demo {
  static copyRandomList(head) {
    if(!head) return null;
    Demo._copyNode(head);
    Demo._fixRandomLink(head);
    return Demo._splitLink(head);
  }
  static _copyNode(head){
    let p = head;
    while(p){
      let next = p.next;
      p.next = new LinkNode(p.val, next, null);
      p = next;      
    }
  }
  static _fixRandomLink(head){
    let p = head;
    while(p){
      let cp = p.next;
      if(p.random){
        cp.random = p.random.next;
      }
      p = cp.next;
    }
  }
  static _splitLink(head){
    let cpHead = head.next;
    let p = head, cp = cpHead;
    let next = cpHead.next;
    while(next){
      p.next = next;
      next = next.next;
      cp.next = next;

      p = p.next;
      cp = cp.next;
      next = next.next;
    }
    p.next = next;
    return cpHead;
  }
  static test(){
    let data = [[7,null],[13,0],[11,4],[10,2],[1,0]];
    let head = new LinkNode(7, null, null);
    head.next = new LinkNode(13, null, head);
    head.next.next = new LinkNode(11, null, null);
    head.next.next.next = new LinkNode(10, null, head.next.next);
    head.next.next.next.next = new LinkNode(1, null, head)
    head.next.next.random = head.next.next.next.next;
    console.log(head);
    console.log(Demo.copyRandomList(head));
  }
}
Demo.test()
```

## NO.36 二叉搜索树与双向链表

题目：输入一颗二叉搜索树，将该二叉搜索树转换成一个排序的双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向

+ 解题思路：利用二叉搜索树的：左<根<右的特性，递归遍历各节点，传入链表的最后一个节点，对于当前节点，链表的最后一个节点与其左子树中的左叶子节点相连，如果最后一个节点不为空，则修复双向链接，此时该节点就被添加到了链表中，移动最后一个节点指针，递归判断其右子树，返回最后一个节点指针，最后向前回溯，直到找到链表头指针即可
+ 步骤：
  1. 设置链表尾部指针pTail，初始值为null，若当前节点存在左子节点，递归判断左子树,将左子树转换结果与当前节点相连(pCur.left = pTail)
  2. 若pTail不为空，则修复双向链接，移动pTail指向当前节点，表示已将当前节点添加到链表中
  3. 若pCur.right存在，则遍历右子树，此过程右子树中会自动将链表结果相连
  4. 对根节点的遍历会返回链表的末尾节点，向前遍历链表找到链表头指针，返回即可

+ js实现

```js
class TreeNode {
  val;
  left;
  right;
  constructor(val, left=null, right=null){
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
class Demo {
  static convert2List(root){
    if(!root) return null;
    let pTail = null;
    pTail = Demo._convert2ListCore(pTail, root);
    let pHead = pTail;
    while(pHead&&pHead.left){
      pHead = pHead.left;
    }
    // pHead.left = pTail; // leetcode中要求循环链表
    // pTail.right = pHead;
    return pHead;
  }
  static _convert2ListCore(pTail, pCur){
    if(!pCur) return;
    let p = pCur;
    if(p.left) pTail = Demo._convert2ListCore(pTail, p.left);
    p.left = pTail;
    if(pTail) pTail.right = p;
    pTail = p;
    if(p.right) pTail = Demo._convert2ListCore(pTail, p.right);
    return pTail;
  }
  static test() { // 测试用例函数
    let head = new TreeNode(4);
    head.left = new TreeNode(2);
    head.right = new TreeNode(5);
    head.left.left = new TreeNode(1);
    head.left.right = new TreeNode(3);
    // debugger;
    console.log(Demo.convert2List(head))
  }
}
Demo.test()
```

## NO.37 序列化二叉树

题目：请实现两个函数，分别用来序列化和反序列化二叉树

+ 解题思路：[面试题7](#no7-重建二叉树)中利用了前序和中序序列来重建二叉树，因此可以使用前序方法来序列化二叉树，为了能反序列化，对于空节点使用null表示，因此根节点后即为其左子树的根节点，若值为null则表示没有左子树，若其后跟两个null则表示到达叶子节点，因此可以利用递归的方式对其序列化和反序列化
+ js实现

```js
class TreeNode{
  val;
  left = null;
  right = null;
  constructor(val){
    this.val = val;
  }
}
class Demo {
  static serialize(root){
    let result = [];
    if(!root){
      result.push(null);
      return result;
    }
    result.push(root.val);
    result = result.concat(Demo.serialize(root.left));
    result = result.concat(Demo.serialize(root.right));
    return result;
  }
  static deserialize(arr){
    if(arr.length <= 0) return null;
    let val = arr.shift();
    let pRoot = null;
    if(val !== null){
      pRoot = new TreeNode(val);
      pRoot.left = Demo.deserialize(arr);
      pRoot.right = Demo.deserialize(arr);
    }
    return pRoot;
  }
  static test(){
    let head = new TreeNode(1);
    head.left = new TreeNode(2);
    head.right = new TreeNode(3);
    head.left.left = new TreeNode(4);
    head.right.left = new TreeNode(5);
    head.right.right = new TreeNode(6);
    console.log('head', head);
    let arr = Demo.serialize(head);
    console.log('serialize:', arr);
    console.log('deserialize:', Demo.deserialize([...arr]));
  }
}
Demo.test()
```

## NO.38 字符串的排列

题目：输入一个字符串，打印出该字符串中字符的所有排列。例如，输入字符abc，则打印出由字符a,b,c所能排列出来的所有字符串abc,acb,bac,bca,cab,cba。

+ 解题思路：对字符串进行排列，在考虑有重复字符的情况下，固定一位字符，剩下的字符f(n-1)种排列方法，而固定字符的选取可以有n种选择，因此长度为n的字符串有n*f(n-1)中排列方法，可采取递归的方式求得f(n-1)的组合，在将第一个固定位的字符与后面的字符依次交换，分别求f(n-1)即可得到全排列，在有重复字符的情况下，每次保存交换过的字符，对重复的字符仅交换一次，即可避免继续重复排列。
+ 步骤
  1. 设置结果容器result，判断当前固定位pCur是否是最后一位，若是则直接将当前字符数组拼接，推入result中，并返回result
  2. 设置charSet集合临时变量，从当前固定位开始遍历，若charSet中存储有该字符则，跳过本次遍历，若没有则加入charSet中，进行步骤3
  3. 交换当前索引i和pCur处的字符，向后移动pCur，递归子串的排列，重复步骤1-3
  4. 将递归的返回结果与result连接起来，复原交换的字符(回溯)
  5. 遍历完成后返回result即可
+ js实现

```js
class Demo {
  static permutation(str){
    if(!str) return [];
    return Demo.permutationCore(Array.from(str), 0)
  }
  static permutationCore(arr, pCur){
    let result = [];
    if(pCur >= arr.length - 1){
      result.push(arr.join(''))
      return result;
    }else{
      let charSet = new Set();
      for(let i = pCur; i < arr.length; i++){
        if(charSet.has(arr[i])) continue;
        charSet.add(arr[i])
        let temp = arr[pCur];
        arr[pCur] = arr[i];
        arr[i] = temp;
        result = result.concat(Demo.permutationCore(arr, pCur+1));
        temp = arr[pCur];
        arr[pCur] = arr[i];
        arr[i] = temp;
      }
    }
    return result;
  }
  static test(){
    let data = 'abc';
    debugger
    console.log(Demo.permutation(data));
  }
}
Demo.test()
```

## NO.39 数组中出现次数超过一半的数字

题目：数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。例如，输入一个长度为9的数组[1,2,3,2,2,2,5,4,2]。由于数组2在数组中出现了5次，超过数组长度的一半，因此输出2.

+ 解题思路：
  1. 次数超过一般的数字一定位于排序后数组的n/2处，可以利用快速排序法，选择比较基数，若左边的序列长度超过一半，则该数字在左边序列中，递归判断子序列累积长度，即可找到该数字
  2. 遍历数组，对数字出现次数进行统计，num初始次数为1，若下一个数字相同则次数times++，否则times--，若times为0时，则改变num为当前遍历的数字，重置times为1，遍历完成后，times不为0，num一定是数组中出现次数最多的数字，验证其次数超过一半时即可返回

+ js实现

```js
class Demo {
  static majorityElement(nums){
    if(!nums) return null;
    let result = nums[0];
    let times = 1;
    for(let i = 1;i < nums.length; i++){
      if(times === 0){
        result = nums[i];
        times = 1;
      }else if(result === nums[i]){
        times++;
      }else{
        times--;
      }
    }
    return Demo.checkMajority(nums, result);
  }
  static checkMajority(nums, target){
    let times = 0
    for(let val of nums){
      if(val === target) times++;
    }
    return 2*times >= nums.length ? target : null;
  }
  static test(){
    let data = [1, 2, 3, 2, 2, 2, 5, 4, 2]
    console.log(Demo.majorityElement(data));
  }
}
Demo.test()
```

## NO.40 最小的k个数

题目：输入n个整数，找出其中最小的k个数。例如，输入4,5,1,6,2,7,3,8这8个数，则最小的四个数是1,2,3,4.

+ 解题思路：
  1. 利用快速排序法，选定基数，将较小的数移到数组前方，返回基数所在位置索引。若索引小于目标k-1(索引从0开始)，则说明最小的k个数有一部分在右边序列中，并对右方范围序列再进行快排比较，如此反复直到返回索引为k-1,则该数组前k项即为最小的k个数。时间复杂度为O(n)
  2. 利用容量为k个数的最大堆或红黑树容器，对数组进行一次遍历比较，较小的存入/交换到容器中，遍历完成后容器中即为最小的k个数，时间复杂度为O(nlogk)

+ js实现

```js
class Solution {
  // 基于快速排序的方法实现
  static getLeastNumbers(arr, k){
    if(arr?.length <= 0 || k <= 0) return [];
    let start = 0, end = arr.length - 1;
    let index = Solution.partition(arr, start, end);
    while(index !== k -1){
      if(index < k - 1){
        start = index + 1;
      } else {
        end = index - 1;
      }
      index = Solution.partition(arr, start, end);
    }
    return arr.slice(0, k);
  }
  static partition(arr, start, end){
    if(arr?.length <= 0) retrun -1;
    if(start === end) return start;
    let temp;
    let small = start - 1
    for(let i = start; i < end; i++){
      if(arr[i] < arr[end]){
        small++;
        if(small !== i){
          temp = arr[small];
          arr[small] = arr[i];
          arr[i] = temp;
        }
      }
    }
    small++;
    temp = arr[small];
    arr[small] = arr[end];
    arr[end] = temp;
    return small;
  }
  // TODO:基于红黑树或最大堆的实现
  static test(){
    let data = [0,1,2,1];
    console.log(Demo.getLeastNumbers(data, 1));
  }
}
```

## NO.41 数据流中的中位数

题目：如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值，若果从数据流中读出偶数个数值，那么中位数就是所有数值排序后中间两个数的平均值

+ 解题思路：由于输入是数据流，因此需要维护一个容器，存储每次输入的数据。要获得中位数，可以维护一个排序数组容器，每次可以从中间索引位置获得中位数。但考虑到中位数的特性，可以维护一个最大堆left和最小堆right，保证最大堆中的所有元素left小于最小堆中right中的所有元素，并且两堆的大小相差不大于1，因此取出中位数时，可以直接取堆顶元素
+ 步骤：
  1. 初始化两个辅助堆
  2. 对数据流中的数据进行入堆，若当前长度为奇数则向最小堆right中推入元素
  3. 向right中推入元素num时，先判断num是否小于left的堆顶，若小于则需要先入left堆，然后从left堆中取出堆顶元素，入堆right中，保持两堆平衡。若不小于则直接入堆right
  4. 取出中位数时，若数据流总长度为奇数，则直接取right堆顶，若为偶数，则取两堆顶元素求平均

+ js实现

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

var MedianFinder = function() {
  this.arr = [];
  this.left = new Heap((a, b) => a < b); // 最大堆
  this.right = new Heap((a, b) => a > b); // 最小堆
};
MedianFinder.prototype.addNum = function(num) {
  this.arr.push(num);
  let target = num;
  if(this.arr.length & 1){ // 总长度为奇数，则插入到右边的最小堆中
    if(this.left.size > 0 && this.left.peek() > target){
      this.left.push(target); // 若推入数字小于left则先入left，在将left堆顶入right
      target = this.left.pop();
    }
    this.right.push(target);
  } else {
    if(this.right.size > 0 && this.right.peek() < target){
      this.right.push(target); // 与上方功能类似
      target = this.right.pop();
    }
    this.left.push(target);
  }
};
MedianFinder.prototype.findMedian = function() {
  let size = this.arr.length;
  if(size === 0) return undefined;
  if(size & 1) return this.right.peek();
  else return (this.left.peek() + this.right.peek()) / 2;
};
```

## NO.42 连续子数组的最大和

题目：输入一个整形数组，数组中有正数也有负数。数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。要求时间复杂度为O(n)

+ 解题思路：
  + 思路1：使用sum变量存储累加和，当sum小于或等于0时再累加只能让数字更小，因此丢弃sum值，并赋予当前遍历的值item，每次遍历判断sum是否比暂存的max大，若大则将max更新为最新的sum
  + 思路2：动态规划
+ js实现思路1：

```js
class Solution {
  static maxSubArray(arr){
    if(!arr || !Array.isArray(arr)) return;
    let max = arr[0];
    let sum = 0;
    for(let item of arr){
      if(sum <=0) sum = item;
      else sum += item;
      if(sum > max) max = sum;
    }
    return max;
  }
  static test() {
    const example = [-2,1,-3,4,-1,2,1,-5,4];
    console.log(Solution.maxSubArray(example) === 6);
  }
}
Solution.test();
```

## NO.43 `[1,n]`整数中1出现的次数

题目：输入一个整数n，求`[1,n]`这n个整数的十进制表示中1出现的次数。例如，输入12，则`[1,12]`这些整数中包含1的数字有1，10,11和12,数字1一共出现了5次

+ 解题思路：此题本质可按照排列组合来处理

将1~n，个、十、百、千···等各位置出现1的次数相加，即为总次数  
设当前为i的值为cur，则高位组成的值为high、低位组成的值为low，当前为乘率为digit  

1. 当cur=0，出现1的次数为`high*digit`，以n=2304的十位为例:  
![S4O43-1.png](./resource/S4O43-1.png)
2. 当cur=1，出现1的次数为`high*digit + low + 1`，以n=2314的十位为例:  
![S4O43-2.png](./resource/S4O43-2.png)
3. 当cur>1时，出现1的次数为`(high + 1) * digit`，以n=2324的十位为例:  
![S4O43-3.png](./resource/S4O43-3.png)

循环遍历每一位，终止条件为cur和high同时为0，[参考leetcode路飞](https://leetcode.cn/problems/1nzheng-shu-zhong-1chu-xian-de-ci-shu-lcof/solution/mian-shi-ti-43-1n-zheng-shu-zhong-1-chu-xian-de-2/)
此题转换为排列组合后，关键在于确定cur出现1的数字范围，限定范围后，可按照排列组合的方式确定，组合数

```js
class Solution {
  static countDigitOne = function(n) {
    if(n <= 0) return 0;
    if(n <= 9) return 1;
    let high = Math.floor(n / 10); // 初始值
    let cur = n % 10, low = 0, digit = 1;
    let res = 0;
    while(high !== 0 || cur !== 0){ // 当不同时为0时继续遍历
      if(cur === 0) res += high * digit; // 根据不同的情况计算不同的排列
      else if(cur === 1) res += high * digit + low + 1;
      else res += (high + 1) * digit;
      low += digit * cur; // 更新各变量
      cur = high % 10;
      high = Math.floor(high / 10);
      digit *= 10;
    }
    return res;
  }
  static test() {
    console.log(Solution.countDigitOne(13));
  }
}
Solution.test();
```

## NO.44 数字序列中某一位的数字

题目：数字以0123456789101112131415...的格式序列化到一个字符序列中。在这个序列中，第5位(从0开始计数)是5，第13位是1，第19为是4，等等。请写一个函数，求任意第n位对应的数字

+ 解题思路：将数字分段按照位数，`[1-9]`,`[10-99]`,`[100-999]`···；对应位数digit分别为1,2,3,···(`digit++`)；每段起始数字start为，1,10,100,···(`start*=10`)；对应每段区间字符数count为`9*start*digit`
  1. 首先输入n是从0开始的，所以相当于序列化字符串的索引，若n > count 则对n进行遍历，直到不满足该条件，求得n所在数字区间
  2. 利用该区间的起始数字及位数，求得n所在数字num。注意：每段区间start的个位数均从0开始,因此n需减1，再除digit取整(第一段区间除外，但由于含0，所以规则同样有效)
  3. 取得n所在数字num后`((n - 1) $ digit)`即为n所在字符的索引

[思路参考路飞](./TODO)

```js
class Solution {
  static findNthDigit(n) {
    let start = 1, digit = 1, count = 9;
    while(n > count){
      n -= count;
      start *= 10;
      digit++;
      count = 9 * start * digit
    }
    let num = start + Math.floor((n - 1) / digit);
    return Number((num).toString()[(n - 1) % digit]);
  }
  static test() {
    let example = [5, 13, 19]
    example.forEach(i => {
      console.log(Solution.findNthDigit(i));
    })
  }
}
Solution.test();
```

## NO.45 把数组排成最小的数

题目：输入一个正整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数组中最小的一个。例如，输入数组{3,32,321}，则打印出这三个数字能排成的最小数字321323

+ 解题思路：定义比较大小的函数Compare，在此函数中尝试尝试拼接数字a,b，若ab > ba 则任务a > b 返回对应bool值即可；使用排序算法对数组进行排序即可获得最小数字的排列

```js
class Solution {
  static minNumber(nums) {
    return nums.sort(Solution._compare).join('');
  }
  static _compare(a, b) {
    let left = Number((a).toString() + b);
    let right = Number((b).toString() + a);
    return left - right;
  }
  static test() {
    let example = [3,30,34,5,9];
    console.log(Solution.minNumber(example));
  }
}
Solution.test();
```

## NO.46 把数字翻译成字符串

题目：给定一个数字，我们按照如下规则把它翻译为字符串：0翻译成'a'，1翻译为'b'，....，11翻译为'l'，...，25翻译为'z'。一个数字可能有多个翻译。例如，12258有5中不同的翻译，分别是'bccfi','bwfi','bczi','mcfi','mzi'。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

+ 解题思路：设n位数翻译方法是f(n)种,则第n位单独翻译时有f(n-1)中翻译方法，若第n位、第n-1位可以整体翻译时,翻译则可选择整体翻译或分别翻译，因此翻译方法有`f(n-2) + f(n-1)`种。可使用动态规划，从右向左遍历各位上的数字，其中n位上的数字为0时无法进行整体翻译

```js
class Solution {
  static translateNum(num) {
    let dp = [1, 1], x, y = num % 10; // 初始化y为个位数, dp初始无数字和1位数字的翻译方法均为1
    while(num !== 0) {
      num  = Math.floor(num / 10); // 从右向左遍历
      x = num % 10; // 首次遍历x为十位数
      let temp = 10 * x + y; // 计算xy组合是否在整理可翻译的范围内，并计算最近的dp值
      let target = (temp >= 10 && temp <= 25) ? dp[0] + dp[1] : dp[1];
      dp[0] = dp[1]; // 更新dp值
      dp[1] = target;
      y = x; // 更新下一轮递归的y值
    }
    return dp[1];
  }
  static test() {
    console.log(Solution.translateNum(12258));
  }
}
Solution.test();
```

## NO.47 礼物的最大价值

题目:在一个m*n的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值(价值大于0).你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格，直到达到棋盘的右下角。给定一个棋盘及其上面的礼物，请计算你最多能拿到多少价值的礼物？

+ 解题思路：区别于回溯法，本题使用动态规划，考虑到第`dp[i][j]`处的礼物价值仅与格子`grid[i][j]`、上方`dp[i-1][j]`和左方`dp[i][j-1]`的价值有关，因此可以对棋盘grid进行遍历，为节省内存可以直接在grid上修改价值，将grid转换为dp，最后dp矩阵右下角即为能最多拿到的礼物价值

```js
class Solution {
  static maxValue(grid){
    for(let i = 0; i < grid.length; i++){
      for(let j = 0; j < grid[0].length; j++){
        if(i === 0 && j === 0) continue; // 初始位置价值就等于其本身
        if(i === 0) grid[i][j] += grid[i][j-1]; // 位于第一行，至与左边的值有关
        else if(j === 0) grid[i][j] += grid[i - 1][j]; // 位于第一列
        else grid[i][j] += Math.max(grid[i - 1][j], grid[i][j - 1])
      }
    }
    return grid[grid.length - 1][grid[0].length - 1] // 返回右下角的值
  }
  static test() {
    let example = [
      [1,3,1],
      [1,5,1],
      [4,2,1]
    ];
    console.log(Solution.maxValue(example))
  }
}
Solution.test();
```

## NO.48 最长不含重复字符的字符串

题目：请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。假设字符串中只包含'a'-'z'的字符。例如，在字符串"arabcacfr"中，最长的不含重复字符的子字符串是"acfr"，长度为4.

+ 解题思路：滑动窗口
  1. 双指针left和right滑动窗口，利用hash表辅助存储在窗口内字符出现的次数
  2. right指针遍历字符串扩大窗口，每次遍历时更新hash表
  3. 判断新加入的字符次数大于1则，在left侧缩小窗口，直到窗口内不包含重复字符
  4. 比较区间和res的大小，并更新res值，遍历完成后即可得到最大的长度
+ 解题思路二：动态规划，
  1. `dp[j]`代表以`s[j]`结尾的最长不重复子字符串的长度，在j左侧与右边界`s[j]`最近的相同字符串记为`s[i]`
  2. 当`dp[j-1] < j - i`时，说明`s[i]`在区间外，`dp[j] = dp[j - 1] + 1`
  3. 当`dp[j - 1] >= j -i`时，`s[i]`在区间内`dp[j] = j - i`
  4. 遍历整个字符串得到dp数组中最大数值即为最大长度(最大值可边遍历边判断, 因此无需记录dp数组)

::: tip 动态规划也可使用双指针

1. 利用j指针遍历s，利用hash存储`s[j]`最后出现的索引位置
2. 根据上一轮`i`和`hash[s[j]]`，更新左边界`i = max(hash[s[j]], i)`，保证区间内无重复字符
3. 更新`res = max(res, j - i)`

:::

```js
class Solution {
  // 滑动窗口实现
  static lengthOfLongestSubstring(s){
    let window = {}; // 滑动窗口hash
    let left = 0, right = 0, res = 0; // 初始化左右指针和长度记录
    while(right < s.length){ // 向右扩大窗口
      let char = s[right++];
      if(window[char]) window[char]++; // 向hash中添加该字符记录
      else window[char] = 1;
      while(window[char] > 1){ // 在hash中发现重复字符,left指针缩小窗口
        let tmp = s[left++]; // 获取退出窗口的字符
        window[tmp]--; // 将该字符记录减1，通常此时tmp与char是相等的
      }
      res = Math.max(res, right - left); // 每轮遍历记录最大符合要求的长度
    }
    return res;
  }
  // 动态规划思路实现
  static lengthOfLongestSubstring2(s){
    let res = 0, i = -1, hash = {}; // 因为j从0开始遍历i必须初始化为-1，保证j-i为区间长度(左开右闭区间)
    for(let j = 0; j < s.length; j++){
      // 优先判断hash中是否右重复字符(此处必须用undefined比较，因为索引0位为false)，若右更新i值
      if(hash[s[j]] !== undefined) i = Math.max(hash[s[j]], i);
      hash[s[j]] = j; // 更新hash字符对应索引位
      res = Math.max(res, j - i); // 更新最新dp
    }
    return res;
  }
  static test() {
    let example = 'pwwkew'
    console.log(Solution.lengthOfLongestSubstring(example));
  }
}
Solution.test();
```

## NO.49 丑数

题目：我们把只包含因子2,3,5的数成为丑数，求从小到大的顺序的第1500个丑数。例如，6,8都是丑数，但14不是，因为它包含因子7.习惯上我们把1当做第一个丑数。

+ 解题思路：动态规划，根据丑数的性质有"丑数 = 某较小的丑数 × 某因子(2,3,5)"，设某较小丑数在dp中的索引为a, b, c分别对应因子2, 3, 5。可得长度为n 的丑数序列dp中`dp[n+1] = min(dp[a]*2, dp[b]*3, dp[c]*5)`，且a, b, c需要满足以下条件：
  1. `dp[a]*2 > dp[n] >= dp[a-1]*2`,第一个乘2后大于`dp[n]`的丑数
  2. `dp[b]*3 > dp[n] >= dp[b-1]*3`,第一个乘3后大于`dp[n]`的丑数
  3. `dp[c]*5 > dp[n] >= dp[c-1]*5`,第一个乘5后大于`dp[n]`的丑数

+ 步骤：
  1. 动态规划列表`dp[i]`表示第`i+1`个丑数(从0开始)
  2. 取满足条件的a, b, c索引值更新`dp[i]`值
  3. 分别判断a, b, c维持其仍满足新`dp[i]`的条件，(具体来说更新后的`dp[i]`必定等于其中一个的对应丑数×因子，找出其索引并加1)
  4. 循环n次后输出末位数即可

```js
class Solution {
  static nthUglyNumber(n){
    let dp = new Array(n).fill(1); // 根据n，先分配dp长度
    let a = 0, b = 0, c = 0; // a,b,c为第一个丑数，索引为0
    for(let i = 1; i < n; i++){ // 从1开始遍历到n-1，遍历n-1次
      // 只需计算条件左边的值，后续索引更新维持条件右变的值
      let n2 = dp[a] * 2, n3 = dp[b] * 3, n5 = dp[c] * 5;
      dp[i] = Math.min(n2, n3, n5); // 更新dp[i]
      // 维持右边界条件
      if(dp[i] === n2) a++;
      if(dp[i] === n3) b++;
      if(dp[i] === n5) c++;
    }
    return dp[dp.length - 1];
  }
  static test() {
    console.log(Solution.nthUglyNumber(10))
  }
}
Solution.test();
```

## NO.50 第一个只出现一次的字符

在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

+ 解题思路：遍历一遍s字符串，使用hash表统计每个字符出现的次数，再遍历一遍s字符串，查找对应字符出现次数为1的字符，返回即可
+ 优化：第二遍遍历时，可利用顺序hash表，直接遍历hash表，获取到第一个出现次数为1的字符返回即可

```js
class Solution {
  static firstUniqChar(s) {
    let cache = new Map(); // js原生对象不能保证key按定义顺序输出，所以使用内置Map
    for(let char of s){
      if(cache.has(char)) cache.set(char, cache.get(char)+1);
      else cache.set(char, 1);
    }
    for(let item of cache){
      if(item[1] === 1) return item[0];
    }
    return ' '
  }
  static test() {
    console.log(Solution.firstUniqChar(''));
  }
}
Solution.test();
```

## NO.51 数组中的逆序对

题目：在数组中有两个数字，如果前面一个数字大于后面的数字，则两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。例如在数组{7,5,6,4}中，一共存在5个逆序对，分别是(7,6),(7,5),(7,4),(6,4),(5,4).

+ 解题思路：利用归并排序法，进行分而治之，在归并阶段当右序列元素r比左序列元素l小时，则说明l元素及其后的所有左序列元素都与r元素构成逆序对，因此只需要在不满足`left[l] <= right[r]`时统计left剩余元素数`left.length - l`即可，对于右序列先遍历完成的情况已包含在内，无需特殊处理

```js
class Solution {
  static reversePairs(nums){
    let length = nums.length;
    if(length < 2) return {arr:nums, count:0};
    let m = Math.ceil(length / 2);
    let lRes = Solution.reversePairs(nums.slice(0, m));
    let rRes = Solution.reversePairs(nums.slice(m));
    let merge = Solution._mergeArray(lRes.arr, rRes.arr);
    return {arr:merge.arr, count:lRes.count+rRes.count+merge.count};
  }
  static _mergeArray(left, right){
    let arr = [];
    let count = 0;
    let l = 0, r = 0;
    while(l < left.length && r < right.length){
      if(left[l] <= right[r]) arr.push(left[l++])
      else{ // 每次添加右子序列元素时，统计逆序数
        arr.push(right[r++]);
        count += left.length - l; // 每个元素与左序列剩余的所有元素构成逆序对
      }
    }
    arr.push(...left.slice(l)); // 因在添加右子序列时统计过逆序对，此处不再统计
    arr.push(...right.slice(r));
    return {arr, count};
  }
  static test() {
    let example = [7, 5 ,6, 4];
    let result = Solution.reversePairs(example);
    console.log(result);
  }
}
Solution.test();
```

## NO.52 两个链表的第一个公共节点

题目：输入两个链表，找出它们的第一个公共节点。

+ 解题思路：设公共节点数量为c，链表headA的节点数量为a, headB的节点数量为b，则指针A需要走`a-c`步,B指针需要走`b - c`步，使用A指针遍历headA然后再遍历headB到公共节点需要的步数为`a + b - c`，使用B指针遍历headB然后遍历headA到公共节点需要的步数为`b + a - c`，两指针需要步数相同且此时指向同一节点，因此可以合并遍历，最终A,B指向为第一个公共节点,若为null则没有公共节点

```js
class LinkNote {
  constructor(val=undefined, next=undefined){
    this.val = val;
    this.next = next;
  }
}
class Solution {
  static getIntersectionNode(headA, headB){
    let pa = headA, pb = headB;
    while(pa !== pb){
      pa = pa ? pa.next : headB;
      pb = pb ? pb.next : headA;
    }
    return pa;
  }
  static test() {
    let example = [
      [4, 1],
      [5, 0, 1],
      [8, 4, 5]
    ];
    let headA = new LinkNote(example[0][0]);
    let headB = new LinkNote(example[1][0]);
    let common = new LinkNote(example[2][0]);
    let pa = headA, pb = headB, pc = common, i = 1;
    while(i < example[0].length || i < example[1].length){
      if(i < example[0].length) {
        pa.next = new LinkNote(example[0][i]);
        pa = pa.next;
      }
      if(i < example[1].length) {
        pb.next = new LinkNote(example[1][i]);
        pb = pb.next;
      }
      if(i < example[2].length) {
        pc.next = new LinkNote(example[2][i]);
        pc = pc.next;
      }
      i++;
    }
    pa.next = common, pb.next = common;
    console.log(Solution.getIntersectionNode(headA, headB))
  }
}
Solution.test();
```

## NO.53 在排序数组中查找数字

### 题目一：数字在排序数字中出现的次数

统计一个数字在排序数组中出现的次数。例如，输入排序数组{1,2,3,3,3,3,4,5}和数字3，由于3在这个数组中出现了4次，因此输出4

+ 解题思路:利用二分查找法，target在nums中的左右边界,设置遍历条件为`i<=j`进行过度遍历，遍历结束时`i>j`，因此可以从i,j中取得边界。对数组进行两轮二分查找，依次取得左右边界left,right，返回长度为`right - left - 1`

```js
class Solution {
  static search(nums, target){
    let i = 0, j = nums.length - 1;
    while(i <= j){ // 二分查找右边界
      let m = Math.floor((i + j) / 2);
      if(nums[m] <= target) i = m + 1;
      else j = m - 1;
    }
    // 遍历结束后j指针必定指向target如果存在的话，而i则刚好指向右边界
    let right = i;
    if(j >= 0 && nums[j] !== target) return 0; // 判断区间内是否存在target，不存在则直接返回
    // 重置i的值并二分查找左边界
    i = 0;
    while(i <= j){ // 
      let m = Math.floor((i + j) / 2);
      if(nums[m] < target) i = m + 1;
      else j = m - 1;
    }
    let left = j;
    return right - left - 1; // 返回左右边界区间内的长度
  }
  static test() {
    let example = [5,7,7,8,8,10];
    console.log(Solution.search(example, 5))
  }
}
Solution.test();
```

### 题目二：[0,n-1]中缺失的数字  

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每一个数字都在范围[0,n-1]之内。在范围[0,n-1]之内的n个数字有且只有一个数字不在该数组中，请找出该数字。

+ 解题思路：题目前提为所有数都为整数。可将数组分为左右两组，左边的数组元素都与其索引相等，右边数组元素都不与其索引相等，缺失的数字即为右边数组的首个元素。
+ 步骤：
  + 使用二分法确定边界当`l <= r`时循环,计算中点`m = (r - l) / 2 + l`索引
  + 若`nums[m] = m`，则首位元素一定在闭区间`[m+1,r]`中，因此执行`l = m+1`
  + 若`nums[m] != m`，则首位元素一定在闭区间`[l, m - 1]`中，因此执行`r = m-1`
  + 循环结束时l指向右数组首位元素，r指向左数组末尾元素

```js
class Solution {
  static missingNumber(nums){
    let len = nums.length;
    let l = 0, r = len -1, mid;
    while(l <= r){
      mid = Math.floor( (r - l) / 2 ) + l;
      if(nums[mid] === mid) l = mid + 1;
      else r = mid - 1;
    }
    return l;
  }
  static test() {
    let example = [1];
    console.log(Solution.missingNumber(example))
  }
}
Solution.test();
```

## NO.54 二叉搜索树的第K大节点

题目：给定一个二叉搜索树，请找出其中第k大的节点。例如，在下图中的二叉搜索树里，按节点数值大小顺序，第3大节点的值是4  
![n54.png](./resource/n54.png)

+ 解题思路：二叉搜索树的中序遍历是有序数组，若定义'右->根->左'则是从大到小的序列，因此利用此特性可找到第k大的节点。先遍历右子树，在每次读取节点值的时候进行计数count，计数前判断当前count是否为0，若为0则说明上一轮已经找到该节点直接返回不再进行遍历，否则将count减1再判断是否为0，若为0则给闭包中的结果变量res赋值，然后遍历左子树.

```js
class Solution {
  static kthLargest(root, k){
    let count = k; // 记录读取节点值的次数
    let res = 0; // 第k大的节点
    const dfs = node => { // 利用二叉搜索树的中序遍历是单调的特性，进行中序遍历
      if(!node) return; // 遇到叶子节点则直接返回
      dfs(node.right); // 先遍历右子树表示从大到小遍历
      if(count === 0) return // 当遍历节点值时对先对计数进行判断，若为0表示上一轮已获取到目标数据，直接返回即可
      count -= 1; // 每次读取节点值将计数减1
      if(count === 0) res = node.val; // 若读取节点之后计数为0则，该值为赋给闭包变量res保存
      dfs(node.left); // 遍历查找左子树
    }
    dfs(root); // 开始遍历
    return res;
  }
}
```

## NO.55 二叉树的深度

### 题目一：二叉树的深度

输入一颗二叉树的根节点，求该树的深度。从根节点到叶节点依次经过的节点(含根、叶节点)形成树的一条路径，最长路径的长度为树的深度

+ 解题思路：使用深度优先遍历和动态规划，当前节点为空时直接返回0，不为空时深度取决于左右子树深度中最大的加1

```js
class TreeNoe {
  constructor(val){
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
class Solution {
  static maxDepth(root){
    if(!root) return 0;
    return Math.max(Solution.maxDepth(root.left), Solution.maxDepth(root.right)) + 1;
  }
  static test() {
    let root = new TreeNoe(3);
    root.left = new TreeNoe(9);
    root.right = new TreeNoe(20);
    root.right.left = new TreeNoe(15);
    root.right.right = new TreeNoe(7);
    console.log(Solution.maxDepth(root));
  }
}
Solution.test();
```

### 题目二：平衡二叉树

输入一颗二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左、右子树的深度相差不超过1，那么它就是一颗平衡二叉树。

+ 解题思路：与上题类似，采用递归的后序遍历，从最底层开始计算左右子树的高度，若发现高度差大于1则直接返回-1，并在左右子树遍历完成时判断返回高度，若为-1则说明不是平衡二叉树，进行剪枝直接返回-1不再对其他子树进行判断。若为平衡二叉树则正常计算高度

```js
class Solution { // TreeNode类接上题
  static isBalanced(root){
    return Solution.recur(root) === -1 ? false : true;
  }
  static recur(root){
    if(!root) return 0; // 传入节点为空则返回深度0
    let left = Solution.recur(root.left); // 获取左子树的高度
    if(left === -1) return -1; // 判断高度并剪枝，右子树同样处理
    let right = Solution.recur(root.right);
    if(right === -1) return -1;
    let abs = Math.abs(left - right); // 若是平衡树则，获得左右子树高度差
    if(abs <= 1) return Math.max(left, right) + 1; // 高度差符合要求则返回正常高度
    else return -1; // 高度差不符合要求则直接返回-1
  }
  static test() {
    let root = new TreeNoe(3);
    root.left = new TreeNoe(9);
    root.right = new TreeNoe(20);
    root.right.left = new TreeNoe(15);
    root.right.right = new TreeNoe(7);
    console.log(Solution.isBalanced(root));
  }
}
Solution.test();
```

## NO.56 数组中数字出现的次数

### 题目－：数组中只出现一次的两个数字

一个整型数组里除了两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度O(n)，空间复杂度O(1)。

+ 解题思路：因为要求了时间复杂度，所以不能使用暴力解法和哈希表来实现，考虑到除目标数外其他数都出现了两次，使用按位异或运算能将只出现一次的数字找出，但只出现一次的数字有两个，因此可以利用两个只出现一次的数字之间的不同，将数组分为两组分别进行异或求解  
ps:因为m与相同的数字按位与，所得结果相同，因此不影响出现两次的数字的分组，但能分开仅出现一次的两个数组

+ 步骤：
  1. 设置x,y变量初始值为0，用于存储两个数字，设置n为0表示整个数组异或的结果，设置m为1用于查找并保存x,y两数字二进制第一个不同的位
  2. 遍历数组，用n对每个数字进行异或，计算出整个数组异或的结果
  3. 将n和m按位与，若若等于0，将m左移一位，直到`(n&m) !== 0`
  4. 再次遍历数组判断每个数组i和m按位与的结果，分为两组分别使用x和y进行异或
  5. 遍历完成后返回x,y即可

```js
class Solution {
  static singleNumbers(nums) {
    let x = 0, y = 0, n = 0, m = 1;
    for(let i of nums){
      n ^= i;
    }
    while((n & m) === 0) m <<= 1;
    for(let i of nums){
      if(i&m) x ^= i;
      else y ^= i;
    }
    return [x,y]
  }
  static test() {
    let example = [1,2,10,4,1,4,3,3]
    console.log(...Solution.singleNumbers(example));
  }
}
Solution.test();
```

### 题目二：数组中唯一只出现一次的数字

在一个数组中除一个数字只出现一次之外，其他数字都出现了三次，请找出那个只出现一次的数字

+ 解题思路：将数组中所有元素的二进制数的每一位相加，若能被3整除则只出现一次的数字在此位一定为0，否则为1，收集这些1即可得到该数(注意两次32位的数组遍历需反向)

```js
class Solution {
  static singleNumbers(nums) {
    if(!nums) return;
    let bitSum = new Array(32).fill(0);
    for(let i of nums){ // 收集每个数字的二进制对应位上1出现的次数
      for(let j = 0; j < bitSum.length; j++){
        bitSum[j] += i & 1;
        i >>= 1;
      }
    }
    let res = 0, m = 3;
    for(let i = 31; i >= 0; i--){ // 反向遍历，提取余数为1的位数恢复该数字
      res <<= 1;
      res += bitSum[i] % m
    }
    return res;
  }
  static test() {
    let example = [9,1,7,9,7,9,7]
    console.log(Solution.singleNumbers(example));
  }
}
Solution.test();
```

## NO.57 和为s的数字

### 题目一：和为s的数字

输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可

+ 解题思路：经典的两数之和，可采用哈希表等方式，由于本题是已经排好序的数组，则可使用双指针对撞的方式解题

```js
class Solution {
  static twoSum(nums, target) {
    if(!nums || nums.length < 2) return []
    let left = 0, right = nums.length - 1, s = 0;
    while(left < right){
      s = target - nums[left];
      if(s === nums[right]) return [nums[left], nums[right]]
      else if(s > nums[right]) left++;
      else right--;
    }
    return []
  }
  static test() {
    let example = [10,26,30,31,47,60]
    console.log(...Solution.twoSum(example, 40));
  }
}
Solution.test();
</script>
```

### 题目二：和为s的连续正数序列

输入一个正数s，打印出所有和为s的连续正数序列(至少含有两个数)。例如，输入15，由于1+2+3+4+5=4+5+6=7+8=15，所以打印出3个连续序列1~5,4~6,7~8。

+ 解题思路：因为时连续的序列，可以使用双指针组成滑动窗口，遍历维护一个和s与目标数target进行判断，若相等则生成该闭区间的序列并保存，再判断是否大于等于target，移动左指针l，并更新和s，否则移动右指针r扩大窗口并更新和s，遍历结束条件为`l>=r`

```js
class Solution {
  static findContinuousSequence(target) {
    let l = 1, r = 2, s = 3, res = [];
    while(l < r){
      if(s === target){
        res.push(Array.from(new Array(r+1).keys()).slice(l))
      }
      if(s >= target) {
        s -= l;
        l++;
      } else {
        r++;
        s += r;
      }
    }
    return res;
  }
  static test() {
    console.log(...Solution.findContinuousSequence(15));
  }
}
Solution.test();
```

## NO.58 翻转字符串

### 题目一：翻转单词顺序

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student"，则输出"student a am I"。

+ 解题思路：使用双指针反向遍历字符串，左右指针捕获单词，并推入结果数组中，最后使用join方法拼接字符串

```js
class Solution {
  static reverseWords(s) {
    if(!s) return '';
    s = s.trim(); // 去除首尾空格
    let j = s.length - 1, i = j;
    let res = [];
    while(i >= 0) {
      while( i >= 0 && s[i] !== ' ') i--; // 找到首个空格字符
      res.push(s.slice(i+1,j+1)); // 推入单词
      while(s[i] === ' ') i--; // 跳过单词间的空格
      j = i;
    }
    return res.join(' ');
  }
  static test() {
    console.log(Solution.reverseWords('the sky is blue'));
  }
}
Solution.test();
```

### 题目二：左旋字符串

字符串的左旋转操作是把字符串的前面若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字２，该函数将返回左旋转两位得到的结果"cdefgab"

+ 解题思路：通过slice方法剪切指定长度的字符串，然后反序进行拼接

```js
class Solution {
  static reverseLeftWords(s, n) {
    if(!s) return '';
    return s.slice(n) + s.slice(0, n)
  }
  static test() {
    console.log(Solution.reverseLeftWords('abcdefg', 2));
  }
}
Solution.test();
```

## NO.59 队列的最大值

### 题目一：滑动窗口的最大值

给定一个数组和滑动窗口的大小，请找出所有滑动窗口里的最大值。例如，如果输入数组{2,3,4,2,6,2,5,1}以及滑动窗口大小3，那么一共存在6个滑动窗口，他们的最大值分别是{4,4,6,6,6,5}。

+ 解题思路：在每轮滑动窗口中维护一个单调的双端队列，每次滑动窗口时，删除队列中比新加入的元素nums[i]要小的元素，判断若最大元素不在窗口内，则弹出该元素，向队尾中加入当前元素, 向结果数组中添加队头的最大元素，遍历完成后将最后一个窗口的最大值加入结果数组，返回结果数组即可

```js
class Solution {
  static maxSlidingWindow (nums, k){
    let result = [];
    if(!nums || k <= 0) return result;
    let deque = []; // 双端队列，存储窗口中元素对应nums中的索引，并维持了单调
    // 对首个滑动窗口维护deque队列
    for(let i = 0; i < k; i++){
      while(deque && nums[i] >= nums[deque[deque.length - 1]]){
        deque.pop() // 遍历队尾，找到比当前新加元素小的元素，从后方删除
      }
      deque.push(i);
    }
    // 滑动窗口
    for(let i = k; i < nums.length; i++){
      result.push(nums[deque[0]]) // 将维护的最大值推入结果数组
      while(deque && nums[i] >= nums[deque[deque.length - 1]]){
        deque.pop(); // 从后方删除小于nums[i]的值
      }
      // 当前最大值已滑出窗口，则将其删除(i-k)为窗口左边界
      if(deque && deque[0] <= i - k) deque.shift();
      deque.push(i);
    }
    result.push(nums[deque[0]])
    return result;
  }
  static test() {
    let example = {
      test:[1,3,-1,-3,5,3,6,7],
      k:3,
      result:[3,3,5,5,6,7]
    }
    console.log(...Solution.maxSlidingWindow(example.test, example.k))
    console.log(...example.result);
  }
}
Solution.test();
```

### 题目二：队列的最大值

请定义一个队列并实现函数max得到队列里的最大值，要求函数max，push_back和pop_front的时间复杂度都是O(1)。

+ 解题思路：与上题思路类似，额外维护一个单调队列，删除队列中小于新增元素的元素，出队时若是当前最大值，则将单调队列中最大值也出队

```js
class Solution {
  constructor(){
    this.data = [];
    this.deque = [];
  }
  max_value(){
    return this.deque.length > 0 ? this.deque[0] : -1;
  }
  push_back(value){
    while(this.deque.length > 0 && value >= this.deque[this.deque.length - 1]) this.deque.pop();
    this.data.push(value);
    this.deque.push(value)
  }
  pop_front(){
    if(this.data.length <= 0) return -1
    let value = this.data.shift();
    if(value === this.deque[0]) this.deque.shift();
    return value
  }
  static test() {
    let max_queue = new Solution(); // 暂无测试用例
  }
}
```

## NO.60 n个骰子的点数

题目：把n个骰子仍在地上，所有骰子朝上一面的点数之和为s。输入n，打印出s所有可能的值出现的概率。

+ 解题思路：可使用动态规划来做，n个骰子的取值范围x为`[n, 6n]`，即有`6n - n + 1 = 5n + 1`种取值，各取值的概率函数f(n, x)可以由n-1个骰子的概率函数f(n-1, x)推导而来，比如：取值为i的骰子可能由`f(n-1, x - 1),···，f(n-1, x - 5)`加和组成，因此也可以站在f(n-1,x)的角度看，每个取值都将对`f(n, x+1),···,f(n, x+6)`有贡献，因此先对f(n-1,x)进行遍历，对每个值累加计算其贡献值即可得到f(n, x)

```js
class Solution {
  static dicesProbability(n){
    if(n < 1) return;
    let dp = new Array(6).fill(1/6); // 初始化一个骰子的概率情况
    for(let i = 2; i < n+1; i++){
      let tmp = new Array(5*i+1).fill(0) // 初始化i个骰子的情况，先填入0
      for(let j = 0; j < dp.length; j++){ // 从i-1个骰子的情况开始遍历递推i个骰子的情况
        for(let k = 0; k < 6; k++){
          tmp[j+k] += dp[j] / 6 // 利用索引值作为点数，依次累加i-1个骰子对i个骰子各点数的贡献情况
        }
      }
      dp = tmp
    }
    return dp
  }
  static test() {
    console.log(...Solution.dicesProbability(2))
  }
}
Solution.test();
```

## NO.61 扑克牌中的顺子

题目：从扑克牌中随机抽出5张牌，判断是不是一个顺子，即这5张牌是不是连续的。2~10为数字本身，A为1，J为11，Q为12，K为13，而大、小王用0表示，可以看成任意数字。

+ 解题思路：顺子的条件为，没有重复的牌，最大牌max-最小牌min < 5，因此可以设置set集合遍历数组判断有重复的牌则直接返回，判断为0则跳过当前遍历，维护max和min变量，遍历结束后返回`max - min < 5`的结果即可

```js
class Solution {
  static isStraight(nums){
    if(!nums) return false;
    let cache = new Set();
    let min = 14, max = 0;
    for(let num of nums){
      if(num === 0) continue;
      min = num < min ? num : min;
      max = num > max ? num : max;
      if(cache.has(num)) return false;
      cache.add(num);
    }
    return max - min < 5;
  }
  static test() {
    let example = [[1,2,3,4,5], [0,0,1,2,5]]
    console.log(Solution.isStraight(example[1]));
  }
}
Solution.test();
```

## NO.62 圆圈中最后剩下的数字

题目：0,1,...,n-1这n个数字排成一个圆圈，从数字0开始，每次从这一个圆圈里删除第m个数字。求出这个圆圈里剩下的最后一个数字。

+ 解题思路：本题为约瑟夫环问题，通过模拟删除解题复杂度较高。可考虑动态规划算法，设f(n)为n个数字每次移除第m个数字后的结果，则f(n)移除一个数字后变为`f(n) = f'(n-1)`，数字变为n-1个，顺序为`m,m+1,···,m+x`，而f(n-1)也有n-1个数字，顺序为`0,1,···,x`，则f(n-1)和f'(n-1)的关系为`f'(n-1) = (f(n-1)+m)%n` 所以有递推关系`f(n) = (f(n-1) + m) % n`,初始值f(1)仅有一位数字，因此一定等于0

```js
class Solution {
  static lastRemaining(n, m){
    if(n < 1 || m < 1) return -1;
    let last = 0; // 初始化f(1)的结果
    for(let i = 2; i <= n; i++){
      last = (last + m) % i; // 从n=2开始遍历递推，对i取余用于模拟圆环
    }
    return last;
  }
  static test() {
    let example = [[5, 3, 3], [10, 17, 2]];
    example.forEach(i => console.log(
      Solution.lastRemaining(i[0], i[1]) === i[2]
    ))
  }
}
Solution.test();
```

## NO.63 股票的最大利润

题目：假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？例如，一只股票在某些时间节点的价格为{9,11,8,5,7,12,16,14}。如果我们能在价格为5的时候买入，并在价格为16时卖出，则能收获最大的利润11.

+ 解题思路：使用动态规划，遍历价格数组，当前价格之前完成买卖操作的最大利润记为dp(i)，则dp(i)的值取取决于dp(i-1)和当前价格price减去截止目前最低价格minPrice中的最大值，即`dp(i) = max(dp(i-1), price - minPrice)`，因此在遍历时需要同时维护一个记录最小价格的变量和之前子数组的最大利润变量，遍历完成后返回最大利润即可

```js
class Solution {
  static maxProfit(prices) {
    let minPrice = Number.MAX_SAFE_INTEGER, profit = 0;
    for(const price of prices){
      minPrice = price < minPrice ? price : minPrice;
      let tmp = price - minPrice;
      profit = tmp > profit ? tmp : profit;
    }
    return profit
  }
  static test() {
    let example = [7,6,4,3,1]
    console.log(Solution.maxProfit(example));
  }
}
Solution.test();
```

## NO.64 求1+2+...+n

题目：求1+2+...+n，要求不能使用乘除法，for，while，if，else，switch，case等关键字及条件判断语句。

+ 解题思路：抛开限制此题解法有公式平均计算、迭代、递归，由于前两种方法需要使用到乘除和循环，因此排除，而递归中递归结束条件需要用到条件判断，条件判断可通过逻辑操作符短路来实现，因此可使用递归对该题进行求解

```js
class Solution {
  static maxProfit(n) {
    let res = 0;
    const sumNums = n => {
      n > 1 && sumNums(n - 1);
      res += n;
      return res
    }
    return sumNums(n);
  }
  static test() {
    console.log(Solution.maxProfit(9));
  }
}
Solution.test();
</script>
```

## NO.65 不用加减乘除做加法

题目：写一个函数，求两整数之和，要求在函数体内不得使用+-*/四则运算符号

+ 解题思路：两个二进制的无进位之和的结果与异或操作相同，而进位的部分的结果则和与运算并左移一位相同，因此可以考虑使用变量c存储进位，遍历直到进位为0即可获得求和结果(由于补码的存在，上述思路同样适用于负数)

```js
class Solution {
  static add(a, b) {
    while(b != 0){
      let c = (a&b) << 1;
      a ^= b;
      b = c
    }
    return a;
  }
  static test() {
    console.log(Solution.add(1, 1));
  }
}
Solution.test();
```

## NO.66 构建乘积数组

题目：给定一个数组A[0,1,...,n-1],请构建一个数组B[0,1,...,n-1]，其中B中的元素  
$$ B[i]=A[0]\times A[1]\times ...\times A[i-1] \times A[i+1] \times ... \times A[n-1] $$  
不能使用除法

+ 解题思路：将`B[i]`按照`A[i-1]`和`A[i+1]`分成前面乘积`C[i]`和后面乘积`D[i]`两部分，对于`C[i]=C[i-1]*A[i-1]`，`D[i]=D[i+1]*A[i+1]`，因此可以采用从沿着i增加的方向循环计算`C[i]`，再沿着i减少的方向计算`D[i]`，最终获得B

```js
class Solution {
  static constructorArr(a){
    let b = new Array(a.length).fill(1), tmp = 1;
    for(let i = 1; i < a.length; i++)(
      b[i] = b[i-1]*a[i-1] // 使用b数组缓存c[i]的结果
    )
    for(let i = a.length - 2; i >= 0; i--){
      tmp *= a[i+1]; // 使用tmp变量缓存d[i]
      b[i] *= tmp; // 将缓存的c[i]与d[i]相乘
    }
    return b;
  }
  static test() {
    let example = {
      test:[1,2,3,4,5],
      result:[120,60,40,30,24]
    }
    console.log(...Solution.constructorArr(example.test));
    console.log(...example.result);
  }
}
Solution.test();
```

## NO.67 把字符串转换成整数

题目：将一个字符串转换成一个整数(实现Integer.valueOf(string)的功能，但是string不符合数字要求时返回0)，要求不能使用字符串转换整数的库函数。 数值为0或者字符串不是一个合法的数值则返回0。

+ 解题思路:根据leetcode要求，对于超出范围的值直接显示最大或最小值，因此字符串需要优先处理的有，开头的空格、正负号;使用sign变量存储正负号，判断溢出需要优先判断结果res与`2**31 // 10`的大小，因为res后续计算需要乘10并加上当前位数，若判断溢出则根据正负号返回相应的最大或最小值，在累加遍历过程中遇到非数字字符直接跳出，返回结果时与sign变量相乘即可。

```js
class Solution {
  static strToInt(str){
    let res = 0, i = 0, sign = 1, len = str.length;
    let int_max = 2**31 - 1,int_min = -(2**31), bndry = Math.floor(2**31 / 10);
    if(!str) return 0;
    while(str[i] === ' '){
      i++;
      if(i === len) return 0;
    }
    if(str[i] === '-') sign = -1;
    if('+-'.includes(str[i])) i++;
    for(const c of str.slice(i)){
      if(c < '0' || c > '9') break;
      if(res > bndry || res === bndry && c > '7'){
        return sign === 1 ? int_max : int_min;
      }
      res = 10* res + (c - '0');
    }
    return sign * res;
  }
  static test() {
    let example = {
      test:['42', '-42', '4193 wi', 'wo 987', '-91283472332'],
      result:[42, -42, 4193, 0, -2147483648]
    }
    example.test.forEach(str => console.log(Solution.strToInt(str)))
    console.log(...example.result);
  }
}
Solution.test();
```

## NO.68 树中两个节点的最低公共祖先

题目：输入树的根节点和之中两个节点，求两个节点的最低公共祖先  

+ 思路一：判定为二叉搜索树  
若是二叉搜索树，则通过比较两节点和根节点值的大小，来判断其位于根节点的左子树或右子树，递归/遍历判断左子树或右子树，若两节点分别位于子节点(包括根节点)的两侧，则该节点为两节点的最低公共祖先  
+ 思路二：若不是二叉搜索树，且有指向父节点的指针  
若有指向父节点的指针，该问题可转换为求两个链表的第一个公共节点，该链表的尾节点都是指向根节点，可参考两链表的第一个公共节点的解法  
+ 思路三：若只是普通树，且没有指向父节点的指针  
若只是普通树，则可采用深度优先遍历，找到两节点到根节点的路径，将其转换为求两链表的第一个公共节点。
+ 思路四：对与普通树，因为各节点的值都是唯一的，采用深度优先遍历时，若当前节点等于目标节点或为空可直接返回，否则对左子树和右子树进行递归判断，获得左子树和右子树的结果，若都为空说明当前子树没有找到两节点，若其中一个为空则返回另一个节点，若都不为空则说明当前节点即为公共祖先，返回当前节点。递归返回阶段最终能够获得公共节点。

```js
class TreeNode {
  constructor(val=undefined){
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
class Solution {
  // 二叉搜索树情况的实现
  static lowestCommonAncestor(root, p, q){
    if(!root) return;
    let point = root;
    if(p.val < q.val){ // 保证p大于q能减少后续的判断复杂度
      let tmp = p;
      p = q;
      q = tmp;
    }
    while(point){
      if(point.val < q.val){
        point = point.right;
      }else if(point.val > p.val){
        point = point.left;
      } else break;
    }
    return point;
  }
  // 普通二叉树的情况
  static lowestCommonAncestor2(root, p, q){
    if(!root || root === p || root === q) return root;
    let left = Solution.lowestCommonAncestor2(root.left, p, q);
    let right = Solution.lowestCommonAncestor2(root.right, p, q);
    if(!left && !right) return;
    if(!left) return right;
    if(!right) return left;
    return root;
  }
  static test() {
    let example = {
      tree:[6,2,8,0,4,7,9,null,null,3,5],
      tree2:[3,5,1,6,2,0,8,null,null,7,4],
      test:[[2,8], [2,4],    [5,1], [5,4]],
      result:[6,2,    3,5]
    }
    let build_tree = example.tree2;
    const head = new TreeNode(build_tree[0]);
    head.left = new TreeNode(build_tree[1]);
    head.right = new TreeNode(build_tree[2]);
    head.left.left = new TreeNode(build_tree[3]);
    head.left.right = new TreeNode(build_tree[4]);
    head.right.left = new TreeNode(build_tree[5]);
    head.right.right = new TreeNode(build_tree[6]);
    head.left.right.left = new TreeNode(build_tree[9]);
    head.left.right.right = new TreeNode(build_tree[10]);
    console.log(Solution.lowestCommonAncestor2(head, head.right,head.left));
    console.log(Solution.lowestCommonAncestor2(head, head.left, head.left.right.right));
  }
}
Solution.test();
```
