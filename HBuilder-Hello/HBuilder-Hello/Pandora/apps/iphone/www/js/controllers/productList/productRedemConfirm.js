define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		 mbank.resizePage(".btn_bg_f2");
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('009004',self);
		var payAccount = self.payAccount;
		var productNo = self.productNo;
		var productName = self.productName;
		var finanTransferVol = self.finanTransferVol;
		var finanTransferVolShow = format.formatMoney(finanTransferVol, 2);
		var redemVol = self.redemVol;
		var redemVolShow = format.formatMoney(redemVol, 2);
		var hugeAmtflag = "1";	//巨额赎回标志:默认送1取消、0顺延
		var cstType = "1";		//客户类型
		var certType = userInfo.getSessionData("session_certType");
		var certNo = userInfo.getSessionData("session_certNo");
		var orderFlowNo = "";
		var customerNo = "";
		var customerName = "";
		var flag=self.flag;
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
		
		//获取理财账户信息
		queryCstInfo();
		function queryCstInfo() {
			var dataNumber = {
				certType : certType,
				certNo : certNo,
				cstType : cstType
			};
			var url = mbank.getApiURL() + 'queryCstInfo.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				var cstno = data.cstno;
				if (cstno != null) {
					customerNo = data.cstno;
					customerName = data.cstName;
					certType = data.certType;
					certNo = data.certNo;
				}
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		document.getElementById("productNo").innerHTML = productNo;
		document.getElementById("productName").innerHTML = productName;
		document.getElementById("finanTransferVol").innerHTML = finanTransferVolShow;
		document.getElementById("redemVol").innerHTML = redemVolShow;
		if(flag == "1"){
			document.getElementById("redemInfo").innerHTML = "快速赎回";
		}else{
			document.getElementById("redemInfo").innerHTML = "普通赎回";
		}
		
		$("#nextButton").click(function(){
			//commonSecurityUtil.initSecurityData('009006',jQuery.extend(self,{customerNo:customerNo}));
	    	var password = $("#tranPassword").val();
			if( password == "" ){
				mui.alert("请输入银行卡取款密码！");
				$("#tranPassword").focus();
				return false;
			}
	    	var dataNumber = {
	    		cstType : cstType,
	    		customerNo : customerNo,
	    		customerName : customerName,
	    		certType : certType,
	    		certNo : certNo,
	    		productNo : productNo,
	    		productName : productName,
	    		redemVol : redemVol,
	    		hugeAmtflag : hugeAmtflag,
	    		orderFlowNo : orderFlowNo,
	    		payAccount : payAccount,
	    		noCheck : false,
	    		flag:flag
	    	};
			var url = mbank.getApiURL() + '009006_infoSubmit.do';
			commonSecurityUtil.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
		    	var params = {
		    		noCheck : false,
		    		flag:flag
		    	};
				mbank.openWindowByLoad('productRedemResult.html','productRedemResult','slide-in-right',params);
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