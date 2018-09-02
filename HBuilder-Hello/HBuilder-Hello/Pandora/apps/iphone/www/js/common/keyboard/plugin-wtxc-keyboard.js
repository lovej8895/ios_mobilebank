/**
 * 第一部分：微通新城密码键盘
 * 
 * 第二部分：飞天诚信音频key
 * 
 * 
 */








/**
 * 使用第三方密码键盘；
 * 
 * 
 * <p>插件名称：</p>
 * 
 * <b>pluginPGKeyboard</b>
 * 
 * <p>API>/p>
 * 
 * md5加密
 * openMD5Keyboard ： function
 * @param showId 密码键盘输入框的ID值
 * @param isNumber 是否仅使用数字键盘；true为仅使用数字键盘，false为使用字母和数字全键盘（默认）。
 * @param confuse 设置键盘是否乱序。
 * @param maxLength 设置键盘可输入的最大长度
 * @param showEditText 键盘是否显示edittext
 * @param watchOutside 点击空白区域关闭密码键盘
 * @param buttonPress 键盘按下效果
 * @param regex 密码设置的正则表达式--可以设置为"",表示不设置密码正则表达式--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param inputregex设置键盘输入正则规则--可以设置为""无限制--demo仅提供测试，具体的设置方式根据业务规则去走
 * 
 * aes加密
 * openAESKeyboard ： function
 * @param showId 密码键盘输入框的ID值
 * @param isNumber 是否仅使用数字键盘；true为仅使用数字键盘，false为使用字母和数字全键盘（默认）。
 * @param confuse 设置键盘是否乱序。
 * @param maxLength 设置键盘可输入的最大长度
 * @param showEditText 键盘是否显示edittext
 * @param watchOutside 点击空白区域关闭密码键盘
 * @param buttonPress 键盘按下效果
 * @param regex 密码设置的正则表达式--可以设置为"",表示不设置密码正则表达式--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param inputregex设置键盘输入正则规则--可以设置为""无限制--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param random 随机因子，在AES加密方式时生效，用于获取AES加密秘钥
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 *
 * rsa+aes加密
 * openRSAAESKeyboard ： function
 * @param showId 密码键盘输入框的ID值
 * @param isNumber 是否仅使用数字键盘；true为仅使用数字键盘，false为使用字母和数字全键盘（默认）。
 * @param confuse 设置键盘是否乱序。
 * @param maxLength 设置键盘可输入的最大长度
 * @param showEditText 键盘是否显示edittext
 * @param watchOutside 点击空白区域关闭密码键盘
 * @param buttonPress 键盘按下效果
 * @param regex 密码设置的正则表达式--可以设置为"",表示不设置密码正则表达式--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param inputregex设置键盘输入正则规则--可以设置为""无限制--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param random 随机因子，在AES加密方式时生效，用于获取AES加密秘钥
 * @param publicKey rsa公钥
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 * 
 * sm2加密
 * openSM2Keyboard ： function
 * openRSAAESKeyboard ： function
 * @param showId 密码键盘输入框的ID值
 * @param isNumber 是否仅使用数字键盘；true为仅使用数字键盘，false为使用字母和数字全键盘（默认）。
 * @param confuse 设置键盘是否乱序。
 * @param maxLength 设置键盘可输入的最大长度
 * @param showEditText 键盘是否显示edittext
 * @param watchOutside 点击空白区域关闭密码键盘
 * @param buttonPress 键盘按下效果
 * @param regex 密码设置的正则表达式--可以设置为"",表示不设置密码正则表达式--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param inputregex设置键盘输入正则规则--可以设置为""无限制--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param random 随机因子，在AES加密方式时生效，用于获取AES加密秘钥
 * @param eccKey sm2国密key
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 * 
 * sm4加密
 * openSM4Keyboard ： function
 * @param showId 密码键盘输入框的ID值
 * @param isNumber 是否仅使用数字键盘；true为仅使用数字键盘，false为使用字母和数字全键盘（默认）。
 * @param confuse 设置键盘是否乱序。
 * @param maxLength 设置键盘可输入的最大长度
 * @param showEditText 键盘是否显示edittext
 * @param watchOutside 点击空白区域关闭密码键盘
 * @param buttonPress 键盘按下效果
 * @param regex 密码设置的正则表达式--可以设置为"",表示不设置密码正则表达式--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param inputregex设置键盘输入正则规则--可以设置为""无限制--demo仅提供测试，具体的设置方式根据业务规则去走
 * @param random 随机因子，在AES加密方式时生效，用于获取AES加密秘钥
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 * 
 * 收起键盘
 * hideKeyboard : function() 
 *
 * 校验是否符合设置的正则表达式
 * checkMatch : function()
 * @param id 密码键盘的id--需要跟初始化的时候设置的id保持一致，详见demo 
 *
 *
 * 清空键盘
 * clearKeyboard ： function(id)
 * @param id 密码键盘的id--需要跟初始化的时候设置的id保持一致，详见demo
 */
