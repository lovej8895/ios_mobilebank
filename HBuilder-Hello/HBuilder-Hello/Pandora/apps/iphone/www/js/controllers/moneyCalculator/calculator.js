define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	mui.init();

	mui.plusReady(function() {
		var state = app.getState();

		var money = document.getElementById("money");
		var rate = document.getElementById("rate");
		var calcuBtn = document.getElementById("calcuBtn");
		var time = document.getElementById("time");
		var month = document.getElementById("month");
		var qixian = document.getElementById("qixian");
//		var tax = 1 / 100;
		var limitSelector = document.getElementById("limitSelector");
		var canclePayAcct = document.getElementById("canclePayAcct");

		//加载利率
		var savingPeriod = ["203", "206", "301", "302", "303", "305"];
		var interestRate = [];
		//查询利率
		for (var index = 0; index < savingPeriod.length; index++) {
			queryDepositRate(savingPeriod[index], index);
		}
		function queryDepositRate(savePeriod, index) {
			var rateParam = {
				depositType: "01",
				savingPeriod: savePeriod
			};
			var url = mbank.getApiURL() + 'querySavingsProduct.do';
			mbank.apiSend('post', url, rateParam, querySuccess, null, false);

			function querySuccess(result) {
				if (index == 0) rate.value = result.interestRate; //默认为3个月的利率
				interestRate[index] = result.interestRate;
			}
		}
		
		qixian.addEventListener('click', function(event) {
			$('#limitSelector').removeClass('d-none');
		}, false);
		$('#limitSelector a').on('tap', function() {
			var a = $(this).text();
			var index = $(this).attr("index");
			rate.value= interestRate[index];
			if ("取消" == Trim(a)) {
				time.value = "";
				var b = $(this).attr('month');
				month.value = "";
			} else {
				time.value = Trim(a);
				var b = $(this).attr('month');
				month.value = b;
				cala();
			}
			$('#limitSelector').addClass('d-none');
		});
		$('#canclePayAcct').click(function() {
			$('#limitSelector').addClass('d-none');
		});
		dis = function() {
			$('#limitSelector').addClass('d-none');
		}
		change = function(x) {
			cala();
		}
		changeqx = function(obj) {
			cala();
		}

		function checkCalcuInfo() {
			var moneyVal = (money.value || '').trim();
			var rateVal = (rate.value || '').trim();
			var monthVal = (month.value || '').trim();
			//校验存款金额
			if (moneyVal == "") {
				nativeUI.toast('存款金额不能为空');
				return false;
			}
			if (!isNum(moneyVal)) {
				nativeUI.toast('请输入正确的存款金额');
				return false;
			}
			//校验存款利率
			if (rateVal == "") {
				nativeUI.toast('存款利率不能为空');
				return false;
			}
			if (!isNum(rateVal)) {
				nativeUI.toast('请输入正确的存款利率');
				return false;
			}
			//校验存款期限
			if (monthVal == "") {
				nativeUI.toast('存款期限不能为空');
				return false;
			}
			return true;
		}

		function isNum(str) {
			var regu = "^[0-9]+(.[0-9]+)?$";
			var re = new RegExp(regu);
			if (str.search(re) != -1) {
				return true;
			} else {
				return false;
			}
		}

		//去空格
		function Trim(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
		//计算
		function cala() {
			if (checkCalcuInfo()) {
				var m = money.value;
				var r = rate.value / 12 / 100;
				var aa = m * r * month.value; //利息计算公式
//				var bb = aa * tax;
				var cc = parseFloat(m) + aa;
				var priAndInt = document.getElementById("priAndInt");
				var rately = document.getElementById("rately")
				priAndInt.innerHTML = cc.toFixed(2);
				rately.innerHTML = aa.toFixed(2);
			}
		}
	});
});