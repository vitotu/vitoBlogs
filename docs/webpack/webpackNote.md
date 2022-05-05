
# 概述webpack
webpack是基于nodejs平台的，前端资源构建工具，同类工具还有vite、rollup、parcel等
## 5个核心概念
* entry 打包入口起点
* output 打包后资源输出配置
* loader(module) 处理非js、json文件
* plugins 扩展webpack功能，如处理环境变量打包优化、压缩等
* mode 指示webpack使用相应模式的配置，取值为development、production
---
基本工作流程：
- 加载配置文件
- 根据文件中entry解析所依赖的所有module
- 对每个module使用loader中的规则，将module转换为webpack能处理的资源
- 并生成chunk文件输出，整个过程中plugin会利用hook函数在适当的时机运行

# 基本配置
使用webpack打包的项目，通常有webpack.config.js配置文件，以下以代码及注释的方式展示基本配置：  
```js
/*
  webpack.config.js  webpack的配置文件，语法为nodejs的commonjs风格
*/

const { resolve } = require('path'); // resolve用来拼接绝对路径的方法
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

process.env.NODE_ENV = 'production'; // 定义nodejs环境变量：决定使用browserslist的哪个环境

const commonCssLoader = [ // 以常量的形式提取公共loader配置进行复用
  'style-loader', // 创建style标签，将js中的样式资源插入进行，添加到head中生效
  // MiniCssExtractPlugin.loader, // 该插件的loader取代style-loader，提取css文件单独打包
  'css-loader', // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
  { // css兼容性处理,根据package.json中browserslist配置进行兼容
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-preset-env')() // postcss的预设环境插件
      ]
    }
  },
];
module.exports = {
  // 多入口配置，支持String、Array、Object，其中只有Object会输出多个chunk，Object的value也可以取String、Array
  entry: './src/index.js',
  output: {  // 输出
    filename: 'built.js', // 输出文件名
    // 输出路径; __dirname是nodejs的环境变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build'),
    publicPath: '/', // html中src的公共路径前缀
    chunkFilename: 'js/[name]_chunk.js', // 非入口chunk的名称
    // library: '[name]', // 整个库向外暴露的变量名
    // libraryTarget: 'window/global/commonjs' // 变量挂载目标 可通过[libraryTarget].[library]访问
  },
  module: { // loader的配置
    rules: [
      // 详细loader配置,不同文件必须配置不同loader处理
      {
        test: /\.css$/,  // 匹配哪些文件
        use: [ // 数组中指定用于处理test匹配到文件的loader，多个loader从后向前执行
          ...commonCssLoader
        ]
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader, 'less-loader' // 将less文件编译成css文件,需要下载 less-loader和less
        ]
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        // 使用一个loader
        // 下载 url-loader file-loader
        loader: 'url-loader',
        options: {
          limit: 8 * 1024, // 图片小于该值将会被base64编码为dataurl
          esModule: false, // 关闭url-loader默认的es6模块化，使用commonjs与其他loader保持一致
          name: '[hash:10].[ext]', // 输出图片资源名,[hash:10]取图片的hash的前10位,[ext]取文件原来扩展名
          outputPath: 'imgs' // 以build下的子目录
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      },
      { // 其他资源打包
        exclude: /\.(css|js|html|less)$/, // 排除css/js/html资源
        loader: 'file-loader',
      },
      { // js语法检查loader，在package.json中eslintConfig中设置检查规则
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre', // 当js被多个loader执行时，此loader优先执行;取post则延后执行
        options: {
          fix: true // 自动修复eslint的错误
        }
      },
      { // js兼容性处理，对不支持es6的浏览器兼容
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env', // 预设环境不能转换es6的api，如Promise,
              // 还可取@babel/polyfill,引入全部兼容性，core-js按需处理兼容性
              {
                useBuiltIns: 'usage', // 按需加载
                corejs: {
                  version: 3 // 指定core-js版本
                },
                targets: { // 指定兼容性做到哪个版本浏览器
                  chrome: '60',
                  firefox: '60',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ],
          cacheDirectory: true // 开启babel缓存，第二次构建时会读取之前的缓存
        }
      }
    ]
  },
  plugins: [  // plugins的配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
    // 需求：需要有结构的HTML文件
    new HtmlWebpackPlugin({
      template: './src/index.html', // 指定html模板
      minify: { // 压缩html代码
        collapseWhitespace: true, // 移除空格
        removeComments: true // 移除注释
      }
    }),
    new MiniCssExtractPlugin({ // 用于将css与js代码分离单独打包，配合其loader使用
      filename: 'css/built.css' // 对输出的css文件进行重命名
    }),
    new OptimizeCssAssetsWebpackPlugin() // css压缩插件
  ],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production',  // 生产环境，会自动启用js压缩

  // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    contentBase: resolve(__dirname, 'build'), // 项目构建后路径
    compress: true,  // 启动gzip压缩
    port: 3000,  // 端口号
    open: true, // 自动打开浏览器
  }
}
```

