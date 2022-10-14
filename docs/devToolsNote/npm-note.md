# 前端开发工具

## 包管理器

在没有使用包管理器的情况下，要使用第三方库只能通过`<script>`的方式去引用依赖  
当依赖发生变化、需要更新升级、第三方库之间的相互依赖、版本管理等问题。会让这种方式变得难以维护，因此需要使用包管理器  
通常安装node环境之后，node自带npm作为包管理器，你也可以安装其他包管理器如:yarn,pnpm等  
下面将详细介绍这三种包管理器  

[参考文档1](https://www.51cto.com/article/702067.html)  
[参考文档2](https://juejin.cn/post/6844903616109641736)  
[参考文档3](https://juejin.cn/post/7047556067877716004)  

### npm

npm作为node的默认包管理器，同时也是yarn、pnpm的基础  
npm使用语义版本控制思想设计的使用package.json文件管理依赖  
依赖记录如`"dependencies": { "包名": "版本命名"}`  

- 版本命名格式x.y.z：
  - x是大版本，更新可能会导致API不兼容；
  - y次版本，以兼容的方式添加新功能；
  - z补丁版本
- 版本命名前缀：
  - ^大版本锁定
  - ~锁定至次版本
  - 其他符号(>,>=,<,<=,||,-)则对应其符号表意

通过版本命名的方式保证项目在不同的机器上安装一致的依赖  

通常第三方库也有其依赖，并在对应包目录下的package.json中，因此项目依赖整体应该是个树状结构  
在npm v3及之前存在这些问题

- 相同依赖在不同节点上无法共享，这会导致node_modules体积过大
- 嵌套层级过深会导致路径太长(windows不能处理过长的路径)
- 模块实例不能共享(内部单例等变量无法在不同的包中共享)

因此npm v3之后的版本和yarn 将依赖树拍平(将嵌套依赖包提升至顶层便于共享)，安装时会不停的向上层node_modules查找，找到相同的包则不再重复安装，解决了包复用的问题，但扁平化带来了新的问题  

- 扁平化算法复杂度较高，耗时较长
- 项目中可以非法访问没有声明过的依赖包，即可以访问依赖树上2层甚至叶子节点上的包
- 依赖结构不确定性即，B、C都依赖于F，但是不同的版本，对于F的哪个版本提升至顶层共享存在不确定性

yarn.lock和npm v5才出现的package-lock.json的出现保证产生确定的依赖结构。  
仍存在安全性和性能问题  

[npm install模块安装机制](https://juejin.cn/post/6999829253395054623)  

### yarn

yarn为了解决依赖共享等问题，也将依赖树拍平，同时引入了yarn.lock文件解决拍平带来的依赖结构不确定性问题；并且增加并行处理和离线安装模式提升运行速度

### pnpm

pnpm在npm的基础上使用链接(linux下的链接、window下的快捷方式)构成依赖树解决了依赖共享问题。包及依赖包被扁平化到node_modules/.pnpm目录下，当依赖了一个包的不同版本时，仅对变更文件进行更新，不需要重复下载不变的部分  
对于.pnpm目录下包A的依赖也是同样处理，因此利用链接恢复的依赖树并不存在路径过长的问题  
同时因为不需要从扁平化恢复依赖树(向上级node_modules查询)，因此也没有扁平化带来的性能和安全问题  

## npm使用笔记  

[npm官方文档](https://www.npmjs.com/)|[使用命令文档](https://docs.npmjs.com/cli/v8)
下载安装node之后一般都会附带安装npm包管理器  
查看npm版本  
```npm -v```  
查看npm配置信息  
```npm config list```  

### npm设置镜像源  

由于npm官方源<https://registry.npmjs.org/>在海外，没有搭梯子的直接使用npm安装一些依赖包会遇到访问速度慢的问题  
通过设置国内的镜像源加速依赖包的安装  
淘宝源地址：<https://registry.npm.taobao.org>，文档地址：<https://developer.aliyun.com/mirror/NPM?from=tnpm>  
全局配置镜像源`npm config set registry https://registry.npm.taobao.org`  
临时使用镜像源`npm install <包名> --registry=https://registry.npm.taobao.org`  

推荐使用[nrm](https://github.com/Pana/nrm)管理镜像源`npm install -g nrm`  
可自由切换镜像源  

### 常用npm命令  
  
```shell
npm -v # 查看版本
npm config list # 查看npm 配置信息

npm init # 初始化项目，会生成package.json  
  
npm install --save-dev <package-name> # 项目内安装开发环境依赖包  
  
npm install --save <package-name> # 项目内安装生产环境依赖包  
npm install <package-name>@<version>  
npm root -g # 查看npm包全局安装路径  
npx <command> # 用于执行npm安装的提供了二进制可执行文件的包;npx 主要执行的是node_module/.bin/下的命令  
## npx 还可运行执行url中的代码；指定node版本运行；  
npm list [-g] [<package-name>] [--depth -number] # 查看已安装包(含依赖包)的最新版本，指定包名时则仅查看指定包的版本  
npm view <package-name> versions # 查看指定包的所有版本  
npm uninstall [-S/-D/-g] <package-name> # 卸载包，或并从package.json中移除引用  
```  

提供了可执行命令的，且在项目间复用的包应该全局安装，其他则本地安装  
  
## package.json文件中部分配置说明  

main 设置了应用程序的入口点  
private 如果设置为 true，则可以防止应用程序/软件包被意外地发布到 npm  
engines 设置了此软件包/应用程序在哪个版本的 Node.js 上运行  
browserslist 用于告知要支持哪些浏览器（及其版本）  

## package-lock.json  

该文件旨在跟踪被安装的每个软件包的确切版本，以便产品可以以相同的方式被 100％ 复制  
package-lock.json 会固化当前安装的每个软件包的版本，当运行 npm install时，npm 会使用这些确切的版本。仅当使用npm update命令时才会更新  

## pm2基础使用

pm2是一个守护进程管理器，用于管理和保持应用程序在线
启动一个应用程序`pm2 start <script> --<params>`

### 常用命令

```shell
pm2 restart <app-name/id>
pm2 reload <app-name/id>
pm2 stop <app-name/id>
pm2 delete <app-name/id>
pm2 list
```

[官方文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
  
## vscode 使用笔记  

### vscode打开过多页面too many open files问题  

俗称EMFILE，问题出现底层原因不明  
解决方案有：  
1、减少vscode页面  
2、设置系统的文件限制

* 措施a  
编辑文件  
```vim /etc/sysctl.conf```  
增加以下内容  

```vim  
fs.inotify.max_user_watches = 2097152  
fs.inotify.max_user_instances = 2097152  
fs.file-max = 409600  
```  

* 措施b  
查看限制：  
```ulimit -n```  
修改文件： /etc/security/limits.conf  
增加如下内容  

```vim  
soft nofile 10000  
hard nofile 10000  
```  

[参考文档](https://www.imakewebsites.ca/posts/2018/03/06/node.js-too-many-open-files-and-ulimit/)  
  
3、使用root用户打开vscode  
4、打开vscode设置，搜索watch，设置Watcher Exclude选项，排除不需要监听变化的目录  
  
！！！ 该问题还没有摸索出最终解决方案

### 插件

* 代码规范插件
  * sonarLint 规范代码插件
  * ESlint 规范代码插件
* 前端开发推荐的插件
  * Auto Close Tag
  * Auto Rename Tag
  * Bracket Pair Colorizer
  * change-case 快速修改代码风格，小驼峰、大驼峰、蛇形等
  * Code Runner 快速代码运行插件，支持多种语言
  * Code Spell Checker 单词拼写检查
  * Dracula Official 主题皮肤
  * Git Blame 显示代码修改记录，当前行，上次是由谁修改的
  * Git Graph 以gitflow图的形式展示Git提交记录，并提供cherry-pick等图形化管理操作
  * indent-rainbow 彩虹缩进，对不同级别的缩进渲染不同的颜色
  * JavaScript (ES6) code snippets 对js、ts，html，vue代码补全及提示
  * koroFileHeader 文件头部注释，函数注释快速生成
  * Live Server 简易资源服务器，快速提供静态资源服务，可用来调试html
  * Markdown All in One 文档插件，预览markdown文档
  * Node.js Modules Intellisense 只能模块导入插件
  * Partial Diff 快速比较文件或选定文本之间的不同
  * REST Client 请求管理测试工具，可用于测试接口
  * Todo Tree 管理TODO，高亮
  * Vetur 高亮VUE语法
  * Visual Studio IntelliCode 智能代码补全，支持多种语言
  * Vue 3 Snippets 补全，智能提示VUE语法

### 软件配置

```json
{
  "editor.tabSize": 2,
  "editor.renderWhitespace": "all",
  "editor.multiCursorModifier": "ctrlCmd",
  "editor.wordWrap": "wordWrapColumn",
  "editor.rulers": [80, 120],
  "editor.wordWrapColumn":80,
  "editor.minimap.enabled": false,
  "editor.fontSize": 16,
  "editor.suggestSelection": "first",
  "bracket-pair-colorizer-2.depreciation-notice": false,
  "bracketPairColorizer.depreciation-notice": false,
  "workbench.colorTheme": "Dracula Soft",
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "window.openFilesInNewWindow": "on",
  "fileheader.configObj":{
      "supportAutoLanguage":[],
      "autoAdd":false
  },
  "vetur.ignoreProjectWarning": true,
  "liveServer.settings.donotShowInfoMsg": true,
  "extensions.autoCheckUpdates": false,
  "update.mode": "manual",
  "gitlens.blame.ignoreWhitespace": true,
  "gitlens.blame.avatars": false,
  "gitlens.blame.heatmap.enabled": false,
  "markdown.preview.doubleClickToSwitchToEditor": false,
}
```
