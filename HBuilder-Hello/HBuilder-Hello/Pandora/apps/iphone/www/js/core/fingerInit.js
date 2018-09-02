/**
 * pluginFinger调用指纹原生壳控件进行指纹验证，返回定义三个回调函数
 * successCallback：成功，一个参数为提示语
 * errorCallback：异常，一个参数为提示语
 * otherCallback：其他，两个参数，一个参数表示状态码，一个参数是提示语
 * 
 * 调用原生壳方法不同情况返回的值
 * android
 * result.payload：0：验证成功，1：验证失败，2：手指移动太快，3：您的设备无指纹传感器，不支持指纹识别；5：用户关闭指纹监听；7：失败次数太多
 * ios
 * result.payload：1：验证成功，0：3次验证失败、点击取消、未开通指纹
 * 
 * 
 * isSupportFinger调用原生壳判断手机是否支持指纹，此方法只有Android提供了方法，IOS未提供方法无法判断，但为了前端调用方便，
 * 不需要在每一个调用的地方都区分是android还是IOS，因此在这里统一处理，对于IOS如果不是控件不支持均返回支持状态，定义一个回调函数
 * callFunc：一个参数，state=1表示支持，state=0表示不支持
 * 
 * 调用原生壳方法返回的值
 * android
 * payload=1支持；0不支持
 * 
 */
define(function(require, exports, module) {
	exports.pluginFinger = function(successCallback,errorCallback,otherCallback){
		if(successCallback ==null || successCallback =="" || errorCallback ==null || errorCallback=="" || otherCallback==null ||otherCallback==""){
			mui.alert("请正确定义回调函数");
			return;
		}
		if(mui.os.android){
			if(!window.plus.pluginFingerprint){
				errorCallback("加载指纹控件对象失败");
			}
			plus.pluginFingerprint.startFingerprint(
				function(result) {
					if (result.status) {
						if(result.payload =="0"){
							successCallback("指纹识别成功");
						}else if(result.payload =="1"){
							otherCallback(result.payload,"指纹验证失败");
						}else if(result.payload =="2"){
							otherCallback(result.payload,"手指移动太快，指纹验证失败");
						}else if(result.payload =="5"){
							otherCallback(result.payload,"用户点击确定取消指纹识别");
						}else if(result.payload =="3"){
							otherCallback(result.payload,"您的设备无指纹传感器，不支持指纹识别");
						}else if(result.payload =="7"){
							otherCallback(result.payload,"失败次数太多，请稍后再试");
						}else{
							errorCallback(result.message);
						}
	                }else {
						errorCallback(result.message);
	                }
				}, function(e) {
					errorCallback(e);
				}
			);
		}else{
			if(!window.plus.pluginLogin){
				errorCallback("加载指纹控件对象失败");
			}
			plus.pluginLogin.TouchIDLogin(
	            function( result ) {
	                if (result) {
	                	if (result.status) {
	                		if(result.payload=="1"){
								successCallback("指纹识别成功");
	                		}else{
								otherCallback(result.payload,result.message);
	                        }
	                    }else {
							errorCallback(result.message);
	                    }
	                }else {
						errorCallback("调用插件时发生异常");
	                }
	            },function(e){
					errorCallback(e);
	            }
	        );
		}
	}
	
	exports.isSupportFinger = function(callFunc){
		if(mui.os.android){
			if(!window.plus.pluginFingerprint){
				callFunc(0);
			}
			plus.pluginFingerprint.isAvailable(function(result) {
				if(result.payload==1) {
					//payload=1支持；0不支持
					callFunc(1);
				}else{
					callFunc(0);
				}
			}, function(result) {
                callFunc(0);
			});
		}else{
			callFunc(1);
		}
	}
})