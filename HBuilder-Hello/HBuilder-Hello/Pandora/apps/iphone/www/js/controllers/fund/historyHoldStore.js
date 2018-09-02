define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	var currentAcct="";//被选择账号
	var accountPickerList=[];//下拉列表
    var accountPicker;
	mui.init();
	mui.plusReady(function() {		
		plus.screen.lockOrientation("portrait-primary");//竖屏
		var self = plus.webview.currentWebview();
		queryDefaultAcct();//加载相关信息
		function queryDefaultAcct(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				if(length>0){
					accountPickerList = [];
					for(var i=0;i<length;i++){
						var account = iAccountInfoList[i];
						var pickItem = {
						    value :i,
						    text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
			}
			accountInit();
			if(length > 0){
				/*if(self.payAccount){
					currentAcct =self.payAccount;
				}*/
				currentAcct = iAccountInfoList[0].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			}
		}
	}

			function accountInit(){
				var accountPicker = new mui.SmartPicker({title:"请选择交易账号",fireEvent:"payAccount"});
				accountPicker.setData(accountPickerList);
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
			//添加账号监听事件
			window.addEventListener("payAccount",function(event){
				var param =event.detail;
				currentAcct = iAccountInfoList[param.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			});
	     
		//检查产品代码是否是整数
		function isProcode( s )
		{ 
			var isInteger = RegExp(/^[0-9]+$/);
			return ( isInteger.test(s) );
		}
		
	     mbank.resizePage(".btn_bg_f2");//不让按钮弹上来
	     
		//点击查询按钮发送交易
		document.getElementById("submit").addEventListener('tap',function(){
			//f_bank_cust_code = localStorage.getItem("session_hostId");
					f_prodcode = $("#oldBankCard").val();
				//产品代码不输默认全部查询，如果输入的话请输入6位整数
				if(f_prodcode!=""){
					if((f_prodcode.length!=6)||!isProcode(f_prodcode)){
						mui.alert("产品代码为6位整数");
							return false;
					}
				}
					var confirmButton = document.getElementById("submit");
					var noCheck = confirmButton.getAttribute("noCheck");
					var params = {
							"f_prodcode":f_prodcode,
							"f_deposit_acct":currentAcct,
							noCheck:noCheck
				};	
			
			mbank.openWindowByLoad("../fund/historyHoldStoreResult.html", "historyHoldStoreResult", "slide-in-right", params);
			
		});


	
	});
});