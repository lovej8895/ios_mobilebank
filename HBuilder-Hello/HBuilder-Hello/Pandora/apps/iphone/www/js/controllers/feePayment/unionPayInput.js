define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	var payTypeArys = {"W":"水费","E":"电费","M":"电话充值"};
	var self = "";
	
	var chargeType = "";
	var custType = "";
	var userNo = "";
	var areaId = "";
	var areaIdVar = "";
	var summaryNo = "";
	var payAmount = "";
//	var iBookInfo = "";
	
	var amountRealCharged = "";
	var reckType = "";
    var currentAcct;
    
    var moneyCheckFlag = false;
    var urlVar = "";
    var params;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		chargeType = self.chargeType;
		custType = self.custType;
		userNo = self.userNo;
		areaId = self.areaId;
		areaIdVar = self.areaId;
		summaryNo = self.summaryNo;
		payAmount = self.payAmount;
//		iBookInfo = self.iBookInfo;
		if(custType =="D4"){
			reckType = "W";
			document.getElementById("amountRealCharged").value = format.formatMoney(payAmount);
			document.getElementById("amountRealCharged").setAttribute("disabled","true");
		}else if(custType =="D1"){
			reckType = "E";
			areaIdVar = "E"+areaId;
		}
		document.getElementById("titleSpan").innerText = payTypeArys[reckType];
		document.getElementById("tipSpan").innerText = payTypeArys[reckType] + "缴费信息";
		document.getElementById("chargeType").innerText = payTypeArys[reckType];
		document.getElementById("areaCode").innerText = jQuery.param.getDisplay("AREA_CODE",areaIdVar);
		document.getElementById("userNo").innerText = userNo;
		document.getElementById("amountShouldBeCharged").innerText = format.formatMoney(payAmount);
		
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
			if(parseFloat(amountRealCharged) < parseFloat(payAmount)){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("输入的金额应该大于或等于欠费金额","温馨提示");
				return;
			}
			urlVar = mbank.getApiURL()+'newBalanceQuery.do';
			params = {"accountNo" : currentAcct};
			mbank.apiSend("post",urlVar,params,newBalanceQuerySucFunc,newBalanceQueryFailFunc,true);
			function newBalanceQuerySucFunc(data){
				if(data.ec =="000"){
					if(parseFloat(data.balance)>=parseFloat(amountRealCharged)){
						params = {
							"userNo" : userNo,
							"areaId" : areaId,
							"areaIdVar" : areaIdVar,
							"summaryNo" : summaryNo,
							"custType" : custType,
							"accountNo" : currentAcct,
							"chargeType" : chargeType,
							"amountRealCharged" : amountRealCharged,
							"amountShouldBeCharged" :payAmount,
							"reckType" : reckType,
							"payAmount" : amountRealCharged
						};
						mbank.openWindowByLoad('../feePayment/unionPayConfirm.html','unionPayConfirm','slide-in-right',params);
					}else{
						mui.alert("尊敬的客户，您的当前账户余额不足","温馨提示");
						return;
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
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		jQuery("#amountRealCharged").on("blur",function(){
			amountRealCharged = document.getElementById("amountRealCharged").value;
			if(!isValidMoney(amountRealCharged)){
				document.getElementById("amountRealCharged").value = "";
//				mui.alert("请输入合法的缴费金额","温馨提示");
				return;
			}
			/*if(parseFloat(amountRealCharged) < parseFloat(payAmount)){
				document.getElementById("amountRealCharged").value = "";
				mui.alert("输入的金额应该大于或等于欠费金额","温馨提示");
				return;
			}*/
			document.getElementById("amountRealCharged").value = parseFloat(amountRealCharged).toFixed(2);
		});
		
		mbank.resizePage(".btn_bg_f2");
	});
});