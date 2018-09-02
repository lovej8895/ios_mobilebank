define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	
	var self = "";
	
	var areaId = "";
	var chargeType = "";
	var chargeNo = "";
	var payNo = "";
	var chargeFee = "";
	var ChagAmt = "";
	var payName = "";
	var amountShouldBeCharged = "";
	var LastOdd = "";
	var CurrOdd = "";
	var serv_Id = "";
	var payIdNo = "";
	
	var accountName = "";
	var daypayment = "";
	var orderFlowNo = "";
	var amountRealCharged = "";
    var currentAcct;
    
    var moneyCheckFlag = false;
    var urlVar = "";
    var params;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		
		areaId = self.areaId;
		chargeType = self.chargeType;
		chargeNo = self.chargeNo;
		payNo = self.payNo;
		chargeFee = self.chargeFee;
		ChagAmt = self.ChagAmt;
		payName = self.payName;
		amountShouldBeCharged = self.amountShouldBeCharged;
		LastOdd = self.LastOdd;
		CurrOdd = self.CurrOdd;
		serv_Id = self.serv_Id;
		payIdNo = self.payIdNo;
		accountName = userInfo.get("session_customerNameCN");
		
		document.getElementById("chargeType").innerText = jQuery.param.getDisplay("CHARGE_TYPE",chargeType);
		document.getElementById("areaCode").innerText = jQuery.param.getDisplay("CHARGEAREA_TYPE",areaId);
		document.getElementById("chargeNo").innerText =	chargeNo;
		document.getElementById("payNo").innerText = payNo;
		document.getElementById("payName").innerText =	"*"+payName.substring(1);
		document.getElementById("amountShouldBeCharged").innerText = format.formatMoney(amountShouldBeCharged)+"元";
		
		loadAccountList();
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				var iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					var pickItem = {
						value:iAccountList[i].accountNo,
						text:iAccountList[i].accountNo
					};
					accountPickerList.push(pickItem);
				}
				var accountPicker = new mui.SmartPicker({title:"请选择付款账户",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
					
				currentAcct = iAccountList[0].accountNo;
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				myAcctInfo.queryAccAmt(currentAcct,"balance",true);
					
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			myAcctInfo.queryAccAmt(currentAcct,"balance",true);
        });	
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			if(currentAcct == null || currentAcct =="" || currentAcct == undefined){
				mui.alert("请选择付款账户","温馨提示");
				return;
			}
			amountRealCharged = document.getElementById("amountRealCharged").value;
			if(!isValidMoney(amountRealCharged)){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("请输入合法的缴费金额","温馨提示");
				return;
			}
			if(parseFloat(amountRealCharged) < parseFloat(amountShouldBeCharged)){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("缴费金额必须大于或者等于应缴金额","温馨提示");
				return;
			}
			validateBalance();
			
			function validateBalance(){
				urlVar = mbank.getApiURL()+'newBalanceQuery.do';
				params = {"accountNo" : currentAcct};
				mbank.apiSend("post",urlVar,params,newBalanceQuerySucFunc,newBalanceQueryFailFunc,true);
				function newBalanceQuerySucFunc(data){
					if(data.ec =="000"){
						if(parseFloat(data.balance)>=parseFloat(amountRealCharged)){
							chargeLimitJudge();
						}else{
							mui.alert("尊敬的客户,您的账户余额不足,请充值后再缴费","温馨提示","确认",function(){
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
			}
			function chargeLimitJudge(){
				urlVar = mbank.getApiURL()+'003003_chargeLimitJudge.do';
				mbank.apiSend("post",urlVar,"",chargeLimitJudgeSucFunc,chargeLimitJudgeFailFunc,true);
				function chargeLimitJudgeSucFunc(data1){
					if(data1.ec =="000"){
						var flagVar = 0;
						flagVar = parseFloat(data1.amountLimit)-(parseFloat(data1.daypayment)+parseFloat(amountRealCharged));
						var payTotal = parseFloat(data1.daypayment)+parseFloat(amountRealCharged);
						if(flagVar < 0){
							mui.confirm("尊敬的客户,您当天的缴费累计超过了每日缴费限额,是否前往缴费设置页面修改限额?","温馨提示",["确认", "取消"], function(event) {
								if (event.index == 0) {
									mbank.openWindowByLoad('../feePayment/feePaymentSet.html','feePaymentSet','slide-in-right',"");
								}else{
									return;
								}
							});
						}else{
							daypayment = payTotal;
							getOrderFlowNo();
						}
					}else{
						mui.alert(data1.em,"温馨提示");
						return;
					}
				}
				function chargeLimitJudgeFailFunc(e1){
					mui.alert(e1.em,"温馨提示");
					return;
				}
			}
			function getOrderFlowNo(){
				urlVar = mbank.getApiURL()+'GetOrderFlowNo.do';
				mbank.apiSend("post",urlVar,"",getOrderFlowNoSucFunc,getOrderFlowNoFailFunc,true);
				function getOrderFlowNoSucFunc(data2){
					if(data2.ec =="000"){
						orderFlowNo = data2.orderFlowNo;
						params ={
							"areaId" : areaId,
							"chargeType" : chargeType,
							"chargeNo" : chargeNo,
							"payNo" : payNo,
							"chargeFee" : chargeFee,
							"ChagAmt" : ChagAmt,
							"payName" : payName,
							"amountShouldBeCharged" : amountShouldBeCharged,
							"LastOdd" : LastOdd,
							"CurrOdd" : CurrOdd,
							"serv_Id" : serv_Id,
							"payIdNo" : payIdNo,
							"accountName" : accountName,
							"daypayment" : daypayment,
							"orderFlowNo" : orderFlowNo,
							"amountRealCharged" : amountRealCharged,
							"accountNo" : currentAcct,
							"payAmount" : amountRealCharged
						};
						mbank.openWindowByLoad('../feePayment/telecomFeePayConfirm.html','telecomFeePayConfirm','slide-in-right',params);
					}else{
						mui.alert(data2.em,"温馨提示");
						return;
					}
				}
				function getOrderFlowNoFailFunc(e2){
					mui.alert(e2.em,"温馨提示");
					return;
				}
			}
			
		},false);
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		});
		
		jQuery("#amountRealCharged").on("blur",function(){
			amountRealCharged = document.getElementById("amountRealCharged").value;
			if(!isValidMoney(amountRealCharged)){
				document.getElementById("amountRealCharged").value = "";
//				mui.alert("请输入合法的缴费金额","温馨提示");
				return;
			}
			/*if(parseFloat(amountRealCharged) < parseFloat(amountShouldBeCharged)){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("缴费金额必须大于或者等于应缴金额","温馨提示");
				return;
			}*/
			document.getElementById("amountRealCharged").value = parseFloat(amountRealCharged).toFixed(2);
		});
		
		mbank.resizePage(".btn_bg_f2");
	});
});