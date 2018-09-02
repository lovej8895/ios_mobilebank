define(function(require, exports, module) {
	var doc = document;
	// 引入依赖
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	//类别
	var typeList = [{'key':'聚会','value':'0'},
					{'key':'会议','value':'1'},
					{'key':'节日','value':'2'},
					{'key':'其他','value':'3'}					
					];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var self=plus.webview.currentWebview();
		
		var topic;
		var type = $("#type").text();
		var dateTime;
		var remark;
		var liveTime; 
		$("#typeShow").html(typeList[0].key);
		$("#typeValue").val(typeList[0].value);
		
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
				$("#typeShow").html(param.text);     
        		$("#typeValue").val(param.value);
        });
    
    	 $("#endDate").on("tap",function(){
				chooseDate($("#endTime"),2);
		});
		
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
		 	if(strMonth<10){
		 		beginTime = strYear+'0'+strMonth+strDay+'000000';
		 	}else{
		 		beginTime = strYear+strMonth+strDay+'000000';
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
			minDate.setFullYear(nowDate.getFullYear()-1, nowDate.getMonth(), nowDate.getDate());
			maxDate.setFullYear(nowDate.getFullYear()+2, nowDate.getMonth(), nowDate.getDate());
			if(choosedom.attr('id')=='beginTime'){
//				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth()-1, nowDate.getDate());
				dDate = new Date(getLastMonthYestdy(nowDate));
			} else {
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			}
			
			plus.nativeUI.pickDate( function(e){
				var d=e.date;
				choosedate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				choosedom.text(choosedate);
				if(choosedom.attr('id')=='beginTime'){
					if((d.getMonth()+1)<10){
						beginTime = d.getFullYear()+'0'+(d.getMonth()+1)+d.getDate()+'000000';
					}else{
						beginTime = d.getFullYear()+(d.getMonth()+1)+d.getDate()+'000000';
					}
				}else{
					if((d.getMonth()+1)<10){
				 		endTime = d.getFullYear()+'0'+(d.getMonth()+1)+d.getDate()+'235959';
				 	}else{
				 		endTime = d.getFullYear()+(d.getMonth()+1)+d.getDate()+'235959';
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
		
	
		var affairDate=self.affairDate;
		if( affairDate==undefined ){
			affairDate=format.formatDate(new Date());
		}	
		$('#affairDate').html(affairDate);
        $("#affairDate").on("tap",function(){
			plus.nativeUI.pickDate( function(e){
				var date=e.date;
                $("#affairDate").html(format.formatDate(date));
		    },function(e){
			    
			});	
        });			
		

		
		getVal = function(elem){
			var typeVal = elem.getElementsByTagName("span")[0].innerHTML;
			typeVal = typeVal.replace(/&nbsp;/gi,'');
			type = doc.getElementById('type');
			
			type.innerHTML = typeVal;
			type = $("#type").text();
			mui('.mui-popover').popover('toggle');
		}
		
		
		//确定添加事务按钮
		doc.getElementById('confirm').addEventListener("tap",function(){
			topic = doc.getElementById('topic').value;
			dateTime = $('#affairDate').html();
			remark = doc.getElementById('remark').value;
			dateTime = (new Date(dateTime)).Format("yyyyMMdd");
			var affairType=doc.getElementById('typeValue').value
			console.log(dateTime);
			if(!checkAffairInfo()){
				return false;
			}
						
			var affairInfo = {
				channel : "1",
				affairType : affairType,
				affairTopic : topic,
				affairDate  : dateTime,
				affairRemark: remark,
			};
			var url = mbank.getApiURL() + 'ebankAddRemind.do';
			mbank.apiSend('post', url, affairInfo, addfun, adderrorfun, true,false);
				
		}, false);
		
		//事务信息添加检查
		function checkAffairInfo(){
			if (topic.IsEmpty()) {
				mui.alert("主题不能为空");
				return false;
			}
			if ("-请选择类别-"==type){
				mui.alert("请选择类别");
				return false;
			}
			if (dateTime=="NaN0NaN0NaN" || dateTime.IsEmpty()){
				mui.alert("请选择日期");
				return false;
			}		
			var day = new Date();
			var CurrentDate = day.Format("yyyyMMdd");
/*			if(dateTime <= CurrentDate){		
				mui.alert('所选日期不能小于等于当前日期');
				return false;
			}*/
			
			return true;
		}
		
		//插入成功回调函数
		function addfun(){
			//跳转下一页面，如果需要结果页面可注释下面的，放开这段代码
			/*var confirm = doc.getElementById("confirm");
			var noCheck = confirm.getAttribute("noCheck");
			var path = confirm.getAttribute("path");
			var id = confirm.getAttribute("id");
			mbank.openWindowByLoad(
    			path,
    			id,
    			"slide-in-right",
				{noCheck:noCheck}
  			);*/
  			if(plus.webview.getWebviewById('affairRemind')){
				mui.fire(plus.webview.getWebviewById("affairRemind"),"reload",{});
			}
  			mui.alert("添加提醒成功","温馨提示","确认",function(){
				plus.webview.currentWebview().close();
			});
		}
		
		//插入失败回调函数
		function adderrorfun(data){
			mui.alert(data.em);
		}
		
        	

		});
	
		
		
		
});