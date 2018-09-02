define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	//当前选定账号
	var currentAcct="";
	var currentOpenName;
	var currentAccountStat;
	var accountPickerList=[];
//	var currentDetail;
    var accountPicker;
    var customerNameCN;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		queryDefaultAcct();
		function queryDefaultAcct() {
			var iAccountInfoList = plus.webview.currentWebview().params;
			$('#accountName').text(userInfo.get("session_customerNameCN"));
			$("#accountNo").html(format.dealAccountHideFour(iAccountInfoList.accountNo));
			$("#openName").html(iAccountInfoList.accountOpenNodeName);
			$('#accountState').html($.param.getCardState(iAccountInfoList.accountStat));
			
		}
		
		$("#submit").on('tap',function(){
			if(currentAccountStat!="0"){
				mui.alert("账户状态异常");
				return false;
			}
//			var canDelete = confirm("确定删除");
			mui.confirm("确定删除吗？","提示",["确定", "取消"], function(e) {
				if (e.index == 0) {
//			if(canDelete==true){
					var url = mbank.getApiURL() + "deleteAccount.do";
					var params = {accountNo:currentAcct,customerName:customerNameCN,accountOpenNodeName:currentOpenName,accountStat:currentAccountStat};
					mbank.apiSend("post",url,params,successCallback,errorCallback,true);
					function successCallback(){
						var msg = {title:"删除账户",value:"删除账户成功!"};
						mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{"params":msg});
					}
					function errorCallback(data){
						mui.alert(data.em);
					}
				}
			})
		});
		
	});
});