define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	mui.init({
		subpages:[{
				url:'http://mp.weixin.qq.com/s?__biz=MzA4OTQ0NTEwOQ==&mid=2649642418&idx=1&sn=503ed95977185eed804d2957dd49da1c&scene=4#wechat_redirect',
				id:'MzA4OTQ0NTEwOQ',
				styles:{
					top: '45px',
					bottom: '0px',
				}
		}]
	});
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var state = app.getState();
		plus.nativeUI.showWaiting("", {
			background: "rgba(0,0,0,0.8)",
			style: "white"
		});
		setTimeout(function() {
			plus.nativeUI.closeWaiting();
		}, 1500);
	});
})