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
	//联机免密卡状态列表查询 
	
	var isOpen;//判断开关状态 0：关闭 1：开启
	
	queryLimitFree = function(accNo){
		var url = mbank.getApiURL() + 'queryLimitFree.do';
		var params = {
			cardNo : accNo
		};
		mbank.apiSend('post', url, params, querySuccess, null, false);
		function querySuccess(data){
			var resCode = data.responseCodeNo;
			var resMsg = data.responseMessage;
			var openFlag = data.openFlag;
			var singleLimit = data.singleLimit;
			var totalLimit = data.totalLimit;
			var tempMesHtml = '';
			
			tempMesHtml += '<ul class="backbox_th m_top10px bg_br2px">';
			tempMesHtml += '<li>';
			tempMesHtml += '<p class="sav_tit"><span>卡号</span>'+accNo+'</p>';
			tempMesHtml += '</li>';
			tempMesHtml += '<li class="money_box">';
			if (openFlag == "Y") {
				tempMesHtml += '<p class="pub_li_right m_left10px" id="state'+accNo+'">状态&nbsp;&nbsp;&nbsp;<span>开通</span></p>';
				tempMesHtml += '</li>';
				tempMesHtml += '<li>';
				tempMesHtml += '<div class="mui-switch mui-switch-blue mui-switch-mini mui-active flo_rihgt" id="'+accNo+'"  style="position: absolute; top:20px; right:20px;">';
				tempMesHtml += '<div class="mui-switch-handle"></div>';
				tempMesHtml += '</div>';
			}else if(openFlag == "N"){
				tempMesHtml += '<p class="pub_li_right m_left10px" id="state'+accNo+'">状态&nbsp;&nbsp;&nbsp;<span>关闭</span></p>';
				tempMesHtml += '</li>';
				tempMesHtml += '<li>';
				tempMesHtml += '<div class="mui-switch mui-switch-blue mui-switch-mini flo_rihgt" id="'+accNo+'"  style="position: absolute; top:20px; right:20px;">';
				tempMesHtml += '<div class="mui-switch-handle"></div>';
				tempMesHtml += '</div>';
			}
			tempMesHtml += '</li>';
			tempMesHtml += '</ul>';		
			$("#LimitFreeList").append(tempMesHtml);
				
			var limitFreeSwitch = document.getElementById(accNo);
			limitFreeSwitch.addEventListener('tap', function() {
				isOpen = limitFreeSwitch.classList.contains('mui-active');
				if(isOpen){
					mui.confirm("关闭后您将不能继续使用小额免密功能进行交易，仍要关闭此功能吗？", "温馨提示", ["确定", "取消"], function(event) {
						if(event.index == 0) {
							limitFreeSet(accNo,'0');
							//nativeUI.toast("已关闭");
							limitFreeSwitch.classList.remove('mui-active');
							isOpen = false;
						} else {
							nativeUI.toast("已取消");
						}
					});
				}else{
					/*mui.confirm("您将开启小额免密功能", "温馨提示", ["确定", "取消"], function(event) {
						if(event.index == 0) {
							limitFreeSet(accNo,'1');
							//nativeUI.toast("已开启");
							limitFreeSwitch.classList.add('mui-active');
							isOpen = true;
						} else {
							nativeUI.toast("已取消");
							
						}
					});*/
					var params = {
						cardNo : accNo,
						state : '1'
					};
					mbank.openWindowByLoad('limitFreeSet.html','limitFreeSet','slide-in-right',params);
				}
			});	
		}
	}
	//设置免密state:0关闭 ，1:开启
	function limitFreeSet(cardNo, state){
		var url = mbank.getApiURL() + 'limitFreeOut.do';
		var openFlag;
		if(state == '0'){
			openFlag = 'N';
		}else if(state == '1'){
			openFlag = 'Y';
		}
		var params = {
			cardNo : cardNo,
			openFlag : openFlag,
			singleLimit : "0.0",
			totalLimit : "0.0"
		}
		mbank.apiSend('post', url, params, setSuccess, null, false);
		function setSuccess(data){
			var resCoed = data.responseCodeNo;
			var resMsg = data.responseMessage;
			var stateId = "state"+cardNo;
			document.getElementById(stateId).innerHTML="状态&nbsp;&nbsp;&nbsp;<span>关闭</span>";
			nativeUI.toast(resMsg);
		}
		//nativeUI.toast(cardNo+"   "+openFlag);
	}
	
	
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
    	if( mui.os.android ){
    		$("#pullrefresh").attr("style","margin-top: 40px");
    	}
    	nativeUI.showWaiting();
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"2");
			function allCardBack(data){
				iAccountInfoList = data;
				//getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					for(var i=0;i<length;i++){
						currentAcct = iAccountInfoList[i].accountNo;
						$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
						$("#cardNo").val(currentAcct);
						queryLimitFree(currentAcct);
					}
					
				}
				nativeUI.closeWaiting();
			}
		}
		
		var html = '<div class="content_box5px p_lr10px box_top15px" >'+
				'<p class="hint">温馨提示：</p>'+
				'<p class="hint_con fz_12">"小额免密免签"是中国银联为客户提供的一种便捷支付服务。当您使用'+
				'我行前6位为623076(加载金融功能的社会保障卡除外)的芯片借记卡，在境内指定商户进行300元人民币及以'+
				'下的交易时，只需将卡片靠近POS机等受理终端的"闪付"感应区挥卡，即可完成支付(无需开通电子现金功能)'+
				'。支付过程中，您不会被要求输入密码，也无需签名。</p>'+
				'</div>';
		$("#box").append(html);
		
		window.addEventListener("refreshLimitList", function(event) {
        	$("#LimitFreeList").empty();
			queryCreditCardAccount();
		});
		
	});
});