define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	
	//绑定账号列表
    var iAccountInfoList = [];
    var accountPickerList = [];
    var accountPicker;
    
    var currentAcct = '';//当前选定账号
    var accountStat = '';////当前选定账号 状态
//  var cst_certNo = userInfo.get("session_certNo");//证件号码
    
    var fundDetailMarke = false;//获取产品信息成功标识 true为成功
    var fundDetailMsg = '未获取到产品信息';
    var custDetailMarke = false;//获取签约客户信息成功标识 true为成功
    var custDetailMsg = '未获取到签约客户信息';
    
    var f_status =1;//产品状态 0：可转入，可转出 1：只可转入 2：只可转出 3：不可转换
	var f_buyplanflag=1;//是否可定投 0：否，1：是
	var f_risklevel='01';//基金风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
	
	var f_sign_status;//客户签约状态--0-未签约 1-已签约 2-签约失败 3-解约失败 4-已解约
	var f_risk_end_date;//客户风险评级有效日期
	var f_open_busin;//基金系统签约标识 默认值为3
	var f_cust_risk;//客户风险等级 01保守型 02安稳型 03稳健型 04成长型 05积极型
	var f_cust_status;//客户状态 0:正常，1：销户
	var f_telno;//联系电话 机构客户的联系电话
	var f_mobile_telno;//手机号码 个人客户的联系电话
	var f_id_type;//证件类型
	var f_id_code;//证件号码
	var f_cust_type;//客户类型
	var f_cust_name;//客户名称
					
    
	var f_prodname;				//产品名称 -基金名称
	var f_prodcode;				//产品编号
	var f_prodtype = "";				//产品类型
	
	var f_deposit_acct = "";		//交易账号
	var f_tano;		//TA代码
	var f_buyplanno;		//定投协议号
	var f_opendate;				//定投日期 -签约日期
	var f_investcycle;				//定投周期
	var f_investday;				//定投日期
	var f_investcyclevalue=1;		//定投间隔 默认为1
	var f_investmode;		//定投模式
	var f_investamount = "";				//定投金额
	var f_continueinvestamount ="";				//后续投资金额
	var f_investtime;		//终止条件
	var f_investtimevalue="";		//终止条件值
	var f_investstatus;			//0-已撤销，1-正常，2-暂停；不返回已撤销的记录
	var f_bank_cust_code;	//主机客户号
	var f_b39perminamt = "";	//每期定投起点
	var f_b39stepunit = "";	//定投交易级差
	var f_b39permaxamt = "";	//每期定投上限
	var	f_forcebuyflag=0;	////强制购买标志 0-非强制购买 1-强制购买，送0  必填
	var	f_buyplantype=1;	//定投类型 1 普通定投
			
	var show_f_opendate;    
	var show_f_investcycle;  
	var show_f_investday;
	var show_f_investmode;
	var show_f_investtime;
    
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var changeFlagt = self.changeFlagt;		//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
		if(changeFlagt == 1){//定投修改
			var investment = self.investment;
			f_prodname = investment.f_prodname;				//产品名称 -基金名称
			f_prodcode = investment.f_prodcode;				//产品编号
			f_deposit_acct = investment.f_deposit_acct;		//交易账号
			f_tano = investment.f_tano;		//TA代码
			f_buyplanno = investment.f_buyplanno;		//定投协议号
			f_opendate = investment.f_opendate;				//定投日期 -签约日期
			f_investcycle = investment.f_investcycle;				//定投周期
			f_investday = investment.f_investday;				//定投日期
			f_investcyclevalue = investment.f_investcyclevalue;		//定投间隔
			f_investmode = investment.f_investmode;		//定投模式
			f_investamount = investment.f_investamount;				//定投金额
			f_continueinvestamount = investment.f_continueinvestamount;				//后续投资金额
			f_investtime = investment.f_investtime;		//终止条件
			f_investtimevalue = investment.f_investtimevalue;		//终止条件值
			f_investstatus = investment.f_investstatus;			//0-已撤销，1-正常，2-暂停；不返回已撤销的记录
			
			f_bank_cust_code = investment.f_bank_cust_code;	//主机客户号
			f_forcebuyflag = investment.f_forcebuyflag;	//强制购买标志
		    f_buyplantype = investment.f_buyplantype;	//定投类型
			
			$("#title").html("基金定投修改");
			$("#nextButton").html("修&nbsp;&nbsp;&nbsp;改");
			
		}else{//定投开通
			f_prodcode = self.f_prodcode;				//产品编号
			f_prodtype = self.f_prodtype;				//产品类型
			f_tano = self.f_tano;				//产品编号
			$("#title").html("基金定投");
			$("#nextButton").html("下一步");
		}
		
		queryDefaultAcct();//获取绑定账号列表
		
		//获取产品信息
		function searchFundDetail(){
			params = {
				"liana_notCheckUrl" : false,
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				"f_prodcode" : f_prodcode,
				"f_tano" : f_tano,
				"f_prodtype" : f_prodtype,//
				"f_cust_type" : "1"
			};
			urlVar = mbank.getApiURL()+'fund_ProductSearch.do';
			mbank.apiSend("post",urlVar,params,searchFundDetailSuc,searchFundDetailFail,false);
			function searchFundDetailSuc(data){
				if(data.ec == "000"){
					if(data.f_iProductInfo.length > 0){
						f_prodname = data.f_iProductInfo[0].f_prodname;
						f_status = data.f_iProductInfo[0].f_status;//产品状态 0：可转入，可转出 1：只可转入 2：只可转出 3：不可转换
						f_buyplanflag = data.f_iProductInfo[0].f_buyplanflag;//是否可定投 0：否，1：是
						f_risklevel = data.f_iProductInfo[0].f_risklevel;//风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
						
						f_b39perminamt = data.f_iProductInfo[0].f_b39perminamt;//每期定投起点
						f_b39stepunit = data.f_iProductInfo[0].f_b39stepunit;//定投交易级差
						f_b39permaxamt = data.f_iProductInfo[0].f_b39permaxamt;//每期定投上限
						
						fundDetailMarke = true;
						showDetail();//展示详情
					}else{
						fundDetailMarke = false;
						mui.alert(fundDetailMsg);
					}
				}else{
					fundDetailMarke = false;
					mui.alert(data.em);
				}
			}
			function searchFundDetailFail(e){
				mui.alert(e.em);
			}
		}
		
		function showDetail(){
			if(f_investcycle == 0){
//				show_f_investcycle = '月';
				show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
				show_f_investday = f_investday + '日';
//				document.getElementById("f_investcyclevalue").value = f_investcyclevalue;
//				$("#f_unit").html('月');
			}else if(f_investcycle == 1){
//				show_f_investcycle = '周';
				show_f_investcycle = jQuery.param.getDisplay('SHOW_INVEST_CYCLE_MODE', f_investcycle + f_investcyclevalue);
				show_f_investday = '星期'+ jQuery.param.getDisplay('GET_NUBERTOCN', f_investday);
//				document.getElementById("f_investcyclevalue").value = f_investcyclevalue;
//				$("#f_unit").html('周');
			}else{
				show_f_investcycle = '请选择';
				show_f_investday = '请选择';
				f_investcycle = '';
				f_investday = '';
//				$("#f_unit").html('月');
			}
			f_investmode = 0;//定投模式固定上送为0  按后续投资金额不变	
			if(f_investmode == 0){
				show_f_investmode = '按后续投资金额不变';
				$("#f_investamount_title").html("定投金额");
//				$("#li_f_continueinvestamount").hide();
			}
//			else if(f_investmode == 1){
//				show_f_investmode = '按递增金额扣款';
//				$("#f_investamount_title").html("初次融资金额");
//				$("#li_f_continueinvestamount").show();
//				document.getElementById("f_continueinvestamount").value = format.formatMoney(f_continueinvestamount, 2);
//			}else{
//				show_f_investmode = '请选择';
//				f_investmode = '';
//				$("#f_investamount_title").html("定投金额");
//				$("#li_f_continueinvestamount").hide();
//			}
				
			if(f_investtime == 0){
				f_investtimevalue  = parseInt(f_investtimevalue);//成功扣款期数时，强制转换成整数型
				if(f_investtimevalue == 999999999){//成功扣款期数 且不为无限大时
					show_f_investtime = jQuery.param.getDisplay('SHOW_INVESTTIME', f_investtimevalue);
					$("#li_successNumberValue").hide();
				}else{
					show_f_investtime = jQuery.param.getDisplay('SHOW_INVESTTIME', f_investtime);
					$("#li_successNumberValue").show();
	//				f_investtimevalue  = f_investtimevalue/1;//成功扣款期数时，强制转换成整数型
					document.getElementById("successNumberValue").value = f_investtimevalue;
				}
				$("#li_allMoneyvalue").hide();
			}else if(f_investtime == 1){
				show_f_investtime = jQuery.param.getDisplay('SHOW_INVESTTIME', f_investtime);
				$("#li_successNumberValue").hide();
				$("#li_allMoneyvalue").show();
				document.getElementById("allMoneyvalue").value = format.formatMoney(f_investtimevalue, 2);
			}else{
				show_f_investtime = '请选择';
				f_investtime = '';
				$("#li_successNumberValue").hide();
				$("#li_allMoneyvalue").hide();
			}
			
			document.getElementById("f_prodname_prodcode").innerHTML = f_prodname + '(' + f_prodcode + ')';
			document.getElementById("f_b39perminamt").innerHTML = format.formatMoney(f_b39perminamt, 2) + "元";
//			document.getElementById("f_b39permaxamt").innerHTML = format.formatMoney(f_b39permaxamt, 2) + "元";
			document.getElementById("f_investcycle").innerHTML = show_f_investcycle;
			document.getElementById("f_investday").innerHTML = show_f_investday;
//			document.getElementById("f_investmode").innerHTML = show_f_investmode;
			document.getElementById("f_investtime").innerHTML = show_f_investtime;
		}
		
		
		//获取绑定账号列表及默认账号
		function queryDefaultAcct() {
			if(changeFlagt == 1){//定投修改
				currentAcct = f_deposit_acct;
				$("#li_f_deposit_acct").show();
				$("#f_deposit_acct").html(format.dealAccountHideFour(f_deposit_acct));
				$("#f_investamount").val(format.formatMoney(f_investamount, 2));
				
				qureyBalance();//查询账户余额
				searchFundDetail();//发送接口获取产品信息
			}else{
				mbank.getAllAccountInfo(allAccCallBack,2);
				function allAccCallBack(data) {
					iAccountInfoList = data;
					getPickerList(iAccountInfoList);
					//设置默认账号
					var length = iAccountInfoList.length;
					if(length > 0) {
						currentAcct = iAccountInfoList[0].accountNo;
						console.log(currentAcct);
						$("#currentAcct").html(format.dealAccountHideFour(currentAcct));
						$("#changeAccount").show();
						
						qureyBalance();//查询账户余额
						searchFundDetail();//发送接口获取产品信息
					}
				}
			}
		}
		//查询账户余额
        function qureyBalance(){
			myAcctInfo.getAccBalance(currentAcct,"true",function(data){
//			myAcctInfo.getAccBalance("621270000000001244","true",function(data){
				$("#balance").html(format.formatMoney(data.balanceAvailable)+'元');
				//账号状态
				accountStat = data.accountStat;
			});			
		}
		//获取账号列表
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value: i,
						text: format.dealAccountHideFour(account.accountNo)//带****格式化账号
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"pickAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();//显示账号选择下拉框	
		});	
		//选择账号触发事件
        window.addEventListener("pickAccount",function(event){
                var pickItem=event.detail;			
				currentAcct=iAccountInfoList[pickItem.value].accountNo;
				$("#f_deposit_acct").html(format.dealAccountHideFour(currentAcct));
				qureyBalance();//查询账户余额
        });	
        //获取定投时间列表
		var investdayMonthList = jQuery.param.getParams("INVESTDAY_MONTH");
		var investdayWeekList = jQuery.param.getParams("INVESTDAY_WEEK");
		var investdayMonthPicker = new mui.SmartPicker({title:"请选择定投时间",fireEvent:"pickInvestdayMonth"});
	    investdayMonthPicker.setData(investdayMonthList);
		var investdayWeekPicker = new mui.SmartPicker({title:"请选择定投时间",fireEvent:"pickInvestdayWeek"});
	    investdayWeekPicker.setData(investdayWeekList);
	    
		//获取定投周期列表
