define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var dataBefore = plus.webview.currentWebview().params;
		var url = mbank.getApiURL()+'002001_detail_query.do';
		var params = {orderFlowNo:dataBefore.orderFlowNo,transferType:dataBefore.transferType};
//		console.log(dataBefore.orderFlowNo+"   "+dataBefore.transferType);
		mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		function successCallback(data){
			$('#payAccount').html(format.dealAccountHideFour(data.payAccount));
			$('#recAccount').html(data.recAccount);
			$('#payAccountName').html(userInfo.get("session_customerNameCN"));
			$('#recAccountName').html(data.recAccountName);
			$('#transferFlowNo').html(data.orderFlowNo);
			if(dataBefore.transferType=='2'){
				$('#recAccountOpenBankName').html(data.recAccountOpenBankName);
				$('#openBank').show();
				$('#orderState').html("跨行");
			} else {
				$('#orderState').html("行内");
			}
			
			$('#payAmount').html(format.formatMoney(data.payAmount,2)+"元");
			if(data.trsFeeAmount!=null&&data.trsFeeAmount!=''){
				$('#trsFeeAmount').html(format.formatMoney(data.trsFeeAmount,2)+"元");
			} else {
				$('#trsFeeAmount').html("0.00元");
			}
			$('#newPayUse').html(data.newPayUse);
			if(data.orderSubmitTime!=''&&data.orderSubmitTime!=null){
				$('#transferTime').html(format.formatDateTime(data.orderSubmitTime));
			} else {
				$('#transferTimeLi').hide();
			}
			
			$('#transferResult').html($.param.getUserType('TRANS_RESULT',dataBefore.transferResult));
			if(data.orderState == '99'){
				$('.errorMsg').show();
				$('#hostErrorCode').html(data.hostErrorCode);
				$('#hostErrorMsg').html(data.hostErrorMsg);
			}
		}
		function errorCallback(data){
			mui.alert(data.em);
		}
		/*$('#recAccount').html(dataBefore.recAccount);
		$('#payAccount').html(dataBefore.payAccount);
		$('#transferSum').html(format.formatMoney(dataBefore.transferSum,2));
		$('#transferTime').html(format.dataToDate(dataBefore.transferTime));
		$('#transferResult').html($.param.getUserType('TRANS_RESULT',dataBefore.transferResult));*/
	});
});