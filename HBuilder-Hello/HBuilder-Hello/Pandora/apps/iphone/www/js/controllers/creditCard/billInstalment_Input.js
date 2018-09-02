define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	var iAccountInfoList = [];
	var iAccountInfoList1 = [];
	var accountPickerList=[];
	var accountPickerList1=[];
	//当前选定账号
	var currentAcct="";
	var currentAcct1="";
	var accountPicker="";
	var accountPicker1="";
	var feeratetemp ="";
	//临时变量
	var flag = false;
	var repaymentDate ="";
	var unReturnAmount ="";
	//预加载
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
					$("#cardNo").val(currentAcct);
					billInstalmentQuery(currentAcct);//账单分期查询
				}
			}
		}
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择信用卡卡号",fireEvent:"cardNo"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		//切换信用卡账户事件
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();
		});
		
		window.addEventListener("cardNo",function(event){
			var pickItem3=event.detail;			
			currentAcct=iAccountInfoList[pickItem3.value].accountNo;
			$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
			$("#cardNo").val(currentAcct);
				
			$("#billInfoShow").hide();
			$("#feeInfoShow").hide();
			$("#nextStepShow").hide();
			flag = false;
			billInstalmentQuery(currentAcct);//账单分期查询
		});
		
		function billInstalmentQuery(accparam){
			$("#amountRealCharged").val("");
			var url1 = mbank.getApiURL() + 'billInstalmentQuery.do';
			mbank.apiSend('post', url1, {
				cardNo: accparam
			}, callBack1, null, true);
			function callBack1(data){
				if("001" == data.creditCardType){
		        	$("#billDate").val(data.billDate);
					$("#billAmt").val(data.billAmt);
					$("#instalmentAmt").val(data.instalmentAmt);
					$("#CurrencyCode").val("156");
					repaymentDate = data.repaymentDate;
					unReturnAmount = data.unReturnAmount;
			        	
			        $("#billDateShow").html(format.dataToDate(data.billDate));
					$("#billAmtShow").html(format.formatMoney(data.billAmt));
					$("#instalmentAmtShow").html(format.formatMoney(data.instalmentAmt));
					$("#billInfoShow").show();
			        queryFee();
		        }else{
		        	mui.alert("返回的非本币账户账单");
		        	return false;
		        }
			}
		}
		
		//分期费率列表查询
		function queryFee(){
			var queryNo = $("#cardNo").val();
			var url2 = mbank.getApiURL() + 'instalmentNumAndFee.do';
			mbank.apiSend('post', url2, {
				instalmentType:"PROZD",
				queryNo:queryNo
			}, callBack2, null, false);
			function callBack2(data){
				iAccountInfoList1 = data.instalmentFeeRateList;
				getPickerList1(iAccountInfoList1);
				var length1 = iAccountInfoList1.length;
				if (length1 > 0) {
					currentAcct1 = iAccountInfoList1[0].instalmentPeriods;
					feeratetemp = iAccountInfoList1[0].instalmentFeeRate;
					$("#instalmentTimesShow").html(currentAcct1);
					$("#instalmentTimes").val(currentAcct1);
					$("#instalmentFeeRateShow").html(feeratetemp);
					$("#instalmentFeeRate").val(feeratetemp);
					
					$("#feeInfoShow").show();
					$("#nextStepShow").show();
				}else{
					mui.alert("未查询到可分期期数");
					return false;
				}
			}	
		}
		
		function getPickerList1(iAccountInfoList1){
			if( iAccountInfoList1.length>0 ){
				accountPickerList1=[];
				for( var i=0;i<iAccountInfoList1.length;i++ ){
					var account1=iAccountInfoList1[i];
					var pickItem1={
						value:i,
						text:account1.instalmentPeriods
					};
					accountPickerList1.push(pickItem1);
				}
				accountPicker1 = new mui.SmartPicker({title:"请选择分期期数",fireEvent:"instalmentTimes"});
			    accountPicker1.setData(accountPickerList1);	
			}
		}
		//切换分期期数
		$("#changeinstalmentTimes").on("tap",function(){
			document.activeElement.blur();
			accountPicker1.show();
		});
		
		window.addEventListener("instalmentTimes",function(event){
			var pickItem2=event.detail;			
			currentAcct1=iAccountInfoList1[pickItem2.value].instalmentPeriods;
			feeratetemp=iAccountInfoList1[pickItem2.value].instalmentFeeRate;
			$("#instalmentTimesShow").html(currentAcct1);
			$("#instalmentTimes").val(currentAcct1);
			$("#instalmentFeeRateShow").html(feeratetemp);
			$("#instalmentFeeRate").val(feeratetemp);
		});
		
		//输入金额
		$("#amountRealCharged").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#amountRealCharged").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		}); 
		
		//获取系统日期年月日
		function getYearMonDay(dateTime) {
			nowYear = dateTime.getFullYear();
			nowMonth = dateTime.getMonth() + 1;
			nowDate = dateTime.getDate();
			if (nowMonth < 10) nowMonth = "0" + nowMonth;
			if (nowDate < 10) nowDate = "0" + nowDate;
			return nowYear + '' + nowMonth + '' + nowDate
		}
		function isBiggerThanToday(sysparam,d){
			if(d == ""){
				return false;
			}
			return getDifferDays(sysparam,d)>0;
		}
		/**
		 * 计算两个日期相关的天数
		 */
		function getDifferDays(startDate,endDate){
			startDate=parseDate(startDate);
			endDate=parseDate(endDate);
			return dateRange(startDate,endDate);
		}
		function parseDate(dateString) {
			//dateString = clearDateLine(dateString);
			dateString = dateString;
			var year = dateString.substr(0, 4);
			var month = dateString.substr(4, 2);
			var date = dateString.substr(6, 2);
			var dateObj = new Date(year, month - 1, date);			
			return dateObj;
		}
		//把所有的非数字都清除，获得纯数字的日期
		//function clearDateLine(dateString) {
			//return dateString.replace(/[^\d]/g,'');
		//}
		//以天计算两个日期间隔的天数
		function dateRange(startDate, endDate) {
			var startDateMinis = Date.parse(startDate);
			var endDateMinis = Date.parse(endDate);
			var minutes = 1000 * 60;
			var hours = minutes * 60;
			var days = hours * 24;
			var dayRange = Math.floor((endDateMinis - startDateMinis)/days);
			return dayRange;
		}
		
		//下一步账单分期确认
		$("#nextStep").on("tap",function(){
			var cardNoVal = $("#cardNo").val();
			var billDate = $("#billDate").val();
			var queryTime = billDate.substring(0,6);
			var billAmt = $("#billAmt").val();
			
			var amountRealCharged = format.ignoreChar($("#amountRealCharged").val(),',');
			var CurrencyCode = $("#CurrencyCode").val();
			var instalmentTimes = $("#instalmentTimes").val();
			var instalmentFeeRate = $("#instalmentFeeRate").val();
			var instalmentAmtVal = $("#instalmentAmt").val();
			if (amountRealCharged == "") {
				mui.alert("请输入申请分期金额");
				return false;
			}
			if(parseFloat(amountRealCharged)<500){
				mui.alert("分期金额超过500元才可进行分期");
				return false;
			}
			if (parseFloat(amountRealCharged)>parseFloat(instalmentAmtVal)) {
				mui.alert("申请分期金额必须小于或者等于可分期最大金额");
				return false;
			}
			if(CurrencyCode!="156"){
				mui.alert("账单币种为人民币才可进行分期");
				return false;
			}
			var sysdataparam = getYearMonDay(new Date());
			if(!isBiggerThanToday(sysdataparam,repaymentDate)){
				mui.alert("已过最后还款日，不能申请分期");
				return false;
			}
			var params={
		    	cardNo:cardNoVal,
		    	billDate:billDate,
		    	queryTime:queryTime,
		    	billAmt:billAmt,
		    	instalmentAmt:amountRealCharged,
		    	CurrencyCode:CurrencyCode,
		    	instalmentTimes:instalmentTimes,
		    	instalmentFeeRate:instalmentFeeRate,
		    	unReturnAmount:unReturnAmount
		    	
		    };
		    var url = mbank.getApiURL()+'billInstalmentConfirm.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var params5={
		    		cardNo:cardNoVal,
			    	billDate:billDate,
			    	queryTime:queryTime,
			    	billAmt:billAmt,
			    	instalmentAmt:amountRealCharged,
			    	CurrencyCode:CurrencyCode,
			    	instalmentTimes:instalmentTimes,
			    	instalmentFeeRate:instalmentFeeRate,
			    	unReturnAmount:unReturnAmount,
			    	chargeFee:data.chargeFee,
			    	repayPrincipal:data.repayPrincipal,
			    	totalAmt:data.totalAmt
		    	};
		        mbank.openWindowByLoad('../creditCard/billInstalment_Confirm.html','billInstalment_Confirm','slide-in-right',params5);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
		    	//mui.alert("交易失败时的的处理需要后续确认");
		    }
		});
		mbank.resizePage(".btn_bg_f2");
	});
});