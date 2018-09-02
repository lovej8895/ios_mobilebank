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
    var cst_certNo = userInfo.get("session_certNo");//证件号码
    
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
	var f_cust_type;//客户类型
	var f_cust_name;//客户名称
					
    
	var f_prodname;				//产品名称 -基金名称
	var f_prodcode;				//产品编号
	var f_prodtype = "";				//产品类型
	
	var f_deposit_acct = "";		//交易账号
	var f_tano;		//TA代码
	var f_buyplanno;		//定投协议号
	var f_opendate;				//定投日期 -签约日期
	var f_investcycle="";				//定投周期
	var f_investday="";				//定投日期
	var f_investcyclevalue="";		//定投间隔
	var f_investmode="";		//定投模式
	var f_investamount = "";				//定投金额
	var f_continueinvestamount ="";				//后续投资金额
	var f_investtime="";		//终止条件
	var f_investtimevalue="";		//终止条件值
//	var interestBeginDate;	//累计扣款次数
//	var interestEndDate;		//累计交易金额
//	var yieldRate;					//交易渠道
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
		changeFlagt = 5;
		
		f_prodcode = self.f_prodcode;				//产品编号
		f_prodtype = self.f_prodtype;				//产品类型
		f_tano = self.f_tano;				//产品编号
		
