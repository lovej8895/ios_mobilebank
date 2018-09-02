define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	var currentAcct="";
	var accountPickerList=[];
    var accountPicker;
    var timeList = [];
    var transferList = [];
	mui.init();
	mui.plusReady(function() {		
		plus.screen.lockOrientation("portrait-primary");//竖屏
		var self = plus.webview.currentWebview();
		queryDefaultAcct();//加载相关信息
		function queryDefaultAcct(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				var length = iAccountInfoList.length;
				if(length>0){
					accountPickerList = [];
					for(var i=0;i<length;i++){
						var account = iAccountInfoList[i];
						var pickItem = {
						    value :i,
						    text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
			}
			accountInit();
			if(length > 0){
				currentAcct = iAccountInfoList[0].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			}
		}
	}

			function accountInit(){
				var accountPicker = new mui.SmartPicker({title:"请选择交易账号",fireEvent:"payAccount"});
				accountPicker.setData(accountPickerList);
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
			//添加账号监听事件
			window.addEventListener("payAccount",function(event){
				var param =event.detail;
				currentAcct = iAccountInfoList[param.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
			});
	        
			$("#beginDate").on("tap",function(){
				chooseDate($("#chooseBeginDate"),1);
		});
			$("#endDate").on("tap",function(){
			chooseDate($("#chooseEndDate"),2);
		});
		
		//结束日期默认选择当天，开始日期默认选择前一个月的当天
		var nowTime = new Date();
		var initEndDate = nowTime.getFullYear()+"-"+(nowTime.getMonth()+1)+"-"+nowTime.getDate();
		var initBeginDate = getLastMonthYestdy(nowTime);
		$('#chooseBeginDate').html(initBeginDate);
		$('#chooseEndDate').html(initEndDate);
		
		 //获得上个月在昨天这一天的日期   
		 function getLastMonthYestdy(date) {
		 	var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
		 	var strYear = date.getFullYear();
		 	var strDay = date.getDate();
		 	var strMonth = date.getMonth() + 1;
		 	if(strYear % 4 == 0 && strYear % 100 != 0) {
		 		daysInMonth[2] = 29;
		 	}
		 	if(strMonth - 1 == 0) {
		 		strYear -= 1;
		 		strMonth = 12;
		 	} else {
		 		strMonth -= 1;
		 	}
		 	strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
		 	datastr = strYear + "-" + strMonth + "-" + strDay;
		 	return datastr;
		 }
		
		//调取默认时间表
		function chooseDate(choosedom,dateFlag){
			var nowDate = new Date();
			var dDate = new Date();
			var choosedate;
			var minDate = new Date();
			var nowDate = new Date();
			var maxDate = new Date();
			minDate.setFullYear(nowDate.getFullYear() - 1, nowDate.getMonth(), nowDate.getDate());
			maxDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			if(choosedom.attr('id')=='chooseBeginDate'){
			    dDate = new Date(getLastMonthYestdy(nowDate));
			} else {
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			}
			
			plus.nativeUI.pickDate( function(e){
				var d=e.date;
				choosedate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				choosedom.text(choosedate);
			},function(e){
			},{
				title: "请选择日期",
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		//检查产品代码是否是整数
		function isProcode( s )
		{ 
			var isInteger = RegExp(/^[0-9]+$/);
			return ( isInteger.test(s) );
		}
		mbank.resizePage(".btn_bg_f2");//不让按钮弹上来
		  
		//点击查询按钮发送交易
		document.getElementById("submit").addEventListener('tap',function(){
			var beginDate;
			var endDate;
			var nowdate = new Date();
			var year =nowdate.getFullYear();
			var month=nowdate.getMonth()+1;
			
			if(month<10){
				month="0"+month;
			}
			var day=nowdate.getDate();
			if(day<10){
				day="0"+day;
			}
				var today = ""+year+month+day+"235959";
				begin = $('#chooseBeginDate').html();
				end = $('#chooseEndDate').html();
				var str = begin.split("-");
				var str1 = end.split("-");
				var date1 = new Date(str[0],str[1]-1,str[2]);
				var date2 = new Date(str1[0],str1[1]-1,str1[2]);
				if(str[1]<10){
					str[1] = "0"+str[1];
				}
				if(str[2]<10){
					str[2] = "0"+str[2];
				}
				if(str1[1]<10){
					str1[1] = "0"+str1[1];
				}
				if(str1[2]<10){
					str1[2] = "0"+str1[2];
				}
				beginDate=str[0]+str[1]+str[2]+"000000";
				endDate=str1[0]+str1[1]+str1[2]+"235959";
				if(parseInt(beginDate)>parseInt(endDate)){
					mui.alert("终止日期不能小于起始日期，请重新选择日期");
						return false;
					}
				if(parseInt(endDate)>parseInt(today)){
					mui.alert("终止日期不能大于当前日期，请重新选择终止日期");
						return false;
					}
				if(date2.getTime()-date1.getTime()>90*24*60*60*1000){
					mui.alert("时间跨度最长为三个月，请重新选择查询日期");
						return false;
					}
				if(nowdate.getTime()-date1.getTime()>365*24*60*60*1000){
					mui.alert("查询起始日期必需在一年内，请重新选择起始日期");
						return false;
					}
					f_prodcode = $("#oldBankCard").val();
				//产品代码不输默认全部查询，如果输入的话请输入6位整数
				if(f_prodcode!=""){
					if((f_prodcode.length!=6)||!isProcode(f_prodcode)){
						mui.alert("产品代码为6位整数");
							return false;
					}
				}
					var confirmButton = document.getElementById("submit");
					var noCheck = confirmButton.getAttribute("noCheck");
					var params = {
							"f_prodcode":f_prodcode,
							"f_deposit_acct":currentAcct,
							"f_begin_date":beginDate,
							"f_end_date":endDate,
							noCheck:noCheck
			};	
			mbank.openWindowByLoad("../fund/divideBonusQueryResult.html", "divideBonusQueryResult", "slide-in-right", params);

			
		});

	
	});
});