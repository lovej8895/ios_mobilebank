define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
    var passwordUtil = require('../../core/passwordUtil');
    
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var f_cust_type = userInfo.get("customerType");//客户类型 00自助注册 01柜面签约
		var f_agent_name = userInfo.get("session_customerNameCN");//客户中文名称
		var f_agent_id_type = userInfo.get("session_certType");//证件类型
		var f_agent_id_code = userInfo.get("session_certNo");//证件号码
		
		var changeFlagt = self.changeFlagt;		//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
		//currentCode: 当前交易码,参考并完善$.param.TRANS_NAME+AUTH_FORMAT  requestParam: 上个页面的请求数据
		if(changeFlagt == 1){//定投修改
			$("#title").html("基金定投修改");
			commonSecurityUtil.initSecurityData('010402',self);
		}else if(changeFlagt == 5){//5-每月定额转入
			commonSecurityUtil.initSecurityData('010403',self);
			$("#title").html("每期定额转入");
			$("#p_title").html("每期定额转入信息");
			$("#s_f_investcycle").html("定投日期");
//			$("#li_f_investmode").hide();
		}else{//定投开通
			commonSecurityUtil.initSecurityData('010401',self);
		}
		var	f_prodname = self.f_prodname;				//产品名称 -基金名称
		var	f_prodcode = self.f_prodcode;				//产品编号
		var	f_deposit_acct = self.f_deposit_acct;		//交易账号
		var	f_tano = self.f_tano;		//TA代码
		var	f_buyplanno = self.f_buyplanno;		//定投协议号
		var	f_opendate = self.f_opendate;				//定投日期 -签约日期
	//	var	f_opendate = self.f_opendate;				//起始时间
		var	f_investcycle = self.f_investcycle;			//定投周期
		var	f_investday = self.f_investday;				//定投日期
		var	f_investcyclevalue = self.f_investcyclevalue;	//定投间隔
		var	f_forcebuyflag = self.f_forcebuyflag;	//强制购买标志
		var	f_buyplantype = self.f_buyplantype;	//定投类型
		var	f_investmode = self.f_investmode;		//定投模式
		var	f_investamount = self.f_investamount;	//定投金额
		var	f_continueinvestamount = self.f_continueinvestamount;		//后续投资金额
		var	f_investtime = self.f_investtime;		//终止条件
		var	f_investtimevalue = self.f_investtimevalue;		//终止条件值
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
		
		if(f_investcycle == 1) {
//			show_f_investcycle = '每周';
			show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
			show_f_investday = '星期'+ jQuery.param.getDisplay('GET_NUBERTOCN', f_investday);
			f_unit = '周';
		} else {
//			show_f_investcycle = '每月';
			show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
			show_f_investday = f_investday + '日';
			f_unit = '月';
		}
		
		if(f_investmode == 1) {
			show_f_investmode = '按递增金额扣款';
			$("#f_investamount_title").html("首次投资金额");
			$("#li_f_continueinvestamount").show();
			document.getElementById("f_continueinvestamount").innerHTML = format.formatMoney(f_continueinvestamount, 2) + "元";
		} else {
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
		//			document.getElementById("f_b39perminamt").innerHTML = format.formatMoney(f_b39perminamt, 2) + "元";
		//			document.getElementById("f_b39permaxamt").innerHTML = format.formatMoney(f_b39permaxamt, 2) + "元";
		
		document.getElementById("f_deposit_acct").innerHTML = format.dealAccountHideFour(f_deposit_acct);
		document.getElementById("f_investcycle").innerHTML = show_f_investcycle + show_f_investday;
//		document.getElementById("f_investcyclevalue").innerHTML = f_investcyclevalue + f_unit;
//		document.getElementById("f_investmode").innerHTML = show_f_investmode;
		document.getElementById("f_investamount").innerHTML = format.formatMoney(f_investamount, 2) + "元";
		document.getElementById("f_investtime").innerHTML = show_f_investtime;
        
		$("#lastButton").click(function(){
			mui.back();
	    });

	    //下一步
		$("#nextButton").click(function(){
			var params = "";
			var url = "";
			if(changeFlagt == 1){//定投修改
				params = {
					f_deposit_acct : f_deposit_acct,
					f_tano : f_tano,
					f_prodcode : f_prodcode,
					f_prodname : f_prodname,
					f_buyplanno : f_buyplanno,//定投协议号
					f_investmode : f_investmode,
					f_continueinvestamount : f_continueinvestamount,
					f_investamount : f_investamount,
					f_investday : f_investday,
					f_investtime : f_investtime,
					f_investtimevalue : f_investtimevalue,
					f_investcycle : f_investcycle,
					f_investcyclevalue : f_investcyclevalue,
					
					f_bank_cust_code : f_bank_cust_code,
					f_b39perminamt : f_b39perminamt,
					f_b39permaxamt : f_b39permaxamt,
					changeFlagt : changeFlagt,////定投修改标志
					noCheck : false
				};
			 	url = mbank.getApiURL()+'303061_aipModify.do';
			}else if(changeFlagt == 5){//5-每月定额转入
				params = {
					f_deposit_acct : f_deposit_acct,
					f_tano : f_tano,
					f_prodcode : f_prodcode,
					f_prodname : f_prodname,
					f_buyplanno : f_buyplanno,//定投协议号
					f_investmode : f_investmode,
					f_continueinvestamount : f_continueinvestamount,
					f_investamount : f_investamount,
					f_investday : f_investday,
					f_investtime : f_investtime,
					f_investtimevalue : f_investtimevalue,
					f_investcycle : f_investcycle,
					f_investcyclevalue : f_investcyclevalue,
					
					f_bank_cust_code : f_bank_cust_code,
					f_b39perminamt : f_b39perminamt,
					f_b39permaxamt : f_b39permaxamt,
					changeFlagt : changeFlagt,////定投修改标志
					noCheck : false
				};
			 	url = mbank.getApiURL()+'303061_aipModify.do';
			}else{
				params = {
					f_deposit_acct : f_deposit_acct,
					f_cust_type : "1",//客户类型 0-机构 1-个人
					f_tano : f_tano,
//					f_buyplanno : f_buyplanno,////定投开通没有定投协议号
					f_bank_cust_code : f_bank_cust_code,
					f_prodcode : f_prodcode,
					f_prodname : f_prodname,
					f_investday : f_investday,
					f_investamount : f_investamount,
					f_buyplantype : f_buyplantype,//定投类型
					f_investtime : f_investtime,
					f_investtimevalue : f_investtimevalue,
					f_investmode : f_investmode,
					f_continueinvestamount : f_continueinvestamount,//Y/N
					f_investcycle : f_investcycle,
					f_investcyclevalue : f_investcyclevalue,
					f_forcebuyflag : f_forcebuyflag,//强制购买标志 0-非强制购买 1-强制购买，送0  必填
					f_agent_name : "",//经办人姓名 柜面交易，机构必输  Y/N
					f_agent_id_type : "",//经办人证件类型 柜面交易，机构必输 Y/N
					f_agent_id_code : "",//经办人证件号 柜面交易，机构必输 Y/N
					
					f_b39perminamt : f_b39perminamt,
					f_b39permaxamt : f_b39permaxamt,
					changeFlagt : changeFlagt,//定投修改标识  0-定投 1-修改 2-停止
					noCheck : false
				};
			 	url = mbank.getApiURL()+'303060_aipOpen.do';
			}
//			mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,true);//密码校验
	    	function successCallback(data){
	    		console.log(JSON.stringify(data));
	    		if(changeFlagt){//定投修改
					var f_cust_name = data.f_cust_name;
		    		var f_id_type = data.f_id_type;
		    		var f_id_code = data.f_id_code;
		    		var f_prodname = data.f_prodname;
		    		var f_nextappdate = data.f_nextappdate;
	    			var f_transactiondate = data.f_transactiondate;
				}else{
					f_buyplanno = data.f_buyplanno;//定投开通返回定投协议号
				}
	    		
		       	mbank.openWindowByLoad('../fund/investmentSuccess.html','investmentSuccess','slide-in-right',params);
		    }
	    	function errorCallback(data){
		    	mui.alert(data.em);
		    } 		
	    });
	    
		mbank.resizePage(".btn_bg_f2");
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
	});
});