define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	var f_cust_type = '1';
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();		
		var accountCardNo = self.accountCardNo; //交易账号									
		var f_prodname = self.f_prodname;	 //产品名称			
		var f_dividend = self.f_dividend;	//分红方式
		var f_tano = self.f_tano;  //TA代码		
		var f_prodcode = self.f_prodcode; //产品代码
		document.getElementById("accountNo").innerHTML = format.dealAccountHideFour(accountCardNo);
		document.getElementById("productName").innerHTML = f_prodname;
		//document.getElementById("shareType").innerHTML = f_dividend;
		$("#shareType").html($.param.getDisplay("DIVIDEND_METHOD",f_dividend));
		
		var newShareType = "";
		
		//原分红方式不让选择，优化
		if(f_dividend == 0){
			newShareType = '1';
			$("#newShareType").html($.param.getDisplay("DIVIDEND_METHOD",'1'));			
		}
		if(f_dividend == 1){
			newShareType = '0';
			$("#newShareType").html($.param.getDisplay("DIVIDEND_METHOD",'0'));		
		}

		var randomSum = passwordUtil.getRandomNumber();
			//var params = {"accountNo":accountCardNo,"randomSum":commonSecurityUtil.getRandomKey()};			
			var pwdId = document.getElementById("pwdId");
			pwdId.readOnly="readOnly";
			pwdId.addEventListener('click', function() {
				//开启密码键盘
				//passwordUtil.openRsaAesKeyboard('pwdId',null,null);
				passwordUtil.openNumKeyboard('pwdId',null,null);
				
			},false)
				
		$("#nextButton").click(function(){					
		    var password=$("#pwdId").val();		   
			if( ""==newShareType || newShareType == null ){
	    		mui.alert("请选择分红方式！");
	    		return false;
	        }
					
			/*if( ""==password || password == null ){
		    		mui.alert("请输入密码！");
		    		return false;
		    }
		    if(password.length!=6){
					mui.alert("密码长度为6位");
					return false;
			}*/
		    if(!passwordUtil.checkMatch('pwdId')){
				plus.nativeUI.toast("请输入6位数字密码！");
				return false;
				
			}
		    
		    shareChange();
		});
		

		function shareChange(){
	
			var datas = {
				accountPassword : $("#_pwdId").val(),
				randomSum : randomSum,
				f_deposit_acct : accountCardNo,
				f_tano  : f_tano,
				f_prodcode : f_prodcode,
				f_dividendmethod : newShareType,
				f_cust_type : f_cust_type
			};
			var url = mbank.getApiURL() + 'fundShareChange.do';			
			//mbank.apiSend("post",url,datas,successCallback,errorCallback,true);	
			commonSecurityUtil.apiSend("post",url,datas,successCallback,errorCallback,true);//密码校验
			function successCallback(data){
				var params = {
				    noCheck:false
				};
				mbank.openWindowByLoad('fundDividendResult.html','fundDividendResult','slide-in-right',params);
			}
			function errorCallback(e){
				  mui.alert(e.em);
			}		
			
		}
 
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