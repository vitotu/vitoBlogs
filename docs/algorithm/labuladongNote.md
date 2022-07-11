# labuladong算法学习笔记

[labuladong](https://labuladong.github.io/algo/)

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


