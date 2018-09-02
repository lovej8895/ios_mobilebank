define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	//绑定账号列表
	var timeList = [];
	var iSubAccountInfo = []; //绑定子账户列表
	//当前选定账号
	var currentAcct="";
	var currentSonAcc = "";//当前所选子账号
	var certPickerList=[];
    var accountPicker;
    var radioType = "0";// 0代表一周 1代表一月 2代表自定义
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		currentAcct = self.accountNo;
		$("#accountNo").html(format.dealAccountHideFour(currentAcct));
		timeList = [{"type":"近一周"},{"type":"近一月"},{"type":"自定义"}];
		getPickerList(timeList);
//		queryDefaultAcct();
		if(radioType=="0"){
			$('.chooseDate').hide();
		}
		
		var url = mbank.getApiURL() + 'subAccQueryCh.do';
		var params = {'accountNo':currentAcct};
		mbank.apiSend("post",url,params,successCallback,null,true);
		function successCallback(data){
			iSubAccountInfo = data.iSubAccountInfo_hb;
			if(iSubAccountInfo.length>0){
				for(var i=0;i<iSubAccountInfo.length;i++){
					var subject = iSubAccountInfo[i].accSubject;
					if(subject.substring(0,3)=='211'){
						currentSonAcc = iSubAccountInfo[i].sonAccNo;
//						console.log(currentSonAcc);
					}
				}
				
				if(currentSonAcc==''){
					mui.alert("未查到活期账户");
				}
			} 
		}
		
		
		function getPickerList(timeList){
			if( timeList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<timeList.length;i++ ){
					var timeTypeList=timeList[i];
					var pickItem={
						value:i,
						text:timeTypeList.type
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择时间跨度",fireEvent:"timeType"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeTime").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});
		
		window.addEventListener("timeType",function(event){
                var param=event.detail;			
				currentType=timeList[param.value].type;
				$("#timeType").html(currentType);
				if(currentType==timeList[0].type){
					radioType = 0;
					$(".chooseDate").hide();
				} else if(currentType==timeList[1].type){
					radioType = 1;
					$(".chooseDate").hide();
				} else if(currentType==timeList[2].type){
					radioType = 2;
					$(".chooseDate").show();
            		beginDateFlag = false;
            		endDateFlag = false;
            		$('#chooseBeginDate').html('请选择开始时间');
            		$('#chooseEndDate').html('请选择结束日期');
				}
        });	
		
		
		
		var beginDateFlag = false;//判断开始时间是否填写
		var endDateFlag = false;
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
			var d=e.date;
			choosedate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
			choosedom.text(choosedate);
			if(dateFlag==1){
				beginDateFlag=true;
			} else {
				endDateFlag = true;
			}
//			console.log( "选择的日期："+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() );
			},function(e){
			},{
				title: "请选择日期",
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		
		$("#submit").on("tap",function(){
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
			if(radioType=="0"){
				
				endDate =""+year+month+day;
				var oneweek = new Date(nowdate-7*24*3600*1000);
				var y = oneweek.getFullYear();
				var m = oneweek.getMonth()+1;
				if(m<10){
					m = "0"+m;
				}
				var d = oneweek.getDate();
				if(d<10){
					d="0"+d;
				}
				beginDate = ""+y+m+d;

			}
			if(radioType=="1"){
				endDate =""+year+month+day;
				var oneweek = new Date(nowdate-30*24*3600*1000);
				var y = oneweek.getFullYear();
				var m = oneweek.getMonth()+1;
				if(m<10){
					m = "0"+m;
				}
				var d = oneweek.getDate();
				if(d<10){
					d="0"+d;
				}
				beginDate = ""+y+m+d;
			}
			if(radioType=="2"){
				var today = ""+year+month+day;
				if(!beginDateFlag){
					mui.alert("请输入开始日期");
					return false;
				}
				if(!endDateFlag){
					mui.alert("请输入结束日期");
					return false;
				}
				begin = $('#chooseBeginDate').html();
				end = $('#chooseEndDate').html();
				var str = begin.split("-");
				var str1 = end.split("-");
				var date1 = new Date(str[0],str[1]-1,str[2]);
				var date2 = new Date(str1[0],str1[1]-1,str1[2]);
				if(date2.getTime()-date1.getTime()>180*24*60*60*1000){
					mui.alert("起始日期不能超过180天!");
					return false;
				}
				if(nowdate.getTime()-date1.getTime()>365*24*60*60*1000){
					mui.alert("起始日期必须在一年内!");
					return false;
				}
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
				beginDate=str[0]+str[1]+str[2];
				endDate=str1[0]+str1[1]+str1[2];
//				console.log(beginDate+" "+endDate);
				if(parseInt(beginDate)>parseInt(endDate)){
					mui.alert("开始日期大于结束日期");
					return false;
				}
				
				if(parseInt(endDate)>parseInt(today)){
					mui.alert("结束日期不能大于今天");
					return false;
				}
			}
			
			var url = mbank.getApiURL() + '001002_subAccountDetailQueryAjax.do';
			var params = {
				"accountNo":currentAcct,
				"beginDate":beginDate,
				"endDate":endDate,
				"sonAccNo":currentSonAcc
			};
			mbank.openWindowByLoad('accountDetails.html','accountDetails','slide-in-right',{"params":params});
			
		});
		 $("input[name='radio1']").on("change",function(){
            radioType=$("input[name='radio1']:checked").val();
            if( radioType=="0" ){
            	$(".chooseDate").hide();
            	
            }else if(radioType=="1"){
            	$(".chooseDate").hide();     	
            } else {
            	$(".chooseDate").show();
            	beginDateFlag = false;
            	endDateFlag = false;
            	$('#chooseBeginDate').html('请选择开始时间');
            	$('#chooseEndDate').html('请选择结束日期');
            }
        });
		
	});
	
});