document.addEventListener("plusready", function() {
	var _BARCODE = 'pluginPGKeyboard', B = window.plus.bridge;
	var pluginPGKeyboard = {
		openMD5Keyboard : function(showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "openMD5Keyboard", [ callbackID, showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex]);
		},
		openAESKeyboard : function(showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "openAESKeyboard", [ callbackID, showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random]);
		},
		openRSAAESKeyboard : function(showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random,publicKey, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "openRSAAESKeyboard", [ callbackID, showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random,publicKey]);
		},
		openSM2Keyboard : function(showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random,eccKey, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "openSM2Keyboard", [ callbackID, showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random,eccKey]);
		},
		openSM4Keyboard : function(showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(args) {
						errorCallback(args);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "openSM4Keyboard", [ callbackID, showId, isNumber, confuse, maxLength,showEditText,watchOutside,buttonPress,regex,inputregex,random]);
		},
		checkMatch : function(showId){
			return B.execSync(_BARCODE, "checkMatch", [showId]);
		},
		clearKeyboard : function(showId) {
			return B.execSync(_BARCODE, "clearKeyboard", [showId]);
		},
		hideKeyboard : function(showId) {
			return B.execSync(_BARCODE, "hideKeyboard", [showId]);
		},
		registerHideKeyBoardCallBack:function(successCallback,errorCallback){
	      var success = typeof successCallback !== 'function' ? null
	      : function(args) {
	      		successCallback(args);
	      }, fail = typeof errorCallback !== 'function' ? null
	      : function(args) {
	      		errorCallback(args);
	      };
	      callbackID = B.callbackId(success, fail);
	      return B.exec(_BARCODE, "registerHideKeyBoardCallBack", [ callbackID]);
      },
      getKeyboardHeight:function(showId){
          return B.execSync(_BARCODE, "getKeyboardHeight", [showId]);
       }
	};
	window.plus.pluginPGKeyboard = pluginPGKeyboard;
}, true);







