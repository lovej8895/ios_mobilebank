define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();		
		var accountCardNo = self.f_deposit_acct; //交易账号									
		var f_prodname = self.f_prodname;	 //产品名称			
		var f_prodcode = self.f_prodcode; //产品代码
		var f_prodtype = self.f_prodtype; //产品类型
		var f_tano = self.f_tano;  //TA代码
		var f_avdilvol = self.f_avdilvol; //可用份额
		var f_applicationvol = self.f_applicationvol; //申请份额
		var f_largeredemptionflag = self.f_largeredemptionflag; //巨额赎回标识 
				
		commonSecurityUtil.initSecurityData('010202',self);
		
		f_applicationvol = format.formatMoney(f_applicationvol, 2);
		f_avdilvol = format.formatMoney(f_avdilvol, 2);
		document.getElementById("accountNo").innerHTML = accountCardNo;
		document.getElementById("productName").innerHTML = f_prodname;
		document.getElementById("avdilvol").innerHTML = f_avdilvol;
		document.getElementById("redemptionLot").innerHTML = f_applicationvol;
		$("#largerRedemption").html($.param.getDisplay("LARGE_REDEMPTION_FLAG",f_largeredemptionflag));
				
		var orderFlowNo = "";
		
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
		
		f_applicationvol=format.ignoreChar(f_applicationvol,',');
		$("#nextButton").click(function(){					
		    			
			var params = {
				orderFlowNo : orderFlowNo,
				f_deposit_acct : accountCardNo,
				f_prodname : f_prodname,
				f_prodtype : f_prodtype,
				f_tano : f_tano,				
				f_prodcode : f_prodcode,								
				f_applicationvol : f_applicationvol,
				f_largeredemptionflag : f_largeredemptionflag			
				};
	
			var url = mbank.getApiURL() + 'fundProRedemption.do';			
			commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);//密码校验
			function successCallback(data){
				if(data.ec=="000"){
					var f_ta_ack_date = data.f_ta_ack_date; //等待基金公司确认日期（预期）
					var f_closeTip = data.f_closeTip;//收市标志
					var params = {
						f_ta_ack_date : f_ta_ack_date,
						f_prodcode : f_prodcode,
						f_prodname : f_prodname,
						f_deposit_acct : accountCardNo,
						f_applicationvol : f_applicationvol,
						f_closeTip : f_closeTip,
					    noCheck:false
					};
					mbank.openWindowByLoad('../fund/fundRedemptionResult.html','fundRedemptionResult','slide-in-right',params);
				}else{
					mui.alert(e.em);
				}
			}
			function errorCallback(e){
				  mui.alert(e.em);
			}
											
	    });
	    
	    mbank.resizePage(".btn_bg_f2");
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