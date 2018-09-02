define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	
	var COLORS={"0":"蓝色","1":"黄色","2":"黑色","3":"白色"};
	var payTypePickerArr = [{value: '0',text: '普通预存'},{value: '2',text: '年优惠票'}];
	var payType = "";
	var self = "";
    
    var areaId = "";
    var chargeType = "";
    var userNo = "";
    var chargeNo = "";
    var carNo = "";
    var carColor = "";
    var lowestAmt = "";
    var etcBalance = "";
    var haltAmt = "";
    var oweAmt = "";
    var userName = "";
    var carType = "";
    var couponStandard = "";
//  var signBankName = "";
//  var certType = "";
//  var certNo = "";

    var amountRealCharged = "";
    var daypayment = "";
    var accountName = "";
    var orderFlowNo = "";
    
    var currentAcct;
    
    var urlVar = "";
    var params;
    var moneyCheckFlag = false;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		
		areaId = self.areaId;
		chargeType = self.chargeType;
		userNo = self.userNo;
		chargeNo = self.chargeNo;
		carNo = self.carNo;
		carColor = self.carColor;
		lowestAmt = self.lowestAmt;
		etcBalance = self.etcBalance;
		haltAmt = self.haltAmt;
		oweAmt = self.oweAmt;
//		yearStandard = self.yearStandard;
		userName = self.userName;
		carType = self.carType;
		couponStandard = self.couponStandard;
//		signBankName = self.signBankName;
//		certType = self.certType;
//		certNo = self.certNo;

		accountName = userInfo.get("session_customerNameCN");
		document.getElementById("carNo").innerText = carNo;
		document.getElementById("carColor").innerText = COLORS[carColor];
		document.getElementById("lowestAmt").innerText = format.formatMoney(lowestAmt)+"元";
		document.getElementById("etcBalance").innerText = format.formatMoney(etcBalance)+"元";
		document.getElementById("haltAmt").innerText = format.formatMoney(haltAmt)+"元";
		document.getElementById("oweAmt").innerText = format.formatMoney(oweAmt)+"元";
		
		loadAccountList();
		payTypeInit();
		
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
		
		function payTypeInit(){
			var payTypePicker = new mui.SmartPicker({title:"请选择缴费类型",fireEvent:"changeEvent"});
			payTypePicker.setData(payTypePickerArr);
			document.getElementById("changePayType").addEventListener("tap",function(){
				payTypePicker.show();
			},false);
			document.getElementById("payTypePicker").innerText = "请选择缴费类型" ;
		}
		
		window.addEventListener("changeEvent",function(event){
			payType = event.detail.value;
			document.getElementById("payTypePicker").innerText = event.detail.text;
        });
        
		document.getElementById("nextBtn").addEventListener("tap",function(){
			if(payType == null || payType =="" || payType == undefined){
				mui.alert("请选择缴费类型","温馨提示");
				return;
			}
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
			if((payType == "2") && (parseFloat(amountRealCharged) < parseFloat(lowestAmt))){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("缴费金额必须大于或者等于购买年优惠票应缴最低金额","温馨提示");
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
							"chargeType" : chargeType,
							"carNo" : carNo,
							"carColor" : carColor,
							"lowestAmt" : lowestAmt,
							"balance" : etcBalance,
							"haltAmt" : haltAmt,
							"oweAmt" : oweAmt,
							"amountRealCharged" : amountRealCharged,
							"daypayment" : daypayment,
							"userName" : userName,
							"chargeNo" : chargeNo,
							"userNo" : userNo,
							"carType" : carType,
							"couponStandard" : couponStandard,
//							"signBankName" : signBankName,
//							"certType" : certType,
//							"certNo" : certNo,
							"accountName" : accountName,
							"orderFlowNo" : orderFlowNo,
							"payType" : payType,
							"accountNo" : currentAcct,
							"payAmount" : amountRealCharged
						};
						mbank.openWindowByLoad('../feePayment/etcFeePayConfirm.html','etcFeePayConfirm','slide-in-right',params);
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
		},false);
		
		jQuery("#amountRealCharged").on("blur",function(){
			amountRealCharged = document.getElementById("amountRealCharged").value;
			if(payType == null || payType == undefined || payType == "" ){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("请选择缴费类型","温馨提示");
				return;
			}
			if(!isValidMoney(amountRealCharged)){
				document.getElementById("amountRealCharged").value = "";
//				mui.alert("请输入合法的缴费金额","温馨提示");
				return;
			}
			/*if((payType == "2") && (parseFloat(amountRealCharged) < parseFloat(lowestAmt))){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("缴费金额必须大于或者等于购买年优惠票应缴最低金额","温馨提示");
				return;
			}*/
			document.getElementById("amountRealCharged").value = parseFloat(amountRealCharged).toFixed(2);
		});
		
		mbank.resizePage(".btn_bg_f2");
	});
});