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
				url:'http://mp.weixin.qq.com/s?__biz=MzA4OTQ0NTEwOQ==&mid=2649642021&idx=5&sn=b68e7d49c2ce88747222105be5dd1353&scene=4#wechat_redirect',
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