define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		mui.fire(plus.webview.getWebviewById('myGold'),"refreshGoldAcctClose",{});
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		document.getElementById('goldAipNo').innerText = goldAipNo;
		
		var muiBack = mui.back;
		document.getElementById("backBtn").addEventListener("tap",function(){
			mbank.back('myGold',muiBack);
		},false);
		mui.back=function(){
			mbank.back('myGold',muiBack);
		}
	});
});