define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var flag=self.flag;
		var html="";		
		if(flag == "0"){
			html +="<button class='but_150px but_red' id='transactionQuery'>当日委托查询</button>";
		}
		if(html !=""){
			html +="<button class='but_150px but_red' id='myProductQuery'>返回我的理财</button>";
		}else{
			html +="<button class='but_315px but_red' id='myProductQuery'>返回我的理财</button>";
		}
		if(flag == '1'){
			document.getElementById('step2').classList.remove('suc_lcicon2');
			document.getElementById('step3').classList.remove('suc_lcicon2');
			document.getElementById('step2').classList.add('suc_lcicon1');
			document.getElementById('step3').classList.add('suc_lcicon1');
		}
		document.getElementById("buttonArea").innerHTML=html;
		var muiBack = mui.back;
//		document.getElementById("myProductQuery").addEventListener("tap",function(){
//			mbank.back('myProductList',muiBack);
//		},false);
		
		$("#transactionQuery").on("tap",function(){
			params={
				noCheck : false
			};
			mbank.openWindowByLoad('../productList/transactionQuery.html','transactionQuery','slide-in-right',params);
		});
		$("#myProductQuery").on("tap",function(){
//			params={
//				noCheck : false
//			};
			plus.webview.getWebviewById("productRedemConfirm").close();
			plus.webview.getWebviewById("productRedemInput").close();
			plus.webview.getWebviewById("ownOpenProductDetail").close();
			mui.fire(plus.webview.getWebviewById("myProductQuery"),"reload",{});
			plus.webview.close(self);
			//mbank.openWindowByLoad('../productList/myProductQuery.html','myProductQuery','slide-in-right',params);
		});
		
		mui.back=function(){
//			params={
//				noCheck : false
//			};
//			mbank.openWindowByLoad('../productList/myProductQuery.html','myProductQuery','slide-in-right',params);
			plus.webview.getWebviewById("productRedemConfirm").close();
			plus.webview.getWebviewById("productRedemInput").close();
			plus.webview.getWebviewById("ownOpenProductDetail").close();
			mui.fire(plus.webview.getWebviewById("myProductQuery"),"reload",{});
			plus.webview.close(self);
		}
	});
});