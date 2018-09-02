define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var moneyReg = new RegExp("^[0-9]{0,15}\.?[0-9]{0,2}$", "i");
	
	var flag = "";
	var amountLimit = "";
	var status = null; 
	var amount = "";
//	var moneyCheckFlag = false;
	
	var urlVar = "";
    var params;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		checkChargeStatus();
		function checkChargeStatus(){
			urlVar = mbank.getApiURL()+'003005_checkStatus.do';
			mbank.apiSend("post",urlVar,params,checkStatusSucFunc,checkStatusFailFunc,true);
			function checkStatusSucFunc(data){
				if(data.ec == "000"){
					flag = data.status;
					amountLimit = data.amountLimit;
					if(flag == "1"){
						document.getElementById("chargeGet").className = "mui-switch mui-switch-blue mui-switch-mini mui-active flo_rihgt";
						document.getElementById("chargeLimit").removeAttribute("disabled");
						document.getElementById("chargeLimit").value = parseFloat(amountLimit).toFixed(2);
						document.getElementById("chargeLimitDiv").style.display = "block";
						document.getElementById("confirmBtn").removeAttribute("disabled");
					}else{
						document.getElementById("chargeGet").className = "mui-switch mui-switch-blue mui-switch-mini flo_rihgt";
						document.getElementById("chargeLimitDiv").style.display = "none";
//						document.getElementById("chargeLimit").value = "";
//						document.getElementById("chargeLimit").setAttribute("disabled",true);
						document.getElementById("confirmBtn").setAttribute("disabled",true);
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
		
		jQuery("#chargeLimit").on("blur",function(){
			amount = document.getElementById("chargeLimit").value;
			if(!isValidMoney(amount)){
//				moneyCheckFlag = false;
				document.getElementById("chargeLimit").value = "";
//				mui.alert("请输入合法的日累计缴费限额","温馨提示");
				return;
			}
//			moneyCheckFlag = true;
			document.getElementById("chargeLimit").value = parseFloat(amount).toFixed(2);
		});
		
        jQuery("#chargeGet").on("toggle",function(event){
            if(event.detail.isActive){
            	status= 1;
				document.getElementById("chargeLimit").value = "";
				document.getElementById("chargeLimit").removeAttribute("disabled");
				document.getElementById("chargeLimitDiv").style.display = "block";
				document.getElementById("confirmBtn").removeAttribute("disabled");
            }else{
            	status= 0;
//				document.getElementById("chargeLimit").value = "";
//				document.getElementById("chargeLimit").setAttribute("disabled",true);
				document.getElementById("chargeLimitDiv").style.display = "none";
				document.getElementById("confirmBtn").setAttribute("disabled",true);
				if(flag=='1'){
					document.getElementById("confirmBtn").removeAttribute("disabled");
				}
            }
        });
        
        document.getElementById("confirmBtn").addEventListener("click",function(){
        	var paydate = format.formatDate(new Date());
        	paydate = format.ignoreChar(paydate,"-");
        	amount = document.getElementById("chargeLimit").value;
        	if((status == null && flag=='1') || (status == "1" && flag=='1')){
	        	if(!isValidMoney(amount)){
	        		mui.alert("请输入合法的日累计缴费限额","温馨提示");
					return;
				}
	        	mui.confirm("尊敬的客户,您是否确定修改每日限额?","温馨提示",["确定", "取消"], function(e) {
					if (e.index == 0) {
						urlVar = mbank.getApiURL()+'003005_changeLimitAmount.do';
						params = {
							"amountLimit" : amount
						};
						mbank.apiSend("post",urlVar,params,changeLimitAmountSucFunc,changeLimitAmountFailFunc,true);
						function changeLimitAmountSucFunc(data){
							if(data.ec == "000"){
								params = {
									"amountLimit" : amount,
									"flag" : flag,
									"status" : "1"
								};
								mbank.openWindowByLoad('../feePayment/feePaymentSetResult.html','feePaymentSetResult','slide-in-right',params);
							}else{
								mui.alert(data.em,"温馨提示");
								return;
							}
						}
						function changeLimitAmountFailFunc(e){
							mui.alert(e.em,"温馨提示");
							return;
						}
					}else{
						return;
					}
				});
        	}else if(status == "1"){
	        	if(!isValidMoney(amount)){
	        		mui.alert("请输入合法的日累计缴费限额","温馨提示");
					return;
				}
	        	urlVar = mbank.getApiURL()+'003005_openCharge.do';
				params = {
					"amountLimit" : amount,
					"status": status,
					"paydate" : paydate,
					"daypayment" : 0
				};
				mbank.apiSend("post",urlVar,params,openChargeSucFunc,openChargeFailFunc,true);
				function openChargeSucFunc(data){
					if(data.ec == "000"){
						params = {
							"amountLimit" : amount,
							"status" : status
						};
						mbank.openWindowByLoad('../feePayment/feePaymentSetResult.html','feePaymentSetResult','slide-in-right',params);
					}else{
						mui("#chargeGet").switch().toggle();
						mui.alert(data.em,"温馨提示");
					}
				}
				function openChargeFailFunc(e){
					mui("#chargeGet").switch().toggle();
					mui.alert(e.em,"温馨提示");
				}
        	}else{
        		mui.confirm("尊敬的客户,您确定关闭缴费功能吗?","温馨提示",["确定", "取消"], function(e) {
					if (e.index == 0) {
						urlVar = mbank.getApiURL()+'003005_closeCharge.do';
						params = {
							"amountLimit" : 0,
							"status" : status,
							"paydate" : paydate,
							"daypayment" : 0
						};
						mbank.apiSend("post",urlVar,params,closeChargeSucFunc,closeChargeFailFunc,true);
						function closeChargeSucFunc(data){
							if(data.ec == "000"){
								params = {
									"status" : status
								};
								mbank.openWindowByLoad('../feePayment/feePaymentSetResult.html','feePaymentSetResult','slide-in-right',params);
							}else{
								mui("#chargeGet").switch().toggle();
								mui.alert(data.em,"温馨提示");
							}
						}
						function closeChargeFailFunc(e){
							mui("#chargeGet").switch().toggle();
							mui.alert(e.em,"温馨提示");
						}
					}else{
						mui("#chargeGet").switch().toggle();
						return;
					}
				});
        	}
        },false);
        
        mbank.resizePage(".btn_bg_f2");
	});
});