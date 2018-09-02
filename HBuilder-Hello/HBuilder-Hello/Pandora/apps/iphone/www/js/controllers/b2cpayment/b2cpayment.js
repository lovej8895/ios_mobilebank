define(function(require, exports, module) {
	var passwordUtil = require('../../core/passwordUtil');
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var lengthp = 0;
	var passwordEncrypted1 = '';
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var orderIdElem 	= document.getElementById("orderId");
		var orderDateElem 	= document.getElementById("orderDate");
		var sellerNameElem 	= document.getElementById("sellerName");
		var sellerNoElem 	= document.getElementById("sellerNo");
		var orderAmtElem 	= document.getElementById("orderAmt");
		var goodsNameElem 	= document.getElementById("goodsName");
		var goodsNumElem 	= document.getElementById("goodsNum");
		orderIdElem.innerHTML = self.orderId;
		orderDateElem.innerHTML = self.orderDate;
		sellerNameElem.innerHTML = self.sellerName;
		sellerNoElem.innerHTML = self.sellerNo;
		orderAmtElem.innerHTML = self.orderAmt;
		goodsNameElem.innerHTML = self.goodsName;
		goodsNumElem.innerHTML = self.goodsNum;
		
		var pwd1 = document.getElementById('password_1');
		pwd1.readOnly = "readOnly";
		
		passwordUtil.clearKeyboard('clear');
		pwd1.addEventListener('click', function() {
			//开启纯数字密码键盘
			passwordUtil.openNumKeyboard('password_1', successCallback1, null);

		}, false);
		
		setTimeout(function(){pwd1.click();},1000);

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
			
			if(inputLength==6){
				$("#submitBtn").click();
			}
		}
		
		//点击确认付款按钮
		$("#submitBtn").click(function() {
			passwordUtil.hideKeyboard('password_1');
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
			
			passwordUtil.clearKeyboard('clear');
			mbank.openWindowByLoad('_www/views/b2cpayment/b2cpayresult.html','b2cpayresult','slide-in-right',{result:true})
			
				/*var url = mbank.getApiURL() + 'limitFreeSet.do';
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
					mui.alert(resMsg);
					mui.fire(plus.webview.getWebviewById("limitFree"), 'refreshLimitList', {});
					plus.webview.close(self);
				}
				function setError(data){
					mui.alert(data.em);
				}
*/
		});


		plus.key.addEventListener('backbutton',function(){
				
				return false;
			},false);
		
		
		document.addEventListener('pause',function(){
			passwordUtil.clearKeyboard('clear');
		},true);
		
	});
});