define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	var sellWeightReg = new RegExp("^[0-9]*\.?[0-9]{0,4}$", "i");
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		var goldTotalWeight = self.goldTotalWeight;
		var goldUnitPrice;
		var sellWeight;
		var expectAmount;
		var expectCharge;
		
		
		goldUnitPriceQuey();
		function goldUnitPriceQuey(){
			params = {
				"liana_notCheckUrl" : false,
				"turnPageBeginPos" :"1",
				"turnPageShowNum" : "1",
				"beginDate" : format.ignoreChar(format.formatDate(new Date()),"-"),
				"endDate" : format.ignoreChar(format.formatDate(new Date()),"-"),
				"latestFlag" : '1',
				"pageStyle" : ""
			};
			urlVar = mbank.getApiURL()+'goldUnitPriceQuery.do';
			mbank.apiSend("post",urlVar,params,goldUnitPriceQuerySuc,goldUnitPriceQueryFail,true);
			function goldUnitPriceQuerySuc(data){
				if(data.ec =='000'){
					goldUnitPrice = data.goldPriceList[0].goldUnitPrice;
					pageInit();
				}else{
					mui.alert(data.em);
				}
			}
			function goldUnitPriceQueryFail(e){
				mui.alert(e.em);
			}
		}
		
		function pageInit(){
			document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
			document.getElementById('goldUnitPrice').innerText = format.formatMoney(goldUnitPrice) +'元/克';
			document.getElementById('goldTotalWeight').innerText = goldTotalWeight +'克';
		}
		
		document.getElementById("sellWeight").addEventListener("focus",function(){
			document.getElementById('nextBtn').setAttribute("disabled","true");
		},false);
		
		document.getElementById("sellWeight").addEventListener("blur",function(){
			sellWeight = document.getElementById('sellWeight').value;
			if(sellWeight == null || sellWeight == undefined || sellWeight == "" || sellWeight.length == 0){
				document.getElementById('sellWeight').value ='';
	        	mui.alert("请输入合法的卖出克重");
				return;
			}
			if(parseFloat(sellWeight)<=0){
				document.getElementById('sellWeight').value ='';
	        	mui.alert("请输入合法的卖出克重");
				return;
			}
			if(!sellWeightReg.test(sellWeight)){
				document.getElementById('sellWeight').value ='';
	        	mui.alert("请输入合法的卖出克重");
				return;
			}
			if(parseFloat(sellWeight)>parseFloat(goldTotalWeight)){
				document.getElementById('sellWeight').value ='';
	        	mui.alert("卖出克重不能超过持有克重");
				return;
			}
			expectAmount = (parseFloat(sellWeight)*parseFloat(goldUnitPrice)).toFixed(2);
			document.getElementById('expectAmount').innerText = expectAmount+'元';
			expectCharge = (parseFloat(expectAmount)*0.01).toFixed(2);
			document.getElementById('expectCharge').innerText = expectCharge+'元';
			document.getElementById('nextBtn').removeAttribute("disabled");
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			params = {
				"accountNo" : accountNo,
				"goldAipNo" : goldAipNo,
				"goldTotalWeight" : goldTotalWeight,
				"goldUnitPrice" :goldUnitPrice,
				"sellWeight" : sellWeight,
				"expectAmount" : expectAmount,
				"expectCharge" : expectCharge,
				"noCheck" : "false"
			};
			tranTimeJudge(params);
//			mbank.openWindowByLoad("../gold/goldSellConfirm.html","goldSellConfirm", "slide-in-right",params);
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
						mui.alert("尊敬的客户，16:00-18:00为黄金系统资金通道关闭时间,请在此时间段外发起卖金请求","温馨提示","确认",function(){
							return;
						});
					}else{
						mbank.openWindowByLoad("../gold/goldSellConfirm.html","goldSellConfirm", "slide-in-right",param);
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