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
	//当前选定交易类型
	var currentTransType = "";
	
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		$("#transType").html("全部");
		var firstDate = new Date();
		firstDate.setDate(1);
		var currentDate = new Date();
		var beginDate = format.formatDate(firstDate);
		var endDate = format.formatDate(currentDate);
		$("#beginDate").html(beginDate);
		$("#endDate").html(endDate);
		
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack, "2");
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
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
				accountPicker = new mui.SmartPicker({title:"请选择银行账号",fireEvent:"accountNo"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
//			accountPicker.show(function(items) {
//				var pickItem=items[0];
//				currentAcct=iAccountInfoList[pickItem.value].accountNo;
//				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
//			});
			document.activeElement.blur();
			accountPicker.show();
		});
		window.addEventListener("accountNo",function(event){
			var pickItem=event.detail;
			currentAcct=iAccountInfoList[pickItem.value].accountNo;
			$("#accountNo").html(format.dealAccountHideFour(currentAcct));
		});
		
		//选择交易类型
		var userPicker = new mui.SmartPicker({title:"请选择交易类型",fireEvent:"transType"});
		userPicker.setData([{
			value: '',
			text: '全部'
		}, {
			value: '130',
			text: '产品认购'
		}, {
			value: '122',
			text: '产品申购'
		}, {
			value: '124',
			text: '产品赎回'
		}, {
			value: '135',
			text: '快速赎回'
		}, {
			value: '152',
			text: '交易撤单'
		}, {
			value: '144',
			text: '红利下发'
		}, {
			value: '150',
			text: '产品终止'
		}]);
		
//		var showUserPickerButton = document.getElementById('changeTransType');
//		showUserPickerButton.addEventListener('tap', function(event) {
//			userPicker.show(function(items) {
//				currentTransType = items[0].value;
//				$("#transType").html(items[0].text);
//			});
//		}, false);

		$("#changeTransType").on("tap",function(){
			document.activeElement.blur();
			userPicker.show();			
		});
		window.addEventListener("transType",function(event){
			var currentTransType1=event.detail;
			currentTransType = currentTransType1.value;
			document.getElementById("transType").innerHTML = currentTransType1.text;
			
		});
		
		//选择起始日期
		var changeBeginDate = document.getElementById('changeBeginDate');
		changeBeginDate.addEventListener('tap', function(event) {
			plus.nativeUI.pickDate( function(e){
				var dStr = format.formatDate(e.date);
				$("#beginDate").html(dStr);
			});
		}, false);
		
		//选择终止日期
		var changeEndDate = document.getElementById('changeEndDate');
		changeEndDate.addEventListener('tap', function(event) {
			plus.nativeUI.pickDate( function(e){
				var dStr = format.formatDate(e.date);
				$("#endDate").html(dStr);
			});
		}, false);
		
		$("#queryButton").click(function(){
			var currentBeginDate = $("#beginDate").html().replaceAll("-","");
			var currentEndDate = $("#endDate").html().replaceAll("-","");
			if( currentBeginDate > currentEndDate ){
				mui.alert("起始日期不能大于终止日期！");
				return false;
			}
			
			if(currentBeginDate == '' || currentBeginDate == null || currentBeginDate == undefined || currentBeginDate.length == 0){
				mui.alert('请选择起始日期',"温馨提示");
				return false;
			}
			if(currentEndDate == '' || currentEndDate == null || currentEndDate == undefined || currentEndDate.length == 0){
				mui.alert('请选择终止日期',"温馨提示");
				return false;
			}
			var range = format.dateRange(format.parseDate(currentBeginDate),format.parseDate(currentEndDate));
			if(range < 0){
				mui.alert('结束日期不能比开始日期小',"温馨提示");
				return;
			}else if(range >90){
				mui.alert('起止日期范围不能超过3个月',"温馨提示");
				return;
			}	
		    var params = {
		    	accountCardNo : currentAcct,
		    	beginDate : currentBeginDate,
		    	endDate : currentEndDate,
		    	transType : currentTransType
		    };
		    mbank.openWindowByLoad('transactionMain.html','transactionMain','slide-in-right',params);
		});
	});
});