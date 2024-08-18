import { defineUserConfig } from 'vuepress';
import { searchPlugin } from '@vuepress/plugin-search';
import { defaultTheme } from '@vuepress/theme-default';
import { viteBundler } from '@vuepress/bundler-vite'
import envConfig from '../../envConfig.js';

export default defineUserConfig({
  title: 'Vito\'s blog',
  description: 'vito的个人网站',
  open:true,
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: envConfig.base + 'img/cat.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: envConfig.base, // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false, // 代码块显示行号
    toc: {
      includeLevel: [2, 3]
    }
  },
  theme: defaultTheme({
    navbar:[ // 导航栏配置
      {text: 'JavaScript', children:[
        { text:'js基础', link:'/js/jsBase'},
        { text:'es6+基础', link:'/js/es6+/'},
        { text:'js进阶', link:'/js/jsPlus'},
        { text:'js手写系列', link:'/js/jsHand'},
        { text:'typescript', link:'/js/typescript/'},
        { text:'js读书笔记', children:[
          { text:'js异步编程', link:'/js/jsAsync/'},
          { text:'你不知道的js系列', link:'/js/jsDeep/'},
        ]},
      ]},  
      {text: 'Vue', children:[
        { text:'vue2基础', link:'/vue/vue2base'},
        { text:'vue2进阶', link:'/vue/vue2plus/'},
        { text:'vue3基础', link:'/vue/vue3base/'},
        { text:'vuex', link:'/vue/vuex/'},
        { text:'vue router', link:'/vue/vueRouter/'},
        { text:'pinia', link:'/vue/Pinia'},
      ]},
      {text: 'html', link: '/html/'},
      {text: 'css', children:[
        { text:'图解css3', link: '/css/css3/'},
        { text:'css进阶', link: '/css/css3plus/'},
        { text:'scss', link: '/css/scss/'},
      ]},
      // {text: 'hybridApp', children:[
      //   {text:'概述', link:'/hybrid-app/abstract'},
      //   {text:'微信小程序基础', link:'/hybrid-app/wechat-miniAppBase'},
      // ]},
      {text: '浏览器', link: '/browser/browser'},
      {text: '网络通信', link: '/network/webNetwork'},
      {text: 'Linux', children:[
        {text:'git使用笔记', link:'/linuxNote/gitUseNote'},
        {text:'linux使用记录', link:'/linuxNote/UbuntuUsingNode'},
        // {text:'dev', link:'/linuxNote/index'},
      ]},
      {text: '开发构建工具', children:[
        { text:'npm', link:'/devToolsNote/npm-note'},
        { text:'webpack基础', link:'/webpack/webpackNote'},
        { text:'webpack5', link:'/webpack/webpack5Note'},
        { text:'qiankun', link:'/micro-app/qiankun'},
      ]},
      {text: '算法', children:[
        { text:'排序算法', link:'/algorithm/tsClassicTop10SortAlgorithm'},
        { text:'剑指offer', link:'/algorithm/tsSword4Offer'},
        { text:'常见算法', link:'/algorithm/common'},
        { text:'排序算法python', link:'/algorithm/10sortedAlgorithm'},
        { text:'剑指offer-python', link:'/algorithm/python_sword_for_offer'},
        { text:'labuladong算法', link:'/algorithm/labuladongNote'},
      ]},
      {text: 'github主页', link: 'https://github.com/vitotu'}      
    ],
    sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
    lastUpdated: 'Last Updated',
    // nextLinks: true,
    // prevLinks: true
  }),
  plugins:[
    searchPlugin({

    }),
  ],
  bundler: viteBundler(),
});