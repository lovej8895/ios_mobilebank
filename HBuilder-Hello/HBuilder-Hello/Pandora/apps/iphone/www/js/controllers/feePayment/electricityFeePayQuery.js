define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var chargeType ="000000010020010";
	var chargeNoReg =  new RegExp("^[0-9]{5,20}$", "i");
	var chargeNoReg1 =  new RegExp("^[0-9]{5,10}$", "i");
	var areaPickerArr = [{value: '05',text: '黄石市'},
						 {value: '02',text: '宜昌市'},
						 {value: '52000000',text: '武汉及省内其他地区'}];
	var areaCode = "";
	
	var hisPayNo = "";
	var hisPayAccount = "";
	var hisPayType = "";
	var hisAreaId = "";
	var hisPayAmt = "";
	
	var params;
	var urlVar;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		checkChargeStatus();
		
		function checkChargeStatus(){
			urlVar = mbank.getApiURL()+'003005_checkStatus.do';
			mbank.apiSend("post",urlVar,"",checkStatusSucFunc,checkStatusFailFunc,true);
			function checkStatusSucFunc(data){
				if(data.ec == "000"){
					var checkStatus = data.status;
					if (checkStatus == '0' || checkStatus == null || checkStatus == undefined || checkStatus =="") {
						mui.alert("您尚未开通缴费功能，请前往开通页面!","温馨提示","确认",function(){
							mbank.openWindowByLoad('../feePayment/feePaymentSet.html','feePaymentSet','slide-in-right',"");
						});
					}else{
						document.getElementById("queryButton").removeAttribute("disabled");
						areaInit();
						queryHisList();
					}
				}else{
					mui.toast(data.em);
					plus.webview.currentWebview().close();
				}
			}
			function checkStatusFailFunc(e){
				mui.toast(e.em);
				plus.webview.currentWebview().close();
			}
		}
		
		function areaInit(){
			var areaPicker = new mui.SmartPicker({title:"请选择缴费地区",fireEvent:"changeEvent"});
			areaPicker.setData(areaPickerArr);
			document.getElementById("changeArea").addEventListener("tap",function(){
				areaPicker.show();
			},false);
			document.getElementById("areaPicker").innerText = "请选择缴费地区" ;
		}
		
		window.addEventListener("changeEvent",function(event){
			areaCode = event.detail.value;
			document.getElementById("areaPicker").innerText = event.detail.text;
        });	
		
		function areaDefault(areaCode){
			var defaultText = "";
			for(var i = 0; i < areaPickerArr.length; i++) {
				if(areaPickerArr[i].value == areaCode) {
					defaultText = areaPickerArr[i].text;
					break;
				}
			}
			document.getElementById("areaPicker").innerText = defaultText ;
		}
		
		function queryHisList(){
			urlVar = mbank.getApiURL()+'003003_query.do';
			params = {"payType" : chargeType};
			mbank.apiSend("post",urlVar,params,queryHisListSucFunc,queryHisListFailFunc,true);
			function queryHisListSucFunc(data){
				if(data.ec == "000"){
					hisPayNo = data.payNo;
					hisPayAccount = data.payAccount;
					hisPayType = data.payType;
					hisAreaId = data.areaId;
					hisPayAmt = data.payAmt;
					if(hisAreaId){
						areaCode = hisAreaId;
						areaDefault(hisAreaId);
						document.getElementById("chargeNo").value = hisPayNo;
					}
				}else{
					return;
				}
			}
			function queryHisListFailFunc(e){
				return;
			}
		}
		
		document.getElementById("queryButton").addEventListener("tap",function(){
			if(areaCode == null || areaCode == undefined || areaCode == ""){
				mui.alert("请选择缴费地区，此为必输项","温馨提示");
				return;
			}
			var chargeNo = document.getElementById("chargeNo").value;
			if(areaCode =="05"){
				if(chargeNo == null || chargeNo == undefined || chargeNo == ""){
					document.getElementById("chargeNo").value = "";
					mui.alert("电费客户编号为5~10位数字","温馨提示");
					return;
				}
				if(!chargeNoReg1.test(chargeNo)){
					document.getElementById("chargeNo").value = "";
					mui.alert("电费客户编号为5~10位数字","温馨提示");
					return;
				}
			}else{
				if(chargeNo == null || chargeNo == undefined || chargeNo == ""){
					document.getElementById("chargeNo").value = "";
					mui.alert("电费客户编号为5~20位数字","温馨提示");
					return;
				}
				if(!chargeNoReg.test(chargeNo)){
					document.getElementById("chargeNo").value = "";
					mui.alert("电费客户编号为5~20位数字","温馨提示");
					return;
				}
			}
			if(areaCode == "52000000"){
				urlVar = mbank.getApiURL()+'003006_UnionPayQuery.do';
				params = {
//					"chareType" : chargeType,
					"chargeType" : chargeType,
					"custType" : "D1",
					"userNo" : chargeNo,
					"areaId" : areaCode
				};
				mbank.apiSend("post",urlVar,params,unionPayQuerySucFunc,unionPayQueryFailFunc,true);
				function unionPayQuerySucFunc(data){
					if(data.ec == "000"){
						params = {
							"chargeType" : chargeType,
							"custType" : data.custType,
							"userNo" : data.userNo,
							"areaId" : data.areaId,
							"summaryNo" : data.summaryNo,
							"payAmount" : data.payAmount
//							"iBookInfo" : data.iBookInfo
						};
						mbank.openWindowByLoad('../feePayment/unionPayInput.html','unionPayInput','slide-in-right',params);
					}else{
						mui.alert(data.em,"温馨提示");
					}
				}
				function unionPayQueryFailFunc(e){
					mui.alert(e.em,"温馨提示");
				}
			}else{
				urlVar = mbank.getApiURL()+'003003_electricQuery.do';
				params = {
					"areaId" : areaCode,
					"chargeType" : chargeType,
					"chargeNo" : chargeNo,
					"accountNo" : ""
				};
				mbank.apiSend("post",urlVar,params,electricQuerySucFunc,electricQueryFailFunc,true);
				function electricQuerySucFunc(data){
					if(data.ec == "000"){
						params = {
							"areaId" : areaCode,
							"chargeType" : chargeType,
							"chargeNo" : chargeNo,
							"userName" : data.userName,
							"balance" : data.balance,
							"amountShouldBeCharged" : data.amountShouldBeCharged
						};
						mbank.openWindowByLoad('../feePayment/electricityFeePayInput.html','electricityFeePayInput','slide-in-right',params);
					}else{
						mui.alert(data.em,"温馨提示");
					}
				}
				function electricQueryFailFunc(e){
					mui.alert(e.em,"温馨提示");
				}
			}
		},false);
		
		mbank.resizePage(".btn_bg_f2");
		
	});
});