/*
 * 无卡预约取款信息确认：
 * 	获取上一个页面传来的参数：
 * 	预约账号  可用余额  预约金额  预约码 
 * 	在这个页面查处随即因子，获取手机验证码
 * 确定按钮确认后进行预约业务
 */
define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var app = require('../../core/app');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	
	mui.init();
	mui.plusReady(function() {
		//预约成功返回按钮-->返回首页
		plus.screen.lockOrientation("portrait-primary");
		var state = app.getState();
		document.getElementById("cardTransfer_SuccessBack").addEventListener('tap',function(){
			mbank.backToIndex();
		});
	});

});