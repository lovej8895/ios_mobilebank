define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	
	var phoneReg =  new RegExp("^[0-9]{7,8}$", "i");
	var mobileReg = new RegExp("^(1[1-9])[0-9]{9}$", "i");
	var chargeType = "000000010007010";
	var areaPickerArr = [{value: '05',text: '黄石市'},{value: '02',text: '宜昌市'}];
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
			params = {
				"payType" : chargeType
			};
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
						if(mobileReg.test(hisPayNo)){
							document.getElementById("telecomMobile").setAttribute("checked","checked");
							document.getElementById("mobileOrPhone").innerText = "手机号码";
				        	document.getElementById("telephone").setAttribute("maxlength","11");
				        	document.getElementById("telephone").setAttribute("placeholder","请输入手机号码");
						}else{
							document.getElementById("telecomPhone").setAttribute("checked","checked");
							document.getElementById("mobileOrPhone").innerText = "固话号码";
				        	document.getElementById("telephone").setAttribute("maxlength","8");
				        	document.getElementById("telephone").setAttribute("placeholder","请输入固话号码");
						}
						areaDefault(hisAreaId);
						document.getElementById("telephone").value = hisPayNo;
					}
				}else{
					return;
				}
			}
			function queryHisListFailFunc(e){
				return;
			}
		}
		
		jQuery("input[name='telecom']").on("change",function(){
			var thisVal = jQuery("input[name='telecom']:checked").val();
	        if(thisVal=="phone" ){
	        	document.getElementById("mobileOrPhone").innerText = "固话号码";
	        	document.getElementById("telephone").value = "";
	        	document.getElementById("telephone").setAttribute("maxlength","8");
	        	document.getElementById("telephone").setAttribute("placeholder","请输入固话号码");
	        }else{
	        	document.getElementById("mobileOrPhone").innerText = "手机号码";
	        	document.getElementById("telephone").value = "";
	        	document.getElementById("telephone").setAttribute("maxlength","11");
	        	document.getElementById("telephone").setAttribute("placeholder","请输入手机号码");
	        }
	    });
		
		document.getElementById("queryButton").addEventListener("tap",function(){
	    	if(areaCode == null || areaCode == undefined || areaCode == ""){
				mui.alert("请选择缴费地区，此为必输项","温馨提示");
				return;
			}
	    	var type = jQuery("input[name='telecom']:checked").val();
			if(type == null || type == undefined || type == ""){
				mui.alert("请选择号码类型，此为必输项","温馨提示");
				return;
			}
			var chargeNo = document.getElementById("telephone").value;
			if("phone"==type){
				if(chargeNo == null || chargeNo == undefined || chargeNo == ""){
					document.getElementById("telephone").value = "";
					mui.alert("请输入正确的固话号码格式","温馨提示");
					return;
				}
				if(!phoneReg.test(chargeNo)){
					document.getElementById("telephone").value = "";
					mui.alert("请输入正确的固话号码格式","温馨提示");
					return;
				}
			}else{
				if(chargeNo == null || chargeNo == undefined || chargeNo == ""){
					document.getElementById("telephone").value = "";
					mui.alert("请输入正确的手机号码格式","温馨提示");
					return;
				}
				if(!mobileReg.test(chargeNo)){
					document.getElementById("telephone").value = "";
					mui.alert("请输入正确的手机号码格式","温馨提示");
					return;
				}
			}
			urlVar = mbank.getApiURL()+'003003_telecomQuery.do';
			params ={
				"areaId" : areaCode,
				"chargeType" : chargeType,
				"chargeNo" : chargeNo,
				"accountNo" : ""
			}
			mbank.apiSend("post",urlVar,params,telecomQuerySucFunc,telecomQueryFailFunc,true);
			function telecomQuerySucFunc(data){
				if(data.ec =="000"){
					params ={
						"areaId" : areaCode,
						"chargeType" : chargeType,
						"chargeNo" : chargeNo,
						"payNo" : data.payNo,
						"chargeFee" : data.chargeFee,
						"ChagAmt" : data.ChagAmt,
						"payName" : data.payName,
						"amountShouldBeCharged" : data.amountShouldBeCharged,
						"LastOdd" : data.LastOdd,
						"CurrOdd" : data.CurrOdd,
						"serv_Id" : data.serv_Id,
						"payIdNo" : data.payIdNo
					};
					mbank.openWindowByLoad('../feePayment/telecomFeePayInput.html','telecomFeePayInput','slide-in-right',params);
				}else{
					mui.alert(data.em,"温馨提示");
				}
			}
			function telecomQueryFailFunc(e){
				mui.alert(e.em,"温馨提示");
			}
	    },false);
	    
	    mbank.resizePage(".btn_bg_f2");
		
	});
});