define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	var typeJsonList = {"000000010020010":"D1",
						"000000010008010":"D4",
						"000000010006010":"I1"};
	 
	var gpsJsonList = {"05000000010020010":"hsdlds",
					   "02000000010020010":"ychdlds",
			 		   "05000000010007010":"hsdxds",
			 		   "02000000010007010":"ychdxds",
			 		   "02000000010008010":"ychsfds",
			 		   "02000000010018010":"ychtrq",
			 		   "01000000010019010":"etc"};
	var self = "";
	var accountNo = "";
	var chargeType = "";
	var areaId = "";
	var beginDate = "";
	var endDate = "";
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var params = "";
	var urlVar = "";
	
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
//				contentrefresh : "正在刷新...",
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
			turnPageBeginPos = 1;
			feePaymentHistoryList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#feePaymentList li').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			feePaymentHistoryList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		accountNo = self.accountNo;
		chargeType = self.chargeType;
		areaId = self.areaId;
		beginDate = self.beginDate;
		endDate = self.endDate;
		feePaymentHistoryList(1);
	});
	function checkUnionPayType(chType,areaId){
		if(chType=="000000010020010"){
			if(areaId=="52000000"){
				return true;
			}
		}else if(chType=="000000010008010"){
			if(areaId=="02"||areaId=="03"){
				return false;
			}else{
				return true;
			}
		}else if(chType=="000000010006010"){
			return true;
		}else if(chType=="000000010007010"){
			return false;
		}else if(chType=="000000010018010"){
			return false;
		}else if(chType=="000000010019010"){
			return false;
		}else{
			return false;
		}
	}
	function feePaymentHistoryList(pageVar){
		document.getElementById("noContent").style.display="none";
		if(!checkUnionPayType(chargeType,areaId)){
			GapsQuery(pageVar);
		}else{
			UnionQuery(pageVar);
		}
	}
		
	function GapsQuery(pageVar){
		urlVar = mbank.getApiURL()+'003002_charge_query_Ajax.do';
		params = {
			"accountNo" : accountNo,
			"StartDt" : format.ignoreChar(beginDate,'-'),
			"EndDt" : format.ignoreChar(endDate,'-'),
			"chargeType" : gpsJsonList[areaId+""+chargeType],
			"areaId" : areaId,
			"channelFlag" : "0",
			"turnPageBeginPos" : pageVar,
			"turnPageShowNum" :turnPageShowNum
		};
		mbank.apiSend("post",urlVar,params,gapsQuerySucFunc,gapsQueryFailFunc,true);
		function gapsQuerySucFunc(data){
			if(data.ec == "000"){
				var iChargeQueryList = data.iChargeQuery;
		       	turnPageTotalNum = data.turnPageTotalNum;
			    if( turnPageBeginPos==1 ){
			       	jQuery("#feePaymentList").empty();
			    }
		       	var	html="";
		       	if(iChargeQueryList.length>0){
		       		for(var i=0;i<iChargeQueryList.length;i++){
			       		var iChargeQuery = iChargeQueryList[i];
			       		
			       		var chargeTimeVar = showTime(iChargeQuery.chargeTime);
			       		var chargeTypeVar = iChargeQuery.chargeType;
			       		var chargeNoVar = iChargeQuery.chargeNo;
			       		var tranAmtVar = format.formatMoney(iChargeQuery.tranAmt,2);
			       		var channelFlagVar = iChargeQuery.channelFlag;
			       		var failMesVar = iChargeQuery.failMes;
						html +='<li chargeTime="'+chargeTimeVar+'" chargeType="'+chargeTypeVar+'" chargeNo="'+chargeNoVar+'" tranAmt="'+tranAmtVar+'" channelFlag="'+channelFlagVar+'" failMes="'+failMesVar+'">'
								+'<p class="color_6">支付类型</p><p class="fz_15">'+chargeTypeVar+'</p>'
							    +'<div class="content_rbox"><p class="color_red fz_16">¥'+tranAmtVar+'</p><p class="fz_12 color_9">支付金额</p></div>'
							    +'<a class="link_rbg2"></a>'
							    +'</li>';
			       	}
			       	jQuery("#feePaymentList").append(html);
			       	mui("#feePaymentList").on('tap','li',function(){
						getDetail(this);
					});
		       	}else{
		       		if( turnPageBeginPos==1 ){
		       			document.getElementById("noContent").style.display="block";
				    }
		       	}
			}else{
				mui.alert(data.em,"温馨提示");
			}
		}
		function gapsQueryFailFunc(e){
			mui.alert(e.em,"温馨提示");
		}
	}
	
	function showTime(chargeTime){
		var parsedDate = format.parseDate(chargeTime,"yyyymmddhhmiss");
		return parsedDate.format("yyyymmdd"+" "+" hh:mi");
	}
	
	function UnionQuery(pageVar){
		urlVar = mbank.getApiURL()+'003007_UnionPayQuery.do';
		params = {
			"accountNo" : accountNo,
			"beginDate" : beginDate,
			"endDate" : endDate,
			"chargeType" : typeJsonList[chargeType],
			"areaId" : areaId,
			"turnPageBeginPos" : pageVar,
			"turnPageShowNum" :turnPageShowNum
		};
		mbank.apiSend("post",urlVar,params,unionQuerySucFunc,unionQueryFailFunc,true);
		function unionQuerySucFunc(data){
			if(data.ec == "000"){
				var iUnionPayQueryList = data.iUnionPayQueryList;
		       	turnPageTotalNum=data.turnPageTotalNum;
			    if( turnPageBeginPos==1 ){
			       	jQuery("#feePaymentList").empty();
			    }
		       	var	html="";
		       	if(iUnionPayQueryList.length > 0){
		       		for(var i=0;i<iUnionPayQueryList.length;i++){
		       			var iUnionPayQuery = iUnionPayQueryList[i];
		       			
		       			var chargeTimeVar1 = showTime(iUnionPayQuery.orderSubmitTime);
			       		var chargeTypeVar1 = showChargeType(iUnionPayQuery.customerType,iUnionPayQuery.areaId);
			       		var chargeNoVar1 = showChargeItem(iUnionPayQuery.customerType,iUnionPayQuery.userNo);
			       		var tranAmtVar1 = format.formatMoney(iUnionPayQuery.tranAmt,2);
			       		var channelFlagVar1 = jQuery.param.getDisplay('TRAN_CHANNEL',iUnionPayQuery.channel);
			       		var failMesVar1 = iUnionPayQuery.failMes;
						html +='<li chargeTime="'+chargeTimeVar1+'" chargeType="'+chargeTypeVar1+'" chargeNo="'+chargeNoVar1+'" tranAmt="'+tranAmtVar1+'" channelFlag="'+channelFlagVar1+'" failMes="'+failMesVar1+'">'
								+'<p class="color_6">支付类型</p><p class="fz_15">'+chargeTypeVar1+'</p>'
							    +'<div class="content_rbox"><p class="color_red fz_16">¥'+tranAmtVar1+'</p><p class="fz_12 color_9">支付金额</p></div>'
							    +'<a class="link_rbg2"></a>'
							    +'</li>';
		       		}
		       		jQuery("#feePaymentList").append(html);
		       		mui("#feePaymentList").on('tap','li',function(){
						getDetail(this);
					});
		       	}else{
		       		if( turnPageBeginPos==1 ){
		       			document.getElementById("noContent").style.display="block";
				    }
		       	}
			}else{
				mui.alert(data.em,"温馨提示");
			}
		}
		function unionQueryFailFunc(e){
			mui.alert(e.em,"温馨提示");
		}
	}
	
	function showChargeType(cstType,areaCode){
		if(cstType=="D1"){
			areaCode = "E"+areaCode;
		}
		return jQuery.param.getDisplay('AREA_CODE',areaCode)+""+jQuery.param.getDisplay('PAY_TYPE',cstType);
	}
	function showChargeItem(cstType,userNo){
		var typeName ="";
		if(cstType=="I1"){
			typeName = "手机号码";
		}else{
			typeName = "用户号";
		}
		return typeName+":"+userNo;
	}
	
	function getDetail(target){
		params = {
			"chargeTime" : target.attributes["chargeTime"].nodeValue,
			"chargeType" : target.attributes["chargeType"].nodeValue,
			"chargeNo" : target.attributes["chargeNo"].nodeValue,
			"tranAmt" : target.attributes["tranAmt"].nodeValue,
			"channelFlag" : target.attributes["channelFlag"].nodeValue,
			"failMes" : target.attributes["failMes"].nodeValue
		}
		mbank.openWindowByLoad('../feePayment/feePaymentHistoryDetail.html','feePaymentHistoryDetail','slide-in-right',params);
	}
});