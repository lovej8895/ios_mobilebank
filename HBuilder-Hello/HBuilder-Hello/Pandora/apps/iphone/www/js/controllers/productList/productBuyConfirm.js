define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		mbank.resizePage(".btn_bg_f2");
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('009003',self);
		var payAccount = self.payAccount;
		var payAmount = self.payAmount;
		var payAmountShow = format.formatMoney(payAmount, 2);
		var cstno = self.cstno;
		var cstType = self.cstType;
		var certType = self.certType;
		var certNo = self.certNo;
		var productNo = self.productNo;
		var productName = self.productName;
		var projDeadLine = self.projDeadLine;
		var yieldRate = self.yieldRate;
		var originAmt = self.originAmt;
		var originAmtShow = format.formatMoney(originAmt, 2);
		var increaseAmt = self.increaseAmt;
		var productStatus = self.productStatus;
        var managerCode = self.managerCode;
        var orderFlowNo = "";
        var productType = self.productType;
        
        
        document.getElementById("productNo").innerHTML = productNo;
        document.getElementById("yieldRate").innerHTML = yieldRate + "%";
        if(productType == '3'){
        	document.getElementById("projDeadLine").innerHTML = "无固定";
        }else{
        	document.getElementById("projDeadLine").innerHTML = projDeadLine + "天";
        }
//      document.getElementById("originAmt").innerHTML = originAmtShow + "元";
        document.getElementById("payAccount").innerHTML = payAccount;
        document.getElementById("payAmount").innerHTML = payAmountShow + "元";
        document.getElementById("managerCode").innerHTML = managerCode;
        
        //获取交易流水
		getOrderFlowNo();
		function getOrderFlowNo() {
			var dataNumber = {};
			var url = mbank.getApiURL() + 'GetOrderFlowNo.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				orderFlowNo = data.orderFlowNo;
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		//获取短信验证码
//		$("#getIdentifyCode").on("tap",function(){
//			var smsContent="理财购买交易：(尾号"
//			              + payAccount.substring(payAccount.length - 4, payAccount.length)
//			              + "),金额" + payAmount + "元，";
//			var param = {
//				payAmount : payAmount,
//				smsContent : smsContent,
//	 			id : $(this).attr("id")
//	 		}
//	 	 	mbank.getSmsCode(param);
//		});
		
		$("#confirmButton").on("tap",function(){
//			var tranPassword = $("#tranPassword").val();
//			if( tranPassword == "" ){
//				mui.alert("请输入银行卡取款密码！");
//				$("#tranPassword").focus();
//				return false;
//			}
//			var identifyCode = $("#identifyCode").val();
//		    if( identifyCode == "" ){
//		    	mui.alert("请输入短信验证码！");
//		    	return false;
//		    }
//	   	    if( !/^[0-9]{6}$/.test(identifyCode) ){
//	   	    	mui.alert("短信验证码必须为6位数字！");
//	   	    	return false;
//	   	    }		    	
		    var dataNumber = {
		    	payAccount : payAccount,
		    	payAmount : payAmount,
		    	cstno : cstno,
		    	cstType : cstType,
		    	certType : certType,
		    	certNo : certNo,
		    	productNo : productNo,
		    	productName : productName,
		    	orderFlowNo : orderFlowNo,
		    	projDeadLine : projDeadLine,
		    	yieldRate : yieldRate,
		    	originAmt : originAmt,
		    	increaseAmt : increaseAmt,
		    	productStatus : productStatus,
		    	managerCode : managerCode
//		    	accountPassword : tranPassword,
//		    	smsPassword : identifyCode
		    };
		    var url = mbank.getApiURL()+'009003_financingbuy_submit.do';
		    commonSecurityUtil.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var params = {
		    		payAmount : payAmount,
		    		noCheck:false,
		    		productType:productType
		    	};
				mbank.openWindowByLoad('productBuyResult.html','productBuyResult','slide-in-right',params);
		    }
		    function errorCallback(e){
		    	mui.alert(e.em);
		    }
		});
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		
		plus.key.addEventListener('menubutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
	});
});