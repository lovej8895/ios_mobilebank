define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var passwordUtil = require('../../core/passwordUtil');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号a
	var currentAcct="";
	//是否预约交易，默认非预约
	var scheduleFlag="0";
	mui.init();
	mui.plusReady(function() {
		mbank.resizePage("#abc");
		plus.screen.lockOrientation("portrait-primary");
		
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allCardBack,"2");
			function allCardBack(data) {
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
				accountPicker = new mui.SmartPicker({title:"请选取款款账号",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value];
				$("#accountNo").html(format.dealAccountHideFour(currentAcct.accountNo));
				myAcctInfo.getAccAmt(currentAcct.accountNo,"balance",true);      
        });	
		//开启密码键盘
		if($.param.SOFTPWD_SWITCH) {
			var orderNum = document.getElementById("orderNum");
			orderNum.readOnly="readOnly";
			orderNum.addEventListener('click', function() {
				//开启密码键盘
				passwordUtil.openNumKeyboard('orderNum',null,null);
				
			},false);
		
		}
		
		if($.param.SOFTPWD_SWITCH) {
			var orderNum2 = document.getElementById("orderNum2");
			orderNum2.readOnly="readOnly";
			orderNum2.addEventListener('click', function() {
				//开启密码键盘
				passwordUtil.openNumKeyboard('orderNum2',null,null);
				
			},false);
			
		}
		
		var next = document.getElementById("drawInfo_Confirm");
		next.addEventListener('tap',function(){

			if(checkInfo()){
				var randomSum = passwordUtil.getRandomNumber();
				var path = this.getAttribute("path");
				var id = this.getAttribute("id");
				var noCheck = this.getAttribute("noCheck");
				var params = {
					cardNo : typeof currentAcct =='object'?currentAcct.accountNo:currentAcct,
					balance : document.getElementById("balance").outerText,
					orderMoney : $("#orderMoney").val(),
					orderNum : $("#_orderNum").val(),
					orderNum2 : $("#_orderNum2").val(),
					randomSum : randomSum,
					noCheck : noCheck
				};
				mbank.openWindowByLoad(path, id, 'slide-in-right',params);
			}
			
		});
		
		function checkInfo(){
			var reg = new RegExp("^[0-9]*.[0-9]{0,2}$");
			var orderMoney = document.getElementById("orderMoney").value;
			//mui.alert(orderMoney);
			if(""==orderMoney || null==orderMoney){
				document.getElementById("orderMoney").value = "";
				plus.nativeUI.toast("请输入符合要求的金额");
				return false;
			}
			if( 2000<$("#orderMoney").val() || $("#orderMoney").val()%100!=0 || $("#orderMoney").val()<=0){
				plus.nativeUI.toast("请输入小于2000且为100倍数的数字！");
				return false;
			}
			if(!passwordUtil.checkMatch('orderNum')){
				plus.nativeUI.toast("请输入6位数字预约码！");
				return false;
			}
			if(!passwordUtil.checkPwdIdentify("orderNum","orderNum2")){
				plus.nativeUI.toast("重复预约码与预约码不相符！");
				return false;
			}
			if(!reg.test($("#orderMoney").val())){
				plus.nativeUI.toast("请输入数字金额");
				return false;
			}
			return true;
		}
 		//物理键返回关闭密码键盘
 		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("orderNum");
			passwordUtil.hideKeyboard("orderNum2");
			mui.back();
		});
		
		plus.key.addEventListener('menubutton', function(){
			passwordUtil.hideKeyboard("orderNum");
			passwordUtil.hideKeyboard("orderNum2");
			mui.back();
		});
	    
	});

});