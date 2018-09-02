define(function(require, exports, module) {
	/**
	 * 检测路径
	 */
	var checkUrl;
	/**
	 * 下载路径
	 */
	var downloadUrl;
	
	/**
	 *  是否强制更新 1强制,0不强制
	 */
	var forceUpdate = 0;
	
	var orgId;
	
	var mbank = require('../core/bank');
	
	var nativeUI = require('../core/nativeUI');
	var $ = mui;
	 
	var options = {
		method:"GET",
		filename:"_doc/download/"//,//下载文件保存的路径
		//timeout:60,//下载任务超时时间,默认120s
		//retry:1//下载任务重试次数,默认为重试3次
	};
	 
		/**
	 * 开始更新
	 */
	function doUpdate() {
		if(plus.os.name == "iOS"){
		//checkUrl = "http:\/\/10.10.0.61:9082\/person\/wgtuVersion.do";
			$.getJSON("../yuconfig.json", function(data) { //alert(data);
				//alert(JSON.stringify(data));
				//alert(data["version-upd"]["editionincr-url"]);
				checkUrl = data["version-upd"]["editionincr-url"];
				plus.runtime.openURL(checkUrl);
				checkResourceVersion();
			});
		}else{
			checkAppVersion();
		}
	}
	
	/**
	 * 检测有无新版本
	 */
	exports.checkAppVersion = function(param,callback){
		var appVersion_result=plus.runtime.version;
		var appId = '';
		var appType;
		if (mui.os.ios) {
		    appType='ipa';
		} else if (mui.os.android) {
		    appType='apk';
		} else{
			//TODO
			console.log("获取设备客户端信息失败 ！");
		}
		var major='';
		var appVersion='';
		if(param!=null){
			appVersion=param.version;
		}else{
			appVersion=plus.runtime.version;
		}
		var appVersionCode=appVersion;
		var appArr = appVersionCode.split('.');
		var appVersionCode1 = appArr[0];
		var appVersionCode2 = appArr[1];
		var appVersionCode3 = appArr[2];
		while(appVersionCode2.length<3){
			appVersionCode2="0"+appVersionCode2;
		}
		while(appVersionCode3.length<3){
			appVersionCode3="0"+appVersionCode3;
		}
		var params = {
    		appId : plus.runtime.appid,
			appType : appType,
			major : major,
			appVersion : appVersion,
			appVersionCode : appVersionCode1+appVersionCode2+appVersionCode3,
    		liana_notCheckUrl : false
    	};
		var url = mbank.getApiURL()+'getMobankVersion.do';
		mbank.apiSend('post',url,params,getVersionInfoBack,null,false);
		//取版本号回调函数
		function getVersionInfoBack(data){
			if(data.url){
				if(mui.os.ios){
					var versionInfo = {
						forceUpdate : data.forceUpdate,
						dec : data.versionDec,
						version : data.appVersion,
						fileType : appType
					};
					callback(versionInfo);
				}else{
					var downUrl = data.url;
					forceUpdate = data.forceUpdate;
					var versionInfo = {
						url : downUrl,
						forceUpdate : data.forceUpdate,
						dec : data.versionDec,
						version : data.appVersion,
						fileSize : data.fileSize,
						fileType : appType
					};
					callback(versionInfo);
				}
			}else{
				if(mui.os.ios){
					var versionInfo = {
						forceUpdate : "0",
						fileType : appType
					};
					callback(versionInfo);
				}
				console.log("已经是最新版本");
			}
		}
	}
	
	var backButtonPress = 0;
	$.back = function(event) {
		backButtonPress++;
		if (backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
		return false;
	};
});