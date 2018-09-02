define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var goldSignAcct = self.goldSignAcct;
		var accountNo = self.accountNo;
		
		document.getElementById('goldSignAcct').innerText = format.dealAccountHideFour(goldSignAcct);
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		
		
		var muiBack = mui.back;
		document.getElementById("backBtn").addEventListener("tap",function(){
			mbank.back('goldHome',muiBack);
		},false);
		mui.back=function(){
			mbank.back('goldHome',muiBack);
		}
		
	});
});