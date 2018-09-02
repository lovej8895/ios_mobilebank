define(function(require, exports, module) {
	//限额设置
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	//绑定账号列表
	var iAccountInfoList = [];
	//当前选定账号
	var currentAcct="";
	
	var accountPickerList=[];
    var accountPicker;
	var EBsingleMax;//银行设置单笔交易限额
	var EBdayMax;//银行设置日累计交易限额
	var simCode;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
//		mbank.resizePage('#submit');
		commonSecurityUtil.initSecurityData('027002',self);
		queryDefaultAcct();
		
		function queryDefaultAcct() {
			var url = mbank.getApiURL() + 'showAccountLimitManagePage.do';
			var params = {};
			mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			function successCallback(data){
				EBsingleMax = data.EBsingleMax;
				EBdayMax = data.EBdayMax;
				iAccountInfoList = data.IAccountLimitDetail;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				//将第一张卡引入界面
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					$("#oneLimit").val(iAccountInfoList[0].singleMax);
					$("#dayLimit").val(iAccountInfoList[0].dayMax);
				} else {
					mui.alert('未查询到可操作的卡');
				}
			}
			
		}
		
		function errorCallback(data){
			mui.alert(data.em);
		}
		
		
		//根据所选账号来获取相应信息
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
//				accountPicker = new mui.PopPicker();
				accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
			/*accountPicker.show(function(items) {
				var pickItem=items[0];
				currentAcct=iAccountInfoList[pickItem.value].accountNo;
				$('#accountNo').html(format.dealAccountHideFour(currentAcct));
				$("#oneLimit").val(iAccountInfoList[pickItem.value].singleMax);
				$("#dayLimit").val(iAccountInfoList[pickItem.value].dayMax);
			});		*/
			document.activeElement.blur();
			accountPicker.show();	
		});
		
		window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				$("#oneLimit").val(iAccountInfoList[param.value].singleMax);
				$("#dayLimit").val(iAccountInfoList[param.value].dayMax);
        });
		
		$("#oneLimit").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#oneLimit").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
		
		$("#dayLimit").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#dayLimit").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
		
		
		
		$("#submit").on('tap',function(){
			var oneLimit = parseFloat(format.ignoreChar($("#oneLimit").val(),','));
			var dayLimit = parseFloat(format.ignoreChar($("#dayLimit").val(),','));
			var regLimit1 = /^([0-9]+(\.+))[0-9]+$/;//简单判断是否为数字
			var regLimit2 = /^[0-9]+$/;
			if($('#oneLimit').val()==''){
				mui.alert("单笔限额为空或格式错误");
				return false;
			}
			if($('#dayLimit').val() ==''){
				mui.alert("日累计限额为空或格式错误");
				return false;
			}
			
			
			if(!regLimit1.test(oneLimit)&&!regLimit2.test(oneLimit)){
				mui.alert("单笔限额输入格式错误!");
				return false;
			}
			if(!regLimit1.test(dayLimit)&&!regLimit2.test(dayLimit)){
				mui.alert("日累计限额输入格式错误!");
				return false;
			}
			
			
			
			var accLimitUrl = mbank.getApiURL() + 'queryAccLimit.do';
			var updateLimit = mbank.getApiURL() + 'updateAccountLimit.do';
			if(oneLimit>parseFloat(EBsingleMax)){
				mui.alert("单笔限额大于银行单笔限额");
				return false;
			}
			if(dayLimit>parseFloat(EBdayMax)){
				mui.alert("日累计限额大于银行日累计限额");
				return false;
			}
			if(parseFloat(oneLimit)>parseFloat(dayLimit)){
				mui.alert("单笔限额大于日累计限额");
				return false;
			}
			var params = {accountNo:currentAcct};
			//获取账号限额
			mbank.apiSend("post",accLimitUrl,params,accLimitSuccessCallback,errorCallback,true);
			function accLimitSuccessCallback(data){
				if(oneLimit>parseFloat(data.EBsingleMax)){
					mui.alert("单笔限额大于账户单笔限额");
					return false;
				}
				if(dayLimit>parseFloat(data.EBdayMax)){
					mui.alert("日累计限额大于账户日累计限额");
					return false;
				}
				//上送数据为数组格式
				var limitParams = {
					'smsPassword':$("#identifyCode").val(),
					'IAccountLimitDetail.accountNo':[],
					'IAccountLimitDetail.singleMax':[],
					'IAccountLimitDetail.dayMax':[]
				};
				limitParams['IAccountLimitDetail.accountNo'].push(currentAcct);
				limitParams['IAccountLimitDetail.singleMax'].push(oneLimit);
				limitParams['IAccountLimitDetail.dayMax'].push(dayLimit);
				
				/*var limitParams = {
					'smsPassword':$("#identifyCode").val(),
					IAccountLimitDetail:[{accountNo:currentAcct,singleMax:oneLimit,dayMax:dayLimit}]
				}*/
				
				commonSecurityUtil.apiSend("post",updateLimit,limitParams,function(data){
					var msg = {title:"限额设置",value:"转账限额设置成功"};
					mbank.openWindowByLoad('msgSetOK.html','msgSetOK','slide-in-right',{params:msg});
				},errorCallback,true);
			}
			
			
		});
		
		mbank.resizePage(".btn_bg_f2");
	});
});