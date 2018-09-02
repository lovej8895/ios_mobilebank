define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#balance").html(format.formatMoney(self.balance,2));
        $("#openDate").html(format.dataToDate(self.openDate));
        $("#drawType").html($.param.getDisplay("DRAW_TYPE",self.drawType));
        $("#drawFlag").html($.param.getDisplay("DRAW_FLAG",self.drawFlag));
        
        if( self.drawType=="2" ){
        	$("#reserveDate").html(self.reserveDate);
        	$("#reserveDateLi").show();
        }

        if( self.drawFlag=="1" ){
        	$("#drawAmount").html(format.formatMoney(self.drawAmount,2));
        	$("#drawAmount").show();
        }
        
        $("#preStep").on("tap",function(){
        	self.close();
        });
        
        $("#confirmButton").on("tap",function(){
        	if( self.drawFlag == '1' ){
				mui.confirm("您此次办理立即支取，支取金额的利息将按照活期利率计算，是否确认继续？","提示",["确认", "取消"], function(e) {
				if (e.index == 0) {
					tranConfirm();	
				} });       		
        	}else{
        	    tranConfirm();		
        	}
        	function tranConfirm(){
	         	var params={
	         		accountNo:self.accountNo,
	         		subAccountNo:self.subAccountNo,
	         		currencyType:self.currencyType,	 
	         		openDate:self.openDate,
	         		drawAmount:self.drawAmount,	
	         		savingPeriod:self.savingPeriod,	 
	         		balance:self.balance,	         		
	         		drawType:self.drawType,
	         		subAccountSerNo:self.subAccountSerNo,
                    drawFlag:self.drawFlag,
                    reserveDate:format.ignoreChar(self.reserveDate,"-")
	         	};
	        	var url = mbank.getApiURL()+'002005_notifyDepositDraw.do';
			    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			        mbank.openWindowByLoad('../savings/notify2DemandResult.html','notify2DemandResult','slide-in-right',data);
			    }
			    function errorCallback(data){
			    	dealFail(data);
			    }       		
        	}
        	
        });
        
 	    function dealFail(data){
            mui.alert(data.em);
        }         
        
	});

});
