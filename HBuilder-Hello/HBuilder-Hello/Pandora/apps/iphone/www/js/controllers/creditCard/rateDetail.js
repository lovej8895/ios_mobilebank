/*
 * 已出账单查询结果：
 * 1.信用卡帐号查询
 * 2.根据帐号与时间进行查询
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
		var self = plus.webview.currentWebview(); 
		
		var userName = self.userName;
		var cardType = self.cardType;
		var cardName = self.cardName;
		var status = self.status;
		var CC_basic_supp_ind = self.CC_basic_supp_ind;
		var applyDate = self.applyDate;
		
		var dateShow = applyDate.substring(0,4)+"年"+applyDate.substring(4,6)+"月"+applyDate.substring(6,8)+"日";
		
		doc.getElementById("userName").innerText = userName;
		doc.getElementById("cardType").innerText = cardType;
		doc.getElementById("cardName").innerText = cardName;
		doc.getElementById("status").innerText = status;
		doc.getElementById("CC_basic_supp_ind").innerText = CC_basic_supp_ind;
		doc.getElementById("applyDate").innerText = dateShow;
		
		/*var rateDetailBack = doc.getElementById("rateDetailBack");
		rateDetailBack.addEventListener('tap',function(){
			mui.back();
		});*/
	});
});