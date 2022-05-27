module.exports = {
  title: 'Vito\'s blog',
  description: 'vito的个人网站',
  open:true,
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/img/cat.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false, // 代码块显示行号
    toc: {
      includeLevel: [2, 3]
    }
  },
  themeConfig: {
    nav:[ // 导航栏配置
      {text: 'JavaScript', items:[
        { text:'js基础', link:'/js/jsBase/'},
        { text:'es6+基础', link:'/js/es6+/'},
        { text:'js进阶', link:'/js/jsPlus/'},
        { text:'js手写系列', link:'/js/jsHand/'},
        { text:'typescript', link:'/js/typescript/'},
        { text:'js读书笔记', items:[
          { text:'js异步编程', link:'/js/jsAsync/'},
          { text:'你不知道的js系列', link:'/js/jsDeep/'},
        ]},
      ]},  
      {text: 'Vue', items:[
        { text:'vue2基础', link:'/vue/vue2base/'},
        { text:'vue2进阶', link:'/vue/vue2plus/'},
        { text:'vue3基础', link:'/vue/vue3base/'},
        { text:'vuex', link:'/vue/vuex/'},
        { text:'vue router', link:'/vue/vueRouter/'},
      ]},
      {text: 'html', link: '/html/'},
      {text: 'css', link: '/css/'},
      {text: '浏览器', link: '/browser/'},
      {text: '网络通信', link: '/network/'},
      {text: 'Linux', link: '/linuxNote/'},
      {text: '开发工具', link: '/devToolsNote/'},
      {text: '算法', link: '/algorithm/'},
      {text: 'github主页', link: 'https://github.com/vitotu'}      
    ],
    sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
    lastUpdated: 'Last Updated',
    // nextLinks: true,
    // prevLinks: true
  }
};