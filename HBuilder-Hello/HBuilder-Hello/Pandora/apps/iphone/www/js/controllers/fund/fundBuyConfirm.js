define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var f_cust_type = '1';
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();		
		var f_deposit_acct = self.f_deposit_acct; //交易账号									
		var f_prodname = self.f_prodname;	 //产品名称			
		var f_dividend = self.f_dividend;	//分红方式
		var f_tano = self.f_tano;  //TA代码		
		var f_prodcode = self.f_prodcode; //产品代码
		var f_prodtype = self.f_prodtype;//产品类型
		var f_currencytype = self.f_currencytype;//币种
		var buyAmount = self.buyAmount;//购买金额
		var firstBuyPoint = self.firstBuyPoint;//首次购买起点
		var addBuyPoint = self.addBuyPoint;//追加购买起点
		var f_status = self.f_status;//产品状态
		var fianceManagerCode = self.fianceManagerCode;//理财经理代码
		$("#accountNo").html(format.dealAccountHideFour(f_deposit_acct));
		$("#prodName").html(f_prodname+"("+f_prodcode+")");
		if(f_status == "1"){
			$("#fundType").html("基金认购");
			$("#fundTypeInfo").html("基金认购信息");
		}else if(f_status == "0" || f_status == "2" || f_status == "3" ||f_status == "6"){
			$("#fundType").html("基金申购");
			$("#fundTypeInfo").html("基金申购信息");
		}
		$("#bonusWay").html($.param.getDisplay("DIVIDEND_METHOD",f_dividend));
		$("#buyAmount").html(format.formatMoney(buyAmount)+"元");
		if(fianceManagerCode!=''){
			$("#showManagerCode").css("display","block");
			$("#fianceManagerCode").html(fianceManagerCode);
		}
		commonSecurityUtil.initSecurityData('010201',self);
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		
		plus.key.addEventListener('menubutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		$("#lastButton").click(function(){
			mui.back();
		});
		$("#submitButton").click(function(){
		    var param = {
		    	f_deposit_acct :f_deposit_acct,
        		f_prodcode : f_prodcode,
        		f_prodname : f_prodname,
        		f_tano : f_tano,
        		f_applicationamount : buyAmount,
        		f_dividmethod : f_dividend,
        		f_prodtype : f_prodtype,
        		f_cust_type : "1",
				f_fm_manager_no : fianceManagerCode
		    };
		    var url = mbank.getApiURL()+'fundProductBuy.do';
		    commonSecurityUtil.apiSend("post",url,param,successCallback,errorCallback,true);
		    function successCallback(data){
		    	if(data.ec=="000"){
		    		var params = {
		    			f_deposit_acct :f_deposit_acct,
		        		f_prodcode : f_prodcode,
		        		f_prodname : f_prodname,
		        		f_tano : f_tano,
		        		f_applicationamount : buyAmount,
		        		f_dividmethod : f_dividend,
		        		f_app_date : data.f_app_date,
		        		f_ta_app_date : data.f_ta_app_date,
		        		f_ta_ack_date : data.f_ta_ack_date,
		        		f_status : f_status,
		        		f_closeTip :data.f_closeTip,
			    		noCheck:false
			    	};
					mbank.openWindowByLoad('../fund/fundBuyResult.html','fundBuyResult','slide-in-right',params);
		    	}else{
					mui.alert(data.em);
				}
		    }
		    function errorCallback(e){
		        if(e.ec=="8005"){
		    		mui.alert("首次购买"+firstBuyPoint+"元起，追加购买"+addBuyPoint+"元起");
		    	}else{
		    		mui.alert(e.em);
		    	}
		    }
											
	    });
	    
	    mbank.resizePage(".btn_bg_f2");
	});
});