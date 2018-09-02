/*
 * 无卡预约取款信息确认：
 * 	获取上一个页面传来的参数：
 * 	预约账号  可用余额  预约金额  预约码 
 * 	在这个页面查处随即因子，获取手机验证码
 * 确定按钮确认后进行预约业务
 */
define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var app = require('../../core/app');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号a
	var currentAcct="";
	//是否预约交易，默认非预约
	var scheduleFlag="0";
	mui.init();
	mui.plusReady(function() {
		mbank.resizePage("#abc");
		plus.screen.lockOrientation("portrait-primary");
		var state = app.getState();
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('002010',jQuery.extend(self,{payAmount:self.orderMoney}));
		var cardNo = self.cardNo;//卡号
		var orderMoney = self.orderMoney;//预约金额
		var orderNum = self.orderNum;//预约码
		var orderNum2 = self.orderNum2;
		var randomSum = self.randomSum;//随机因子
		var mobileNo = localStorage.getItem("session_mobileNo");//手机号
		var confirmButton = document.getElementById("cardTransfer_Success");
		document.getElementById("cardNo").innerText = format.dealAccNoWith8Stars(cardNo);
		document.getElementById("mobileNo").innerText = format.mobileNoHide(mobileNo);
		document.getElementById("orderMoney").innerText = format.formatMoney(orderMoney,2)+"元";
		document.getElementById("orderDate").innerText = (new Date()).format("yyyy-MM-dd hh:mm:ss");
		
		
		
		
		/*var publicKey;
		
		function getRandomKey(){
			var url = mbank.getApiURL() + 'getPasswordKey.do';
			mbank.apiSend('get', url, "", getSuccess, getError, true, false);
			function getSuccess(data){
				publicKey = data.publicKey;
			}
			function getError(){
				 plus.nativeUI.toast("获取随即因子失败");
			}
		}
		getRandomKey();*/
		document.getElementById("cardTransfer_Success").addEventListener('tap',function(){
				var params = {
					payAccount : cardNo,
					payAmount : orderMoney,
					subscribeCode : orderNum,
					randomSum : randomSum,
					sprCode : orderNum2
				};
				var url = mbank.getApiURL() + 'cardTransfer.do';
				commonSecurityUtil.apiSend('post', url , params, transferSuccess, transferError, true, false);
				function transferSuccess(data){
					var path = confirmButton.getAttribute("path");
					var id = confirmButton.getAttribute("id");
					var noCheck = confirmButton.getAttribute("noCheck");
					mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
				}
				function transferError(data){
					plus.nativeUI.toast(data.em);
				}
			
		});
		
	});

});