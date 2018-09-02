define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');

	var turnPageBeginPos = 0;
	var turnPageShowNum = 10;
	var turnPageTotalNum;
	var beginDate;
	var endDate;
	var timeType;
	var accountNo;
	var queryFlag;
	var recPayFlag;
	var iConsumingInfoList = [];

	//上下刷新函数初始化
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownfresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting("加载中...");//显示系统等待对话框
		/*获取父页面consumingHead传递参数*/
		window.addEventListener("consumingResultDispatch", function(event) {
			accountNo = event.detail.accountNo;
			beginDate = event.detail.beginDate;
			endDate = event.detail.endDate;
			timeType = event.detail.timeType;
			queryFlag = event.detail.queryType;
			recPayFlag = event.detail.payType;
			//console.log("=====进入结果显示页面=====：" + queryFlag);
			var trsTime = "";
			if(timeType == "0") {
				trsTime = "近一周";
			} else if(timeType == "1") {
				trsTime = "近一月";
			} else {
				trsTime = format.dataToDate(beginDate) + "&nbsp;至&nbsp;" + format.dataToDate(endDate);
			}
			$("#transTimeFooter").html(trsTime);
			setTimeout(function(){
				queryConsumingRecord(0);
			}, 500);
		});
	});

	//向下刷新函数方法
	function pulldownfresh() {
		setTimeout(function() {
			turnPageBeginPos = 0;
			queryConsumingRecord(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}

	//向上刷新函数方法
	function pullupRefresh() {
		setTimeout(function() {
			var currentNum = $('ul li').length;
			//无数据时，事件处理
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + 1;
			//console.log("===向上刷时当前页数===："+turnPageBeginPos);
			queryConsumingRecord(turnPageBeginPos);
			//参数为true代表没有更多数据
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}

	//查询消费记录明细
	function queryConsumingRecord(beginPos) {
		var url = mbank.getApiURL() + 'qrConsumingRecordQuery.do';
		var params = {
			"accountNo": accountNo,
			"startDate": beginDate + "000000",
			"endDate": endDate + "235959",
			"f_begin_date": beginDate,
			"f_end_date": endDate,
			"turnPageBeginPos": beginPos,
			"turnPageShowNum": turnPageShowNum,
			"payType": recPayFlag
		};
		mbank.apiSend("post", url, params, successCallback, errorCallback, false);

		function successCallback(data) {
			turnPageTotalNum = data.turnPageTotalNum;
			var iConmingRecordList = data.consumingRecordList;
			plus.nativeUI.closeWaiting();//关闭系统等待对话框

			if(iConmingRecordList.length > 0) {
				Array.prototype.push.apply(iConsumingInfoList, iConmingRecordList);
				$("ul li").unbind();
				var conmingRecordUL = $('#conmingRecordUL');
				if(beginPos == 0) {
					conmingRecordUL.empty();
				}

				for(var i = 0; i < iConmingRecordList.length; i++) {
					var recordDetail = iConmingRecordList[i];
					//翻页功能 数据处理
					var index = beginPos * turnPageShowNum + i;
					var recordNum = "recordNum" + index;
					var li = $('<li id="' + recordNum + '" record="' + index + '"></li>');
					var p1 = $('<p class="records_time m_left10px"></p>');
					var span1 = $('<span class="fz_15 color_9"></span><br />');
					
					//订单类型：00 主扫，01 被扫，02，小额转账
					var orderFlag = recordDetail.orderType;
					//收付款标识：0—付款  1-收款
					var payFlag = recordDetail.payType;
					
					var img = "";
					var txansAmt = "";
					var tranStrAmt = "";
					var merName = "";
					
					//消费-收款记录数据处理
					var transTime = format.formatDateTime(recordDetail.transferTime);
					var transMD = transTime.substring(5, transTime.length - 10);
					span1.append(transMD);
					var span2 = $('<span class="color_9"></span>');
					var transHM = transTime.substring(12, transTime.length - 3);
					span2.append(transHM);
					p1.append(span1).append(span2);
					
					if ((orderFlag == '00' || orderFlag == '01') && payFlag == '0') {
						img = $('<img src="../../img/qr_logo2.png" />');
					} else {
						img = $('<img src="../../img/qr_head.png" />');
					}
					var p2 = $('<p class="records_pic m_left10px"></p>');
					p2.append(img);
					
					var p3 = $('<p class="records_sum m_left10px"></p>');
					var span3 = $('<span class="fz_15"></span><br />');
					var tmpTxnAmt = parseFloat(recordDetail.txnAmt) / 100;
					
					txansAmt = format.formatMoney(tmpTxnAmt);
					if ((orderFlag == '00' || orderFlag == '01') && payFlag == '0') {
						tranStrAmt = "-" + txansAmt;
						merName = recordDetail.merName;
					} else if (orderFlag == '02' && payFlag == '0'){
						tranStrAmt = "-" + txansAmt;
						if (recordDetail.merName != null && recordDetail.merName != "") {
							merName = "向" + recordDetail.merName + "-付款";
						} else{
							var recAccount = recordDetail.recAccNo;
							if (recAccount != null && recAccount != "" && recAccount.length > 0) {
								merRecPayName = "向尾号为(" + recAccount.substring(recAccount.length - 4, recAccount.length) + ")-付款";
							}
						}
					} else {
						tranStrAmt = "+" + txansAmt;
						if (recordDetail.payName != null && recordDetail.payName != "") {
							merName = "向" + recordDetail.payName + "-收款";
						} else{
							var payAccount = recordDetail.accNo;
							if (payAccount != null && payAccount != "" && payAccount.length > 0) {
								merRecPayName = "向尾号为(" + payAccount.substring(payAccount.length - 4, payAccount.length) + ")-收款";
							}
						}
					}
					span3.append(tranStrAmt);
					var span4 = $('<span class="records_name color_9"></span>');
					span4.append(merName);
					p3.append(span3).append(span4);
					
					var a0 = $('<a class="link_rbg2"></a>');

					li.append(p1).append(p2).append(p3);
					li.append(a0);
					conmingRecordUL.append(li);
				}
				//console.log("===conmingRecordUL===："+conmingRecordUL.html());

				$("ul li").on("tap", function() {
					var params = "";
					var tmpAccNo = "";
					var record = $(this).attr("record");
					var ordFlag = iConsumingInfoList[record].orderType;
					var recPyFlag = iConsumingInfoList[record].payType;//0-付款；1-收款；
					var delTxnAmt = parseFloat(iConsumingInfoList[record].txnAmt) / 100;
					
					if (recPyFlag == '0') {
						var delOffAmt = iConsumingInfoList[record].preferentialAmt;
						if (delOffAmt > 0 && delOffAmt != null && delOffAmt != "") {
							delOffAmt = parseFloat(delOffAmt) / 100;
						}
						if (ordFlag == '02') {
							tmpAccNo = iConsumingInfoList[record].recAccNo;
						} else{
							tmpAccNo = accountNo;
						}
						params = {
							"ordFlag": ordFlag,
							"payAccNo": accountNo,
							"merName": iConsumingInfoList[record].merName,
							"txnAmt": delTxnAmt,
							"transResult": iConsumingInfoList[record].transResult,
							"commodityType": iConsumingInfoList[record].commodityType,
							"commodityInformation": iConsumingInfoList[record].commodityInformation,
							"preferentialAmt": delOffAmt,
							"accNo": tmpAccNo,
							"transferTime": iConsumingInfoList[record].transferTime,
							"transferFlowNo": iConsumingInfoList[record].transferFlowNo,
							"merOrderNo": iConsumingInfoList[record].merOrderNo,
							"recPayComments": iConsumingInfoList[record].payerComments,
							"lifeFlag": ""
						};
						mbank.openWindowByLoad('../qrcodePay/consumingDetails.html', 'consumingDetails', 'slide-in-right', params);
					} else{
						params = {
							"recAccNo": accountNo,
							"merName": iConsumingInfoList[record].payName,
							"txnAmt": delTxnAmt,
							"transResult": iConsumingInfoList[record].transResult,
							"payAccNo": iConsumingInfoList[record].accNo,
							"transferTime": iConsumingInfoList[record].transferTime,
							"transferFlowNo": iConsumingInfoList[record].transferFlowNo,
							"merOrderNo": iConsumingInfoList[record].merOrderNo,
							"remark": iConsumingInfoList[record].payerComments,
							"lifeFlag": ""
						};
						mbank.openWindowByLoad('../qrcodePay/recPayDetails.html', 'recPayDetails', 'slide-in-right', params);
					}
				});
			} else {
				$("ul").empty();
				$('#showMsgDiv').show();
				if ("0" == queryFlag) {
					$("#noResultRecord").text("未查询到消费记录！");
				} else{
					$("#noResultRecord").text("未查询到收款记录！");
				}
				mui('#pullrefresh').pullRefresh().setStopped(true);
			}
		}
		function errorCallback(e) {
			$("ul").empty();
			$('#showMsgDiv').show();
			if ("0" == queryFlag) {
				$("#noResultRecord").text("未查询到消费记录！");
			} else{
				$("#noResultRecord").text("未查询到收款记录！");
			}
			plus.nativeUI.closeWaiting();//关闭系统等待对话框
			mui('#pullrefresh').pullRefresh().setStopped(true);
		}
	}
});