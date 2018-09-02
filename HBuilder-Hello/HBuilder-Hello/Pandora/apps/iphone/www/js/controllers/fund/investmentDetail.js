define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	
	var turnPageBeginPos = 1;
    var turnPageShowNum = 10;
    var turnPageTotalNum;
    
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var investment = [];
		var investment = self.investment;
		var f_prodname = investment.f_prodname;				//产品名称 -基金名称
		var f_prodcode = investment.f_prodcode;				//产品编号
		var f_deposit_acct = investment.f_deposit_acct;		//交易账号
		var f_buyplanno = investment.f_buyplanno;		//定投协议号
		var f_opendate = investment.f_opendate;				//定投日期 -签约日期
//		var f_opendate = investment.f_opendate;				//起始时间
		var f_investcycle = investment.f_investcycle;				//定投周期
		var f_investday = investment.f_investday;					//定投日期
		var f_investcyclevalue = investment.f_investcyclevalue;		//定投周期值 定投间隔
		var f_investmode = investment.f_investmode;				//定投模式
		var f_investamount = investment.f_investamount;				//定投金额
		var f_continueinvestamount = investment.f_continueinvestamount;				//后续投资金额
		var f_investtime = investment.f_investtime;		//终止条件
		var f_totalsucccount = investment.f_totalsucccount;	//累计扣款次数
		var f_totalsuccinvestamount = investment.f_totalsuccinvestamount;		//累计交易金额
		var f_acceptmethod = investment.f_acceptmethod;					//交易渠道
		var f_investstatus = investment.f_investstatus;			//0-已撤销，1-正常，2-暂停；不返回已撤销的记录
		var f_bank_cust_code = investment.f_bank_cust_code;	//主机客户号
		
		//展示定投详情
		function showDetail(){
			var show_f_opendate = format.formatDate(format.parseDate(f_opendate, "yyyymmdd"));
//			show_f_opendate = show_f_opendate.replaceAll("-", "/");//将所有"-",替换成"/" /g标识全文匹配
			//show_f_opendate = show_f_opendate.replace(/-/g, "/");//将所有"-",替换成"/" /g标识全文匹配
			
			var newDate = new Date(show_f_opendate);
			newDate = newDate.valueOf();
			var show_f_opendate_nextday = newDate + 1*24*60*60*1000;//后一天 --起始日期
			show_f_opendate_nextday = new Date(show_f_opendate_nextday);
			show_f_opendate_nextday = format.formatDate(show_f_opendate_nextday);
//			show_f_opendate_nextday = show_f_opendate_nextday.replace("-", "/").replace("-", "/");//将所有"-",替换成"/" /g标识全文匹配
			
			var show_f_investcycle;
			var show_f_investday;
			var show_f_investmode;
			var show_f_investtime;
			var show_f_acceptmethod = '';
					
			if(f_investcycle == 0){
//				show_f_investcycle = '每月';
				show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
				show_f_investday = f_investday + '日';
			}else{
//				show_f_investcycle = '每周';
				show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
				show_f_investday = '星期'+ jQuery.param.getDisplay('GET_NUBERTOCN', f_investday);
			}
			if(f_investmode == 0) {
				show_f_investmode = '按后续投资金额不变';
				$("#f_investamount_title").html("定投金额");
				$("#li_f_continueinvestamount").hide();
			} else {
				show_f_investmode = '按递增金额扣款';
				$("#f_investamount_title").html("首次投资金额");
				$("#li_f_continueinvestamount").show();
				document.getElementById("f_continueinvestamount").innerHTML = format.formatMoney(f_continueinvestamount, 2) + "元";
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
			//定投状态为正常时显示操作按钮
			if(f_investstatus == 1){
				$("#goModify").attr("disabled", false);
				$("#goStop").attr("disabled", false);
			}else{
				$("#goModify").attr("disabled", true);
				$("#goStop").attr("disabled", true);
			}
			//定投协议状态：0-已撤销，1-正常，2-暂停；
			var show_f_investstatus = "";
			if (f_investstatus == 0) {
				if ((f_investtime == 0 && parseInt(f_investtimevalue) <= parseInt(f_totalsucccount)) || (f_investtime == 1 && parseFloat(f_investtimevalue) <= parseFloat(f_totalsuccinvestamount))) {
					show_f_investstatus = "已终止";
				} else{
					show_f_investstatus = jQuery.param.getDisplay('INVEST_STATUS', f_investstatus);
				}
			} else{
				show_f_investstatus = jQuery.param.getDisplay('INVEST_STATUS', f_investstatus);
			}
			//交易渠道：1-银行柜台 2-网银 3-手机银行 4-直销柜台 5-移动营销 6-呼叫中心
			show_f_acceptmethod = jQuery.param.getDisplay('ACCEPT_METHOD', f_acceptmethod);
				
			document.getElementById("f_prodname_prodcode").innerHTML = f_prodname + '(' + f_prodcode + ')';
			document.getElementById("f_deposit_acct").innerHTML = format.dealAccountHideThree(f_deposit_acct);
			document.getElementById("f_investstatus").innerHTML = show_f_investstatus;
			document.getElementById("f_opendate").innerHTML = show_f_opendate;
			document.getElementById("f_opendate_nextday").innerHTML = show_f_opendate_nextday;
			document.getElementById("f_investcycle").innerHTML = show_f_investcycle+show_f_investday;
			document.getElementById("f_investamount").innerHTML = format.formatMoney(f_investamount, 2) + "元";
			document.getElementById("f_investtime").innerHTML = show_f_investtime;
			document.getElementById("f_totalsucccount").innerHTML = f_totalsucccount + '次';
			document.getElementById("f_totalsuccinvestamount").innerHTML = format.formatMoney(f_totalsuccinvestamount, 2) + "元";
			document.getElementById("f_acceptmethod").innerHTML = show_f_acceptmethod;
			
		}

		//定投修改或停止完成后返回刷新
		myInvestmentQuery = function(accountNo,buyplanno,turnPageBeginPos){
			plus.nativeUI.showWaiting("加载中...");//显示系统等待对话框
			var url = mbank.getApiURL()+'311009_aipProtocolQuery.do';
			var param={
				f_cust_type:"1",//客户类型cust_type 0-机构 1-个人
				f_deposit_acct:accountNo,//银行卡号deposit_acct
//				f_deposit_acct:"6230760000004556855",//银行卡号deposit_acct 6230760000004556855--可通
				f_buyplanno:buyplanno,//定投协议号--查询唯一一条定投信息
				turnPageBeginPos:turnPageBeginPos,
				turnPageShowNum:turnPageShowNum	
			}
			mbank.apiSend("post",url,param,successCallback,errorCallback,true);
	    	function successCallback(data){
		       var f_investmentList=data.f_investmentList;
		       turnPageTotalNum=data.turnPageTotalNum;
		       if( turnPageBeginPos==1 ){
		       	   investmentList=[];
		       	   if( turnPageTotalNum=='0' ){
		       	   		plus.nativeUI.closeWaiting();//关闭系统等待对话框
		       	       	mui.alert("找不到对应定投信息");
		       	   }
		       }
		       if( f_investmentList.length>0 ){
		           	investment=f_investmentList[0]; 
		           	
		           	f_prodname = investment.f_prodname;				//产品名称 -基金名称
					f_prodcode = investment.f_prodcode;				//产品编号
					f_deposit_acct = investment.f_deposit_acct;		//交易账号
				    f_opendate = investment.f_opendate;				//定投日期 -签约日期
			//		f_opendate = investment.f_opendate;				//起始时间
					f_investcycle = investment.f_investcycle;				//定投周期
					f_investday = investment.f_investday;					//定投日期
					f_investcyclevalue = investment.f_investcyclevalue;		//定投周期值 定投间隔
					f_investmode = investment.f_investmode;				//定投模式
					f_investamount = investment.f_investamount;				//定投金额
					f_continueinvestamount = investment.f_continueinvestamount;				//后续投资金额
					f_investtime = investment.f_investtime;		//终止条件
					f_investtimevalue = investment.f_investtimevalue;		//终止条件值
					f_totalsuccinvestamount = investment.f_totalsuccinvestamount;		//累计交易金额
					f_acceptmethod = investment.f_acceptmethod;					//交易渠道
					f_investstatus = investment.f_investstatus;			//0-已撤销，1-正常，2-暂停；不返回已撤销的记录
					f_bank_cust_code = investment.f_bank_cust_code;	//主机客户号
					
					showDetail();
					
			        plus.nativeUI.closeWaiting();
			    }
		    }
	    	function errorCallback(data){
		    	mui.alert(data.em);
		    } 			
		}
		
		//查看定投详情
//		showDetail();
		myInvestmentQuery(f_deposit_acct,f_buyplanno,1);//查看定投详情--调用接口
		
		//扣款明细任何状态都可查询--modify by 20170620 
		$("#goSearcheDetail").click(function(){
//			if(f_investstatus != 1){
//				mui.alert("定投处于暂停状态不可查询扣款明细");
//				return;
//			}

			var params = {
				f_deposit_acct : f_deposit_acct,
				f_bank_cust_code : f_bank_cust_code,
				f_buyplanno:f_buyplanno,//定投协议号--查询唯一一条定投信息
				f_prodcode : f_prodcode,
				f_prodname : f_prodname,
				f_businesscode : "39",//交易类型 用交易委托查询（311007）交易类型为“39 定期定额申购”
				noCheck : false
			};
			mbank.openWindowByLoad('../fund/cutPaymentDetail.html','cutPaymentDetail','slide-in-right',params);
	    });
		$("#goModify").click(function(){
			if(f_investstatus != 1){
				mui.alert("定投处于暂停状态不可进行修改定投");
				return;
			}
			var params = {
				investment : investment,
				changeFlagt : 1,//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
				noCheck : false
			};
			mbank.openWindowByLoad('../fund/changeInvestment.html','changeInvestment','slide-in-right',params);
//			var params = {
//				investment : investment,
//				changeFlagt : 5,//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
//				noCheck : false
//			};
//			mbank.openWindowByLoad('../fund/investmentTransferMonthly.html','investmentTransferMonthly','slide-in-right',params);
	    });
		$("#goStop").click(function(){
			if(f_investstatus != 1){
				mui.alert("定投处于暂停状态不可终止定投");
				return;
			}
			var params = {
				investment : investment,
				changeFlagt : 2,//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
				noCheck : false
			};
			mbank.openWindowByLoad('../fund/stopInvestment.html','stopInvestment','slide-in-right',params);
	    });
	    
	    window.addEventListener("reload", function(event) {
	    	f_deposit_acct = event.detail.f_deposit_acct;
	    	f_buyplanno = event.detail.f_buyplanno;
			myInvestmentQuery(f_deposit_acct,f_buyplanno,1);
		});
		
	});
});