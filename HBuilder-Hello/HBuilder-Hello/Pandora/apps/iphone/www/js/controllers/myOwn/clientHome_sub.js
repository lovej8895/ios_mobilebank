define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	var iAccountInfoList= [];
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback:pulldownfresh
			}
			
		}
	});
	function pulldownfresh(){
		setTimeout(function() {
		plus.webview.currentWebview().reload();
//		queryDefaultAcct();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 	
//		mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
		}, 1600);
    }
	
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var rmbAccount = $('#rmbAccount');
		var idType = localStorage.getItem("session_certType");
		idType = $.param.getDisplay('CERT_TYPE_CREDIT',idType);
		
		queryDefaultAcct = function(){
			$('#rmbAccount').empty();
			var accountSum = 0;
			var countAccount = []; //借记卡
			var countCredit = []; //信用卡
			if(iAccountInfoList!=''){
				iAccountInfoList = [];
			}
			//用于将借记卡和信用卡统计出来
			mbank.getAllAccountInfo(function(data){
				for(var i=0;i<data.length;i++){
					if(data[i].accountType=='2'){
						countAccount.push(data[i]);
					}else if(data[i].accountType=='6'){
						countCredit.push(data[i]);
					}
				}
				
			});
			Array.prototype.push.apply(iAccountInfoList,countAccount);//将countAccount增加到iAccountInfoList中
			Array.prototype.push.apply(iAccountInfoList,countCredit);
			/*mbank.getAllAccountInfo(function(data){
				Array.prototype.push.apply(iAccountInfoList,data);
			},'6');*/
			showCardInfo(iAccountInfoList);
			function showCardInfo(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				
				if(length > 0) {
					$('#rmbAccount').empty();
					for(var index=0;index<length;index++){
						var accountInfo = iAccountInfoList[index];
						var ul = $('<ul class="bg_h160px bg_br2px m_top10px" num="'+index+'"></ul>');
						var li_a = $('<li></li>');
						//有别名就显示别名，没别名就显示原用户名
					    var otherName = accountInfo.accountAlias;
						if(otherName == null||otherName == ""){
						   var accountP = $('<P class="color_6 m_left10px m_top14px">账号&nbsp;&nbsp;<span class="fz_16">'+format.dealMoney(accountInfo.accountNo)+'</span>&nbsp;&nbsp;<span class="color_9">'+userInfo.get("session_customerNameCN")+'</span></P>');
						}else{
							var accountP = $('<P class="color_6 m_left10px m_top14px">账号&nbsp;&nbsp;<span class="fz_16">'+format.dealMoney(accountInfo.accountNo)+'</span>&nbsp;&nbsp;<span class="color_9" id="name'+accountInfo.accountNo+'">'+otherName+'</span></P>');
						}
						//var accountP = $('<P class="color_6 m_left10px m_top14px">账号&nbsp;&nbsp;<span class="fz_16">'+format.dealMoney(accountInfo.accountNo)+'</span>&nbsp;&nbsp;<span class="color_9">'+userInfo.get("session_customerNameCN")+'</span></P>');
						//var otherNameP = $('<p class="color_9 m_left10px fz_12" id="name'+accountInfo.accountNo+'"></p>');
						var accTypeP = $('<p class="owncard_type"></p>');
						/*if(accountInfo.accountAlias!=''&&accountInfo.accountAlias!=null){
							//otherNameP.append(accountInfo.accountAlias);
							otherName = accountInfo.accountAlias;
						}*/
						
						var li_b = $('<li class="own_money_box m_left10px" name="detail" num="'+index+'" noCheck="false"></li>');
						var currencyP_acc= $('<p ><span>可用余额</span><br /><span class="color_6 fz_12">币种／人民币</span></p>');
						var currencyP_credit = $('<p ><span>可用额度</span><br /><span class="color_6 fz_12">币种／人民币</span></p>');
						var balanceP = $('<p class="own_money" style=""></p>');
						var bal_span1 = $('<span class="color_red" id="type'+accountInfo.accountNo+'"></span>');
						var bal_span2 = $('<span class="fz_18 color_red" name="balanceAva" id="bal'+accountInfo.accountNo+'"></span>');
						var a_detail = $('<a class="link_own_rbg"></a>');
						
						
						var li_u = $('<li class="own_btn_bg"></li>');
						var div = $('<div class="pub_btnbox2" num="'+index+'"></div>');
						var a_det = $('<a name="detailQuery" noCheck="false"><span class="fz_12 color_9">明细</span><img src="../../img/icon10_1.png" /></a>');
						var a_loss = $('<a name="emergencyLoss" noCheck="false"><span class="fz_12 color_9">挂失</span><img src="../../img/icon11_1.png" /></a>');
						var a_update = $('<a name="update" noCheck="false"><span class="fz_12 color_9">编辑</span><img src="../../img/icon12_1.png" /></a>');
						
//						var a_changePay = $('<a name="changePay"><span class="fz_12 color_9">调额</span><img src="../../img/icon16.png" /></a>');
						var a_return = $('<a name="return"><span class="fz_12 color_9">还款</span><img src="../../img/icon15_1.png" /></a>');
						var a_bill = $('<a name="bill"><span class="fz_12 color_9">未出账单</span><img src="../../img/icon14_1.png" /></a>');
						var a_creditLoss = $('<a name="creditCardLoss" noCheck="false"><span class="fz_12 color_9">挂失</span><img src="../../img/icon11_1.png" /></a>');
						var a_delete = $('<a name="delete"><span class="fz_12 color_9">删除</span><img src="../../img/icon13_1.png" /></a>');
						
						
						if(iAccountInfoList[index].accountType=='2'){
							accountSum+=1;
							getBalance(accountInfo.accountNo);
							accTypeP.append('储蓄卡');
							li_a.append(accountP).append(accTypeP);
							//li_a.append(accountP).append(otherNameP).append(accTypeP);
							li_b.append(currencyP_acc).append(balanceP);
							li_u.append(div.append(a_det).append(a_loss).append(a_update).append(a_delete));
							balanceP.append(bal_span1).append(bal_span2).append(a_detail);
							$('#rmbAccount').append(ul.append(li_a).append(li_b).append(li_u));
//							bal_span2.append("13");
						} else if(iAccountInfoList[index].accountType=='6'){
							//信用卡
							getAvaiable(accountInfo.accountNo);
							accTypeP.append('信用卡');
							li_a.append(accountP).append(accTypeP);
							li_b.append(currencyP_credit).append(balanceP);
//							li_u.append(div.append(a_return).append(a_bill).append(a_creditLoss).append(a_delete));
							li_u.append(div.append(a_return).append(a_bill).append(a_delete));
							balanceP.append(bal_span1).append(bal_span2);
							$('#rmbAccount').append(ul.append(li_a).append(li_b).append(li_u));
						}
					}
					
					var url = mbank.getApiURL() + 'getUserInfo.do';
					mbank.apiSend('post', url, null, querySuccess, queryError,false);
					function querySuccess(data){
						var accountInfoList = data.iAccountInfo;
						for(var i=0;i<accountInfoList.length;i++){
							/*if(accNo==accountInfoList[i].accountNo){
								doc.getElementById("alais").value = accountInfoList[i].accountAlias;
							}*/
							$('#name'+accountInfoList[i].accountNo).empty().append(accountInfoList[i].accountAlias);
						}
					}
					function queryError(data){
						mui.alert(data.em);
					}
					
					//借记卡获取余额
					function getBalance(accountNo){
						
						var params = {
							"accountNo":accountNo
						};
						var url = mbank.getApiURL() + 'balanceQuery_ch.do';
						mbank.apiSend('post', url, params, function(data) {
							if(data.balanceAvailable!=''&&data.balanceAvailable!=null){
								var balance = format.formatMoney(data.balanceAvailable);
								$('#type'+accountNo).append("¥");
								$('#bal'+accountNo).empty().append(balance);
							}
							
						}, function(){}, true);						
					}
					
					function getAvaiable(accountNo){
						var params = {
							"cardNo":accountNo
						};
						var url = mbank.getApiURL() + '007104_limitQuery.do';
						mbank.apiSend('post', url, params, function(data) {
							var balance = format.formatMoney(data.AvblLimit);
							$('#bal'+accountNo).empty().append(balance);
						},function(){},true);
					}
					
					
					$('ul li[name="detail"]').on('tap',function(){
						var num = $(this).attr('num');
						if(iAccountInfoList[num].accountType=='2'){
							mbank.openWindowByLoad('../myOwn/accountQuery.html','accountQuery','slide-in-right',{"params":iAccountInfoList[num]});
						}
						
					});
					//借记卡明细
					$('div a[name="detailQuery"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						var params ={"accountNo":iAccountInfoList[num].accountNo};
						mbank.openWindowByLoad('accountDetail.html','accountDetail','slide-in-right',params);
					});
					//借记卡挂失
					$('div a[name="emergencyLoss"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						mui.confirm("确定挂失？","提示",["确定", "取消"], function(e) {
							if (e.index == 0) {
								var url = mbank.getApiURL() + 'reportAccountLoss.do';
								mbank.apiSend("post",url,{accountNo:iAccountInfoList[num].accountNo},successCallback,errorCallback,true);
								function successCallback(){
									var msg = {title:"紧急挂失",value:"紧急挂失成功!"};
									mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{"params":msg});
								}
								function errorCallback(data){
									mui.alert(data.em);
								}
							}
						});
						
