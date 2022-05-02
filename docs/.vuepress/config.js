module.exports = {
  title: 'Vito\'s blog',
  description: 'vito的个人网站',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/public/proxima.png' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    nav:[ // 导航栏配置
      {text: 'js', link: '/js/' },  
      {text: 'vue', link: '/vue/'},
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
  },
  chainWebpack: (config) => {
    config.module
        .rule('url-loader')
        .test(/\.(webp)(\?.*)?$/)
        .use('url-loader')
        .loader('url-loader')
        .end()
  }
};