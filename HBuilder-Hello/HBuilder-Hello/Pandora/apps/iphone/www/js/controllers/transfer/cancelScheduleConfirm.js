define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
    var orderFlowNo="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var self = plus.webview.currentWebview();
		$("#payAccount").html(self.payAccount);
		$("#recAccount").html(self.recAccount);
		$("#recAccountName").html(self.recAccountName);
		$("#payAmount").html(format.formatMoney(self.payAmount));
		$("#payRem").html(self.payRem);
		if( self.scheduleType=="0" ){
			$("#scheduleType").html("一次性预约");
			$("#specifyDateTime").html(self.nextDate+"&nbsp;&nbsp;"+(self.specifyTime=='AM')?'上午10:00':'下午14:00');
			$(".specifyDateLi").show();
			$(".specifyCycleLi").hide();
		}
		if( self.scheduleType=="1" ){
			$("#scheduleType").html("周期性预约");
			$("#startDate").html(self.startDate);
			$("#transTimes").html(self.transTimes);
			$("#executeTimes").html(self.executeTimes);
			$("#successTimes").html(self.successTimes);
			$("#successAmt").html(format.formatMoney(self.successAmt));
			$("#successTimes").html(self.successTimes);
			$("#failTimes").html(self.failTimes);
			$("#failAmt").html(format.formatMoney(self.failAmt));
			$("#nextDate").html(self.nextDate);
			$(".specifyDateLi").hide();
			$(".specifyCycleLi").show();
		}
		
		$("#confirmButton").on("tap",function(){
	    	var url=mbank.getApiURL()+'002002_cancelDeal.do';
	    	var param={
             	orderFlowNo:self.orderFlowNo	    		
	    	};
	    	mbank.apiSend("post",url,param,function(data){
		        mbank.openWindowByLoad('../transfer/cancelScheduleResult.html','cancelScheduleResult','slide-in-right',data);	
	    	},function(data){
	    		mui.alert(data.em);
	    	},true);
          	
		});
	});

});