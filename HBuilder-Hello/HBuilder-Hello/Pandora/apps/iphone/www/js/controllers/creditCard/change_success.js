/*
 * 实现账号维护成功页面的后续操作：
 * 	返回
 */
define(function(require, exports, module) {
	
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	
//	document.getElementById("ad_ifrm").src=mbank.getApiURL()+"APP/views/main/main.html?x="+(new Date()-0); 
	mui.init();
	mui.plusReady(function() {
		document.getElementById("back").addEventListener("tap", function() {
			var noCheck = this.getAttribute("noCheck");
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		}, false);
		
	});
});