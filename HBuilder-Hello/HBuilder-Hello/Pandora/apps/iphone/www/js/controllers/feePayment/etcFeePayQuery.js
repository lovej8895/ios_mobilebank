define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var chargeType ="000000010019010";
	var carReg =  new RegExp("^.*$", "i");
	var areaPickerArr = [{value: '01',text: '武汉市'}];
	var areaCode = "";
	
	var carColorPickerArr = [{value: '0',text: '蓝色'},{value: '1',text: '黄色'},{value: '2',text: '黑色'},{value: '3',text: '白色'}];
	var carColor = "";
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
						carColorInit();
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
		
		function carColorInit(){
			var carColorPicker = new mui.SmartPicker({title:"请选择车牌颜色",fireEvent:"colorChangeEvent"});
			carColorPicker.setData(carColorPickerArr);
			document.getElementById("changeCarColor").addEventListener("tap",function(){
				carColorPicker.show();
			},false);
			document.getElementById("carColorPicker").innerText = "请选择车牌颜色" ;
		}
		
		window.addEventListener("colorChangeEvent",function(event){
			carColor = event.detail.value;
			document.getElementById("carColorPicker").innerText = event.detail.text ;
        });
		
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
						document.getElementById("carNo").value = hisPayNo;
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
			var chargeNo = document.getElementById("carNo").value;
			if(chargeNo == null || chargeNo == undefined || chargeNo == "" || chargeNo.length == 0){
				mui.alert("请输入车牌号码,此为必输项","温馨提示");
				return;
			}
			if(!carReg.test(chargeNo)){
				document.getElementById("carNo").value = "";
				mui.alert("请输入正确的车牌号码格式","温馨提示");
				return;
			}
			if(carColor == null || carColor == undefined || carColor == ""){
				mui.alert("请选择车牌颜色，此为必输项","温馨提示");
				return;
			}
			urlVar = mbank.getApiURL()+'003003_etcQuery.do';
			params = {
				"areaId" : areaCode,
				"chargeType" : chargeType,
				"userNo" : "",
				"chargeNo" : "",
				"carNo" : chargeNo,
				"carColor" : carColor,
				"accountNo" : ""
			}
			mbank.apiSend("post",urlVar,params,etcQuerySucFunc,etcQueryFailFunc,true);
			function etcQuerySucFunc(data){
				if(data.ec == "000"){
					params = {
						"areaId" : areaCode,
						"chargeType" : chargeType,
						"userNo" : data.userNo,
						"chargeNo" : data.chargeNo,
						"carNo" : chargeNo,
						"carColor" : carColor,
						"lowestAmt" : data.lowestAmt,
						"etcBalance" : data.balance,
						"haltAmt" : data.haltAmt,
						"oweAmt" : data.oweAmt,
						"userName" : data.userName,
						"carType" : data.carType,
						"couponStandard" : data.couponStandard
//						"signBankName" : data.signBankName,
//						"certType" : data.certType,
//						"certNo" : data.certNo
					};
					mbank.openWindowByLoad('../feePayment/etcFeePayInput.html','etcFeePayInput','slide-in-right',params);
				}else{
					mui.alert(data.em,"温馨提示");
					return;
				}
			}
			function etcQueryFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		},false);
		
		mbank.resizePage(".btn_bg_f2");
	});
});