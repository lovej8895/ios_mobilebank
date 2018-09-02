define(function(require, exports, module) {
	console.log("特色服务");
	var doc = document;
	var $ = mui;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	$.init();
	$.plusReady(function() {
		var backBtnId = doc.getElementById("backBtnId");
		var rightNow = doc.getElementById('rightNow');
		backBtnId.addEventListener("tap", function() {
			plus.webview.close('specServe');
		});
		rightNow.addEventListener("tap", function() {
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