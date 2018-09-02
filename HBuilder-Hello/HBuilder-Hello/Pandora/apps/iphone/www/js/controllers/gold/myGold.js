define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var goldTotalVal;//总价值
	var goldAmtCanUseBal;//资金可用余额
	var goldStorCanUseBal;//库存可用，客户持有
	var goldUnitPrice;//当日金价
	var goldTotalBuyWeight;//随时买累计克重
	var goldTotalPlanBuyWeight;//计划买累计克重
	var goldProfigLoss;//浮动盈亏
	var goldWeightedPrice;
	var goldBuyAmtFroze;//买金资金冻结
	var goldSaleAmtFoze;//卖金资金冻结
	var goldWithdrawalFroze;//提现资金冻结
	var goldBuyAuditNum;//买金待确认笔数
	var goldBuyAuditMoney;//买金待确认金额
	var goldSaleAuditNum;//卖金待确认笔数
	var goldSaleAuditWeight;//卖金待确认克重
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var goldAipNo = self.goldAipNo;
		var accountNo = self.accountNo;
		
		queryGoldCapital(goldAipNo);
		//客户持有信息,当客户未持有时是否当前金价
		function queryGoldCapital(goldAipNo){
			params = {
				"goldAipNo" : goldAipNo
			};
			urlVar = mbank.getApiURL()+'goldCapitalQuery.do';
			mbank.apiSend("post",urlVar,params,goldCapitalQuerySuc,goldCapitalQueryFail,true);
			function goldCapitalQuerySuc(data){
				if(data.ec =='000'){
					goldAmtCanUseBal = data.goldAmtCanUseBal;
					goldStorCanUseBal = data.goldStorCanUseBal;
					goldUnitPrice = data.goldUnitPrice;
					goldTotalBuyWeight = data.goldTotalBuyWeight;
					goldWeightedPrice = data.goldWeightedPrice;
					goldTotalPlanBuyWeight = data.goldTotalPlanBuyWeight;
					goldBuyAmtFroze = data.goldBuyAmtFroze;
					goldSaleAmtFoze = data.goldSaleAmtFoze;
					goldWithdrawalFroze = data.goldWithdrawalFroze;
					goldBuyAuditNum = data.goldBuyAuditNum;
					goldBuyAuditMoney = data.goldBuyAuditMoney;
					goldSaleAuditNum = data.goldSaleAuditNum;
					goldSaleAuditWeight = data.goldSaleAuditWeight;
					pageInit();
				}
			}
			function goldCapitalQueryFail(e){
					
			}
		}
		
		function pageInit(){
			goldTotalVal = parseFloat(goldStorCanUseBal)*parseFloat(goldUnitPrice);
			goldProfigLoss = parseFloat(goldStorCanUseBal)*(parseFloat(goldUnitPrice)-parseFloat(goldWeightedPrice));
			var totalBuy = parseFloat(goldTotalBuyWeight) + parseFloat(goldTotalPlanBuyWeight);
			document.getElementById('goldTotalVal').innerText = format.formatMoney(goldTotalVal)+'元';
			document.getElementById("goldProfigLoss").innerText = format.formatMoney(goldProfigLoss);
			document.getElementById('goldTotalWeight').innerText = goldStorCanUseBal;
			document.getElementById('goldAmtCanUseBal').innerText = format.formatMoney(goldAmtCanUseBal)+'元';
			document.getElementById('goldTotalBuyWeight').innerText = totalBuy +'克';
			document.getElementById('goldBuyAmtFroze').innerText = format.formatMoney(goldBuyAmtFroze)+'元';
			document.getElementById('goldSaleAmtFoze').innerText = format.formatMoney(goldSaleAmtFoze)+'元';
			document.getElementById('goldWithdrawalFroze').innerText = format.formatMoney(goldWithdrawalFroze)+'元';
			if(goldBuyAuditNum>0 && goldSaleAuditNum>0){
				document.getElementById('currentMsg').innerHTML = '买金'+goldBuyAuditNum+'笔'+format.formatMoney(goldBuyAuditMoney)+'元处理中、卖金'+goldSaleAuditNum+'笔'+goldSaleAuditWeight+'克处理中';
				document.getElementById('currentMsg').style.display = 'block';
			}else if(goldBuyAuditNum>0){
				document.getElementById('currentMsg').innerHTML = '买金'+goldBuyAuditNum+'笔'+format.formatMoney(goldBuyAuditMoney)+'元处理中';
				document.getElementById('currentMsg').style.display = 'block';
			}else if(goldSaleAuditNum>0){
				document.getElementById('currentMsg').innerHTML = '卖金'+goldSaleAuditNum+'笔'+goldSaleAuditWeight+'克处理中';
				document.getElementById('currentMsg').style.display = 'block';
			}else{
				document.getElementById('currentMsg').style.display = 'none';
			}
			if(parseFloat(goldAmtCanUseBal)>0){
				document.getElementById("goldWithdraw").style.display = 'block';
			}else{
				document.getElementById("goldAcctClose").style.display = 'block';
			}
			/*mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				if(data.length>0){
					if(data.length ==1 && data[0].accountNo == accountNo){
						document.getElementById("goldChangeAcct").style.display = 'none';
					}else{
						document.getElementById("goldChangeAcct").style.display = 'block';
					}
				}
			}*/
		}
		
		//交易明细
		document.getElementById("goldBuyPlanList").addEventListener("tap",function(){
			params = {
				"goldAipNo" : goldAipNo,
				"accountNo" : accountNo,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../gold/goldBuyPlanList.html','goldBuyPlanList','slide-in-right',params);
		},false);
		
		//提现
		document.getElementById("goldWithdraw").addEventListener("tap",function(){
			if(parseFloat(goldAmtCanUseBal)>0){
				params = {
					"goldAipNo" : goldAipNo,
					"accountNo" : accountNo,
					"goldAmtCanUseBal" : goldAmtCanUseBal,
					"noCheck" : "false"
				};
				mbank.openWindowByLoad('../gold/goldWithdrawInput.html','goldWithdrawInput','slide-in-right',params);
			}else{
				mui.alert("无可用余额，不可进行提现");
				return false;
			}
		},false);
		
		//换卡
		document.getElementById("goldChangeAcct").addEventListener("tap",function(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				if(data.length>0){
					if(data.length ==1 && data[0].accountNo == accountNo){
						mui.alert("加挂卡只有一张不可做签约账户变更");
						return false;
					}else{
						params = {
							"goldAipNo" : goldAipNo,
							"accountNo" : accountNo,
							"noCheck" : "false"
						};
						mbank.openWindowByLoad('../gold/goldChangeAcctInput.html','goldChangeAcctInput','slide-in-right',params);
					}
				}
			}
		},false);
		
		//交易明细
		document.getElementById("goldTranHis").addEventListener("tap",function(){
			params = {
				"goldAipNo" : goldAipNo,
				"accountNo" : accountNo,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../gold/goldTranHis.html','goldTranHis','slide-in-right',params);
		},false);
		
		//销户
		document.getElementById("goldAcctClose").addEventListener("tap",function(){
			params = {
				"goldAipNo" : goldAipNo,
				"accountNo" : accountNo,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad('../gold/goldAcctClose.html','goldAcctClose','slide-in-right',params);
		},false);
		
		window.addEventListener("refreshGoldAcctClose", function(event) {
			document.getElementById('goldAcctClose').style.display = 'none';
		});
	});
});