/**
 * reverseFrequencyKey 翻转音频key 屏幕  
 *     返回数据：
 *        成功： {"message":"1","payload":null,"status":true}
 *        失败： {"message":"0","payload":"设备未连接","status":true}
 *        其中 message 为1时为翻转成功；0时翻转失败，payload为详情。
 * getsnFrequencyKey   获取音频key序列号
 *         失败： {"message":"0","payload":"设备未连接","status":true}
 *         成功： {"message":"1","payload":226F4AD38005040,"status":true}
 *         其中 message 为1时为获取序列号成功，payload为序列号值；0时获取序列号失败，payload为详情。
 * enumCertFrequencyKey 枚举频key证书  
 *       成功：{"message":"3","payload":{"2":{"SN":"02051004393558","IssuerDN":"C=CN, O=China Financial Certification Authority, CN=CFCA TEST OCA1","Time":"2017032020170620","SubjectDN":"C=CN, O=OCA1, OU=TPC-S3, OU=Individual-1, CN=HBBANK2100003069"},"1":{"SN":"02051004393559","IssuerDN":"C=CN, O=China Financial Certification Authority, CN=CFCA TEST OCA1","Time":"2017032020170620","SubjectDN":"C=CN, O=OCA1, OU=TPC-S3, OU=Individual-1, CN=HBBANK2100003071"},"0":{"SN":"02051004393560","IssuerDN":"C=CN, O=China Financial Certification Authority, CN=CFCA TEST OCA1","Time":"2017032020170620","SubjectDN":"C=CN, O=OCA1, OU=TPC-S3, OU=Individual-1, CN=HBBANK2100003084"}},"status":true}
 *       失败：{"message":"0","payload":"设备未连接","status":true}
 *       其中 message 为>0成功,message为返回证书个数，payload为数据；0时失败或者无证书，payload为详情。
 * getCertFrequencyKey  获取音频key中的证书信息
 *       certNo 为证书编号
 *       失败：{"message":"0","payload":"设备未连接","status":true}
 *       成功：{"message":"1","payload":"MIID6zCCAtOgAwIBAgIFEAQ5NVgwDQYJKoZIhvcNAQEFBQAwWDELMAkGA1UEBhMCQ04xMDAuBgNV\nBAoTJ0NoaW5hIEZpbmFuY2lhbCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEXMBUGA1UEAxMOQ0ZD\nQSBURVNUIE9DQTEwHhcNMTcwMzIwMDczNTAxWhcNMTcwNjIwMDczNTAxWjBfMQswCQYDVQQGEwJD\nTjENMAsGA1UEChMET0NBMTEPMA0GA1UECxMGVFBDLVMzMRUwEwYDVQQLEwxJbmRpdmlkdWFsLTEx\nGTAXBgNVBAMTEEhCQkFOSzIxMDAwMDMwNjkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB\nAQDGcC7harvFYUuIi4VYOJz7YW863Px6zGEzYU74zQSi2UiaXsLtGrYdskewz1ZyYnij+r8ObQOX\n4cPyzjHQHKXwxLdRuVPuNBIMJ6KxwIiO20\/FgHFYImdLYl1upa5hlsX3wy4QBxOL\/qzjp6frgAeA\nziDjsq20qE1vutMhs+ILF17PY1zKpVrZ33nYalvs6IpOAy+mR7epNcwiW8rgeDh0BZAu2HCYvHbR\nhqKdW88fSNJgP7LVZRZE9TTaJ6WLFQbDvhhR7apsY5OedttfVJZxVPSfclXEFQL3mzDIka4YE\/bF\n8VXqASBbwtVWeEAv0qwvoi49tMcy\/69E3bw3cng9AgMBAAGjgbQwgbEwHwYDVR0jBBgwFoAUz3Cd\nYeudfC6498sCQPcJnf4zdIAwOAYDVR0fBDEwLzAtoCugKYYnaHR0cDovL3VjcmwuY2ZjYS5jb20u\nY24vUlNBL2NybDg0NjcuY3JsMAsGA1UdDwQEAwID6DAdBgNVHQ4EFgQUVWN\/csnprUZEzlhetreM\nj4VvJqEwKAYDVR0lBCEwHwYIKwYBBQUHAwIGCCsGAQUFBwMEBgkqhkiG9y8BAQUwDQYJKoZIhvcN\nAQEFBQADggEBAJ6TbdmeaQQCIHEj00MfB8oa7C\/P3wsvuvUv\/mjKhpAOZJMe1DMibgT4m6MQM0KG\ntT1pTSbkLvirPoYoAHlpv9EmmOmZXxVPRw+JO+AMecZq+Ea\/wjTB8VjmroNpHvsMSjRL+IcV1+R6\nKk+sr34IZBxz1WmsqXP3fe4bsY+9owYeyhjoIxLrSdsWLugZnK247LzBaawIJNb6UE4a7VOWgZRp\n+h8dtj\/cFYSnvlSoFDkXemDctV2O0RDKeVcOwACj5wFFXAulV0+KoiOyuPLO2VDEuXi5URTJm3Ch\nSyeFJgud+rjLArIROup\/iJkTGowjD77C+xPtAa9KX\/j5peCEaoo=\n","status":true}
 *       其中 message 为1时为成功，payload为数据；0时失败，payload为详情。
 * changePinFrequencyKey  修改pin
 *   oldPin 原始pin
 *   newPin 新的pin
 *   成功：{“message":"1","payload":null,"status":true}
 *   失败：{"message":"0","payload":"设备未连接","status":true}
 *   其中 message 为1时为成功；0时失败，payload为详情。
 * certSignFrequencyKey 
 *    certNo 证书号  从0开始
 *    strPin 证书的pin
 *    signAlgMsg 签名方式   
 *          case 1: FTUserSignAlg.FTM_RSA_SHA1;
 * 			case 2: FTUserSignAlg.FTM_RSA_MD5;
 * 			case 3: FTUserSignAlg.FTM_RSA_SHA256;
 * 			case 4: FTUserSignAlg.FTM_RSA_SHA384;
 * 			case 5: FTUserSignAlg.FTM_RSA_SHA512;
 * 			case 6: FTUserSignAlg.FTM_SM2;
 *    signData 要签名的数据 
 *    loadingString   加载时显示的数据，默认显示:正在签名...
 *    signSucessString   签名成功后显示的数据,默认显示：请核对UKey屏幕上显示的内容是否正确，如确认请按“OK”键，否则按“C”键取消
 *    isNeedP7  是否需要打P7包 true为需要，false为不需要，默认为false。
 *    返回数据
 *    成功：{"message":"1","payload":"xR4Xf2y4M3cqKozneHY3FcLnkDV0w05IYVHx7X1jwysp2Bd12v3SBsC4g7orgrMPFw+4jholx16m\n5xzbIx0GsNQT50a+zKUzCg41VS8KDiNLq2haSyrIhoaIJPcoG435nToPMVE8rGOMywqdwZryIl3g\n1G\/TCUoftDPVoEfsPEVn0zc19n0bEaCc4txIo38aRxjt69H8U6wN81FwNJX30YWRQMm5WeSPJM+P\n0hf2vmdpD+8PWjSS+zKhaNIjoejTLC0g2wrZceffg4Dtb7eqC92lhkOi\/JkKFiLPjYSYFq+4OpFM\nu0pyHjQsmJoJeIe8wgWJ\/iyJp0EmngAW9Sdsyg==\n","status":true}
 *    失败：{"message":"0","payload":"设备未连接","status":true}
 *    其中 message 为1时为成功，payload为数据；0时失败，payload为详情。
 * destroyFrequencyKey   回收音频key中的数据
 *   成功：{“message":"1","payload":null,"status":true}
 *   失败：{"message":"0","payload":"设备未连接","status":true}
 *   其中 message 为1时为成功；0时失败，payload为详情。
 */
