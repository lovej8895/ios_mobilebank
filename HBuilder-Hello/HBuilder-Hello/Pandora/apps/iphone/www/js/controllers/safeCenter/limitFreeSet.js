define(function(require, exports, module) {
	var passwordUtil = require('../../core/passwordUtil');
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var nativeUI = require('../../core/nativeUI');
	var lengthp = 0;
	var passwordEncrypted1 = '';
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var cardNo = self.cardNo;
		var state = self.state;
		
		var pwd1 = document.getElementById('password_1');
		pwd1.readOnly = "readOnly";
		
		
		pwd1.addEventListener('click', function() {
			//开启纯数字密码键盘
			passwordUtil.openNumKeyboard('password_1', successCallback1, null);

		}, false);
		

		function successCallback1(retObj) {
			if(document.getElementById('password_1')) {
				document.getElementById('password_1').value = retObj.inputText;
			}
			if(document.getElementById('_password_1')) {
				document.getElementById('_password_1').value = retObj.cipherText;
			}
			var inputLength = retObj.inputText.length;
			if(lengthp < inputLength) {
				$("#pwd" + inputLength).html("<span></span>");
			} else if(lengthp > inputLength) {
				$("#pwd" + lengthp).html("");
			}
			lengthp = inputLength;
			if($("#pwd2").html() != '') {
				$("#pwd1").html("<span></span>");
			}
		}
		
		//点击确认付款按钮
		$("#submitBtn").click(function() {
			if(!passwordUtil.checkMatch('password_1')) {
				mui.alert('请输入合法账户密码');
				return false;
			}
			var accountPassword = jQuery('#password_1').val();
			if(!accountPassword) {
				mui.alert('账户密码不能为空');
				return false;
			}
			passwordEncrypted1 = document.getElementById("_password_1").value;
			if(passwordEncrypted1 == "" || passwordEncrypted1 == null) {
				mui.alert("请输入密码");
				return;
			}
			
				var url = mbank.getApiURL() + 'limitFreeSet.do';
				var openFlag;
				if(state == '0'){
					openFlag = 'N';
				}else if(state == '1'){
					openFlag = 'Y';
				}
				var params = {
					cardNo : cardNo,
					accountPassword: passwordEncrypted1,
					openFlag : openFlag,
					singleLimit : "0.0",
					totalLimit : "0.0"
				}
				mbank.apiSend('post', url, params, setSuccess, setError, false);
				function setSuccess(data){
					var resCoed = data.responseCodeNo;
					var resMsg = data.responseMessage;
					if(plus.os.name == "Android"){
						nativeUI.toast(resMsg);
					}else if('iOS'==plus.os.name){
						mui.alert(resMsg);
					}
					
					
					mui.fire(plus.webview.getWebviewById("limitFree"), 'refreshLimitList', {});
					plus.webview.close(self);
				}
				function setError(data){
					mui.alert(data.em);
				}

		});

		

	});
});