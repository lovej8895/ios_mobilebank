define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var f_cust_type = '1';
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();		
		var accountCardNo = self.accountCardNo; //交易账号									
		var f_prodname = self.f_prodname;	 //产品名称			
		var f_prodcode = self.f_prodcode; //产品代码
		var f_prodtype = self.f_prodtype; //产品类型
		var f_tano = self.f_tano;  //TA代码
		var f_avdilvol = self.f_avdilvol; //可用份额
		var f_b24minamt = self.f_b24minamt; //单笔赎回最低份额
		var f_b25maxamt = self.f_b25maxamt; //单笔赎回最高额
		var f_holdmin = self.f_holdmin; //最低持有份额
		
//		f_avdilvol = format.formatMoney(f_avdilvol, 2);
//		f_b24minamt = format.formatMoney(f_b24minamt, 2);
		document.getElementById("accountNo").innerHTML = format.dealAccountHideFour(accountCardNo);
		document.getElementById("productName").innerHTML = f_prodname;
		document.getElementById("avdilvol").innerHTML = format.formatMoney(f_avdilvol, 2);
		document.getElementById("lowestRedemption").innerHTML = format.formatMoney(f_b24minamt, 2);
		
		var largeList = jQuery.param.getParams('LARGEREDEMPTION');	//得到赎回方式
		var largerRedemption = '0';
		$("#largerRedemption").html('取消');
		largerRedemptionInit();
		function largerRedemptionInit(){
			var largerRedemption = new mui.SmartPicker({title:"请选择赎回方式",fireEvent:"LARGEREDEMPTION"});
			largerRedemption.setData(largeList);
			document.getElementById("notPeriodLi").addEventListener("tap",function(){
				largerRedemption.show();
			},false);
		}
		
		//添加分红方式监听事件
		window.addEventListener("LARGEREDEMPTION",function(event){
           	var param=event.detail;
           	largerRedemption = param.value;
			$("#largerRedemption").html(param.text);
        });	
        
		//格式化金额
        $("#redemptionLot").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#redemptionLot").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
		
		
		$("#nextButton").click(function(){	
			
		    var redemptionLot=$("#redemptionLot").val(); //赎回份额		    
		    redemptionLot=format.ignoreChar(redemptionLot,',');
			
//		    f_avdilvol = Number(self.f_avdilvol);		   		   
			if( ""==redemptionLot || redemptionLot == null ){
	    		mui.alert("请输入赎回份额！");
	    		return false;
	        }
			
			if( !isMoney(redemptionLot) || parseFloat(redemptionLot)<=0 ){
        		mui.alert("请输入正确的赎回份额！");
        		return false;
        	}

			if(parseFloat(redemptionLot) > parseFloat(f_avdilvol)){
				mui.alert("赎回份额应小于等于可用份额！");
	    		return false;
			}
			if(parseFloat(redemptionLot) > parseFloat(f_b25maxamt)){
				mui.alert("赎回份额应小于等于单笔最大赎回份额"+f_b25maxamt+"");
	    		return false;
			}

			if(parseFloat(redemptionLot) < parseFloat(f_b24minamt)){
				mui.alert("赎回份额应大于等于单笔最低赎回份额"+f_b24minamt+"");
	    		return false;
			}
			
			if(parseFloat(f_avdilvol-redemptionLot) < parseFloat(f_holdmin) && parseFloat(f_avdilvol-redemptionLot)>0){
				mui.alert("剩余份额小于最低持有份额"+f_holdmin+"，需赎回所有份额！");
	    		return false;
			}
			
			if( ""==largerRedemption || largerRedemption == null ){
	    		mui.alert("请选择巨额赎回方式！");
	    		return false;
	        }
			
			var params = {
				f_deposit_acct : accountCardNo,
				f_tano : f_tano,
				f_prodname : f_prodname,
				f_prodcode : f_prodcode,
				f_prodtype : f_prodtype,
				f_avdilvol : self.f_avdilvol,
				f_applicationvol : redemptionLot,
				payAmount : redemptionLot,
				f_largeredemptionflag : largerRedemption,
				noCheck:false
				};
			mbank.openWindowByLoad('../fund/fundRedemptionNext.html','fundRedemptionNext','slide-in-right',params);		
											
	   });	
	    mbank.resizePage(".btn_bg_f2");
	});
});