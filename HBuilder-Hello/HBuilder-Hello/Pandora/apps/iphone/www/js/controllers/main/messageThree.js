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
				url:'http://mp.weixin.qq.com/s?__biz=MzA4OTQ0NTEwOQ==&mid=2649642120&idx=5&sn=b50841fc8f8be9a688ab57d26a1b8722&scene=1&srcid=0726y2cq6u0RTJUoTtaQuLHM&from=groupmessage&isappinstalled=0#wechat_redirect',
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