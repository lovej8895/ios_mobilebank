define(function(require, exports, module) {
	var top = "64px";
	if(mui.os.android ){
		top = '46px';				
	}
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: true,
			menubutton: false
		}
		,subpages:[{
				url:'onlineAgentDetail.html',
				id:'onlineAgentDetail',
				styles: {
				top: top,
				bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		//添加监听屏蔽andriod物理返回键
//		plus.key.addEventListener('backbutton',function(){
//			return false;
//		},true)
		
		mui.back=function(){
			plus.nativeUI.confirm("确定要退出在线咨询吗？",function(event){
				if(event.index == 0){
			    	plus.webview.close(self);
				}
			},"温馨提示",["确定","取消"]);
	//			var onlineAgentDetail = plus.webview.getWebviewById("onlineAgentDetail");
	//			alert(123);
	//			mui.fire(onlineAgentDetail,'muiAlert',{data: "确定要退出在线咨询吗？"});//在子页面调用
	//			mui.confirm("确定要退出在线咨询吗？","温馨提示",["确定","取消"],function(event){//父页面不可用此方式
	//				if(event.index == 0){
	//			    	plus.webview.close(self);
	//				}
	//			});
		}
		
	});
});