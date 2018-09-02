define(function(require, exports, module){
	
	var currentItem = "allBonds";
	var top = 110;
	if(mui.os.android ){
		top = top -20 + 'px';				
	}else{
		top = top + 'px';			
	}
	
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
				url:'allBonds.html',
				id:'allBonds',
				styles:{
					top: top,
					bottom: '0px'
				}
			}
//		,{
//				url:'expireDateBonds.html',
//				id:'expireDateBonds',
//				styles:{
//					top: '110px',
//					bottom: '0px'
//				}
//			}
		]
	});
	
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
//		plus.webview.close("myBondsInfo");
//		var self = plus.webview.currentWebview();
		$("#menuDiv a").on("tap",function(){
			var id = $(this).attr("id");
			if (currentItem == id) {
				return;
			}
			currentItem = id;
			var child = plus.webview.getWebviewById("allBonds");
			mui.fire(child, 'itemId', {currentItem: currentItem});
		});
		
		//切换选项卡
		window.addEventListener("changeItem",function(event){
        	var currentItem = event.detail.currentItem;
        	if (currentItem) {
	        	$("#menuDiv a").removeClass("mui-active");
				$("#" + currentItem).addClass("mui-active");
        	}
        });
		
		//重新加载
		window.addEventListener("reload", function(event) {
			var child = plus.webview.getWebviewById("allBonds");
			mui.fire(child, 'itemId', {currentItem: currentItem});
		});
	});
});