//		var investcycleList = jQuery.param.getParams("INVEST_CYCLE");
		var investcycleList = jQuery.param.getParams("INVEST_CYCLE_MODE");//定投周期与间隔合并一个下拉框
		var investcyclePicker = new mui.SmartPicker({title:"请选择定投周期",fireEvent:"pickInvestcycle"});
	    investcyclePicker.setData(investcycleList);
	    //显示定投周期选择下拉框	
		$("#changeInvestcycle").on("tap",function(){
			document.activeElement.blur();
			investcyclePicker.show();
		});	
		//选择定投周期触发事件
        window.addEventListener("pickInvestcycle",function(event){
                var pickItem=event.detail;	
                if(pickItem.value == ""){
					f_investcycle = "";
					f_investcyclevalue = 1;
				}else{
					f_investcycle = pickItem.value.substring(0,1);//得到定投周期
					f_investcyclevalue = pickItem.value.substring(1,2);//得到定投间隔
				}
				$("#f_investcycle").html(pickItem.text);
				if (f_investcycle == 0) {
					investdayMonthPicker.setData(investdayMonthList);
					$("#f_investday").html('1日');
//					$("#f_unit").html('月');
					f_investday = "1";
				}else if(f_investcycle == 1){
					investdayWeekPicker.setData(investdayWeekList);
					$("#f_investday").html('星期一');
//					$("#f_unit").html('周');
					f_investday = "1";
				}else{
					investdayMonthPicker.setData(investdayMonthList);
					$("#f_investday").html('请选择');
//					$("#f_unit").html('月');
					f_investday = "";
				}
        });	
        
		//显示定投时间选择下拉框	
		$("#changeInvestday").on("tap",function(){
			document.activeElement.blur();
			if (f_investcycle == 0) {
				investdayMonthPicker.show();
			} else if(f_investcycle == 1){
				investdayWeekPicker.show();
			} else{
				investdayMonthPicker.show();
			}
		});	
		//选择定投时间触发事件-月
        window.addEventListener("pickInvestdayMonth",function(event){
            var pickItem=event.detail;	
			$("#f_investday").html(pickItem.text);
			if(pickItem.value == ""){
				f_investday = "";
			}else{
				f_investday = pickItem.value;
			}
        });	
		//选择定投时间触发事件-周
        window.addEventListener("pickInvestdayWeek",function(event){
            var pickItem=event.detail;	
			$("#f_investday").html(pickItem.text);
			if(pickItem.value == ""){
				f_investday = "";
			}else{
				f_investday = pickItem.value;
			}
        });
        
		//获取定投模式列表