# 优化配置
## HMR
HMR 热模块替换，只打包发生变化的模块，提升开发时的构建速度
```js
module.exports = {
  entry:['./src/js/index.js', './src/index.html'], // 多入口配置
  // 省略其他基本配置
  devServer:{ // 省略devServer其他配置
    // style-loader内部实现了对HMR的支持，js文件需要修改代码才能对HMR支持，html默认不支持HMR
    hot: true // 开启HMR功能
  }
}


/**********************js代码HMR支持示例***************************/
import print from './print';
if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./print.js', function() {
    // 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
    // 会执行后面的回调函数
    print();
  });
}
```
## source-map
source-map: 源代码到构建后代码映射（如果构建后代码出错了，通过映射可以追踪源代码错误） 
```js
module.exports = { // 省略其他配置
  devtool: 'eval-source-map'
}
``` 
取值可以为`[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`

* source-map：外部;  错误代码准确信息和源代码的错误位置
* inline-source-map：内联;  只生成一个内联source-map;  错误代码准确信息和源代码的错误位置
* hidden-source-map：外部;  错误代码错误原因，但是没有错误位置;  不能追踪源代码错误，只能提示到构建后代码的错误位置
* eval-source-map：内联;  每一个文件都生成对应的source-map，都在eval;   错误代码准确信息和源代码的错误位置
* nosources-source-map：外部;  错误代码准确信息, 但是没有任何源代码信息;
* cheap-source-map：外部;  错误代码准确信息和源代码的错误位置; 只能精确的行
* cheap-module-source-map：外部;  错误代码准确信息和源代码的错误位置;  module会将loader的source map加入

内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

开发环境：需要速度快，调试更友好
  * 速度快(eval>inline>cheap>...)
    eval-cheap-souce-map;eval-source-map
  * 调试更友好  
    souce-map;cheap-module-souce-map;cheap-souce-map  
  * 推荐使用 eval-source-map  / eval-cheap-module-souce-map

生产环境：需要考虑源代码隐藏 调试友好
  * 内联会让代码体积变大，所以在生产环境不用内联
  * nosources-source-map 全部隐藏
  * hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
  * 推荐使用source-map / cheap-module-souce-map

## oneof
```js
module.exports = {
  module:{
    rules:[
      {test:/\.js$/, loader: 'eslint-loader'},
      { oneof:[ // oneof修饰的rules对每个文件仅引用一个规则，
      // 即css文件匹配到css规则后不会取判断是否为js文件
          {test:/\.css$/,use:[...commonCssLoader]},
          {test:/\.js$/}
        ]
      }
    ]
  }
}
```
## 缓存
* babel缓存，二次构建时读取缓存可提高构建速度
* 文件资源缓存，通过文件资源hash命名进行缓存
  * `[hash:位数]`: webpack每次构建时都会生成一个hash，重新打包会导致所有的缓存失效
  * `[chunkhash:位数]`: 根据chunk生成hash值，打包来源于同一个chunk时hash值就一样
  * `[contenthash:位数]`(推荐使用)：根据文件内容生成hash，每个文件的hash值不同，可以更好的利用缓存机制

## tree shaking
tree shaking 用于去除不会被使用的代码，减小代码体积；在配置`mode:production`并且js代码使用es6模块化即可启用tree shaking  

tree shaking可能会把css,@babel/polyfill文件删掉,可在package.json中配置`"sideEffects": false`或`"sideEffects": ["*.css", "*.less"]`

tree shaking无法应用于多层嵌套中三级及以上的模块

## code split
```js
module.exports = { // 省略了其他配置
  entry: {
    // 多入口：有n个入口，对应输出n个bundle
    index: './src/js/index.js',
    test: './src/js/test.js'
  },
  output: {
    filename: 'js/[name].[contenthash:10].js', // [name]：取文件名
    path: resolve(__dirname, 'build')
  },
    /* optimization
    1. 可以将node_modules中代码单独打包一个chunk最终输出
    2. 自动分析多入口chunk中公共的文件，打包成单独一个chunk
  */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
}
```
* 代码拆分还可在代码中使用es6的`import(/* webpackChunkName: '单独打包的包名',webpackPrefetch: true */).then()`方式懒加载进行拆分,被这种方式引入的模块会被单独打包
* 预加载 webpackPrefetch: 等其他资源加载完毕，浏览器空闲时加载资源

