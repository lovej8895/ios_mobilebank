define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	var currentAcct=""; //当前账号
	var currentDetail = ""; //当前账号信息
	var accountPickerList=[];
    var accountPicker;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		queryDefaultAcct();
		function queryDefaultAcct(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					myAcctInfo.getAccAmt(currentAcct,"balance",true);
				}
				
			}
			
			/*var url = mbank.getApiURL() + 'searchPbAccList.do';
			mbank.apiSend("post",url,{accountType:""},successCallback,function(){},true);
			function successCallback(data){
				iAccountInfoList = data.iAccountInfo_Mobile;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length>0){
					currentAcct = iAccountInfoList[0].accountNo;
					currentDetail = iAccountInfoList[0];
	//				changeData(currentDetail);
					$('#accountNo').html(format.dealAccountHideFour(currentAcct));
					myAcctInfo.getAccAmt(currentAcct,"balance",true);
				}
			}*/
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
				$('#accountNo').html(format.dealAccountHideFour(currentAcct));
				myAcctInfo.getAccAmt(currentAcct,"balance",true);
			});		
		});
		
		$('#submit').on('tap',function(){
			var url = mbank.getApiURL() + 'reportAccountLoss.do';
			mbank.apiSend("post",url,{accountNo:currentAcct},successCallback,errorCallback,true);
			function successCallback(){
				var msg = {title:"紧急挂失",value:"紧急挂失成功!"};
				mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{"params":msg});
			}
			function errorCallback(data){
				mui.alert(data.em);
			}
		});
		
	});
});