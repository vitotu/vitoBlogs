# vite

vite是vue团队基于rollup开发的新一代前端构建工具，依托ESM原生模块优化了HMR，相对于webpack构建与更新速度有了极大的提升  

vite启动时不需要对业务代码进行打包，启动速度非常快，当浏览器请求某模块时，按需对模块内容动态编译，同时vite利用http头加速整个页面的重新加载  
同时vite使用Esbuild预构建第三方依赖  

## 与webpack 相比

webpack是js应用程序的静态模块打包器，通过递归构建依赖关系图，然后将模块打包成一个或多个包  
整个运行流程是串行的过程，读取所有模块、打包、运行依次执行  

vite启动时不需要打包，也就不需要分析模块的依赖，因此按需动态编译，启动速度非常快

- 构建工具

构建工具包括：预编译、语法检查、词法检查、依赖处理、文件合并、文件压缩、单元测试、版本管理等

代码转换：将TypeScript编译成JavaScript、将SCSS编译成CSS等。
文件优化：压缩JavaScript、CSS、HTML代码，压缩合并图片等。
代码分割：提取多个页面的公共代码，提取首屏不需要执行部分的代码让其异步加载。
模块合并：在采用模块化的项目里会有很多个模块和文件，需要通过构建功能将模块分类合并成一个文件。
自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
自动发布：更新代码后，自动构建出线上发布代码并传输给发布系统。

常见构建工具：
webpack：一站式构建工具，一切文件都是模块，通过loader转换文件、plugin注入钩子
babel：工具链，将ECMA2015+的版本转换向后兼容的js语法，以便兼容老旧浏览器
rollup:与webpack类似，但专注于ES6的模块打包工具
parcel：极速零配置web应用打包工具，使用worker多进程启用多核编译
另外还有gulp、browserify、grunt等

- 打包工具

打包工具更关注打包过程：依赖管理和版本管理等

## ESM

ESM是ES Module的缩写，与CommonJS、AMD等都是模块化规范  
ESM规范指令仅有`import`, `export`, `export default`三个  
导入可以仅加载指定的方法，其他方法不加载，也称为编译时加载或静态加载，便于Tree Shaking  
script标签引入ESM时，设置type=module标识为顶级模块  
ES6模块自动采用严格模式：

::: warning
变量必须声明后再使用  
函数的参数不能有同名属性，否则报错  
不能使用with语句  
不能对只读属性赋值，否则报错  
不能使用前缀 0 表示八进制数，否则报错  
不能删除不可删除的属性，否则报错  
不能删除变量delete prop，会报错，只能删除属性delete global[prop]  
eval不会在它的外层作用域引入变量  
eval和arguments不能被重新赋值  
arguments不会自动反映函数参数的变化  
不能使用arguments.callee  
不能使用arguments.caller  
禁止this指向全局对象  
不能使用fn.caller和fn.arguments获取函数调用的堆栈  
增加了保留字（比如protected、static和interface）  
:::

ESM使用实时绑定的方式，导出和导入的模块都指向相同的内存地址(对值的引用)  

ESM的模块解析发生在编译阶段有人称为编译时输出接口  
JS引擎在对脚本静态分析时，遇到模块加载命令import会生成一个只读引用，等脚本真正执行时，再跟根据引用到被加载的模块中取值；  

## 预构建

为了兼容CommonJS、UMD，以及提升性能，首次执行vite时，服务会对node_modules模块和配置optimizeDeps的目标进行预构建  
这个过程将CommonJS和UMD等发布的依赖项转换为ESM；将有多个内部模块的ESM依赖关系转换为单模块，以提升后续页面的加载性能  
vite对依赖进行扫描，对于裸依赖进行预构建(通过路径去访问的模块不是裸依赖)，此举是为了找到通过npm安装的第三方模块使用esbuild进行预构建，并将编译后的文件存储的node_modules/.vite目录中缓存  

## 环境变量

同webpack一样，vite可以预定义不同的环境变量来针对不同的环境使用不同的配置打包  
在vite.config.ts文件中env的获取需要通过loadEnv函数  
loadEnv 接收三个参数:  
 mode：模式  
 envDir：环境变量配置文件所在目录  
 prefix：接受的环境变量前缀，默认为 VITE_  
在vite中默认是VITE_，为 ''，则加载所有环境变量  

