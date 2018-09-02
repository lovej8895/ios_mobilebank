define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var fingerInit = require('../../core/fingerInit');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var customerType = localStorage.getItem("customerType");
		var session_mastSafe = userInfo.get("session_mastSafe");
//		plus.webview.close(plus.webview.getWebviewById("userLockerManage"));
		refresh();
		window.addEventListener("refresh", function(event) {
			refresh();
		});
		function refresh(){
			var customerType = userInfo.get("customerType");
			if(customerType=='00'){
				$('#limitSet').hide();
				$('#limitFree').hide();
			}
			if(customerType=='01'){
				$('#limitSet').show();
				$('#limitFree').show();
			}
			
			/*if(mui.os.ios){
				document.getElementById("fingerPwdSet").style.display = "block";
			}else{
				document.getElementById("fingerPwdSet").style.display = "none";
			}*/
			
			fingerInit.isSupportFinger(isSupportFingerCallFunc);
			function isSupportFingerCallFunc(status){
				if(status =="1"){
					document.getElementById("fingerPwdSet").style.display = "block";
				}else{
					document.getElementById("fingerPwdSet").style.display = "none";
				}
			}
			var fingerLoginState = null;
			var fingerKeys = userInfo.getItem("finger_keys") || "{}";
			if (fingerKeys != null && fingerKeys != "" && fingerKeys != "{}" && fingerKeys != undefined) {
				fingerKeys = JSON.parse(fingerKeys);
				fingerLoginState = fingerKeys.state;
			}
			if(fingerLoginState == "0"){
				document.getElementById("fingerPwdSetMsg").innerText = "已开启";
			}else{
				document.getElementById("fingerPwdSetMsg").innerText = "已关闭";
			}
			
			var userLocker = null;
			var params = userInfo.getItem("session_keys") || "{}";
			if (params != null && params != "" && params != "{}" && params != undefined) {
				params = JSON.parse(params);
				userLocker = params.state;
			}
			if(userLocker == '0'){
				document.getElementById("userLockerManageMsg").innerText = "已开启";
			}else{
				document.getElementById("userLockerManageMsg").innerText = "已关闭";
			}
		}
		
		//账户类别不同，设备绑定是否显示
		if(customerType=="01"){
			//设备绑定
			jQuery("#deviceManager").show();
			jQuery('#limitFree').show();
			//安全认证类型UKEY 显示修改PIN码
			if(session_mastSafe=='2'){
				jQuery("#usbkeyPINManage").show();
			}else{
				jQuery("#usbkeyPINManage").hide();
			}
			
		}else{
			jQuery("#deviceManager").hide();
		}
		
		mui("#functionDiv").on("tap","li",function(){
			var id =jQuery(this).attr("id");
			var path=jQuery(this).attr("path");
			var noCheck=jQuery(this).attr("noCheck");
			mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});
		
		mui.back=function(){
			plus.webview.close("safeCenterHome");
			mui.fire(plus.webview.getWebviewById("myRight"),"reload",{});
//			console.log("1");
		}
		
	});
});