//						mbank.openWindowByLoad('emergencyLoss.html','emergencyLoss','slide-in-right');
					});
					//借记卡编辑
					$('div a[name="update"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						var params={'accountNo':iAccountInfoList[num].accountNo,'accountAlias':iAccountInfoList[num].accountAlias};
						mbank.openWindowByLoad('../customerSetting/aliasConfirm.html','aliasConfirm','slide-in-right',params);
					});
					//信用卡调额
					$('div a[name="changePay"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						var params = {
							cardNo : iAccountInfoList[num].accountNo,
							noCheck : false
						};
						mbank.openWindowByLoad("../creditCard/limitManager.html","limitManager","slide-in-right",params);
					});
					//信用卡还款
					$('div a[name="return"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						var params = {cardNo : iAccountInfoList[num].accountNo};
						mbank.openWindowByLoad("../creditCard/thisInitiativeRefundMenuInfo.html","thisInitiativeRefundMenuInfo","slide-in-right",params);
					});
					//未出账单
					$('div a[name="bill"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						var params = {
							cardNo : iAccountInfoList[num].accountNo,
							noCheck : false
						};
						mbank.openWindowByLoad("../creditCard/limitUnknowHistory.html","limitUnknowHistory","slide-in-right",params);
						
					});
					//信用卡挂失
					$('div a[name="creditCardLoss"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						var params = {
							CardNo:iAccountInfoList[num].accountNo,
							IdType:idType
						};
						mui.confirm("确定挂失？","提示",["确定", "取消"], function(e) {
							if (e.index == 0){
								var url = mbank.getApiURL() + 'cardReport.do'; 
								mbank.apiSend('post',url,params,reportSuccess,reportFail,true);
							}
						});
