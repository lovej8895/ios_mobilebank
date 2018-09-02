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
		var goPageId = self.goPageId;
		if(goPageId == 'buyNowBtn' || goPageId == 'buyPlanBtn'){
			document.getElementById("nextBtn").style.display = 'block';
		}
		
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		document.getElementById('goldAipNo').innerText = goldAipNo;
		
		
		var muiBack = mui.back;
		document.getElementById("backBtn").addEventListener("tap",function(){
			mbank.back('goldHome',muiBack);
		},false);
		mui.back=function(){
			mbank.back('goldHome',muiBack);
		}
		
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			params = {
				"accountNo" : accountNo,
				"goldAipNo" : goldAipNo,
				"noCheck" : "false"
			};
			if(goPageId =='buyNowBtn'){
				mbank.openWindowByLoad("../gold/goldBuyNowInput.html","goldBuyNowInput", "slide-in-right",params);
			}else if(goPageId =='buyPlanBtn'){
				mbank.openWindowByLoad("../gold/goldBuyPlanInput.html","goldBuyPlanInput", "slide-in-right",params);
			}
		},false);
	});
});