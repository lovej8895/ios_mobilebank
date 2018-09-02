define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var self = "";
	var accountNo = "";
	var productNo = "";
	var productName = "";
	var finanTransferVol = "";
	var finanTransferVolShow = "";
	var remainVol="";
	var minHold="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		accountNo = self.accountNo;
		productNo = self.productNo;
		productName = self.productName;
		finanTransferVol = parseFloat(self.finanTransferVol);
		finanTransferVolShow = format.formatMoney(finanTransferVol, 2);
		remainVol=self.remainVol;
		minHold=parseFloat(self.minHold);
		document.getElementById("productNo").innerHTML = productNo;
		document.getElementById("productName").innerHTML = productName;
		document.getElementById("finanTransferVol").innerHTML = finanTransferVolShow;
		document.getElementById("remainVol").innerHTML = format.formatMoney(remainVol,2);
		if(parseFloat(remainVol) == 0){
			document.getElementById("nextButton").setAttribute("disabled",true);
		}else{
			document.getElementById("nextButton").removeAttribute("disabled");
		}
		var rePayRem = '';
        document.getElementById("redemVol").addEventListener('input',function(){
        	var th = this.value;
        	var regExp = new RegExp(/\./i);
        	if(regExp.test(th)){
        		this.value = rePayRem;
        		return false;
        	}else{
        		rePayRem = this.value;
        	}
        })
		$("#nextButton").click(function(){
	    	var redemVol = $("#redemVol").val();
	    	redemVol=format.removeComma(redemVol);
	    	var redemFlag=$("input[name='redemFlag']:checked").val();
	    	if( redemVol == "" ){
	    		mui.alert("请输入正确的赎回份额！");
	    		$("#redemVol").focus();
	    		return false;
	    	}
	    	if (parseFloat(redemVol) <= 0) {
	    		mui.alert("赎回份额不能小于或等于0！");
	    		$("#redemVol").focus();
	    		return false;
	    	}
	    	if ((parseFloat(redemVol) > 50000) && redemFlag == "1") {
	    		mui.alert("单日累计快速赎回份额不能大于50000。"); 
	    		$("#redemVol").focus();
	    		return false;
	    	}
	    	if(parseFloat(redemVol) > remainVol){
	    		mui.alert("您的可赎回份额不足。");
	    		$("#redemVol").focus();
	    		return false;

	    	}
	    	var remainVal=remainVol-parseFloat(redemVol);
	    	if( remainVal < minHold &&  remainVal !=0){
	    		mui.alert("最低持有金额不能少于"+ minHold +"元，您可选择全部赎回。");
	    		$("#redemVol").focus();
	    		return false;
	    	}
	    	var params = {
	    		payAccount : accountNo,
	    		productNo : productNo,
		        productName : productName,
		        finanTransferVol : finanTransferVol,
		        redemVol : redemVol,
	    		noCheck : false,
	    		flag:redemFlag
	    	};
			mbank.openWindowByLoad('productRedemConfirm.html','productRedemConfirm','slide-in-right',params);
	    });
	    
	    
	     $("input[name='redemFlag']").on("change",function(){
            var redemFlag=$("input[name='redemFlag']:checked").val();
            redemFlag=format.removeComma(redemFlag);
            if( redemFlag=="0" ){
            	$("#allSwitchLi").show();
            }else{
              	$("#allSwitchLi").hide();
              	document.getElementById("redemVol").value= "";
           		 if( $("#bookSwitch").hasClass("mui-active") ){
            		document.getElementById("bookSwitch").classList.remove('mui-active');
            		jQuery("#handle").css({
						"transition-duration": "0.2s",
						"transform": "translate(0px,0px)"
					});
            	}
           	}
        });
        
        $("#redemVol").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#redemVol").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
        
        $("#bookSwitch").on("toggle",function(){
			if(event.detail.isActive){
				document.getElementById("redemVol").value = remainVol;
			}else{
				document.getElementById("redemVol").value= "";
			}			
       }); 
 	 mbank.resizePage(".btn_bg_f2");
		
	});
});