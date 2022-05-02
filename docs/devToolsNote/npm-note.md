# npm使用笔记  
！使用ubuntu的同学安装node的时可能会使用apt-get安装node，此时要注意安装的node和npm的版本，若版本过低(如npm -v：3.5.2)请卸载后去官网下载安装包解压后使用软连接添加变量的方式安装  
下载安装node之后一般都会附带安装npm包管理器  
查看npm版本  
```npm -v```  
查看npm配置信息  
```npm config list```  
## npm设置镜像源  
  
推荐使用nrm管理镜像源`npm install -g nrm`  
  
由于npm官方源在海外，没有搭梯子的直接使用npm安装一些依赖包会遇到访问速度慢的问题  
* 官方源备份：https://registry.npmjs.org/  
通过设置国内的镜像源加速依赖包的安装  
目前发现国内仅有淘宝源  
官网地址https://developer.aliyun.com/mirror/NPM?from=tnpm  
推荐使用全局配置的方式添加国内镜像源，使用cnpm可能遇到的麻烦有：cnpm安装第三方包后不会更新package.json也不会生成package-lock.json可能存在相关风险  
根据官方介绍安装的cnpm带有gzip压缩  
```npm install -g cnpm --registry=https://registry.npm.taobao.org```  
而后使用cnpm代替npm命令;可能需要设置环境变量  
淘宝源：  
+ https://registry.npm.taobao.org  
  
设置方法：  
+ 全局配置  
```npm config set registry https://registry.npm.taobao.org```  
+ 临时使用  
```npm install <包名> --registry=https://registry.npm.taobao.org```  
  
## 常见npm命令  
  
```shell  
npm init # 初始化项目，会生成package.json  
  
npm install --save-dev <package-name> # 项目内安装开发环境依赖包  
  
npm install --save <package-name> # 项目内安装生产环境依赖包  
npm install <package-name>@<version>  
npm root -g # 查看npm包全局安装路径  
npx <command> # 用于执行npm安装的提供了二进制可执行文件的包;npx 主要执行的是node_module/.bin/下的命令  
# npx 还可运行执行url中的代码；指定node版本运行；  
npm list [-g] [<package-name>] [--depth -number] # 查看已安装包(含依赖包)的最新版本，指定包名时则仅查看指定包的版本  
npm view <package-name> versions # 查看指定包的所有版本  
npm uninstall [-S/-D/-g] <package-name> # 卸载包，或并从package.json中移除引用  
```  
提供了可执行命令的，且在项目间复用的包应该全局安装，其他则本地安装  
  
  
  
# package.json文件中部分配置说明  
main 设置了应用程序的入口点  
private 如果设置为 true，则可以防止应用程序/软件包被意外地发布到 npm  
engines 设置了此软件包/应用程序在哪个版本的 Node.js 上运行  
browserslist 用于告知要支持哪些浏览器（及其版本）  
  
版本命名中x.y.z：x是大版本，更新可能会导致API不兼容；y次版本，以兼容的方式添加新功能；z补丁版本  
依赖版本控制中：^大版本锁定,~锁定至次版本，其他符号(>,>=,<,<=,||,-)则对应其符号表意  
  
  
# package-lock.json  
该文件旨在跟踪被安装的每个软件包的确切版本，以便产品可以以相同的方式被 100％ 复制  
package-lock.json 会固化当前安装的每个软件包的版本，当运行 npm install时，npm 会使用这些确切的版本。仅当使用npm update命令时才会更新  
  
# vscode 使用笔记  
## vscode打开过多页面too many open files问题  
俗称EMFILE，问题出现底层原因不明  
解决方案有：  
1、减少vscode页面  
2、设置系统的文件限制   
+ 措施a  
编辑文件  
```vim /etc/sysctl.conf```  
增加以下内容  
```vim  
fs.inotify.max_user_watches = 2097152  
fs.inotify.max_user_instances = 2097152  
fs.file-max = 409600  
```  
+ 措施b  
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


## 插件
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
## 软件配置
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