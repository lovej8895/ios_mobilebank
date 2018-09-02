define(function(require, exports, module) {
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	
	var pagenum = 5;
	var turnPageBeginPos = 1;
	var count;
	var transArrayList = [];
	var transList = [];
	//查询账户信息
	//定义绑定银行卡列表
	var iAccountInfoList = [];
	var currentAcct = "";
	var currAlias = "";
	var loadFlag = true; //首次加载标志
	var detailDiv = document.getElementById("detailDiv");
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var state = app.getState();
		mbank.resizePage("#abc");
		var self = plus.webview.currentWebview();
		var accObj = self.accObj;

		
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allCardBack,"2");
			function allCardBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					//mui.alert(iAccountInfoList[0].accountAlias);
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					doc.getElementById("alais").innerText = iAccountInfoList[0].accountAlias;
					
				}
				
			}
		}
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.PopPicker();
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
			accountPicker.show(function(items) {
				var pickItem=items[0];
				currentAcct=iAccountInfoList[pickItem.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				doc.getElementById("alais").innerText = iAccountInfoList[pickItem.value].accountAlias;
			});		
			
		});
		
		
		/*账户切换开始*/
		/*window.addEventListener('accinfo', function(event) {
			currentAcct = event.detail.accountNo;
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			doc.getElementById("alais").value = event.detail.accountAlias;
			
		});
		
		queryDefaultAcct();		
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,"2");
			function allAccCallBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				var defaultflag = false;
				if(length > 0) {
					for(var index = 0; index < length; index++) {
						var currBank = iAccountInfoList[index];
						if(currBank.accountType == '01') { // 默认卡
							currentAcct = currBank.accountNo;
							$("#accountNo").html(format.dealAccountHideFour(currentAcct));
							doc.getElementById("alais").value = iAccountInfoList[0].accountAlias;
							defaultflag = true;
						}
					}
					if(!defaultflag) {
						currentAcct = iAccountInfoList[0].accountNo;
						$("#accountNo").html(format.dealAccountHideFour(currentAcct));
						doc.getElementById("alais").value = iAccountInfoList[0].accountAlias;
					}
				}
				if(undefined == accObj || "" == accObj || null == accObj) {} else {
					currAlias = accObj.accountAlias;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				}
			}
		}
		//更换付款账号
		jQuery("#changeDiv").click(function() {
			myAcctInfo.showMyAcct(iAccountInfoList);
		});*/
		/*账户切换结束*/
		
		doc.getElementById("aliasConfirm").addEventListener('tap',function(){
			var param = doc.getElementById("alais").value;
			//mui.alert(param);
			if(checkAlias(param)){				
				var path = this.getAttribute("path");
				var id = this.getAttribute("id");
				var noCheck = this.getAttribute("noCheck");
				var params = {
					accNo : currentAcct,
					alias : doc.getElementById("alais").value,
					noCheck : noCheck
				};
				mbank.openWindowByLoad(path, id, "slide-in-right", params);
			}else{ 
			mui.alert("请输入10个长度以内的字符！");
			}
		});
		function checkAlias(param){
			var errorReg = /[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]+/;
			var reg = /^[0-9a-zA-Z\u4E00-\u9FA5\(\)]{1,20}/;
			if(errorReg.test(param)){
				return false;
			}
			if(reg.test(param)){
				//mui.alert(reg.test(param));
				return true;
			}
			return false;
		}
		
	});
	
});