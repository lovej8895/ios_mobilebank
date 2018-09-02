/*
 * 完成已出账单查询功能：
 * 1.信用卡帐号查询
 * 2.根据帐号与时间进行查询
 */
define(function(require, exports, module) {
	var doc = document;
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');

	//操作列表
	var typeList = [{'key':'全部','value':'0'},
					{'key':'登录签退','value':'PB'},
					{'key':'我的账户','value':'001'},
					{'key':'转账汇款','value':'002'},
					{'key':'网上缴费','value':'003'},
					{'key':'我的支付','value':'004'},
					{'key':'个人贷款','value':'005'},
					{'key':'信用卡','value':'007'},
					{'key':'理财产品','value':'009'},
					{'key':'我的储蓄','value':'025'},
					{'key':'我的网银','value':'026'},
					{'key':'安全中心','value':'027'}
					];
	var accountPickerList=[];
	//当前信用卡
	var accountPicker ="";
	var beginTime;
	var endTime;
	var detailDiv = document.getElementById("detailDiv");
	var noCheck;
	mui.init();
	mui.plusReady(function() {	
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		$("#operationShow").html(typeList[0].key);
		$("#operationValue").val(typeList[0].value);
		getPickerList(typeList);
	
		function getPickerList(typeList){
			if( typeList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<typeList.length;i++ ){
					var account=typeList[i];
					var pickItem={
						value:typeList[i].value,
						text:typeList[i].key
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择操作类型",fireEvent:"oprationType"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("oprationType",function(event){
                var param=event.detail;
				$("#operationShow").html(param.text);     
        		$("#operationValue").val(param.value);
        });
        
        
        $("#beginDate").on("tap",function(){
				chooseDate($("#beginTime"),1);
				console.log("++++"+beginTime);
		});
        
         $("#endDate").on("tap",function(){
				chooseDate($("#endTime"),2);
				console.log("++++"+endTime);
		});
		
		var nowTime = new Date();
		var initEndDate = "";
		if( (nowTime.getMonth()+1)<10 ) {
			initEndDate += nowTime.getFullYear()+"-0"+(nowTime.getMonth()+1)
		}else{
			initEndDate += nowTime.getFullYear()+"-"+(nowTime.getMonth()+1)
		}
		//console.log(nowTime.getDate());
		if( nowTime.getDate()<10 ){
			initEndDate += "-0"+nowTime.getDate();
		}else{
			initEndDate += "-"+nowTime.getDate();
		}
		//console.log(initEndDate);
			var initBeginDate = getLastMonthYestdy(nowTime);
			$('#beginTime').html(initBeginDate);
			$('#endTime').html(initEndDate);
			if((nowTime.getMonth() + 1) < 10) {
				endTime = nowTime.getFullYear() + '0' + (nowTime.getMonth() + 1);
				if(nowTime.getDate() < 10) {
					endTime += '0' + nowTime.getDate() + '235959';
				} else {
					endTime += nowTime.getDate() + '235959';
				}
			
			} else {
				endTime = nowTime.getFullYear() + "" + (nowTime.getMonth() + 1);
				if(nowTime.getDate() < 10) {
					endTime += '0' + nowTime.getDate() + '235959';
				} else {
					endTime += nowTime.getDate() + '235959';
				}
			
			}
				
			
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
		 	if( strMonth<10 ){
		 		datastr = strYear + "-0" + strMonth;
		 	}else{
		 		datastr = strYear + "-" + strMonth;
		 	}
		 	if( strDay<10){
		 		datastr += "-0" + strDay;
		 	}else{
		 		datastr += "-" + strDay;
		 	}
		 	//datastr = strYear + "-" + strMonth + "-" + strDay;
		 	if(strMonth<10){
		 		if( strDay<10 ){
		 			beginTime = strYear+'0'+strMonth+'0'+strDay+'000000';
		 		}else{
		 			beginTime = strYear + '0' + strMonth + strDay + '000000';
		 		}
		 		
		 	}else{
		 		if( strDay<10 ){
		 			beginTime = strYear+""+strMonth+'0'+strDay+'000000';
		 		}else{
		 			beginTime = strYear+""+strMonth+strDay+'000000';
		 		}
		 		
		 	}
		 	return datastr;
		 }
        
        //调取默认时间表
		function chooseDate(choosedom,dateFlag){
			var dDate = new Date();
			var choosedate;
			var minDate = new Date();
			var nowDate = new Date();
			var maxDate = new Date();
			minDate.setFullYear(nowDate.getFullYear() - 1, nowDate.getMonth(), nowDate.getDate());
			maxDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			if(choosedom.attr('id')=='beginTime'){
//				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth()-1, nowDate.getDate());
				dDate = new Date(getLastMonthYestdy(nowDate));
			} else {
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth()+1, nowDate.getDate());
			}
			
			plus.nativeUI.pickDate( function(e){
				var d=e.date;
				if( (d.getMonth()+1)<10 ){
					choosedate = d.getFullYear()+"-0"+(d.getMonth()+1);
				}else{
					choosedate = d.getFullYear()+"-"+(d.getMonth()+1);
				}
				if( d.getDate()<10 ){
					choosedate += "-0"+d.getDate();
				}else{
					choosedate += "-"+d.getDate();
				}
				
				choosedom.text(choosedate);
				if(choosedom.attr('id')=='beginTime'){
					if((d.getMonth()+1)<10){
						if( d.getDate()<10 ){
							beginTime = d.getFullYear()+'0'+(d.getMonth()+1)+'0'+d.getDate()+'000000';
						}else{
							beginTime = d.getFullYear()+'0'+(d.getMonth()+1)+d.getDate()+'000000';
						}
						
					}else{
						if( d.getDate()<10 ){
							beginTime = d.getFullYear()+''+(d.getMonth()+1)+'0'+d.getDate()+'000000';
						}else{
							beginTime = d.getFullYear()+""+(d.getMonth()+1)+d.getDate()+'000000';
						}
					}
				}else{
					if((d.getMonth()+1)<10){
						if( d.getDate()<10 ){
							endTime = d.getFullYear()+'0'+(d.getMonth()+1)+'0'+d.getDate()+'235959';
						}else{
							endTime = d.getFullYear()+'0'+(d.getMonth()+1)+d.getDate()+'235959';
						}
				 		
				 	}else{
				 		if( d.getDate()<10 ){
							endTime = d.getFullYear()+''+(d.getMonth()+1)+'0'+d.getDate()+'235959';
						}else{
				 			endTime = d.getFullYear()+""+(d.getMonth()+1)+d.getDate()+'235959';
				 		}
					}
				}
				
			},function(e){
			},{
				title: "请选择日期",
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		
		
		doc.getElementById("logDetail").addEventListener("tap",function(){
			noCheck = this.getAttribute("noCheck");
			//mui.alert(noCheck);
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			//mui.alert(id);
			var operationType = document.getElementById("operationValue").value;
			console.log(beginTime+"  "+endTime);
			if(beginTime>endTime){
				mui.alert("开始时间不能大于结束时间");
				return;
			}
			if( parseInt(endTime.substring(0,4))-parseInt(beginTime.substring(0,4)) >2 ){
				//console.log("11111111111");
				mui.alert("时间间隔不能大于90天");
				return;
			}
			//console.log(((12-parseInt(beginTime.substring(4,6)))*30 + 30-parseInt(beginTime.substring(6,8)) +(parseInt(endTime.substring(4,6))-1)*30+parseInt(endTime.substring(6,8))));
			if( parseInt(endTime.substring(0,4))-parseInt(beginTime.substring(0,4)) ==1 ){
				if( ((12-parseInt(beginTime.substring(4,6)))*30 + 30-parseInt(beginTime.substring(6,8)) +(parseInt(endTime.substring(4,6))-1)*30+parseInt(endTime.substring(6,8)))>90 ){
					//console.log("222222222222");
					mui.alert("时间间隔不能大于90天");
					return;
				}
			}
			if( ( parseInt(endTime.substring(4,6)) - parseInt(beginTime.substring(4,6)) )*30 +(parseInt(endTime.substring(6,8))-parseInt(beginTime.substring(6,8))) >90 ){
				//console.log( parseInt(endTime.substring(6,8)) );
				//console.log(  parseInt(beginTime.substring(6,8)));
				//console.log( parseInt(endTime.substring(6,8))-parseInt(beginTime.substring(6,8))  );
				//console.log("333333333");
				mui.alert("时间间隔不能大于90天");
				return;
			}
			mbank.openWindowByLoad(path, id,  "slide-in-right",{beginDate:beginTime, endDate:endTime,businessCode:operationType, noCheck:noCheck});
			/*if(null == queryTime || "" == queryTime){
				mui.alert("请选择查询日期");
			}else if(null == cardNo || "" == cardNo){
				mui.alert("请选择信用卡卡号");
			}else{
				mbank.openWindowByLoad(path, id,  "slide-in-right",{cardNo:cardNo, queryTime:queryTime, noCheck:noCheck});
			}*/
		});
		
	});
});