define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var chargeType ="000000010018010";
	var chargeNoReg =  new RegExp("^[0-9]{5,20}$", "i");
	var areaPickerArr = [{value: '02',text: '宜昌市'}];
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
			if(chargeNo == null || chargeNo == undefined || chargeNo == ""){
				document.getElementById("chargeNo").value = "";
				mui.alert("中燃天然气客户号为5~20位数字","温馨提示");
				return;
			}
			if(!chargeNoReg.test(chargeNo)){
				document.getElementById("chargeNo").value = "";
				mui.alert("中燃天然气客户号为5~20位数字","温馨提示");
				return;
			}
			params ={
				"areaId" : areaCode,
				"chargeType" : chargeType,
				"chargeNo" : chargeNo,
				"accountNo" : ""
			}
			urlVar = mbank.getApiURL()+'003003_chinaGasQuery.do';
			mbank.apiSend("post",urlVar,params,chinaGasQuerySucFunc,chinaGasQueryFailFunc,true);
			function chinaGasQuerySucFunc(data){
				if(data.ec == "000"){
					params = {
						"areaId" : areaCode,
						"chargeType" : chargeType,
						"chargeNo" : chargeNo,
						"userName" : data.userName,
						"FeeNum" : data.FeeNum,
						"amountShouldBeCharged" : data.amountShouldBeCharged,
						"ReqSeqNo" : data.ReqSeqNo
					};
					mbank.openWindowByLoad('../feePayment/chinaGasFeePayInput.html','chinaGasFeePayInput','slide-in-right',params);
				}else{
					mui.alert(data.em,"温馨提示");
					return;
				}
			}
			function chinaGasQueryFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		},false);
		
		mbank.resizePage(".btn_bg_f2");
	});
});