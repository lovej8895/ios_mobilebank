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
	var currentAcct="";
	var accountPicker ="";
	//临时变量
	var accPayTotal1 = "";
	var accPayMin1 = "";
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		/*******页面加载还款金额类型默认设置********/
		$("#payAmountTypeShow").html("本期全额还款");
		$("#payAmountType").val("00");//初始化默认全额还款
		$('#payAmount').attr('readonly',true);//还款金额输入框默认只读
		
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					accountNameshow = iAccountInfoList[0].accountName;
					$("#recAccountShow").html(format.dealAccountHideFour(currentAcct));
					$("#recAccount").val(currentAcct);
					$("#accountName").val(accountNameshow);
					
					//应还金额查询
					queryCridetBalance(currentAcct);
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
		//切换账户
		$("#changeRecAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();
		});
		
		window.addEventListener("recAccount",function(event){
		   var pickItem1=event.detail;			
		   currentAcct=iAccountInfoList[pickItem1.value].accountNo;
		   $("#recAccountShow").html(format.dealAccountHideFour(currentAcct));
		   $("#recAccount").val(currentAcct);
			queryCridetBalance(currentAcct);
			
//			var payAmountType = $("#payAmountType").val();
//			if (payAmountType == "00") {
//				$('#payAmount').attr('readonly',true);
//				accPayTotal1 = $("#accPayTotal").val();				
//				$("#payAmount").val(format.formatMoney(accPayTotal1));
//			}else if (payAmountType == "01") {
//				$('#payAmount').attr('readonly',true);
//				accPayMin1 = $("#accPayMin").val();				
//				$("#payAmount").val(format.formatMoney(accPayMin1));
//			}else if(payAmountType == "02"){
//				$("#payAmount").val("");
//			}
		});
		
		//信用卡卡号的应还金额查询
		function queryCridetBalance(param){
			var url1 = mbank.getApiURL() + 'queryAccPayAmt.do';
			mbank.apiSend('post', url1, {
				recAccount: param
			}, callBack1, null, true);
			function callBack1(data){
				$("#accPayTotalShow").html("");
				$("#accPayMinShow").html("");
				$("#payAmount").val("");				
				var accpaytotal = data.accPayTotal;
				var accpaymin = data.accPayMin;
				var payamtype = jQuery("#payAmountType").val();
				
				$("#accPayTotalShow").html(format.formatMoney(accpaytotal));
				$("#accPayTotal").val(accpaytotal);
				$("#accPayMinShow").html(format.formatMoney(accpaymin));
				$("#accPayMin").val(accpaymin);
				
				if (payamtype == "00") {
					//全额还款
					$("#payAmount").val(format.formatMoney(accpaytotal));
				}else if (payamtype == "01") {
					//最低还款
					$("#payAmount").val(format.formatMoney(accpaymin));
				}else if (payamtype == "02") {
					//自定义
					$("#payAmount").val("");
				}
			}
		}
		
		//选择还款金额类型
		var userPicker = new mui.SmartPicker({title:"请选择还款金额类型",fireEvent:"payAmountType"});
			userPicker.setData([{
				value: '00',
				text: '本期全额还款'
			}, {
				value: '01',
				text: '本期最低还款额还款'
			}, {
				value: '02',
				text: '自定义'
			}]);

			$("#changePayAmountType").on("tap",function(){
				document.activeElement.blur();
				userPicker.show();			
			});
			
			window.addEventListener("payAmountType",function(event){
			   var payamttypevalue=event.detail;
			   document.getElementById("payAmountTypeShow").innerHTML = payamttypevalue.text;
			   //清除还款金额类型、还款金额文本
				$("#payAmountType").val("");
				$("#payAmount").val("");
				//根据选择金额类型更新还款金额
				if (payamttypevalue.value == "00") {
						$('#payAmount').attr('readonly',true);
						var accpaytotaltemp = "";
						accpaytotaltemp = $("#accPayTotal").val();
						$("#payAmount").val(format.formatMoney(accpaytotaltemp));
						$("#payAmountType").val(payamttypevalue.value);
				}else if(payamttypevalue.value == "01"){
						$('#payAmount').attr('readonly',true);
						var accpaymintemp ="";
						accpaymintemp = $("#accPayMin").val();
						$("#payAmount").val(format.formatMoney(accpaymintemp));
						$("#payAmountType").val(payamttypevalue.value);
				}else if(payamttypevalue.value == "02"){
						$("#payAmountType").val(payamttypevalue.value);
						$('#payAmount').attr('readonly',false);
				}
			});
			
			//输入金额
			$("#payAmount").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    	$(this).attr('type', 'number');
			}); 
			$("#payAmount").on("blur",function(){
				$(this).attr('type', 'text');
				if($(this).val()){
					$(this).val(format.formatMoney($(this).val(),2));
				}
			});
			//下一步
			$("#nextButton").click(function(){
				var recAccountTemp = $("#recAccount").val();
				if (recAccountTemp =="") {
					mui.alert("您没有加挂信用卡，无法操作此功能");
					return false;
				}
				var payAccountTemp = $("#payAccount").val();
				if (payAccountTemp =="") {
					mui.alert("请输入还款人账号");
					return false;
				}
				var p = /[^\d]/g;
				if (p.test(payAccountTemp)) {
					mui.alert("还款账号只能为数字");
					return false;
				}else if(payAccountTemp.indexOf(" ")>=0){
					mui.alert("还款账号不能有空格");
					return false;
				}else if(payAccountTemp.length > 32 || payAccountTemp.length < 6){
					mui.alert("还款账号长度应为6至32位");
					return false;
				}
				var payAmountTypeTemp = $("#payAmountType").val();
				var payAmountCheck = format.ignoreChar($("#payAmount").val(),',');
				if (payAmountCheck == "") {
					mui.alert("请输入还款金额！");
					return false;
				}else if (parseFloat(payAmountCheck)<=0) {
					mui.alert("请输入正确的还款金额！");
					return false;
				}
				var params2 = {
					recAccount:recAccountTemp,
					payAccount:payAccountTemp,
					payAmountType:payAmountTypeTemp,
					payAmount:payAmountCheck
				};
				var url = mbank.getApiURL()+'showCreditCardApprove.do';
		    	mbank.apiSend("post",url,params2,successCallback,errorCallback,true);
				 function successCallback(data){
		        	mbank.openWindowByLoad('../creditCard/otherInitiativeRefund_Confirm.html','otherInitiativeRefund_Confirm','slide-in-right',params2);
		    	}
		    	function errorCallback(data){
		    		var errorMsg = data.em;
		    		mui.alert(errorMsg);
					//var errorCode = "10";
					//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    	}
			});
			mbank.resizePage(".btn_bg_f2");
	});
});