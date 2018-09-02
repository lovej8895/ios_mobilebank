define(function(require, exports, module) {
	var mbank = require('./bank');
	var nativeUI = require('../../core/nativeUI');
	
	/*SIGN_ALG_TAG 签名方式   
 	 * case 1: FTUserSignAlg.FTM_RSA_SHA1;
 	 * case 2: FTUserSignAlg.FTM_RSA_MD5;
 	 * case 3: FTUserSignAlg.FTM_RSA_SHA256;
 	 * case 4: FTUserSignAlg.FTM_RSA_SHA384;
 	 * case 5: FTUserSignAlg.FTM_RSA_SHA512;
 	 * case 6: FTUserSignAlg.FTM_SM2;
 	 */
	var SIGN_ALG_TAG = 1;
	
	
	/**
	 * 获取USBKEY指定签名数据格式
	 * Format:付款账号#payAccount|收款账号#recAccount|收款户名#recAccountName|
	 * 		   付款金额#payAmount#元|#recAccountOpenBank|trsFeeAmount
	 * @param {Object} context  作用域上下文
	 * @param {Object} signDataFormat  用法见上面的Format
	 * @param {Object} requestData	请求json数据
	 * @param {Object} key	随机因子
	 */
	exports.getSignSourceValue = function(context, signDataFormat, requestData,key){
			var signSourceData = "";
			var signView = "";
			var signInfo = "";
			if(signDataFormat != "" && signDataFormat!=null && signDataFormat!=undefined){
			  	var signFields = signDataFormat.split("|");
			  	for(var i = 0; i < signFields.length; i++){
					var signField = signFields[i];
					var signValue = signField.split("#");
					var vl = "";
					if(signValue[1] != "" && signValue[1] != null && signValue[1] != undefined) vl = requestData[signValue[1]]||'';
					if (signValue[0] != "" && signValue[0] != null && signValue[0] != undefined) {
						if (signValue[2] != "" && signValue[2] != null && signValue[2] != undefined){
							var tmp = vl == "" ? "</k><v>" : "：</k><v>";
							signView += "<M><k>" + signValue[0]  + tmp + vl + "</v><k>"+signValue[2]+"</k></M>";
						}else{
							var tmp = vl == "" ? "</k><v>" : "：</k><v>";
							signView += "<M><k>" + signValue[0]  + tmp + vl + "</v></M>";
						}
					} else {
						signInfo += "<M><k></k><v>" + vl + "</v></M>";
					}
				}
			  	signInfo += "<M><k></k><v>" + key + "</v></M>";
			  	signSourceData = '<?xml version="1.0" encoding="UTF-8"?><T><D>' + signView + '</D><E>' + signInfo + '</E></T>';
			} else {
				signInfo += "<M><k></k><v>" + key + "</v></M>";
				signSourceData = '<?xml version="1.0" encoding="UTF-8"?><T><D></D><E>' + signInfo + '</E></T>';
			}
			return signSourceData;
		}
	
	/**
	 * USBKEY证书签名
	 * @param {Object} message
	 * @param {Object} pin
	 * @param {Object} successCallback
	 * @param {Object} errorCallback
	 */
	exports.signDataByUsbKey = function(message,pin,successCallback,errorCallback){
		if(!window.plus.pluginFrequencyKey){
//			plus.nativeUI.alert('USBKey对象未加载',null,mbank.getAppName,'确定');
			mui.alert('USBKey对象未加载','温馨提示');
			return false;
		}
		var certNo = 0;
		window.plus.pluginFrequencyKey.certSignFrequencyKey(certNo,pin,SIGN_ALG_TAG,message,'正在签名中...','请核对音频Ukey屏幕上显示的内容是否正确，若确认请按"OK"键，否则按"C"键取消。',true,function(result){
			if(result&&result.message=='1'){
				var signData = result.payload||'';
				if(successCallback && typeof successCallback=='function'){
					successCallback(signData);
				}else{
//					mui.alert('尚未配置成功回调函数', '温馨提示');
					errorCallback('尚未配置成功回调函数');
				}
			}else{
//				mui.alert(result.payload, '温馨提示');
				errorCallback(result.payload);
			}
		}, function(result){
			if(errorCallback && typeof errorCallback=='function'){
//				errorCallback(result);
				errorCallback(result.payload);
			}else{
				mui.alert(typeof result=='object'?JSON.stringify(result):result, '温馨提示');
			}
		});
	}

	
	/**
	 * 获取USBKEY序列号SN
	 * @param {Object} successCallback
	 * @param {Object} errorCallback
	 */
	exports.getUsbkeySnNum = function(successCallback,errorCallback){
		if(!window.plus.pluginFrequencyKey){
//			plus.nativeUI.alert('USBKey对象未加载',null,mbank.getAppName,'确定');
			mui.alert('USBKey对象未加载','温馨提示');
			return false;
		}
		window.plus.pluginFrequencyKey.getsnFrequencyKey(function(result){
			if(result&&result.message=='1'){
				var keySnNum = result.payload||'';
				if(successCallback && typeof successCallback =='function'){
					successCallback(keySnNum);//to-do business
				}else{
					alert('回调函数未设置')
				}
			}else{
//				plus.nativeUI.alert(result.payload, null, mbank.getAppName, '确定');
				mui.alert(result.payload, '温馨提示');
			}
		},function(result){
			if(errorCallback && typeof errorCallback=='function'){
				errorCallback(result);
			}else{
				mui.alert(typeof result=='object'?JSON.stringify(result):result, '温馨提示');
			}
		})
	}
	
	/**
	 * 修改USBKEY的PIN码
	 * @param {Object} oldPin
	 * @param {Object} newPin
	 * @param {Object} successCallback
	 * @param {Object} errorCallback
	 */
	exports.changeUsbkeyPin = function(oldPin,newPin,successCallback,errorCallback){
		
		if(!window.plus.pluginFrequencyKey){
			mui.alert('USBKey对象未加载', '温馨提示');
			return false;
		}
		
		if(!oldPin||oldPin.length==0){
			mui.alert('原PIN码不能为空','温馨提示');
			return false;
		}
		
		if(!newPin||newPin.length==0){
			mui.alert('新PIN码不能为空','温馨提示');
			return false;
		}
		
		window.plus.pluginFrequencyKey.changePinFrequencyKey(oldPin,newPin,function(result){
			if(result&&result.message=='1'){
				if(successCallback && typeof successCallback =='function'){
					successCallback();//to-do business
				}else{
//					alert('回调函数未设置');
					errorCallback("回调函数未设置");
				}
			}else{
				errorCallback(result.payload);
//				mui.alert(result.payload, '温馨提示');
			}
		},function(result){
			if(errorCallback && typeof errorCallback=='function'){
				errorCallback(result.payload);
			}else{
				mui.alert(typeof result=='object'?JSON.stringify(result):result, '温馨提示');
			}
		})
	
	}
})