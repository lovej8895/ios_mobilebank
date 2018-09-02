/*
 * 已出账单查询结果：
 * 1.信用卡帐号查询
 * 2.根据帐号与时间进行查询
 */
define(function(require, exports, module) {
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');


	mui.init();
	mui.plusReady(function() {	
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview(); 
		
		
		var card = doc.getElementById("cardNo");
		var pay = doc.getElementById("pay");
		var lowest = doc.getElementById("lowest");
		var deadLine = doc.getElementById("deadLine");
		
		var cardNo = self.cardNo;
		var queryTime = self.queryTime;
		var repayMent;
		var lowestPay;
		var PmtDt;
		searchLimit();
		
		function searchLimit(){
			mbank.showWaiting();
			var url = mbank.getApiURL() + 'limitGuid.do';
			mbank.apiSend('post',url, {cardNo:cardNo, queryTime:queryTime}, querySuccess, queryError, true);
			
			function querySuccess(data){
				cardNo = data.cardNo;
				repayMent = data.repayMent;
				lowestPay = data.lowestPay;
				PmtDt = data.PmtDt;
				PmtDt = format.dataToDate(PmtDt);
				//mui.alert(cardNo+" "+repayMent+" "+lowestPay+" "+PmtDt);
				//mui.alert(allAffairList+" "+length);
				card.innerText = cardNo;
				pay.innerText = repayMent;
				lowest.innerText = lowestPay;
				deadLine.innerText = PmtDt;
				mbank.closeWaiting();
			}
			
			function queryError(data){
				/*var errorMsg = data.em;
				var errorCode = "3";
				mbank.openWindowByLoad("creditAction_fail.html","creditAction_fail","slide-in-right",{errorCode:errorCode,errorMsg:errorMsg});*/
				plus.nativeUI.toast(data.em);
				doc.getElementById("limitDetail").style.display="none";
				mbank.closeWaiting();
				//mui.back();
			}
			
		}
		
		doc.getElementById("limitDetail").addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			//mui.alert(path+" "+id+" "+noCheck);
			mbank.openWindowByLoad(path, id, "slide-in-right", {cardNo:cardNo, queryTime:queryTime, noCheck:noCheck})
		});
		//mui.alert(cardNo+" "+repayMent+" "+lowestPay+" "+PmtDt);
		
		
		
	});
});