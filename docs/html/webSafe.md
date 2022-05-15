# 前端相关的网络安全

## XSS和CSRF攻击

## 点击劫持

向目标网站通过iframe嵌入并隐藏到自己网页中，用户在操作网页时实际点击的是iframe，实现目标网站的点击劫持

- 防范：
  - 在http报文头中添加X-FRAME-OPTIONS属性控制页面是否可被嵌入iframe中，DENY, SAMEORIGIN, ALLOW-FROM URL
  - 通过js判断当前网页是否被嵌套

## CDN劫持

Content Delivery Network内容分发网络，在距离用户更近的位置架设缓存服务器，利用全局负载技术，将用户的访问指向距离最近的缓存服务器上。  
黑客通过cdn劫持方法让用户转到自己开发的网站  

- 防范：

验证SRI(子资源完整性)，来判断是否被篡改安全特性。通过link、或script标签添加integrity属性开启SRI功能，如：  
`<script integrity="[哈希生成算法:sha-256等]-[base64编码的实际哈希值]">`  
浏览器在遇到该属性后会计算文件哈希值，并与实际哈希对比，若不符合，则会拒绝应用或执行，并返回一个网络错误
