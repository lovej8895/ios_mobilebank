define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	var iAccountInfoList= [];
	var top='64px';
    if( mui.os.android ){
    	top='44px';
    }
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'clientHome_sub.html',
				id:'clientHome_sub',
				styles: {
				top: top,
				bottom: '0px'
			}
		}]
	});
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		if(plus.webview.getWebviewById("addAccountOK")){
			plus.webview.close("addAccountOK");
		}
//		if( plus.webview.currentWebview().opener().id=='signResult' ){
//			mui.back = function(){
//				mbank.backToIndex(false);
//			}
//		}
//		var rmbAccount = $('#rmbAccount');
//		var idType = localStorage.getItem("session_certType");
//		idType = $.param.getDisplay('CERT_TYPE_CREDIT',idType);
//		queryDefaultAcct();//相关信息的加载
//		queryDefaultAcct();
		 
		//回掉函数 刷新账号信息
		/*window.addEventListener("reload",function(event){
            queryDefaultAcct();
        });*/
		
		//添加新账户
		/*$('#addAccount').on('tap',function(){
			mbank.openWindowByLoad("../myOwn/addAccount.html","addAccount",'slide-in-right'); 
		});*/
		
	});
	
	
});