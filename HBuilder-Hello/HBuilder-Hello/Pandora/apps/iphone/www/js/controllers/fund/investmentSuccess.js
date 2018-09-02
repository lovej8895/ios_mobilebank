define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
    
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var changeFlagt = self.changeFlagt;		//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
		
		var	f_prodname = self.f_prodname;				//产品名称 -基金名称
		var	f_prodcode = self.f_prodcode;				//产品编号
		var	f_deposit_acct = self.f_deposit_acct;		//交易账号
		var	f_buyplanno = self.f_buyplanno;		//定投协议号
		var	f_opendate = self.f_opendate;				//定投日期 -签约日期
		//var	f_opendate = self.f_opendate;				//起始时间
		var	f_investcycle = self.f_investcycle;				//定投周期
		var	f_investday = self.f_investday;				//定投日期
		var	f_investcyclevalue = self.f_investcyclevalue;		//定投间隔
		var	f_investmode = self.f_investmode;		//定投模式
		var	f_investamount = self.f_investamount;				//定投金额
		var	f_continueinvestamount = self.f_continueinvestamount;				//后续投资金额
		var	f_investtime = self.f_investtime;		//终止条件
		var	f_investtimevalue = self.f_investtimevalue;		//终止条件值
				
		var	interestBeginDate = self.interestBeginDate;	//累计扣款次数
		var	interestEndDate = self.interestEndDate;		//累计交易金额
		var	yieldRate = self.yieldRate;					//交易渠道
		var	f_investstatus = self.f_investstatus;			//0-已撤销，1-正常，2-暂停；不返回已撤销的记录
				
		var	f_bank_cust_code = self.f_bank_cust_code;	//主机客户号
		var	f_b39perminamt = self.f_b39perminamt;	//每期定投起点
		var	f_b39permaxamt = self.f_b39permaxamt;	//每期定投上限
		
		var show_f_opendate;    
		var show_f_investcycle;  
		var show_f_investday;
		var show_f_investmode;
		var show_f_investtime;
		var f_unit = '月';
		
		if(changeFlagt == 1){//定投修改
			$("#title").html("基金定投修改");
			$("#showMsg").html("定投修改成功");
		}else if(changeFlagt == 2){//定投终止
			$("#title").html("基金定投");
			$("#noShowDetail").show();
			$("#msg").html("定投终止成功");
		}else if(changeFlagt == 5){//5-每月定额转入
			$("#title").html("每月定额转入");
			$("#s_f_investcycle").html("定投日期");
//			$("#li_f_investmode").hide();
			$("#showMsg").html("每月定额转入成功");
		}else{
			$("#title").html("基金定投");
			$("#showMsg").html("定投开通成功");
		}
