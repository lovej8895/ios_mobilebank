define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var iAccountInfoList = [];
	var currentAcct ="";
	var feeratetemp ="";
	var accountPicker =""
	//信用卡卡号
	var cardNoshow = "";
	//总记录数
	var TotalNum ="";
	mui.init();
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		var contextData = plus.webview.currentWebview();
		$("#tranAmtShow").text(format.formatMoney(contextData.tranAmt));
		$("#FeeNum").text(contextData.FeeNum);
		cardNoshow = contextData.cardNo;
		
		//分期利率列表查询
		queryNumAndFee();
		function queryNumAndFee(){
			var url = mbank.getApiURL() + 'instalmentNumAndFee.do';
			mbank.apiSend('post', url, {
				instalmentType:"PRORET",
				queryNo:cardNoshow
			}, callBack, null, false);
			function callBack(data){
				iAccountInfoList = data.instalmentFeeRateList;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].instalmentPeriods;
					feeratetemp = iAccountInfoList[0].instalmentFeeRate;
					
					$("#instalmentTimesShow").html(currentAcct);
					$("#instalmentTimes").val(currentAcct);
					$("#instalmentFeeRateShow").html(feeratetemp);
					$("#instalmentFeeRate").val(feeratetemp);
					
					queryCalDealInstalment();
				}else{
					mui.alert("未查询到可分期期数");
					return false;
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
						text:account.instalmentPeriods
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择分期期数",fireEvent:"instalmentTimes"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		//切换分期期数
		$("#changeinstalmentTimes").on("tap",function(){
//			accountPicker.show(function(items) {
//				var pickItem2=items[0];
//				currentAcct=iAccountInfoList[pickItem2.value].instalmentPeriods;
//				feeratetemp=iAccountInfoList[pickItem2.value].instalmentFeeRate;
//				$("#instalmentTimesShow").html(currentAcct);
//				$("#instalmentTimes").val(currentAcct);
//				$("#instalmentFeeRateShow").html(feeratetemp);
//				$("#instalmentFeeRate").val(feeratetemp);
//			});	
			document.activeElement.blur();
			accountPicker.show();
		});
		
		window.addEventListener("instalmentTimes",function(event){
			var pickItem2=event.detail;
			currentAcct=iAccountInfoList[pickItem2.value].instalmentPeriods;
			feeratetemp=iAccountInfoList[pickItem2.value].instalmentFeeRate;			
			$("#instalmentTimesShow").html(currentAcct);
			$("#instalmentTimes").val(currentAcct);
			$("#instalmentFeeRateShow").html(feeratetemp);
			$("#instalmentFeeRate").val(feeratetemp);
			
			//根据选择的分期期数查询对应的手续费
			queryCalDealInstalment();
		});
		
		//消费分期手续费计算
		function queryCalDealInstalment(){
			var instalmentTimesTemp = $("#instalmentTimes").val();
			var instalmentFeeRateTemp = $("#instalmentFeeRate").val();
			var url2 = mbank.getApiURL() + 'calDealInstalment.do';
			mbank.apiSend('post', url2, {
				cardNo:contextData.cardNo,
				tranAmt:contextData.tranAmt,
				instalmentTimes:instalmentTimesTemp,
				instalmentFeeRate:instalmentFeeRateTemp,
			}, callBack2, null, false);
			function callBack2(data){
				$("#totalRepayPrincipalShow").html(data.totalRepayPrincipal);
				$("#totalChargeFeeShow").html(data.totalChargeFee);
				$("#totalFeeShow").html(data.totalFee);
				
				$("#totalRepayPrincipal").val(data.totalRepayPrincipal);
				$("#totalChargeFee").val(data.totalChargeFee);
				$("#totalFee").val(data.totalFee);
			}
		}
		
		//预览分期账单
        $("#nextBtnId").on("tap",function(){
        	var instalmentTimesParam = $("#instalmentTimes").val();//分期期数
        	var instalmentFeeRateParam= $("#instalmentFeeRate").val();//分期费率
        	var totalRepayPrincipalParam = $("#totalRepayPrincipal").val();//每期应还本金
        	var totalChargeFeeParam = $("#totalChargeFee").val();//每期手续费
        	var totalFeeParam = $("#totalFee").val();//每期总手续费
        	
        	var params2 = {
        		cardNo:contextData.cardNo,
        		tranAmt:contextData.tranAmt,
        		FeeNum:contextData.FeeNum,
        		instalmentTimes:instalmentTimesParam,
        		instalmentFeeRate:instalmentFeeRateParam,
        		totalRepayPrincipal:totalRepayPrincipalParam,
        		totalChargeFee:totalChargeFeeParam,
        		totalFee:totalFeeParam,
        		flowno:contextData.flowno,
        		creditCardNo:contextData.creditCardNo,
        		TrxnDate:contextData.TrxnDate,
        		TrxnDesc:contextData.TrxnDesc,
        		BillCurrency:contextData.BillCurrency,
        		TrxnAmt:contextData.TrxnAmt,
        		noCheck:true
        	};
        	mbank.openWindowByLoad('dealInstalment_Submit.html','dealInstalment_Submit','slide-in-right',params2);
        });
	});
});