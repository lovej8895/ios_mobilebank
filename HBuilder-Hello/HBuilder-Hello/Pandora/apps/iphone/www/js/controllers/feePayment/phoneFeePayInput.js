define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	
	var mobileReg = new RegExp("^(1[1-9])[0-9]{9}$", "i");
	var chargeType ="000000010006010";
	var phoneNo = "";
//	var unionAmt = "30";
	var unionAmt = "";
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
						pageInit();
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
		
		function pageInit(){
			phoneNo = userInfo.get("session_mobileNo");
//			document.getElementById("phoneNo").setAttribute("type","text");
//			document.getElementById("phoneNo").value = phoneNo.substring(0,3)+" "+phoneNo.substring(3,7)+ " " +phoneNo.substring(7,11);
			document.getElementById("phoneNo").value = phoneNo;
		}
		document.getElementById("phoneBook").addEventListener("tap",function(){
			mbank.openWindowByLoad('../feePayment/phoneBook.html','phoneBook','slide-in-right',"");
		},false);
		
		window.addEventListener("phoneBook", function(event) {
			phoneNo = event.detail.phone;
			document.getElementById("phoneNo").value = phoneNo;
//			document.getElementById("phoneNo").setAttribute("type","text");
//			document.getElementById("phoneNo").value = phoneNo.substring(0,3)+" "+phoneNo.substring(3,7)+ " " +phoneNo.substring(7,11);
		});
		
		/*jQuery("#phoneNo").on("focus",function(){
			document.getElementById("phoneNo").value = "";
			document.getElementById("phoneNo").setAttribute("type","number");
		});
		jQuery("#phoneNo").on("blur",function(){
			document.getElementById("phoneNo").setAttribute("type","text");
			phoneNo = document.getElementById("phoneNo").value;
			if(!mobileReg.test(phoneNo)){
				document.getElementById("phoneNo").value ="";
				mui.toast("请选择或者输入充值手机号码");
				return;
			}else{
				document.getElementById("phoneNo").value = phoneNo.substring(0,3)+" "+phoneNo.substring(3,7)+ " " +phoneNo.substring(7,11);
				return;
			}
		});*/
		
		document.getElementById("chargeSet").addEventListener("tap",function(){
			mbank.openWindowByLoad('../feePayment/feePaymentSet.html','feePaymentSet','slide-in-right',"");
		},false);
		
		document.getElementById("chargeHistoryQuery").addEventListener("tap",function(){
			mbank.openWindowByLoad('../feePayment/feePaymentHistoryQuery.html','feePaymentHistoryQuery','slide-in-right',"");
		},false);
		
		
		mui('#amtBtn').on('click','a',function(event) {
			unionAmt = this.getAttribute("value");
			phoneNo = document.getElementById("phoneNo").value;
			if(phoneNo == null || phoneNo =="" || phoneNo == undefined){
				mui.alert("请选择或者输入充值手机号码","温馨提示");
				return;
			}
			phoneNo = format.ignoreChar(phoneNo," ");
			if(!mobileReg.test(phoneNo)){
				document.getElementById("phoneNo").value ="";
				mui.alert("请选择或者输入正确的手机号码","温馨提示");
				return;
			}
			var phoneType = jQuery("input[name='phoneType']:checked").val();
			if(phoneType == null || phoneType == undefined || phoneType == ""){
				mui.alert("请选择号码类型，此为必输项","温馨提示");
				return;
			}
			if(unionAmt == null || unionAmt == undefined || unionAmt == ""){
				mui.alert("请选择充值金额，此为必输项","温馨提示");
				return;
			}
			urlVar = mbank.getApiURL()+'checkPhonePayTime.do';
			params = {
				"chargeType" : chargeType,
				"userNo" : phoneNo
			}
			mbank.apiSend("post",urlVar,params,checkPhonePayTimeSucFunc,checkPhonePayTimeFailFunc,true);
			function checkPhonePayTimeSucFunc(data){
				if(data.ec == "000"){
					var temp=data.flag;
					var responseMessage = data.responseMessage;
					 if(temp=='0'){
						params = {
							"chargeType" : chargeType,
							"custType" : "I1",
							"userNo" : phoneNo,
							"areaId" : phoneType,
							"accountNo" : "",
							"amountRealCharged" : unionAmt,
							"amountShouldBeCharged" : unionAmt,
							"payAmount" : unionAmt
						};
						mbank.openWindowByLoad('../feePayment/phoneFeePayConfirm.html','phoneFeePayConfirm','slide-in-right',params);
					}else{
					 	mui.alert(responseMessage,"温馨提示","确定",function(){
					 		return;
					 	});
					}
				}else{
					mui.alert(data.em,"温馨提示");
				}
				
			}
			function checkPhonePayTimeFailFunc(e){
				mui.alert(e.em,"温馨提示");
			}
		
		});
	});
});