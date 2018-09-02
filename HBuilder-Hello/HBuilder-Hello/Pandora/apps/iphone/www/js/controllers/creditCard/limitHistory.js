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

	//信用卡列表
	var iAccountInfoList = [];
	var accountPickerList=[];
	//当前信用卡
	var currentAcct ="";
	var accountPicker ="";
	var cardType = "6";//用于查询所有信用卡所传参数
	var loadFlag = true; //首次加载标志
	var detailDiv = document.getElementById("detailDiv");
	//定义查询条件
	var cardNo;
	var queryTime;
	var noCheck;
	mui.init();
	mui.plusReady(function() {	
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
					cardNo = currentAcct;
				}
				//queryCridetSign(currentAcct);
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value];
				$("#cardNoShow").html(format.dealAccountHideFour(currentAcct.accountNo));     
        		$("#cardNo").val(currentAcct.accountNo);
        		cardNo = $("#cardNo").val();
        });
		
		
		var timePicker = new mui.SmartPicker({title:"请选择账单日",fireEvent:"timeChange"});
		
	
		/*jQuery("#limitTime").click(function(){
			showActionSheet();
		});*/
			var year = (new Date()).getFullYear();
			var liveMonth = (new Date()).getMonth();
			var liveDay = (new Date()).getDate();
			if(liveDay>10){
				liveMonth ++;
			}
			var month;
			var title = [];
			var upDate = [];
			var showMonth;
			for(var index = 0; index<13; index++){
				if(liveMonth-index > 0){
					month = liveMonth-index;
					yeay = year;
				}else if(liveMonth-index == 0 || index-liveMonth == 12){
					year --;
					month = 12;
				}else if(liveMonth-index < 0){
					month --;
				}
				if(month < 10){
					showMonth = "0"+month;
				}else{
					showMonth = month;
				}
				title[index] = year + "年"+showMonth+"月";
				upDate[index] = year+""+showMonth;
			}
			var timeData = [{
								value : 0,
								text : title[0]
							},{
								value : 1,
								text : title[1]
							},{
								value : 2,
								text : title[2]
							},{
								value : 3,
								text : title[3]
							},{
								value : 4,
								text : title[4]
							},{
								value : 5,
								text : title[5]
							},{
								value : 6,
								text : title[6]
							},{
								value : 7,
								text : title[7]
							},{
								value : 8,
								text : title[8]
							},{
								value : 9,
								text : title[9]
							},{
								value : 10,
								text : title[10]
							},{
								value : 11,
								text : title[11]
							},{
								value : 12,
								text : title[12]
							}];
			timePicker.setData(timeData);
			
			jQuery("#limitTime").on("tap",function(){
				document.activeElement.blur();
				timePicker.show();			
			});
			
			//不选取时间时自动获取当前最近月份
			doc.getElementById("dateTimeShow").innerText = title[0];
			queryTime = upDate[0];
			window.addEventListener("timeChange",function(event){
			 	var timeValue = event.detail;
			 	doc.getElementById("dateTimeShow").innerText = timeValue.text;
				jQuery("#dateTimeShow").val("");
				if(timeValue.value == 0){
					queryTime = upDate[0];
				}else if(timeValue.value == 1){
					queryTime = upDate[1];
				}else if(timeValue.value == 2){
					queryTime = upDate[2];
				}else if(timeValue.value == 3){
					queryTime = upDate[3];
				}else if(timeValue.value == 4){
					queryTime = upDate[4];
				}else if(timeValue.value == 5){
					queryTime = upDate[5];
				}else if(timeValue.value == 6){
					queryTime = upDate[6];
				}else if(timeValue.value == 7){
					queryTime = upDate[7];
				}else if(timeValue.value == 8){
					queryTime = upDate[8];
				}else if(timeValue.value == 9){
					queryTime = upDate[9];
				}else if(timeValue.value == 10){
					queryTime = upDate[10];
				}else if(timeValue.value == 11){
					queryTime = upDate[11];
				}else if(timeValue.value == 12){
					queryTime = upDate[12];
				}
			});
		/*function showActionSheet(){
			var year = (new Date()).getFullYear();
			var liveMonth = (new Date()).getMonth();
			var month;
			var title = [];
			var upDate = [];
			var showMonth;
			for(var index = 0; index<13; index++){
				if(liveMonth-index > 0){
					month = liveMonth-index;
					yeay = year;
				}else if(liveMonth-index == 0 || index-liveMonth == 12){
					year --;
					month = 12;
				}else if(liveMonth-index < 0){
					month --;
				}
				if(month < 10){
					showMonth = "0"+month;
				}else{
					showMonth = month;
				}
				title[index] = year + "年"+showMonth+"月";
				upDate[index] = year+""+showMonth;
			}
			var bts=[{title:title[0]},{title:title[1]},{title:title[2]},
														  {title:title[3]},{title:title[4]},{title:title[5]},
														  {title:title[6]},{title:title[7]},{title:title[8]},
														  {title:title[9]},{title:title[10]},{title:title[11]},
														  {title:title[12]}];
			plus.nativeUI.actionSheet({title:"日期选择",cancel:"取消",buttons:bts},
				function(e){
					//mui.alert("选择了\""+((e.index>0)?bts[e.index-1].title:"取消")+"\"");
					//mui.alert(e.index);
					doc.getElementById("dateTimeShow").innerHTML = ((e.index>0)?bts[e.index-1].title:"");
					queryTime = upDate[e.index-1];
					//mui.alert(queryTime);
				}
			);
		}*/
		
		doc.getElementById("limitList").addEventListener("tap",function(){
			noCheck = this.getAttribute("noCheck");
			//mui.alert(noCheck);
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			//mui.alert(id);
			
			
			if(null == queryTime || "" == queryTime){
				mui.alert("请选择查询日期");
			}if(null == cardNo || "" == cardNo){
				mui.alert("请选择信用卡卡号");
			}else{
				mbank.openWindowByLoad(path, id,  "slide-in-right",{cardNo:cardNo, queryTime:queryTime, noCheck:noCheck},true);
			}
		});
		
		/*var self = plus.webview.currentWebview();
		var frontView = plus.webview.getWebviewById("billManager");
		mui.back = function(){
			plus.webview.close(frontView);
			plus.webview.close(self);
		}
		
		//滑动
		window.addEventListener("swipe",function(e){
	    	var direction=e.detail.direction;
	    	if( direction=="right" ){
	    		plus.webview.getWebviewById("limitUnknowHistory").show();
	    		mui.fire(plus.webview.getWebviewById("billManager"),"changeMenu",{pageId:"limitUnknowHistory"});
	    	}
	    	if( direction=="left" ){
	    		plus.webview.getWebviewById("accountMaintain").show();
	    		mui.fire(plus.webview.getWebviewById("billManager"),"changeMenu",{pageId:"accountMaintain"});
	    	}	    	
	    });*/
		
	});
});