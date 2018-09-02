define(function(require, exports, module) {
	exports.queryLog = function(successCallback,failCallback){
		window.plus.plugingetCrashLog.getLog(function(data){
			if(data.status){
				if(mui.os.android){
					if(data.message=='1' && data.payload !=undefined && data.payload !=null && data.payload !="" && data.payload.trim()!=""){
						plus.io.resolveLocalFileSystemURL(data.payload,function(entry){
			                entry.file(function(file) {
								var fileReader = new plus.io.FileReader();
								fileReader.readAsText(file);
								fileReader.onloadend = function(evt) {
									var data = evt.target;
									successCallback(data.result);
								}
							},function(e1) {
								failCallback("读取android崩溃日志出错："+e1.message);
							});
			    		},function(e){
			    			failCallback("查找android崩溃日志出错："+e.message);
			    		});
					}else{
						failCallback("android未获取到崩溃日志");
					}
				}else if(mui.os.ios){
					if(data.payload !=undefined && data.payload !=null && data.payload !="" && data.payload.trim()!="" && data.payload !='0'){
						successCallback(data.payload);
					}else{
						failCallback("ios未获取到崩溃日志");
					}
				}
			}else{
				failCallback("未获取到崩溃日志");
			}
		},function(code){
			failCallback("原生壳获取崩溃日志出错");
		});
	}
	
	
	exports.deleteLog = function(successCallback,failCallback){
		window.plus.plugingetCrashLog.deleteLog(function(data){
			if(data.status){
				successCallback("删除成功");
			}else{
				failCallback("删除崩溃日志不成功");
			}
		},function(code){
			failCallback("删除崩溃日志出错");
		});
	}
	
	
	
	exports.writelog = function(successCallback,failCallback){
		window.plus.plugingetCrashLog.writelog(function(data){
			if(data.status){
				if(data.message ==1){
					successCallback("写成功");
				}else{
					failCallback(data);
				}
			}else{
				failCallback(data);
			}
		},function(code){
			failCallback(code);
		});
	}
	
	exports.getAppIpAddr = function(successCallback,failCallback){
		window.plus.plugingetIPAdress.getIPAdress(function(data){
			if(data.status){
				if(data.payload !=undefined && data.payload !=null && data.payload !="" && data.payload.trim()!=""){
					successCallback(data.payload);
				}else{
					failCallback(data);
				}
			}else{
				failCallback(data)
			}
		},function(code){
			failCallback(code);
		});
	}
	
	
	exports.getAppMacAddr = function(successCallback,failCallback){
		window.plus.plugingetMACAdress.getMACAdress(function(data){
			if(data.status){
				if(data.payload !=undefined && data.payload !=null && data.payload !="" && data.payload.trim()!=""){
					successCallback(data.payload);
				}else{
					failCallback(data);
				}
			}else{
				failCallback(data);
			}
		},function(code){
			failCallback(code);
		});
	}
	
})