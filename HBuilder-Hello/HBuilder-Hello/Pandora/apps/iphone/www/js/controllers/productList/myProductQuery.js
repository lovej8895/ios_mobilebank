define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	var currentItem = "ownProduct";
    var top = '114px';
    if (mui.os.android) {
    	top = '104px';
    }
    
    mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'myProductList.html',
			id:'myProductList',
			styles: {
			    top: top,
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//关闭交易窗口
		plus.webview.close("productDetail");
		plus.webview.close("productBuy");
		plus.webview.close("productBuyConfirm");
		plus.webview.close("productBuyResult");
		//功能指引
		var myProGuide = userInfo.getItem("myProGuide");
		if (!myProGuide) {
			userInfo.setItem("myProGuide", "true");
			var guide = plus.webview.create("../guide/guide_myProduct.html","guide_myProduct",{background:"transparent",zindex:998,popGesture:'none'});
			plus.webview.show(guide);
		}
		
		$("#menuDiv a").on("tap",function(){
			var id = $(this).attr("id");
			if (currentItem == id) {
				return;
			}
			currentItem = id;
			var child = plus.webview.getWebviewById("myProductList");
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
			var child = plus.webview.getWebviewById("myProductList");
			mui.fire(child, 'itemId', {currentItem: currentItem});
		});
	});
});