## PWA
PWA: 渐进式网络开发应用程序(离线可访问),依赖于workbox,和服务端(未做深入了解，后续补充)
```js
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
module.exports = {
  new WorkboxWebpackPlugin.GenerateSW({
    /*
      1. 帮助serviceworker快速启动
      2. 删除旧的 serviceworker
      生成一个 serviceworker 配置文件~
    */
    clientsClaim: true,
    skipWaiting: true
  })
}

/********************入口js文件中**********************/
/*
  1. eslint不认识 window、navigator全局变量
    解决：需要修改package.json中eslintConfig配置
      "env": {
        "browser": true // 支持浏览器端全局变量
      }
   2. sw代码必须运行在服务器上
      --> nodejs
      -->
        npm i serve -g
        serve -s build 启动服务器，将build目录下所有资源作为静态资源暴露出去
*/
// 注册serviceWorker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('sw注册成功了~');
      })
      .catch(() => {
        console.log('sw注册失败了~');
      });
  });
}
```

## externals
externals配置用于排除要打包的库
```js
module.exports = {
  externals: {
    /*
      拒绝jQuery被打包进来,开发者需自己引入该库
      目标环境为浏览器情况下，代码中对jQuery的引用将被替换为window.jQuery
    */
    jquery: 'root jQuery'
  }
}
```

## dll
顾名思义动态链接库Dynamic-link library，用于单独打包某些库,而第二次构建时就不用再次对这部分进行打包，提升构建速度  
ps: 此技术趋于过时
```js
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
module.exports = {
  plugins: [
    // 告诉webpack哪些库不参与打包，使用时的名称保存在manifest.json文件中
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ]
}

/********另外该项目还需要webpack.dll.js配置文件********/
/*
  使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
    当你运行 webpack 时，默认查找 webpack.config.js 配置文件
    先运行 webpack --config webpack.dll.js
*/

const { resolve } = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    // 最终打包生成的[name] --> jquery
    // ['jquery'] --> 要打包的库是jquery
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' // 打包库向外暴露出的对象名
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和jquery映射
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的暴露的内容名称
      path: resolve(__dirname, 'dll/manifest.json') // 输出文件路径
    })
  ],
  mode: 'production'
};

```

## resolve解析配置
```js
module.exports = {
 // 解析模块的规则
  resolve: {
    alias: { // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
      $css: resolve(__dirname, 'src/css')
    },
    // 配置省略文件路径的后缀名,从前到后查找文件名对应的扩展名
    extensions: ['.js', '.json', '.jsx', '.css'],
    // 配置node_modules目录路径，若不配置，默认从当前层，层层向外查找
    modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
  }
}
```

## devServer
```js
module.exports = {
  devServer: {
    
    contentBase: resolve(__dirname, 'build'), // 运行代码的目录
    
    watchContentBase: true, // 监视 contentBase 目录下的所有文件，文件变化就 reload
    watchOptions: {
      ignored: /node_modules/ // 忽略文件
    },
    compress: true, // 启动gzip压缩
    port: 5000, // 端口号
    host: 'localhost', // 域名
    open: true, // 自动打开浏览器
    hot: true, // 开启HMR功能
    clientLogLevel: 'none', // 不要显示启动服务器日志信息
    quiet: true, // 除了一些基本启动信息以外，其他内容都不要显示
    overlay: false, // 如果出错了，不要全屏提示~
    proxy: { // 服务器代理 --> 可解决开发环境跨域问题
      // 一旦devServer(5000)服务器接受到 /api/xxx 的请求，就会把请求转发到另外一个服务器(3000)
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/api': '' // 发送请求时，请求路径重写：将 /api/xxx --> /xxx （去掉/api）
        }
      }
    }
  }
}
```

## optimization配置
```js
// 代码压缩插件uglify已停止维护，使用terser代替
const TerserWebpackPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all' // 默认值，可以不写~
      /* minSize: 30 * 1024, // 分割的chunk最小为30kb
      maxSize: 0, // 最大没有限制
      minChunks: 1, // 要提取的chunk最少被引用1次
      maxAsyncRequests: 5, // 按需加载时并行加载的文件的最大数量
      maxInitialRequests: 3, // 入口js文件最大并行请求数量
      automaticNameDelimiter: '~', // 名称连接符
      name: true, // 可以使用命名规则
      cacheGroups: {
        // 分割chunk的组
        // node_modules文件会被打包到 vendors 组的chunk中。--> vendors~xxx.js
        // 满足上面的公共规则，如：大小超过30kb，至少被引用一次。
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10 // 优先级
        },
        default: {
          minChunks: 2, // 要提取的chunk最少被引用2次
          priority: -20, // 优先级
          // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
          reuseExistingChunk: true
        } 
      }*/
    },
    // 将当前模块的记录其他模块的hash引用(引入文件名等)单独打包为一个文件 runtime
    // 解决：修改a文件导致b文件的contenthash变化
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    },
    minimizer: [
      new TerserWebpackPlugin({ // 配置生产环境的压缩方案：js和css
        cache: true, // 开启缓存
        parallel: true, // 开启多进程打包
        sourceMap: true // 启动source-map
      })
    ]
  }
}
```

# webpack5
[参看](./webpack5Note.md)