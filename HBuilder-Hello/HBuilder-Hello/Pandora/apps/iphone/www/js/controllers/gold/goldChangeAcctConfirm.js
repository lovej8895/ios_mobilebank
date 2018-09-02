define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		commonSecurityUtil.initSecurityData('011103',self);
		
		var goldSignAcct = self.goldSignAcct;
		var goldAipNo = self.goldAipNo;
		var accountNo = self.accountNo;
		
		document.getElementById('goldSignAcct').innerText = format.dealAccountHideFour(goldSignAcct);
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			params={
				"goldAipNo" : goldAipNo,
				"authNo" : "",
				"accountNo" : accountNo
			};
			var urlVar = mbank.getApiURL()+'goldChangeAcctConfirm.do';
			commonSecurityUtil.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
//			mbank.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
			function confirmSuc(data){
				if(data.ec =='000'){
					params = {
						"goldAipNo" : goldAipNo,
						"goldSignAcct" : goldSignAcct,
						"accountNo" : accountNo,
						"noCheck" : "false"
					};
					mbank.openWindowByLoad("../gold/goldChangeAcctResult.html","goldChangeAcctResult", "slide-in-right",params);
				}else{
					mui.alert(data.em);
				}
			}
			function confirmFail(e){
				mui.alert(e.em);
			}
		},false);
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
	});
});