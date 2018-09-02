/*
 * 日志详情查询结果：
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

	var turnPageBeginPos = 1;
	var turnPageShowNum = 10;
	var turnPageTotalNum;	
	var iLogInfo = [];
	var length;
	var currInfo;
		
	var oprationName;//操作名称
	var oprationTime;//操作时间
	var operationResult;//操作结果
	var logInfo;//备注

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
        searchInfoDetail(1);
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().endPullUpToRefresh(); 
		}, 800);
    }

 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#logInfoList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			searchInfoDetail(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		
		var state = app.getState();
		var self = plus.webview.currentWebview(); 
		var beginDate = self.beginDate;
		var endDate = self.endDate;
		var businessCode = self.businessCode;
		
		
		var logInfoList = doc.getElementById("logInfoList");
		
		
		searchInfoDetail = function(turnPageBeginPos){
			var url = mbank.getApiURL() + 'opLogQuery.do';
			var param = {beginDate:beginDate,
						 endDate:endDate,
						 businessCode:businessCode, 
						 turnPageBeginPos:turnPageBeginPos,
						 turnPageShowNum:turnPageShowNum
						};
						 
			mbank.apiSend('post', url, param,
							querySuccess,queryError,true);
		
			function querySuccess(data){
				iLogInfo = data.iLogInfo;
				turnPageTotalNum=data.turnPageTotalNum;
				length = iLogInfo.length;
				makeInfoDetail();
			}
			
			function queryError(data){
				length = 0;
				plus.nativeUI.toast(data.em);
				mui.back();
			}
			
			
			
			function makeInfoDetail(){
				var detailListHtml = "";
				if(length>0){
					for(var index=0;index<length;index++){
						currInfo = iLogInfo[index];
						detailListHtml += '<div class="backbox_th p_lr10px" style="margin-top: 10px;">';
						detailListHtml += '<ul>';
						detailListHtml += '<li>';
						detailListHtml += '<span class="input_lbg">操作名称：</span>';
						detailListHtml += '<span class="input_m14px">'+currInfo.businessName+'</span>';
						detailListHtml += '</li>';
						detailListHtml += '<li>';
						detailListHtml += '<span class="input_lbg">操作时间：</span><span class="input_m14px">'+(currInfo.operationTime.substr(0,4)+'/'+currInfo.operationTime.substring(4,6)+'/'+currInfo.operationTime.substring(6,8)+" "+currInfo.operationTime.substring(8,10)+":"+currInfo.operationTime.substring(10,12)+":"+currInfo.operationTime.substring(12,14))+'</span>';
						detailListHtml += '</li>';
						detailListHtml += '<li>';
						if(currInfo.operationResult=='00000000'){
							detailListHtml += '<span class="input_lbg">结果：</span><span class="input_m14px">成功</span>';
						}else{
							detailListHtml += '<span class="input_lbg">结果：</span><span class="input_m14px">失败</span>';
						}
						
						detailListHtml += '</li>';
						/*detailListHtml += '<li>';
						detailListHtml += '<span class="input_lbg">备注：</span><span class="input_m14px">'+(currInfo.logInfo).replace(",","\n").replace(",","\n")+'</span>';
						detailListHtml += '</li>';*/
						detailListHtml += '</ul>';
						detailListHtml += '</div>';
						detailListHtml += '</div>';	
					}
				}else{
						$("#showMsgDiv").empty();
						$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
					    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
					    $("#showMsgDiv").show();
			       		$("#pullRefresh").hide();
					    mui('#pullRefresh').pullRefresh().setStopped(true);//禁止上下拉
				}
				
				$("#logInfoList").append(detailListHtml);
			}
			
		}
		searchInfoDetail(1);
		
		
	});
});