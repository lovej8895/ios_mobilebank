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
	var currentAcct ="";
	var accountPicker ="";
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback:pulldownfresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos=1;
			queryinstalmentList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#instalmentList ul').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryinstalmentList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	//分期查询
	queryinstalmentList = function(turnPageBeginPos){
		var cardNoParam = $("#cardNo").val();
		var stagesTypeParam = $("#stagesType").val();
		var url2 = mbank.getApiURL() + 'instalmentListQuery.do';
		mbank.apiSend('post', url2, {
			cardNo:cardNoParam,
			stagesType:stagesTypeParam,
			turnPageBeginPos:turnPageBeginPos,
			turnPageShowNum:turnPageShowNum
		}, callBack2, null, true);
		function callBack2(data){
			var tempMesHtml ="";
			var dataVal ="";
			turnPageTotalNum = data.turnPageTotalNum;
			if( turnPageBeginPos == 1 ){
		       	$("#instalmentList").empty();
		       	if (turnPageTotalNum == '0') {
		       		$("#instalmentList").append('<div class="fail_icon1 suc_top7px"></div>');
		       		$("#instalmentList").append('<p class="fz_15 text_m">此卡无可分期的记录</p>');
		       	}
		    }
			if (turnPageTotalNum > 0) {
				for (var i = 0; i < data.instalmentHisList.length; i++) {
					var currObj = data.instalmentHisList[i];
					dataVal = currObj.inst_trxn_seq+"&"+currObj.entrolment_date+"&"+currObj.total_plan_periods+"&"
					+currObj.inst_total_amount+"&"+currObj.total_fee_amt+"&"+currObj.total_int_amt+"&"
					+currObj.outstd_trxn_amount+"&"+currObj.outstd_plan_periods+"&"+currObj.restChargeFee+"&"
					+currObj.trxn_settl_date+"&"+currObj.trxn_settl_status+"&"+currObj.next_payment_date+"&"
					+currObj.application_no+"&"+currObj.appl_no+"&"+currObj.adv_fee_amt+"&"+currObj.settl_status;
						
					tempMesHtml += '<ul class="bg_h113px m_top10px bg_br2px">';
					tempMesHtml += '<li>';
					tempMesHtml += '<p class="sav_tit"><span>借据号</span>'+currObj.inst_trxn_seq+'</p>';
					tempMesHtml += '</li>';
					tempMesHtml += '<li class="money_box">';
					tempMesHtml += '<p class="pub_li_left m_left10px">申请金额&nbsp;&nbsp;<span class="color_red">￥'+format.formatMoney(currObj.inst_total_amount,2)+'</span></p>';
					tempMesHtml += '<p class="pub_li_right m_left10px">分期期数&nbsp;&nbsp;<span>'+currObj.total_plan_periods+'</span></p>';
					tempMesHtml += '</li>';
					tempMesHtml += '<li class="pub_btnbox">';
					tempMesHtml += '<a submitDetail="'+dataVal+'">查看明细</a>';
					//Y可提前还款且剩余金额大于0
					if (currObj.settl_status == "Y" && parseFloat(currObj.outstd_trxn_amount) > 0) {
						tempMesHtml += '<a submitDetail="'+dataVal+'">提前结清</a>';
					}
					tempMesHtml += '</li>';
					tempMesHtml += '</ul>';	
				}
				$("#instalmentList").append(tempMesHtml);
				plus.nativeUI.closeWaiting();
				/**
				* Y 提前结清
				*/
				$("#instalmentList ul li:last-child a").on("tap",function(){
					
					var datavalparam=$(this).attr("submitDetail");
					var payAmountVal = datavalparam.split("&")[6];
					var flag = datavalparam.split("&")[15];
					if (flag == 'Y' && parseFloat(payAmountVal) >0) {
						var carnoparam= $("#cardNo").val();//信用卡号
						var instTrxnSeqVal = datavalparam.split("&")[0];//分期借据号
						var instalmentDateVal = datavalparam.split("&")[1];//分期时间
						var instalmentTimesVal = datavalparam.split("&")[2];//分期期数
						var instalmentAmtVal = datavalparam.split("&")[3];//分期金额
						var chargeFeeVal = datavalparam.split("&")[4];//分期总手续费
						var interestVal = datavalparam.split("&")[5];//分期总利息
						var payAmountVal = datavalparam.split("&")[6];//剩余金额
						var unReturnTimesVal = datavalparam.split("&")[7];//剩余期数
						var adv_fee_amt1 = datavalparam.split("&")[14];//提前结清费用
							
						var params ={
							accountNo:carnoparam,
							instTrxnSeq:instTrxnSeqVal,
							amountRealCharged:payAmountVal,
							unReturnTimes:unReturnTimesVal,
							adv_fee_amt:adv_fee_amt1,
							instalmentDate:instalmentDateVal,
							instalmentTimes:instalmentTimesVal,
							instalmentAmt:instalmentAmtVal,
							chargeFee:chargeFeeVal,
							interest:interestVal,
							noCheck:true
						};
						mbank.openWindowByLoad('instalmentQuery_Confirm.html','instalmentQuery_Confirm','slide-in-right',params);	
					} else{
							var instTrxnSeqValDetail = datavalparam.split("&")[0];//分期借据号
							var instalmentDateValDetail = datavalparam.split("&")[1];//分期时间
							var instalmentTimesValDetail = datavalparam.split("&")[2];//分期期数
							var instalmentAmtValDetail = datavalparam.split("&")[3];//分期金额
							var chargeFeeValDetail = datavalparam.split("&")[4];//分期总手续费
							var interestValDetail = datavalparam.split("&")[5];//分期总利息
							var payAmountValDetail = datavalparam.split("&")[6];//剩余金额
							var unReturnTimesValDetail = datavalparam.split("&")[7];//剩余期数
							var trxn_settl_statusValDetail = datavalparam.split("&")[10];//状态
							
							var paramsDetail ={
								instTrxnSeq:instTrxnSeqValDetail,
								instalmentDate:instalmentDateValDetail,
								instalmentAmt:instalmentAmtValDetail,
								instalmentTimes:instalmentTimesValDetail,
								chargeFee:chargeFeeValDetail,
								interest:interestValDetail,
								amountRealCharged:payAmountValDetail,
								unReturnTimes:unReturnTimesValDetail,
								trxn_settl_status:trxn_settl_statusValDetail,
								noCheck:true
							};
							mbank.openWindowByLoad('instalmentQuery_Detail.html','instalmentQuery_Detail','slide-in-right',paramsDetail);
						}
					});
				}
		}
	}
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		//初始化默认
		$("#stagesTypeShow").html("账单分期");
		$("#stagesType").val("PROZD");
		
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
					queryinstalmentList(1);//查询分期明细
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
		$("#changeCardNo").on("tap",function(){
//			accountPicker.show(function(items) {
//				var pickItem3=items[0];
//				currentAcct=iAccountInfoList[pickItem3.value].accountNo;
//				$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
//				$("#cardNo").val(currentAcct);
//				
//				queryinstalmentList(1);//查询分期明细
//			});	
			document.activeElement.blur();
			accountPicker.show();
		});
		window.addEventListener("cardNo",function(event){
			var pickItem3=event.detail;			
			currentAcct=iAccountInfoList[pickItem3.value].accountNo;
			$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
			$("#cardNo").val(currentAcct);
			queryinstalmentList(1);//查询分期明细
		});
		
		//分期类型切换
		var userPicker = new mui.SmartPicker({title:"请选择分期类型",fireEvent:"stagesType"});
			userPicker.setData([{
				value: 'PROZD',
				text: '账单分期'
			}, {
				value: 'PRORET',
				text: '消费分期'
			}]);
		$("#changeStagesType").on("tap",function(){
			document.activeElement.blur();
			userPicker.show();			
		});
		window.addEventListener("stagesType",function(event){
		   var stagesTypeResult=event.detail;
		   document.getElementById("stagesTypeShow").innerHTML = stagesTypeResult.text;
		   $("#stagesType").val("");
		   $("#stagesType").val(stagesTypeResult.value);
		   queryinstalmentList(1);
		});
	});
});