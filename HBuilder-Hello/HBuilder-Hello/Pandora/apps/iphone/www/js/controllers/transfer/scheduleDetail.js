define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	var currentAcct="";
	var accountPickerList=[];
    var accountPicker;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var firstDate = new Date();
		firstDate.setDate(1);
		var currentDate = new Date();
		var beginDateDefault = format.formatDate(firstDate);
		var endDateShowDefault = format.formatDate(currentDate);
		$('#chooseBeginDate').html(beginDateDefault);
		$('#chooseEndDate').html(endDateShowDefault);
		
		queryDefaultAcct();
		function queryDefaultAcct(){
				iAccountInfoList = [{"state":"全部"},{"state":"预约处理中"},{"state":"预约被撤销"},{"state":"预约完成"}];
				var length = iAccountInfoList.length;
				getPickerList(iAccountInfoList);
				if(length>0){
					currentAcct = iAccountInfoList[0].state;
					$('#state').html(currentAcct);
				}
		}
		
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.state
					};
					accountPickerList.push(pickItem);
				}
//				accountPicker = new mui.PopPicker();
				accountPicker = new mui.SmartPicker({title:"请选择预约状态",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});
		
		window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value].state;
				$("#state").html(currentAcct);
//				myAcctInfo.getAccAmt(currentAcct.state,"balance",true);      
        });	
		
//		var beginDateFlag = false;//判断开始时间是否填写
//		var endDateFlag = false;
		$("#beginDate").on("tap",function(){
			chooseDate($("#chooseBeginDate"),1);
		});
		$("#endDate").on("tap",function(){
			chooseDate($("#chooseEndDate"),2);
		});
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
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth()-1, nowDate.getDate());
			} else {
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			}
			
			plus.nativeUI.pickDate( function(e){
//				var d=e.date;
//				choosedate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				choosedom.text(format.formatDate(e.date));
				/*if(dateFlag==1){
					beginDateFlag=true;
				} else {
					endDateFlag = true;
				}*/
			},function(e){
			},{
				title: "请选择日期",
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		
		$('#submit').on('tap',function(){
			
			var beginDate;
			var endDate;
			var nowdate = new Date();
			var year =nowdate.getFullYear();
			var month=nowdate.getMonth()+1;
			var day=nowdate.getDate();
//			console.log();
			if(month<10){
				month="0"+month;
			}
			
			if(day<10){
				day="0"+day;
			}

			begin = $('#chooseBeginDate').html();
			end = $('#chooseEndDate').html();
			var str = begin.split("-");
			var str1 = end.split("-");
			var date1 = new Date(str[0],str[1]-1,str[2]);
			var date2 = new Date(str1[0],str1[1]-1,str1[2]);
//			console.log(date1+" "+date2+" "+nowdate);
			if(date2.getTime()-date1.getTime()>90*24*60*60*1000){
				mui.alert("起始日期不能超过90天!");
				return false;
			}
			
			beginDate=str[0]+str[1]+str[2]+"000000";
			endDate=str1[0]+str1[1]+str1[2]+"235959";
			var today = ""+year+month+day+"235959";
			if(parseInt(beginDate)>parseInt(endDate)){
				mui.alert("开始日期大于结束日期");
				return false;
			}
			console.log(beginDate+','+endDate+","+today);
			if(parseInt(endDate)>parseInt(today)){
				mui.alert("结束日期不能大于今天");
				return false;
			}
			
			
			
			var orderState = null;
			if(currentAcct=="全部"){
				orderState="";
			}
			if(currentAcct=="预约处理中"){
				orderState="60";
			}
			if(currentAcct=="预约被撤销"){
				orderState="61";
			} 
			if(currentAcct=="预约完成"){
				orderState="62";
			}
//			var url = mbank.getApiURL() + '002002_schenuleQuery.do';
//			var params = {"startDate":beginDate,"endDate":endDate,"orderState":orderState};
//			mbank.apiSend('post',url,params,successCallback,function(){},true);
			
			var params = {
				"beginDate":beginDate,
				"endDate":endDate,
				"orderState":orderState
			};
			mbank.openWindowByLoad("scheduleDetailQuery.html",'scheduleDetailQuery','slide-in-right',{"params":params});
			
		});
		
	});
});