//		var investmodeList = jQuery.param.getParams("INVESTMODE");
//		var investmodePicker = new mui.SmartPicker({title:"请选择定投模式",fireEvent:"pickInvestmode"});
//	    investmodePicker.setData(investmodeList);
//		//显示定投模式选择下拉框	
//		$("#changeInvestmode").on("tap",function(){
//			document.activeElement.blur();
//			investmodePicker.show();
//		});	
//		//选择定投模式触发事件
//      window.addEventListener("pickInvestmode",function(event){
//              var pickItem=event.detail;	
//              if(pickItem.value == ""){
//					f_investmode = "";
//				}else{
//					f_investmode = pickItem.value;
//				}
//				$("#f_investmode").html(pickItem.text);
//				if(pickItem.value == 0){
//					$("#f_investamount_title").html("定投金额");
//					$("#li_f_continueinvestamount").hide();
//				}else if(pickItem.value == 1){
//					$("#f_investamount_title").html("初次融资金额");
//					$("#li_f_continueinvestamount").show();
//				}else{
//					$("#f_investamount_title").html("定投金额");
//					$("#li_f_continueinvestamount").hide();
//				}
//      });	
        
        //获取终止条件列表
		var investtimeList = jQuery.param.getParams("INVESTTIME");
		var investtimePicker = new mui.SmartPicker({title:"请选择终止条件",fireEvent:"pickInvesttime"});
	    investtimePicker.setData(investtimeList);
		$("#changeInvesttime").on("tap",function(){
			document.activeElement.blur();
			//显示终止条件选择下拉框	
			investtimePicker.show();
		});	
		//选择终止条件触发事件
        window.addEventListener("pickInvesttime",function(event){
            var pickItem=event.detail;	
			$("#f_investtime").html(pickItem.text);
			f_investtime = pickItem.value;
			if(pickItem.value == 999999999){
				f_investtime = '0';//99表示无 但实际还会是成功扣款期数
				f_investtimevalue = 999999999;//表示无限大
				$("#li_successNumberValue").hide();
				$("#li_allMoneyvalue").hide();
			}else if(pickItem.value == 0){
				f_investtimevalue = "";//清空
				$("#li_successNumberValue").show();
				$("#li_allMoneyvalue").hide();
			}else if(pickItem.value == 1){
				f_investtimevalue = "";//清空
				$("#li_successNumberValue").hide();
				$("#li_allMoneyvalue").show();
			}else{
				f_investtimevalue = "";//清空
				$("#li_successNumberValue").show();
				$("#li_allMoneyvalue").hide();
			}
        });	
        
        //定投间隔输入时
