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
	var unknowList = [];
	var currUnknow;
	var length;
	var cardType = "2";
	var cardNo;
	var turnPageBeginPos = 1;
	var turnPageShowNum = 10;
	var turnPageTotalNum;
	
	var search = doc.getElementById("search");
	
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
	
	/* function pulldownfresh(){
        searchUnknowList(1);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
		}, 800);
    }*/

 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#limitUnknowList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			searchUnknowList(cardNo,turnPageBeginPos);
			
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
 	
 	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos=1;	
			searchUnknowList(cardNo,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }
	
	mui.plusReady(function() {
		if( mui.os.android ){
    		$("#pullrefresh").attr("style","margin-top: 40px");
    	}
		$("#pullrefresh").show();
		var self = plus.webview.currentWebview();
		cardNo = self.cardNo;
		
		var limitUnknowList = doc.getElementById("limitUnknowList");
		
		//查询未出账单详情
		searchUnknowList = function(card,turnPageBeginPos){
			mbank.showWaiting();
			var url = mbank.getApiURL() + 'limitUnknow.do';
			mbank.apiSend('post', url, {cardNo:card,turnPageBeginPos:turnPageBeginPos,turnPageShowNum:turnPageShowNum},
							querySuccess,queryError,false);
							
			function querySuccess(data){
				mbank.closeWaiting();
				if(turnPageBeginPos==1){
					$("#limitUnknowList").empty();
				}
				unknowList = data.iHistorysale3;
				turnPageTotalNum=data.turnPageTotalNum;
				length = unknowList.length;
				makeUnknowDetail();
			}
			
			function queryError(data){
				length = 0;
				plus.nativeUI.toast(data.em);
				mbank.closeWaiting();
			}
			
		}
		
		//未出账单显示
		function makeUnknowDetail(){
			var detailListHtml = "";
				for(var index=0;index<length;index++){
					currUnknow = unknowList[index];
					detailListHtml += '<div class="backbox_tit_bg">';
					detailListHtml += '<p class="backbox_tit_ico"></p><p class="backbox_tit">查询结果</p>';
					detailListHtml += '</div>';
					detailListHtml += '<div class="backbox_th p_lr10px" >';
					detailListHtml += '<ul>';
					detailListHtml += '<li>';
					if(currUnknow.TrxnDesc){
						detailListHtml += '<span class="input_lbg">摘要：</span>'+'<span class="input_m14px">'+currUnknow.TrxnDesc+'</span>';
					}else{
						detailListHtml += '<span class="input_lbg">摘要：</span>'+'<span class="input_m14px">'+currUnknow.TrxnName+'</span>';
					}
					
					detailListHtml += '</li>';
					detailListHtml += '<li>';
//					if(currUnknow.TrxnAmt>0){
//						detailListHtml += '<span class="input_lbg">收入：</span><span class="input_m14px">'+currUnknow.TrxnAmt+'</span>';
//
//					}else{
//						detailListHtml += '<span class="input_lbg">支出：</span><span class="input_m14px">'+currUnknow.TrxnAmt+'</span>';
//					}		
					//暂未区分收入和支出 统一显示为金额--modify by 2017-5-8
					detailListHtml += '<span class="input_lbg">金额：</span><span class="input_m14px">'+currUnknow.TrxnAmt+'</span>';
					detailListHtml += '</li>';
					detailListHtml += '<li>';
					detailListHtml += '<span class="input_lbg">币种：</span><span class="input_m14px">人民币</span>';
					detailListHtml += '</li>';
					detailListHtml += '<li>';
					detailListHtml += '<span class="input_lbg">卡号后四位：</span><span class="input_m14px">'+currUnknow.CardTailNo+'</span>';
					detailListHtml += '</li>';
					detailListHtml += '<li>';
					detailListHtml += '<span class="input_lbg">日期：</span><span class="input_m14px">'+format.dataToDate(currUnknow.TrxnDate)+'</span>';
					detailListHtml += '</li>';
					detailListHtml += '</ul>';
					detailListHtml += '</div>';
					detailListHtml += '</div>';	
				}
				$("#limitUnknowList").append(detailListHtml);		
		}
		
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
					if("" == cardNo || null == cardNo){
						mui.alert("请选择卡号");
					}else{
						searchUnknowList(cardNo,1);
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
        		if("" == cardNo || null == cardNo){
					mui.alert("请选择卡号");
				}else{				
	        		searchUnknowList(cardNo,1);
				}
        });
		
		/*search.addEventListener('tap',function(){
			if("" == cardNo || null == cardNo){
				mui.alert("请选择卡号");
			}else{
				searchUnknowList(turnPageBeginPos);
				
				
			}
		});*/
		
		
		
		
	});
});