define(function(require, exports, module) {
	var mbank = require('./bank');
	var nativeUI = require('../../core/nativeUI');
	
	var LOGON_PWD_LENGTH=12;//登陆密码长度
	var TRANS_PWD_LENGTH=6;//交易密码长度
	
	var LOGON_PWD_REG = "^(?![^a-zA-Z]+$)(?!\\D+$).{6,12}$";//登陆密码正则
	var TRANS_PWD_REG = "^(?!\D+$)[0-9]{6}$";//交易密码正则
	var PWD_KEYS = {};

	
	var PWD_KEYBOARD_CLASS = 'pwdKeyBoard';
	
	var targetPwdId = null;
	
	
//	document.addEventListener('DOMContentLoaded',function(){
//		alert('domcontentload')
//	})
//	
//	window.addEventListener('loaded',function(){
//		alert('loaded')
//	})
	
//	document.addEventListener('plusready',function(){
//		alert('plusready')
//	})
	
	/**
	 * 页面plusready事件触发后，自动初始化密钥信息
	 */
	mui.plusReady(function(){
		
			if(window.plus){
				plus.screen.lockOrientation("portrait-primary");
			}
			
			plus.key.addEventListener('backbutton',function(){
				if(targetPwdId){
					exports.hideKeyboard(targetPwdId);
					exports.clearKeyboard('clear');
				}
				mui.back();
			},false);	
		
			//获取密码键盘所需密钥信息，后期改造后不需要，重新方法本地实现即可
			if(localStorage.getItem('sessionId')){
				mbank.getPhoneKey(PWD_KEYS,function(data){
					PWD_KEYS = data;
				});
			}else{
				//实时获取密钥信息方式
				/*mbank.getPasswordKey(PWD_KEYS,function(data){
					PWD_KEYS = data;
				});*/
				//固定获取密钥信息方式
				if(mbank.productMode()){//生产模式
					PWD_KEYS = {key:'urNrwmkL8rjCAwtoqI6vJpn2eSDsHFrk',publicKey:'30818902818100B2687A1AA53C58FC2C603CD3F8F21F13BE7BC1685C0C462D08D9766121B94ECF95C48D580F6C118F40B51C54FB87C28691DC83E5A92AFAA9CAE8BB0D66ADACFC751C812469B8A85B93C91D0508A3A06BDD6B3002A0CEA8ED418486ECB3ADF76EB4854FC0B9B49E8A2E33B8237EFA232D65D8F3F54132DF655F833094FCCB6DC10203010001'};
				}else{//测试模式
					PWD_KEYS = {key:'urNrwmkL8rjCAwtoqI6vJpn2eSDsHFrk',publicKey:'30818902818100BF93ED34A23E19562DDC952ED42CF83DBD8EBDAF22C55F91B67C9FE4379035C2A5E91EBD47BC4C3031D53DD61B22218B9A8CA1B3189817AF50845B3988B5836728866F68DA19C7AA936984B3C6162E32F261D72CF5F7D8DF90E002D9302154572C5F387B05D7A204C1281327B3CBE52733FF6613A62C3B176BDADD03D6D79DB30203010001'};
				}
			}
			
			
			//注册密码键盘监听事件
			//目前仅ios实现，后期android实现放开判断
			if(1==2){
					//注册密码键盘切换监听事件
					setTimeout(function(){
						exports.registerHideKeyBoard(function(){
							//注册成功 隐藏键盘后调用的方法
							var bodyElem = jQuery(document.body);
							if(bodyElem.hasClass(PWD_KEYBOARD_CLASS)){
								exports.pageAnimation(bodyElem,0);
								//延时，避免动画效果失效
								setTimeout(function(){
									bodyElem.removeClass(PWD_KEYBOARD_CLASS);
								},500)
							}
						},function(){})
					},1000);
				}
			
			//清空键盘内容
		if(mui.os.android){
			exports.clearKeyboard('clear');
		}
			
	},true);//事件捕获
	
	/**
	 * 获取加密使用的32私密因子
	 * 验证密码的时候需要上送
	 */
	exports.getRandomNumber = function(){
		if(PWD_KEYS&&PWD_KEYS['key']){
			return PWD_KEYS['key'];
		}else{
			return '';
		}
	}
	
	/**
	 * 测试
	 * @param {Object} pwdId
	 */
	exports.openRsaAesKeyboardDemo = function(pwdId){
		if(!window.plus.pluginPGKeyboard){
			alert('Demo密码控件对象不存在')
			return false;
		}
		if(!PWD_KEYS||!PWD_KEYS['publicKey']||!PWD_KEYS['key']){
			alert('Demo密钥为空')
			return false;
		}
		alert('开始调用控件')
		window.plus.pluginPGKeyboard.openRSAAESKeyboard(pwdId, "false", 0,10,"true","true","true","^(?![^a-zA-Z]+$)(?!\\D+$).{6,16}$","","abcdefghijklmnopqrstuvwxyz123456","3081890281810092d9d8d04fb5f8ef9b8374f21690fd46fdbf49b40eeccdf416b4e2ac2044b0cfe3bd67eb4416b26fd18c9d3833770a526fd1ab66a83ed969af74238d6c900403fc498154ec74eaf420e7338675cad7f19332b4a56be4ff946b662a3c2d217efbe4dc646fb742b8c62bfe8e25fd5dc59e7540695fa8b9cd5bfd9f92dfad009d230203010001",
			function(result) {
					if (result) {
						if (result.status) {
							var json=result.payload;
							var obj =  $.parseJSON(json);
							document.getElementById(pwdId).value = obj.text==null?"******":obj.text;
							document.getElementById('_'+pwdId).value = obj.cipherText==null?"":obj.cipherText;
						} else {
							alert(result.message);
						}
					} else {
						alert("调用插件时发生异常。");
					}
				}, function(result) {
					alert(result);
				});
	}
	
	/**
	 * 纯数字密码键盘
	 * @param {Object} pwdId  密码键盘的input的Id,
	 * 	注意：
	 * 		1.一般加密需要html中增加id=_pwdId的隐藏input域  <input id="_pwdId" type="hidden">
	 * 		2.若是修改密码，则在html中新增id=_pwdId_md5的隐藏input域 <input id="_pwdId_md5" type="hidden">
	 * @param {Object} successCallback  成功回调函数 ，形参data={cipherText:"",md5Text:""}
	 * @param {Object} errorCallback	失败回调函数
	 */
	exports.openNumKeyboard = function(pwdId,successCallback,errorCallback){
		
		if(!window.plus.pluginPGKeyboard){
			mui.alert("加载密码控件对象失败");//供插件调试使用
			return false;
		}
		
		var checkKey = PWD_KEYS&&PWD_KEYS['publicKey']&&PWD_KEYS['key'];
		if(!checkKey){
			plus.nativeUI.toast('密钥获取失败');//供插件调试使用
			return false;
		}
		
		targetPwdId = pwdId;
		
		window.plus.pluginPGKeyboard.openRSAAESKeyboard(pwdId, 'true', 0,TRANS_PWD_LENGTH,"false","true","true",TRANS_PWD_REG,"",PWD_KEYS['key'],PWD_KEYS['publicKey'],
			function(result) {
					if (result) {
						if (result.status) {
							var message = result.message;
							if(message=='2'){//正常加密回调
								var json=result.payload;
								var obj =  $.parseJSON(json);
								var retObj = {
									cipherText  : obj.cipherText==null?"":obj.cipherText,
									md5Text 	: obj.md5==null?"":obj.md5,
									inputText	: obj.text==null?"******":obj.text
								};
								if(successCallback && typeof successCallback==='function'){
									successCallback(retObj);//将密文放在隐藏域中
								}else{
									if(document.getElementById(pwdId)){
										document.getElementById(pwdId).value = retObj.inputText;
									}
									if(document.getElementById('_'+pwdId)){
										document.getElementById('_'+pwdId).value = retObj.cipherText;
									}
									if(document.getElementById('_'+pwdId+'_md5')){
										document.getElementById('_'+pwdId+'_md5').value = retObj.md5Text;
									}
								}
							}else if(message=='1'){//第一次打开键盘获取高度回调
								var height = result.payload;
								exports.fadeoutPgKeyBoard(pwdId,height);
							}else if(message=='3'){//关闭隐藏键盘回调
								exports.fadeInPgKeyBoard();
							}else{
								mui.alert("调用插件时发生异常");
							}
						} else {
//							plus.nativeUI.toast(result.message);
							mui.alert(result.message);
						}
					} else {
//						plus.nativeUI.toast("调用插件时发生异常");
						mui.alert("调用插件时发生异常");
					}
				}, function(result) {
					if(errorCallback && typeof errorCallback=='function'){
						errorCallback(result);
					}else{
//						plus.nativeUI.toast(result);
						mui.alert(result);
					}
				});
	
	}
	

	/**
	 * 字母与数字组合密码键盘
	 * @param {Object} pwdId  密码键盘的input的Id,
	 * 	注意：
	 * 		1.一般加密需要html中增加id=_pwdId的隐藏input域  <input id="_pwdId" type="hidden">
	 * 		2.若是修改密码，则在html中新增id=_pwdId_md5的隐藏input域 <input id="_pwdId_md5" type="hidden">
	 * @param {Object} successCallback  成功回调函数 ，形参data={cipherText:"",md5Text:""}
	 * @param {Object} errorCallback	失败回调函数
	 */
	exports.openRsaAesKeyboard = function(pwdId,successCallback,errorCallback){
		if(!window.plus.pluginPGKeyboard){
			mui.alert("加载密码控件对象失败");//供插件调试使用
			return false;
		}
		
		var checkKey = PWD_KEYS&&PWD_KEYS['publicKey']&&PWD_KEYS['key'];
		if(!checkKey){
			plus.nativeUI.toast('密钥获取失败');//供插件调试使用
			return false;
		}
		
		targetPwdId = pwdId;
		
		window.plus.pluginPGKeyboard.openRSAAESKeyboard(pwdId, 'false', 0,LOGON_PWD_LENGTH,"false","true","true",LOGON_PWD_REG,"",PWD_KEYS['key'],PWD_KEYS['publicKey'],
			function(result) {
					if (result) {
						if (result.status) {
							var message = result.message;
							if(message=='2'){//正常加密回调
								var json=result.payload;
								var obj =  $.parseJSON(json);
								var retObj = {
									cipherText  : obj.cipherText==null?"":obj.cipherText,
									md5Text 	: obj.md5==null?"":obj.md5,
									inputText	: obj.text==null?"******":obj.text
								};
								if(successCallback && typeof successCallback==='function'){
									successCallback(retObj);//将密文放在隐藏域中
								}else{
									if(document.getElementById(pwdId)){
										document.getElementById(pwdId).value = retObj.inputText;
									}
									if(document.getElementById('_'+pwdId)){
										document.getElementById('_'+pwdId).value = retObj.cipherText;
									}
									if(document.getElementById('_'+pwdId+'_md5')){
										document.getElementById('_'+pwdId+'_md5').value = retObj.md5Text;
									}
								}
							}else if(message=='1'){//第一次打开键盘获取高度回调
								var height = result.payload;
								exports.fadeoutPgKeyBoard(pwdId,height);
							}else if(message=='3'){//关闭隐藏键盘回调
								exports.fadeInPgKeyBoard();
							}else{
								mui.alert("调用插件时发生异常");
							}
						} else {
							mui.alert(result.message);
						}
					} else {
						mui.alert("调用插件时发生异常");
					}
				}, function(result) {
					if(errorCallback && typeof errorCallback=='function'){
						errorCallback(result);
					}else{
//						plus.nativeUI.toast(result);
						mui.alert(result);
					}
				});
	
	}
	
	/**
	 * 通用版本密码控件调用方法
	 * @param {Object} pwdId  密码输入框id
	 * @param {Object} isNumber  'false'为混合键盘  'true'为数字
	 * @param {Object} maxLength   密码长度
	 * @param {Object} regExp  正则
	 * @param {Object} successCallback
	 * @param {Object} errorCallback
	 */
	exports.openRsaAesKeyboardCommon = function(pwdId,isNumber,maxLength,regExp,successCallback,errorCallback){
		if(!window.plus.pluginPGKeyboard){
			mui.alert("加载密码控件对象失败");//供插件调试使用
			return false;
		}
		
		var isNum = isNumber||'false';
		var length = maxLength||10;
		var reg = regExp||"^(?![^a-zA-Z]+$)(?!\\D+$).{6,16}$";
		
		var checkKey = PWD_KEYS&&PWD_KEYS['publicKey']&&PWD_KEYS['key'];
		if(!checkKey){
			plus.nativeUI.toast('密钥获取失败');//供插件调试使用
			return false;
		}
		
		exports.fadeoutPgKeyBoard(pwdId);
		
		window.plus.pluginPGKeyboard.openRSAAESKeyboard(pwdId, isNum, 0,length,"false","true","true",reg,"",PWD_KEYS['key'],PWD_KEYS['publicKey'],
			function(result) {
					if (result) {
						if (result.status) {
							var json=result.payload;
							var obj =  $.parseJSON(json);
							var retObj = {
								cipherText  : obj.cipherText==null?"":obj.cipherText,
								md5Text 	: obj.md5==null?"":obj.md5,
								inputText	: obj.text==null?"******":obj.text
							};
							if(successCallback && typeof successCallback==='function'){
								
								successCallback(retObj);//将密文放在隐藏域中
							}else{
								if(document.getElementById(pwdId)){
									document.getElementById(pwdId).value = retObj.inputText;
								}
								if(document.getElementById('_'+pwdId)){
									document.getElementById('_'+pwdId).value = retObj.cipherText;
								}
								if(document.getElementById('_'+pwdId+'_md5')){
									document.getElementById('_'+pwdId+'_md5').value = retObj.md5Text;
								}
							}
						} else {
							mui.alert(result.message);
						}
					} else {
						mui.alert("调用插件时发生异常");
					}
				}, function(result) {
					if(errorCallback && typeof errorCallback=='function'){
						errorCallback(result);
					}else{
//						plus.nativeUI.toast(result);
						mui.alert(result);
					}
				});
	
	}
	
	/**
	 * 检查输入密码与确认密码是否一致
	 * @param {Object} pwdId
	 * @param {Object} pwdIdconfirm
	 * @return boolean 
	 */
	exports.checkPwdIdentify = function(pwdId,pwdIdconfirm){
		if(pwdId&&pwdIdconfirm){
			var inputMd5Obj   = jQuery('#_'+pwdId+'_md5');
			var confirmMd5Obj = jQuery('#_'+pwdIdconfirm+'_md5');
			if(inputMd5Obj.val()&&confirmMd5Obj.val()){
				var input = inputMd5Obj.val()||'';
				var confirm = confirmMd5Obj.val()||'';
				var inputSpan = inputMd5Obj.parent().find('span').text();
				var confirmSpan = confirmMd5Obj.parent().find('span').text();
				if(input===confirm){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
		
	}
	
	//检验密码的正则表达式 长度/纯数字/字母数字组合
	exports.checkMatch = function(pwdId){
		if(!window.plus.pluginPGKeyboard){
			plus.nativeUI.toast('加载密码控件对象失败');//供插件调试使用
			return false;
		}
		return window.plus.pluginPGKeyboard.checkMatch(pwdId);
	}
	
	//隐藏密码键盘
	exports.hideKeyboard = function(pwdId){
		if(!window.plus.pluginPGKeyboard){
			plus.nativeUI.toast('加载密码控件对象失败');//供插件调试使用
			return false;
		}
		window.plus.pluginPGKeyboard.hideKeyboard(pwdId);
	}
	
	//清空输入框内容
	exports.clearKeyboard = function(pwdId){
		if(!window.plus.pluginPGKeyboard){
			plus.nativeUI.toast('加载密码控件对象失败');//供插件调试使用
			return false;
		}
		window.plus.pluginPGKeyboard.clearKeyboard(pwdId);
	}
	
	/**
	 * 注册密码键盘事件，用于监听密码键盘收起或者展开的状态
	 * @param {Object} successCallback
	 * @param {Object} failCallback
	 */
//	exports.registerHideKeyBoard = function(successCallback,failCallback){
//		if(!window.plus.pluginPGKeyboard){
//			plus.nativeUI.toast('加载密码控件对象失败');//供插件调试使用
//			return false;
//		}
//		window.plus.pluginPGKeyboard.registerHideKeyBoardCallBack(successCallback,failCallback);
//	}
	
	/**
	 *  获取密码键盘的高度
	 * @param {Object} pwdId
	 */
//	exports.getPluginKeyBoardHeight = function(pwdId){
//		if(!window.plus.pluginPGKeyboard){
//			plus.nativeUI.toast('加载密码控件对象失败');//供插件调试使用
//			return false;
//		}
//		var height = window.plus.pluginPGKeyboard.getKeyboardHeight(pwdId)||0;
//		return Number(height);
//	}
	
	
	
	/*****************************************************************************
	 * 以下方法非SDK的原生集成方法
	 * 属于实现密码键盘的自动浮动
	 * ***************************************************************************
	 */
	
	
	exports.fadeInPgKeyBoard = function(){
		//注册成功 隐藏键盘后调用的方法
		var bodyElem = jQuery(document.body);
		if(bodyElem.hasClass(PWD_KEYBOARD_CLASS)){
			exports.pageAnimation(bodyElem,0);
			//延时，避免动画效果失效
			setTimeout(function(){
				bodyElem.removeClass(PWD_KEYBOARD_CLASS);
			},400)
		}
	}
	
	/**
	 * 展开键盘时，密码输入框进行位移
	 */
	exports.fadeoutPgKeyBoard = function(pwdId,height){
		
       var offTop = exports.computePgKbPosition(pwdId,height);
       var bodyElem = jQuery(document.body);
       exports.pageAnimation(bodyElem.addClass(PWD_KEYBOARD_CLASS),offTop);
                                                   
	}
	
	/**
	 * 计算密码输入框的偏移位移
	 * @param {Object} pwdId
	 */
	exports.computePgKbPosition = function(pwdId,height){
		var pgHeight = Number(height);//number
		var offsetTop = jQuery('#'+pwdId).parent().offset().top;//number
		var elemHeight = jQuery('#'+pwdId).parent().outerHeight();//number
		var winHightPX = Number(plus.screen.resolutionHeight||0);//number
		var inputBottomH = parseFloat(winHightPX-offsetTop-elemHeight);//当前元素距离屏幕底部高度
		if(inputBottomH>pgHeight){
			return 0;
		}else{
			return inputBottomH-pgHeight;
		}
	}
	
	/**
	 * 展示动画效果
	 * @param {Object} elem
	 * @param {Object} top
	 */
	exports.pageAnimation = function(elem,top){
		elem.css({
			top:top+'px',
			transitionDelay:'10ms',
			transitionDuration:'200ms',
			transitionProperty: 'top',//动画属性 top
			transitionTimingFunction: 'linear'
		});
		
	}
	
	
})
	
