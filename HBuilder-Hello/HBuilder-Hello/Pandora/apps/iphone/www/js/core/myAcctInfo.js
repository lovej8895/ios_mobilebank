define(function(require, exports, module) {
	var mbank = require('./bank');
	var format = require('./format');
	var sharew;
	var ws = null;

	exports.showMyAcct = function(params) {
		var divHight = 330;
		var top = plus.display.resolutionHeight - divHight;
		var href = "../myOwn/myAcctList.html";
		ws = plus.webview.currentWebview();

		sharew = plus.webview.create(href, "myAcctList", {
			width: '100%',
			height: divHight,
			top: top,
			scrollIndicator: 'none',
			scalable: false,
			popGesture: 'none'
		}, {
			params: {
				"acctlist": params,
				"pageId": ws.id
			}
		});
		sharew.addEventListener("loaded", function() {
			sharew.show('slide-in-bottom', 50);
		}, false);
		// 显示遮罩层

		ws.setStyle({
			mask: "rgba(0,0,0,0.5)"
		});
		// 点击关闭遮罩层
		ws.addEventListener("maskClick", closeMask, false);
	};
	//查询付款账户余额
	exports.getAccAmt = function(accno, id, flag) {
		var params = {
			"accountNo": accno,
			"waitTitle": "余额查询中"
		};
		var wait = flag || false;
		var url = mbank.getApiURL() + 'balanceQuery_ch.do';
		mbank.apiSend('post', url, params, function(data) {
			jQuery("#" + id).empty().html(format.formatMoney(data.balanceAvailable));
			jQuery("#openNode").val(data.openNode);
			aviliableBalance = data.balanceAvailable;
		}, null, wait);
	};
	
	//查询账户余额
	exports.getAccBalance = function(accno,flag,callback) {
		var params = {
			"accountNo": accno,
			"waitTitle": "余额查询中"
		};
		var wait = flag || false;
		var url = mbank.getApiURL() + 'balanceQuery_ch.do';
		mbank.apiSend('post', url, params, function(data) {
            if( typeof(callback)=="function" ){
            	callback(data);
            }
		}, null, wait);
	};	
	
	//查询活期账户余额
	exports.queryAccAmt = function(accno, id, flag) {
		var params = {
			"accountNo": accno,
			"waitTitle": "余额查询中"
		};
		var wait = flag || false;
		var url = mbank.getApiURL() + 'balanceQuery_ch.do';
		mbank.apiSend('post', url, params, function(data) {
			jQuery("#" + id).empty().html(format.formatMoney(data.balance));
		}, null, wait);
	};

	function closeMask() {
		ws.setStyle({
			mask: "none"
		});
		sharew.close();
	}
	exports.showPGKeyBoard = function(params) {
		var divHight = 400;
		//var top = plus.display.resolutionHeight - divHight;
		var top = "30%";
		var href = "../plus/pgKeyBoard.html";
		ws = plus.webview.currentWebview();

		sharew = plus.webview.create(href, "pgKeyBoard", {
			width: '100%',
			top: top,
			bottom: "0",
			scrollIndicator: 'none',
			scalable: false,
			popGesture: 'none'
		}, {
			"info": params,
			"pageId": ws.id
		});
		sharew.addEventListener("loaded", function() {
			sharew.show('slide-in-bottom', 50);
		}, false);
		// 显示遮罩层

		ws.setStyle({
			mask: "rgba(0,0,0,0.5)"
		});
		// 点击关闭遮罩层
		ws.addEventListener("maskClick", closeMask, false);
	};

});