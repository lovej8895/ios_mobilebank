define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var params;
	var urlVar;
	var self;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		var f_prodcode = self.f_prodcode;
		var f_tano = self.f_tano;
//		var f_status = self.f_status;
		var buyMinAmt = isValiteMoney(self.buyMinAmt);
		var buySecMinAmt = isValiteMoney(self.buySecMinAmt);
		var buyStepAmt = self.buyStepAmt;
		var f_b24minamt = isValiteMoney(self.f_b24minamt);
		var f_holdmin = isValiteMoney(self.f_holdmin);
		var f_day_payment = self.f_day_payment;
		
		document.getElementById("buyMinAmt").innerText = format.formatMoney(buyMinAmt);
		document.getElementById("buySecMinAmt").innerText = format.formatMoney(buySecMinAmt);
//		document.getElementById("buyStepAmt").innerText = buyStepAmt;
		document.getElementById("f_b24minamt").innerText = format.formatMoney(f_b24minamt);
		document.getElementById("f_holdmin").innerText = format.formatMoney(f_holdmin);
		document.getElementById("f_day_payment").innerText = 'T+'+(parseInt(f_day_payment)+1);
		function isValiteMoney(value){
			if(value == null || value =='null' || value ==undefined || value=='undefined' || value =="" ||value.trim()==""){
				value =0;
			}
			return value;
		}
		var subscribrate_phone = [];
		var purchasrate_phone = [];
		var redemrate_phone = [];
		fundBuyRateQuery();
		function fundBuyRateQuery(){
			params = {
				"liana_notCheckUrl" : false,
				"f_prodcode" : f_prodcode,
				"f_tano" : f_tano
			};
			urlVar = mbank.getApiURL()+'fundBuyRateQuery.do';
			mbank.apiSend("post",urlVar,params,fundBuyRateQuerySuc,fundBuyRateQueryFail,true);
			function fundBuyRateQuerySuc(data){
				if(data.ec == "000"){
					subscribrate_phone = data.f_subscribrate_phone.split("|");
					splitRate(subscribrate_phone,"subscribrate");
					purchasrate_phone = data.f_purchasrate_phone.split("|");
					splitRate(purchasrate_phone,"purchasrate");
					redemrate_phone = data.f_redemrate_phone.split("|");
					splitRate(redemrate_phone,"redemrate");
				}else{
					mui.alert(data.em);
				}
			}
			function fundBuyRateQueryFail(e){
				mui.alert(e.em);
			}
		}
		//只取费率列表中第一个
		function splitRate(arr,divId){
			var splitFlag = arr[0];
			if(splitFlag == "0"){
				document.getElementById(divId+"_none").innerText = "--";
			}else if(splitFlag == "1" || splitFlag == "2" || splitFlag == "3"){
				var arrNew = arr.slice(2);
				if(arrNew.length%7==0){
					var html ="";
					if(arrNew[4]=="0"){
						html = parseFloat(arrNew[6]).toFixed(2) +"%";
					}else if(arrNew[4]=="1"){
						html = format.formatMoney(arrNew[6])+'元';
					}else{
						html = "--";
					}
					document.getElementById(divId+"_none").innerHTML = html;
				}else{
					document.getElementById(divId+"_none").innerText = "--";
				}
			}else{
				document.getElementById(divId+"_none").innerText = "--";
			}
		}
		//分段显示费率
		/*function splitRate(arr,divId){
			var splitFlag = arr[0];
			if(splitFlag == "0"){
				document.getElementById(divId+"_phone").style.display = "none";
				document.getElementById(divId+"_none").style.display = "block";
			}else if(splitFlag == "1" || splitFlag == "2" || splitFlag == "3"){
				var splitSection ="";
				if(splitFlag == "2" || splitFlag == "3"){
					splitSection = jQuery.param.getDisplay("FUND_RATETIMESLICE",arr[1]);
				}
				var amtMsg ="购买金额";
				if(divId =="redemrate"){
					amtMsg ="赎回金额";
				}
				var arrNew = arr.slice(2);
				if(arrNew.length%7==0){
					var html ="";
					for(var i=0;i<arrNew.length;i=i+7){
						var everyArr= arrNew.slice(i,i+7);
						if(splitFlag == "1"){
							if(everyArr[4]=="0"){
								if(i==0){
									html +='<span class="color_6">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />费率为：'+everyArr[6]+'%；<br/>';
								}else{
									html +='<span class="color_6 fund_xqfl">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />费率为：'+everyArr[6]+'%；<br/>';
								}
							}else if(everyArr[4]=="1"){
								if(i==0){
									html +='<span class="color_6">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />费率为：'+format.formatMoney(everyArr[6])+'元；<br/>';
								}else{
									html +='<span class="color_6 fund_xqfl">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />费率为：'+format.formatMoney(everyArr[6])+'元；<br/>';
								}
							}
						}else if(splitFlag == "2"){
							if(everyArr[4]=="0"){
								if(i==0){
									html +='<span class="color_6">'+everyArr[0] +splitSection+'<=持有时间<'+everyArr[1]+splitSection+'，费率为：'+everyArr[6]+'%；<br/>';
								}else{
									html +='<span class="color_6 fund_xqfl">'+everyArr[0] +splitSection+'<=持有时间<'+everyArr[1]+splitSection+'，费率为：'+everyArr[6]+'%；<br/>';
								}
							}else if(everyArr[4]=="1"){
								if(i==0){
									html +='<span class="color_6">'+everyArr[0] +splitSection+'<=持有时间<'+everyArr[1]+splitSection+'，费率为：'+format.formatMoney(everyArr[6])+'元；<br/>';
								}else{
									html +='<span class="color_6 fund_xqfl">'+everyArr[0] +splitSection+'<=持有时间<'+everyArr[1]+splitSection+'，费率为：'+format.formatMoney(everyArr[6])+'元；<br/>';
								}
							}
						}else if(splitFlag == "3"){
							if(everyArr[4]=="0"){
								if(i==0){
									html +='<span class="color_6">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />'+everyArr[2] +splitSection+'<=持有时间<'+everyArr[3]+splitSection+'，费率为：'+everyArr[6]+'%；<br/>';
								}else{
									html +='<span class="color_6 fund_xqfl">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />'+everyArr[2] +splitSection+'<=持有时间<'+everyArr[3]+splitSection+'，费率为：'+everyArr[6]+'%；<br/>';
								}
							}else if(everyArr[4]=="1"){
								if(i==0){
									html +='<span class="color_6">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />'+everyArr[2] +splitSection+'<=持有时间<'+everyArr[3]+splitSection+'，费率为：'+format.formatMoney(everyArr[6])+'元；<br/>';
								}else{
									html +='<span class="color_6 fund_xqfl">'+format.formatMoney(everyArr[0])+'元<='+amtMsg+'<'+format.formatMoney(everyArr[1])+'元，<br />'+everyArr[2] +splitSection+'<=持有时间<'+everyArr[3]+splitSection+'，费率为：'+format.formatMoney(everyArr[6])+'元；<br/>';
								}
							}
						}
					}
					document.getElementById(divId+"_none").style.display = "none";
					document.getElementById(divId+"_phone").innerHTML = html;
					document.getElementById(divId+"_phone").style.display = "block";
				}else{
					document.getElementById(divId+"_phone").style.display = "none";
					document.getElementById(divId+"_none").style.display = "block";
				}
			}else{
				document.getElementById(divId+"_phone").style.display = "none";
				document.getElementById(divId+"_none").style.display = "block";
			}
		}*/
	});
});