/*
 * 额度管理-额度申请js
 */
define(function(require, exports, module) {
	
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	
	var iAccountInfoList = [];
	var accountPickerList=[];
	var cardList = [];
	var length;
	var currCredit;
	var cardNo;

	mui.init();
	
	mui.plusReady(function() {
		mbank.resizePage("#abc");
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview();
		cardNo = self.cardNo;
		
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					if(null==cardNo || ""==cardNo){
						cardNo = currentAcct;
						$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
						$("#cardNo").val(currentAcct);
					}else{
						$("#cardNoShow").html(format.dealAccountHideFour(cardNo));
						$("#cardNo").val(cardNo);
					}
					//cardNo = currentAcct;
				}
				//queryCridetSign(currentAcct);
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡号",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value];
				$("#cardNoShow").html(format.dealAccountHideFour(currentAcct.accountNo));
				$("#cardNo").val(currentAcct.accountNo);
				cardNo = $("#cardNo").val();
        });	
		
		var chooseType = doc.getElementById("chooseType");
		var limitType = doc.getElementById("limitType");
		$("#limitType").val("临时信用额度");
		/*chooseType.addEventListener('tap',function(){
			var bts=[{title:"临时信用额度"}];
			plus.nativeUI.actionSheet({title:"额度类型选择",cancel:"取消",buttons:bts},
				function(e){
					if(e.index>0){
						limitType.innerText = bts[e.index-1].title;
						$("#limitType").val(bts[e.index-1].title);
					}
				}
			);
		});*/
	
		var next = doc.getElementById("limitApply_confirm");
		var expectedLimit = doc.getElementById("expectedLimit");
		next.addEventListener('tap',function(){
			var money = $("#expectedLimit").val();
			if(numCheck(money)||money==0){
				plus.nativeUI.toast("请输入大于0的数字");
			}else if(emptyCheck()){
				plus.nativeUI.toast("输入信息不能为空！");
			}else if(limitCheck($("#expectedLimit").val())){
				var path  = this.getAttribute("path");
				var id = this.getAttribute("id");
				var noCheck = this.getAttribute("noCheck");
				mbank.openWindowByLoad(path, id, 'slide-in-right',
					{cardNo:cardNo,
					 creditLimit:$("#expectedLimit").val(),
					 reason:"",
					 limitType:$("#limitType").val(),
					 noCheck:noCheck});
			}else{
				plus.nativeUI.toast("期望额度请输入1000的倍数");
			}
		});
		
		function limitCheck(num){
			if(num%1000 == 0){
				return true;
			}
			return false;
		}
		
		function numCheck(num){
			var reg = new RegExp("^[0-9]*$");
			if(reg.test(num)){
				//mui.alert("111");
				return false;
			}
			return true;
		}
		
		function emptyCheck(){
			//mui.alert(cardNo+" "+limitType.value+" "+$("#expectedLimit").val());
			if(""==cardNo || null==cardNo || ""==$("#limitType").val() || null==$("#limitType").val() || ""==$("#expectedLimit").val() || null==$("#expectedLimit").val()){
				return true;
			}
			return false;
		}
		
	});
});