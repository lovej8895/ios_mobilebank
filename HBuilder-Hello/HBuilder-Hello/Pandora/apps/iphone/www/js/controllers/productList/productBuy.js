define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号
	var currentAcct = "";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var productNo = self.productNo;
		var projDeadLine = self.projDeadLine;
		var yieldRate = self.yieldRate;
		var cstno = self.cstno;
		var cstType = self.cstType;
		var certType = self.certType;
		var certNo = self.certNo;
		var productName = self.productName;
		var productStatus = self.productStatus;
		var originAmt = self.originAmt;
		var increaseAmt = self.increaseAmt;
		var returnurl = self.returnurl;
		var openPage = self.opener().id;
		var productType =  self.productType;
		mbank.resizePage(".agreement_bg");
		
		mbank.resizePage(".btn_bg_f2");
		
		$("#productNo").html(productNo);
		
		var originAmtShow = originAmt;
		if (parseInt(originAmt) > 10000) {
			originAmtShow = parseInt(originAmt)/10000 + "万";
		}
		var increaseAmtShow = increaseAmt;
		if (parseInt(increaseAmt) > 10000) {
			increaseAmtShow = parseInt(increaseAmt)/10000 + "万";
		}
		if(openPage =='ownOpenProductDetail'){
			$("#buyAmount").attr("placeholder", increaseAmtShow + "元递增");
		}else{
			$("#buyAmount").attr("placeholder", originAmtShow + "元起购，" + increaseAmtShow + "元递增");
		}
		
		$("#bookAndRiskNote").on("tap",function(){
			var params = {
				returnurl : returnurl,
				noCheck : false
			};
			mbank.openWindowByLoad('bookAndRiskNote.html','bookAndRiskNote','slide-in-right',params);
		});
		
		$("#financingBuyProto").on("tap",function(){
			mbank.openWindowByLoad('financingBuyProto.html','financingBuyProto','slide-in-right',{noCheck:false});
		});
		
		$("#customerEquity").on("tap",function(){
			mbank.openWindowByLoad('customerEquity.html','customerEquity','slide-in-right',{noCheck:false});
		});
		
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack, "2");
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					myAcctInfo.getAccAmt(currentAcct,"balance",true);
				}
			}
		}
		
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择付款账户",fireEvent:"accountNo"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
//			accountPicker.show(function(items) {
//				var pickItem=items[0];
//				currentAcct=iAccountInfoList[pickItem.value].accountNo;
//				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
//				myAcctInfo.getAccAmt(currentAcct,"balance",true);
//			});
			document.activeElement.blur();
			accountPicker.show();
		});
		window.addEventListener("accountNo",function(event){
			var pickItem=event.detail;
			currentAcct=iAccountInfoList[pickItem.value].accountNo;
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			myAcctInfo.getAccAmt(currentAcct,"balance",true);
		});
		
		$("#buyAmount").on("focus",function(){
			$(this).attr('type', 'number');
		});
		
		$("#buyAmount").on("blur",function(){
			$(this).attr('type', 'text');
		});
		
		$("#managerCode").on("keyup",function(){
			var value = $(this).val();
			if(value.length > 10){
				$(this).val(value.substr(0, 10));
			}
		});
		
		$("#nextButton").click(function(){
			var balance = format.removeComma($("#balance").html());
	    	var buyAmount = format.removeComma($("#buyAmount").val());
	    	var managerCode = $("#managerCode").val();
	    	if( "" == buyAmount ){
	    		mui.alert("请输入购买金额。");
	    		$("#buyAmount").focus();
	    		return false;
	    	}
	    	if(productStatus == 1){   //预约
	    		if(openPage =='ownOpenProductDetail'){
	    			if((parseFloat(buyAmount) - parseFloat(originAmt)) % parseFloat(increaseAmt) != 0) {
						mui.alert('输入的金额应以' + increaseAmt + '元递增。');
						$("#buyAmount").focus();
						return false;
					} 
	    		}else{
	    			if (parseFloat(buyAmount) < parseFloat(originAmt)) {
						mui.alert("最低购买金额为" + originAmt + "元。");
						$("#buyAmount").focus();
						return false;
					} else{
						if((parseFloat(buyAmount) - parseFloat(originAmt)) % parseFloat(increaseAmt) != 0) {
							mui.alert('输入的金额应以' + increaseAmt + '元递增');
							$("#buyAmount").focus();
							return false;
						} 
					}
	    		}
			}else{   //认购、申购
				if(parseFloat(buyAmount) > parseFloat(balance)){
					mui.alert("购买金额不能超过余额" + balance + "元");
					$("#buyAmount").focus();
					return false;
				}else{
					if(openPage =='ownOpenProductDetail'){
						if((parseFloat(buyAmount) - parseFloat(originAmt)) % parseFloat(increaseAmt) != 0) {
							mui.alert('输入的金额应以' + increaseAmt + '元递增。');
							$("#buyAmount").focus();
							return false;
						}
					}else{
						if (parseFloat(buyAmount) < parseFloat(originAmt)) {
							mui.alert("最低购买金额为" + originAmt + "元。");
							$("#buyAmount").focus();
							return false;
						} else{
							if((parseFloat(buyAmount) - parseFloat(originAmt)) % parseFloat(increaseAmt) != 0) {
								mui.alert('输入的金额应以' + increaseAmt + '元递增。');
								$("#buyAmount").focus();
								return false;
							}
						}
					}
					
				}
			}
			
//	    	var agreement = $("#agreement");
//	    	if( !agreement.is(':checked')){
//	    		mui.alert("请先阅读并同意我行理财产品协议！");
//	    		return false;
//	    	}
	    	
	    	var params = {
	    		payAccount : currentAcct,
				payAmount : buyAmount,
				cstno : cstno,
				cstType : cstType,
				certType : certType,
				certNo : certNo,
				productNo : productNo,
				productName : productName,
				projDeadLine : projDeadLine,
				yieldRate : yieldRate,
				originAmt : originAmt,
				productStatus : productStatus,
				increaseAmt : increaseAmt,
		        managerCode : managerCode,
		        productType : productType,
	    		noCheck:false
	    	};
			mbank.openWindowByLoad('productBuyConfirm.html','productBuyConfirm','slide-in-right',params);
	    });
	});
});