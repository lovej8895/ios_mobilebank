define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	var iAccountInfoList;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var accountDetail = $('#accountDetail');
		var accountSum = 0;
		mbank.getAllAccountInfo(allAccCallBack);
		function allAccCallBack(data) {
			iAccountInfoList = data;
			var length = iAccountInfoList.length;
			if(length > 0) {
				for(var index=0;index<length;index++){
					var ul = $('<ul class="backbox_one bg_br2px m_top10px p_lr10px"></ul>');
					var accountLi = $('<li class="accountLi" num='+index+'></li>');
					var deleteLi = $('<li class="deleteLi" num='+index+'></li>');
					var accountNoP = $('<P class="color_6 m_top14px">账号&nbsp;&nbsp;<span class="fz_18">'+format.dealMoney(iAccountInfoList[index].accountNo)+'</span></P>');
					var aInP = $('<a class="link_acc"></a>');
					var accountTypeP = $('<p class="color_6">(借记卡)</p>');
					if(iAccountInfoList[index].accountType=='2'){
						accountNoP.append(aInP);
						accountSum+=1;
					} else {
						accountTypeP.empty().append("(信用卡)");
					}
					var updateLi = $('<li class="updateLi" num='+index+'></li>');
					var updataA = $('<a class="revise_icon"><img src="../../img/name_ico3.png" /></a>');
					updateLi.append(updataA);
					
					var openBankP = $('<p class="color_9 m_top5px fz_12">开户行：<span class="color_6 fz_12">'+iAccountInfoList[index].accountOpenNodeName+'</span></p>');
					var signFlagP = $('<p class="color_6">签约方式：<span>'+$.param.getUserType('SIGN_FLAG',iAccountInfoList[index].signFlag)+'</span></p>');
					var a = $('<a class="delete_icon"><img src="../../img/delete_ico.png" /></a>');
					accountLi.append(accountNoP).append(accountTypeP).append(openBankP).append(signFlagP);
					deleteLi.append(a);
					ul.append(accountLi).append(deleteLi).append(updateLi);
					accountDetail.append(ul);
					
				}
				$('ul li[class="accountLi"]').on('tap',function(){
					var num = $(this).attr("num");
					if(iAccountInfoList[num].accountType=='2'){
						mbank.openWindowByLoad('../myOwn/accountQuery.html','accountQuery','slide-in-right',{"params":iAccountInfoList[num]});
					}
					
				});
				$('ul li[class="updateLi"]').on('tap',function(){
					var num = $(this).attr("num");
					var params={'accountNo':iAccountInfoList[num].accountNo,'accountAlias':iAccountInfoList[num].accountAlias};
					mbank.openWindowByLoad('../customerSetting/aliasConfirm.html','aliasConfirm','slide-in-right',params);
				});
				$('ul li[class="deleteLi"]').on('tap',function(){
					var num = $(this).attr("num");
					
//					var canDelete = confirm("确定删除");
					mui.confirm("确定删除吗？","提示",["确定", "取消"], function(e) {
					if (e.index == 0) {
				        if(iAccountInfoList[num].accountType=='2'){
							if(accountSum<=1){
							mui.alert("账号下借记卡不超过一张，无法删除！");
							return false;
							} else {
								var url = mbank.getApiURL() + "deleteAccount.do";
								var params = {accountNo:iAccountInfoList[num].accountNo,
									customerName:userInfo.get("session_customerNameCN"),
									accountOpenNodeName:iAccountInfoList[num].accountOpenNodeName,
									accountStat:iAccountInfoList[num].accountStat
								};
								mbank.apiSend("post",url,params,successCallback,errorCallback,true);
							}
						} else {
							
							var url = mbank.getApiURL() + "deleteCreditCard.do";
							var params = {accountNo:iAccountInfoList[num].accountNo,
								customerName:userInfo.get("session_customerNameCN"),
								accountOpenNodeName:iAccountInfoList[num].accountOpenNodeName,
								accountStat:iAccountInfoList[num].accountStat
							};
							mbank.apiSend("post",url,params,successCallback,errorCallback,true);
						}
						
						
						function successCallback(){
							var msg = {title:"删除账户",value:"删除账户成功!"};
							mbank.initAccountInfo();
							mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{"params":msg});
						}
						function errorCallback(data){
							mui.alert(data.em);
						}
					}else{
					    return false;
					}
				})
//					if(!canDelete){
//						return false;
//					} else {
//						
//					}
					
//					mbank.openWindowByLoad('../myOwn/deleteAccount.html','deleteAccount','slide-in-right',{"params":iAccountInfoList[num]});
				});
			}
		}
		
		$('#addAccount').on('tap',function(){
			mbank.openWindowByLoad('../myOwn/addAccount.html','addAccount','slide-in-right');
		});
		
	});
});