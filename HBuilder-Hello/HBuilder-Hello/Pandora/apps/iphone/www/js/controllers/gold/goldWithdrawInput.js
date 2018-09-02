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
		
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		var goldAmtCanUseBal = self.goldAmtCanUseBal;
		var payAmount;
	
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		document.getElementById('goldAmtCanUseBal').innerText = format.formatMoney(goldAmtCanUseBal) +'元';
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			payAmount = document.getElementById('payAmount').value;
			if(!isValidMoney(payAmount)){
				document.getElementById('payAmount').value ='';
	        	mui.alert("请输入合法的提现金额");
				return;
			}
			if(parseFloat(payAmount)>parseFloat(goldAmtCanUseBal)){
				document.getElementById('payAmount').value ='';
	        	mui.alert("提现金额不能大于可用余额");
				return;
			}
			params = {
				"accountNo" : accountNo,
				"goldAipNo" : goldAipNo,
				"goldAmtCanUseBal" :goldAmtCanUseBal,
				"payAmount" : payAmount,
				"noCheck" : "false"
			};
			tranTimeJudge(params);
//			mbank.openWindowByLoad("../gold/goldWithdrawConfirm.html","goldWithdrawConfirm", "slide-in-right",params);
		},false);
		
		function tranTimeJudge(param){
			params = {
				"liana_notCheckUrl" : false,
			};
			urlVar = mbank.getApiURL()+'getSystemTime.do';
			mbank.apiSend("post",urlVar,params,getSysTimeSuc,getSysTimeFail,true);
			function getSysTimeSuc(data){
				if(data.ec =='000'){
					var sysTime = data.systemTime;
					var nowTime = sysTime.substring(8,10);
					if(16 <= parseInt(nowTime) &&  parseInt(nowTime)< 18){
						mui.alert("尊敬的客户，16:00-18:00为黄金系统资金通道关闭时间,请在此时间段外发起提现请求","温馨提示","确认",function(){
							return;
						});
					}else{
						mbank.openWindowByLoad("../gold/goldWithdrawConfirm.html","goldWithdrawConfirm", "slide-in-right",param);
					}
				}else{
					mui.alert(data.em);
					return;
				}
			}
			function getSysTimeFail(e){
				mui.alert(e.em);
				return;
			}
		}
		
		mbank.resizePage(".btn_bg_f2");
	});
});