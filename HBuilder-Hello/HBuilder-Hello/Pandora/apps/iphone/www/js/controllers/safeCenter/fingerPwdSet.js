define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var fingerInit = require('../../core/fingerInit');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var customerId = userInfo.get("session_customerId");
		var retPage = plus.webview.getWebviewById("safeCenterHome");
		var fingerLoginState = null;
		var fingerKeys = userInfo.getItem("finger_keys") || "{}";
		if (fingerKeys != null && fingerKeys != "" && fingerKeys != "{}" && fingerKeys != undefined) {
			fingerKeys = JSON.parse(fingerKeys);
			fingerLoginState = fingerKeys.state;
		}
		if(fingerLoginState == "0"){
			jQuery('#fingerSet').addClass('mui-active');
		}else{
			jQuery('#fingerSet').removeClass('mui-active');
		}
		
		jQuery("#fingerSet").on("toggle",function(event){
            if(event.detail.isActive){
            	if(fingerLoginState != "0"){
//					loginTouchID();
					fingerInit.pluginFinger(successCallback,errorCallback,otherCallback);
            	}
            }else{
            	if(fingerLoginState == "0"){
            		mui.confirm("是否关闭指纹登录？","温馨提示",["确认", "取消"], function(e) {
						if (e.index == 0) {
							loginTypeSet("1");
						}else{
							mui("#fingerSet").switch().toggle();
							return;
						}
					});
            	}
            }
        });
        function successCallback(msg){
        	loginTypeSet("0");
        }
        function errorCallback(msg){
        	mui.alert(msg,"温馨提示","确定",function(){
        		mui("#fingerSet").switch().toggle();
			});
        }
        function otherCallback(state,msg){
        	if(mui.os.ios){
        		mui("#fingerSet").switch().toggle();
			}else{
				if(state =='3'){
					mui.alert(msg,"温馨提示","确定",function(){
        				mui("#fingerSet").switch().toggle();
					});
				}else if(state =='7'){
					mui.alert(msg,"温馨提示","确定",function(){
        				mui("#fingerSet").switch().toggle();
					});
				}else{
					mui("#fingerSet").switch().toggle();
				}
			}
        }
        
        /*function loginTouchID() {
        	if(!window.plus.pluginLogin){
        		mui("#fingerSet").switch().toggle();
				mui.alert("加载指纹控件对象失败","温馨提示");
				return false;
			}
	        plus.pluginLogin.TouchIDLogin(
	            function( result ) {
	               	if (result) {
	                	if (result.status) {
	                		var checked = result.payload;
	                		if(checked=="1"){
//	                			mui.toast("指纹识别成功");
	                			loginTypeSet("0");
	                		}else{
								mui("#fingerSet").switch().toggle();
								return;
	                        }
	                    }else {
	                        mui.toast(result.message);
        					mui("#fingerSet").switch().toggle();
        					return;
	                    }
	                }else {
	                    mui.toast("调用插件时发生异常");
        				mui("#fingerSet").switch().toggle();
        				return;
	                }
	            },
	            function(e){
	                mui.toast(e);
        			mui("#fingerSet").switch().toggle();
        			return;
	            }
	        );
        }*/
        function loginTypeSet(state){
        	var logonId = userInfo.getItem("logonId");
			var uuid = plus.device.uuid;
        	var pwdData = "" + CryptoJS.HmacMD5(uuid + "",logonId + "");
        	if(state == "1"){
        		pwdData = "";
        	}
        	var reqData = {
        		"mbUUID" : uuid,
        		"PinType" : "3",
        		"PinData" : pwdData,
        		"state" : state
        	};
        	var url = mbank.getApiURL()+'loginTypeStateSet.do';
        	mbank.apiSend("post",url,reqData,loginTypeStateSetSucFunc,loginTypeStateSetFailFunc,true);
        	function loginTypeStateSetSucFunc(data){
        		if(data.ec =="000"){
        			if(state == "0"){
        				var param = {};
        				param[customerId] = pwdData;
						param["state"] = state;
						param["islock"] = "0";
						userInfo.setItem("finger_keys",JSON.stringify(param));
        			}else{
        				fingerKeys["state"] = state;
        				userInfo.setItem("finger_keys",JSON.stringify(fingerKeys));
        			}
        			mui.fire(retPage, 'refresh');
					plus.webview.currentWebview().close();
        		}else{
        			mui("#fingerSet").switch().toggle();
        			mui.alert(data.em,"温馨提示");
        		}
        	}
        	function loginTypeStateSetFailFunc(e){
        		mui("#fingerSet").switch().toggle();
        		mui.alert(e.em,"温馨提示");
        	}
        }
	});
});