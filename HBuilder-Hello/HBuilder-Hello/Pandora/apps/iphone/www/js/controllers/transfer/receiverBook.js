define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var dataBefore = plus.webview.currentWebview().params;
		var recAccount = dataBefore.recAccount;
		var recAccountOpenBank = dataBefore.recAccountOpenBank;
		var recAccountBankName;
		var accountName = dataBefore.recAccountName;
		var payBookType = dataBefore.payBookType;  //1代表行内 2代表行外
		if(payBookType=="1"){
			recAccountBankName = "湖北银行";
		} else if(payBookType=="2"){
			recAccountBankName = dataBefore.recAccountOpenBankName;
		}
		
		$('#accountBankName').html(recAccountBankName);
		$('#accountName').html(accountName);
		$('#account').html(format.dealAccountHideFour(recAccount));
		
		$('#transfer').on('tap',function(){
			
			var params = {"recAccountOpenBank":recAccountOpenBank,"recAccountName":accountName,"recAccount":recAccount,"recAccountOpenBankName":recAccountBankName};
			if(payBookType=="1"){
				mbank.openWindowByLoad("innerTranInput.html","innerTranInput",'slide-in-right',params);
			} else {
				mbank.openWindowByLoad("interTranInput.html","interTranInput",'slide-in-right',params);
			}
			
		});
		
		//删除收款人
		$('#delete').on('tap',function(){
			var url = mbank.getApiURL() + "payBookLoad.do";
			//行内 1 行外2
			var params = {"payBookType":payBookType,"recAccount":recAccount,'recAccountName':accountName,'payBookChannel':'1','payBookDealFlag':'1'};
			console.log(params);
			mbank.apiSend("post",url,params,successCallback,function(){},true);
			function successCallback(data){
				var params = {"title":"收款人名册","value":"删除收款人成功！"};
				mbank.openWindowByLoad("../myOwn/msgSetOK.html","msgSetOK",'slide-in-right',{"params":params});
			}
		});
	});
});