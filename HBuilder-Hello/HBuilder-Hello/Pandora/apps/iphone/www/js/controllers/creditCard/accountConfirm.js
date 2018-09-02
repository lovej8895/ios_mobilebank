define(function(require, exports, module) {
	var doc = document;
	var m= mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	m.init();
	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview();
		doc.getElementById("paper").style.display="none";
		
		var cardNo = self.cardNo;
		var changeList = self.changeList;
		var reckType = self.reckType;
		var mailAddr = self.mailAddr;
		var billDate = self.billDate;
		var province = self.province;
		var city = self.city;
		var areaCode = self.areaCode;
		var address = self.address;
		var zipCode = self.zipCode;
		//mui.alert(111+mailAddr);
		
		
		doc.getElementById("accountNo").innerText = cardNo;
		if("EM" == reckType){
			doc.getElementById("sendWay").innerText = "电子账单";
		}else{
			doc.getElementById("sendWay").innerText = "纸质账单";
		}
		doc.getElementById("province").innerText = province;
		doc.getElementById("city").innerText = city;
		doc.getElementById("areaCode").innerText = areaCode;
		doc.getElementById("address").innerText = address;
		doc.getElementById("postalcode").innerText = zipCode;
		doc.getElementById("email").innerText = mailAddr;
		doc.getElementById("creditAction_success").addEventListener('click',function(){
			var confirmInfo = {
				"cardNo" : cardNo,
				"changeList" : changeList,
				"reckType" : reckType,
				"mailAddr" : mailAddr,
				"billDate" : billDate,
				"province" : province,
				"city" : city,
				"areaCode" : areaCode,
				"adress" : address,
				"zipCode" : zipCode
			};
			
			var url = mbank.getApiURL() + 'billGuid.do';
			mbank.apiSend('post', url, confirmInfo, changeSuccess, changeError,  true, false);	
			function changeSuccess(data ){
				var path = doc.getElementById("creditAction_success").getAttribute("path");
				var id = doc.getElementById("creditAction_success").getAttribute("id");
				var noCheck = doc.getElementById("creditAction_success").getAttribute("noCheck");
				var successType = "1";
				//mui.alert(id);
				mbank.openWindowByLoad(path, id, "slide-in-right",{successType:successType, noCheck:noCheck});
			}
			function changeError(data){
				/*var errorCode = "5";
				var errorMsg = data.em;
				mbank.openWindowByLoad("creditAction_fail.html","creditAction_fail","slide-in-right",{errorCode:errorCode,errorMsg:errorMsg});*/
				mui.alert(data.em,'提示',['确定'],function(e){
					if( e.index==0 ){
						plus.webview.currentWebview().close();
					}
				});
			}
		});
		
		
		
	});
			
});