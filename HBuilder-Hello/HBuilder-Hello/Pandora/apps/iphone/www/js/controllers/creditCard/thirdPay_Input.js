define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	var iAccountInfoList = [];
	var accountPickerList = [];
	//当前选定账号
	var currentAcct ="";
	var accountPicker;
	//是否开通，默认开通状态
	var statusFlag;
	var useLimit;//单笔限额
	var cashLimit;//单日限额
	var oldStatus;
	//预加载
	mui.init();
	mui.plusReady(function(){
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
					queryThirdPay(currentAcct);
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡卡号",fireEvent:"cardNo"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		//切换信用卡账户事件
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();
		});
		window.addEventListener("cardNo",function(event){
			var pickItem3=event.detail;			
			currentAcct=iAccountInfoList[pickItem3.value].accountNo;
			$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
			$("#cardNo").val(currentAcct);
			queryThirdPay(currentAcct);
		});
		
		//开通状态
		$("#status").on("toggle",function(event){
            if(event.detail.isActive){
            	statusFlag="1";
            	$("#changethirdPayLimit").show();
//          	$("#confirmButton").removeAttr("disabled");
            }else{
            	statusFlag="2";
            	$("#changethirdPayLimit").hide();
//          	$("#confirmButton").attr({"disabled":"disabled"});
            	//关闭时清空金额
            	closeCharge();
            }
        });
        
        //初始化查询第三方支付签约
        function queryThirdPay(accparam){
        	var url1 = mbank.getApiURL() + 'thirdPlay.do';
        	mbank.apiSend('post', url1, {
				cardNo: accparam
			}, callBack1, null, true);
			function callBack1(data){
				var statu = data.contract_flag;//开通状态			
				useLimit = data.singleLimit;//单笔限额
				cashLimit= data.sum_amt;//单日限额
				
				$("#status").removeClass("mui-active");
				//Y-已签约;N-未签约
				if (statu == "Y") {
					$("#status").addClass("mui-active");
					$("#changethirdPayLimit").show();
					oldStatus='Y';
					$("#thirdPayLimit").val(format.formatMoney(cashLimit));
					$("#onceLimit").val(format.formatMoney(useLimit));
//					$("#confirmButton").removeAttr("disabled");
					statusFlag='1';
				} else{					
					$("#status").removeClass("mui-active");
					$("#changethirdPayLimit").hide();
//					$("#confirmButton").attr({"disabled":"disabled"});
					oldStatus='N';
					statusFlag='2';
					closeCharge();
				}
			}
        }
        
        //清空金额
        function closeCharge(){
        	$("#thirdPayLimit").val("");
            $("#chineseAmt").html("");
            $("#onceLimit").val("");
            $("#chineseAmt1").html("");
        }
        
        //输入单日限额
		$("#thirdPayLimit").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#thirdPayLimit").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
		//输入单笔限额
		$("#onceLimit").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#onceLimit").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
		
		//确定
		$("#confirmButton").on("tap",function(){
			if (oldStatus == "Y" && statusFlag == "1") {
				statusFlag = "3";
			}
			//获取单日限额、单笔限额
			var thirdPayLimitTemp = document.getElementById("thirdPayLimit").value;
			var onceLimitTemp = document.getElementById("onceLimit").value;		
			var thirdPayLimit = format.ignoreChar(thirdPayLimitTemp,',');
			var onceLimit = format.ignoreChar(onceLimitTemp,',');
			if (statusFlag!=2) {
				if (thirdPayLimit =="") {
					mui.alert("请输入单日限额！");
					return false;
				}
				if (parseFloat(thirdPayLimit)<=0) {
					mui.alert("请输入正确的单日限额！");
					return false;
				}
				if (onceLimit == "") {
					mui.alert("请输入单笔限额！");
					return false;
				}
				if (parseFloat(onceLimit)<=0) {
					mui.alert("请输入正确的单笔限额！");
					return false;
				}
			}
			if(parseFloat(onceLimit)-parseFloat(thirdPayLimit)>0){
				mui.alert("单日限额不能低于单笔限额");
				return false;
			}
			var cardNo = $("#cardNo").val();
			var params={
		    	cardNo:cardNo,
		    	contract_flag:statusFlag,
		    	sum_amt:thirdPayLimit,
		    	singleLimit:onceLimit,
		    	cardpublicflag:"13"
		    };
		    var url = mbank.getApiURL()+'thirdPCommit.do';
		    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    function successCallback(data){
		        mbank.openWindowByLoad('../creditCard/creditCardPublic_Result.html','creditCardPublic_Result','slide-in-right',params);
		    }
		    function errorCallback(data){
		    	var errorMsg = data.em;
		    	mui.alert(errorMsg);
				//var errorCode = "16";
				//mbank.openWindowByLoad('../creditCard/creditAction_fail.html','creditAction_fail','slide-in-right',{errorCode:errorCode,errorMsg:errorMsg});
		    }
			
		});
		mbank.resizePage(".btn_bg_f2");
	});
});