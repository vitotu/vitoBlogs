# 常见题解汇总

## n数之和

常见两数之和题目通常使用哈希表存储差值，通过比较插值解题算法复杂度为O(n)，空间复杂度为O(n)，而其扩展题三数之和则通常将数组进行排序，先固定一位数，然后使用双指针对撞的方式来扫描数组，求取三数之和，对于三数以上的n数之和，则与三数之和类似先遍历固定一个元素，然后使用递归求取n-1数之和，直到将问题转换为三数之和，则使用三数之和的方法进行求解。以下为代码示例

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
