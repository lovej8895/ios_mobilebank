define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
	var self = "";
	var chargeType = "";
	var custType = "";
	var userNo = "";
	var areaId = "";
	var accountNo = "";
	var amountRealCharged = "";
	var amountShouldBeCharged = "";
	
    var currentAcct;
	
	var urlVar;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		chargeType = self.chargeType;
		custType = self.custType;
		userNo = self.userNo;
		areaId = self.areaId;
		accountNo = self.accountNo;
		amountRealCharged = self.amountRealCharged;
		amountShouldBeCharged = self.amountShouldBeCharged;
		commonSecurityUtil.initSecurityData('003032',self);
		document.getElementById("areaId").innerText = jQuery.param.getDisplay("AREA_CODE",areaId);
		document.getElementById("userNo").innerText = userNo;
		document.getElementById("amountRealCharged").innerText = format.formatMoney(amountRealCharged)+"元";
		
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
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			if(currentAcct == null || currentAcct =="" || currentAcct == undefined){
				mui.alert("请选择付款账户","温馨提示");
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
							unionPaySubmit();
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
			function unionPaySubmit(){
				urlVar = mbank.getApiURL()+'003006_UnionPaySubmit.do';
				params={
					"userNo" : userNo,
					"areaId" : areaId,
					"summaryNo" : "",
					"custType" : custType,
					"accountNo" : currentAcct,
					"chargeType" : chargeType,
					"amountShouldBeCharged" : amountShouldBeCharged,
					"amountRealCharged" : amountRealCharged,
					"reckType" : "M"
				}
				commonSecurityUtil.apiSend("post",urlVar,params,unionPaySubmitSucFunc,unionPaySubmitFailFunc,true);
				function unionPaySubmitSucFunc(data1){
					if(data1.ec =="000"){
						params = {
							"chargeType" : chargeType,
							"orderState" : data1.orderState,
							"resultMsg" : data1.em
						};
						mbank.openWindowByLoad('../feePayment/feePaymentChargeResult.html','feePaymentChargeResult','slide-in-right',params);
					}else{
						mui.alert(data1.em,"温馨提示");
						return;
					}
				}
				function unionPaySubmitFailFunc(e1){
					mui.alert(e1.em,"温馨提示");
					return;
				}
			}
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		
	});
});