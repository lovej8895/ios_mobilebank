define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var sessionid = userInfo.get('sessionId');

	m.init();
	m.plusReady(function() {

		var bankName = document.getElementById("bankName");
		var cardNum = document.getElementById("cardNum");

		var self = plus.webview.currentWebview();
		var cardList = self.bindCard;
		var accountNum = self.accNo; //客户账号
		var allAcc = self.allAccObj;

		//获取之前的界面
		var viewList = self.preViewList;
		viewList.push("administrate_bank_card");

		bankName.innerHTML = cardList.relBankName;
		cardNum.innerHTML = cardList.relAcctNo;
		var flag = cardList.defaultFlag;

		removeBind = function() {
			if (flag == '1') {
				plus.nativeUI.toast('请修改另一张卡为默认卡，方可结束绑定！');
				return false;
			} else {
//				plus.nativeUI.confirm("确认解除绑定吗？", function(e) {
				mui.confirm("确认解除绑定吗？", "提示", ["确认", "取消"], function(e) {
					if (e.index == 0) {
						var param = {
							currentBusinessCode: '03000009',
							acctNo: accountNum,
							relAcctNo: cardNum.innerHTML,
							relAcctType: '00',
							waitTitle: '正在解绑银行卡请稍后...'
						}
						var url = mbank.getApiURL() + 'relieveBindCard.do';
						mbank.apiSend('post', url, param, callBack, true);

						function callBack() {
							plus.nativeUI.toast("恭喜解绑成功");
							mui.openWindow({
								url: 'bind_bank_card.html',
								id: 'bind_bank_card',
								show: {
									aniShow: 'pop-in'
								},
								styles: {
									popGesture: 'hide'
								},
								waiting: {
									autoShow: false
								},
								extras: {
									allAccObj: allAcc,
									preViewList: viewList
								},
								createNew: true
							});
						}
					} else {
						plus.nativeUI.closeWaiting();
					}
				});

			}
		}
		defaultCard = function() {
			if (flag == '1') {
				plus.nativeUI.toast('该卡已为默认卡，请选择另一张银行卡设置');
				return false;
			} else {
//				plus.nativeUI.confirm("确认将此卡设为默认卡吗？", function(e) {
				mui.confirm(accContent, "确认将此卡设为默认卡吗？", ["确认", "取消"], function(e) {
					if (e.index == 0) {
						var param = {
							currentBusinessCode: '03000008',
							acctNo: accountNum,
							relAcctNo: cardNum.innerHTML
						}
						var url = mbank.getApiURL() + 'setDefaultCard.do';
						mbank.apiSend('post', url, param, callBack, true);

						function callBack() {
							mui.openWindow({
								url: 'bind_bank_card.html',
								id: 'bind_bank_card',
								show: {
									aniShow: 'none'
								},
								styles: {
									popGesture: 'hide'
								},
								waiting: {
									autoShow: false
								},
								extras: {
									allAccObj: allAcc,
									preViewList: viewList
								},
								createNew: true
							});
						}
					} else {
						plus.nativeUI.closeWaiting();
					}
//				}, "提示", "nativeUI", ["确认", "取消"]);
				});

			}
		}
	});
});