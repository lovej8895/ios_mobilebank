define(function(require, exports, module) {
	
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var iAccountInfoList = [];
	var iAccountInfoList1 = [];
	
	var accountPickerList=[];
	var accountPickerList1=[];
	//当前选定账号
	var currentAcct="";
	var currentAcct1="";
	//金额
	var accPayTotal1 = "";
	var accPayMin1 = "";
	//信用卡账户名称
	var accountNameshow ="";
	var accountPicker = "";
	var accountPicker1 = "";
	var isOK;
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		/*******页面加载还款金额类型默认设置********/
		$("#payAmountTypeShow").html("本期全额还款");
		$("#payAmountType").val("00");//初始化默认全额还款
		
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
					
					isOK ='1';
					//应还金额查询
					queryAccountPayAmt(currentAcct);
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
               var param=event.detail;			
               currentAcct=iAccountInfoList[param.value].accountNo;
               $("#recAccountShow").html(format.dealAccountHideFour(currentAcct));
        		$("#recAccount").val(currentAcct);
        		queryAccountPayAmt(currentAcct);//选中信用卡卡号时查询信用卡号应还金额
		});
		//应还金额查询
		function queryAccountPayAmt(param){
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
			
		//如果有信用卡
		if (isOK =='1') {
			//初始化还款账号
			queryDefaultAcct1();
			function queryDefaultAcct1() {
			mbank.getAllAccountInfo(allAccCallBack1,"2");
			function allAccCallBack1(data) {
				iAccountInfoList1 = data;
				getPickerList1(iAccountInfoList1);
				var length2 = iAccountInfoList1.length;
				if(length2 > 0) {
					currentAcct1 = iAccountInfoList1[0].accountNo;
					$("#payAccountShow").html(format.dealAccountHideFour(currentAcct1));
					$("#payAccount").val(currentAcct1);
					myAcctInfo.getAccAmt(currentAcct1,"accBalanceDiv",true);
					}	
				}
			}
			function getPickerList1(iAccountInfoList1){
			if( iAccountInfoList1.length>0 ){
				accountPickerList1=[];
					for( var i=0;i<iAccountInfoList1.length;i++ ){
						var account1=iAccountInfoList1[i];
						var pickItem1={
							value:i,
							text:account1.accountNo
						};
						accountPickerList1.push(pickItem1);
					}
					accountPicker1 = new mui.SmartPicker({title:"请选择还款账号",fireEvent:"payAccount"});
				   	accountPicker1.setData(accountPickerList1);	
				}
			}
			$("#changePayAccount").on("tap",function(){
				document.activeElement.blur();
				accountPicker1.show();			
			});
			window.addEventListener("payAccount",function(event){
				var pickItem2=event.detail;
				currentAcct1=iAccountInfoList1[pickItem2.value].accountNo;
				$("#payAccountShow").html(format.dealAccountHideFour(currentAcct1));
				$("#payAccount").val(currentAcct1);
				myAcctInfo.getAccAmt(currentAcct1,"accBalanceDiv",true);
			});
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
				var accpaytotaltemp = "";
				accpaytotaltemp = $("#accPayTotal").val();
				$("#payAmount").val(format.formatMoney(accpaytotaltemp));
				$("#payAmountType").val(payamttypevalue.value);
			}else if(payamttypevalue.value == "01"){
				var accpaymintemp ="";
				accpaymintemp = $("#accPayMin").val();
				$("#payAmount").val(format.formatMoney(accpaymintemp));
				$("#payAmountType").val(payamttypevalue.value);
			}else if(payamttypevalue.value == "02"){
				$("#payAmountType").val(payamttypevalue.value);
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
			var payAmountCheck = format.ignoreChar($("#payAmount").val(),',');
			var accBalanceDiv1Check = format.ignoreChar($("#accBalanceDiv").html(),',');
			var accPayMinCheck = $("#accPayMin").val();			

			if(parseFloat(accBalanceDiv1Check)-parseFloat(payAmountCheck)<0){
				mui.alert("所选还款账号可用余额不足！");
				return false;
			}else if(payAmountCheck == ""){
				mui.alert("请输入还款金额！");
				return false;
			}else if(parseFloat(payAmountCheck)<=0){
				mui.alert("请输入正确的还款金额！");
				return false;
			}
			//跳入确认页
			var recAccountTemp = $('#recAccount').val();
			var payAccountTemp = $('#payAccount').val();
			var payAccountNameTemp = $('#accountName').val();
			var payAmountTypeTemp = $('#payAmountType').val();
			
			var params2 = {
				recAccount: recAccountTemp,
				payAccount: payAccountTemp,
				accountName: payAccountNameTemp,
				payAmountType: payAmountTypeTemp,
				payAmount: payAmountCheck,
				noCheck:true
			};
			mbank.openWindowByLoad('thisInitiativeRefund_Confirm.html','thisInitiativeRefund_Confirm','slide-in-right',params2);
		});
		
		mbank.resizePage(".btn_bg_f2");
	});	
	
});