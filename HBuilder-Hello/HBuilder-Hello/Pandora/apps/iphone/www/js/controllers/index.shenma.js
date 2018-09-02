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

	$.init({
		subpages: [
		{
			id: 'main',
			//url: '../views/main/main.html',    51px
			url: '../views/main/main.html',
			styles: {
				top: '0px',
				bottom: '52px'
			}
		},
		/*{
			id: 'start',
			//url: '../views/main/main.html',    51px
			url: '../views/start.html',
			styles: {
				top: '0px',
				bottom: '0px'
			}
		},*/
		{
			id: 'guide',
			//url: '../views/main/main.html',    51px
			url: '../views/guide.html',
			styles: {
				top: '0px',
				bottom: '0px'
			}
		}]
	});
	
	$.plusReady(function() {
		if(mui.os.ios){
			plus.navigator.setFullscreen(true);	
		}
  //读取本地存储，检查是否为首次启动
  	plus.screen.lockOrientation("portrait-primary");
	var isShowed = userInfo.getItem("showGuideFlag");
	if(jQuery.param['AD_SWITCH']&&isShowed){//有广告  并且做过首次导航
	var ad=mui.preload({
			id: 'start',
			//url: '../views/main/main.html',    51px
			url: '../views/start.html',
			styles: {
				top: '0px',
				bottom: '0px'
			}
	});
	ad.show();
	}
		//"portrait-primary": 竖屏正方向
		plus.screen.lockOrientation("portrait-primary");
		doc.getElementById('main').classList.add('mui-active');
		//doc.getElementById('productList').classList.remove('mui-active');
		doc.getElementById('transfer').classList.remove('mui-active');
		doc.getElementById('myOwn').classList.remove('mui-active');
        
		//var items = doc.getElementsByClassName('tab-item-menu');
		window.addEventListener('footer', function(event) {
			//获得事件参数
			var fid = event.detail.fid;
			//根据参数变换footer
			plus.webview.currentWebview().show();
			doc.getElementById('main').classList.remove('mui-active');
			//doc.getElementById('productList').classList.remove('mui-active');
			doc.getElementById('transfer').classList.remove('mui-active');
			doc.getElementById('myOwn').classList.remove('mui-active');
			doc.getElementById(fid).classList.add('mui-active');
			activeId=fid;
			/*$.openWindow({
							url: fid + '/' + fid + '.html',
							id: fid,
							show: {
								aniShow: 'pop-in'
							},
							styles: {
								top: '0px',
								bottom: '51px'
							},
							waiting: {
								autoShow: false
							}
						});*/
		});
		
		if(isShowed){
			plus.webview.getWebviewById("guide").hide();
		}else{
			plus.webview.getWebviewById("guide").show();
		}

		var items = jQuery("#footerUl>li");

		for (var i = 0; i < items.length; i++) {
			items[i].addEventListener('tap', function() {
				var tid=this.getAttribute('id');
				var path=this.getAttribute('path');
                var noCheck=this.getAttribute('noCheck');
				//生成子webview
				if (tid == "myOwn") {
					var sessionid = userInfo.get('sessionId');
					if (sessionid == '' || sessionid == null || sessionid == undefined) {
						var webview = plus.webview.create('../views/myOwn/myOwnLogin.html', "myOwnLogin", {
							top: '0px',
							bottom: '51px'
						});
						webview.onloaded = function() {
							doc.getElementById("myOwn").classList.add('mui-active');
							doc.getElementById(activeId).classList.remove('mui-active');
							webview.show("none");
							activeId = "myOwn";
						}
						return;
					}

				}
				targetId = tid;
				if (targetId == activeId) {
					return false;
				}
				if("true"==noCheck||mbank.checkLogon('\.\./views/')){
					var webview = plus.webview.create(path, targetId, {
					top: '0px',
					bottom: '51px'
					});
	
					//var title = this.getAttribute('data-title');
					webview.onloaded = function() {
					
						//doc.getElementById('app-title').innerText = title;
						//切换选项卡亮点
						doc.getElementById(targetId).classList.add('mui-active');
						doc.getElementById(activeId).classList.remove('mui-active');
						//显示webview
						webview.show("none");
						//隐藏前一个webview
						//plus.webview.hide(activeId);
						activeId = targetId;
					}
				}
				
			});
		}


		// close splash
		/*setTimeout(function() {
			//关闭 splash
//			plus.navigator.closeSplashscreen();
		}, 600);*/

		//
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

});