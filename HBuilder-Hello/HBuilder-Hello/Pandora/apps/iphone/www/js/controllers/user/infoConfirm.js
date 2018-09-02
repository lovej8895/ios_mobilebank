/**
 * author:suxing
 * 该页面为设备绑定第二个页面，显示证件类型与证件号码
 * 还有查询该账号下加挂的第一张银行卡，输入该银行卡卡密码
 * 与短信验证码验证通过后完成绑定
 */
define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	
	
	mui.init();//预加载
	mui.plusReady(function(){//页面初始化
		mbank.resizePage("#abc");
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var sessionTimeOut=self.sessionTimeOut;
		var certType = self.certType;
		var certNo = self.certNo;
		
		commonSecurityUtil.initSecurityData('002011', self);
		
		var cardNo;
		var cardPwd;
		var getSmsCode;
		
		//当前选定账号a
		var currentAcct="";
		//绑定账号列表
		var iAccountInfoList = [];
		//显示接收的证件类型
		document.getElementById("certType").innerText = certType;
		//显示接收的证件号码
		document.getElementById("certNo").innerText = certNo;
		//查询此帐号下所有帐号将第一个帐号显示
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allCardBack,"2");
			function allCardBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					//mui.alert(currentAcct);
					$("#cardNo").html(format.dealAccountHideFour(currentAcct));
					cardNo = currentAcct;
				}		
			}
		}
		//获取设备详细信息
		var deviceType = plus.device.vendor+" "+plus.device.model;
		var mpOS = plus.os.name+" "+plus.os.version;
		var mbUUID = plus.device.uuid;
		var boundSuccess = document.getElementById("boundSuccess");
		var customerId = localStorage.getItem("session_customerId");
		var mbIMSI = "";
		for ( var i=0; i<plus.device.imsi.length; i++ ) {
        	mbIMSI += plus.device.imsi[i];
    	}
		var screenResolution = plus.screen.resolutionWidth*plus.screen.scale + " x " + plus.screen.resolutionHeight*plus.screen.scale;
		var mbDPI = plus.screen.dpiX + " x " + plus.screen.dpiY;
		
		var path;
		var id;
		var noCheck;
		
		boundSuccess.addEventListener('tap',function(){
			//mui.alert("111");
			//cardPwd = document.getElementById("cardPwd").value;
			//getSmsCode = document.getElementById("identifyCode").value;
			
			
			
			//if( checkPwd(cardPwd) && checkSmsCode(getSmsCode) ){
				//mui.alert(cardPwd+" "+getSmsCode+" "+cardNo);
				var params = {
					session_customerId : customerId,
					cardNo : cardNo,
					cardPwd : cardPwd,
					smsCode : getSmsCode,
					deviceType : deviceType,
					mpOS : mpOS,
					mbUUID : mbUUID,
					mbIMSI : mbIMSI,
					screenResolution : screenResolution,
					mbDPI : mbDPI,
					payAccount : cardNo
				}
				var url = mbank.getApiURL() + 'deviceBound.do';
				commonSecurityUtil.apiSend('post', url, params, boundFun, boundError, false);
				
			//}
		});
		//绑定成功返回方法
		function boundFun(data){
			var loginView = plus.webview.getWebviewById("login");
			var beginView = plus.webview.getWebviewById('infoVerification');
			path = boundSuccess.getAttribute("path");
			id = boundSuccess.getAttribute("id");
			noCheck = boundSuccess.getAttribute("noCheck");
			//mbank.updateAffair();
			var fingerView = plus.webview.getWebviewById("loginByFinger");
			var unlockView = plus.webview.getWebviewById("unlock");
			if(beginView || loginView || fingerView || unlockView){
				plus.webview.close(beginView);
				plus.webview.close(loginView);
				plus.webview.close(fingerView);
				plus.webview.close(unlockView);
			}
			var params = {
				deviceType : deviceType,
				mpOS : mpOS,
				mbUUID : mbUUID,
				screenResolution : screenResolution,
				noCheck : noCheck,
				noClearDestination:true,
				sessionTimeOut:sessionTimeOut
			};
			plus.webview.close(loginView);
			mbank.openWindowByLoad(path, id, "slide-in-right",params);
			plus.webview.close(beginView);

		}
		
		function boundError(data){
			plus.nativeUI.toast(data.em);
		}
		
		//检查输入密码是否符合6为数字格式
		function checkPwd(num){
			var regx = /^\d{6}$/;
			if(""==num || null==num){
				mui.alert("请输入密码");
				return false;
			}
			if(!regx.test(num)){
				mui.alert("请输入6位密码");
				return false;
			}
			return true;
		}
		//检查输入短信验证码是否符合6位数字格式
		function checkSmsCode(num){
			var regx = /^\d{6}$/;
			if(""==num || null==num){
				mui.alert("短信验证码不能为空");
				return false;
			}
			if(!regx.test(num)){
				mui.alert("请输入6位验证码");
				return false;
			}
			return true;
		}
	});
});