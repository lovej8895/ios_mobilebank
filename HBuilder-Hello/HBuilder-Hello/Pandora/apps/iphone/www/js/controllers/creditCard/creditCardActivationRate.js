define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	mui.init();//预加载
	mui.plusReady(function(){//页面初始化
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var certTypeShow ="";//证件类型
		var certNoShow ="";//证件号码
		
		document.getElementById("certTypeShow").innerText="居民身份证";
		$("#certType").val("01");
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
		$("#cardRateList").click(function(){
			var certNoToUp ="";
			certTypeShow = $("#certType").val();
			certNoShow = ignoreSpaces($("#certNo").val());
			certNoToUp = certNoShow.toUpperCase();//证件号码转大写			
			//校验证件号码
			if (certNoToUp!="") {
				if (certTypeShow == "01") {
					var IDCertNoReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$/;
					var cst_certNo = localStorage.getItem("session_certNo");
					if (!new RegExp(IDCertNoReg).test(certNoToUp)) {
						nativeUI.toast("证件号码非法");
						return false;
					}else if(cst_certNo != certNoShow){
						nativeUI.toast("请查询本人的办卡进度");
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
					
			//跳入确认页
			var params2 = {
				certType:certTypeShow,
				certNo:certNoToUp,
				noCheck:true
			};
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noChek = this.getAttribute("noCheck");
			//mui.alert(11111);
			mbank.openWindowByLoad(path, id,'slide-in-right',params2);
		});
		mbank.resizePage(".btn_bg_f2");
	});
});