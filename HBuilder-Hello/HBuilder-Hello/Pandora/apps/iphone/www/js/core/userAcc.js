/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('./app');
	var userInfo = require('./userInfo');
	var mbank = require('./bank');
	var nativeUI = require('./nativeUI');
	var formatUtil=require('./format');

	var aviliableBalance = 0.00;
	var chargeFee = 0;
	var recAccountOpenBankName = '';
    var recAccountOpenBank = '';
    var currentAcct = '';
	var currentName = '';
	var bankAcc=[];
    
	//查询账号列表
	
	exports.queryDefaultAcct = function(accId,divId){
		   var defaultPayAcct=document.getElementById(accId);
		   var defaultPayAcctHide=document.getElementById(accId+"Hide");
		   var payAccountPop=document.getElementById(divId);
			mbank.getAllAccount(callBackAcc);
			function callBackAcc(data) {
				var length = data.length,
					bank = new Object();
				if(length>0){
					var lastClass='';
					var defaultflag=false;
					var feeId=accId+"Amt";
					for (var index = 0; index < length; index++) {
						bank = data[index];
						bankAcc.push(bank);
						if(bank.accountFlag == '1'){
							currentAcct = bank.accountNo;
							defaultPayAcct.innerText = formatUtil.dealAccNoWith8Stars(currentAcct);
							defaultPayAcctHide.value =currentAcct; 
							getDefaultAccAmt(currentAcct,feeId);
							defaultflag=true;
						}
						if(bank.accountLevel=='1'&&bank.accountType=='01'){
							payAccountPop.innerHTML += '<a class="list-item" onclick="checkPayAcct(\''+index+'\')">'
						+'<p class="mui-pull-left cor_666"><font class="fz_16 cor_333">借记卡    '+formatUtil.dealAccNoWith8Stars(bank.accountNo)+'</font></p></a>';
						}else if(bank.accountLevel=='2'){
							payAccountPop.innerHTML += '<a class="list-item" onclick="checkPayAcct(\''+index+'\')">'
						+'<p class="mui-pull-left cor_666"><font class="fz_16 cor_333">电子账户    '+formatUtil.dealAccNoWith8Stars(bank.accountNo)+'</font></p></a>';
						}
					}
					if(!defaultflag){
							currentAcct = data[0].accountNo;
							defaultPayAcct.innerText = formatUtil.dealAccNoWith8Stars(data[0].accountNo);
							defaultPayAcctHide.value =currentAcct;
							getDefaultAccAmt(currentAcct,feeId);
							
						}
				}
				function getDefaultAccAmt(accno,id,flag) {
				var params = {
					"accountNo": accno,
					"currentBusinessCode": "00000504",
					"waitTitle" :"余额查询中"
				};
				var wait=flag||true;
				var url = mbank.getApiURL() + 'querySingleBalanceDL.do';
				mbank.apiSend('post', url, params, function(data) {
					$("#"+id).empty().html(data.balanceAvailable);
					$("#openNode").val(data.openNode);
					aviliableBalance = data.balanceAvailable;
				}, null, wait);
				return aviliableBalance;
				};
			}
			return bankAcc;
		};
    //查询付款账户余额
	exports.getAccAmt = function(accno,id,flag) {
			var params = {
				"accountNo": accno,
				"currentBusinessCode": "00000504",
				"waitTitle" :"余额查询中"
			};
			var wait=flag||true;
			var url = mbank.getApiURL() + 'querySingleBalanceDL.do';
			mbank.apiSend('post', url, params, function(data) {
				$("#"+id).empty().html(data.balanceAvailable);
				$("#openNode").val(data.openNode);
				aviliableBalance = data.balanceAvailable;
			}, null, wait);
			return aviliableBalance;
	};
	
	//过滤制定类型的账号
	exports.filterAccount = function(accList, type) {
		var accListTemp = [];
		for(var index = 0; index < accList.length; index++) {
			var currAcc = accList[index];
			if(currAcc.accountLevel != type) {
				accListTemp.push(currAcc);
			}
		}
		return accListTemp;
	};
   
  });