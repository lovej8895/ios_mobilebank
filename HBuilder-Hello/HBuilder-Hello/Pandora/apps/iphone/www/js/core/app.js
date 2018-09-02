/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
define(function(require, exports, module) {
	//exports 用来在模块内部对外提供接口。
	
	/**
	 * 当前银行
	 */
	var BANK_NAME = "湖北银行";
	
	/**
	 * 获取银行名称
	 */
	exports.getBankName = function(){
		return BANK_NAME;
	}
	
	/**
	 * 用户登录
	 **/
	exports.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		if (authed) {
			return this.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}
	};

	exports.createState = function(name, callback) {
		var state = this.getState();
		state.account = name;
		state.token = "token123456789";
		this.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	exports.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	exports.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	exports.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = this.getSettings();
		//settings.gestures = '';
		//this.setSettings(settings);
	};
//TODO 这个应该写到检查方法里面去
	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	exports.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 设置应用本地配置
	 **/
	exports.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 获取应用本地配置
	 **/
	exports.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	
	
  /**
	 * 设置短信验证码的倒计时
	 **/
	exports.sendMessage=function(obj,second){
		if(second>=0){
			obj.innerHTML="重新发送("+second +")";
			second--;
			setTimeout(function(){exports.sendMessage(obj,second);},1200);
		}else{
			//obj.removeAttribute("disabled");
			obj.innerHTML="发送验证码";
		}
	}
});