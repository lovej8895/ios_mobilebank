define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var f_cust_type = '1';
	var times = 0;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();		
		var f_deposit_acct = self.f_deposit_acct; //交易账号									
		var f_prodname = self.f_prodname;	 //产品名称			
		var f_tano = self.f_tano;  //TA代码		
		var f_prodcode = self.f_prodcode; //产品代码
		var f_prodtype = self.f_prodtype;//产品类型
		var buyAmount = self.buyAmount;//购买金额
		var fianceManagerCode = self.fianceManagerCode;//理财经理代码
		$("#accountNo").html(format.dealAccountHideFour(f_deposit_acct));
		$("#prodName").html(f_prodname+"("+f_prodcode+")");
		$("#buyAmount").html(format.formatMoney(buyAmount,2)+"元");
		if(fianceManagerCode!=''){
			$("#showManagerCode").css("display","block");
			$("#fianceManagerCode").html(fianceManagerCode);
		}
		commonSecurityUtil.initSecurityData('010301',self);
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		
		plus.key.addEventListener('menubutton', function(){
			passwordUtil.hideKeyboard("accountPassword");
			mui.back();
		});
		$("#preBtn").click(function(){
			mui.back();
		});
		$("#nextBtn").click(function(){
			document.getElementById("nextBtn").setAttribute("disabled",true);
			times = 0;
			getCustInfo();
		});
		function getCustInfo(){
			params = {
				"turnPageBeginPos" : "1",
				"turnPageShowNum" : "1",
				"f_cust_type":"1",
				"f_deposit_acct":f_deposit_acct
			};
			urlVar = mbank.getApiURL() + 'queryCustSignInfo.do';
			mbank.apiSend('post',urlVar,params,queryCustSignInfoSuc,queryCustSignInfoFail,true);
			function queryCustSignInfoSuc(data){
				if(data.ec == "000"){
					var currObj = data.f_iCustSignInfoList;
					if(currObj.length==0){
						cashFundSign();
					}else{
						var custStatus = currObj[0].f_cust_status;
						var signStatus = currObj[0].f_sign_status;
						var f_open_busin_yeb = currObj[0].f_open_busin_yeb;
						f_risk_end_date = currObj[0].f_risk_end_date;
						f_cust_risk = currObj[0].f_cust_risk;
						if(custStatus =="0" && (signStatus =="1" || signStatus =="3") && f_open_busin_yeb =="5"){
							goSubmit();
						}else{
							if(times >2){
								document.getElementById("nextBtn").removeAttribute("disabled");
								mui.alert("基金系统返回数据异常");
								return;
							}else{
								cashFundSign();
							}
						}
					}
				}else{
					document.getElementById("nextBtn").removeAttribute("disabled");
					mui.alert(data.em);
					return;
				}
			}
			function queryCustSignInfoFail(e){
				document.getElementById("nextBtn").removeAttribute("disabled");
				mui.alert(e.em);
				return;
			}
		}
		function cashFundSign(){
			params = {
				"f_tano" : f_tano,
				"f_mobile_telno":userInfo.getItem("logonId"),
				"f_deposit_acct":f_deposit_acct
			};
			urlVar = mbank.getApiURL() + 'cashFundSign.do';
			mbank.apiSend('post',urlVar,params,cashFundSignSuc,cashFundSignFail,true);
			function cashFundSignSuc(data){
				if(data.ec =="000"){
					times++;
					getCustInfo();
				}else{
					document.getElementById("nextBtn").removeAttribute("disabled");
					mui.alert(data.em);
					return;
				}
			}
			function cashFundSignFail(e){
				document.getElementById("nextBtn").removeAttribute("disabled");
				mui.alert(e.em);
				return;
			}
		}
	    function goSubmit(){
	    	document.getElementById("nextBtn").removeAttribute("disabled");
		    var param = {
		    	f_deposit_acct :f_deposit_acct,
        		f_prodcode : f_prodcode,
        		f_prodtype : f_prodtype,
        		f_prodname : f_prodname,
        		f_tano : f_tano,
        		f_applicationamount : buyAmount,
        		f_cust_type : "1",
				f_fm_manager_no : fianceManagerCode
		    };
		    var url = mbank.getApiURL()+'fundCashBuy.do';
		    commonSecurityUtil.apiSend("post",url,param,successCallback,errorCallback,true);
		    function successCallback(data){
		    	if(data.ec=="000"){
		    		var params = {
		    			f_deposit_acct :f_deposit_acct,
		        		f_prodcode : f_prodcode,
		        		f_tano : f_tano,
		        		f_applicationamount : buyAmount,
		        		f_prodname : f_prodname,
		        		f_inc_begin_date : data.f_inc_begin_date,
		        		f_inc_arrive_date :data.f_inc_arrive_date,
			    		noCheck:false
			    	};
					mbank.openWindowByLoad('../fund/cashTransferIntoResult.html','cashTransferIntoResult','slide-in-right',params);
		    	}else{
					mui.alert(data.em);
				}
		    }
		    function errorCallback(e){
		    	mui.alert(e.em);
		    }
	    }
	    
	    mbank.resizePage(".btn_bg_f2");
	});
});