//		var investment = self.investment;
//		f_prodcode = investment.f_prodcode;				//产品编号
//		f_tano = investment.f_tano;		//TA代码
		
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
			mbank.apiSend("post",urlVar,params,searchFundDetailSuc,searchFundDetailFail,true);
			function searchFundDetailSuc(data){
				if(data.ec == "000"){
					f_prodname = data.f_iProductInfo[0].f_prodname;
					f_status = data.f_iProductInfo[0].f_status;//产品状态 0：可转入，可转出 1：只可转入 2：只可转出 3：不可转换
					f_buyplanflag = data.f_iProductInfo[0].f_buyplanflag;//是否可定投 0：否，1：是
					f_risklevel = data.f_iProductInfo[0].f_risklevel;//风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
					
					f_b39perminamt = data.f_iProductInfo[0].f_b39perminamt;//每期定投起点
					f_b39stepunit = data.f_iProductInfo[0].f_b39stepunit;//定投交易级差
					f_b39permaxamt = data.f_iProductInfo[0].f_b39permaxamt;//每期定投上限
					
					showDetail();//展示详情
				}else{
					mui.alert(data.em);
				}
			}
			function searchFundDetailFail(e){
				mui.alert(e.em);
			}
		}
		
		//查询签约客户信息
		function queryCustomerInfoList(){
			var params ={
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				f_deposit_acct:currentAcct,//银行结算账号/卡号/折号 --查单条时传，非单条时不传	
				f_cust_type:"1",
				f_id_code:cst_certNo
			};
			var url = mbank.getApiURL() + 'queryCustSignInfo.do';
			mbank.apiSend("post",url,params,successCallback,errorCallback,false);
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
					f_cust_type = currObj.f_cust_type;//客户类型
					f_cust_name = currObj.f_cust_name;//客户名称
				}else{
					mui.alert("获取客户信息失败");
					return;
				}
			}
			function errorCallback(e){
				mui.alert(e.em);
				return;
			}
		}
		
		function showDetail(){
			show_f_investday = '请选择';
			show_f_investtime = '请选择';
			f_investcycle = 0;//每月
			$("#li_successNumberValue").hide();
			$("#li_allMoneyvalue").hide();
			
			document.getElementById("f_investday").innerHTML = show_f_investday;
			document.getElementById("f_investtime").innerHTML = show_f_investtime;
		}
		
		
		//获取绑定账号列表及默认账号
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				//设置默认账号
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#currentAcct").html(format.dealAccountHideFour(currentAcct));
						
					qureyBalance();//查询账户余额
					queryCustomerInfoList();//查询签约客户信息
					searchFundDetail();//发送接口获取产品信息
				}
			}
		}
		//查询账户余额
        function qureyBalance(){
			myAcctInfo.getAccBalance(currentAcct,"true",function(data){
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
			queryCustomerInfoList();//查询签约客户信息
        });	
        //获取定投日期列表
		var investdayMonthList = jQuery.param.getParams("INVESTDAY_MONTH");
		var investdayMonthPicker = new mui.SmartPicker({title:"请选择定投日期",fireEvent:"pickInvestdayMonth"});
	    investdayMonthPicker.setData(investdayMonthList);
        
		//显示定投日期选择下拉框	
		$("#changeInvestday").on("tap",function(){
			document.activeElement.blur();
			investdayMonthPicker.show();
		});	
		//选择定投日期触发事件-月
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
//      window.addEventListener("pickInvestdayWeek",function(event){
//              var pickItem=event.detail;	
//				$("#f_investday").html(pickItem.text);
//				if(pickItem.value == ""){
//					f_investday = "";
//				}else{
//					f_investday = pickItem.value;
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
				$("#li_successNumberValue").show();
				$("#li_allMoneyvalue").hide();
			}else if(pickItem.value == 1){
				$("#li_successNumberValue").hide();
				$("#li_allMoneyvalue").show();
			}else{
				$("#li_successNumberValue").show();
				$("#li_allMoneyvalue").hide();
			}
        });	
        
        //成功扣款期数输入时
        $("#successNumberValue").on("focus",function(){
		    $(this).attr('type', 'number');
		}); 
		$("#successNumberValue").on("blur",function(){
			$(this).attr('type', 'text');
		});
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
				f_deposit_acct : currentAcct,
				noCheck : false
			};
			mbank.openWindowByLoad('../fund/fundCustomerSign_Input.html','fundCustomerSign_Input','slide-in-right',params);
        }
        
		//下一步
		$("#nextButton").click(function(){
			
//			//是否签约 校验 
//			if(f_sign_status != '1' && f_sign_status != '3'){//客户签约状态--0-未签约 1-已签约 2-签约失败 3-解约失败 4-已解约
//				mui.confirm("账户未签约,是否进行签约？","温馨提示",["确定", "取消"], function(e) {
//					if (e.index == 0) {
//						toSign();
//			        }
//			  	});
//			  	return;
//			}
//			
//			//账号状态是否正常 校验
//			if (accountStat!='0' && accountStat!='2') {
//				mui.confirm("账户状态异常,是否进行签约？","温馨提示",["确定", "取消"], function(e) {
//					if (e.index == 0) {
//						toSign();
//			        }
//			  	});
//			  	return;
//			}
//			//是否做过风险等级评估 校验
//			if(f_cust_risk == "" || f_cust_risk == "null"){
//				mui.confirm("客户未进行风险评估,是否进行风险评估？","温馨提示",["确定", "取消"], function(e) {
//					if (e.index == 0) {
//						toTest();
//			        }
//			  	});
//			  	return;
//			}
//			var currentDate = new Date();
//			var nowDate = currentDate.getFullYear()+(currentDate.getMonth()+1)+currentDate.getDate();
//			console.log(f_risk_end_date);
//			//风险等级评估过期 校验
//			if(f_risk_end_date < nowDate){//var f_risk_end_date;//客户风险评级有效日期
//				mui.confirm("客户风险评估已过期,是否进行风险评估？","温馨提示",["确定", "取消"], function(e) {
//					if (e.index == 0) {
//						toTest();
//			        }
//			  	});
//			  	return;
//			}
//			//风险等级 校验
//			//客户风险等级 01保守型 02安稳型 03稳健型 04成长型 05积极型
//			//基金风险等级 '01'-低风险，'02'-中低风险'03'-中风险，'04'-中高风险'05'-高风险
//			if(jQuery.param.getDisplay('FUND_CUSRISK_LEVEL_NUM', f_cust_risk) < jQuery.param.getDisplay('FUND_RISK_LEVEL_NUM', f_risklevel)){
//				mui.confirm("客户风险小于基金风险等级,是否进行风险评估？","温馨提示",["确定", "取消"], function(e) {
//					if (e.index == 0) {
//						
//			        }
//			  	});
//			  	return;
//			}
			
			if(f_buyplanflag != 1){//是否可定投 0：否，1：是
				mui.alert("此基金不可每月定额转入");
				return;
			}
			if(f_investday == '' || f_investday == null){
				mui.alert("请选择定投日期");
				return;
			}
			f_investamount = $("#f_investamount").val();
			if(f_investamount == '' || f_investamount == null){
				mui.alert("定投金额不能为空");
				return;
			}
			f_investamount=format.ignoreChar($("#f_investamount").val(),',');
            if( !isMoney(f_investamount) || parseFloat(f_investamount)<=0 ){
            	mui.alert("请输入正确的定投金额");
            	return;
            }
            f_b39stepunit = f_b39stepunit.trim();
            if(f_b39stepunit != "" && f_b39stepunit != "null" && f_b39stepunit > 0){
	           	if (parseInt(f_investamount) % f_b39stepunit != 0) {
					mui.alert("定投金额必须是定投交易级差:'" + f_b39stepunit + "'的倍数");
					return;
				}
            }
            if(parseInt(f_investamount) < parseFloat(f_b39perminamt)){
				mui.alert("定投金额不能小于每期定投起点:" + f_b39perminamt + '元');
				return;
			}
            if(parseFloat(f_b39permaxamt) > 0){
	            if(parseInt(f_investamount) > parseFloat(f_b39permaxamt)){
					mui.alert("定投金额不能超过每期定投上限:"+ f_b39permaxamt + '元');
					return;
				}
            }
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
            		mui.alert("请输入正确的累计扣款金额值");
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
				f_investamount : f_investamount,
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
	    });
		
		
		mbank.resizePage(".btn_bg_f2");
	});
});