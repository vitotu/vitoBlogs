module.exports = {
  title: 'Vito\'s blog',
  description: 'vito的个人网站',
  open:true,
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/img/proxima.png' }], // 增加一个自定义的 favicon(网页标签的图标)
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
      {text: 'JavaScript', link: '/js/', },  
      {text: 'Vue', items:[
        { text:'vue2基础', link:'/vue/vue2base/'},
        { text:'vue2进阶', link:'/vue/vue2plus/'},
        { text:'vue3基础', link:'/vue/vue3base/'},
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