define(function(require, exports, module) {
	var doc = document;
	var $ = mui;
	var activeId = 'main';
	var targetId = '';
	// 引入依赖
	var app = require('../core/app');
	var userInfo = require('../core/userInfo');
	var mbank = require('../core/bank');
	var nativeUI = require('../core/nativeUI');
	var updateVersion = require('../common/checkupdate');
	var pluginsUtil = require('../core/pluginsUtil');
	var imgDownloader = require('../core/imgDownloader');
	var ret = false;//唤起APP功能新增控制参数
	$.init({
		subpages: [
		{
			id: 'main',
			url: '../views/main/main.html',
			styles: {
				top: '0px',
				bottom: '52px'
			}
		}
		]
	});
	$.plusReady(function() {
		//性能调试
		console.log('是否开启硬件加速：'+plus.webview.defaultHardwareAccelerated());
		//当前系统版本
		console.log(plus.os.version);
		if(!localStorage.getItem('osversion')){
			localStorage.setItem("osversion",plus.os.version);
		}
		
		if(plus.storage.getItem('user_rem')){
			localStorage.setItem("user_rem",plus.storage.getItem('user_rem'));
		}
		if(plus.storage.getItem('logonId')){
			localStorage.setItem("logonId",plus.storage.getItem('logonId'));
		}
		if(plus.storage.getItem('session_keys')){
			localStorage.setItem("session_keys",plus.storage.getItem('session_keys'));
		}
		//登陆前清除登陆信息
		userInfo.removeItem("sessionId");
		localStorage.removeItem('sessiontimeout');
		localStorage.removeItem("resubmit_page_id");
		//清除账号信息
		mbank.clearUserSessionInfo();
		if(mui.os.ios){
			plus.navigator.setFullscreen(false);
		}
	  //读取本地存储，检查是否为首次启动
		plus.screen.lockOrientation("portrait-primary");
	    plus.nativeUI.closeWaiting();
	    
	    //接收第三方程序唤起此APP进行业务逻辑处理
	    //第三方支付与卡密校验
		awakeAppsToPage();
		
		/**
		 * 版本更新
		 */
		 window.appVersionUpdate = function(){
	   	 	//检查版本号是否需要更新
			plus.runtime.getProperty(plus.runtime.appid,function(inf){
			    var  wgtVer=plus.runtime.version;
			    var  checkUrl = '';
			    console.log("当前应用版本："+wgtVer);
			    console.log("检测更新...");
			    if (mui.os.ios) {
		    		var ver = plus.runtime.version;
		    		var appArr = ver.split('.');
					var versionCode1 = appArr[0];
					var versionCode2 = appArr[1];
					var versionCode3 = appArr[2];
					while(versionCode2.length<3){
						versionCode2="0"+versionCode2;
					}
					while(versionCode3.length<3){
						versionCode3="0"+versionCode3;
					}
					versionCode1 = versionCode1+versionCode2+versionCode3;
		    		$.ajax({
						type:"post",
						url:"http://itunes.apple.com/lookup?id=718080432",
						async:true,
						dataType: 'json',
						success: function(result){
							if(result["resultCount"]!='0'){
								var versionNum = result["results"][0]["version"];
								var appArr2 = versionNum.split('.');
								var versionRemote1 = appArr2[0];
								var versionRemote2 = appArr2[1];
								var versionRemote3 = appArr2[2];
								while(versionRemote2.length<3){
									versionRemote2="0"+versionRemote2;
								}
								while(versionRemote3.length<3){
									versionRemote3="0"+versionRemote3;
								}
								versionRemote1 = versionRemote1 + versionRemote2 + versionRemote3;
								if(versionRemote1>versionCode1){
									var param={
										version : versionNum
									}
									updateVersion.checkAppVersion(param,function(data){
									    var ws = plus.webview.currentWebview();
									    
										var href = "../views/updateVersion.html";
									   	var sharew = plus.webview.create(href, "updateVersion", {background:"transparent",zindex:990,popGesture:'none'}
									   	, {
											dec : result["results"][0]["releaseNotes"],
											version : versionNum,
											productMode : true,
											params : data,
											url: mbank.getVersionUpdateUrl()
										});
										plus.webview.show(sharew);
								   });
								}
							}
				   		}
					});
				} else if (mui.os.android) {
				   updateVersion.checkAppVersion(null,function(data){
					    var ws = plus.webview.currentWebview();
					    
						var href = "../views/updateVersion.html";
					   	var sharew = plus.webview.create(href, "updateVersion", {background:"transparent",zindex:990,popGesture:'none'}
					   	, {
							params: data
						});
						plus.webview.show(sharew);
				   });
				} else{
					//TODO
					console.log("获取设备客户端信息失败 ！");
				}
			});
	   }
		 
		 
		//控制唤起app不做任何业务逻辑处理
	    if(ret){return false;}
		var isShowed = userInfo.getItem("showGuideFlag");
		
		if(!isShowed){
			var guideView=mui.preload({
					id: 'guide',
					url: '../views/guide.html',
					styles: {
						top: '0px',
						bottom: '0px',
						hardwareAccelerated:true
					}
				});
		
			guideView.addEventListener('loaded',function(){
				plus.navigator.closeSplashscreen();
				guideView.show("fade-in",100);
			});
			
			setTimeout(function(){
//				processBuzz();
			
				bindPageEvents();
			},200);
			
		}else{
			processBuzz();
			
			bindPageEvents();
			
		}
		setTimeout(function(){
			getCrashLog();
			getIpAndMac();
		},500);
		
		//接收消息推送进行逻辑处理
		pushMessage();
		
		
		//处理切换应用的逻辑
		tabAppEvents();
		
		//需要处理预加载
		function processBuzz(){
			
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE){
				plus.nativeUI.toast('当前网络未连接');
				return;
			}
			
			//预加载广告页面
			if(jQuery.param['ADD_SWITCH']&&isShowed){//有广告  并且做过首次导航
				mbank.apiSend("POST",mbank.getApiURL()+"queryAdvertsInfoList.do",{"liana_notCheckUrl":false},function(data){
					var versionNum = data.advertVerNum||'';
					var iAdvertsInfoList = data.iAdvertsInfoList ||[];
					
					if(imgDownloader.compareAdVersion(versionNum)){
					
					//清空广告目录
					imgDownloader.delAllFiles("_downloads/adverts/",function(){
						
						imgDownloader.updateAdVersion(versionNum);
						
						for (var i=0,len = iAdvertsInfoList.length ; i<len; i++) {
							var advertObj = iAdvertsInfoList[i];
							imgDownloader.loadImageRes({
								remoteUrl:mbank.getApiURL()+"/mbank/startADImg"+"/"+advertObj.fileName,
								bizType:"adverts",
								params :{fileName:advertObj.fileName,adLinkAddr:advertObj.adLinkAddr },
								successFun:function(options){
									//往缓存中插入 文件名+对应的链接地址
										console.log(options.fileName+"========"+options.adLinkAddr)
										imgDownloader.insertLinkAddr(options.fileName , options.adLinkAddr);
								}
							})
						}
					});
					
					preLoadPage();
				}else{
					var filepath = imgDownloader.getOneRandomFileInDir("_downloads/adverts",function(data){
					
					console.log("=======随机广告路径:"+data)
					var startView = plus.webview.create('../views/start.html', "start", 
								{
									popGesture:'none',top:'0px',bottom: '0px'
								},
								{
									filepath : data
								});
					startView.addEventListener('loaded',function(){
						plus.webview.show(startView);
					})
										
										
					},function(){
						console.log("广告图片加载失败.....");
						preLoadPage();
					});
				}
					
				},function(e){
					console.log("广告图片链接查询加载失败.....");
					preLoadPage();
				})
				
			}else{
				preLoadPage();
			}
			
		}
		
		
		/**
		 *  其他首页预加载
		 */
		function preLoadPage(){
			//版本更新
			appVersionUpdate();
			var bankhome=mui.preload({
						id: 'productList',
						url: '../views/banking/banking_home.html',
						styles: {
							top: '0px',
							bottom: '52px'
						}
				});
			
			var lifehome=mui.preload({
					id: 'life',
					url: '../views/life/lifeHome.html',
					styles: {
						top: '0px',
						bottom: '52px'
					}
			});
		}
		
		
		//index中需要处理的业务逻辑
		function bindPageEvents(){
			document.querySelector('.footer').addEventListener('touchmove',function(e){
	     		e.preventDefault();
	     		e.stopPropagation();
     		})
     
			window.addEventListener('footer', function(event) {
				//获得事件参数
				var fid = event.detail.fid;
				//根据参数变换footer
				plus.webview.currentWebview().show();
				doc.getElementById('main').classList.remove('mui-active');
				doc.getElementById('productList').classList.remove('mui-active');
				doc.getElementById('life').classList.remove('mui-active');
				doc.getElementById('myOwn').classList.remove('mui-active');
				doc.getElementById(fid).classList.add('mui-active');
				activeId=fid;
				
			});
			
			var items = jQuery("#footerUl>li");
			for (var i = 0; i < items.length; i++) {
				items[i].addEventListener('tap', function() {
					var tid=this.getAttribute('id');
					var path=this.getAttribute('path');
	                var noCheck=this.getAttribute('noCheck');
					//生成子webview
					targetId = tid;
					if (targetId == activeId) {
						return false;
					}
					if("true"==noCheck||mbank.checkLogon('\.\./views/')){
						if(mbank.isOpenView(targetId)){
							if(mui.os.ios){
								if(targetId=="main"){
									plus.webview.getLaunchWebview().setStyle({popGesture:"none"});	
									plus.webview.getLaunchWebview().show('fade-in',150);
								
								}else{
									plus.webview.show(targetId,'fade-in',150);
								}
							}else{
								//否则，使用fade-in动画
								//plus.webview.hide(activeId);
								if(targetId=="main"){
									plus.webview.getLaunchWebview().show("fade-in",150);
								}else{
	//								plus.webview.hide(targetId);//非第一次显示：先隐藏后显示 才会有动画效果
	//								plus.webview.show(targetId,"fade-in",150);
									plus.webview.getWebviewById(targetId).show('fade-in',150);
								}
							
							
						}	
						}else{
							var webview = plus.webview.create(path, targetId, {
								top: '0px',
								bottom: '52px',
								hardwareAccelerated:true,
								render:'always'
							});
		                    webview.setStyle({popGesture:"none"});
							webview.onloaded = function() {
								//显示webview
								webview.show("fade-in",150);
								
							}
						}
						 doc.getElementById(targetId).classList.add('mui-active');
				         doc.getElementById(activeId).classList.remove('mui-active');
				         activeId = targetId;
					}					  
					
	
					
				});
			}
	
			var backButtonPress = 0;
			$.back = function(event) {
				backButtonPress++;
				if (backButtonPress > 1) {
					userInfo.removeItem("sessionId");
					plus.runtime.quit();
				} else {
					plus.nativeUI.toast('再按一次退出应用');
				}
				setTimeout(function() {
					backButtonPress = 0;
				}, 1000);
				return false;
			};
			
			
		}
		
       
	   
	   	function getCrashLog(){
	   		pluginsUtil.queryLog(function(data){
				crashLogRecord(data);
			},function(code){
//				mui.toast(code);
			});
	   	}
	   	function crashLogRecord(logInfo){
			var deviceType = plus.device.vendor+" "+plus.device.model;
			var mpOS = plus.os.name+" "+plus.os.version;
			mpOS = mpOS.toUpperCase();
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
//      			mui.toast(data);
				},function(code){
//					mui.toast(code);
				});
        	}
        	function crashLogRecordFailFunc(e){
        	}
        }
	   	
	   	function getIpAndMac(){
           /* pluginsUtil.getAppIpAddr(function(data){
            	mui.alert(data);
			},function(){
				mui.alert(typeof data=='object'?JSON.stringify(data):data,"温馨提示");
			});*/
			if(mui.os.ios){
				var userMac = mbank.getCustomUUID();
				localStorage.setItem("userMac",userMac);
			}else{
				pluginsUtil.getAppMacAddr(function(data){
	            	localStorage.setItem("userMac",data);
				},function(){
					localStorage.setItem("userMac","");
				});
			}
	   	}
	   	
	   	
	   	
	   	
	   	 	/**
	   	 * 唤起app,跳转到指定业务页面
	   	 */
	   	function awakeAppsToPage(){
	   		var args = plus.runtime.arguments;
	   		var launcher = plus.runtime.launcher;
	   		var appInf = plus.runtime.ApplicationInf;
	   		if(args){
	   			var paramsMap = getJsonByUrl(args);
	   			var bizType = paramsMap.get("bizType");
	   			var bizParams = jQuery.param.getDisplay('AWAKE_APP_PARAMS',bizType);//param中配置业务参数
	   			paramsMap.put("nocheck",false);
	   			var url = bizParams&&bizParams[1];//后续进行配置
	   			var id  = bizParams&&bizParams[0];//后续可配置
	   			if(id&&url){
	   				ret = true;
	   				mbank.openWindowByLoad(url, id, "slide-in-right", paramsMap.toJson());
	   			}
	   		}
	   	}
	   	
	   	
	   	/**
	   	 * 处理消息推送服务
	   	 */
	   	function pushMessage(){
	   		// 清除应用图标上的数字角标（iOS可用）
			plus.runtime.setBadgeNumber(0);
			// 监听点击消息事件  (离线)
			plus.push.addEventListener("click", function(msg) {
				plus.runtime.setBadgeNumber(0);

				var pushUrl = '';
				var pushId = '';
				var pushParams = '';
				var pushTitle = '';
				var pushContent = '';
				if(plus.os.name =='Android'){
					var jsonData = JSON.parse(msg.payload);
					pushUrl = jsonData.url;
					pushId = jsonData.id;
					pushParams = jsonData.params;
					pushTitle = msg.title;
					pushContent = msg.content;
				}else{
					pushUrl = msg.payload.url;
					pushId = msg.payload.id;
					pushParams = msg.payload.params;
					pushTitle = msg.title;
					pushContent = msg.content;
				}
				if(pushUrl && pushId && pushId !="index"){
					var param = {
						params: pushParams,
						hasParam: '1'
					}
					mbank.openWindowByLoad(pushUrl, pushId, "slide-in-right", param);
				}
			}, false);

			//监听收到消息事件
			plus.push.addEventListener("receive", function(msg) {
				plus.runtime.setBadgeNumber(0);
				var pushUrl = '';
				var pushId = '';
				var pushParams = '';
				var pushTitle = '';
				var pushContent = '';
				if(plus.os.name =='Android'){
					pushUrl = JSON.parse(msg.payload)._payload.url;
					pushId = JSON.parse(msg.payload)._payload.id;
					pushParams = JSON.parse(msg.payload)._payload.params;
					pushTitle = JSON.parse(msg.payload)._payload.title;
					pushContent = JSON.parse(msg.payload)._payload.content;
				}else{
					pushUrl = msg.payload.url;
					pushId = msg.payload.id;
					pushParams = msg.payload.params;
					pushTitle = msg.payload.title;
					pushContent = msg.payload.content;
					if((pushId == 'undefined' || pushId == undefined )&& msg.payload._payload){
						pushUrl = msg.payload._payload.url;
						pushId = msg.payload._payload.id;
						pushParams = msg.payload._payload.params;
					}
				}
				if(plus.os.name == 'Android') {
					if(pushUrl && pushId && pushTitle && pushId !="index"){
						plus.nativeUI.confirm(pushTitle, function(e) {
							if(e.index == 0) {
								var param = {
									params: pushParams,
									hasParam: '1'
								}
								mbank.openWindowByLoad(pushUrl, pushId, "slide-in-right", param);
							} else {
								plus.nativeUI.closeWaiting();
							}
						}, "通知", "nativeUI", ["查看详情", "取消"]);
					}
				} else {
					if(pushUrl && pushId && pushTitle && pushId !="index"){
						mui.confirm(pushTitle, "通知", ["取消", "查看详情"], function(e) {
							if(e.index == 1) {
								var param = {
									params: pushParams,
									hasParam: '1'
								}
								mbank.openWindowByLoad(pushUrl, pushId, "slide-in-right", param);
							} else {
								plus.nativeUI.closeWaiting();
							}
						});
					}
				}
			}, false);
	   	}
	   	
	   	/**
	   	 * 
	   	 */
	   	function tabAppEvents(){
	   		//切换到前台pause
	   		document.addEventListener('newintent',function(){
	   			//alert("3d touch")
	   		},false);
	   		
	   		//切换到后台pause
	   		document.addEventListener('pause',function(){
	   			//alert("go back")
	   		},false);
	   		
	   		//切换到前台resume
	   		document.addEventListener('resume',function(){
	   			//alert('go head')
	   			awakeAppsToPage();
	   		},false)
	   	}
		
	});
	

});