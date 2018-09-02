define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
    var format = require('../../core/format');
    var userInfo = require('../../core/userInfo');
	//绑定账号列表
	var iAccountInfoList;
	//当前选定账号
	var currentAcct="";
	var currentSubAccount=""; //当前子账户信息
	var currentRiches=""; //当前账户总揽
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		
		var subAccount = mbank.getApiURL() + '001001_subAccountQuery.do';
		var riches = mbank.getApiURL() + '001001_allRichesQuery.do';
		
		//获取账户信息
		function sendMsg(){
			var subAccountParams = {accountNo:currentAcct,O1ITEM:'211'}; //查询子账户参数
			mbank.apiSend("post",subAccount,subAccountParams,function(data){
				currentSubAccount = data.iSubAccountInfo_hb[0];
				setSubAccountData(currentSubAccount);
			},function(){},true);
			
			var richesAccountParams = {accountNo:currentAcct,emailFlag:"1"}; //财富查询参数
			mbank.apiSend("post",riches,richesAccountParams,function(data){
				currentRiches = data;
				setRichesData(currentRiches);
			},null,true);
		}
		
		queryDefaultAcct();
		function queryDefaultAcct() {
			
			iAccountInfoList = plus.webview.currentWebview().params;
//			console.log(iAccountInfoList);
			currentAcct = iAccountInfoList.accountNo;
			sendMsg();
		}
		
		//将数据写入标签中
		function setSubAccountData(currentSubAccount){
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			if(currentSubAccount.currencyType=="01"){
				$("#cryType").html("人民币");
			}
			var openDate=format.dataToDate(currentSubAccount.OpenAcctDt);
			$("#openDate").html(openDate);
			var balanceAva = format.formatMoney(currentSubAccount.balanceAvailable,2);
			$("#balanceAvailable").html(balanceAva+"元");
			$("#baseBank").html(currentSubAccount.accountOpenBankName);
		}
		
		function setRichesData(currentRiches){
			var currentDeposit = format.formatMoney(currentRiches.freeAmount,2);
			$("#currentDeposit").html(currentDeposit+"元");
			var noticeAmount = format.formatMoney(currentRiches.noticeAmount,2);
			$("#noticeAmount").html(noticeAmount+"元");
			var noticeAmount = format.formatMoney(currentRiches.freezenAmount,2);
			$("#freezenAmount").html(noticeAmount+"元");
			var totalAmount = format.formatMoney(currentRiches.totalAmount,2);
			$("#totalAmount").html(totalAmount+"元");
		}
		
		$('#regSon').on('tap',function(){
			var url = mbank.getApiURL() + 'savingSubAccountQuery.do';
			var params = {
				"accountNo":currentAcct,
				"actionFlag":"0",
				"signFlag":iAccountInfoList.signFlag,
				"flag":'0',
				"title":"定期子账户"
			};
			mbank.openWindowByLoad('regSonAccount.html','regSonAccount','slide-in-right',{"params":params});
			
		});
		
		$('#noticeSon').on('tap',function(){
			var url = mbank.getApiURL() + 'savingSubAccountQuery.do';
			var params = {"accountNo":currentAcct,
							"actionFlag":"1",
							"signFlag":iAccountInfoList.signFlag,
							"flag":'1',
							"title":"通知存款子账户",
							"baseBank":currentSubAccount.accountOpenBankName
			};
			mbank.openWindowByLoad('regSonAccount.html','regSonAccount','slide-in-right',{"params":params});
		});
		
		mui.back=function(){
			
			mui.fire(plus.webview.getWebviewById("clientHome"),"reload",{});
			plus.webview.close("accountQuery");
		}
		
		
	});
});
