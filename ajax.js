// construct by class method
var xhr_object = function () {
	this.init.apply( this , arguments );
}
xhr_object.prototype = {
	// create XMLHttpRequest object
	init : function () {
		this.xhr = this.create();
	},
	create : function () {
		var xhr = null;
		try {
			if ( window.XMLHttpRequest ) {
				xhr = new XMLHttpRequest();
			} else if ( window.ActiveXObject ) {
				// IE high version (>=6)
				xhr = new ActiveXObject( "Msxml2.Xmlhttp" );
			}
		} catch( err ) {
			// IE low version
			xhr = new ActiveXObject( "Microsoft.Xmlhttp" );
		}
		return xhr;
	},
	ready_state : function ( timeout , callback ) {
		this.xhr.onreadystatechange = function () {
			if ( this.readyState == 4 && this.status == 200 ) {
				// this.readyState:
				// 1 -> （未初始化）还没有调用send()方法;
				// 2 -> （载入）已调用send()方法，正在发送请求;
				// 3 -> （载入完成）send()方法执行完成，已经接收到全部响应内容;
				// 4 -> （交互）正在解析响应内容;
				// 5 -> （完成）响应内容解析完成，可以在客户端调用了;

				// this.status -> HTTP status code
				// 200 -> success; 
				// 3xx -> redirect;
				// 4xx -> client error;
				// 5xx -> server error;

				// you can use eval( "(" + this.responseText + ")" ) to make the parameter to Object
				callback( this.responseText );
			} else {
				setTimeout( function(){
					this.xhr.abort();
				} , !timeout ? 15000 : timeout );
			}
		}
	}
	combine_data : function (data) {
		// 序列化对象为URL编码的查询字符串表示形式
		var data_str = '';
		if ( data && Object.prototype.toString.call( data ) == "[object Object]") {
			// data = {} ( json object );
			// Number|String|Undefined|Boolean|Object|Array|Function
			// for array|function|object type , typeof just return "object" !
			for ( var i in data ) {
				data_str += encodeURI( i ) + "=" + encodeURI( data[ i ] ) + "&";
			}
		}
		return data_str;
	}
	get : function ( url , data , callback , async , timeout ) {
		// async 参数是 false，请求是同步的 ; true 或省略，请求是异步的
		var combine_url = url + '?' + this.combine_data( data );
		// pay attention to the type transform
		this.xhr.open( 'GET' , combine_url , async === false ? false : true );
		this.ready_state( timeout , callback );
		this.xhr.send( null );
	}
	post : function ( url , data , callback , async , timeout ) {
		var combine_url = url + '?' + this.combine_data( data );
		this.xhr.open( 'POST' , combine_url , async === false ? false : true );
		// you need to set th header when using post method
		// application/x-www-form-urlencoded -> 参数序列化,键值对用“=”连接(和form提交方式一样)
		// application/json -> json格式
		this.xhr.setRequestHeader( "content-type" , "application/x-www-form-urlencoded;charset=UTF-8" );
		this.ready_state( timeout , callback );
		this.xhr.send( !data ? null : data );
	}
}

var xhr = new xhr_object();
xhr.post( "index.php" , "Hello World" , function( data){
	alert( data );
} )