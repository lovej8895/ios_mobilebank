define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var pluginsUtil = require('../../core/pluginsUtil');
	mui.init();
	mui.plusReady(function() {
		document.getElementById("writeLogFile").addEventListener("tap",function(){
            pluginsUtil.writelog(function(data){
				mui.alert(data);
			},function(data){
				mui.alert(typeof data=='object'?JSON.stringify(data):data,"写日志温馨提示");
			});
		},false);
		
		/*document.getElementById("getLogFile").addEventListener("tap",function(){
			pluginsUtil.queryLog(function(data){
				crashLogRecord(data);
			},function(code){});
		},false);
		
		document.getElementById("deleteLogFile").addEventListener("tap",function(){
            pluginsUtil.deleteLog(function(data){
				mui.alert(data);
			},null);
		},false);*/
		
		/*document.getElementById("getIp").addEventListener("tap",function(){
            pluginsUtil.getAppIpAddr(function(data){
            	mui.alert(data);
			},function(){
				mui.alert(typeof data=='object'?JSON.stringify(data):data,"温馨提示");
			});
		},false);
		
		document.getElementById("getMac").addEventListener("tap",function(){
            pluginsUtil.getAppMacAddr(function(data){
            	mui.alert(data);
			},function(){
				mui.alert(typeof data=='object'?JSON.stringify(data):data,"温馨提示");
			});
		},false);*/
		
		/*function crashLogRecord(logInfo){
			var deviceType = plus.device.vendor+" "+plus.device.model;
			var mpOS = plus.os.name+" "+plus.os.version;
			var mbUUID = plus.device.uuid;
			var mbIMSI = "";
			for ( var i=0; i<plus.device.imsi.length; i++ ) {
	        	mbIMSI += plus.device.imsi[i];
	    	}
        	var reqData = {
        		"deviceType" : deviceType,
        		"mpOS" : mpOS,
        		"mbUUID" : mbUUID,
        		"mbIMSI" : mbIMSI,
        		"crashLogInfo" : logInfo,
        		"liana_notCheckUrl" : false
        	};
        	var url = mbank.getApiURL()+'crashLogRecord.do';
        	mbank.apiSend("post",url,reqData,crashLogRecordSucFunc,crashLogRecordFailFunc,true);
        	function crashLogRecordSucFunc(data){
        		pluginsUtil.deleteLog(function(data){
				},function(code){});
        	}
        	function crashLogRecordFailFunc(e){
        	}
        }*/
		
		
	});
});