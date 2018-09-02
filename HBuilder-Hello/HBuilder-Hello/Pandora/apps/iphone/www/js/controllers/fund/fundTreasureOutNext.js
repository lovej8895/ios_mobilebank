define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
//	var f_cust_type = '1';
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
		var f_distributorcode;
		
		var f_redeem_flag =self.f_redeem_flag;//转出类型
		
		commonSecurityUtil.initSecurityData('010302',self);
		
		f_avdilvol = format.formatMoney(f_avdilvol, 2);
		document.getElementById("accountNo").innerHTML = accountCardNo;
		document.getElementById("productName").innerHTML = f_prodname + '(' + f_prodcode + ')';
		document.getElementById("redemptionLot").innerHTML = format.formatMoney(f_applicationvol, 2);
		
		
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
		
		$("#nextButton").click(function(){			    			
			var params = {
				orderFlowNo : orderFlowNo,
				f_prodname : f_prodname,
				f_prodtype : f_prodtype,			
				f_deposit_acct : accountCardNo,
				f_tano : f_tano,				
				f_prodcode : f_prodcode,								
				f_applicationvol : f_applicationvol,
				f_distributorcode : '948',
				f_redeem_flag:f_redeem_flag
				};
	
			var url = mbank.getApiURL() + 'fundTreasureOut.do';			
			commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);//密码校验
			function successCallback(data){
				if(data.ec=="000"){
					var f_ta_ack_date = data.f_ta_ack_date; //等待基金公司确认日期（预期）
					var params = {
						f_deposit_acct : accountCardNo,
						f_prodname : f_prodname,
						f_applicationvol : format.formatMoney(f_applicationvol, 2),
						f_allot_date:data.f_allot_date,
						f_redeem_flag:f_redeem_flag,
					    noCheck:false
					};
					mbank.openWindowByLoad('../fund/fundTreasureOutResult.html','fundTreasureOutResult','slide-in-right',params);
				}else{
					mui.alert(data.em);
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