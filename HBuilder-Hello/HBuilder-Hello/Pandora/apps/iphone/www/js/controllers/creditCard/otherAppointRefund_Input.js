define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var iAccountInfoList = [];
	var accountPickerList=[];
	//当前选定账号
	var currentAcct ="";
	var accountPicker ="";
	var signFlag = "";
	var signFlagCN = "";
	var refundCard = "";
	var payAmountType = "";
	var payAmountTypeCN = "";
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#recAccountShow").html(format.dealAccountHideFour(currentAcct));
					$("#recAccount").val(currentAcct);
					
					queryCridetSign(currentAcct);
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡卡号",fireEvent:"recAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changeRecAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();
		});
		
		window.addEventListener("recAccount",function(event){
		   var pickItem1=event.detail;			
		   currentAcct=iAccountInfoList[pickItem1.value].accountNo;
		   $("#recAccountShow").html(format.dealAccountHideFour(currentAcct));
		   $("#recAccount").val(currentAcct);
		   queryCridetSign(currentAcct);
		});
		
		//查询信用卡约定状态
		function queryCridetSign(accparam){
			var url1 = mbank.getApiURL() + 'querySignArrange.do';
			mbank.apiSend('post', url1, {
				recAccount: accparam
			}, callBack1, null, true);
			function callBack1(data){
				signFlag = data.contract_flag;//签约标示
				if (signFlag == "Y") {
					signFlagCN = "已签约";
					$("#text_content_card").show();
					$("#text_content_payAmtType").show();
					$("#nextStep").show();
					$("#nextStep2").show();
					$("#nextStep3").hide();
				} else if(signFlag == "N"){
					signFlagCN = "未签约";
					$("#text_content_card").hide();
					$("#text_content_payAmtType").hide();
					$("#nextStep").hide();
					$("#nextStep2").hide();
					$("#nextStep3").show();
				}
				
				$("#signStatusShow").html(signFlagCN);
				refundCard = data.ap_account_no;//签约还款卡号
				payAmountType = data.min_payment_ind;//还款金额类型    F-全额还款，M-最小额还款，C-不自动还款
				if(payAmountType == "F"){
					payAmountTypeCN = "本期全额还款";
				}else if(payAmountType == "M"){
					payAmountTypeCN = "本期最低还款额还款";
				}
				
				$("#signStatusShow").html(signFlagCN);
				$('#payAccount').html(refundCard);
				$('#payAmountType').html(payAmountTypeCN);
			}
		}
		
		//签约按钮
        $("#nextStep3").on("tap",function(){
        	var recacctemp = $("#recAccount").val();
        	if (recacctemp == "") {
        		mui.alert("您没有加挂信用卡，无法操作此功能");
        		return false;
        	}
        	var params2 = {
        		recAccount:recacctemp,
        		cardpublicflag:"7",
        		noCheck:true
        	};
        	mbank.openWindowByLoad('otherAppointRefund_Signing_Input.html','otherAppointRefund_Signing_Input','slide-in-right',params2);
        });
        
        //修改按钮
		$("#nextStep").on("tap",function(){
        	var recacctemp1 = $("#recAccount").val();
        	if (recacctemp1 == "") {
        		mui.alert("您没有加挂信用卡，无法操作此功能");
        		return false;
        	}
        	var params = {
        		recAccount:recacctemp1,
        		cardpublicflag:"8",
        		noCheck:true
        	};
        	mbank.openWindowByLoad('otherAppointRefund_Signing_Input.html','otherAppointRefund_Signing_Input','slide-in-right',params);
        });
        
        //解约按钮
        $("#nextStep2").on("tap",function(){
        	var recacctemp2 = $("#recAccount").val();
        	if (recacctemp2 == "") {
        		mui.alert("您没有加挂信用卡，无法操作此功能");
        		return false;
        	}
        	
        	mui.confirm("您是否确认解除约定还款账户？解约之后，我行将不再发起约定扣款，请您自助还款，以免造成逾期。","温馨提示",["确认", "取消"], function(event){
        		if (event.index == 0) {
						var params3 = {
        				recAccount:recacctemp2,
        				cardpublicflag:"9"
        			};
        			var url = mbank.getApiURL()+'showCancelArrange.do';
		    		mbank.apiSend("post",url,params3,successCallback,errorCallback,true);
		    		function successCallback(data){
		        		mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params3);
		    		}
		    		function errorCallback(data){
		    			mui.alert(data.em);
		    		}
				} else{
					return;
				}
        	});
        });
	});
});