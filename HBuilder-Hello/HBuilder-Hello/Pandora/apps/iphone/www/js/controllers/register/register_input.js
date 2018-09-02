define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var CHECK_CODE = "";
	$.init();
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var mobileElem    = doc.getElementById('mobileNo');
		var codeElem    = doc.getElementById('checkCode');
		var getCodeBtn  = doc.getElementById('getCheckCode');
		var submitBtn   = doc.getElementById('submitBtn');
		
		//获取验证码
		getCodeBtn.addEventListener('tap',function(ev){
			var mobileNo = mobileElem.value;
			if(IsEmpty(mobileNo)){
				plus.nativeUI.toast('手机号码不能为空');
				return false;
			}
			
			if(mobileNo.length!=11){
				plus.nativeUI.toast('请输入11位手机号码');
				return false;
			}
			
			jQuery("#checkCode").focus();
			
			var params = {};
			params.mobileNo = mobileNo;
			params.liana_notCheckUrl=false;
			params.serviceCode = "EANK_REG";
			params.smsContent = ',欢迎您自助注册签约手机银行，请保密并确认本人操作。';
			mbank.getMobileCode("getCheckCode",params,callBack);
			
			function callBack(data){
				var result = data.smsSendResult;
				var checkcode = data.checkCode;
				//待修改 测试环境失败也赋值验证码
//				if(result=='0'&&checkcode){
					CHECK_CODE = checkcode;
//				}
			}
		},false);
		
		
		submitBtn.addEventListener('tap',function(e){
			var checkCode = codeElem.value;
			var mobileNo = mobileElem.value;
			if(IsEmpty(mobileNo)){
				plus.nativeUI.toast('手机号码不能为空');
				return false;
			}
			
			if(IsEmpty(checkCode)){
				plus.nativeUI.toast('验证码不能为空');
				return false;
			}
			
			if(mobileNo.length!=11){
				plus.nativeUI.toast('请输入11位手机号码');
				return false;
			}
			
			/*if(!isNumber(checkCode)){
				plus.nativeUI.toast('请输入正确格式验证码');
				return false;
			}*/
			if(CHECK_CODE!==checkCode){
				plus.nativeUI.toast('验证码输入错误');
				return false;
			}
			

			var params = {mobileNo:mobileNo};
			var url = mbank.getApiURL()+"registerNext.do";
			mbank.apiSend('post',url,params,successCallback,errorCallback,true);
			
			function successCallback(data){
				var url = 'register_next.html';
				var pgid = 'registerNext';
				var show = "slide-in-right";
				var params = {mobileNo:mobileNo,checkcode:checkCode};
				//跳转到注册第二个页面
				mbank.openWindowByLoad(url,pgid,show,params);
				CHECK_CODE = null;
			}
			
			function errorCallback(data){
				mui.alert(data.em, null, mbank.getAppName, '确定');
			}
		},false);
		
		
	/*	//提交交易
		nextBtn.addEventListener("tap", function(event) {
			if(checkFun()) {
				fillInfo = {
					accountNo: accountBank.value, //银行账号
					certValidateDate: "",
					certNo: certNo.value, //身份证号
					accountPassword: drawPassword.value, //取款密码
					acctType: "01",
					certType: "0",
					mvcId: "",
					waitTitle: "正在注册..."
				};
				var url = mbank.getApiURL() + 'registerConfirm.do';
				mbank.apiSend('post', url, fillInfo, callBack, failFun, true);
			}
		}, false)

		//成功返回的函数
		function callBack(data) {
			plus.nativeUI.toast('填写成功，请进入下一步');
			$.openWindow({
				url: 'register_confirm.html',
				id: 'register_confirm',
				show: {
					aniShow: 'pop-in'
				},
				createNew: true,
				styles: {
					popGesture: 'hide'
				},
				extras: {
					accountNo: accountBank.value, //银行账号
					certNo: certNo.value, //身份证号
					accountPassword: drawPassword.value //交易密码

				},
				waiting: {
					autoShow: false
				}
			});
		}

		function failFun(data) {
			plus.nativeUI.toast("尊敬的客户，您的信息已注册，请您直接登录")
		}*/

		//协议

		/*agreement.addEventListener("tap", function() {
			$.openWindow({
				url: 'registerAgreement.html',
				id: 'agreement',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false)*/

		//协议跳转
		doc.getElementById("protocol").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path,id,"slide-in-right",{noCheck:noCheck});
		});
		//格式
		function checkFun() {
			var accountBankVal = accountBank.value || '',
				drawPasswordVal = drawPassword.value || '',
				certNoVal = certNo.value || '';

			if(accountBankVal == "") {
				plus.nativeUI.toast('银行卡不能为空');
				return false;
			} else if(!isNumber(accountBankVal) || accountBankVal.length > 30 || accountBankVal.length < 15) {
				plus.nativeUI.toast('银行卡输入错误');
				return false;
			} else if(drawPasswordVal == "") {
				plus.nativeUI.toast('取款密码不能为空');
				return false;
			} else if(drawPasswordVal.length != 6) {
				plus.nativeUI.toast('请输入六位取款密码');
				return false;
			} else if(!isNumber(drawPasswordVal)) {
				plus.nativeUI.toast('取款密码只能为数字');
				return false;
			} else if(certNoVal == "") {
				plus.nativeUI.toast('身份证号不能为空');
				return false;
			} else if(certNoVal.length != 18) {
				plus.nativeUI.toast('您的身份证号输入有误,请重新输入');
				return false;
			} else if(!chk.checked) {
				plus.nativeUI.toast('请同意注册协议');
				return false;
			} else {
				return true;
			}
		}
		
		
		
		mbank.resizePage('.but_bottom20px');
		
		plus.key.addEventListener('backbutton',function(){
			mui.back();
		})

	});
});