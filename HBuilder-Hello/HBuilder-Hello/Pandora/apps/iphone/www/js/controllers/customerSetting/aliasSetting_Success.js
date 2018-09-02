/*
 * 实现别名设置成功后返回按钮功能
 */
define(function(require, exports, module) {
	
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	
	
	
	mui.init();

	mui.plusReady(function() {
		var backButton = document.getElementById("aliasSetting_SuccessBack");
		var self = plus.webview.currentWebview();
		
		mui.back = function(){
			var frontView = plus.webview.getWebviewById("aliasConfirm");
			var beginView = plus.webview.getWebviewById("aliasSetting");
			plus.webview.close(frontView);
			plus.webview.close(beginView);
			mui.fire(plus.webview.getWebviewById("clientHome"),"reload",{});
			plus.webview.close(self);
			
		}
		
		var path = backButton.getAttribute("path");
		var id = backButton.getAttribute("id");
		var noCheck = backButton.getAttribute("noCheck");
		backButton.addEventListener('tap',function(){
			mui.back();
		});
		
		plus.key.addEventListener('backbutton',function(){
			mui.back();
		},false);		
	});
});