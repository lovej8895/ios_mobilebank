define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var customerId ="";
	mui.init();
	mui.plusReady(function() {
		//消息提醒
		queryNewMessage();
		
		function queryNewMessage() {
			var dataNumber = {
				mbUUID: plus.device.uuid,
				turnPageBeginPos: 1,
				turnPageShowNum: 1,
				"liana_notCheckUrl": false
			};
			var url = mbank.getApiURL() + '210201_systemMessage.do';
			mbank.apiSend("post", url, dataNumber, successCallback, errorCallback, 'ignore');

			function successCallback(data) {
				var msgList = data.msgList;
				if(msgList.length == 0) {
					jQuery("#messagelist").html('');
					return;
				}
				var isNewMessage = msgList[0].msgIsRead;
				if(isNewMessage == '0') {
					jQuery("#messagelist").html('<span class="message_new"></span>');
				} else {
					jQuery("#messagelist").html('');
				}
			}

			function errorCallback(e) {}
		}

		//二维码支付
		function queryConsumingRecordLately() {
			var qrcData = {};
			var url = mbank.getApiURL() + 'qrConsumingRecordLately.do';
			mbank.apiSend("post",url,qrcData,successQRCCallback,errorQRCCallback,'ignore');
			function successQRCCallback(data){
				var latelyRecordList = data.latelyConsumerRecRecordList;
				var iConsumingInfoList = [];
				
				if (latelyRecordList.length > 0) {
					Array.prototype.push.apply(iConsumingInfoList, latelyRecordList);
					$("#showLifeQRC").show();
					$("ul li").unbind();
					var recordUL = $('#latelyUL');
					recordUL.empty();
					
					for (var i = 0; i < latelyRecordList.length; i++) {
						var latelyRecord = latelyRecordList[i];
						var conmType = latelyRecord.transType;
						var qrNum = "qrNum" + i;
						var jumpNum = "showQRDetails" + i;
						var li = $('<li id="'+ qrNum +'" class="backbox_th m_top10px p_lr15px"></li>');
						var p1 = $('<p class="qr_filetitbox ove_hid"></p>');
						var span = "";
						if(i%2 == 0){
							span = $('<span class="qr_filetitl backbox_tit_qrico_y"></span>');
						}else{
							span = $('<span class="qr_filetitl backbox_tit_qrico_b"></span>');
						}
						var span1 = $('<span class="qr_filetitl">扫码支付</span>');
						
						var a = "";
						if (conmType == '1' || conmType == '2' || conmType == '3') {
							a = $('<a class="f_thbg" jumpid="queryType0">更多</a>');
						} else{
							a = $('<a class="f_thbg" jumpid="queryType1">更多</a>');
						}
						p1.append(span).append(span1).append(a);
						
						
						var a2 = $('<a jumpid="'+ jumpNum +'" record="' + i + '" ></a>');
						var p2 = $('<p class="ove_hid p_down10px"></p>');
						var p3 = $('<p></p>');
						var span2 = $('<span class="qrname fz_15"></span>');
						//(1 - 主扫、2 - 被扫、3 - 付款、4 - 收款)
						var merRecPayName = "";
						var fmtAmt = "";
						
						if (conmType == '1' || conmType == '2') {
							merRecPayName = latelyRecord.merName;
						} else if(conmType == '3') {
							if (latelyRecord.recAccName != null && latelyRecord.recAccName != "") {
								merRecPayName = "向" + latelyRecord.recAccName + "-付款";
							} else{
								var recAccount = latelyRecord.recAccNo;
								if (recAccount != null && recAccount != "" && recAccount.length > 0) {
									merRecPayName = "向尾号为(" + recAccount.substring(recAccount.length - 4, recAccount.length) + ")-付款";
								}
							}
						} else{
							if (latelyRecord.payAccName != null && latelyRecord.payAccName != "") {
								merRecPayName = "向" + latelyRecord.payAccName + "-收款";
							} else{
								var payAccount = latelyRecord.payAccNo;
								if (payAccount != null && payAccount != "" && payAccount.length > 0) {
									merRecPayName = "向尾号为(" + payAccount.substring(payAccount.length - 4, payAccount.length) + ")-收款";
								}
							}
						}
						span2.append(merRecPayName);
						
						var span3 = $('<span class="color_9"></span>');
						var fmtType = ((conmType == "1") || (conmType == "2")) ? "消费":"转账";
						span3.append(fmtType);
						p3.append(span2).append(span3);
						
						var span4 = $('<span class="qr_lifesum"></span>');
						var conmAmt = latelyRecord.txnAmt;
						if (conmType == '1' || conmType == '2' || conmType == '3') {
							fmtAmt = "-" + format.formatMoney(conmAmt);
						} else{
							fmtAmt = "+" + format.formatMoney(conmAmt);
						}
						span4.append(fmtAmt);
						
						var span5 = $('<span class="qr_lifetime color_9"></span>');
						var conmTime = latelyRecord.transferTime;
						var fmtTime = format.formatDateTime(conmTime);
						fmtTime = fmtTime.substring(0,fmtTime.length-3);
						span5.append(fmtTime);
						
						a2.append(p2).append(p3).append(span4).append(span5);
						
						li.append(p1).append(a2);
						recordUL.append(li);
					}
					//console.log("===recordUL===："+recordUL.html());
					
					$("li a").on("tap", function() {
						var params = "";
						var queryParams = "";
						var aID = $(this).attr("jumpid");
						if (aID == "queryType0") {
							queryParams = {queryType: '0'};
							mbank.openWindowByLoad("../qrcodePay/consumingQuery.html", "consumingQuery", "slide-in-right", queryParams);
						} else if (aID == "queryType1") {
							queryParams = { queryType: '1' };
							mbank.openWindowByLoad("../qrcodePay/consumingQuery.html", "consumingQuery", "slide-in-right", queryParams);
						} else{
							var record = $(this).attr("record");
							var tranType = iConsumingInfoList[record].transType;
							if (tranType == '1' || tranType == '2') {
								//主扫-被扫
								params = {
									"ordFlag": '03',
									"payAccNo": '',
									"merName": iConsumingInfoList[record].merName,
									"txnAmt": iConsumingInfoList[record].txnAmt,
									"transResult": iConsumingInfoList[record].transResult,
									"commodityType": iConsumingInfoList[record].commodityType,
									"commodityInformation": iConsumingInfoList[record].commodityInformation,
									"preferentialAmt": iConsumingInfoList[record].preferentialAmt,
									"accNo": iConsumingInfoList[record].payAccNo,
									"transferTime": iConsumingInfoList[record].transferTime,
									"transferFlowNo": iConsumingInfoList[record].transferFlowNo,
									"merOrderNo": iConsumingInfoList[record].merOrderNo,
									"recPayComments": iConsumingInfoList[record].remark,
									"lifeFlag": "life"
								};
								mbank.openWindowByLoad('../qrcodePay/consumingDetails.html', 'consumingDetails', 'slide-in-right', params);
							} else if(tranType == '3') {
								//付款
								params = {
									"ordFlag": '02',
									"payAccNo": iConsumingInfoList[record].payAccNo,
									"merName": iConsumingInfoList[record].recAccName,
									"txnAmt": iConsumingInfoList[record].txnAmt,
									"transResult": iConsumingInfoList[record].transResult,
									"commodityType": iConsumingInfoList[record].commodityType,
									"commodityInformation": iConsumingInfoList[record].commodityInformation,
									"preferentialAmt": iConsumingInfoList[record].preferentialAmt,
									"accNo": iConsumingInfoList[record].recAccNo,
									"transferTime": iConsumingInfoList[record].transferTime,
									"transferFlowNo": iConsumingInfoList[record].transferFlowNo,
									"merOrderNo": iConsumingInfoList[record].merOrderNo,
									"recPayComments": iConsumingInfoList[record].remark,
									"lifeFlag": "life"
								};
								mbank.openWindowByLoad('../qrcodePay/consumingDetails.html', 'consumingDetails', 'slide-in-right', params);
							} else{
								//收款
								params = {
									"recAccNo": iConsumingInfoList[record].recAccNo,
									"merName": iConsumingInfoList[record].payAccName,
									"txnAmt": iConsumingInfoList[record].txnAmt,
									"transResult": iConsumingInfoList[record].transResult,
									"payAccNo": iConsumingInfoList[record].payAccNo,
									"transferTime": iConsumingInfoList[record].transferTime,
									"transferFlowNo": iConsumingInfoList[record].transferFlowNo,
									"merOrderNo": iConsumingInfoList[record].merOrderNo,
									"remark": iConsumingInfoList[record].remark,
									"lifeFlag": "life"
								};
								mbank.openWindowByLoad('../qrcodePay/recPayDetails.html', 'recPayDetails', 'slide-in-right', params);
							}
						}
					});
				} else{
					$('#latelyUL').empty();
					$("#showLifeQRC").hide();
				}
			}
			function errorQRCCallback(e){}
		}

		//刷新消息提醒
		window.addEventListener("refreshNews", function(event) {
			queryNewMessage();
		});

		//刷新扫码支付
		window.addEventListener("refreshQRCodePay", function(event) {
			customerId = userInfo.get("session_customerId");
			if (customerId != null && customerId != '') {
				queryConsumingRecordLately();
			} else{
				$('#latelyUL').empty();
				$("#showLifeQRC").hide();
			}
		});

		mui("#qrcodeDiv").on("tap", "a", function() {
			var id = jQuery(this).attr("id");
			var path = jQuery(this).attr("path");
			var noCheck = jQuery(this).attr("noCheck");
			if(id == "") {
				mui.toast("功能正在研发中···");
				return;
			}
			mbank.openWindowByLoad(path, id, "slide-in-right", { noCheck: noCheck });
		});

		mui("#chargeList").on("tap", "li", function() {
			var id = jQuery(this).attr("id");
			var path = jQuery(this).attr("path");
			var noCheck = jQuery(this).attr("noCheck");
			if(id == "") {
				mui.toast("功能正在研发中···");
				return;
			}
			mbank.openWindowByLoad(path, id, "slide-in-right", { noCheck: noCheck });
		});

		var backButtonPress = 0;
		mui.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				userInfo.removeItem("sessionId");
				plus.runtime.quit();
			} else {
				mui.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};

		//广告链接跳转
		jumPage = function(str) {
			jumpOrShow(mbank, str);
		}

		var ranmdomNmu = Math.random();
	    jQuery("#showLifeAd").load(jQuery.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_life.html?t="+ ranmdomNmu);
		$("#showLifeAdC").show();
		
		
		adStateQuery();
		function adStateQuery(){
			var url = mbank.getApiURL()+'adStateQuery.do';
			mbank.apiSend("post",url,{flag:'8',"liana_notCheckUrl": false},stateQuerySuccess,function(){},'ignore');
			function stateQuerySuccess(data){
				//noteState 2代表开启状态 若开启则对广告显示
				if(data.noteState=='2'){
					jQuery("#showAdSpe").load(jQuery.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_special_merchants.html?t="+ ranmdomNmu);
					$("#showAdS").show();
				} else {
					$("#showAdS").hide();
				}
			}
		}
		
		/*jQuery("#showAdSpe").load(jQuery.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/ad_special_merchants.html?t="+ ranmdomNmu,function(response,status,xhr){
		  	jQuery("#showLifeAdC").fadeIn(500);
	  	});*/

		//右上角跳转
		document.getElementById("messagelist").addEventListener('tap', function() {
			var id = $(this).attr("id");
			var path = $(this).attr("path");
			var noCheck = $(this).attr("noCheck");
			mbank.openWindowByLoad(path, id, 'slide-in-right', { noCheck: noCheck });
		});
	});
});