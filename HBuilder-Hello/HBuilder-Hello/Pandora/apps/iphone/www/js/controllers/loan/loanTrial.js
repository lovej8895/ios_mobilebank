define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	//当前试算类型
	var currentTrialType = "";
	//当前还款周期
	var currentRepaymentCycle = "";
	//还款总期数
	var Repayconts;
	//期利率
	var loanInterestRate1;
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		currentTrialType = "1";
		$("#trialType").html("等额本息");
		currentRepaymentCycle = "1";
		$("#repaymentCycle").html("按月");
		
		mbank.resizePage(".btn_bg_f2");
		
		$("#principal").keyup(function() {
			if (this.value.length > 12) {
				this.value = this.value.substr(0, 12);
			}
		});
		
		//选择贷款试算类型
		var trialTypePicker = new mui.SmartPicker({title:"请选择贷款试算类型",fireEvent:"trialType"});
		trialTypePicker.setData([{
			value: '1',
			text: '等额本息'
		}, {
			value: '2',
			text: '等额本金'
		}, {
			value: '3',
			text: '一次性还本付息'
		}, {
			value: '4',
			text: '按月付息到期一次性还本'
		}]);
		
		$("#changeTrialType").on("tap",function(){
			document.activeElement.blur();
			trialTypePicker.show();
		});

        window.addEventListener("trialType",function(event){
            var param = event.detail;			
			currentTrialType = param.value;
			$("#trialType").html(param.text);
			if (currentTrialType == '3' || currentTrialType == '4') {
				currentRepaymentCycle = "1";
				$("#repaymentCycle").html("按月");
				$("#changeRepaymentCycle").hide();
				$("#repaymentCycleHidden").show();
			} else {
				$("#changeRepaymentCycle").show();
				$("#repaymentCycleHidden").hide();
			}
        });	
		
		//选择还款周期
		var repaymentCyclePicker = new mui.SmartPicker({title:"请选择还款周期",fireEvent:"repaymentCycle"});
		repaymentCyclePicker.setData([{
			value: '1',
			text: '按月'
		}, {
			value: '2',
			text: '按季'
		}, {
			value: '3',
			text: '按半年'
		}, {
			value: '4',
			text: '按年'
		}]);
		
		$("#changeRepaymentCycle").on("tap",function(){
			document.activeElement.blur();
			repaymentCyclePicker.show();
		});
		
		window.addEventListener("repaymentCycle",function(event){
            var param = event.detail;			
			currentRepaymentCycle = param.value;
			$("#repaymentCycle").html(param.text);
        });
		
		$("#trialButton").click(function(){
			var principal = format.ignoreChar($("#principal").val(),',');
	    	if ( "" == principal ) {
	    		mui.alert("请输入贷款本金！");
	    		$("#principal").focus();
	    		return false;
	    	}
	    	if( !isMoney(principal) || parseFloat(principal)<=0 ){
        		mui.alert("请输入正确的贷款本金！");
        		$("#principal").focus();
        		return false;
        	}
	    	if (parseFloat(principal) > 99999999.99) {
	    		mui.alert("贷款本金不能大于99999999.99元！");
	    		$("#principal").focus();
	    		return false;
	    	}
	    	var loanPeriod = $("#loanPeriod").val();
	    	if ( "" == loanPeriod ) {
	    		mui.alert("请输入贷款期限！");
	    		$("#loanPeriod").focus();
	    		return false;
	    	}
	    	if ( !isNumber(loanPeriod) || parseFloat(loanPeriod) <= 0 ) {
	    		mui.alert("请输入正确的贷款期限！");
	    		$("#loanPeriod").focus();
	    		return false;
	    	}
	    	if ( parseInt(loanPeriod) > 1200 ) {
	    		mui.alert("贷款期限不能大于100年！");
	    		$("#loanPeriod").focus();
	    		return false;
	    	}
	    	var loanRate = $("#loanRate").val();
	    	if ( "" == loanRate ) {
	    		mui.alert("请输入贷款年利率！");
	    		$("#loanRate").focus();
	    		return false;
	    	}
	    	if ( !isMoney(loanRate) || parseFloat(loanRate) <= 0 ) {
	    		mui.alert("请输入正确的贷款年利率！");
	    		$("#loanRate").focus();
	    		return false;
	    	}
	    	if (currentRepaymentCycle == "1") {
	    		loanInterestRate1 = parseFloat(loanRate) / 1200.0;
	    		Repayconts = loanPeriod;
	    	}
	    	if (currentRepaymentCycle == "2") {
	    		loanInterestRate1 = parseFloat(loanRate) / 400.0;
	    		Repayconts = parseInt(loanPeriod) / 3;
	    		if (parseInt(loanPeriod) % 3 != 0) {
					mui.alert("还款周期为每季度时，贷款期限必须是3的倍数！");
					return false;
				}
	    	}
	    	if (currentRepaymentCycle == "3") {
	    		loanInterestRate1 = parseFloat(loanRate) / 200.0;
	    		Repayconts = parseInt(loanPeriod) / 6;
	    		if (parseInt(loanPeriod) % 6 != 0) {
					mui.alert("还款周期为每半年时，贷款期限必须是6的倍数！");
					return false;
				}
	    	}
	    	if (currentRepaymentCycle == "4") {
	    		loanInterestRate1 = parseFloat(loanRate) / 100.0;
	    		Repayconts = parseInt(loanPeriod) / 12;
	    		if (parseInt(loanPeriod) % 12 != 0) {
					mui.alert("还款周期为每年时，贷款期限必须是12的倍数！");
					return false;
				}
	    	}
	    	
		    var params = {
	    		trialType : currentTrialType,
	    		Repayconts : Repayconts,
	    		loanInterestRate1 : loanInterestRate1,
	    		loanAmtBalance : principal,
	    		noCheck : false
	    	};
			mbank.openWindowByLoad('loanTrialResult.html','loanTrialResult','slide-in-right',params);
		});
		
		$("#principal").on("focus",function(){
		    $(this).attr('type', 'number');
		});
		
		$("#principal").on("blur",function(){
			$(this).attr('type', 'text');
		});
		
		$("#loanPeriod").on("focus",function(){
		    $(this).attr('type', 'number');
		});
		
		$("#loanPeriod").on("blur",function(){
			$(this).attr('type', 'text');
		});
		
		$("#loanRate").on("focus",function(){
		    $(this).attr('type', 'number');
		});
		
		$("#loanRate").on("blur",function(){
			$(this).attr('type', 'text');
		});
		
		$("#resetButton").click(function(){
			currentTrialType = "1";
			$("#trialType").html("等额本息");
			currentRepaymentCycle = "1";
			$("#repaymentCycle").html("按月");
			$("#changeRepaymentCycle").show();
			$("#repaymentCycleHidden").hide();
			$("#principal").val("");
			$("#loanPeriod").val("");
			$("#loanRate").val("");
		});
		
	});	
	
});