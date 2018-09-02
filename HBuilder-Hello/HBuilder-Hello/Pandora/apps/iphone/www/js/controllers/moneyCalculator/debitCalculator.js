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
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");
		setTimeout(function() {
			//关闭 splash
			plus.navigator.closeSplashscreen();
		}, 600);		
	});
	mui.ready(function() {
		var state = app.getState();
		
		var rem = document.getElementById("reimbursementMeans");
		var money = document.getElementById("money");
		var loanTimeLimit = document.getElementById("loanTimeLimit");
		var rate = document.getElementById("rate");
		var calcuBtn = document.getElementById("calcuBtn");
		var result = document.getElementById("result");
		var limit = document.getElementById("limit");
		var ltype = document.getElementById("ltype");
		var qixian = document.getElementById("qixian");
		var huankuan = document.getElementById("huankuan");
		var totMoney = document.getElementById("totMoney");
 		var totRate = document.getElementById("totRate");
 		var monthReturn1 = document.getElementById("monthReturn");
		loanTimeLimit.addEventListener('click',function(){
			$('#limitSelector').removeClass('d-none');
		},false);
		$('#reimbursementMeans').click(function(){
			$('#returnType').removeClass('d-none');
		});
		dis = function(){
			$('#limitSelector').addClass('d-none');
		}
		di2 = function(){
			$('#returnType').addClass('d-none');
		}
		$('#benjin').click(function(){
			$('#benjin').attr('class','col active');
			$('#benxi').attr('class','col');
			huankuan.value = '0';
			cala();
		});
		$('#benxi').click(function(){
			$('#benxi').attr('class','col active');
			$('#benjin').attr('class','col');
			huankuan.value = '1';
			cala();
		});
		$('#returnType a').on('tap',function(){
			var a = $(this).text();
			if("取消"==Trim(a)){
				ltype.value = "";
				var b = $(this).attr('month');
				huankuan.value = "";
			}else{
				ltype.value = Trim(a);
				var b = $(this).attr('month');
				huankuan.value = b;
			}
			$('#returnType').addClass('d-none');
		});
		$('#limitSelector a').on('tap',function(){
			var a = $(this).text();
			if("取消"==Trim(a)){
				limit.value = "";
				var b = $(this).attr('month');
				qixian.value = "";
			}else{
				limit.value = Trim(a);
				var b = $(this).attr('month');
				qixian.value = b;
				cala();
			}
			$('#limitSelector').addClass('d-none');
		});
		change = function(x){
			cala();
		}
		function changess(x){
			cala()
		}
		function checkDebtInfo(){
			var moneyVal = (money.value||'').trim();
			var qixianVal = (qixian.value||'').trim();
			var huankuanVal = (huankuan.value||'').trim();
			var rateVal = (rate.value||'').trim();
			//校验贷款金额
			if (moneyVal=="") {
				//nativeUI.toast('贷款金额不能为空');
				return false;
			}
			if(!isNum(moneyVal)){
				//nativeUI.toast('请输入正确的贷款金额');
				return false;
			}
			//校验贷款期限
			if (qixianVal=="") {
				//nativeUI.toast('请选择贷款期限');
				return false;
			}
			//校验还款方式
			if (huankuanVal=="") {
				//nativeUI.toast('请选择还款方式');
				return false;
			}
			//校验贷款利率
			if (rateVal=="") {
				//nativeUI.toast('贷款利率不能为空');
				return false;
			}
			if(!isNum(rateVal)){
				//nativeUI.toast('请输入正确的贷款利率');
				return false;
			}
			return true;
		}
		function isNum(str){
		 	var regu = "^[0-9]+(.[0-9]+)?$";
		    var re = new RegExp(regu);
		    if (str.search(re) != - 1) {
		        return true;
		    }
		    else {
		        return false;
		    }
		}
		//去空格
		 function Trim(str)
         { 
             return str.replace(/(^\s*)|(\s*$)/g, ""); 
   		  }
        //计算
        function cala(){
        	if(checkDebtInfo()){
				var m = parseFloat(money.value);
				var r = parseFloat(rate.value/12/100);
				var l = parseFloat(qixian.value);
				//等额本息计算公式
				var ab = Math.pow(1+r,l)-1;
				var aa = m*r*Math.pow(1+r,l);
				var monthReturn = aa/ab;
				var totalReturn = monthReturn*l;
				var accrual = totalReturn-m;
				//等额本金
				var hasReturn = m/l*l;
				var returnAccrual = m/l+(m-hasReturn)*r;
				var totalAccrual = (l+1)*m*r/2;
				if(huankuan.value =='0'){
		     		totMoney.innerHTML = totalReturn.toFixed(2);
		     		totRate.innerHTML = accrual.toFixed(2);
		     		monthReturn1.innerHTML = monthReturn.toFixed(2);
				}else{
		     		totMoney.innerHTML = (m+totalAccrual).toFixed(2);
		     		totRate.innerHTML = totalAccrual.toFixed(2);
		     		monthReturn1.innerHTML = returnAccrual.toFixed(2);
				}
			}
        }
	});
});