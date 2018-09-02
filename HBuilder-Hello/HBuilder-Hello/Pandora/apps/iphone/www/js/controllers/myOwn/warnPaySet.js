define(function(require, exports, module) {
	//缴费设置提醒    此次未加入功能中
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var iAccountInfoList = [];
	var customerNo;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		getMessage();
		
		function getMessage(){
			var url = mbank.getApiURL() + '026005_WarnPayQuery.do';
			mbank.apiSend("post",url,{accountType:""},successCallback,errorCallback,true);
			var length;
			function successCallback(data){
				iAccountInfoList = data.iUnionPayQueryIcoll;
				customerNo = data.customerNo;
				length = iAccountInfoList.length;
				var warnPay = $("#warnPay");
				warnPay.empty();
				warnPay.append('<div class="backbox_tit_bg">'+
				    	'<p class="backbox_tit_ico"></p>'+
				   	 	'<p class="backbox_tit">设置缴费提醒</p>'+
			    		'</div>');
				
				if(length>0){
					
					
					for(var i=0;i<length;i++){
						
						var areaCode = iAccountInfoList[i].areaCode;
						var userType = iAccountInfoList[i].userType;
						var noticeStatus = iAccountInfoList[i].noticeStatus;
						if(userType=="D1"){
							areaCode = "E"+areaCode;
						}
						
						var div = $('<div class="backbox_th p_lr10px ove_hid m_bottom10px"></div>');
						var ul = $('<ul></ul>');
						var li = $('<li></li>');
						var typeP = $('<p class="fz_16"></p>');
						typeP.append($.param.getUserType('PAY_TYPE',userType));
						
						var p = $('<p></p>');
						var areaSpan = $('<span class="color_6"></span>');
						areaSpan.append($.param.getUserType('AREA_CODE',areaCode));
						
						var noSpan = $('<span class="color_9"></span>');
						noSpan.append(iAccountInfoList[i].userNo);
						
						var chooseDiv_off;
						        		
						if(noticeStatus=="1"){
							chooseDiv_off = $('<div class="payset_btn">'+
								    	'<div class="mui-switch mui-switch-blue mui-switch-mini mui-active flo_rihgt" id="warnSet'+i+'" num="'+i+'">'+
							        	'<div class="mui-switch-handle"></div>'+
						            	'</div>'+
						        		'</div>');
						} else {
							chooseDiv_off = $('<div class="payset_btn">'+
								    	'<div class="mui-switch mui-switch-blue mui-switch-mini flo_rihgt" id="warnSet'+i+'" num="'+i+'">'+
							        	'<div class="mui-switch-handle"></div>'+
						            	'</div>'+
						        		'</div>');
						}
						li.append(typeP).append(p.append(areaSpan).append('&nbsp;&nbsp;').append(noSpan)).append(chooseDiv_off);
						div.append(ul.append(li));
						warnPay.append(div);
						
					}
					
					$('.mui-switch').on('tap',function(){
						var num = $(this).attr('num');
						var accountDetails = iAccountInfoList[num];
						var changeUrl = mbank.getApiURL() + '026005_WarnPayChange.do';
						if(accountDetails.noticeStatus=='1'){
							mui.confirm("确定关闭？","提示",["确定", "取消"], function(e){
								if(e.index==0){
									
									var changeParam = {areaCode:accountDetails.areaCode,userNo:accountDetails.userNo,userType:accountDetails.userType,customerNo:customerNo,operationType:"3"};
									
									mbank.apiSend("post",changeUrl,changeParam,function(data){
										getMessage();
//										$('#warnSet'+num).removeClass('mui-active');
	//								console.log(data.hostErrorMessage);
										/*var msg = {title:"缴费提醒设置设置",value:data.hostErrorMessage};
										mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{params:msg});*/
									},errorCallback,true);
									
									
									
									
								}
							});
							
						}else{
							mui.confirm("确定开通？","提示",["确定", "取消"], function(e){
								if(e.index==0){
									
									var changeParam = {areaCode:accountDetails.areaCode,userNo:accountDetails.userNo,userType:accountDetails.userType,customerNo:customerNo,operationType:"2"};
									
									mbank.apiSend("post",changeUrl,changeParam,function(data){
										getMessage();
//										$('#warnSet'+num).addClass('mui-active');
										/*var msg = {title:"缴费提醒设置设置",value:data.hostErrorMessage};
										mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{params:msg});*/
									},errorCallback,true);
									
									
								}
							});
							
						}
					});
					
					
					
				}else{
					warnPay.empty();
					$('#showMsgDiv').show();
//					warnPay.append("<ul><li>未查询到相关记录</li></ul>");
				}
				
			}
		}
		
		
		function errorCallback(){
			mui.alert("访问失败");
		}
		
		
	});	
});