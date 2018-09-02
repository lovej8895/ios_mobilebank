define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var menu = require('../../core/bankMenu');
	var format = require('../../core/format');

	mui.init({
		gestureConfig: {
			tap: true, //默认为true
			doubletap: true, //默认为false
			longtap: true, //默认为false
			swipe: true, //默认为true
			drag: true //默认为true
		}
	});
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var rmbAccount = $('#rmbAccount');
		var orderCardNo;
		var orderCardType;
		var cardOrder;
		var appId = $.param.QRCODE_APPID

		//查询是否有默认的支付卡
		queryCardOrder(); 
		
		function queryCardOrder() {
			var params = {};
			var url = mbank.getApiURL() + 'queryCardOrder.do';
			mbank.apiSend('post', url, params, queryOrderSuccess, queryOrderError, false);
			function queryOrderSuccess(data) {
				orderCardNo = data.cardNo;
				orderCardType = data.cardType;
				cardOrder = data.cardOrder;
				queryDefaultAcct();
			}
			function queryOrderError() {
			}
		}

		//相关信息的加载
		function queryDefaultAcct() {
			rmbAccount.empty();
			var countAccount = []; //借记卡
			var countCredit = []; //信用卡
			var iAccountInfoList = [];
			//用于将借记卡和信用卡统计出来
			mbank.getAllAccountInfo(function(data) {
				for(var i = 0; i < data.length; i++) {
					if(data[i].accountType == '2') {
						countAccount.push(data[i]);
					} else if(data[i].accountType == '6') {
						//countCredit.push(data[i]);
					}
				}
			});
			
			//将countAccount增加到iAccountInfoList
			Array.prototype.push.apply(iAccountInfoList, countAccount); 
			var balanceHtml;
			var html;
			showCardInfo(iAccountInfoList);

			function showCardInfo(data) {
				var balance;
				var length = data.length;

				if(length > 0) {
					//当查询顺序表中没有默认付款卡时
					if(orderCardNo == null || orderCardNo == '') {
						for(var index = 0; index < length; index++) {
							var accountInfo = iAccountInfoList[index];
							html = '<li><p class="color_6 m_left10px ">账号&nbsp;&nbsp;<span class="fz_16">' + format.dealMoney(accountInfo.accountNo) + '</span>&nbsp;&nbsp;<span style="display: none;">' + accountInfo.accountNo + '</span>';
							if(accountInfo.accountType == '2') {
								html += '<span class="color_9">(储蓄卡)</span></p>';
								//getBalance(accountInfo.accountNo);
								html += '<p class="color_9 m_left10px fz_12" id="bal' + accountInfo.accountNo + '"></p>';
							} else if(accountInfo.accountType == '6') {
								html += '<span class="color_9">(信用卡)</span></p>';
								//getAvaiable(accountInfo.accountNo);
								html += '<p class="color_9 m_left10px fz_12" id="bal' + accountInfo.accountNo + '"></p>';
							}
							html += '<a class="nav_code4 hb-title"></a></li>';
							rmbAccount.append(html);
						}
					} else {
						//当顺序表中有卡号时，找到列表中的卡号，放置首位
						for(var index = 0; index < length; index++) {
							var accountInfo = iAccountInfoList[index];
							if(orderCardNo == accountInfo.accountNo) {
								html = '<li><p class="color_6 m_left10px ">账号&nbsp;&nbsp;<span class="fz_16">' + format.dealMoney(accountInfo.accountNo) + '</span>&nbsp;&nbsp;<span style="display: none;">' + accountInfo.accountNo + '</span>';
								if(accountInfo.accountType == '2') {
									html += '<span class="color_9">(储蓄卡)</span></p>';
									//getBalance(accountInfo.accountNo);
									html += '<p class="color_9 m_left10px fz_12" id="bal' + accountInfo.accountNo + '"></p>';
								} else if(accountInfo.accountType == '6') {
									html += '<span class="color_9">(信用卡)</span></p>';
									//getAvaiable(accountInfo.accountNo);
									html += '<p class="color_9 m_left10px fz_12" id="bal' + accountInfo.accountNo + '"></p>';
								}
								html += '<a class="nav_code4 hb-title"></a></li>';
								rmbAccount.append(html);
							}
						}

						for(var index = 0; index < length; index++) {
							var accountInfo = iAccountInfoList[index];
							if(orderCardNo != accountInfo.accountNo) {
								html = '<li><p class="color_6 m_left10px ">账号&nbsp;&nbsp;<span class="fz_16">' + format.dealMoney(accountInfo.accountNo) + '</span>&nbsp;&nbsp;<span style="display: none;">' + accountInfo.accountNo + '</span>';
								if(accountInfo.accountType == '2') {
									html += '<span class="color_9">(储蓄卡)</span></p>';
									//getBalance(accountInfo.accountNo);
									html += '<p class="color_9 m_left10px fz_12" id="bal' + accountInfo.accountNo + '"></p>';
								} else if(accountInfo.accountType == '6') {
									html += '<span class="color_9">(信用卡)</span></p>';
									//getAvaiable(accountInfo.accountNo);
									html += '<p class="color_9 m_left10px fz_12" id="bal' + accountInfo.accountNo + '"></p>';
								}
								html += '<a class="nav_code4 hb-title"></a></li>';
								rmbAccount.append(html);
							}
						}
					}
				}

				//查询储蓄卡余额
				function getBalance(accountNo) {
					var params = {
						"accountNo": accountNo
					};
					var url = mbank.getApiURL() + 'balanceQuery_ch.do';
					mbank.apiSend('post', url, params, function(data) {
						if(data.balanceAvailable != '' && data.balanceAvailable != null) {
							balance = format.formatMoney(data.balanceAvailable);
							$('#bal' + accountNo).empty().append('余额:¥' + balance);
						}
					}, function() {}, true);
				}

				//获取信用卡额度
				function getAvaiable(accountNo) {
					var params = {
						"cardNo": accountNo
					};
					var url = mbank.getApiURL() + '007104_limitQuery.do';
					mbank.apiSend('post', url, params, function(data) {
						balance = format.formatMoney(data.AvblLimit);
						$('#bal' + accountNo).empty().append('可用额度:¥' + balance);
					}, function() {}, true);
				}
			}
			
			//拖动改变卡列表顺序，但只记录第一条记录
			jQuery("#cardOrderArea ul").dragsort({
				dragSelector: "li",
				dragEnd: function() {
					//拖动完成后的函数
					var cardNo = jQuery("#rmbAccount li:nth-child(1) span:nth-child(2)").text();
					//console.log(cardNo);
					var cardTypeShow = jQuery("#rmbAccount li:nth-child(1) span:nth-child(3)").text().substring(1, 4);
					//console.log(cardTypeShow);
					var cardType;
					if(cardTypeShow == '信用卡') {
						cardType = 1;
					} else if(cardTypeShow == '储蓄卡') {
						cardType = 0;
					}
					//console.log(orderCardType);
					var params = {
						cardNo: cardNo,
						cardType: cardType,
						appId: appId
					};
					var url = mbank.getApiURL() + 'cardOrderSet.do';
					mbank.apiSend('post', url, params, orderSetSuccess, orderSetError, false);
					function orderSetSuccess() {
						mui.toast("扣款顺序设置成功");
					}
					function orderSetError() {
						mui.toast("扣款顺序设置失败");
					}
				},
				dragBetween: false,
				placeHolderTemplate: '<li  style="background: white;"><p class="color_6 m_left10px "><span class="fz_16"></span><span class="color_9"></span></p><p class="color_9 m_left10px fz_12"></p><a class="nav_code4 hb-title"></a></li>'
			});
		}
	});
})