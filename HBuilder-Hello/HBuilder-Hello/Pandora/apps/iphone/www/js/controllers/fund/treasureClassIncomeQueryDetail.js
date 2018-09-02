define(function(require,exports,module){
	var format = require('../../core/format');
	var top ='64px';
	if(mui.os.android){
		top = '45px';
	}
	mui.init({
		swipeBack:false,
		keyEventBind:{
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'../fund/lastWeekIncome.html',
			id:'lastWeekIncome',
			styles:{
				top: top,
				bottom:'0px'
				}
		}]
	});
	
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定竖屏
		var self = plus.webview.currentWebview();

		//获取子页面参数
//		window.addEventListener("getNumWeek", function(event) {
//			var f_monthincome = event.detail.f_monthincome;
//			var f_weekincome = event.detail.f_weekincome;
//			$("#lastWeekIncome").html("近一周收益"+format.formatMoney(f_weekincome,2)+"元");
//			$("#lastMonthIncome").html("近一月收益"+format.formatMoney(f_monthincome,2)+"元");
//		});
		
	});
});
