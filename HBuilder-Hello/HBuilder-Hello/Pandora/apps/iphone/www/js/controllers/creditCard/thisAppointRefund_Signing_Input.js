define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var iAccountInfoList1 = [];
	var accountPickerList=[];
	var currentAcct1="";
	var stateFlag = false;
	var accountStat = '0';
	var accountPicker ="";
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		/*******页面加载还款金额类型默认设置********/
		$("#payAmountTypeShow").html("本期全额还款");
		$("#payAmountType").val("F");//初始化默认全额还款
		
		var contextData = plus.webview.currentWebview();
		$("#recAccount").text(contextData.recAccount);
		
		//查询借记卡卡号
		queryDefaultAcct1();
		function queryDefaultAcct1() {
			mbank.getAllAccountInfo(allAccCallBack1,"2");
			function allAccCallBack1(data) {
				iAccountInfoList1 = data;
				getPickerList(iAccountInfoList1);
				var length2 = iAccountInfoList1.length;
				if(length2 > 0) {
					currentAcct1 = iAccountInfoList1[0].accountNo;
					$("#payAccountShow").html(format.dealAccountHideFour(currentAcct1));
					$("#payAccount").val(currentAcct1);
					queryAcctBalance(currentAcct1);
				}	
			}
		}
		function getPickerList(iAccountInfoList1){
			if( iAccountInfoList1.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList1.length;i++ ){
					var account=iAccountInfoList1[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择借记卡卡号",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changeRecAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();
		});
		window.addEventListener("payAccount",function(event){
		   var pickItem1=event.detail;			
		   currentAcct1=iAccountInfoList1[pickItem1.value].accountNo;
		   $("#payAccountShow").html(format.dealAccountHideFour(currentAcct1));
		   $("#payAccount").val(currentAcct1);
			queryAcctBalance(currentAcct1);
		});
		
		
		
		//查询账户余额
		function queryAcctBalance(params){
			var url1 = mbank.getApiURL() + 'newBalanceQuery.do';
			mbank.apiSend('post', url1, {
				accountNo: params
			}, callBack1, null, false);
			function callBack1(data){
				accountStat = data.accountStat;
				if(data.accountStat!='0' && data.accountStat!='2'){
					stateFlag = true;
					mui.alert("所选账户状态异常");
					return false;
				}else{
					stateFlag = false;
				}
			}
		}
		
		//选择还款金额类型
		var userPicker = new mui.SmartPicker({title:"请选择还款金额类型",fireEvent:"payAmountType"});
			userPicker.setData([{
				value: 'F',
				text: '本期全额还款'
			}, {
				value: 'M',
				text: '本期最低还款额还款'
			}]);
			$("#changePayAmountType").on("tap",function(){
				document.activeElement.blur();
				userPicker.show();			
			});
			window.addEventListener("payAmountType",function(event){
			   var payamttypevalue=event.detail;
			   document.getElementById("payAmountTypeShow").innerHTML = payamttypevalue.text;
			   //清除还款金额类型
			   $("#payAmountType").val("");
			   if (payamttypevalue.value == "F") {
			   		$("#payAmountType").val(payamttypevalue.value);
			   	}else if(payamttypevalue.value == "M"){
			   		$("#payAmountType").val(payamttypevalue.value);
				}
			});
			
		//下一步
		$("#nextStep").on("tap",function(){
        	var recacctemp = contextData.recAccount;
        	if (recacctemp == "") {
        		mui.alert("您没有加挂信用卡，无法操作此功能");
        		return false;
        	}
        	if(stateFlag){
				mui.alert("所选账户状态异常");
				return false;
			}
        	
        	var transferType = "1";//本行约定还款
        	var payAccount = $("#payAccount").val();
        	var payAmountType = $("#payAmountType").val();
        	
        	var params1 = {
        		recAccount:contextData.recAccount,
        		transferType:transferType,
        		payAccount:payAccount,
        		payAmountType:payAmountType,
        		cardpublicflag:contextData.cardpublicflag,
        		noCheck:true
        	};
        	mbank.openWindowByLoad('thisAppointRefund_Confirm.html','thisAppointRefund_Confirm','slide-in-right',params1);
        });
        mbank.resizePage(".btn_bg_f2");
	});
});