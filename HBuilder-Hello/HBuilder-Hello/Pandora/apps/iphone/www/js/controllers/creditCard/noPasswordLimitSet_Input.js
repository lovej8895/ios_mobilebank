define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	var iAccountInfoList = [];
	var accountPickerList=[];
	//当前选定账号
	var currentAcct="";
	var accountPicker;
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	//预加载
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback:pulldownfresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos=1;
			queryNoPsdSetList(currentAcct,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#noPasswordList ul').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryNoPsdSetList(currentAcct,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	//联机免密卡状态列表查询 
	queryNoPsdSetList = function(accparam,pagebogVar){
		var url2 = mbank.getApiURL() + 'noPasswordLimitQuery.do';
		mbank.apiSend('post', url2, {
			cardNo:accparam,
			turnPageBeginPos:pagebogVar,
			turnPageShowNum:turnPageShowNum
		}, callBack2, null, true);
		function callBack2(data){
			var tempMesHtml ="";
			var dataVal ="";
			turnPageTotalNum = data.turnPageTotalNum;
			if( pagebogVar == 1 ){
		       	$("#noPasswordList").empty();
		    }
			if(turnPageTotalNum > 0){
				for (var i = 0; i < data.cardnoPsdSetList.length; i++) {
					var currObj = data.cardnoPsdSetList[i];
					dataVal = currObj.cardNo+"&"+currObj.userNo+"&"+currObj.userName+"&"+currObj.contract_flag+"&"+currObj.signDate;
					
					tempMesHtml += '<ul class="backbox_th m_top10px bg_br2px">';
					tempMesHtml += '<li>';
					tempMesHtml += '<p class="sav_tit"><span>卡号</span>'+currObj.cardNo+'</p>';
					tempMesHtml += '</li>';
					tempMesHtml += '<li class="money_box">';
					if (currObj.contract_flag == "Y") {
						tempMesHtml += '<p class="pub_li_right m_left10px">状态&nbsp;&nbsp;&nbsp;<span>开通</span></p>';
					}else if(currObj.contract_flag == "N"){
						tempMesHtml += '<p class="pub_li_right m_left10px">状态&nbsp;&nbsp;&nbsp;<span>关闭</span></p>';
					}
					tempMesHtml += '</li>';
					tempMesHtml += '<li>';
					if (currObj.contract_flag == "N") {
						//tempMesHtml += '<a href="javascript:void(0);" onclick=operateFormatter("'+dataVal+'")>开通</a>';
						//tempMesHtml += '<a operateFormatter="'+dataVal+'">开通</a>';
						tempMesHtml += '<div class="mui-switch mui-switch-blue mui-switch-mini flo_rihgt" operateFormatter="'+dataVal+'" style="position: absolute; top:20px; right:20px;">';
						tempMesHtml += '<div class="mui-switch-handle"></div>';
						tempMesHtml += '</div>';
					}else if(currObj.contract_flag == "Y"){
						//tempMesHtml += '<a href="javascript:void(0);" onclick=operateFormatter("'+dataVal+'")>关闭</a>';
						//tempMesHtml += '<a operateFormatter="'+dataVal+'">关闭</a>';
						tempMesHtml += '<div class="mui-switch mui-switch-blue mui-switch-mini mui-active flo_rihgt" operateFormatter="'+dataVal+'" style="position: absolute; top:20px; right:20px;">';
						tempMesHtml += '<div class="mui-switch-handle"></div>';
						tempMesHtml += '</div>';
					}
					tempMesHtml += '</li>';
					tempMesHtml += '</ul>';
				}
				$("#noPasswordList").append(tempMesHtml);
				plus.nativeUI.closeWaiting();
				mui('.mui-switch').switch();//手动初始化选项滑动开关
				
				mui('.switchList .mui-switch').each(function(){
					this.addEventListener("toggle",function(event){
						var datavalparam=$(this).attr("operateFormatter");
						var cardnoparam = datavalparam.split("&")[0];//卡号
						//var flagparam = datavalparam.split("&")[3];//签约标志Y-已签约 N-未签约
						
						if(event.detail.isActive){
							mui.confirm("您确定开通银联卡闪付联机小额快速支付服务？","温馨提示",["确定", "取消"], function(event){
					        	if (event.index == 0) {
					        		submitLimitSet(cardnoparam,"1");
					        	} else{
					        		return;
					        	}
					        }); 
					    }else{
					        mui.confirm("您确定关闭银联卡闪付联机小额快速支付服务？","温馨提示",["确定", "取消"], function(event){
					        	if (event.index == 0) {
					        		submitLimitSet(cardnoparam,"2");
					        	} else{
					        		return;
					        	}
					        });
					    }
					});
				});
				
				
				//提交开通-关闭
//				$("#noPasswordList ul li:last-child a:first-child").on("tap",function(){
//					var datavalparam=$(this).attr("operateFormatter");
//					var cardnoparam = datavalparam.split("&")[0];//卡号
//					var flagparam = datavalparam.split("&")[3];//签约标志Y-已签约 N-未签约
//					if (flagparam == "Y") {
//						mui.confirm("您确定关闭银联卡闪付联机小额快速支付服务？","温馨提示",["确定", "取消"], function(event){
//							if (event.index == 0) {
//								submitLimitSet(cardnoparam,"2");
//							} else{
//								return;
//							}
//						});
//					}else{
//							mui.confirm("您确定开通银联卡闪付联机小额快速支付服务？","温馨提示",["确定", "取消"], function(event){
//							if (event.index == 0) {
//								submitLimitSet(cardnoparam,"1");
//							} else{
//								return;
//							}
//						});
//					}
//				});
			}else{
				$("#noPasswordList").empty();
			}
		}
	}
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
    	if( mui.os.android ){
    		$("#pullrefresh").attr("style","margin-top: 40px");
    	}
    	
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				//getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
					$("#cardNo").val(currentAcct);
					queryNoPsdSetList(currentAcct,1);
				}
			}
		}
//		function getPickerList(iAccountInfoList){
//			if( iAccountInfoList.length>0 ){
//				accountPickerList=[];
//				for( var i=0;i<iAccountInfoList.length;i++ ){
//					var account=iAccountInfoList[i];
//					var pickItem={
//						value:i,
//						text:account.accountNo
//					};
//					accountPickerList.push(pickItem);
//				}
//				accountPicker = new mui.SmartPicker({title:"请选择信用卡卡号",fireEvent:"cardNo"});
//			    accountPicker.setData(accountPickerList);	
//			}
//		}
		

		
		
		//切换信用卡账户事件
//		$("#changeCardNo").on("tap",function(){
//			document.activeElement.blur();
//			accountPicker.show();
//		});
//		window.addEventListener("cardNo",function(event){
//			var pickItem3=event.detail;			
//			currentAcct=iAccountInfoList[pickItem3.value].accountNo;
//			$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
//			$("#cardNo").val(currentAcct);
//			queryNoPsdSetList(currentAcct,1);
//		});
		
		
		
		//提交联机免密限额设置
		submitLimitSet = function(paramtemp1,paramtemp2){
			//mui.alert("paramtemp1 :" +paramtemp1+" paramtemp2 :" +paramtemp2);
			var params={
			    creditCardNo:paramtemp1,
			    contract_flag:paramtemp2,
			    cardpublicflag:"14"
		    };
		    var url = mbank.getApiURL()+'noPasswordLimitSet.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "17";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
		}
	});
});