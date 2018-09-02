/*
 * 本页面进行设备绑定第一步，身份验证，用户可选择证件类型
 * 与证件号码，该证件类型与证件号码为登陆账号的证件类型与
 * 证件号码
 */
define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var certTypeList = jQuery.param.getParams('CERT_TYPE');
	
	mui.init();//预加载
	mui.plusReady(function(){//页面初始化
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var sessionTimeOut=plus.webview.currentWebview().sessionTimeOut;
		mbank.resizePage("#abc");
		getPickerList(certTypeList);
		var certTypeShow ="";//证件类型
		var certNoShow ="";//证件号码
		//获取用户登陆时查询的客户号，用于验证输入 证件号码
		var userCertNo = localStorage.getItem('session_certNo').toUpperCase();
		var userCertType = localStorage.getItem('session_certType');
		$('#certTypeShow').html("二代身份证");
		$("#certType").val('01');
		
		var deviceBoundGuide = userInfo.getItem("deviceBoundGuide");
		if (!deviceBoundGuide) {
			userInfo.setItem("deviceBoundGuide", "true");
			var guide = plus.webview.create("../guide/guide_deviceBound.html","guide_deviceBound",{background:"transparent",zindex:990,popGesture:'none'});
			plus.webview.show(guide);
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
		var certTypevalue ="0";
			
		function getPickerList(certList){
			if( certList ){
				certPickerList=[];
				var i=0;
				for( var ct in  certList){
					if(certList.hasOwnProperty(ct)){
						var certType=certList[ct];
						var pickItem={
							value:ct,
							text:certType
						};
						certPickerList.push(pickItem);
					}
				}
				accountPicker = new mui.SmartPicker({title:"请选择证件类型",fireEvent:"certType"});
			    accountPicker.setData(certPickerList);	
			}
		}
		
		$("#changecertType").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("certType",function(event){
        	var param=event.detail;			
			certType=param.text;
			certTypevalue = param.value;
			$('#certTypeShow').html(certType);
            
        });	
		
		
        document.getElementById('certNo').addEventListener('keyup',function(){
		var thv  = this.value;
		if(thv){
			this.value = thv.toUpperCase();
		}
		})
		document.getElementById('certNo').addEventListener('blur',function(){
			var thv  = this.value;
			if(thv){
				this.value = thv.toUpperCase();
			}
		})
		
		
		//下一步
		document.getElementById("infoConfirm").addEventListener('tap',function(){
			var certNoToUp ="";
			certTypeShow = $("#certType").val();
			certNoShow = ignoreSpaces($("#certNo").val());
			certNoToUp = certNoShow.toUpperCase();//证件号码转大写			
			//校验证件号码
			if (certNoToUp!="") {
				if (certTypeShow == "0") {
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
			if( certNoToUp!=userCertNo){
				mui.alert("请输入注册此登录账号的证件号码");
				return false;
			}
			if(certTypevalue != userCertType){
				mui.alert("请选择正确的证件类型");
				return false;
			}
		
			//跳入确认页
			var params2 = {
				certType:document.getElementById("certTypeShow").innerText,
				certNo:certNoToUp,
				noCheck:true,
				noClearDestination:true,
				sessionTimeOut:sessionTimeOut
			};
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noChek = this.getAttribute("noCheck");
			//mui.alert(11111);
			
			mbank.openWindowByLoad(path, id,'slide-in-right',params2);
		});

		mui.back = function(event) {
			var bts=["是","否"];
//			plus.nativeUI.confirm("未完成设备绑定，退出登录",function(e){
			mui.confirm("未完成设备绑定，退出登录", "提示", bts, function(e) {
				var i=e.index;
				if(i==0){
	//				var url = mbank.getApiURL() + 'userSignOff.do';
	//				mbank.apiSend('post', url, null ,quitSuccess, quitError, false);
					userInfo.removeItem("iAccountInfo");
	//				function quitSuccess(){
						//plus.runtime.quit();
						var myRight = plus.webview.getWebviewById("myRight");
						if(myRight){
							plus.webview.close(myRight);
						}
						userInfo.removeItem("session_customerId");
						userInfo.removeItem("iAccountInfo");
						var main_sub = plus.webview.getWebviewById("main_sub");
						mui.fire(main_sub,'logOut',{});
						mbank.backToIndex(true);
						var myOwn = plus.webview.getWebviewById("myOwn");
						mui.fire(myOwn,"reload");
	//				}
					
	//				function quitError(){
	//					
	//				}
				}
			})
		};
	});
});