```js
// vite.config.ts文件中
import { defineConfig, loadEnv } from 'vite';
export default defineConfig(ctx=>{
  const env = loadEnv(ctx.mode, process.cwd(), '');
  // ctx.mode : 取值为vite运行时传入的参数，如运行vite build --mode dev 则mode = dev
  // ctx.command: 取值为 serve, build等
  // process.cwd() 用于获取命令运行当前路径，.env.XXX环境变量文件也通常放在这个路径下
  // .env.XXX 的XXX后缀部分命名需要与vite运行命令保持一致
})
```

在其他文件中，通过import.meta.env也能读取到环境变量
TODO:进一步扩展

## CSS相关部分处理

### CSS模块化

css modules不是官方标准也不是浏览器特性，而是构建工具对css类名和选择器的作用域进行限定的一种方式  
它是通过编译的方式修改选择器名字为全局唯一的方式来实现 css 的样式隔离。  
vite通过`.block__element–modifier`的命名规范来实现样式隔离  
另外与之对应的vue-loader使用scoped的选项，对css选择器和元素添加data-xxx属性实现样式隔离  

### postCSS

postCSS主要用于CSS工程化，支持：自动添加浏览器前缀、代码合并、代码压缩等  
vite已经集成PostCSS无需在此安装, 其配置文件可单独配置postcss.config.js，也可在vite.config.js中进行  

### css预处理器

vite内置支持.scss, .sass, .less, .styl, .stylus的文件支持，不需要额外的插件，但必须安装对应的预处理器依赖  
sass, less, stylus

## 文件处理

vite支持import.meta.glob, import.meta.globEager  

若只想获取资源url，而不想导入脚本可在导入后方添加`?url`后缀:`import jsUrl from './assets/a.js?url'`  
import导入图片会转换为一个路径， 添加`?raw`则表示以二进制方式读取

## 插件

vite插件类似于webpack的loader+plugin,用于扩展vite的功能，如文件图片压缩，commonjs支持，打包进度条等  
vite插件基于Rollup插件接口扩展  
浏览器发起请求后dev server通过中间件对请求拦截，然后对源文件所resolve, load, transform等操作，将转换后的内容发送给浏览器  

范例：

```js
export default function () {
  return {
    // 显示在 warning 和 error 中，用于警告和错误展示
    name: 'hooks-order',
    // 初始化hooks，只走一次。服务器启动时被调用
    options(opts) {
      console.log('options');
    },
    // 启动时调用一次
    // vite （本地）服务启动时调用，在这个函数中可以访问 rollup 的配置
    buildStart() {
      console.log('buildStart');
    },
    // vite特有钩子，在解析 Vite 配置前调用。
    // 接收原始用户配置（命令行选项指定的会与配置文件合并）
    // 和一个描述配置环境的变量
    config(userConfig, env) {
      console.log('userConfig');
      return {}
    },
    // Vite配置确认，在解析 Vite 配置后调用
    configResolved(resolvedCofnig) {
      console.log('configResolved');
    },
    // 用于配置dev server，可以进行中间件操作
    configureServer(server) {
      console.log('configureServer');
      // server.app.use((req, res, next) => {
      // // custom handle request...
      // })
    },
    // 用于转换宿主页，接收当前的 HTML 字符串和转换上下文
    transformIndexHtml(html) {
      console.log('transformIndexHtml');
      return html
      // return html.replace(
      // /<title>(.*?)</title>/,
      // `<title>Title replaced!</title>`
      // )
    },
    // 通用钩子，创建自定义确认函数
    resolveId(source) { // 此处查找文件，输出本地实际路径
      // console.log(resolveId)
      if (source === 'virtual-module') {
        console.log('resolvedId');
        return source;
      }
      return null;
    },
    // 创建自定义加载函数，可用于返回自定义的内容，每个传入模块请求时被调用
    load(id) { // 加载文件到内存中，输出文件模块的代码字符串
      console.log('load');
      if (id === 'virtual-module') {
        return 'export default "This is virtual!"';
      }
      return null;
    },
    // 可用于转换已加载的模块内容（转变源码为需要的代码），类似于webpack的loader
    transform(code, id) {
      console.log('transform');
      if (id === 'virtual-module') {
      }
      return code
    }
  }
}
```

load和transform都能修改内容，load主要是处理文件，transform主要是转换模块  

### 虚拟模块

虚拟模块是 Vite 沿用 Rollup 的虚拟模块，虚拟模块类似 alias 别名，  
但是模块的内容并非直接从磁盘中读取，而是编译时生成。  
虚拟模块使你可以对使用 ESM 语法的源文件传入一些编译时信息。  
