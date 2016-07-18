#qiniu-ajax

>基于七牛的图片异步上传插件


###Main
```
ajax.js  ——用原型继承封装的原生ajax插件

qiniu-ajax.js  ——基于七牛的图片异步上传插件
```

###Installation
```
<script src="/path/to/qiniu-ajax.js"></script>
```

###Usage
```
qiniu.post(canvas.toDataURL("image/jpeg"), '<%= uptoken %>', null, "http://up.qiniu.com", function (data) {
    var domain = 'http://7xlwto.com2.z0.glb.qiniucdn.com/';
    // convert json string to json object
    var data = eval('('+data+')');
    var imageUrl = domain + data.hash;
}, function (evt) {
    // 设置进度条
    console.log(evt);
});
```


###Methods


-**qiniu.setProgressBar(callback)**

回调函数设置上传进度过程，譬如进度条的设计；

-**convertBase64ToBlob(dataUrl)**

因为插件是针对canvas合成的图片进行上传，所以需要把canvas的base64格式转化成blob格式并保存在formData里面；


###Parameter


-**uptoken**

uptoken是七牛上传的凭证，只能由服务端提供；

-**key**

key用于编写图片名，非必需，这里为null；

-**url**

七牛异步上传处理地址；

-**data**

xhr.onreadystatechange回调函数中的参数data.hash就是图片的后缀地址；


### License

[MIT](http://opensource.org/licenses/MIT) © [JunreyCen](http://junreycen.github.io/)