//						console.log(iAccountInfoList[num].accountNo+" --"+idType);
						
						function reportSuccess(data){
							var msg = {title:"信用卡挂失",value:"信用卡挂失成功!"};
							mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{"params":msg});
						}
						function reportFail(e){
							mui.alert(e.em,"温馨提示");
						}
					});
					//删除
					$('div a[name="delete"]').on('tap',function(){
						var num = $(this).parent().attr('num');
						
						mui.confirm("确定删除？","提示",["确定", "取消"], function(e) {
							if (e.index == 0) {
								if(iAccountInfoList[num].accountType=='2'){
									if(accountSum<=1){
										mui.alert("无法删除，账号下借记卡不得少于一张！");
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
								} else if(iAccountInfoList[num].accountType=='6'){
									
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
								
							}
						});
						
					});
					
				} else {
					rmbAccount.append('<ul><li>该账户没有下挂账号</li></ul>');
				}
			}
			//资产统计
//			plus.webview.currentWebview().reload();
		}
		queryDefaultAcct();//相关信息的加载
		
		
		//回掉函数 刷新账号信息
		window.addEventListener("reload",function(event){
			plus.webview.currentWebview().reload();
//          queryDefaultAcct();
        });
		
		//添加新账户
		$('#addAccount').on('tap',function(){
			mbank.openWindowByLoad("../myOwn/addAccount.html","addAccount",'slide-in-right'); 
		});
		
	});
});