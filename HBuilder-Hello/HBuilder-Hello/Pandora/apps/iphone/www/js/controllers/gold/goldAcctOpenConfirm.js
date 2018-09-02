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
		
		commonSecurityUtil.initSecurityData('011101',self);
		
		var accountNo = self.accountNo;
		var branchNo = self.branchNo;
		var managerNo = self.managerNo;
		var goPageId = self.goPageId;
		
		document.getElementById('custName').innerText = userInfo.get('session_customerNameCN');
		document.getElementById('mobile').innerText = userInfo.get('session_mobileNo');
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		if(managerNo){
			document.getElementById('managerNo').innerText = managerNo;
			document.getElementById('managerNoDiv').style.display = 'block';
		}
		if(branchNo){
			document.getElementById('branchNo').innerText = branchNo;
			document.getElementById('branchNoDiv').style.display = 'block';
			branchNo = 'B0046'+branchNo;
		}else{
			branchNo = 'BBK046';
		}
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			document.getElementById('nextBtn').setAttribute("disabled","true");
			params={
				"certType" : "s",
				"exchPwd" : "",
				"areaCode" : "",
				"tel" : "",
				"addr" : "",
				"email" : "",
				"zipCode" : "",
				"accountNo" : accountNo,
				"authNo" : "",
				"branchNo" : branchNo,
//				"branchNo" : "BBK046",
				"managerNo" : managerNo
			};
			var urlVar = mbank.getApiURL()+'goldAcctOpenConfirm.do';
			commonSecurityUtil.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
//			mbank.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
			function confirmSuc(data){
				document.getElementById('nextBtn').removeAttribute("disabled");
				if(data.ec =='000'){
					params = {
						"accountNo" : accountNo,
						"goldAipNo" : data.goldAipNo,
						"goPageId" : goPageId,
						"noCheck" : "false"
					};
					mbank.openWindowByLoad("../gold/goldAcctOpenResult.html","goldAcctOpenResult", "slide-in-right",params);
				}else{
					mui.alert(data.em);
				}
			}
			function confirmFail(e){
				document.getElementById('nextBtn').removeAttribute("disabled");
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