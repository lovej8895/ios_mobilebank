define(function(require, exports, module) {
	
	// 引入依赖
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var passwordUtil = require('../../core/passwordUtil');
	
	mui.init();
	mui.plusReady(function(){
		var passwordEncrypted1="";
		var passwordEncrypted2="";
		var passwordEncrypted3="";
		var passwordEncrypted4="";
		
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var contextData = plus.webview.currentWebview();
		
		$("#certNo").text(contextData.certNo);
		$("#creditCardNo").text(contextData.creditCardNo);
		$("#mobileNo").text(contextData.mobileNo);
		
		var certTypeStr ="";
		var certType = contextData.certType;
		if (certType == "01") {
			certTypeStr = "居民身份证";
		}else if(certType == "02"){
			certTypeStr = "护照";
		}else if(certType == "03"){
			certTypeStr = "港澳台通行证";
		}else if(certType == "04"){
			certTypeStr = "军人证";
		}else if(certType == "05"){
			certTypeStr = "其它证件";
		}
		$("#certType").text(certTypeStr);
		
		/**
		 * 监听设置加密数据
		 */
		if($.param.SOFTPWD_SWITCH) {
			/*****************1.查询密码******************/
			var pwd1=doc.getElementById('password_1');
			pwd1.readOnly="readOnly";
			pwd1.addEventListener('click', function() {
				//开启纯数字密码键盘
				passwordUtil.openNumKeyboard('password_1',successCallback1,null);
				
			},false);
			function successCallback1(retObj){
					if(doc.getElementById('password_1')){
						doc.getElementById('password_1').value = retObj.inputText;
					}
					if(doc.getElementById('_password_1')){
						doc.getElementById('_password_1').value = retObj.cipherText;
					}
					if (doc.getElementById('_password_1_md5')) {
						doc.getElementById('_password_1_md5').value = retObj.md5Text;
					}
			}
			/*****************2.确认查询密码*****************/
			var pwd2=doc.getElementById('password_2');
			pwd2.readOnly="readOnly";
			pwd2.addEventListener('click', function() {
				//开启纯数字密码键盘
				passwordUtil.openNumKeyboard('password_2',successCallback2,null);
				
			},false);
			function successCallback2(retObj){
					if(doc.getElementById('password_2')){
						doc.getElementById('password_2').value = retObj.inputText;
					}
					if(doc.getElementById('_password_2')){
						doc.getElementById('_password_2').value = retObj.cipherText;
					}
					if (doc.getElementById('_password_2_md5')) {
						doc.getElementById('_password_2_md5').value = retObj.md5Text;
					}
			}
			/*****************3.交易密码*****************/
			var pwd3=doc.getElementById('password_3');
			pwd3.readOnly="readOnly";
			pwd3.addEventListener('click', function() {
				//开启纯数字密码键盘
				passwordUtil.openNumKeyboard('password_3',successCallback3,null);
				
			},false);
			function successCallback3(retObj){
					if(doc.getElementById('password_3')){
						doc.getElementById('password_3').value = retObj.inputText;
					}
					if(doc.getElementById('_password_3')){
						doc.getElementById('_password_3').value = retObj.cipherText;
					}
					if (doc.getElementById('_password_3_md5')) {
						doc.getElementById('_password_3_md5').value = retObj.md5Text;
					}
			}
			/*****************4.确认交易密码*****************/
			var pwd4=doc.getElementById('password_4');
			pwd4.readOnly="readOnly";
			pwd4.addEventListener('click', function() {
				//开启纯数字密码键盘
				passwordUtil.openNumKeyboard('password_4',successCallback4,null);
				
			},false);
			function successCallback4(retObj){
					if(doc.getElementById('password_4')){
						doc.getElementById('password_4').value = retObj.inputText;
					}
					if(doc.getElementById('_password_4')){
						doc.getElementById('_password_4').value = retObj.cipherText;
					}
					if (doc.getElementById('_password_4_md5')) {
						doc.getElementById('_password_4_md5').value = retObj.md5Text;
					}
			}
		}
		/**
		 * 校验密码信息
		 */
		function checkLoginInfo() {
			//获取密码
			if($.param.SOFTPWD_SWITCH){
				passwordEncrypted1=document.getElementById("_password_1").value;
				passwordEncrypted2=document.getElementById("_password_2").value;
				passwordEncrypted3=document.getElementById("_password_3").value;
				passwordEncrypted4=document.getElementById("_password_4").value;
				
				if(!passwordUtil.checkMatch('password_1')){
					plus.nativeUI.toast('请输入6位数字查询密码');
					return false;
				}
				if(!passwordUtil.checkMatch('password_2')){
					plus.nativeUI.toast('请输入6位数字确认查询密码');
					return false;
				}
				if(!passwordUtil.checkMatch('password_3')){
					plus.nativeUI.toast('请输入6位数字交易密码');
					return false;
				}
				if(!passwordUtil.checkMatch('password_4')){
					plus.nativeUI.toast('请输入6位数字确认交易密码');
					return false;
				}
				if(!passwordUtil.checkPwdIdentify('password_1','password_2')){
					plus.nativeUI.toast('两次输入的查询密码不一致');
					return false;
				}
				if(!passwordUtil.checkPwdIdentify('password_3','password_4')){
					plus.nativeUI.toast('两次输入的交易密码不一致');
					return false;
				}
			}else{
//				passwordEncrypted=passwordBox.value || '';
				//测试密码密文，对应网银登陆密码为111111a的用户
				passwordEncrypted1='AE5A578E0EF02E2532A588788E39E8BDF9903A65836B7971';
				passwordEncrypted2='AE5A578E0EF02E2532A588788E39E8BDF9903A65836B7971';
				passwordEncrypted3='AE5A578E0EF02E2532A588788E39E8BDF9903A65836B7971';
				passwordEncrypted4='AE5A578E0EF02E2532A588788E39E8BDF9903A65836B7971';
			}
			
			//密码非空校验
			if (passwordEncrypted1.IsEmpty()) {
				plus.nativeUI.toast('查询密码不能为空');
				return false;
			}
			if (passwordEncrypted2.IsEmpty()) {
				plus.nativeUI.toast('确认查询密码不能为空');
				return false;
			}
			if (passwordEncrypted3.IsEmpty()) {
				plus.nativeUI.toast('交易密码不能为空');
				return false;
			}
			if (passwordEncrypted4.IsEmpty()) {
				plus.nativeUI.toast('确认交易密码不能为空');
				return false;
			}
			return true;
		}
		//提交
		$("#nextStep").on("tap",function(){
			//确定校验
			if (!checkLoginInfo()) {
				return false;
			}
			
		    var params = {
		    	certType:contextData.certType,
		    	certNo:contextData.certNo,
		    	creditCardNo:contextData.creditCardNo,
		    	mobileNo:contextData.mobileNo,
		    	CVV2:contextData.cvv2No,
		    	searchPassword:passwordEncrypted1,
		    	confirmSearchPassword:passwordEncrypted2,
		    	tranPassword:passwordEncrypted3,
		    	confirmTranPassword:passwordEncrypted4,
		    	randomSum:passwordUtil.getRandomNumber(),
		    	temp2:"0001",
		    	cardpublicflag:"1"
		    };
		    var url = mbank.getApiURL()+'creditCardActivate.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		    	mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	mui.alert(data.em,"温馨提示");
				return;
				//var errorCode = "1";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		});
	});
});