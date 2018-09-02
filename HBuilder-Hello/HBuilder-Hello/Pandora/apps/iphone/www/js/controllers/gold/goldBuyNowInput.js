define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var accountNo = self.accountNo;
		var goldAipNo = self.goldAipNo;
		var goldUnitPrice;
		var payAmount = '200';
		var expectWeight;
		var amount = '200';
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
			myAcctInfo.queryAccAmt(accountNo,"balance",true);
			document.getElementById('goldUnitPrice').innerText = format.formatMoney(goldUnitPrice) +'元/克';
			expectWeight = (parseFloat(payAmount)/parseFloat(goldUnitPrice)).toFixed(4);
			document.getElementById('expectWeight').innerText = expectWeight+'克';
			expectCharge = (parseFloat(payAmount)*0.005).toFixed(2);
			document.getElementById('expectCharge').innerText = expectCharge+'元';
		}
		
		var amountActiveId ='amt1';
		mui('#amtChange').on('tap','a',function(event) {
			amount = this.getAttribute("value");
			if(amount == "0"){
				document.getElementById("payAmount").style.display="block";	
				document.getElementById("payAmount").value = "";
				expectWeight = 0;
				document.getElementById('expectWeight').innerText = '';
				expectCharge = 0;
				document.getElementById('expectCharge').innerText = '';
			}else{
				payAmount = amount;
				document.getElementById("payAmount").style.display="none";
				expectWeight = (parseFloat(payAmount)/parseFloat(goldUnitPrice)).toFixed(4);
				document.getElementById('expectWeight').innerText = expectWeight+'克';
				expectCharge = (parseFloat(payAmount)*0.005).toFixed(2);
				document.getElementById('expectCharge').innerText = expectCharge+'元';
			}
			this.classList.remove('border_f');
			this.classList.add('border_red');
			document.getElementById(amountActiveId).classList.remove('border_red');
			document.getElementById(amountActiveId).classList.add('border_f')
			amountActiveId = this.getAttribute('id');
		});
		
		document.getElementById("payAmount").addEventListener("focus",function(){
			if(document.getElementById('payAmount').value){
				document.getElementById('payAmount').value =format.ignoreChar(document.getElementById('payAmount').value,',');
			}
			document.getElementById('payAmount').setAttribute('type','number');
		},false);
		
		document.getElementById("payAmount").addEventListener("blur",function(){
			payAmount = document.getElementById('payAmount').value;
			if(!isValidMoney(payAmount)){
				document.getElementById('payAmount').value ='';
//	        	mui.alert("请输入合法的购买金额");
				return;
			}
			if(parseFloat(payAmount)<200){
				document.getElementById('payAmount').value ='';
				mui.alert("购买金额必须大于等于200");
				return;
			}
			if((parseFloat(payAmount)%100)!=0){
				document.getElementById('payAmount').value ='';
				mui.alert("购买金额必须是100的倍数");
				return;
			}
			document.getElementById('payAmount').setAttribute('type','text');
			document.getElementById('payAmount').value =format.formatMoney(payAmount,2);
			expectWeight = (parseFloat(payAmount)/parseFloat(goldUnitPrice)).toFixed(4);
			document.getElementById('expectWeight').innerText = expectWeight+'克';
			expectCharge = (parseFloat(payAmount)*0.005).toFixed(2);
			document.getElementById('expectCharge').innerText = expectCharge+'元';
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			if(amount == "0"){
				payAmount = document.getElementById("payAmount").value;
				payAmount = format.ignoreChar(payAmount,',');
				if(!isValidMoney(payAmount)){
					document.getElementById('payAmount').value ='';
	        		mui.alert("请输入购买金额");
					return;
				}
				if(parseFloat(payAmount)<200){
					return false;
				}
				if((parseFloat(payAmount)%100)!=0){
					return false;
				}
			}else{
				payAmount=amount;
			}
			urlVar = mbank.getApiURL()+'newBalanceQuery.do';
			params = {"accountNo" : accountNo};
			mbank.apiSend("post",urlVar,params,newBalanceQuerySucFunc,newBalanceQueryFailFunc,true);
			function newBalanceQuerySucFunc(data){
				if(data.ec =="000"){
					if(parseFloat(data.balance)>=parseFloat(payAmount)){
						params = {
							"accountNo" : accountNo,
							"goldAipNo" : goldAipNo,
							"goldUnitPrice" :goldUnitPrice,
							"payAmount" : payAmount,
							"expectWeight" : expectWeight,
							"expectCharge" : expectCharge,
							"noCheck" : "false"
						};
						tranTimeJudge(params);
					}else{
						mui.alert("尊敬的客户,您的账户余额不足,无法进行黄金购买","温馨提示","确认",function(){
							return;
						});
					}
				}else{
					mui.alert(data.em,"温馨提示");
					return;
				}
			}
			function newBalanceQueryFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
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
						mui.alert("尊敬的客户，16:00-18:00为黄金系统资金通道关闭时间,请在此时间段外发起买金请求","温馨提示","确认",function(){
							return;
						});
					}else{
						mbank.openWindowByLoad("../gold/goldBuyNowConfirm.html","goldBuyNowConfirm", "slide-in-right",param);

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
		var muiBack = mui.back;
		mui.back=function(){
			mbank.back('goldHome',muiBack);
		}
		
		mbank.resizePage(".btn_bg_f2");
	});
});