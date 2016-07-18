;(function (win) {
	var qiniuAjax = function () {
		this.init.apply(this, arguments);
	}
	qiniuAjax.prototype = {
		init: function () {
			this.xhr = this.create();
		},
		create: function () {
			var xhr = null;
			try {
				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (window.ActiveXObject) {
					xhr = new ActiveXObject("Msxml2.Xmlhttp");
				}
			} catch (err) {
				xhr = new ActiveXObject("Microsoft.Xmlhttp");
			}
			return xhr;
		},
		processData: function(file, token, key) {
			var formData = new FormData();
			if (key != null) {
				formData.append('key', key);
			}
			formData.append('save_key', true);
			formData.append('token', token);
			formData.append('file', file);
			return formData;
		},
		setProgressBar: function (callback) {
			// this.xhr.upload.addEventListener("progress", function (evt) {
			// 	//  lengthComputable 、position 和 total 分别表示进度信息是否可用，当前已经接收到得字节数 和 总字节数
			// 	if (evt.lengthComputable) {
			// 		callback(evt);
			// 	}
			// }, false);
			this.xhr.onprogress = callback(event);
		},
		setReadyState: function (callback) {
			this.xhr.onreadystatechange = function (res) {
				if (this.readyState == 4 && this.status == 200 && this.responseText != "") {
					callback(this.responseText);
				} else if (this.status != 200 && this.responseText) {
					console.log('the ajax qiniu upload is failed!');
				}
			}
		},
		post: function (file, token, key, url, callbackState, callbackProgress) {
			var formData = this.processData(convertBase64ToBlob(file), token, key);
			this.setProgressBar(callbackProgress);
			this.xhr.open('POST', url, true);
			// this.xhr.setRequestHeader("content-type" , "multipart/form-data");
			this.setReadyState(callbackState);
			this.xhr.send(formData);
		}
	}

	//  base64格式需要转化成blob格式再保存到formdata里
	function convertBase64ToBlob(dataUrl) {
		//  dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字,并转换成由二进制字符串
		var data = window.atob(dataUrl.split(',')[1]);
		var ab = new ArrayBuffer(data.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < data.length; i++) {
	        		ia[i] = data.charCodeAt(i);
	    	}
	   	return new Blob([ia], {type:"image/png"});
	}

	win.qiniu = new qiniuAjax();
})(window);

// qiniu.post(canvas.toDataURL("image/jpeg"), '<%= uptoken %>', null, "http://up.qiniu.com", function (data) {
// 	var domain = 'http://7xlwto.com2.z0.glb.qiniucdn.com/';
// 	// convert json string to json object
// 	var data = eval('('+data+')');
// 	var imageUrl = domain + data.hash;
// }, function (evt) {
// 	// 设置进度条
// 	console.log(evt);
// });