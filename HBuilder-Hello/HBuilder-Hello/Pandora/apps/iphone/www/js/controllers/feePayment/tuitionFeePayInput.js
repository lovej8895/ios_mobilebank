define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	
	var self = "";//获取上个页面传过来的参数
    var chargeType = "";

    var accountName = "";
    var currentAcct;//当前账户
    var balance = 0;//当前账户
    var urlVar = "";//交易地址
    //var moneyCheckFlag = false;
    
    
    var areaNam = "";//地区名称
	var areaNo = "";//地区编号
	var unitNam  = "";//单位名称
	var unitNo = "";//单位代码
    
    var batNo = "";//批次编号
    var batSts = "";//批次状态
    var payNo = "";//缴费编号
    var studNam = "";//缴费姓名
    var eve = "";//校验结果
    var tutionBatch = [];//批次集合
    var params;//参数列表
    
	mui.init();//页面初始化
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		//获取当前窗口对象
		self = plus.webview.currentWebview();
		
		areaNam = self.areaNam;
		areaNo = self.areaNo;
		unitNam = self.unitNam;
		unitNo = self.unitNo;
		chargeType = self.chargeType;
		//用户姓名
		accountName = userInfo.get("session_customerNameCN");
		
		document.getElementById("areaNam").innerText = areaNam;
		document.getElementById("unitNam").innerText = unitNam;
		
		loadAccountList();//选择付款账号
		queryBatNo();//查询批次
		function queryBatNo(){
			urlVar = mbank.getApiURL()+'003008_batch_tuition.do';//交易地址
			//参数
			params = {
				"AreaNo" : areaNo,
				"UnitNo" : unitNo
			};
			//发送交易
			mbank.apiSend("post",urlVar,params,queryBatNoFunc,queryBatNoFailFunc,true);
			function queryBatNoFunc(dataBatNo){
				if(dataBatNo.ec == "000"){
					var tutionBatchA = dataBatNo.tutionBatch;
					for(var i=0;i<tutionBatchA.length;i++){
						var pickItem = {
							"value":tutionBatchA[i].BatSts,
							"text":tutionBatchA[i].BatNo
						};
						tutionBatch.push(pickItem);
					}
					BatNoInit();
				}else{
					mui.alert(dataBatNo.em,"温馨提示");
					return;
				}
			}
			function queryBatNoFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		}
		
		//点击弹出缴费批次选择框
		function BatNoInit(){
			var BatNoPickerList = new mui.SmartPicker({title:"请选择缴费批次",fireEvent:"batNoEvent"});
			BatNoPickerList.setData(tutionBatch);
			document.getElementById("BatNoLi").addEventListener("tap",function(){
				BatNoPickerList.show();
			},false);
			document.getElementById("BatNoPicker").innerText = "请选择缴费批次" ;
		}
		
		//选择项的点击事件
		window.addEventListener("batNoEvent",function(event){
			batNo = event.detail.text;
			batSts = event.detail.value;
			document.getElementById("BatNoPicker").innerText = event.detail.text;
        });
		
		
		//加载当前账号
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				var iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					var pickItem = {
						"value":iAccountList[i].accountNo,
						"text":iAccountList[i].accountNo
					};
					accountPickerList.push(pickItem);
				}
				var accountPicker = new mui.SmartPicker({title:"请选择付款账户",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
					
				currentAcct = iAccountList[0].accountNo;
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				myAcctInfo.queryAccAmt(currentAcct,"balance",true);//查询余额
				getBalance();
				
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			myAcctInfo.queryAccAmt(currentAcct,"balance",true);//查询余额
        	getBalance();
		});
		
		//获取余额
		function getBalance(){
			urlVar = mbank.getApiURL()+'newBalanceQuery.do';
			params = {
				"accountNo" : currentAcct
			};
			mbank.apiSend("post",urlVar,params,newBalanceQuerySucFunc,newBalanceQueryFailFunc,true);
			function newBalanceQuerySucFunc(data){
				if(data.ec =="000"){
					if(data.balance){
						balance = parseFloat(data.balance);
					}
				}else{
					mui.alert(data.em,"温馨提示");
					return;
				}
			}
			function newBalanceQueryFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		}
		
		//去除特定字符
		function ignoreChar(string,char) {
			var temp = "";
			string = '' + string;
			splitstring = string.split(char);
			for(i = 0; i < splitstring.length; i++)
			temp += splitstring[i];
			return temp;
		}
		
		//格式化姓名，隐藏第一个字
		function formatName(name) {
			var nameT;
			if (name != null && typeof name !== "string") {
				name = name.toString();
			}
			if (name == '' || name == null || name == undefined) {
				return '';
			} else {
				var temp;
				name = ignoreChar(name, " ");
				var last = name.substring(1, name.length);
				nameT = '*' + last;
			}
			return nameT;
		}
		
		//去除空格
		function removeAllSpace(str){
			return str.replace(/\s|\xA0/g,"");
		}
		
		//查询姓名
		function queryStudNam(eee){
			
			if(batNo == null || batNo =="" || batNo == undefined){
				mui.alert("请选择缴费批次","温馨提示");
				return;
			}
			
			payNo = document.getElementById("PayNoInput").value.trim();//缴费编号
			payNo = removeAllSpace(payNo);
			document.getElementById("PayNoInput").value = payNo;
			payNo = payNo.toUpperCase();
			if(payNo == null || payNo =="" || payNo == undefined){
				mui.alert("请输入正确的缴费编号","温馨提示");
				return;
			}
			
			params = {
				"UnitNo":unitNo,
				"AreaNo":areaNo,
				"payNo":payNo,
				"BatNo":batNo
			};
			urlVar = mbank.getApiURL()+'003008_search_name.do';//交易地址
			//发送交易
			mbank.apiSend("post",urlVar,params,queryStudNamFunc,queryStudNamFailFunc,true);
			function queryStudNamFunc(studNamData){
				if(studNamData.ec == "000"){
					studNam = studNamData.StudNam;
					if(studNam){
						//eee.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
						var btnArray = ['确定', '取消'];
						mui.prompt('缴费姓名：'+formatName(studNam), '请输入完整的姓名，确保资金安全', '温馨提示', btnArray, function(event) {
							if (event.index == 0) {
								var studNamA = event.value;
								queryProject(studNamA);
							}else{
								return;
							}
						},'div');
						document.querySelector('.mui-popup-input').style.width = '80%';
						document.querySelector('.mui-popup-input').style.margin = '0 auto';
						document.querySelector('.mui-popup-title').style.textAlign = 'center';
					}
				}else{
					mui.alert(studNamData.em,"温馨提示");
					return;
				}
			}
			function queryStudNamFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		}
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
        
		document.getElementById("nextBtn").addEventListener("tap",function(e){
			queryStudNam();
		},false);
		
		function queryProject(studNamA){
			
			if(studNamA == null || studNamA =="" || studNamA == undefined){
				mui.alert("请补全正确的姓名","温馨提示");
				return;
			}
			
			params = {
				"UnitNo":unitNo,
				"AreaNo":areaNo,
				"payNo":payNo,
				"StudNam" : studNamA,
				"BatNo" : batNo
			}
			urlVar = mbank.getApiURL()+'003008_name_tuition.do';//交易地址
			//发送交易
			mbank.apiSend("post",urlVar,params,checkStudNamFunc,checkStudNamFailFunc,true);
			function checkStudNamFunc(checkData){
				if(checkData.ec == "000"){
					eve = checkData.Eve;
					if(eve=="0"){
						params ={
							"chargeType":chargeType,
							"AreaNam": areaNam,
							"AreaNo" : areaNo,
							"UnitNam" : unitNam,
							"UnitNo" : unitNo,
							"BatNo" : batNo,
							"BatSts" : batSts,
							"payNo" : payNo,
							"StudNam" : studNamA,
							"Eve" : eve,
							"currentAcct" : currentAcct,
							"balance" : balance
						};
						mbank.openWindowByLoad('../feePayment/tuitionFeePayInputNext.html','tuitionFeePayInputNext','slide-in-right',params);
					}else{
						mui.alert(checkData.em+",请确认输入姓名是否正确","温馨提示");
						return;
					}
					
				}else{
					mui.alert(checkData.em+",请确认输入姓名是否正确","温馨提示");
					return;
				}
			}
			
			function checkStudNamFailFunc(e){
				mui.alert(e.em+",请确认输入姓名是否正确","温馨提示");
				return;
			}
		}
		
		mbank.resizePage(".btn_bg_f2");//上一步，下一步按钮大小
	});
});