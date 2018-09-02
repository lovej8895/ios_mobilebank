define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	
	var f_cust_type = userInfo.get("customerType");//客户类型 00自助注册 01柜面签约
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var investment = self.investment;
		var changeFlagt = self.changeFlagt;		//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
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
		var f_investtimevalue = investment.f_investtimevalue;		//终止条件
		var f_investstatus = investment.f_investstatus;			//0-已撤销，1-正常，2-暂停；不返回已撤销的记录
		var f_bank_cust_code = investment.f_bank_cust_code;	//主机客户号

		var show_f_opendate = format.formatDate(format.parseDate(f_opendate, "yyyymmdd"));
//		show_f_opendate = show_f_opendate.replaceAll("-", "/");//将所有"-",替换成"/" /g标识全文匹配
		show_f_opendate = show_f_opendate.replace("-", "年").replace("-","月") + "日";//将"-",替换成 “年月日”
//		show_f_opendate = show_f_opendate.substring(0,4) + '年' + show_f_opendate.substring(5,7) + '月' + show_f_opendate.substring(8,10) + '日';
		var show_f_investcycle;
		var show_f_investday;
		var show_f_investmode;
		var show_f_investtime;
		
		if(f_investcycle == 1) {
//			show_f_investcycle = '每周';
			show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
			show_f_investday = '星期'+ jQuery.param.getDisplay('GET_NUBERTOCN', f_investday);
		} else {
//			show_f_investcycle = '每月';
			show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
			show_f_investday = f_investday + '日';
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
		
		document.getElementById("f_prodname_prodcode").innerHTML = f_prodname + '(' + f_prodcode + ')';
		document.getElementById("f_deposit_acct").innerHTML = format.dealAccountHideFour(f_deposit_acct);
		document.getElementById("f_opendate").innerHTML = show_f_opendate;
		document.getElementById("f_investcycle").innerHTML = show_f_investcycle + show_f_investday;
//		document.getElementById("f_investcycle").innerHTML = show_f_investday;
		f_investamount = f_investamount.trim();
		document.getElementById("f_investamount").innerHTML = format.formatMoney(f_investamount, 2) + "元";
		document.getElementById("f_investtime").innerHTML = show_f_investtime;
		
		//定投状态为正常时显示操作按钮
		if(f_investstatus == 1){
			$(".btn_bg_f2").show();
		}
		
	    //确定下一步 定投终止
		$("#nextButton").click(function(){
			if(f_investstatus != 1){
				mui.alert("定投处于暂停状态不可终止定投");
				return;
			}
			var params = "";
			var url = "";
			params = {
				f_deposit_acct : f_deposit_acct,
				f_buyplanno : f_buyplanno,
				f_prodcode : f_prodcode,
				f_prodname : f_prodname,
				f_investamount : f_investamount,
				f_cust_type : "1",//客户类型cust_type 0-机构 1-个人
				f_bank_cust_code : f_bank_cust_code,
				f_operflag : "1",//1-终止（目前只允许定投终止）
				changeFlagt : changeFlagt,
				noCheck : false
			};
			url = mbank.getApiURL()+'303065_aipStopAndRecover.do';
			mui.confirm("您确认要终止该定投吗？","温馨提示",["确定", "取消"], function(e) {
				if (e.index == 0) {
					mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			    }
			});
	    	function successCallback(data){
				var f_cust_name = data.f_cust_name;
		    	var f_id_type = data.f_id_type;
		    	var f_id_code = data.f_id_code;
		    	var f_prodname = data.f_prodname;
		    	var f_nextappdate = data.f_nextappdate;
	    		var f_transactiondate = data.f_transactiondate;
	    		
		       	mbank.openWindowByLoad('../fund/investmentSuccess.html','investmentSuccess','slide-in-right',params);
		    }
	    	function errorCallback(data){
		    	mui.alert(data.em);
		    } 		
	    });
		
	});
});