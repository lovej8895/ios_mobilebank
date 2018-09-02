define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	//开户行名称
	var bankNameCN ="";
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		/*******页面加载还款金额类型默认设置********/
		$("#payAmountTypeShow").html("本期全额还款");
		$("#payAmountType").val("F");//初始化默认全额还款
		
		var contextData = plus.webview.currentWebview();
		$("#recAccount").text(contextData.recAccount);
		
		//选择还款金额类型
		var userPicker = new mui.SmartPicker({title:"请选择还款金额类型",fireEvent:"payAmountType"});
			userPicker.setData([{
				value: 'F',
				text: '本期全额还款'
			}, {
				value: 'M',
				text: '本期最低还款额还款'
			}]);
			
			$("#changePayAmountType").on("tap",function(){
				document.activeElement.blur();
				userPicker.show();
			});
			
			window.addEventListener("payAmountType",function(event){
			   var payamttypevalue=event.detail;
			   document.getElementById("payAmountTypeShow").innerHTML = payamttypevalue.text;
			   //清除还款金额类型
				$("#payAmountType").val("");
				if (payamttypevalue.value == "F") {
					$("#payAmountType").val(payamttypevalue.value);
				}else if(payamttypevalue.value == "M"){
					$("#payAmountType").val(payamttypevalue.value);
				}
			});

			
			//借记卡开户行
			var userPicker1 = new mui.SmartPicker({title:"请选择借记卡开户行",fireEvent:"bankSelect"});
			userPicker1.setData([{
				value: '102100099996',
				text: '工商银行'
			}, {
				value: '103100000026',
				text: '农业银行'
			}, {
				value: '104100000004',
				text: '中国银行'
			}, {
				value: '105100000017',
				text: '建设银行'
			}, {
				value: '301290000007',
				text: '交通银行'
			}, {
				value: '403100000004',
				text: '邮储银行'
			}, {
				value: '303100000006',
				text: '光大银行'
			}, {
				value: '302100011000',
				text: '中信银行'
			}, {
				value: '310290000013',
				text: '浦发银行'
			}, {
				value: '309391000011',
				text: '兴业银行'
			}, {
				value: '325290000012',
				text: '上海银行'
			}, {
				value: '307584007998',
				text: '平安(深发)银行'
			}]);

			$("#changebankSelect").on("tap",function(){
				document.activeElement.blur();
				userPicker1.show();
			});
			
			window.addEventListener("bankSelect",function(event){
		   		var payamttypevalue1=event.detail;			
		   		//清除还款金额类型
				$("#bankSelect").val("");
				$("#bankSelect").val(payamttypevalue1.value);
				document.getElementById("bankSelectShow").innerHTML= payamttypevalue1.text;
				bankNameCN = payamttypevalue1.text;
			});
			//下一步
		$("#nextStep").on("tap",function(){
			var recacctemp = contextData.recAccount;
			var payAccounttemp =$("#payAccount").val();
        	if (recacctemp == "") {
        		mui.alert("您没有加挂信用卡，无法操作此功能");
        		return false;
        	}
        	if(payAccounttemp == ""){
				mui.alert("请输入还款人账号");
        		return false;
			}
        	var p = /[^\d]/g;
        	if(p.test(payAccounttemp)){
        		mui.alert("还款账号只能为数字");
        		return false;
			}else if(payAccounttemp.indexOf(" ")>=0){
				mui.alert("还款账号不能有空格");
        		return false;
			}else if(payAccounttemp.length>32 || payAccounttemp.length<6){
				mui.alert("还款账号长度应为6至32位");
        		return false;
			}
			var bankSelect = $("#bankSelect").val();
			if (bankSelect == "") {
				mui.alert("请选择借记卡开户行");
        		return false;
			}
			var transferType = "2";//跨行约定还款
			var payAmountType = $("#payAmountType").val();
			
			var params1 = {
        		recAccount:recacctemp,
        		transferType:transferType,
        		payAccount:payAccounttemp,
        		payAmountType:payAmountType,
        		bankSelect:bankSelect,
        		bankSelectText:bankNameCN,
        		cardpublicflag:contextData.cardpublicflag,
        		noCheck:true
        	};
        	mbank.openWindowByLoad('otherAppointRefund_Confirm.html','otherAppointRefund_Confirm','slide-in-right',params1);
		});
		mbank.resizePage(".btn_bg_f2");
	});
});