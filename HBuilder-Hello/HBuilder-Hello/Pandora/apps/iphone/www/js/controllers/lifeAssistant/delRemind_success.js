/*
 * 实现添加成功页面的后续操作：
 * 	1.查看所有提醒
 * 	2.继续添加提醒
 */
define(function(require, exports, module) {
	
	// 引入依赖
	var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		/*var session_customerId = localStorage.getItem("session_customerId");
		var self = plus.webview.currentWebview();
		var frontView = plus.webview.getWebviewById("affairDetail");
		var beginView = plus.webview.getWebviewById("affairRemind");
		document.getElementById("delRemind_SuccessBack").addEventListener("tap", function() {
			var noCheck = this.getAttribute("noCheck");
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var main_sub = plus.webview.getWebviewById('main_sub');
			mui.fire(main_sub,"reload",{session_customerId:session_customerId});
			plus.webview.close(frontView);
			plus.webview.close(beginView);
			plus.webview.close(self);
			

		}, false);*/
		
		if(plus.webview.getWebviewById('affairRemind')){
			mui.fire(plus.webview.getWebviewById("affairRemind"),"reload",{});
		}
		var muiBack = mui.back;
		document.getElementById("delRemind_SuccessBack").addEventListener("tap",function(){
			if(plus.webview.getWebviewById('affairRemind')){
				mbank.back('affairRemind',muiBack);
			}else{
				plus.webview.currentWebview().close();
			}
		},false);
		mui.back=function(){
			if(plus.webview.getWebviewById('affairRemind')){
				mbank.back('affairRemind',muiBack);
			}else{
				plus.webview.currentWebview().close();
			}
		}
	});
});