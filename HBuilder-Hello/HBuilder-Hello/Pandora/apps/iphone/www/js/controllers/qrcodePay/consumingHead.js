define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var top = "64px";
	if(mui.os.android) {
		top = '46px';
	}

	//创建子界面初始化
	mui.init({
		swipeBack: false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},
		subpages: [{
			url: '../qrcodePay/consumingResult.html',
			id: 'consumingResult',
			styles: {
				top: top,
				bottom: '0px'
			}
		}]
	});

	//向结果界面派发传递参数事件
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var params = plus.webview.currentWebview().params;
		var accountNo = params.accountNo;
		var beginDate = params.beginDate;
		var endDate = params.endDate;
		var timeType = params.timeType;
		var queryFlag = params.queryType;
		//收付款标识：0—付款  1-收款
		var payFlag = "";
		//console.log("=====进入查询结果页面=====：" + queryFlag);
		//根据查询标志处理查询结果页面的显示
		if ("0" == queryFlag) {
			$("#recordHeadTitle").text("消费记录");
			payFlag = '0';
		} else{
			$("#recordHeadTitle").text("收款记录");
			payFlag = '1';
		}

		var child = plus.webview.getWebviewById("consumingResult");
		var params = {
			"accountNo": accountNo,
			"beginDate": beginDate,
			"endDate": endDate,
			"timeType": timeType,
			"queryType": queryFlag,
			"payType": payFlag
		};
		setTimeout(function(){
			mui.fire(child, 'consumingResultDispatch', params);
		}, 1000);
	});
});