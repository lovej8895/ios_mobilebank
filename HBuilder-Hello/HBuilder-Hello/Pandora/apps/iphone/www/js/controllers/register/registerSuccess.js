define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	$.init();
	$.plusReady(function() {
		var shopping = document.getElementById("login");

		/*window.setTimeout(function() {
			$.openWindow({
				url: '../login/login.html',
				id: 'login',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, 1000);*/
		//提交交易
        setTimeout(function(){
        	plus.webview.hide('register_confirm','none');
        	plus.webview.close('register_confirm','none');
        	plus.webview.hide('login','none');
        	plus.webview.close('login','none');
        },200);
		shopping.addEventListener("tap", function() {
			
           mbank.openWindowByLoad("../electronic_accounts/addAccount.html","addAccount","slide-in-right");
		}, false)

			document.getElementById("closeView").addEventListener("click", function() {
			var retPage = plus.webview.getLaunchWebview();
			mui.fire(retPage, 'footer', {
				fid: "main"
			});
			mui.openWindow({
				url: '../main/main.html',
				id: 'main',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					top: '0px',
					bottom: '51px'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false);
	
		document.getElementById("openGesture").addEventListener("tap", function() {
			mbank.openWindowByLoad("../plus/userLocker.html", "userLocker", "slide-in-right");
		}, false);
		
	});
})