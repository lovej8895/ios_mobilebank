define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	var savingPeriodPicker;
	var saveDaysPicker;
	var savingPeriod="";
	var transferSaveDays="";
	var transferSaveType="0";//默认不自动转存
	var interestRate="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        
        $("#accountNo").html(self.accountNo);
        myAcctInfo.getAccAmt(self.accountNo,"balance",true);
        var savingPeriodArray=[
                                {text:"三个月",value:"03"},
                                {text:"六个月",value:"06"},
                                {text:"一年",value:"12"},
                                {text:"两年",value:"24"},
                                {text:"三年",value:"36"},
                                {text:"五年",value:"60"}
                              ];
        savingPeriodPicker = new mui.SmartPicker({title:"请选择存期",fireEvent:"savingPeriod"});
	    savingPeriodPicker.setData(savingPeriodArray);	
	    savingPeriod=savingPeriodArray[0].value;
	    $("#savingPeriod").html(savingPeriodArray[0].text);
	    rateSearch({depositType:"01",savingPeriod:savingPeriod});
	    
 		$("#savingPeriodLi").on("tap",function(){
 			document.activeElement.blur();
			savingPeriodPicker.show();		
			
		});       

        window.addEventListener("savingPeriod",function(event){
                var pickItem=event.detail;			
				savingPeriod=pickItem.value;
				$("#savingPeriod").html(pickItem.text);
				//查询利率
				var param={
					depositType:"01",
					savingPeriod:pickItem.value
				};
                rateSearch(param);
        });	

        function rateSearch( param ){
        	var url = mbank.getApiURL()+'002004_rateSearch.do';
		    mbank.apiSend("post",url,param,function(data){ 
		    	interestRate=data.interestRate;
		    	$("#interestRate").html(data.interestRate+"%");
		    },function(data){
		    	dealFail(data);
		    },true);        	
        }

        $("#saveTypeSwitch").on("toggle",function(event){
            if(event.detail.isActive){
            	transferSaveType="1";
            	$("#saveDaysLi").show();
            }else{
            	transferSaveType="0";
            	$("#saveDaysLi").hide();
            }
        });
  
        saveDaysPicker=new mui.SmartPicker({title:"请选择自动转存存期",fireEvent:"saveDays"});
        saveDaysPicker.setData(savingPeriodArray);
        transferSaveDays=savingPeriodArray[0].value;
        $("#saveDays").html(savingPeriodArray[0].text);
 		$("#saveDaysLi").on("tap",function(){
 			document.activeElement.blur();
			saveDaysPicker.show();		
			
		});    
  
        window.addEventListener("saveDays",function(event){
                var pickItem=event.detail;			
				transferSaveDays=pickItem.value;
				$("#saveDays").html(pickItem.text);

        });	
 
 		$("#amount").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#amount").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});  
  
        $("#confirmButton").on("tap",function(){
        	if( savingPeriod=="" ){
        		mui.alert("请选择存期！");
        		return false;
        	}
        	var amount=$("#amount").val();
        	var balanceAvailable=format.ignoreChar($("#balance").html(),",");
        	if( ""==amount ){
        		mui.alert("请输入需要转定期的金额！");
        		return false;
        	}else{
        		amount=format.ignoreChar(amount,',');
        		if( parseFloat(amount)<50 ){
        			mui.alert("定期账户最低起存金额为50元!");
        			return false;
        		}
        		if( parseFloat(amount)>parseFloat(balanceAvailable) ){
        			mui.alert("输入的金额超过可用余额，请重新输入!");
        			return false;
        		}
        	}
        	if( transferSaveType=="1" && transferSaveDays=="" ){
        		mui.alert("请选择本息自动转存存期！");
        		return false;
        	}
         	var params={
         		accountNo:self.accountNo,
         		balanceAvailable:balanceAvailable,
         		amount:amount,
         		depositType:"020",
         		currencyType:"01",
         		transferSaveType:transferSaveType,
         		savingPeriod:savingPeriod,
         		interestRate:interestRate,
         		transferSaveDays:transferSaveDays
         	};
        	var url = mbank.getApiURL()+'002004_demandToTimeConfirm.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../savings/demand2FixedConfirm.html','demand2FixedConfirm','slide-in-right',data);
		    }
		    function errorCallback(data){
		    	dealFail(data);
		    }  
        	
        });
        
 	    function dealFail(data){
 	    	mui.alert(data.em);
        }
        mbank.resizePage(".btn_bg_f2");
	});

});
