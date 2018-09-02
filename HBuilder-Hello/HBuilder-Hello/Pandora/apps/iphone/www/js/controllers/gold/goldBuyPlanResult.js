define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var planNo = self.planNo;
		var orderState = self.orderState;
		var resultMsg = self.resultMsg;
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		var investPeriod = self.investPeriod;
		var investDate = self.investDate;
		var payAmount = self.payAmount;
		
		var msg = "交易成功";
		var className = "success_icon1 suc_top20";
		if(orderState == '99'){
			if(resultMsg){
				msg="交易失败，失败原因："+resultMsg;
			}else{
				msg="交易失败";
			}
			className = "fail_icon1 suc_top20";
		}else if(orderState == '50'){
			if(resultMsg){
				msg="状态可疑，原因："+resultMsg;
			}else{
				msg="状态可疑";
			}
			className = "fail_icon1 suc_top20";
		}
		document.getElementById("resultImg").className = className;
		document.getElementById("resultMsg").innerText = msg;
		document.getElementById('planNo').innerText = planNo;
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
		
		
		var muiBack = mui.back;
		document.getElementById("backBtn").addEventListener("tap",function(){
			mbank.back('goldHome',muiBack);
		},false);
		mui.back=function(){
			mbank.back('goldHome',muiBack);
		}
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			params = {
				"goldAipNo" : goldAipNo,
				"accountNo" : accountNo,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../gold/goldBuyPlanList.html','goldBuyPlanList','slide-in-right',params);
		},false);
		
	});
});