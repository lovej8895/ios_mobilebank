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
	
	var imgDownloader = require('../core/imgDownloader');
	
	var jumpMain = doc.getElementById("jumpMain"),
			timeDesc = doc.getElementById("timeDesc"),
			advertsDiv = doc.getElementById("advertsDiv");
	$.init();
	$.plusReady(function() {
		
		plus.navigator.setFullscreen(true);
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var filepath = self.filepath;
		advertsDiv.style.backgroundImage = "url("+filepath+")";
		
		
		
		var normalTime = timeDesc.innerHTML, //5s
			currTime = parseInt(normalTime); //当前s
		console.log('倒计时time:'+normalTime);



		setTimeout(function(){
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
		},1000)
		

		var intervalid = setInterval("delay()", 1200);//1000改为1200  低配置手机1000ms倒计时  会出现隔数跳的情况 
		delay = function() {
			--currTime;
			if (currTime == 0) {
				openMain();
				clearInterval(intervalid);
			}
			timeDesc.innerHTML = currTime;
			//currTime--;
		}

		jumpMain.addEventListener("tap", function() {
			openMain();
		}, false);

		openMain = function() {
			plus.webview.currentWebview().hide();
			plus.navigator.setFullscreen(false);
			plus.webview.getLaunchWebview().evalJS("appVersionUpdate && appVersionUpdate()");
			plus.webview.currentWebview().close();
//			$.openWindow({
//				url: 'main/main.html',
//				id: 'main',
//				show: {
//					aniShow: 'none'
//				},
//				styles: {
//					top: '0px',
//					bottom: '52px'
//				},
//				waiting: {
//					autoShow: false
//				}
//			});
		};
		
		
		
		
		advertsDiv.addEventListener('tap',function(){
			
			var index = filepath.lastIndexOf("/");
			var filename = filepath.substring(index+1,filepath.length);
			var linkAddr = imgDownloader.selectLinkAddr(filename);
			if(linkAddr){
				var params = {
						returnurl : linkAddr,
						ADValue : '',
						ADtitle : '广告详情',
						noCheck : "true"
				};
				
				clearInterval(intervalid);
				mbank.openWindowByLoad('adView/adViewDetail.html','adViewDetail','slide-in-right',params);
			}
		})
		
		
		
		mui.back = function(){}
		plus.key.addEventListener('backbutton',function(){
			return false;
		})
		
	});

});