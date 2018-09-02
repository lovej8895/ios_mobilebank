define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	var payTypeArr = [{value: '000000010006010',text: '手机话费'},
					  {value: '000000010007010',text: '中国电信费'},
					  {value: '000000010008010',text: '水费'},
					  {value: '000000010020010',text: '电费'},
					  {value: '000000010018010',text: '中燃燃气费'},
					  {value: '000000010019010',text: 'ETC费'}];
	var chinaGasArr = [{value: '02',text: '宜昌市'}];
	var electricityArr = [{value: '05',text: '黄石市'},{value: '02',text: '宜昌市'},{value: '52000000',text: '武汉及省内其他地区'}];
	var etcArr = [{value: '01',text: '武汉市'}];
	var phoneArr =  [{value: '5200014201',text: '移动'},{value: '5200024201',text: '联通'},{value: '5200034201',text: '电信'}];
    var telecomArr = [{value: '05',text: '黄石市'},{value: '02',text: '宜昌市'}];
    var waterArr = [{value: '52000000',text: '武汉市'},{value: '02',text: '宜昌市'},{value: '52000001',text: '大冶市'},{value: '52000002',text: '公安县'},{value: '03',text: '五峰县'}];
    
    var currentAcct = "";
	var chargeTypeVar = "";
	var areaCode = "";
	var beginDateVar = "";
	var endDateVar = "";
	
	var params = "";
	var urlVar = "";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var accountPicker = new mui.SmartPicker({title:"请选择付款账户",fireEvent:"accountChange"});
		var chargeTypePicker = new mui.SmartPicker({title:"请选择缴费类型",fireEvent:"chargeTypeChange"});
		var chinaGasPicker = new mui.SmartPicker({title:"请选择缴费地区",fireEvent:"chinaGasChange"});
		var electricityPicker = new mui.SmartPicker({title:"请选择缴费地区",fireEvent:"electricityChange"});
		var etcPicker = new mui.SmartPicker({title:"请选择缴费地区",fireEvent:"etcChange"});
		var phonePicker = new mui.SmartPicker({title:"请选择号码类型",fireEvent:"phoneChange"});
		var telecomPicker = new mui.SmartPicker({title:"请选择缴费地区",fireEvent:"telecomChange"});
		var waterPicker = new mui.SmartPicker({title:"请选择缴费地区",fireEvent:"waterChange"});
		
		loadAccountList();
		PayTypeList();
		
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				var iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					var pickItem = {
						value:iAccountList[i].accountNo,
						text:iAccountList[i].accountNo
					};
					accountPickerList.push(pickItem);
				}
				
				accountPicker.setData(accountPickerList);
				
				currentAcct = iAccountList[0].accountNo;
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
        });	
		
		$("#beginDate").on("tap",function(){
			chooseDate("chooseBeginDate");
		});
		$("#endDate").on("tap",function(){
			chooseDate("chooseEndDate");
		});
		function chooseDate(thisId){
			var nowDate = new Date();
			var dDate = new Date();
			var minDate = new Date();
			minDate.setFullYear(nowDate.getFullYear() - 1, nowDate.getMonth(), nowDate.getDate());
			var maxDate = new Date();
			maxDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			if(thisId == "chooseBeginDate"){
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth()-1, nowDate.getDate());
			}else{
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			}
			plus.nativeUI.pickDate(function(e){
				var d=e.date;
				document.getElementById(thisId).innerText =d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				if(thisId == "chooseBeginDate"){
					beginDateVar = format.formatDate(d);
				}else{
					endDateVar = format.formatDate(d);
				}
			}, function(e) {
				mui.alert("您没有选择日期","温馨提示");
			}, {
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		
		function PayTypeList(){
			chargeTypePicker.setData(payTypeArr);
			
			chargeTypeVar = payTypeArr[0].value;
			document.getElementById("chargeType").innerText = payTypeArr[0].text;
			changeChargeType(chargeTypeVar);
			
			document.getElementById("typeView").addEventListener("tap",function(){
				chargeTypePicker.show();
			},false);
		}
		
		window.addEventListener("chargeTypeChange",function(event){
			chargeTypeVar = event.detail.value;
			document.getElementById("chargeType").innerText = event.detail.text;
			changeChargeType(chargeTypeVar);
        });
        
        function changeChargeType(thisChargeType){
			if(thisChargeType == "000000010020010"){
				electricityPicker.setData(electricityArr);
				areaCode = electricityArr[0].value;
				document.getElementById("electricityArea").innerText = electricityArr[0].text;
				document.getElementById("electricityAreaView").addEventListener("tap",function(){
					electricityPicker.show();
				},false);
				showAreaView("electricityAreaView");
			}else if(thisChargeType == "000000010008010"){
				waterPicker.setData(waterArr);
				areaCode = waterArr[0].value;
				document.getElementById("waterArea").innerText = waterArr[0].text;
				document.getElementById("waterAreaView").addEventListener("tap",function(){
					waterPicker.show();
				},false);
				showAreaView("waterAreaView");
			}else if(thisChargeType == "000000010006010"){
				phonePicker.setData(phoneArr);
				areaCode = phoneArr[0].value;
				document.getElementById("phoneArea").innerText = phoneArr[0].text;
				document.getElementById("phoneAreaView").addEventListener("tap",function(){
					phonePicker.show();
				},false);
				showAreaView("phoneAreaView");
			}else if(thisChargeType == "000000010007010"){
				telecomPicker.setData(telecomArr);
				areaCode = telecomArr[0].value;
				document.getElementById("telecomArea").innerText = telecomArr[0].text;
				document.getElementById("telecomAreaView").addEventListener("tap",function(){
					telecomPicker.show();
				},false);
				showAreaView("telecomAreaView");
			}else if(thisChargeType == "000000010018010"){
				chinaGasPicker.setData(chinaGasArr);
				areaCode = chinaGasArr[0].value;
				document.getElementById("chinaGasArea").innerText = chinaGasArr[0].text;
				document.getElementById("chinaGasAreaView").addEventListener("tap",function(){
					chinaGasPicker.show();
				},false);
				showAreaView("chinaGasAreaView");
			}else if(thisChargeType == "000000010019010"){
				etcPicker.setData(etcArr);
				areaCode = etcArr[0].value;
				document.getElementById("etcArea").innerText = etcArr[0].text;
				document.getElementById("etcAreaView").addEventListener("tap",function(){
					etcPicker.show();
				},false);
				showAreaView("etcAreaView");
			}
        }
        window.addEventListener("electricityChange",function(event){
			areaCode = event.detail.value;
			document.getElementById("electricityArea").innerText = event.detail.text;
        });
        window.addEventListener("waterChange",function(event){
			areaCode = event.detail.value;
			document.getElementById("waterArea").innerText = event.detail.text;
        });
         window.addEventListener("phoneChange",function(event){
			areaCode = event.detail.value;
			document.getElementById("phoneArea").innerText = event.detail.text;
        });
        window.addEventListener("telecomChange",function(event){
			areaCode = event.detail.value;
			document.getElementById("telecomArea").innerText = event.detail.text;
        });
        window.addEventListener("chinaGasChange",function(event){
			areaCode = event.detail.value;
			document.getElementById("chinaGasArea").innerText = event.detail.text;
        });
        window.addEventListener("etcChange",function(event){
			areaCode = event.detail.value;
			document.getElementById("etcArea").innerText = event.detail.text;
        });
       
		function showAreaView(thisType){
			document.getElementById("chinaGasAreaView").style.display = "none";
			document.getElementById("electricityAreaView").style.display = "none";
			document.getElementById("etcAreaView").style.display = "none";
			document.getElementById("phoneAreaView").style.display = "none";
			document.getElementById("telecomAreaView").style.display = "none";
			document.getElementById("waterAreaView").style.display = "none";
			document.getElementById(thisType).style.display = "block";
		}
	
		document.getElementById("queryBtn").addEventListener("tap",function(){
			if(currentAcct == '' || currentAcct == null || currentAcct == undefined || currentAcct.length == 0){
				mui.alert('请选择付款账号',"温馨提示");
				return false;
			}
			if(chargeTypeVar == '' || chargeTypeVar == null || chargeTypeVar == undefined || chargeTypeVar.length == 0){
				mui.alert('请选择缴费类型',"温馨提示");
				return false;
			}
			if(areaCode == '' || areaCode == null || areaCode == undefined || areaCode.length == 0){
				mui.alert('请选择缴费地区',"温馨提示");
				return false;
			}
			if(beginDateVar == '' || beginDateVar == null || beginDateVar == undefined || beginDateVar.length == 0){
				mui.alert('请选择起始日期',"温馨提示");
				return false;
			}
			if(endDateVar == '' || endDateVar == null || endDateVar == undefined || endDateVar.length == 0){
				mui.alert('请选择终止日期',"温馨提示");
				return false;
			}
			var range = format.dateRange(beginDateVar,endDateVar);
			if(range < 0){
				mui.alert('结束日期不能比开始日期小',"温馨提示");
				return;
			}else if(range >90){
				mui.alert('起止日期范围不能超过3个月',"温馨提示");
				return;
			}
			params = {
				"accountNo" : currentAcct,
				"chargeType" : chargeTypeVar,
				"areaId" : areaCode,
				"beginDate" : beginDateVar,
				"endDate" : endDateVar
			};
			mbank.openWindowByLoad('../feePayment/feePaymentHistoryList.html','feePaymentHistoryList','slide-in-right',params);
		},false);
		
		mui.back=function(){
			plus.webview.close(plus.webview.getWebviewById("feePaymentChargeResult"));
			plus.webview.close(plus.webview.currentWebview());
		}
		
		mbank.resizePage(".btn_bg_f2");
	});
});