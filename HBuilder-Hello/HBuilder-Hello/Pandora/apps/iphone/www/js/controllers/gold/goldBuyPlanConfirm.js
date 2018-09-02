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
		var accountNo=self.accountNo
		var goldAipNo=self.goldAipNo;
		var investPeriod=self.investPeriod;
		var investDate=self.investDate;
		var payAmount=self.payAmount;
//		var orderFlowNo;

		commonSecurityUtil.initSecurityData('011301',self);

		pageInit();
		
		function pageInit(){
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
			document.getElementById("investPeriod").innerText=jQuery.param.getDisplay('INVEST_PERIOD', investPeriod);
			if(investPeriod =="1"){
				document.getElementById("investDate").innerText=jQuery.param.getDisplay('GOLD_INVESTDAY_MONTH', investDate);	
				document.getElementById("liInvestDate").style.display="block";
			}else if(investPeriod == "4"){
				document.getElementById("investDate").innerText=jQuery.param.getDisplay('GOLD_INVEST_WEEK', investDate);
				document.getElementById("liInvestDate").style.display="block";
			}else{
				document.getElementById("liInvestDate").style.display="none";
			}
			document.getElementById("payAmount").innerText = format.formatMoney(payAmount)+'元';
		}
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			params={
				"accountNo" : accountNo,
				"goldAipNo" : goldAipNo,
				"investPeriod" : investPeriod,
				"investDate" : investDate,
				"payAmount" : payAmount
			};
			var urlVar = mbank.getApiURL()+'goldBuyPlanConfirm.do';
			commonSecurityUtil.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
//			mbank.apiSend("post",urlVar,params,confirmSuc,confirmFail,true);
			function confirmSuc(data){
				if(data.ec =='000'){
					params = {
						"planNo" : data.planNo,
						"orderState" : data.orderState,
						"resultMsg" : data.em,
						"accountNo" : accountNo,
						"goldAipNo" : goldAipNo,
						"investPeriod" : investPeriod,
						"investDate" : investDate,
						"payAmount" : payAmount,
						"noCheck" : "false"
					};
					mbank.openWindowByLoad("../gold/goldBuyPlanResult.html","goldBuyPlanResult", "slide-in-right",params);
				}else{
					mui.alert(data.em,"温馨提示","确认",function(){
						plus.webview.currentWebview().close();
						return;
					});
				}
			}
			function confirmFail(e){
				mui.alert(e.em,"温馨提示","确认",function(){
					plus.webview.currentWebview().close();
					return;
				});
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