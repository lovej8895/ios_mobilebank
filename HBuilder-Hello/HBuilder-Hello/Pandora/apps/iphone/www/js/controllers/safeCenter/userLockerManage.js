define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var userInfo = require('../../core/userInfo');
	
	var state = null;
	var showflag = null;
	
	mui.init();
	mui.plusReady(function() {
		plus.nativeUI.closeWaiting();
		plus.screen.lockOrientation("portrait-primary");
//		plus.webview.close(plus.webview.getWebviewById("userLocker"));
//		plus.webview.close(plus.webview.getWebviewById("userLockerModify"));
		
		var retPage = plus.webview.getWebviewById("safeCenterHome");
		var customerId = userInfo.get("session_customerId");
		var params = userInfo.getItem("session_keys") || "{}";
		
		refresh();
		window.addEventListener("refresh", function(event) {
			refresh();
		});
		function refresh(){
			params = userInfo.getItem("session_keys") || "{}";
			if (params != null && params != "" && params != "{}" && params != undefined) {
				params = JSON.parse(params);
				state = params.state;
				showflag = params.show;
			}
			if (customerId != null && customerId != '') {
				if(state == '0'){
					jQuery('#gesturePwdSet').addClass('mui-active');
					if (showflag == '0') {
						jQuery('#lockerShowSet').addClass('mui-active');
						document.getElementById("lockerShowMsg").innerText = "显示手势密码轨迹";
					} else {
						jQuery('#lockerShowSet').removeClass('mui-active');
						document.getElementById("lockerShowMsg").innerText = "隐藏手势密码轨迹";
					}
					document.getElementById("lockerShow").style.display = "block";
					document.getElementById("lockerModify").style.display = "block";
				}else{
					jQuery('#gesturePwdSet').removeClass('mui-active');
					document.getElementById("lockerShow").style.display = "none";
					document.getElementById("lockerModify").style.display = "none";
				}
			}else {
				var wvs = plus.webview.all();
				for (var i = 0; i < wvs.length; i++) {
					if (wvs[i].id != 'HBuilder' && wvs[i].id != 'main' && wvs[i].id != 'index') {
						plus.webview.close(wvs[i].id);
					}
				}
			}
		}
		jQuery("#gesturePwdSet").on("toggle",function(event){
            if(event.detail.isActive){
            	if(state != "0"){
            		mbank.openWindowByLoad("../safeCenter/userLocker.html","userLocker", "slide-in-right");
            		/*mui.confirm("是否开启手势登录？","温馨提示",["确认", "取消"], function(e) {
						if (e.index == 0) {
							mbank.openWindowByLoad("../safeCenter/userLocker.html","userLocker", "slide-in-right");
						}else{
							mui("#gesturePwdSet").switch().toggle();
							return;
						}
					});*/
            	}
            }else{
            	if(state == "0"){
            		mui.confirm("是否关闭手势登录？","温馨提示",["确认", "取消"], function(e) {
						if (e.index == 0) {
							gesturePwdClose();
						}else{
							mui("#gesturePwdSet").switch().toggle();
							return;
						}
					});
            	}
            }
        });
        
        jQuery("#lockerShowSet").on("toggle",function(event){
            if(event.detail.isActive){
            	if(showflag != "0"){
            		/*mui.confirm("是否显示手势密码轨迹？","温馨提示",["确认", "取消"], function(e) {
						if (e.index == 0) {
							document.getElementById("lockerShowMsg").innerText = "显示手势密码轨迹";
							changeShow("0");
						}else{
							mui("#lockerShowSet").switch().toggle();
							return;
						}
					});*/
					document.getElementById("lockerShowMsg").innerText = "显示手势密码轨迹";
					changeShow("0");
            	}
            }else{
            	if(showflag == "0"){
            		mui.confirm("是否隐藏手势密码轨迹？","温馨提示",["确认", "取消"], function(e) {
						if (e.index == 0) {
							document.getElementById("lockerShowMsg").innerText = "隐藏手势密码轨迹";
							changeShow("1");
						}else{
							mui("#lockerShowSet").switch().toggle();
							return;
						}
					});
            	}
            }
        });
        
        function gesturePwdClose(){
			var uuid = plus.device.uuid;
        	var reqData = {
        		"mbUUID" : uuid,
        		"PinType" : "2",
        		"PinData" : "",
        		"state" : "1"
        	};
        	var url = mbank.getApiURL()+'loginTypeStateSet.do';
        	mbank.apiSend("post",url,reqData,loginTypeStateSetSucFunc,loginTypeStateSetFailFunc,true);
        	function loginTypeStateSetSucFunc(data){
        		if(data.ec =="000"){
        			params["state"] = "1";
					userInfo.setItem("session_keys", JSON.stringify(params));
					mui.fire(retPage, 'refresh');
					plus.webview.currentWebview().close();
        		}else{
        			mui("#gesturePwdSet").switch().toggle();
        			mui.alert(data.em,"温馨提示");
        		}
        	}
        	function loginTypeStateSetFailFunc(e){
				mui("#gesturePwdSet").switch().toggle();
        		mui.alert(e.em,"温馨提示");
        	}
        }
        
        function changeShow(stateVar){
        	showflag = stateVar;
			params["show"] = stateVar;
			userInfo.setItem("session_keys", JSON.stringify(params));
        }
        
        document.getElementById("lockerModify").addEventListener("tap",function(){
        	mbank.openWindowByLoad("../safeCenter/userLockerModify.html","userLockerModify", "slide-in-right");
        },false);
        
       	mui.back=function(){
       		mui.fire(retPage, 'refresh');
			plus.webview.currentWebview().close();
		}
	});
});