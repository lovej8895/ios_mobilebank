define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	mui.init();
	mui.plusReady(function() {
		commonSecurityUtil.initSecurityData('028003', plus.webview.currentWebview());
		$('#smsType').find('span').hide();
		$('#smsType').find('button').remove("but_rh28px");
		$('#smsType').find('button').addClass("but_rh28px_pr");
		plus.screen.lockOrientation("portrait-primary");
		queryPettyImmunitySet();
		var switchStt = "";
		var ptitSwitchObj = document.getElementById("pettyImmunitySwitch");

		function queryPettyImmunitySet() {

			var url = mbank.getApiURL() + 'queryPettyImmunitySetInfo.do';
			var param = {};
			mbank.apiSend("post", url, param, successCallback, errorCallback, true);

			function successCallback(data) {
				var tempStr = "<=&nbsp;";
				//小额免密支付开关状态
				switchStt = data.ptiuSwitchStt;
				//mui.alert("==小额免密支付开关状态:"+switchStt);
				//设置免密限额
				var setLimit = data.setDensityLimit;
				var tmpSetLimit = tempStr + setLimit;
				//mui.alert("==设置免密限额:"+setLimit);
				//获取系统默认设置免密限额列表
				var lmmunityLimitList = data.pettyLmmunityLimitList;

				//根据小额免密支付开关状态控制开关展示情况
				if("1" == switchStt) {
					ptitSwitchObj.classList.add("mui-active");
					$("#pettyImmunityAmt").show();
					$("#immunitySetAmt").html(tmpSetLimit + '<span class="fz_14 color_9">元/笔</span>');
				} else {
					//取系统默认设置免密限额列表中的最小一个限额
					var limitListSamll = "";
					var tmpLimitListSamll = "";
					if(lmmunityLimitList.length > 0) {
						limitListSamll = lmmunityLimitList[0].sysLmmunityLimit;
						tmpLimitListSamll = tempStr + limitListSamll;
					}
					ptitSwitchObj.classList.remove("mui-active");
					$("#pettyImmunityAmt").hide();
					if("0" == switchStt) {
						$("#immunitySetAmt").html(tmpSetLimit + '<span class="fz_14 color_9">元/笔</span>');
					} else {
						$("#immunitySetAmt").html(tmpLimitListSamll + '<span class="fz_14 color_9">元/笔</span>');
					}
				}

				//系统默认设置免密限额列表处理
				if(lmmunityLimitList.length > 0) {
					var html = "";
					var tmpHtml = "";
					var lmmLimitLen = lmmunityLimitList.length;
					for(var i = 0; i < lmmunityLimitList.length; i++) {
						var sysLmmLimit = lmmunityLimitList[i].sysLmmunityLimit;
						if(i % 3 == 0) {
							html += '<p class="phone_butbox m_top10px"><a id="immtyAmt' + i + '" class="phone_but border_f fz_18" onclick="immunityAmtSet(' + sysLmmLimit + ',' + i + ',' + lmmLimitLen + ')" onCheck="true">' + sysLmmLimit + '<span class="color_9 fz_14">元/笔</span></a>';
						} else if(i % 3 == 2) {
							html += '<a id="immtyAmt' + i + '" class="phone_but border_f fz_18" onclick="immunityAmtSet(' + sysLmmLimit + ',' + i + ',' + lmmLimitLen + ')" onCheck="true">' + sysLmmLimit + '<span class="color_9 fz_14">元/笔</span></a></p>';
						} else {
							html += '<a id="immtyAmt' + i + '" class="phone_but border_f fz_18" onclick="immunityAmtSet(' + sysLmmLimit + ',' + i + ',' + lmmLimitLen + ')" onCheck="true">' + sysLmmLimit + '<span class="color_9 fz_14">元/笔</span></a>';
						}
					}
					tmpHtml = html;
					//console.log("===tmpHtml===:"+tmpHtml.substring(html.length-4,html.length));
					if(tmpHtml.substring(html.length - 4, html.length) != "</p>") {
						html += '</p>';
					}
					//console.log("===html===:"+html);
					$("#pettyImmunityAmtBox").empty().append(html);

					//根据已设置免密金额，控制免密金额列表选中样式
					for(var j = 0; j < lmmunityLimitList.length; j++) {
						var stmLmmLimit = lmmunityLimitList[j].sysLmmunityLimit;
						if(setLimit != null && setLimit != "") {
							if(setLimit == stmLmmLimit) {
								var immtyAmtID = "immtyAmt" + j;
								var immtyAmtObj = document.getElementById(immtyAmtID);
								immtyAmtObj.classList.add("border_red");
								break;
							}
						} else {
							var immtyAmt0Obj = document.getElementById("immtyAmt0");
							immtyAmt0Obj.classList.add("border_red");
							break;
						}
					}
				}
			}

			function errorCallback(data) {
				ptitSwitchObj.classList.remove("mui-active");
				$("#pettyImmunityAmt").hide();
			}
		}

		window.addEventListener("queryPettyImmunitySet", function(event) {
			queryPettyImmunitySet();
		});

		//短信验证确定按钮监听事件
		document.getElementById("pettyConfirmBt").addEventListener('tap', function() {
			var pttySetAmt = $("#immunitySetAmt").text();
			if(pttySetAmt.indexOf("<=") != -1 && pttySetAmt.indexOf("元/笔") != -1) {
				pttySetAmt = pttySetAmt.substring(pttySetAmt.indexOf("<=") + 2, pttySetAmt.length - 3);
			}
			ptitPayOpen(pttySetAmt);
		});

		//短信验证关闭监听事件
		document.getElementById("msgPettyClose").addEventListener('tap', function() {
			$("#smsPassword").val("");
			$("#msgPettyBox").hide();
			ptitSwitchObj.classList.remove("mui-active");
			$("#pttyImmRound").css('transition-duration', '0.2s');
			$("#pttyImmRound").css('transform', 'translate(0px, 0px)');
			$("#pettyImmunityAmt").hide();
		});

		//是否开通小额免密支付操作
		$("#pettyImmunitySwitch").on("toggle", function(event) {
			var ptitPayFlag = "";
			if(event.detail.isActive) {
				if("0" == switchStt || switchStt == null || switchStt == "") {
					$("#pettyImmunityAmt").show();
					$("#pettyImmunityAmtBox").attr("disabled","disabled").addClass("disabled");
					$("#msgPettyBox").show();
				}
			} else {
				if("1" == switchStt) {
					$("#pettyImmunityAmt").hide();
					ptitPayFlag = "0";
					ptitPayClose(ptitPayFlag);
				}
			}
		});

		//免密金额设置
		immunityAmtSet = function(immunityAmt, k, sysLmmLimitLen) {
			var immSetStr = "<=&nbsp;";
			var tmpImmAmtSet = immSetStr + immunityAmt;
			$("#immunitySetAmt").empty();
			$("#immunitySetAmt").html(tmpImmAmtSet + '<span class="fz_14 color_9">元/笔</span>');
			if(sysLmmLimitLen > 0) {
				for(var n = 0; n < sysLmmLimitLen; n++) {
					var stmLmmAmtID = "immtyAmt" + n;
					var stmLmmAmtObj = document.getElementById(stmLmmAmtID);
					stmLmmAmtObj.classList.remove("border_red");
				}
			}
			var immAmtID = "immtyAmt" + k;
			var immAmtObj = document.getElementById(immAmtID);
			immAmtObj.classList.add("border_red");
			immunityAmtModify(immunityAmt);
		}

		//小额免密支付关闭
		function ptitPayClose(ptitPayFlag) {
			var url = mbank.getApiURL() + 'pettyImmunityCloseOrSet.do';
			var param = { "ptitPayFlag": ptitPayFlag };
			mbank.apiSend("post", url, param, successCallback, errorCallback, true);

			function successCallback(data) {
				mui.toast("小额免密支付关闭成功");
				mui.fire(plus.webview.getWebviewById("qrCodeSet"), "queryInitInfo", {});
				queryPettyImmunitySet();
			}

			function errorCallback(e) {
				mui.toast("小额免密支付关闭失败");
				ptitSwitchObj.classList.add("mui-active");
				$("#pttyImmRound").css('transition-duration', '0.2s');
				$("#pttyImmRound").css('transform', 'translate(16px, 0px)');
				$("#pettyImmunityAmt").show();
			}
		}

		//通过短信验证码验证，小额免密支付开通并默认设置免密金额
		function ptitPayOpen(pttySetAmt) {
			var url = mbank.getApiURL() + 'pettyImmunityOpenOrVerifySMS.do';
			var param = { "ptitPayFlag": "1", "setDensityLimit": parseFloat(pttySetAmt) };
			commonSecurityUtil.apiSend("post", url, param, successCallback, errorCallback, false);

			function successCallback(data) {
				mui.toast("小额免密支付开通成功");
				$("#pettyImmunityAmtBox").removeAttr("disabled").removeClass("disabled");
				$("#smsPassword").val("");
				$("#msgPettyBox").hide();
				mui.fire(plus.webview.getWebviewById("qrCodeSet"), "queryInitInfo", {});
				queryPettyImmunitySet();
			}

			function errorCallback(data) {
				if(data.ec == "EBLN001055" || data.ec == "EBLN001056") {
					mui.toast("手机短信验证码验证失败");
					$("#smsPassword").val("");
				} else {
					mui.toast("小额免密支付开通失败");
					$("#smsPassword").val("");
					$("#msgPettyBox").hide();
					ptitSwitchObj.classList.remove("mui-active");
					$("#pttyImmRound").css('transition-duration', '0.2s');
					$("#pttyImmRound").css('transform', 'translate(0px, 0px)');
					$("#pettyImmunityAmtBox").removeAttr("disabled").removeClass("disabled");
					$("#pettyImmunityAmt").hide();
				}
			}
		}

		//当小额免密支付为开通状态时，客户可以修改免密金额
		function immunityAmtModify(pttyModifyAmt) {
			var url = mbank.getApiURL() + 'pettyImmunityCloseOrSet.do';
			var param = { "ptitPayFlag": "1", "setDensityLimit": parseFloat(pttyModifyAmt) };
			mbank.apiSend("post", url, param, successCallback, errorCallback, true);

			function successCallback(data) {
				mui.toast("免密金额设置成功");
				mui.fire(plus.webview.getWebviewById("qrCodeSet"), "queryInitInfo", {});
			}

			function errorCallback(e) {
				mui.toast("免密金额设置失败");
			}
		}
	});
});