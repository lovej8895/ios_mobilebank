/*
 * 无卡预约-无卡预约业务说明
 */
define(function(require, exports, module) {
	
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		
		var back = doc.getElementById("back");
		back.addEventListener('click',function(){
			mui.back();
		});
	});
});