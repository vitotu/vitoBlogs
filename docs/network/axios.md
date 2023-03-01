# 网络请求api与axios

原生网络请求有xhr, fetch api；  
另外严格来讲通过jsonp等方式借助`<script>`或`<img>`等标签也能发起简单的请求  

## XHR

XMLHttpRequest是浏览器支持的原生发起请求的api之一，简单示例：

```js
const xhr = new XMLHttpRequest(),
  method = "GET",
  url = "https://developer.mozilla.org/";
xhr.open(method, url, true);
xhr.send();
xhr.abort(); // 取消发送请求
```

## fetch

`fetch(url, {signal}).then(res => {}).catch(e => {})`  
想要取消fetch可使用AbortController api  
参考[如何取消请求发送](https://q.shanyue.tech/fe/html/502.html)  

## axios

在浏览器端基于xhr开发
