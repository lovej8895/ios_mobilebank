define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var mbUUID;
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    
    var msgList = [];

	m.init({
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
			systemMessage(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
//			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }

 	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			systemMessage(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
	
	function systemMessage(beginPos){
			var dataNumber = {
				mbUUID : mbUUID,
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum,
				liana_notCheckUrl : false
			};
			var url = mbank.getApiURL() + '210201_systemMessage.do';
			mbank.apiSend('post', url, dataNumber, callBack, null, true);
			function callBack(data){
				turnPageTotalNum=data.turnPageTotalNum;
				if (beginPos == 1) {
					$("#sysMsg").empty();
				}
				var messageList = data.msgList;
				var html = '';
				for(var i = 0; i < messageList.length; i++){
					var messageId = messageList[i].msgId;
					var messageContent = messageList[i].msgContent.replaceAll('&lt;br/&gt;','').replace(/ /g,'&nbsp;&nbsp;');					//交易渠道
					var messageTitle = messageList[i].msgTitle;				//银行卡号
					var messageTitleShow = messageTitle;
					if (messageTitleShow.length > 15) {
						messageTitleShow = messageTitleShow.substr(0, 15) + "...";
					}
					var messageTime = messageList[i].msgDate;			//交易类型
					var isNewMessage = messageList[i].msgIsRead;			//产品代码
					var index = beginPos - 1 + i;
					msgList[index] = messageList[i];
			    	html+='<ul class="backbox_th m_top10px ove_hid" index=' + index + '><li class="financial">';
			      	html+='<div class="ove_hid"><p class="fin_tit fz_16" style="float:left">'+messageTitleShow+'</p>';
			    	if(isNewMessage=='0'){
			      		html+='<p class="new_ico m_top10px"></p>';
			      	}
			    	html+='</div>';
			      	html+='<p class="m_left10px color_6" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:85%;">'+messageContent+'</p>';
			      	html+='<a class="link_rbg link_t30px"></a>';
			      	//html+='<span class="message-line"></span>';
			      	html+='</li>';
			      	html+='<li>';
			      	html+='<p class="color_9" style="width:90%;margin:5px auto;border-top:1px dashed #ddd;line-height:30px;">'+formatDate(messageTime)+'</p>';
			      	html+='</li></ul>';
			      	//html+='<a class="mui-navigate-right" onclick=showDetail(' + paramStr + ')>';
			      	
				}
				$("#sysMsg").append(html);
				$("#sysMsg ul").on('tap', function(){
					var index = $(this).attr("index");
					var params = {
						messageContent : msgList[index].msgContent.replaceAll('&lt;','<').replaceAll('&gt;','>').replace(/ /g,'&nbsp;&nbsp;'),
						messageTitle : msgList[index].msgTitle,
						messageTime : msgList[index].msgDate,
						isNewMessage : msgList[index].msgIsRead,
						messageId : msgList[index].msgId,
						autograph : msgList[index].autograph,
	    				noCheck : "true"
					};
					mbank.openWindowByLoad('messageDetail.html','messageDetail','slide-in-right',params);
				});
			}
		}
	
		
		function formatDate(date) {
			return date.substr(0,4) + "-" + date.substr(4,2) + "-" + date.substr(6,2);
		}
		
	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var sysMsg = document.getElementById("sysMsg");
		mbUUID = plus.device.uuid;
		systemMessage(1);
		
		//刷新消息列表
		window.addEventListener("refreshNews", function(event) {
			$("#sysMsg").empty();
			turnPageBeginPos=1;
			systemMessage(turnPageBeginPos);
		});
		//父页面--非原生弹出框
		window.addEventListener("muiAlert", function(event) {
			var data = event.detail.data;
			if(!data){
				mui.alert(data.em);
			}
		});
	});
});