//		$("#showDetail").show();
		if(changeFlagt != 2){
			$("#showDetail").show();
			
			if(f_investcycle == 1) {
//				show_f_investcycle = '每周';
				show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
				show_f_investday = '星期'+ jQuery.param.getDisplay('GET_NUBERTOCN', f_investday);
				f_unit = '周';
			} else {
//				show_f_investcycle = '每月';
				show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
				show_f_investday = f_investday + '日';
				f_unit = '月';
			}
				
			if(f_investmode == 1){
				show_f_investmode = '按递增金额扣款';
				$("#f_investamount_title").html("首次投资金额");
				$("#li_f_continueinvestamount").show();
				document.getElementById("f_continueinvestamount").innerHTML = format.formatMoney(f_continueinvestamount, 2) + "元";
			}else{
				show_f_investmode = '按后续投资金额不变';
				$("#f_investamount_title").html("定投金额");
				$("#li_f_continueinvestamount").hide();
			}
			if(f_investtime == 0){
				f_investtimevalue  = parseInt(f_investtimevalue);//成功扣款期数时，强制转换成整数型
				if(f_investtimevalue == 999999999){//成功扣款期数 且不为无限大时
					show_f_investtime = jQuery.param.getDisplay('SHOW_INVESTTIME', f_investtimevalue);
				}else{
					show_f_investtime = jQuery.param.getDisplay('SHOW_INVESTTIME', f_investtime) + f_investtimevalue + '期';
				}
			}else{
				show_f_investtime = jQuery.param.getDisplay('SHOW_INVESTTIME', f_investtime) + f_investtimevalue + '元';
			}
			
			document.getElementById("f_prodname_prodcode").innerHTML = f_prodname + '(' + f_prodcode + ')';
			document.getElementById("f_deposit_acct").innerHTML = format.dealAccountHideFour(f_deposit_acct);
			document.getElementById("f_investcycle").innerHTML = show_f_investcycle + show_f_investday;
	//		document.getElementById("f_investcyclevalue").innerHTML = f_investcyclevalue + f_unit;
//			document.getElementById("f_investmode").innerHTML = show_f_investmode;
			document.getElementById("f_investamount").innerHTML = format.formatMoney(f_investamount, 2) + "元";
			document.getElementById("f_investtime").innerHTML = show_f_investtime;
		}
		
		$("#butDiv").show();//显示按钮
		
		$("#lastButton").click(function(){
			mui.back();
	    });
	    //我的定投
		$("#myInvestment").click(function(){
//			plus.webview.hide(self);
			if(changeFlagt == 1){//定投修改
				mui.fire(plus.webview.getWebviewById("myInvestmentList"),"reload",{currentAcct : f_deposit_acct});//重新加载我的定投列表
				plus.webview.close(plus.webview.getWebviewById("investmentDetail"));
				plus.webview.close(plus.webview.getWebviewById("changeInvestment"));
				plus.webview.close(plus.webview.getWebviewById("investmentConfirm"));
				plus.webview.close(self);
			}else if(changeFlagt == 2){//定投终止
				mui.fire(plus.webview.getWebviewById("myInvestmentList"),"reload",{currentAcct : f_deposit_acct});//重新加载我的定投列表
				plus.webview.close(plus.webview.getWebviewById("investmentDetail"));
				plus.webview.close(plus.webview.getWebviewById("stopInvestment"));
				plus.webview.close(self);
			}else if(changeFlagt == 5){//每月定额转入
//				plus.webview.hide(self);
				//打开我的定投列表
				var params = {
					noCheck : false
				};
				mbank.openWindowByLoad('../fund/myInvestment.html','myInvestment','slide-in-right',params);
				setTimeout(function(){
					if(plus.webview.getWebviewById("fundProductDetail")){
						plus.webview.close(plus.webview.getWebviewById("fundProductDetail"));
					}
					if(plus.webview.getWebviewById("myHoldFundDetail")){
						plus.webview.close(plus.webview.getWebviewById("myHoldFundDetail"));
					}
					plus.webview.close(plus.webview.getWebviewById("investmentTransferMonthly"));
					plus.webview.close(plus.webview.getWebviewById("investmentConfirm"));
					plus.webview.close(self);
				},1000)
			}else{//定投开通
//				plus.webview.hide(self);
				//打开我的定投列表
				var params = {
					noCheck : false
				};
				mbank.openWindowByLoad('../fund/myInvestment.html','myInvestment','slide-in-right');
				setTimeout(function(){
					if(plus.webview.getWebviewById("fundProductDetail")){
						plus.webview.close(plus.webview.getWebviewById("fundProductDetail"));
					}
					if(plus.webview.getWebviewById("myHoldFundDetail")){
						plus.webview.close(plus.webview.getWebviewById("myHoldFundDetail"));
					}
					plus.webview.close(plus.webview.getWebviewById("changeInvestment"));
					plus.webview.close(plus.webview.getWebviewById("investmentConfirm"));
					plus.webview.close(self);
				},1000);
			}
			mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});
	    });
	    
	    mui.back=function(){
			var params  = {
				f_deposit_acct:f_deposit_acct,
				f_buyplanno:f_buyplanno
			};
			if(changeFlagt == 1){//定投修改
				mui.fire(plus.webview.getWebviewById("investmentDetail"),"reload",params);//重新加载我的定投详情
				mui.fire(plus.webview.getWebviewById("myInvestmentList"),"reload",{currentAcct : f_deposit_acct});//重新加载我的定投列表
				plus.webview.close(plus.webview.getWebviewById("changeInvestment"));
				plus.webview.close(plus.webview.getWebviewById("investmentConfirm"));
			}else if(changeFlagt == 2){//定投终止
				mui.fire(plus.webview.getWebviewById("investmentDetail"),"reload",params);//重新加载我的定投详情
				mui.fire(plus.webview.getWebviewById("myInvestmentList"),"reload",{currentAcct : f_deposit_acct});//重新加载我的定投列表
				plus.webview.close(plus.webview.getWebviewById("stopInvestment"));
			}else if(changeFlagt == 5){//每月定额转入
				mui.fire(plus.webview.getWebviewById("investmentDetail"),"reload",params);
				plus.webview.close(plus.webview.getWebviewById("investmentTransferMonthly"));
				plus.webview.close(plus.webview.getWebviewById("investmentConfirm"));
			}else{//定投开通
				plus.webview.close(plus.webview.getWebviewById("changeInvestment"));
				plus.webview.close(plus.webview.getWebviewById("investmentConfirm"));
			}
			plus.webview.close(self);
			mui.fire(plus.webview.getWebviewById("fundHome"), 'refreshTotalFund', {});
		}
	    
	    //查询广告是否为开启状态
		var url = mbank.getApiURL()+'adStateQuery.do';
		mbank.apiSend("post",url,{flag:'7'},stateQuerySuccess,null,true); 
		
		function stateQuerySuccess(data){
			//noteState 2代表开启状态 若开启则对广告显示
			if(data.noteState=='2'){
				var ranmdomNmu = Math.random();
		        $("#banner").load($.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_fund_result.html?t="+ ranmdomNmu);
				$("#banner").show();
			}
		}
	    
	    //广告
		/*var ranmdomNmu = Math.random();
        $("#banner").load($.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_fund_result.html?t="+ ranmdomNmu);
		$("#banner").show();*/
		jumPage=function (str){
			jumpOrShow(mbank,str);
		}
	});
});