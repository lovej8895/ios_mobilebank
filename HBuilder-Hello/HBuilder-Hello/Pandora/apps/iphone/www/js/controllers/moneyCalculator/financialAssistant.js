define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	mui.init();

	$.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		setTimeout(function() {
			//关闭 splash
			plus.navigator.closeSplashscreen();
		}, 600);		
	});
	$.ready(function() {
		var state = app.getState();
		
		document.getElementById("calculator").addEventListener('tap',function(){
			mui.openWindow({
				url:"calculator.html",
				id:"calcilator",
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
		},false);
		document.getElementById("debitCalculator").addEventListener('tap',function(){
			mui.openWindow({
				url:"debitCalculator.html",
				id:"debitCalculator",
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
		},false);
		document.getElementById("rate").addEventListener('tap',function(){
			mui.openWindow({
				url:"rate.html",
				id:"rate",
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
		},false);
		document.getElementById("debitRate").addEventListener('tap',function(){
			mui.openWindow({
				url:"debitRate.html",
				id:"debitRate",
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
		},false);
	});
});