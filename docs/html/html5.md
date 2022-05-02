# src和href属性的区别  
部分引用资源的标签中会有src或href属性  
href是Hypertext Reference的简写，表示超文本引用，指向网络资源所在位置，用于在当前文档和引用资源之间确立联系，    
当浏览器遇到href会并行下载资源并且不会停止对当前文档的处理。(同时也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式)  
  
src是source的简写，目的是要把文件下载到html页面中去，用于替换当前内容，    
当浏览器解析到src ，会暂停其他资源的下载和处理，直到将该资源加载或执行完毕。(这也是script标签为什么放在底部而不是头部的原因)

# script标签的async和defer的区别
- 相同点: 异步加载 (fetch)
- 不同点:
  - async 加载(fetch)完成后立即执行 (execution)，因此可能会阻塞 DOM 解析；
  - defer 加载(fetch)完成后延迟到 DOM 解析完成后才会执行(execution)**，但会在事件 DomContentLoaded 之前

`<script type="module">`将自动启用严格模式  
![asyncdefer.svg](../resource/asyncdefer.svg)  
[参考文档](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element)


# 图片懒加载的实现方式
- 位置计算 + 滚动事件 (Scroll) + DataSet API
  - window.scroll监听滚动事件
  - 比较元素clientTop，offsetTop，clientHeight 以及 scrollTop等高度判断是否出现在视口中
  - `< img data-src="template.jpg"/>`,加载时使用img.src = img.dataset.src即可实现
- getBoundingClientRect API + Scroll with Throttle + DataSet API实现
  - Element.getBoundingClientRect()返回元素大小及相对视口的位置
  - 基于上面的方案使用`img.getBoundingClientRect().top < document.documentElement.clientHeight;`进行判断，给window.scroll加上节流即可
- IntersectionObserver API + DataSet API实现
```js
// intersectionObserver API 能够监听元素是否达到视口
const observer = new IntersectionObserver((changes) => {
  // changes: 目标元素集合
  changes.forEach((change) => {
    // intersectionRatio
    if (change.isIntersecting) { // entry.isIntersecting表示元素是否可见
      const img = change.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
observer.observe(img);
```
- 标签的loading="lazy"属性

# xss和csrf攻击
举例：在论坛或评论中输入恶意脚本`<script>恶意脚本</script>`,攻击其他查看该网页的用户就是xss。获取用户token等登录信息，伪造请求破坏用户数据即为csrf

# data-url的优缺点
data-url使用字符串的形式表示数据格式如下`data:[<mediatype>][;base64],<data>`  
在html中用data-url表示图片等体积较小的资源时有如下优缺点：  
优点：
- 混合在html内容中可以减少一次http请求
- 当图片时由服务端动态生成、针对每个用户都不同时，可以使用data url

缺点：
- base64编码的数据体积通常是原数据体积的4/3，增加了资源大小
- data url表示的资源不能单独被缓存
- data url图片在渲染时需要等多的计算资源

[参考文档](https://www.cnblogs.com/tianma3798/p/13582105.html)