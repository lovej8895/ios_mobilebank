define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var dataBefore = plus.webview.currentWebview().params;
		
		/*$('#recAccount').html(dataBefore.recAccount);
		$('#recAccountName').html(dataBefore.recAccountName);
		$('#recAccountOpenBankName').html(dataBefore.recAccountOpenBankName);
		$('#payAmount').html(format.formatMoney(dataBefore.payAmount,2));
		$('#orderSubmitTime').html(format.dataToDate(dataBefore.orderSubmitTime));
		$('#state').html($.param.getUserType('SCHENULE_STATE_RESULT',dataBefore.state));*/
		
		$('#payAccount').html(format.dealAccountHideFour(dataBefore.payAccount));
		$('#recAccount').html(dataBefore.recAccount);
		$('#payAmount').html(dataBefore.payAmount+"元");
		$('#recAccountName').html(dataBefore.recAccountName);
		$('#newPayUse').html(dataBefore.newPayUse);
		if(dataBefore.recAccountOpenBankName==''||dataBefore.recAccountOpenBankName==null){
			$('#recAccountBank').hide();
		} else {
			$('#recAccountOpenBankName').html(dataBefore.recAccountOpenBankName);
		}
		
		if(dataBefore.transferType=='0'){
			$('#transferType').html('普通');
		} else if(dataBefore.transferType=='1'){
			$('#transferType').html('加急');
		}
		if(dataBefore.scheduleType=='0' || dataBefore.scheduleType=='2'){
			//一次性预约
			$('.specifyDate').show();
			$('.specifyCycle').hide();
			var time = format.dataToDate(dataBefore.nextDate);
			time = time + ((dataBefore.specifyTime=='AM')?'上午10:00':'下午14:00');
//			console.log(time);
			$('#specifyTime').html(time);
//			console.log(dataBefore.nextDate);
			
		} else {
			//周期性预约
			$('.specifyCycle').show();
			$('.specifyDate').hide();
			$('#cycleScheduleType').html((dataBefore.specifyTime=='AM')?'上午10:00':'下午14:00');
			var period='';
			var dayText='';
			if(dataBefore.cycle=='0'){
				period='每天';
			}
			if(dataBefore.cycle=='1'){
				period='每周';
				if(dataBefore.weekDay=='1'){
					dayText='周日';
				}
				if(dataBefore.weekDay=='2'){
					dayText='周一';
				}
				if(dataBefore.weekDay=='3'){
					dayText='周二';
				}
				if(dataBefore.weekDay=='4'){
					dayText='周三';
				}
				if(dataBefore.weekDay=='5'){
					dayText='周四';
				}
				if(dataBefore.weekDay=='6'){
					dayText='周五';
				}
				if(dataBefore.weekDay=='7'){
					dayText='周六';
				}
			}
			if(dataBefore.cycle=='2'){
				period='每月';
				dayText=dataBefore.monthDay+'号';
			}
//			console.log(period+","+dayText+","+dataBefore.specifyTime);
			$('#transPeriodText').append(period);
			$('#transPeriodText').append(dayText);
			$('#transPeriodText').append((dataBefore.specifyTime=='AM')?'上午10:00':'下午14:00');
//			$('#dayText').html(dayText);
//			$('#specifyCycleTimeText').html((dataBefore.specifyTime=='AM')?'上午10:00':'下午14:00');
			/*$('#transTimesText').html(dataBefore.transTimes+"次");
			$('#executeTimes').html(dataBefore.executeTimes+"次");*/
		}
		
		if(dataBefore.payRem!=null&&dataBefore.payRem!=''){
			$('#payRem').html(dataBefore.payRem);
		} else {
			$('#payRenLi').hide();
		}
		
		
		$('#orderSubmitTime').html(format.formatDateTime(dataBefore.orderSubmitTime));
		$('#orderState').html($.param.getUserType('SCHENULE_STATE_RESULT',dataBefore.orderState));
		$('#orderFlowNo').html(dataBefore.orderFlowNo);
		if(dataBefore.trsFeeAmount==''||dataBefore.trsFeeAmount==null){
			$('#trsFeeAmount').html("0.00元");
		} else {
			$('#trsFeeAmount').html(dataBefore.trsFeeAmount+"元");
		}
		
		
		
		
		if( dataBefore.state=="60" ){//预约处理中时允许撤销
			$("#cancelDiv").show();
		}
		
	});
});