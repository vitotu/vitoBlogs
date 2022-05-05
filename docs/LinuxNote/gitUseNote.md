# git学习笔记

## 常用命令

比较提交之间的不同(--stat表示统计量，即哪些文件不同，取消后可查看详细哪些文件哪些地方不同)
```git diff <commit id 1> <commit id 2> --stat```
```git commit --amend```修改上次commit

## 暂存指令

+ 暂存```git stash push -m <you comment>```
+ 查看暂存```git stash list```
+ 弹出暂存```git stash pop <stash id>```
+ 丢弃暂存```git stash drop <stash id>```

## git提交

```bash
# 提交到指定分支，并使用r指定代码审查者
git push origin HEAD:refs/for/<远程分支名>%r=<评审人邮箱>
# 强推并覆盖远程分支，！！！此命令非常危险，慎用
git push --set-upstream origin <远程分支名>
```

## git 分支管理

### 新增/删除分支

```bash
git branch -d <本地分支名>  # 删除本地分支
git checkout -b <本地分支名> #新增本地分支
git push origin <本地分支名>:<远程分支名> #新增远程分支
git branch --set-upstream-to=<远程分支名> #设置当前本地分支跟踪远程分支
git branch -r -d <远程分支名> #在本地删除远程分支的关联
git push origin :<远程分支名> #删除远程分支
```

### 合并分支的几种方式

1、快速合并目标分支到当前分支：```git merge <目标分支名>```(将保留目标分支的commit信息)
2、非快速方式: ```git merge -no-ff <目标分支名>``` (将在当前分支创建一个新的节点从而完成合并，但会保留对目标分支commit的引用)
3、squash方式: ```git merge -squash <目标分支名>``` (同-no-ff方式，但不会保留对目标分支commit的引用)
另外还有rebase, cherry-pick等方式进行合并，[参考资料](https://yanhaijing.com/git/2017/07/14/four-method-for-git-merge/)

## ssh生成公钥私钥对

生成公钥私钥对`ssh-keygen -t rsa -C "你的邮箱"`，默认生成路径为.ssh目录中，找到public即可
