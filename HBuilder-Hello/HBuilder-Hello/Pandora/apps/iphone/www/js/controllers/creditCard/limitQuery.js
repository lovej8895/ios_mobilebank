/*
 * 完成未出账单查询功能：
 * 1.信用卡帐号查询
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
	
	//信用卡列表
	var iAccountInfoList = [];
	var accountPickerList=[];
	var cardList = [];
	var length;
	var currCredit;
	
	mui.init();
	mui.plusReady(function() {	
		var cardNo;
		var cardType = "2";
		
		var search = doc.getElementById("search");
		var back = doc.getElementById("return");
		
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
					$("#cardNo").val(currentAcct);
					cardNo = currentAcct;
					if(checkNo(cardNo)){
						queryLimit(cardNo);
					}else{
						mui.alert("请在我的账户绑定信用卡");
					}
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡",fireEvent:"payAccount"});
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
				if(checkNo(cardNo)){
					queryLimit(cardNo);
				}else{
					mui.alert("请在我的账户绑定信用卡");
				}
        });	
		
		//接收返回信息
		var cashAvbLimit;//可转账额度
		var avblLimit;//可用额度
		var creditLimit;//卡片额度
		var cashLimit;//取现额度
		var mobileTemp;//手机号比较
		
		var limitDetail = doc.getElementById("limitDetail");
		
		//查询此信用卡额度
		/*search.addEventListener('tap',function(){
			//mui.alert(cardNo);
			if(checkNo(cardNo)){
				queryLimit();
			}else{
				mui.alert("请在我的账户绑定信用卡");
			}
		});*/
		
		function queryLimit(card){
			var limitHtml = "";
			var url = mbank.getApiURL() + '007104_limitQuery.do'; 
			mbank.apiSend('post', url, {cardNo:card}, queryLimitSuccess, queryLimitError, true);
			function queryLimitSuccess(data){
				cashAvbLimit = data.CashAvbLimit;
				avblLimit = data.AvblLimit;
				creditLimit = data.CreditLimit;
				cashLimit = data.CashLimit;
				mobileTemp = data.MobileTemp;
				//mui.alert(111+cashAvbLimit);
				cashAvbLimit = format.formatMoney(cashAvbLimit);
				avblLimit = format.formatMoney(avblLimit);
				creditLimit = format.formatMoney(creditLimit);
				cashLimit = format.formatMoney(cashLimit);
				mobileTemp = format.formatMoney(mobileTemp);
				//生成页面
//				limitHtml += '<div class="backbox_tit_bg">';
//				limitHtml += '<p class="backbox_tit_ico"></p>';
//				limitHtml += '</div>';
				limitHtml += '<div class="backbox_th p_lr10px m_top10px" >';
				limitHtml += '<ul>';
				limitHtml += '<li class="form-item">';
				limitHtml += '<span class="input_lbg">卡片额度</span>';
				limitHtml += '<span class="input_m14px" id="">'+creditLimit+'元</span>';
				limitHtml += '</li>';
				limitHtml += '<li class="form-item">';
				limitHtml += '<span class="input_lbg">可用额度</span>';
				limitHtml += '<span class="input_m14px" id="">'+avblLimit+'元</span>';
				limitHtml += '</li>';
				limitHtml += '<li class="form-item">';
				limitHtml += '<span class="input_lbg">取现额度</span>';
				limitHtml += '<span class="input_m14px" id="">'+cashLimit+'元</span>';
				limitHtml += '</li>';
				limitHtml += '<li class="form-item">';
				limitHtml += '<span class="input_lbg">可用取现额度</span>';
				limitHtml += '<span class="input_m14px" id="">'+cashAvbLimit+'元</span>';
				limitHtml += '</li>';
				limitHtml += '</ul>';
				limitHtml += '</div>';
				limitDetail.innerHTML = limitHtml;
			}
			
			function queryLimitError(data){
				/*var errorCode = "6";
				var errorMsg = data.em;
				mbank.openWindowByLoad("creditAction_fail.html","creditAction_fail","slide-in-right",{errorCode:errorCode,errorMsg:errorMsg});*/
				plus.nativeUI.toast(data.em);
			}
		
		}
		
		function checkNo(card){
			if(""==card || null==card){
				return false;
			}
			return true;
		}
		
	});
});