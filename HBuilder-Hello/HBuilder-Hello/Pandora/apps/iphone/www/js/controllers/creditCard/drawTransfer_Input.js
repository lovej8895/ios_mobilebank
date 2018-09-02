define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var iAccountInfoList = [];
	var accountPickerList = [];
	var iAccountInfoListTemp = [];
	var accountPickerListTemp=[];
	//当前选定账号
	var currentAcct ="";
	var accountPicker;
	var accountPickerTemp;
	var currentAcctTemp;
	
	var balanceTemp ="";//余额
	var creditUseLimitTemp ="";//可用额度
	var balanceAvailableTemp ="";//可用余额
	var accountStatTemp ="";//账户状态
	var isOk;
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
					$("#payAccountShow").html(format.dealAccountHideFour(currentAcct));
					$("#payAccount").val(currentAcct);
					queryCridetBalance(currentAcct);
					isOk = '1';
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡卡号",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changePayAccount").on("tap",function(){
//			accountPicker.show(function(items) {
//				var pickItem1=items[0];
//				currentAcct=iAccountInfoList[pickItem1.value].accountNo;
//				$("#payAccountShow").html(format.dealAccountHideFour(currentAcct));
//				$("#payAccount").val(currentAcct);
//				queryCridetBalance(currentAcct);
//			});	
			document.activeElement.blur();
			accountPicker.show();
		});
		window.addEventListener("payAccount",function(event){
		   var pickItem1=event.detail;			
		   currentAcct=iAccountInfoList[pickItem1.value].accountNo;
		   $("#payAccountShow").html(format.dealAccountHideFour(currentAcct));
		   $("#payAccount").val(currentAcct);
		   queryCridetBalance(currentAcct);
		});
		
		//查询信用卡可转账额度
		function queryCridetBalance(accparam){
			var url1 = mbank.getApiURL() + 'queryAccPayAmtOver.do';
			mbank.apiSend('post', url1, {
				payAccount: accparam
			}, callBack1, null, true);
			function callBack1(data){
				var cashAvbLimittemp = data.CashAvbLimit;
				if (cashAvbLimittemp == "") {
					$("#CashAvbLimitShow").html("0.00");
					$("#CashAvbLimit").val();
				} else{
					$("#CashAvbLimitShow").html(format.formatMoney(cashAvbLimittemp));
					$("#CashAvbLimit").val(cashAvbLimittemp);
				}
			}
		}
		
		if (isOk == '1') {
			getTolerantAccount();
		}
		//获取收款账号
		function getTolerantAccount(){
			mbank.getAllAccountInfo(allAccCallBack,"2");
			function allAccCallBack(data){
				iAccountInfoListTemp = data;
				getPickerListTemp(iAccountInfoListTemp);
				var lengthTemp = iAccountInfoListTemp.length;
				if (lengthTemp > 0) {
					currentAcctTemp = iAccountInfoListTemp[0].accountNo;
					$("#recAccountShow").html(format.dealAccountHideFour(currentAcctTemp));
					$("#recAccount").val(currentAcctTemp);
					queryAcctBalance(currentAcctTemp);
				}
			}
		}
		function getPickerListTemp(iAccountInfoListTemp){
			if( iAccountInfoListTemp.length>0 ){
				accountPickerListTemp=[];
					for( var j=0;j<iAccountInfoListTemp.length;j++ ){
						var account1=iAccountInfoListTemp[j];
						var pickItem1={
							value:j,
							text:account1.accountNo
						};
						accountPickerListTemp.push(pickItem1);
					}
					accountPickerTemp = new mui.SmartPicker({title:"请选择收款账号",fireEvent:"recAccount"});
			   		accountPickerTemp.setData(accountPickerListTemp);
				}
		}
		$("#changeRecAccount").on("tap",function(){
//			accountPickerTemp.show(function(items) {
//				var pickItem2=items[0];
//				currentAcctTemp=iAccountInfoListTemp[pickItem2.value].accountNo;
//				$("#recAccountShow").html(format.dealAccountHideFour(currentAcctTemp));
//				$("#recAccount").val(currentAcctTemp);
//				queryAcctBalance(currentAcctTemp);
//			});
			document.activeElement.blur();
			accountPickerTemp.show();
		});
		window.addEventListener("recAccount",function(event){
		   var pickItem2=event.detail;			
		   currentAcctTemp=iAccountInfoListTemp[pickItem2.value].accountNo;
		   $("#recAccountShow").html(format.dealAccountHideFour(currentAcctTemp));
		   $("#recAccount").val(currentAcctTemp);
			queryAcctBalance(currentAcctTemp);
		});
		
		//查询收款账号的账户余额
		function queryAcctBalance(recparam){
			var url2 = mbank.getApiURL() + 'newBalanceQuery.do';
			mbank.apiSend('post', url2, {
				accountNo: recparam
			}, callBack2, null, false);
			function callBack2(data){
				if (data.balanceAvailable == "") {
					$("#balanceVal").val("0.00");
					$("#creditUseLimitVal").val("0.00");
					$("#balanceAvailableVal").val("0.00");
					$("#accountStatVal").val("0.00");
				} else{
					$("#balanceVal").val(data.balance);
					$("#creditUseLimitVal").val(data.creditUseLimit);
					$("#balanceAvailableVal").val(data.balanceAvailable);
					$("#accountStatVal").val(data.accountStat);
					console.log(data.balance+";"+data.creditUseLimit+";"+data.balanceAvailable+";"+data.accountStat);
				}
				if (data.accountStat!='0' && data.accountStat!='2') {
					mui.alert("所选账户状态异常");
					return false;
				}
			}
		}
		
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
		$("#nextStep").click(function(){
			var payAccount = $("#payAccount").val();
			var accountstat = $("#accountStatVal").val();
			var payAmount = format.ignoreChar($("#payAmount").val(),',');
			var CashAvbLimit = $("#CashAvbLimit").val();//可转账额度
			var recAccount = $("#recAccount").val();//收款账号
			if(payAccount ==''||payAccount==null||payAccount==undefined){
				mui.alert("您没有加挂信用卡，无法操作此功能！");
				return false;
			}
			if (accountstat!='0' && accountstat!='2') {
				mui.alert("所选账户状态异常");
				return false;
			}
			if (payAmount == "") {
				mui.alert("请输入还款金额！");
				return false;
			}
			if (parseFloat(payAmount)<=0) {
				mui.alert("请输入正确的还款金额！");
				return false;
			}
			if (parseFloat(payAmount)-parseFloat(CashAvbLimit)>0) {
				mui.alert("所选信用卡可转账额度不足");
				return false;
			}
			var params2 = {
				recAccount:recAccount,
				payAmount:payAmount,
				payAccount:payAccount,
				noCheck:true
			};
			mbank.openWindowByLoad('drawTransfer_Confirm.html','drawTransfer_Confirm','slide-in-right',params2);
		});
		mbank.resizePage(".btn_bg_f2");
	});
});