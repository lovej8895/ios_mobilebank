define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	//var myAcctInfo = require('../../core/myAcctInfo');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
	var chargeType = "";
    var payType = "";
    
    var self = "";//上个页面传来的数据
    var daypayment = "";//限额
    var orderFlowNo = "";//流水号
    var urlVar = "";//交易地址
    
    var areaNam = "";//缴费区域
	var areaNo = "";//缴费区域编号
	var unitNam = "";//缴费单位
	var unitNo = "";//缴费单位编号
	var batNo = "";//批次编号
    var batSts = "";//批次状态
	var payNo = "";//缴费编号
	var studNam = "";//姓名
	var eve = "";//校验结果
	var payNum = "";//缴费项目数量
	var feeNo = "";//项目名称
	var Amt = "";//金额
	var feeNam = "";//项目名称
	var SumAmt = 0;//应缴金额
    var CterNo = "";//付款账号
    var params;//参数集合
    var PerNam="";//缴费人姓名
   // var AllRec = [];//缴费项目集合
    
    var amountRealCharged = "";//实际缴费金额
    var chargeNo = "";
    var accountNo = "";//付款账号
    var AllRec_FeeNo = [];//缴费项目编号
    var AllRec_Amt = [];//缴费金额
    //用户姓名
	PerNam = userInfo.get("session_customerNameCN");
    
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		
		areaNam = self.AreaNam;
		areaNo = self.AreaNo;
		unitNam = self.UnitNam;
		unitNo = self.UnitNo;
		batNo = self.BatNo;
		batSts = self.BatSts;
		payNo = self.payNo;
		studNam = self.StudNam;
		eve = self.Eve;
		CterNo = self.CterNo;
		SumAmt = self.sumAmt;
		chargeType = self.chargeType;
		daypayment = self.daypayment;
		AllRec_FeeNo = self.AllRec_FeeNo;
		AllRec_Amt = self.AllRec_Amt;
		payNum =self.PayNum;
		orderFlowNo = self.orderFlowNo;
		amountRealCharged = self.amountRealCharged;
		chargeNo=self.chargeNo;
		accountNo=self.accountNo;
		commonSecurityUtil.initSecurityData('003008',self);
		
		document.getElementById("areaNamSpan").innerText = areaNam;
		document.getElementById("unitNamSpan").innerText = unitNam;
		document.getElementById("batNoSpan").innerText = batNo;
		document.getElementById("payNoSpan").innerText = payNo;
		document.getElementById("studNamSpan").innerText = studNam;
		document.getElementById("cterNoSpan").innerText = format.dealAccountHideFour(CterNo);
		document.getElementById("sumAmtSpan").innerText = format.formatMoney(SumAmt);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			var urlVar = mbank.getApiURL()+'003008_confirm_tuition.do';
			params = {
				"chargeType" : chargeType,
				"AreaNo" : areaNo,
				"areaName":areaNam,
				"UnitNam" :unitNam,
				"UnitNo" : unitNo,
				"BatNo" : batNo,
				"payNo" : payNo,
				"tutionSure.FeeNo" :AllRec_FeeNo,
				"tutionSure.Amt" :AllRec_Amt,
				"SumAmt" : SumAmt,
				"CterNo" :CterNo,
				"orderFlowNo" : orderFlowNo,
				"accountNo" : accountNo,
				"amountShouldBeCharged" : SumAmt,
				"amountRealCharged" : amountRealCharged,
				"chargeNo" : chargeNo,
				"areaId" : areaNo,
				"channel" : "02",
				"daypayment":daypayment,
				"PerNam" : PerNam,
				"PayNum" : payNum
			};
			commonSecurityUtil.apiSend("post",urlVar,params,tuitionChargeSucFunc,tuitionChargeFailFunc,true);
			function tuitionChargeSucFunc(data){
				if(data.ec == "000"){
					params = {
						"chargeType" : chargeType,
						"orderState" : data.orderState,
						"resultMsg" : data.em,
						"AreaNo" : areaNo,
						"UnitNo" : unitNo,
						"BatNo" : batNo,
						"payNo" : payNo
					};
					mbank.openWindowByLoad('../feePayment/tuitionPayChargeResult.html','tuitionPayChargeResult','slide-in-right',params);
				}else{
					mui.alert(data.em,"温馨提示");
					return;
				}
			}
			
			function tuitionChargeFailFunc(e){
				mui.alert(e.em,"温馨提示");
				return;
			}
		},false);
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		
		mbank.resizePage(".btn_bg_f2");
	});
});		