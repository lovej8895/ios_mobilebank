define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	var currentAcct="";
	var accountPickerList=[];
    var accountPicker;
    var f_prodcode='';//产品代码
    var f_prodname='';//产品名称
    var f_prodtype='';//产品类型
    var f_status =1;//产品状态 0：可转入，可转出 1：只可转入 2：只可转出 3：不可转换
	var f_risklevel='01';//风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
    var f_tano='';
//  var f_cust_risk='';
//  var endDate ='';
    
    var cst_certNo = localStorage.getItem("session_certNo");//证件号码
    
	mui.init();
	mui.plusReady(function() {		
		plus.screen.lockOrientation("portrait-primary");//竖屏
		var self = plus.webview.currentWebview();
//		f_cust_risk = self.f_cust_risk;
		currentAcct = self.f_deposit_acct;
		f_tano = self.f_tano;
		f_prodtype = self.f_prodtype;
//		endDate = self.f_risk_end_date;
		f_prodname = self.f_prodname;
		f_prodcode = self.f_prodcode;
		$("#accountNo").html(format.dealAccountHideFour(currentAcct));
		$("#prodName").html(f_prodname+"("+f_prodcode+")");
		queryBalance(currentAcct);
		
		function queryBalance(currentAcct){
			myAcctInfo.getAccBalance(currentAcct,"true",function(data){
				$("#balance").html(format.formatMoney(data.balanceAvailable)+"元");
			});
		}
		
		//点击下一步按钮
		document.getElementById("nextBtn").addEventListener('tap',function(){
			var buyAmount=$("#buyAmount").val();
            if( ""==buyAmount ){
            	mui.alert("请输入购买金额！");
            	return false;
            }else{
            	buyAmount=format.ignoreChar($("#buyAmount").val(),',');
            	var balance=format.ignoreChar($("#balance").html(),',');
            	if( !isMoney(buyAmount) || parseFloat(buyAmount)<=0 ){
            		mui.alert("请输入正确的购买金额！");
            		return false;
            	}
            	if( parseFloat(buyAmount)>(parseFloat(balance))){
            		mui.alert("可用余额不足!");
            		return false;
            	}
            }
            var fianceManagerCode = $("#fianceManagerCode").val();
            fianceManagerCode = fianceManagerCode.trim();
            if(""!=fianceManagerCode){
	            if(numCheck(fianceManagerCode)||fianceManagerCode<0||fianceManagerCode.length>11){
					mui.alert("请输入不超过11位整数的理财经理代码");
					return;
				}
            }
			
			var params = {
        		f_deposit_acct :currentAcct,
        		f_prodcode : f_prodcode,
        		f_prodtype : f_prodtype,
        		f_prodname : f_prodname,
        		buyAmount : buyAmount,
        		payAmount : buyAmount,
        		f_tano : f_tano,
        		fianceManagerCode : $("#fianceManagerCode").val()
        	}
            mbank.openWindowByLoad("../fund/cashTransferIntoConfirm.html","cashTransferIntoConfirm", "slide-in-right",params);
		});
		//检查数字
		function numCheck(num){
			var reg = new RegExp("^[0-9]*$");
			if(reg.test(num)){
				return false;
			}
			return true;
		}
		//格式化金额
        $("#buyAmount").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#buyAmount").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});

		function riskshow(){
			var params = {
        		accountNo:currentAcct
        	}
            mbank.openWindowByLoad("../fund/fundRiskAssessment.html","fundRiskAssessment", "slide-in-right",params);
		}
		mbank.resizePage(".btn_bg_f2");
	});
});