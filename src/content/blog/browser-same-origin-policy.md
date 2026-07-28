---
title: '浏览器的同源政策'
description: '从同源含义与限制讲起，梳理 Cookie、片段标识符、postMessage、跨域请求与 CORS 等浏览器安全策略。'
pubDate: 'Aug 17 2021'
updatedDate: 'Feb 28 2022'
---

浏览器从一个域名的网页去请求另一个域名的资源时，域名、端口、协议任一不同，就是跨域。

## 含义
最初，它的含义是指，A 网页设置的 Cookie，B 网页不能打开，除非这两个网页“同源”。所谓“同源”指的是”三个相同“。
1. 协议相同
2. 域名相同
3. 端口相同
## 目的
同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。
## 限制范围
目前，如果非同源，共有三种行为受到限制。
1. 无法读取非同源网页的 Cookie、LocalStorage。
2. 无法接触非同源网页的 DOM。
3. 无法向非同源地址发送请求。
## Cookie
只有同源的网页才能共享。如果两个网页一级域名相同，只是次级域名不同，浏览器允许通过设置document.domain共享 Cookie。

注意，A 和 B 两个网页都需要设置document.domain属性，才能达到同源的目的。因为设置document.domain的同时，会把端口重置为null，因此如果只设置一个网页的document.domain，会导致两个网址的端口不同，还是达不到同源的目的。

服务器也可以在设置 Cookie 的时候，指定 Cookie 的所属域名为一级域名。

## 片段识别符
片段标识符（fragment identifier）指的是，URL 的#号后面的部分，比如http://example.com/x.html#fragment的#fragment。如果只是改变片段标识符，页面不会重新刷新。

父窗口可以把信息，写入子窗口的片段标识符。
同样的，子窗口也可以改变父窗口的片段标识符。

## window.postMessage()

这个 API 为window对象新增了一个window.postMessage方法，允许跨窗口通信，不论这两个窗口是否同源。举例来说，父窗口aaa.com向子窗口bbb.com发消息，调用postMessage方法就可以了。

## 请求
同源政策规定，AJAX 请求只能发给同源的网址，否则就报错。

除了架设服务器代理，有三种方法规避这个限制。

1. JSONP
2. WebSocket
3. CORS

### JSONP
JSONP 是服务器与客户端跨源通信的常用方法。最大特点就是简单适用，老式浏览器全部支持，服务端改造非常小。

它的基本思想是，网页通过添加一个\<script\>元素，向服务器请求 JSON 数据，这种做法不受同源政策限制；服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

首先，网页动态插入\<script\>元素，由它向跨源网址发出请求。
```javascript
function addScriptTag(src) {
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  script.src = src;
  document.body.appendChild(script);
}

window.onload = function () {
  addScriptTag('http://example.com/ip?callback=foo');
}

function foo(data) {
  console.log('Your public IP address is: ' + data.ip);
};
```
上面代码通过动态添加\<script\>元素，向服务器example.com发出请求。注意，该请求的查询字符串有一个callback参数，用来指定回调函数的名字，这对于 JSONP 是必需的。

服务器收到这个请求以后，会将数据放在回调函数的参数位置返回。
```javascript
foo({
  "ip": "8.8.8.8"
});
```
### WebSocket
WebSocket 是一种通信协议，使用ws://（非加密）和wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。
请求头有一个字段是Origin，表示该请求的请求源（origin），即发自哪个域名。
正是因为有了Origin这个字段，所以 WebSocket 才没有实行同源政策。

## CORS
CORS 是跨源资源分享（Cross-Origin Resource Sharing）的缩写。它是 W3C 标准，属于跨源 AJAX 请求的根本解决方法。相比 JSONP 只能发GET请求，CORS 允许任何类型的请求。

实现 CORS 通信的关键是服务器。只要服务器实现了 CORS 接口，就可以跨域通信。

CORS 请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

只要同时满足以下两大条件，就属于简单请求。

（1）请求方法是以下三种方法之一。
1. HEAD
2. GET
3. POST

（2）HTTP 的头信息不超出以下几种字段。
1. Accept
2. Accept-Language
3. Content-Language
4. Last-Event-ID
5. Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

一句话，简单请求就是简单的 HTTP 方法与简单的 HTTP 头信息的结合。

这样划分的原因是，表单在历史上一直可以跨域发出请求。简单请求就是表单请求。

### 简单请求

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个Origin字段。

上面的头信息中，Origin字段用来说明，本次请求来自哪个域（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。

如果Origin指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。

（1）Access-Control-Allow-Origin

该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。

（2）Access-Control-Allow-Credentials

该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。设为true，即表示服务器明确许可，浏览器可以把 Cookie 包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送 Cookie，不发送该字段即可。

（3）Access-Control-Expose-Headers

该字段可选。CORS 请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个服务器返回的基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。

### withCredentials 属性
一方面要服务器同意，指定Access-Control-Allow-Credentials字段。
另一方面，开发者必须在 AJAX 请求中打开withCredentials属性。
```javascript
withCredentials = true
```
否则，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。

需要注意的是，如果要发送 Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名。


### 非简单请求
非简单请求是那种对服务器提出特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。

非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为“预检”请求（preflight）。浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

“预检”请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是Origin，表示请求来自哪个源。

```javascript
Accept: */*
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
Access-Control-Request-Headers: token
Access-Control-Request-Method: GET
Connection: keep-alive
Host: www.xiaotao2333.top:8000
Origin: http://codeshare.diyxi.top
Referer: http://codeshare.diyxi.top/
Sec-Fetch-Mode: cors
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.73
```


除了Origin字段，“预检”请求的头信息包括两个特殊字段。

（1）Access-Control-Request-Method

该字段是必须的，用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法。

（2）Access-Control-Request-Headers

该字段是一个逗号分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字段。

### 预检请求的回应
服务器收到“预检”请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

```javascript
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: token, content-type
Access-Control-Allow-Methods: GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Access-Control-Max-Age: 86400
Allow: GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH
Connection: keep-alive
Content-Length: 0
Date: Tue, 17 Aug 2021 06:19:47 GMT
Keep-Alive: timeout=60
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
```
上面的 HTTP 回应中，关键的是Access-Control-Allow-Origin字段，表示http://xxxxxx可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。
服务器回应的其他 CORS 相关字段如下:

```javascript
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

（1）Access-Control-Allow-Methods

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次“预检”请求。

（2）Access-Control-Allow-Headers

如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在“预检”中请求的字段。

（3）Access-Control-Allow-Credentials

该字段与简单请求时的含义相同。

（4）Access-Control-Max-Age

该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。

### 浏览器的正常请求和回应
一旦服务器通过了“预检”请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个Origin头信息字段。服务器的回应，也都会有一个Access-Control-Allow-Origin头信息字段。
浏览器请求：
```javascript
Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
Connection: keep-alive
Host: www.xiaotao2333.top:8000
Origin: http://codeshare.diyxi.top
Referer: http://codeshare.diyxi.top/
token: undefined
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.73
```

服务器返回：
```javascript
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: token, content-type
Access-Control-Allow-Methods: GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Access-Control-Max-Age: 86400
Connection: keep-alive
Content-Type: application/json
Date: Tue, 17 Aug 2021 06:19:47 GMT
Keep-Alive: timeout=60
Transfer-Encoding: chunked
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
```


### 与 JSONP 的比较
CORS 与 JSONP 的使用目的相同，但是比 JSONP 更强大。JSONP 只支持GET请求，CORS 支持所有类型的 HTTP 请求。JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。
