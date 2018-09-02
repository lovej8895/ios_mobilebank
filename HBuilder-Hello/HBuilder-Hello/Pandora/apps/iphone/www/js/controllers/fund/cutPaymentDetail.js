define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var iAccountInfoList = [];
	var accountPickerList=[];
	//当前选定账号
	var currentAcct = "";
	var accountPicker = "";
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var f_deposit_acct = self.f_deposit_acct;//交易账号
		var f_bank_cust_code = self.f_bank_cust_code;//主机客户号
		var f_buyplanno = self.f_buyplanno;//定投协议号--查询唯一一条定投信息
		var f_prodcode = self.f_prodcode;//产品编码
		var f_prodname = self.f_prodname;//产品名称
		var f_businesscode = self.f_businesscode;//交易类型 用交易委托查询（311007）交易类型为“39 定期定额申购”
		
		$("#f_prodname_prodcode").html(f_prodname + '(' + f_prodcode + ')');
		var firstDate = new Date();
//		firstDate.setDate(1);//设置日期为当月的1日
//		new Date(firstDate.setMonth(new Date().getMonth() - 1));//设置月份为当前月份的前一个月
		//结束日期默认选择当天，开始日期默认选择前一个月的当天
		var currentDate = new Date();
		var endDate = currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate();
		var beginDate;//
//		beginDate = currentDate.getFullYear()+"-"+currentDate.getMonth()+"-"+currentDate.getDate();//有些月份无30号或31号
		beginDate = getLastMonthYestdy(currentDate);
		
//		currentDate = currentDate.valueOf();
//		var lastMonthDate = currentDate - 30*24*60*60*1000;//获取当前日期前30天 --起始日期
//		lastMonthDate = new Date(lastMonthDate);
//		beginDate = lastMonthDate.getFullYear()+"-"+(lastMonthDate.getMonth()+1)+"-"+lastMonthDate.getDate();
		
		$("#beginDate").html(beginDate);
		$("#endDate").html(endDate);
		
		 //获得上个月在昨天这一天的日期   
		 function getLastMonthYestdy(date) {
		 	var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
		 	var strYear = date.getFullYear();
		 	var strDay = date.getDate();
		 	var 
			strMonth = date.getMonth() + 1;
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
//		 	if(strMonth < 10) {
//		 		strMonth = "0" + strMonth;
//		 	}
//		 	if(strDay < 10) {
//		 		strDay = "0" + strDay;
//		 	}
		 	datastr = strYear + "-" + strMonth + "-" + strDay;
		 	return datastr;
		 }
		
		
		//选择起始日期
		$("#changeBeginDate").on("tap",function(){
			chooseDate($("#beginDate"),1);
		});
		//选择终止日期
		$("#changeEndDate").on("tap",function(){
			chooseDate($("#endDate"),2);
		});
		
		//调取默认时间表
		function chooseDate(choosedom,dateFlag){
			var nowDate = new Date();
			var dDate = new Date();//日期控件默认选中日期
			var choosedate;
			var minDate = new Date();
			var maxDate = new Date();
			minDate.setFullYear(nowDate.getFullYear() - 1, nowDate.getMonth(), nowDate.getDate());
			maxDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			if(choosedom.attr('id')=='beginDate'){
//				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth()-1, nowDate.getDate());
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
//				title: "请选择日期",
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		
		$("#queryButton").on('tap',function(){
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
			begin = $('#beginDate').html();
			end = $('#endDate').html();
			var str = begin.split("-");
			var str1 = end.split("-");
			var date1 = new Date(str[0],str[1]-1,str[2]);
			var date2 = new Date(str1[0],str1[1]-1,str1[2]);
			if(str[1].length<2){
				str[1] = "0"+str[1];
			}
			if(str[2].length<2){
				str[2] = "0"+str[2];
			}
			if(str1[1].length<2){
				str1[1] = "0"+str1[1];
			}
			if(str1[2].length<2){
				str1[2] = "0"+str1[2];
			}
			beginDate=str[0]+str[1]+str[2]+"000000";
			endDate=str1[0]+str1[1]+str1[2]+"235959";
			//1.终止日期默认为系统当前日期，起始日期为终止日期前一个月的日期，比如：2016-05-13到2016-04-13；
			//2.查询时间最长可查询最近一年，跨度最长为三个月；
			//3.终止日期早于起始日期，提示：“终止日期不能早于起始日期，请重新选择终止日期”；
			//4.结束时间晚于当前日期的提示“结束时间不能晚于当前日期，请重新选择结束时间！”；
			//5.查询时间跨度超过三个月的，弹出提示“时间跨度最长为三个月，请重新选择查询时间”；
			//6.结束时间减去起始时间超过 365天的提示“查询时间跨度最长为一年，请重新选择时间”；
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
			
			var params = {
				f_deposit_acct : f_deposit_acct,
				f_bank_cust_code : f_bank_cust_code,
				f_buyplanno:f_buyplanno,//定投协议号--查询唯一一条定投信息
				f_prodcode : f_prodcode,
				f_prodname : f_prodname,
				f_businesscode : "39",//交易类型 用交易委托查询（311007）交易类型为“39 定期定额申购”
				f_begin_date : beginDate,
				f_end_date : endDate,
				noCheck : false
			};
			mbank.openWindowByLoad("../fund/cutPaymentDetailResult.html",'cutPaymentDetailResult','slide-in-right',params);
			
		});
	});
});