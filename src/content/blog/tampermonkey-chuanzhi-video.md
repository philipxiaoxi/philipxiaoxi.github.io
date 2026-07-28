---
title: '使用油猴脚本看传智高校视频'
description: '从 F12 抓包分析进度上报接口，到用油猴脚本批量更新观看进度的一次前端逆向小记。'
pubDate: 'Jun 12 2021'
updatedDate: 'Jul 10 2021'
---

## 今天是网课的第一天
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200228193246535.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzM1Mzg5Ng==,size_16,color_FFFFFF,t_70)

闲来无趣，按下F12来看看。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200228193626305.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzM1Mzg5Ng==,size_16,color_FFFFFF,t_70)
找到了一个请求，地址是http://stu.ityxb.com/back/bxg/preview/info！发现了新大陆！里面包含了章节，以及视频的详细信息。有了这些信息可以干什么呢？别急，我们先慢慢看，这个网站还请求了什么。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200228194125149.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzM1Mzg5Ng==,size_16,color_FFFFFF,t_70)
嘿嘿，看到这个updateProgress，上传进度，先看看上传了什么数据，哦豁，有previewId，pointId，watchedDuration。

那么我们可以肯定的是，这个肯定是上传进度的请求。

那我们伪造一下请求，修改watchedDuration的值为9999999，看看是不是能够有效果。

以下是JQ请求的示例
```javascript
$.post("http://stu.ityxb.com/back/bxg/preview/updateProgress",{previewId:"c0abeb6af7ad4e94bd0ed5052d8f52bb",pointId: "e5dc397f278a4b6aa26bcd5ec09ce30e",watchedDuration: 99999})
```

我们直接复制粘贴到浏览器控制台，回车执行！刷新看看能不能成功！
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200228194539217.png)
居然有效果了！

那么现在我们要考虑的是previewId，pointId到底是什么东西呢？别急，我们前面查到有一个请求info，信息的返回了章节和视频的详细信息，我们去看看返回了什么信息。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200228194726712.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzM1Mzg5Ng==,size_16,color_FFFFFF,t_70)
哇哦！我们看到这里有一个数组points，打开一看包含了所有视频的point_id，也就是说point_id就是视频ID了，我们只需要写个循环把point数组一一打印出来即可。

```javascript
for(var j=0;j<that.data.chapters.length;j++){
    for(var i=0;i<that.data.chapters[j].points.length;i++){
        console.log(that.data.chapters[j].points[i].point_id);
    }
}
```
这里只列出一小部分代码。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200228194920319.png)
point_id取到了。那么previewId是什么东东，我不断地刷新网页和查看请求，发现previewId是不会变的。我们继续在info这个请求地址返回的数据慢慢找。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200228195114547.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzM1Mzg5Ng==,size_16,color_FFFFFF,t_70)

可以看到这里有个preview对象，展开后里面有个属性叫ID，跟我们之前的ID是一摸一样的，也就说我们取出这个ID即可作为previewId。

```javascript
  console.log(that.data.preview.id);
```
刷新一下，结果不出意外。previewId打印出来啦。这样子上传进度所需要的三大数据previewId，pointId，watchedDuration，我们都找出来了。

现在就是写个脚本，就可以变成绯红之王咯！

**下列附送我写的油猴脚本**

```javascript
// ==UserScript==
// @name         xiaoxi233_传智播客高校平台网课在线
// @version      1.0
// @description  一键看完，课程ID在控制台打印了
// @author       xiaoxi233
// @match	    *://*stu.ityxb.com/*
// ==/UserScript==
  var data="";
  var that=this;
(function() {
    'use strict';
console.log("感谢您的使用，更多请访问diyxi.top");
$.ajax({
  url: 'http://stu.ityxb.com/back/bxg/preview/info?previewId=c0abeb6af7ad4e94bd0ed5052d8f52bb&t=1582880981285',
  type: 'get',
  // 设置的是请求参数
  data: {},
  // 用于设置响应体的类型 注意 跟 data 参数没关系！！！
  dataType: 'json',
  success: function (res) {
    that.data=res.resultObject;
      console.log(that.data);
      console.log(that.data.chapters);
for(var j=0;j<that.data.chapters.length;j++){
    for(var i=0;i<that.data.chapters[j].points.length;i++){
        console.log(that.data.chapters[j].points[i].point_id);
    }
}
      console.log(that.data.preview.id);
      var kk = document.createElement("button");
      kk.id='gua';
document.body.insertBefore(kk, document.body.firstChild);
      $("#gua").text('点击我马上上课！'); // 只支持修改文本
      $("#gua").click(function(){
        var chapters  = prompt("请输入章节","");
          if(chapters=="" || chapters==undefined){
          return;
          }
        chapters = parseInt(chapters);
        console.log(chapters);
        if(chapters>that.data.chapters.length  ||   chapters<0 ){
            alert("章节数不对。");
            return;
        }
        var word = prompt("请输入您要看完的第几节课，（按照章节开始的目录排序，视频的第几个，不算上小测的，所在位置）","");
        word = parseInt(word);
        if(word>that.data.chapters[chapters-1].points.length || word<0){
            alert("视频数不对。请注意[按照章节开始的目录排序，视频的第几个，不算上小测的，所在位置]");
            return;
        }
        var _pointId = that.data.chapters[chapters-1].points[word-1].point_id;
       alert(_pointId);
           $.ajax( {
               url:'http://stu.ityxb.com/back/bxg/preview/updateProgress',// 跳转到 action
               data:{
                   previewId:that.data.preview.id,
                   pointId: _pointId,
                   watchedDuration: 2890
               },
               type:'post',
               success:function(data) {
                   if(data.success){
                       alert("成功看完该节课。")
                   }
               }
           });
	  });
  }
})
})();
```


> 最后感谢朋友提供帮助 黎教练 马教练 莫教练 谢谢大佬们~！
