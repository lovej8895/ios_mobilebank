define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	var checkCodeVal ="";
	mui.init();//预加载
	mui.plusReady(function(){//页面初始化
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var certTypeShow ="";//证件类型
		var certNoShow ="";//证件号码
		var creditCardNoShow ="";//信用卡卡号
		var mobileNumShow ="";//手机号码
		var cvv2NoShow ="";//信用卡CVV2码
		var checkcodeShow ="";//短信验证码
		
		var mobilenumtemp ="";//预留手机号码
		var checkcodetemp ="";//预留短信验证码
		
		//初始化证件类型
		document.getElementById('certTypeShow').innerText = "居民身份证";
		$("#certType").val("01");
		//获取手机验证码
		$("#sendCodeId").on("click",function(){
			
			//校验信用卡卡号
			var creditCardNo = ignoreSpaces($("#creditCardNo").val());
			var mobileNo = ignoreSpaces($("#mobileNo").val());
			var certnoTemp = ignoreSpaces($("#certNo").val());		
			var certnoTempUp = certnoTemp.toUpperCase();//证件号码转大写
			var certTypeShowTemp = $("#certType").val();
			var cvv2NoShowTemp = ignoreSpaces($("#cvv2No").val());
			
			//校验证件号码
			if (certnoTempUp!="") {
				if (certTypeShowTemp == "01") {
					var IDCertNoReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$/;
					if (!new RegExp(IDCertNoReg).test(certnoTempUp)) {
						mui.alert("证件号码非法");
						return false;
					}
				}else{
					var OtherCertNoReg = /^[^!@#$%\^&*()_+={}/|.\[\],\:;'"<>?；：’“，。？、~]+$/;
					if (!new RegExp(OtherCertNoReg).test(certnoTempUp)) {
						mui.alert("证件号码非法");
						return false;
					}
				}
			} else{
				mui.alert("证件号码不能为空");
				return false;
			}
			if (!isNumber(creditCardNo)) {
				mui.alert("请输入信用卡卡号");
				return false;
			}
			if (creditCardNo.length < 16) {
				mui.alert("信用卡卡号长度有误");
				return false;
			}
			//校验信用卡CVV2码
			if (cvv2NoShowTemp == "") {
				mui.alert("请输入信用卡CVV2码");
				return false;
			}
			if (cvv2NoShowTemp.length!=3) {
				mui.alert("请输入信用卡背面签名栏后三位");
				return false;
			}
			//校验手机号码
			if (mobileNo == "") {
				mui.alert("请输入正确的手机号码");
				return false;
			}
			if (mobileNo!="") {
				if (!new RegExp(/^(1[1-9])[0-9]{9}$/).test(mobileNo)) {
					mui.alert("请输入正确的手机号码");
					return false;
				}
			}
			
			//信用卡激活获取卡号对应手机号码
			var url3 = mbank.getApiURL() + 'noSessionLimitQuery.do';
			mbank.apiSend('post', url3, {
				cardNo:creditCardNo,
				temp:"2"
			}, callBack3, null, false);
			function callBack3(data){
				console.log("mobile :" +data.mobileTemp);
				if (data.mobileTemp == mobileNo) {
					sendCode(data.mobileTemp);//发送手机激活动态短信验证码
				} else{
					mui.alert("手机号不匹配")
					return false;
				}
			}
		});
		
		//发送手机激活动态短信验证码
		function sendCode(mobparam){
			$("#sendCodeId").attr("disabled","disabled").addClass("disabled");
			var url4 = mbank.getApiURL() + 'creditCardActivateSms.do';
			mbank.apiSend('post', url4, {
						mobileNo: mobparam
			}, queryLogBack, null, false);
			function queryLogBack(data){
				console.log("checkCode :" +data.checkCode);
				checkCodeVal = data.checkCode;
				sendMessage("sendCodeId",99);
			}
			sendMessage=function(id,second){
				if(second>=0){
					$("#"+id).html("重新获取("+second +")");
					second--;
					setTimeout(function(){sendMessage(id,second);},1000);
				}else{
					$("#"+id).html("获取验证码");
					$("#" + id).removeAttr("disabled").removeClass("disabled");
				}
	    	};
		}
		
		//去除空格
		function ignoreSpaces(string) {
			var temp = "";
			string = '' + string;
			splitstring = string.split(" ");
			for (i = 0; i < splitstring.length; i++)
				temp += splitstring[i];
			return temp;
		}
		
		//选择证件类型
		var userPicker = new mui.SmartPicker({title:"请选择证件类型",fireEvent:"accountType"});
			userPicker.setData([{
				value: '01',
				text: '居民身份证'
			}, {
				value: '02',
				text: '护照'
			}, {
				value: '03',
				text: '港澳台通行证'
			}, {
				value: '04',
				text: '军人证'
			}, {
				value: '05',
				text: '其它证件'
			}]);
			var showUserPickerButton = document.getElementById('changecertType');
			/*var userResult = document.getElementById('certTypeShow');
			showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
					userResult.innerText = items[0].text;
					var certTypevalue ="";
					certTypevalue = items[0].value;
					//清除证件类型文本
					$("#certType").val("");
					//更新证件类型
					if (certTypevalue == "01") {
						$("#certType").val(certTypevalue);
					}else if (certTypevalue == "02") {
						$("#certType").val(certTypevalue);
					}else if (certTypevalue == "03") {
						$("#certType").val(certTypevalue);
					}else if (certTypevalue == "04") {
						$("#certType").val(certTypevalue);
					}else if (certTypevalue == "05") {
						$("#certType").val(certTypevalue);
					}
				});
			}, false);*/
			$("#changecertType").on("tap",function(){
				document.activeElement.blur();
				userPicker.show();			
			});

        window.addEventListener("accountType",function(event){
                var certTypevalue=event.detail;	
                document.getElementById("certTypeShow").innerText = certTypevalue.text;
                //清除证件类型文本
					$("#certType").val("");
					//更新证件类型
					if (certTypevalue.value == "01") {
						$("#certType").val(certTypevalue.value);
					}else if (certTypevalue.value == "02") {
						$("#certType").val(certTypevalue.value);
					}else if (certTypevalue.value == "03") {
						$("#certType").val(certTypevalue.value);
					}else if (certTypevalue.value == "04") {
						$("#certType").val(certTypevalue.value);
					}else if (certTypevalue.value == "05") {
						$("#certType").val(certTypevalue.value);
					}
				 
        });
		
		
		//下一步
		$("#nextButton").click(function(){
			var certNoToUp ="";
			certTypeShow = $("#certType").val();
			certNoShow = ignoreSpaces($("#certNo").val());
			certNoToUp = certNoShow.toUpperCase();//证件号码转大写
			creditCardNoShow = $("#creditCardNo").val();
			mobilenumtemp = ignoreSpaces($("#mobileNo").val());
			cvv2NoShow = ignoreSpaces($("#cvv2No").val());
			checkcodetemp = ignoreSpaces($("#checkCode").val());
			
			//校验证件号码
			if (certNoToUp!="") {
				if (certTypeShow == "01") {
					var IDCertNoReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$/;
					if (!new RegExp(IDCertNoReg).test(certNoToUp)) {
						mui.alert("证件号码非法");
						return false;
					}
				}else{
					var OtherCertNoReg = /^[^!@#$%\^&*()_+={}/|.\[\],\:;'"<>?；：’“，。？、~]+$/;
					if (!new RegExp(OtherCertNoReg).test(certNoToUp)) {
						mui.alert("证件号码非法");
						return false;
					}
				}
			} else{
				mui.alert("证件号码不能为空");
				return false;
			}
			//校验信用卡卡号
			if (!isNumber(creditCardNoShow)) {
				mui.alert("请输入信用卡卡号");
				return false;
			}
			if (creditCardNoShow.length < 16) {
				mui.alert("信用卡卡号长度不能小于16个字符");
				return false;
			}		
			//校验手机号码
			
			if (mobilenumtemp == "") {
				mui.alert("请输入手机号码");
				return false;
			}
			if (mobilenumtemp!="") {
				if (!new RegExp(/^(1[1-9])[0-9]{9}$/).test(mobilenumtemp)) {
					mui.alert("请输入正确的手机号码");
					return false;
				}
			}		
			//校验信用卡CVV2码
			if (cvv2NoShow == "") {
				mui.alert("请输入信用卡CVV2码");
				return false;
			}
			if (cvv2NoShow.length!=3) {
				mui.alert("请输入信用卡背面签名栏后三位");
				return false;
			}			
			//校验短信验证码
			if (checkcodetemp == "") {
				mui.alert("短信验证码不能为空");
				return false;
			}
			//校验短信验证码
			if (!(checkCodeVal!=null && checkCodeVal!=""&&checkCodeVal==checkcodetemp)) {
				mui.alert("短信验证码输入错误");
				return false;
			}
			//跳入确认页
			var params2 = {
				certType:certTypeShow,
				certNo:certNoToUp,
				creditCardNo:creditCardNoShow,
				mobileNo:mobilenumtemp,
				cvv2No:cvv2NoShow,
				checkCode:checkcodetemp,
				noCheck:true
			};
			mbank.openWindowByLoad('creditCardActivation_Confirm.html','creditCardActivation_Confirm','slide-in-right',params2);
		});
		
		 mbank.resizePage(".btn_bg_f2");
	});
});