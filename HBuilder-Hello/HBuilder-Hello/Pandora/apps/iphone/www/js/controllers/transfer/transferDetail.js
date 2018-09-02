define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var iAccountInfoList = [];
	var currentAcct="";
	var accountPickerList=[];
    var accountPicker;
    var transferRadio = "0";//转账单选按钮值
    var timeRadio = "0"; //时间跨度值
    var timeList = [];
    var transferList = [];
	mui.init();
	mui.plusReady(function() {		
		
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		setTimeout(function(){
			plus.webview.close("transferResult");
		},300);			
		if(timeRadio=="0"){
			$(".chooseDate").hide();
		}
		timeList = [{text:"近一周",value:"0"},{text:"近一月",value:"1"},{text:"自定义",value:"2"}];
		transferList = [{text:"全部",value:"0"},{text:"行内",value:"1"},{text:"行外",value:"2"}];
		
		queryDefaultAcct();
		function queryDefaultAcct(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				
				var length = iAccountInfoList.length;
				
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
				}
				
				accountInit();
				transferTypeInit();
				timeTypeInit();
				
				if(length > 0) {
					if( self.payAccount ){
						currentAcct=self.payAccount;
					}else{
						currentAcct = iAccountInfoList[0].accountNo;
					}
					
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				}
				
			}
			
		}
		
		function accountInit(){
			var accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"payAccount"});
			accountPicker.setData(accountPickerList);
			document.getElementById("changeAccount").addEventListener("tap",function(){
				accountPicker.show();
			},false);
		}
		function transferTypeInit(){
			var transferPicker = new mui.SmartPicker({title:"请选择转账类型",fireEvent:"transferType"});
			transferPicker.setData(transferList);
			document.getElementById("transferTypeLi").addEventListener("tap",function(){
				transferPicker.show();
			},false);
		}
		function timeTypeInit(){
			var timePicker = new mui.SmartPicker({title:"请选择时间跨度",fireEvent:"timeType"});
			timePicker.setData(timeList);
			document.getElementById("changeTime").addEventListener("tap",function(){
				timePicker.show();
			},false);
		}
		window.addEventListener("payAccount",function(event){
            var param=event.detail;			
			currentAcct=iAccountInfoList[param.value].accountNo;
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
        });
        window.addEventListener("transferType",function(event){
            var param=event.detail;
            transferRadio = transferList[param.value].value;
            console.log(transferRadio);
			$("#transferType").html(transferList[param.value].text);
        });	
        window.addEventListener("timeType",function(event){
            var param=event.detail;	
            timeRadio = timeList[param.value].value;
            console.log(timeRadio);
            $("#timeType").html(timeList[param.value].text);
            if(timeRadio=="0"){
            	$(".chooseDate").hide();
            }else if(timeRadio=="1"){
            	$(".chooseDate").hide();
            }else if(timeRadio=="2"){
            	$(".chooseDate").show();
            	beginDateFlag = false;
            	endDateFlag = false;
            	$('#chooseBeginDate').html('请选择开始时间');
            	$('#chooseEndDate').html('请选择结束日期');
            }
			$("#timeType").html(timeList[param.value].type);
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
			},function(e){
			},{
				title: "请选择日期",
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		
		$("#submit").on('tap',function(){
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
			if(timeRadio=="0"){
				
				endDate =""+year+month+day+"235959";
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
				beginDate = ""+y+m+d+"000000";
			}
			if(timeRadio=="1"){
				endDate =""+year+month+day+"235959";
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
				beginDate = ""+y+m+d+"000000";
			}
			if(timeRadio=="2"){
				var today = ""+year+month+day+"235959";
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
					mui.alert("开始日期大于结束日期");
					return false;
				}
				if(parseInt(endDate)>parseInt(today)){
					mui.alert("结束日期不能大于今天");
					return false;
				}
				if(date2.getTime()-date1.getTime()>90*24*60*60*1000){
					mui.alert("起始日期不能超过90天!");
					return false;
				}
				if(nowdate.getTime()-date1.getTime()>365*24*60*60*1000){
					mui.alert("起始日期必须在一年内!");
					return false;
				}
				
			}
			
			
			var transferType = null;//转账类型 默认全部
			if(transferRadio=="0"){
				transferType = "";
			} else if(transferRadio=="1"){
				transferType = "1";
			} else if(transferRadio=="2"){
				transferType = "2";
			}
			var params = {"accountNo":currentAcct,
				"beginDate":beginDate,
				"endDate":endDate,
				"transferType":transferType
			};
			mbank.openWindowByLoad("transferDetailQuery.html",'transferDetailQuery','slide-in-right',{"params":params});
			
		});
		
		
	});
});