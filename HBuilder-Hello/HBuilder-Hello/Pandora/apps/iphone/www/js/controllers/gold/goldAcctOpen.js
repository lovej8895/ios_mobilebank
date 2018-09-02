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
	var manageReg= new RegExp("^[0-9]*$");
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var goPageId = self.goPageId;
		//页面展示元素
		document.getElementById('custName').innerText = userInfo.get('session_customerNameCN');
		document.getElementById('mobile').innerText = userInfo.get('session_mobileNo');
		
		loadAccountList();
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					var pickItem = {
						value:iAccountList[i].accountNo,
						text:iAccountList[i].accountNo
					};
					accountPickerList.push(pickItem);
				}
				var accountPicker = new mui.SmartPicker({title:"请选择签约账户",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
					
				currentAcct = iAccountList[0].accountNo;
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
			var agreeCheck = document.getElementById('agreeCheck').checked;
			if(!agreeCheck){
				mui.alert("请阅读并同意《黄金定投业务协议书》");
				return false;
			}
			if(!currentAcct){
				mui.alert("请选择签约账号");
				return false;
			}
			var managerNo = document.getElementById('managerNo').value;
			var branchNo = document.getElementById('branchNo').value;
			if(managerNo){
				if(!manageReg.test(managerNo)){
					document.getElementById('managerNo').value = '';
					mui.alert("请输入正确的推荐人工号");
					return false;
				}
				if(!branchNo){
					mui.alert("请输入推荐人所属机构号");
					return false;
				}
			}
			if(branchNo){
				if(!manageReg.test(branchNo)){
					document.getElementById('branchNo').value = '';
					mui.alert("请输入正确的推荐人所属机构号");
					return false;
				}
			}
			
			/*for(var i=0;i<iAccountList.length;i++){
				if(iAccountList[i].accountNo == currentAcct){
					branchNo = iAccountList[i].accountOpenNode;
					break;
				}
			}*/
			
			params = {
				"accountNo" : currentAcct,
				"branchNo" : branchNo,
				"managerNo" : managerNo,
				"goPageId" : goPageId,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad("../gold/goldAcctOpenConfirm.html","goldAcctOpenConfirm", "slide-in-right",params);
		},false);
		
		document.getElementById("goldAgree").addEventListener("tap",function(){
			mbank.openWindowByLoad("../gold/goldAcctOpenAgree.html","goldAcctOpenAgree", "slide-in-right","");
		},false);
		document.getElementById("goldRule").addEventListener("tap",function(){
			mbank.openWindowByLoad("../gold/goldAcctOpenRule.html","goldAcctOpenRule", "slide-in-right","");
		},false);
		document.getElementById("goldRisk").addEventListener("tap",function(){
			mbank.openWindowByLoad("../gold/goldAcctOpenRisk.html","goldAcctOpenRisk", "slide-in-right","");
		},false);
		
		mbank.resizePage(".btn_bg_f2");
	});
});