document.addEventListener("plusready", function() {
	var _BARCODE = 'pluginFrequencyKey', B = window.plus.bridge;
	var pluginFrequencyKey = {
		reverseFrequencyKey : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(code) {
						errorCallback(code);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "reverseFrequencyKey", [ callbackID ]);
		},
		getsnFrequencyKey : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(code) {
						errorCallback(code);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "getsnFrequencyKey", [ callbackID ]);
		},
		enumCertFrequencyKey : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
							: function(code) {
								errorCallback(code);
							};
							callbackID = B.callbackId(success, fail);
							return B.exec(_BARCODE, "enumCertFrequencyKey", [ callbackID ]);
		},
		getCertFrequencyKey : function(certNo,successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
							: function(code) {
								errorCallback(code);
							};
							callbackID = B.callbackId(success, fail);
							return B.exec(_BARCODE, "getCertFrequencyKey", [ callbackID,certNo ]);
		},
		changePinFrequencyKey : function(oldPin,newPin,successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
							: function(code) {
								errorCallback(code);
							};
							callbackID = B.callbackId(success, fail);
							return B.exec(_BARCODE, "changePinFrequencyKey", [ callbackID,oldPin,newPin ]);
		},
		certSignFrequencyKey : function(certNo,strPin,signAlgMsg,signData,loadingString, signSucessString,isNeedP7,successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
							: function(code) {
								errorCallback(code);
							};
							callbackID = B.callbackId(success, fail);
							return B.exec(_BARCODE, "certSignFrequencyKey", [ callbackID,certNo,strPin,signAlgMsg,signData,loadingString, signSucessString,isNeedP7]);
		},
		destroyFrequencyKey : function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null
					: function(args) {
						successCallback(args);
					}, fail = typeof errorCallback !== 'function' ? null
					: function(code) {
						errorCallback(code);
					};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "destroyFrequencyKey", [ callbackID ]);
		}
	};
	window.plus.pluginFrequencyKey = pluginFrequencyKey;
}, true);