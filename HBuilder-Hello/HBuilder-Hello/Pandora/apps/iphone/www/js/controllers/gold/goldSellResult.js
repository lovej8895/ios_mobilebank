define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var flowNo = self.flowNo;
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		var sellWeight = self.sellWeight;
		var orderState = self.orderState;
		var resultMsg = self.resultMsg;
		
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
		document.getElementById('flowNo').innerText = flowNo;
		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
		document.getElementById('sellWeight').innerText = sellWeight +'克';
		
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
				"subPageId" : "goldTranHisSell",
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../gold/goldTranHis.html','goldTranHis','slide-in-right',params);
		},false);
		
	});
});