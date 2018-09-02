define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	
	var iAccountList;
	var currentAcct;
	var branchNo;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var goldAipNo = self.goldAipNo;
		var goldSignAcct = self.accountNo;
		
		document.getElementById('goldSignAcct').innerText = format.dealAccountHideFour(goldSignAcct);
		
		loadAccountList();
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					if(iAccountList[i].accountNo != goldSignAcct){
						var pickItem = {
							value:iAccountList[i].accountNo,
							text:iAccountList[i].accountNo
						};
						accountPickerList.push(pickItem);
					}
				}
				var accountPicker = new mui.SmartPicker({title:"请选择新签约账号",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
				
				if(iAccountList[0].accountNo ==goldSignAcct){
					currentAcct = iAccountList[1].accountNo;
				}else{
					currentAcct = iAccountList[0].accountNo;
				}
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
        });	
		
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			if(!currentAcct){
				mui.alert("请选择签约账号");
				return false;
			}
			params = {
				"goldAipNo" : goldAipNo,
				"goldSignAcct" : goldSignAcct,
				"accountNo" : currentAcct,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad("../gold/goldChangeAcctConfirm.html","goldChangeAcctConfirm", "slide-in-right",params);
		},false);
		mbank.resizePage(".btn_bg_f2");
	});
});