//      $("#f_investcyclevalue").on("focus",function(){
//		    $(this).attr('type', 'number');
//		}); 
//		$("#f_investcyclevalue").on("blur",function(){
//			$(this).attr('type', 'text');
//		});
//      //成功扣款期数输入时
//      $("#successNumberValue").on("focus",function(){
//		    $(this).attr('type', 'number');
//		}); 
//		$("#successNumberValue").on("blur",function(){
//			$(this).attr('type', 'text');
//		});
        //格式化金额
        $("#f_investamount").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#f_investamount").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
//      $("#f_continueinvestamount").on("focus",function(){
//			if($(this).val()){
//			  	$(this).val(format.ignoreChar($(this).val(),','));
//			}
//		    $(this).attr('type', 'number');
//		}); 
//		$("#f_continueinvestamount").on("blur",function(){
//			$(this).attr('type', 'text');
//			if($(this).val()){
//				$(this).val(format.formatMoney($(this).val(),2));
//			}
//		});
        $("#allMoneyvalue").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#allMoneyvalue").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
        
        function numCheck(num){
			var reg = new RegExp("^[0-9]*$");
			if(reg.test(num)){
				return false;
			}
			return true;
		}
        
        //去签约
        function toSign(){
        	var params = {
				f_deposit_acct : currentAcct,
				noCheck : false
			};
			mbank.openWindowByLoad('../fund/fundCustomerSign_Input.html','fundCustomerSign_Input','slide-in-right',params);
        }
        
        //去风险评估
        function toTest(){
        	var params = {
				accountNo : currentAcct,
				noCheck : false
			};
			mbank.openWindowByLoad('../fund/fundRiskAssessment.html','fundRiskAssessment','slide-in-right',params);
        }
        
		//下一步
		$("#nextButton").click(function(){
//			currentAcct = "6230760000004556855";
			if(!fundDetailMarke){//校验产品信息是否查询成功
				mui.alert(fundDetailMsg);
				return;
			}
			
			f_investmode = 0;//定投模式固定上送为0  按后续投资金额不变
			
			//查询签约客户信息
			var custParams ={
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				f_deposit_acct:currentAcct,//银行结算账号/卡号/折号 --查单条时传，非单条时不传	
//				f_deposit_acct:'6230760000004556855',//银行结算账号/卡号/折号 --查单条时传，非单条时不传	
				f_cust_type:"1"
			};
			var url = mbank.getApiURL() + 'queryCustSignInfo.do';
			mbank.apiSend("post",url,custParams,successCallback,errorCallback,false);
			function successCallback(data){
				if(data.f_iCustSignInfoList.length > 0){
					var currObj = data.f_iCustSignInfoList[0];
					f_sign_status = currObj.f_sign_status;//客户签约状态--0-未签约 1-已签约 2-签约失败 3-解约失败 4-已解约
					f_risk_end_date = currObj.f_risk_end_date;//客户风险评级有效日期
					f_open_busin = currObj.f_open_busin;//基金系统签约标识 默认值为3
					f_cust_risk = currObj.f_cust_risk;//客户风险等级 01保守型 02安稳型 03稳健型 04成长型 05积极型
					f_cust_status = currObj.f_cust_status;//客户状态 0:正常，1：销户
					f_telno = currObj.f_telno;//联系电话 机构客户的联系电话
					f_mobile_telno = currObj.f_mobile_telno;//手机号码 个人客户的联系电话
					f_id_type = currObj.f_id_type;//证件类型
					f_id_code = currObj.f_id_code;//证件号码
					f_cust_type = currObj.f_cust_type;//客户类型
					f_cust_name = currObj.f_cust_name;//客户名称
					
					if(changeFlagt == 1 && f_investstatus != 1){
						mui.alert("定投处于暂停状态不可定投修改");
						return;
					}
					if(f_cust_status != 0){//客户状态 0:正常，1：销户
						if(changeFlagt == 1){
							mui.alert("您的基金账户已销户不可进行定投修改");
						}else{
							mui.alert("您的基金账户已销户不可进行定投");
						}
						return;
					}
					if(f_buyplanflag != 1){//是否可定投 0：否，1：是
						if(changeFlagt == 1){
//							mui.alert("此基金不可定投修改");//经确认 定投修改或终止时可以通过--modify by 20170620
						}else{
							mui.alert("此基金不可定投");
							return;
						}
					}
					
					//账号状态是否正常 校验
					/*if (accountStat!='0' && accountStat!='2') {
						mui.confirm("账户状态异常,是否前往签约？","温馨提示",["确定", "取消"], function(e) {
							if (e.index == 0) {
								toSign();
					        }
					  	});
					  	return;
					}*/
					
					//是否签约 校验 
					if((f_sign_status != '1' && f_sign_status != '3')||(f_open_busin!='3')){//客户签约状态--0-未签约 1-已签约 2-签约失败 3-解约失败 4-已解约
						mui.confirm("您尚未签约基金系统，是否前往签约？","温馨提示",["确定", "取消"], function(e) {
							if (e.index == 0) {
								toSign();
					        }
					  	});
					  	return;
					}
					
					//是否做过风险等级评估 校验
					f_cust_risk = f_cust_risk.trim();//去除空格
					if(f_cust_risk == "" ||f_cust_risk == "null"|| f_cust_risk == null || f_cust_risk == undefined ){
						mui.confirm("您尚未进行风险评估,是否进行风险评估？","温馨提示",["确定", "取消"], function(e) {
							if (e.index == 0) {
								toTest();
					        }
					  	});
					  	return;
					}
					var currentDate = new Date();
					var nowDate = format.formatDate(currentDate);
					nowDate = nowDate.replace("-","").replace("-","");
					//风险等级评估过期 校验
					if(f_risk_end_date < nowDate){//var f_risk_end_date;//客户风险评级有效日期
						mui.confirm("您的风险评估已过期,是否进行风险评估？","温馨提示",["确定", "取消"], function(e) {
							if (e.index == 0) {
								toTest();
					        }
					  	});
					  	return;
					}
					//客户风险等级 01保守型 02安稳型 03稳健型 04成长型 05积极型
					//基金风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
					if(parseInt(f_cust_risk) < parseInt(f_risklevel)){
						mui.confirm("您购买的基金产品投资风险大于您的风险承受能力，是否重新进行风险评估？","温馨提示",["确定", "取消"], function(e) {
							if (e.index == 0) {
								toTest();
					        }
					  	});
					  	return;
					}
					
					if(f_investcycle == '' || f_investcycle == null){
						mui.alert("请选择定投周期");
						return;
					}
					if(f_investday == '' || f_investday == null){
						mui.alert("请选择定投时间");
						return;
					}
//					f_investcyclevalue = $("#f_investcyclevalue").val();
//					if(f_investcyclevalue == '' || f_investcyclevalue == null){
//						mui.alert("定投间隔不能为空");
//						return;
//					}
//					if(numCheck(f_investcyclevalue)||f_investcyclevalue==0){
//						mui.alert("定投间隔必须为大于0的整数");
//						return;
//					}
//					if(f_investmode == '' || f_investmode == null){
//						mui.alert("请选择定投模式");
//						return;
//					}
					f_investamount = $("#f_investamount").val();
//					f_continueinvestamount = $("#f_continueinvestamount").val();
					if(f_investamount == '' || f_investamount == null){
						mui.alert($("#f_investamount_title").text() + "不能为空");
						return;
					}
					f_investamount=format.ignoreChar($("#f_investamount").val(),',');
		            if( !isMoney(f_investamount) || parseFloat(f_investamount)<=0 ){
		            	mui.alert("请输入正确的" + $("#f_investamount_title").text());
		            	return;
		            }
		            if(f_b39stepunit != "" && f_b39stepunit != "null" && f_b39stepunit > 0){
			           	if (parseInt(f_investamount) % f_b39stepunit != 0) {
							mui.alert($("#f_investamount_title").text() + "必须是定投交易级差:'" + f_b39stepunit + "'的倍数");
							return;
						}
		            }
		            if(parseFloat(f_investamount) < parseFloat(f_b39perminamt)){
						mui.alert($("#f_investamount_title").text() + "不能小于每期定投起点:" + f_b39perminamt + '元');
						return;
					}
		            if(f_b39permaxamt > 0){
			            if(parseFloat(f_investamount) > parseFloat(f_b39permaxamt)){
							mui.alert($("#f_investamount_title").text() + "不能超过每期定投上限:" + f_b39permaxamt + '元');
							return;
						}
		            }
					if(f_investmode == 0){
						f_continueinvestamount = "";
					}
//					else{
//						if(f_continueinvestamount == '' || f_continueinvestamount == null){
//							mui.alert("后续投资金额不能为空");
//							return;
//						}
//						f_continueinvestamount=format.ignoreChar($("#f_continueinvestamount").val(),',');
//		            	if( !isMoney(f_continueinvestamount) || parseFloat(f_continueinvestamount)<=0 ){
//		            		mui.alert("请输入正确的后续投资金额");
//		            		return;
//		            	}
//					}
					if(f_investtime == '' || f_investtime == null){
						mui.alert("请选择终止条件");
						return;
					}
					if(f_investtime == 0){
						if(f_investtimevalue != 999999999){//成功扣款期数 且不为无限大时
							f_investtimevalue = $("#successNumberValue").val();
							if(f_investtimevalue == '' || f_investtimevalue == null){
								mui.alert("成功扣款期数不能为空");
								return;
							}
							if(numCheck(f_investtimevalue)||f_investtimevalue==0){
								mui.alert("成功扣款期数必须为大于0的整数");
								return;
							}
						}
					}else if(f_investtime == 1){
						f_investtimevalue = $("#allMoneyvalue").val();
						if(f_investtimevalue == '' || f_investtimevalue == null){
							mui.alert("累计扣款金额不能为空");
							return;
						}
						f_investtimevalue=format.ignoreChar($("#allMoneyvalue").val(),',');
		            	if( !isMoney(f_investtimevalue) || parseFloat(f_investtimevalue)<=0 ){
		            		mui.alert("请输入正确的累计扣款金额");
		            		return;
		            	}
		            	if( parseFloat(f_investtimevalue) < parseFloat(f_investamount)){
			            	mui.alert("累计扣款金额不能小于" + $("#f_investamount_title").text());
			            	return;
			            }
			        }
		            	
	            	var params = {
						f_deposit_acct : currentAcct,
						f_tano : f_tano,
						f_buyplanno : f_buyplanno,
						f_bank_cust_code : f_bank_cust_code,
						f_prodcode : f_prodcode,
						f_prodname : f_prodname,
						f_b39perminamt : f_b39perminamt,
						f_b39permaxamt : f_b39permaxamt,
						f_investcycle : f_investcycle,
						f_investday : f_investday,
						f_investcyclevalue : f_investcyclevalue,
						f_investmode : f_investmode,
						f_investamount : f_investamount,//定投金额
						payAmount : f_investamount,//定投金额--验密时用
						f_continueinvestamount : f_continueinvestamount,
						f_investtime : f_investtime,
						f_investtimevalue : f_investtimevalue,
						f_continueinvestamount : f_continueinvestamount,
						f_forcebuyflag : f_forcebuyflag,
						f_buyplantype : f_buyplantype,
						changeFlagt : changeFlagt,//定投修改标识  0或空-定投 1-修改 2-停止 5-每月定额转入
						noCheck : false
					};
					mbank.openWindowByLoad('../fund/investmentConfirm.html','investmentConfirm','slide-in-right',params);
							
				}else{
//					mui.alert(custDetailMsg);
					mui.confirm("您尚未签约基金系统，是否前往签约？","温馨提示",["确定", "取消"], function(e) {
						if (e.index == 0) {
							toSign();
				        }
				  	});
					return false;
				}
			}	
			function errorCallback(e){
				mui.alert(e.em);
				return false;
			}
	    });
		
		mbank.resizePage(".btn_bg_f2");
	});
});