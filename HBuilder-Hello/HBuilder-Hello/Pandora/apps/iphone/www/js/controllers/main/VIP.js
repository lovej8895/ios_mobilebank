define(function(require, exports, module) {
	console.log("VIP会员尊享");
	var doc = document;
	var $ = mui;
	var app = require('../core/app');
	var userInfo = require('../core/userInfo');
	var mbank = require('../core/bank');
	var nativeUI = require('../core/nativeUI');
	var format = require('../core/format');
	$.init();
	$.plusReady(function() {
		/*var backBtnId = doc.getElementById("backBtnId");*/
		var zeroDoller = doc.getElementById('zeroDoller');
		/*backBtnId.addEventListener("tap", function() {
			plus.webview.close('VIP');
		});*/
		zeroDoller.addEventListener("tap", function() {
			$.openWindow({
				url: '../myOwn/todoPage.html',
				id: 'todoPage',
				show: {
					aniShow: 'none'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false);
	});
});