define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var goldAipNo = self.goldAipNo;
		var goldSignAcct = self.accountNo;
		
		document.getElementById("addAccount").addEventListener("tap",function(){
			mbank.openWindowByLoad('../myOwn/addAccount.html','addAccount','slide-in-right',"");
		},false);
		
		document.getElementById("goldAcctChange").addEventListener("tap",function(){
			params = {
				"goldAipNo" : goldAipNo,
				"accountNo" : goldSignAcct,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../gold/goldChangeAcctInput.html','goldChangeAcctInput','slide-in-right',params);
		},false);
		
	});
});