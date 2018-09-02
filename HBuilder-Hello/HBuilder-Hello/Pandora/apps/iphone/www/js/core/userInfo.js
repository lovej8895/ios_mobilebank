define(function(require, exports, module) {
	
//获取session数据 登陆后使用
	exports.getSessionData = function(name){
		var sessionData = {
			iAccountInfo		:	exports.get("iAccountInfo"),//所有账户列表
			session_customerNameCN	:	exports.get("session_customerNameCN"),//客户中文名称
			session_customerId		:	exports.get("session_customerId"),//客户唯一编号
			session_hostId			:	exports.get("session_hostId"),//核心客户号
			session_certType		:	exports.get("session_certType"),//证件类型
			session_certNo			:	exports.get("session_certNo"),//证件号码
			customerType			:	exports.get("customerType"),//客户类型 00自助注册 01柜面签约
			session_mobileNo		:	exports.get("session_mobileNo"),//客户登陆/开户预留手机号码
			session_mastSafe		:	exports.get("session_mastSafe"),//安全认证方式  0=短信 1=Token 2=Usbkey
			session_channel			:	exports.get("session_channel"),//渠道标识  01=网银 02=手机
			customerLastLogon		:	exports.get("customerLastLogon"),//上一次登陆时间
			customerMessage 		:	exports.get("customerMessage")//客户预留信息
		}
		return name?sessionData[name]:sessionData;
	}
	
	exports.isSupport = function(localStorageJson) {
		return window.localStorage;
	};
	exports.putJson = function(localStorageJson) {
		if (window.localStorage) {
			if (localStorageJson) {
				for (var key in localStorageJson) {
					if(typeof localStorageJson[key]=='object'){
						localStorage.setItem(key, JSON.stringify(localStorageJson[key]));
					}else{
						localStorage.setItem(key, localStorageJson[key].toString());
					}
				}
			}
		}
	};
	exports.put = function(key, value) {
		if (window.localStorage) {
			localStorage.setItem(key, value);
		}
	};
	exports.removeItem = function(key) {
		if (window.localStorage) {
			localStorage.removeItem(key);
		}
	};
	exports.get = function(key) {
		if (window.localStorage) {
			var temp=localStorage.getItem(key)
			 if(temp!=null){
			 	 return localStorage.getItem(key);
			 }
			 return temp;
			
		}
	};
	exports.isAuthorize = function() {
		var flag = false;
		if (window.localStorage) {
			var authorize = localStorage.getItem('authorize');
			if (authorize && authorize == '0') {
				var logonId = localStorage.getItem('logonId');
				var password = localStorage.getItem('password');
				if (logonId && password) {
					if ($.trim(account).length > 0 && $.trim(password).length > 0) {
						flag = true;
					}
				}
			}
		}
		return flag;
	};
	/**
	 * 获取,首先从localStorage取，如果取不到则从plus.storage取
	 */
	exports.getItem = function(key) {
		if(window.localStorage){
			var value = window.localStorage.getItem(key);
			if(!value){
				if(window.plus && plus.storage){
					value = window.plus.storage.getItem(key);
				}
			}
			return value;
		}
	};
	/**
	 * 获取,localStorage和plus.storage都删
	 */
	exports.removeItem = function(key) {
		if(window.localStorage){
			window.localStorage.removeItem(key);
		}
		if(window.plus && plus.storage){
			window.plus.storage.removeItem(key);
		}
	};
	/**
	 * 设置plus.storage的数据
	 */
	exports.setItem = function(key,value){
		value = value ||'';
		if(window.localStorage){
			if(typeof value === 'string'){
				localStorage.setItem(key,value);
			}
			if(typeof value === 'object'){
				localStorage.setItem(key,JSON.stringify(value));
			}
		}
		if(window.plus){
			if(typeof value === 'string'){
				plus.storage.setItem(key,value);
			}
			if(typeof value === 'object'){
				plus.storage.setItem(key,JSON.stringify(value));
			}
		}
	}

});
