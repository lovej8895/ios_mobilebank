define(function(require, exports, module) {
	//引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	var myAcctInfo = require('../../core/myAcctInfo');
	var passwordUtil = require('../../core/passwordUtil');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var accoutNoList= [];
	var f_deposit_acct = "";
	var f_new_deposit_acct="";
	var accountPicker;
	mui.init();
	mui.plusReady(function() {
		//锁定竖屏
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('010105',self);	//初始化账号信息，检查通过104107（交易账号变更）的新账号密码
		f_deposit_acct =self.accountNo;					//得到原签约账号
		accoutNoList =self.accoutNoList;					//得到卡列表
		queryDefaultAcct();//相关信息的加载
		function queryDefaultAcct() {
			var length = accoutNoList.length;
			if(length > 0) {
				getPickerList(accoutNoList);
				currentAcct = accoutNoList[0].accountNo;
				$("#recAccountShow").html(format.dealAccountHideFour(currentAcct));
			}else{
				mui.alert("您下挂借记卡只有一张，不能做交易账号变更","温馨提示","确认",function(event){
					plus.webview.close(self);
				});
			}
		}
		//加载账号	
		function getPickerList(accoutNoList){
			if( accoutNoList.length>0 ){
				var accountPickerList=[];
				for( var i=0;i<accoutNoList.length;i++ ){
					var accountNo=accoutNoList[i].accountNo;
					var pickItem={
						value:i,
						text:accountNo
					};
					accountPickerList.push(pickItem);
				}
			    accountPicker = new mui.SmartPicker({title:"请选择新交易账号",fireEvent:"recAccount"});
			    accountPicker.setData(accountPickerList);
			}
		}
		//点击账号事件
		$("#changeRecAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});
		
		// 选择账号填充到账文本框
		window.addEventListener("recAccount",function(event){
            var param=event.detail;			
            currentAcct=accoutNoList[param.value].accountNo;
            $("#recAccountShow").html(format.dealAccountHideFour(currentAcct));
    		$("#recAccount").val(currentAcct);
		});	
		
		$('#oldBankCard').html(format.dealAccountHideFour(f_deposit_acct));
		mbank.resizePage(".btn_bg_f2");//不让按钮弹上来
		
		document.getElementById("changeBankCard_Success").addEventListener('tap',function(){
			var params = {
				"f_deposit_acct":f_deposit_acct,	   //原账号
				"f_new_deposit_acct":currentAcct,      //新账号
				"payAccount":currentAcct     		   //密码控件账号
			};
			var url = mbank.getApiURL() + '104107_changeBankCard.do';
			commonSecurityUtil.apiSend('post', url , params, transferSuccess, transferError, true, false);
			function transferSuccess(data){
//				var datetime = data.f_transactiondate;
				var confirmButton = document.getElementById("changeBankCard_Success");
				var noCheck = confirmButton.getAttribute("noCheck");
				mbank.openWindowByLoad("../fund/changeBankCard_Success.html", "changeBankCard_Success", "slide-in-right", {noCheck:noCheck});
			}
			function transferError(data){
				mui.alert(data.em);
			}
		});
	});
});