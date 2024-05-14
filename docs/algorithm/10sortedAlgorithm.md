
# 十大经典排序算法python实现

![overviewSort.png](./resource/overviewSort.png)
![sortComplexity.png](./resource/sortComplexity.png)

## 冒泡排序法(bubbleSort)

相邻元素比较大小进行互换

<picture>
  <source srcset="https://cdnjson.com/images/2024/05/13/bubbleSortb5be109d39f7ca53.gif"/>
  <img src="./resource/bubbleSort.gif" alt="bubbleSort.gif">
</picture>

```python
def bubbleSort(arr):
    l = len(arr)
    for i in range(l):
        flag = False
        for j in range(l - i - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                flag = True
        if flag == False:
            #flag为False说明arr已经是排好序的无须再进行排序直接眺出节约时间
            break
    return arr
print(bubbleSort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 选择排序(选择最小值放入排序序列)

每次从未排序序列中选择一个最小值放入已排序序列的末尾  
![selectionSort.gif](./resource/selectionSort.gif)

```python
def select_sort(arr):
    l = len(arr)
    for i in range(l - 1):
        min_index = i  #默认未排序序列第一位为最小值，因此循环从第二位开始，找到最小值后与之互换值
        for j in range(i+1, l):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr

print(select_sort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 插入排序

通过构建有序序列，对未排序的数据，在已知数列中从后向前扫描，记当前位置为temp，若扫描位的元素比temp大，则将该元素后移一位，直到找到比temp小的元素为止，把temp插入到该元素的后一位。
![insertionSort.gif](./resource/insertionSort.gif)

```python
def insert_sort(arr):
    l = len(arr)
    for i in range(1, l):
        j = i - 1
        temp = arr[i]
        while j >= 0 and arr[j] > temp:
            arr[j+1] = arr[j]  #j+1等于i,将较大的元素后移一位
            j -= 1
        arr[j+1] = temp
    return arr
print(insert_sort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 希尔排序

![shellSort.gif](./resource/shellSort.gif)

```python
# TODO：更新 python解法错误
def shell_sort(arr):
    count = len(arr)
    step = 2
    group = count // step #the number of divie
    while group > 0:
        for i in range(group):
            j = i + group
            while j < count:
                key = arr[j] #the later
#                 k = j - group #the former
                
                while i >= 0 and arr[i] > key: #used little insert sort
                    arr[j] = arr[i]
                    arr[i] = key
                    i -= group
                
                j += group #the index of later
        group //= step
    return arr
print(shell_sort([592,401,874,141,348,72,911,887,820,283]))
```

    [911, 911, 911, 911, 887, 72, 911, 887, 911, 911]

## 归并排序

把长度为n的输入序列分成两个长度为n/2的子序列，对着两个子序列分别采用归并排序，将两个排序好的子序列合并成一个最终的排序序列

![mergeSort.gif](./resource/mergeSort.gif)

```python
def merge(left, right):
    i, j = 0, 0
    res = []
    while i < len(left) and j < len(right): #must exhaust i or j
        if left[i] <= right[j]:
            res.append(left[i])
            i += 1 #move i to next left index
        else:
            res.append(right[j])
            j += 1 #move j to next right index
    res += left[i:] #merge over left or right
    res += right[j:]
    return res

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    num = len(arr) // 2
    left = merge_sort(arr[:num]) #分而治之，分别对左右递归调用归并排序知道arr长度为1
    right = merge_sort(arr[num:])
    return merge(left, right) #函数返回合并的左右序列，排序运算主要在merge中完成

print(merge_sort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 快速排序

从数列中挑出一个元素作为基准，比基准小的元素全部排在左边，反之在右边。这个分区结束之后，基准尽量位于中间。递归的对基准左右两边的数列进行排序。
![quickSort.gif](./resource/quickSort.gif)

```python
import random
def fastSort(array):
    '''sort a list object array use fast sorting algorithm
    arg:
        input a list object array
    
    return:
        a list sorted from small to big used fast sort
    '''
    if len(array) < 2:
        return array
    else:
        base_num = array[0]     #假定第一个数为基准
#         base_num = random.choice(array) #随机选择一个数
        smaller = [i for i in array[1:] if i <= base_num]
        bigger = [i for i in array[1:] if i > base_num]
        return fastSort(smaller) + [base_num] + fastSort(bigger)
print(fastSort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 堆排序

利用堆数据结构所设计的排序算法，通过每次弹出堆顶元素实现排序
![heapSort.gif](./resource/heapSort.gif)

```python
import heapq
def heap_sort(arr):
    heapq.heapify(arr)
    res = []
    while arr:
        res.append(heapq.heappop(arr))
    return res

print(heap_sort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 计数排序

将输入数据值转化为键存储在额外开辟的数组空间中，找出待排序数组中最大的元素，建立该长度的数组c，统计数组中每个值为i的元素出现的次数，对所有计数累加，表示该元素位于有序表中第几项，反向填充目标数组，将每个元素i放在新数组第c[j]项，每放一个元素就将c[i]-1
![countingSort.gif](./resource/countingSort.gif)

```python
def count_sort(arr):
    res = [None for i in range(len(arr))]
    max_arr = max(arr)
    c = [0 for i in range(max_arr + 1)]
    for a in arr: #对arr中元素进行计数
        c[a] += 1
    for i in range(1, max_arr+1): #计算下标所代表的数在即将排好序的列表中第一次出现在第几个位置
        c[i] += c[i-1]
    for i in range(len(arr)-1, -1, -1):
        res[c[arr[i]] - 1] = arr[i] #c[arr[i]]-1表示arr[i]所代表值在有序表中的索引位
        c[arr[i]] -= 1          #对已排序数字对应位置进行计数，保证有多位相同数字时上式索引正确
    return res
print(count_sort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 桶排序

假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序。假定一个定量长度的数组当空桶，遍历输入数据，并且把数据一个个放进对应的桶中，对每个不是空的桶进行排序，从不是空的桶里把排好序的数据拼接起来
![bucketSort](./resource/bucketSort.gif)

```python
def bucket_sort(arr):
    pre_lst = [0]*max(arr)
    res = []
    for a in arr: #对arr元素进行统计
        pre_lst[a-1] += 1
    i = 0
    while i < len(pre_lst):
        j = 0
        while j < pre_lst[i]:
            res.append(i+1)
            j += 1
        i += 1
    return res
print(bucket_sort([5,5,5,2,3,8,1]))
```

    [1, 2, 3, 5, 5, 5, 8]

## 基数排序

![radixSort.gif](./resource/radixSort.gif)

```python
def radix_sort(arr):
    max_arr = max(arr)
    d = len(str(max_arr))
    for k in range(d):
        s = [[] for i in range(10)]
        for i in arr:
            s[i//(10**k)%10].append(i)    
        arr = [j for i in s for j in i]
    return arr
print(radix_sort([5,5,5,2,3,8,1]))
            
```

    [1, 2, 3, 5, 5, 5, 8]
