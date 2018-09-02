define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	mui.init({
			keyEventBind: {
				backbutton: false,
				menubutton: false
			}
		});//预加载

		
	mui.plusReady(function(){
		var quit = document.getElementById("quit");
		var isAalive = localStorage.getItem("session_customerId");
		var self = plus.webview.currentWebview();
		getUserInfo();
		function getUserInfo(){
			if(isAalive){
				quit.style.display="block";
				var userName = localStorage.getItem("session_customerNameCN");
				/*var lastLoginTime = localStorage.getItem("customerLastLogon");
				var showTime = lastLoginTime.substring(0,4)+"-"+lastLoginTime.substring(4,6)+"-"+lastLoginTime.substring(6,8)
				               +"  "+lastLoginTime.substring(8,10)+":"+lastLoginTime.substring(10,12);*/
				document.getElementById("userName").innerText = userName;
				var customerMessage = userInfo.get("customerMessage");
				if(customerMessage!=''&&customerMessage!=null&&customerMessage!="null"){
//					messageSet.val(customerMessage);
					$('#lastLoginTime').html("预留信息:"+customerMessage);
				}
				 
//			document.getElementById("lastLoginTime").innerText = "预留信息   "+showTime;
			}else{
//				document.getElementById("userIcon").src="../../img/u_head.png";
				document.getElementById("userName").innerText = "欢迎使用，点击登录";
				document.getElementById("userName").addEventListener('tap',function(){
						mbank.checkLogon();
					});
				
			}
			showIcon();
		}
		
		
		//查询版本号
		
		plus.runtime.getProperty(plus.runtime.appid,function(inf){
		    var  wgtVer=inf.version;

		 	document.getElementById("version").innerText = "当前版本："+wgtVer;
		});
		
		
		
		var main = null;
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		main = plus.webview.currentWebview().opener();
		
		function closeMenu () {
			mui.fire(main,"menu:swiperight");
		}
		
		//begin  add by luchunyou
		document.getElementById("myCard").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			//mui.alert(noCheck);
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		
		document.getElementById("aboutUs").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			//mui.alert(noCheck);
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		//end
		/*document.getElementById("limitSet").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});*/
		
		//安全退出，session中拿掉cstId,刷新main_sub页面
		quit.addEventListener('tap',function(){
			var url = mbank.getApiURL() + 'userSignOff.do';
			mbank.apiSend('post', url, null ,quitSuccess, quitError, false);
			function quitSuccess(){
				//plus.runtime.quit();
				userInfo.removeItem("session_customerId");
				userInfo.removeItem("iAccountInfo");
			    mbank.clearDestinationPage();
				var main_sub = plus.webview.getWebviewById("main_sub");
				mui.fire(main_sub,'logOut',{});
				quit.style.display="none";
				plus.webview.getLaunchWebview().setStyle({mask:"none"});
				plus.nativeUI.toast("您已成功退出");
				var myOwn = plus.webview.getWebviewById("myOwn");
				mui.fire(myOwn,"reload");
				mbank.backToIndex(true);
				self.close();
			}
			
			function quitError(){
				
			}
		});
		
		/*var deviceManager = document.getElementById("deviceManager");
		deviceManager.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});*/
		
		document.getElementById("safeCenterHome").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		
		//网点导航
		var branches = document.getElementById("branches");
		branches.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right",{noCheck:noCheck});
		});
		
		window.addEventListener("swiperight",function(){
			mui.fire(main,"hideRight");
		});
        
        
        function showIcon(){
	        var path=localStorage.getItem("userIcon")
	        if( path!=undefined && path!=null && path.length>0 ){
	        	$("#userIcon").attr("src",path);
	        }       	
        }
        
        
        function getPreMessage(){
			var preMsgUrl = mbank.getApiURL()+'showPreSettingMessagePage.do';
			mbank.apiSend("post",preMsgUrl,'',successback,null,true);
			function successback(data){
				if(data.customerMessage!=''&&data.customerMessage!=null){
					$('#lastLoginTime').html("预留信息:"+data.customerMessage);
				} else {
					$('#lastLoginTime').empty();
				}
				
			}
		}
        
        window.addEventListener("reload",function(event){
        	getUserInfo();
//			getPreMessage();
        });
        
	});
});