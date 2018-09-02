define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	var format = require('../../core/format');
	
	var self = "";
	var params;
	var urlVar;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var accountNo=self.accountNo;//签约账号
		var goldAipNo=self.goldAipNo;//定投账号
		var investPeriod;
		var investDate;
		var amount = '200';
		var investAmt = '200';
		
		document.getElementById("accountNo").innerText = accountNo;
		
	    var investMonthList = jQuery.param.getSelectList("GOLD_INVESTDAY_MONTH");
		var investMonthPicker=new mui.SmartPicker({title:"请选择定投日期",fireEvent:"changeInvestMonth"});
		
		var investWeekList=jQuery.param.getSelectList("GOLD_INVEST_WEEK");
		var investWeekPicker=new mui.SmartPicker({title:"请选择定投日期",fireEvent:"changeInvestWeek"});
		
		investPeriodInit();
	    function investPeriodInit(){
	    	var investPeriodList=jQuery.param.getSelectList("INVEST_PERIOD");
			var investPeriodPicker = new mui.SmartPicker({title:"请选择定投周期",fireEvent:"changeInvestPeriod"});
			investPeriodPicker.setData(investPeriodList);
			document.getElementById("changeInvestPeriod").addEventListener("tap",function(){
				investPeriodPicker.show();
			},false);
			investPeriod = '1';
			document.getElementById("investPeriod").innerText = "按月买";
			
			document.getElementById("changeInvestTime").style.display='block';
			investMonthPicker.setData(investMonthList);
			investDate = '01';
			document.getElementById("investTime").innerText = "每月1日" ;
		}
	    
	    window.addEventListener("changeInvestPeriod",function(event){
			investPeriod = event.detail.value;
			document.getElementById("investPeriod").innerHTML = event.detail.text;
			if(investPeriod == "1") {
				document.getElementById("changeInvestTime").style.display='block';
				investMonthPicker.setData(investMonthList);
				investDate = '01';
				document.getElementById("investTime").innerText = "每月1日" ;
			}else if(investPeriod == "4"){
				document.getElementById("changeInvestTime").style.display='block';
				investWeekPicker.setData(investWeekList);
				investDate = '01';
				document.getElementById("investTime").innerText = "星期一" ;
			}else{
				document.getElementById("changeInvestTime").style.display='none';
			}
        });
		
        document.getElementById("changeInvestTime").addEventListener("tap",function(){
			if (investPeriod == "1") {
				investMonthPicker.show();
			} else if(investPeriod == "4"){
				investWeekPicker.show();
			}
		},false);
        
		//选择定投时间触发事件-月
		window.addEventListener("changeInvestMonth",function(event){
			investDate = event.detail.value;
			document.getElementById("investTime").innerHTML = event.detail.text;
		});
		//选择定投时间触发事件-周
		window.addEventListener("changeInvestWeek",function(event){
			investDate = event.detail.value;
			document.getElementById("investTime").innerHTML = event.detail.text;
		});
		
		var amountActiveId ='amt1';
		mui('#amtChange').on('tap','a',function(event) {
			amount = this.getAttribute("value");
			if(amount == "0"){
				document.getElementById("investAmt").style.display="block";	
				document.getElementById("investAmt").value = "";
			}else{
				document.getElementById("investAmt").style.display="none";
			}
			this.classList.remove('border_f');
			this.classList.add('border_red');
			document.getElementById(amountActiveId).classList.remove('border_red');
			document.getElementById(amountActiveId).classList.add('border_f')
			amountActiveId = this.getAttribute('id');
		});
		
		document.getElementById("investAmt").addEventListener("focus",function(){
			if(document.getElementById('investAmt').value){
				document.getElementById('investAmt').value =format.ignoreChar(document.getElementById('investAmt').value,',');
			}
			document.getElementById('investAmt').setAttribute('type','number');
		},false);
		
		document.getElementById("investAmt").addEventListener("blur",function(){
			investAmt = document.getElementById('investAmt').value;
			if(!isValidMoney(investAmt)){
				document.getElementById('investAmt').value ='';
//	        	mui.alert("请输入合法的购买金额");
				return;
			}
			if(parseFloat(investAmt)<200){
				document.getElementById('investAmt').value ='';
				mui.alert("购买金额必须大于等于200");
				return;
			}
			if((parseFloat(investAmt)%100)!=0){
				document.getElementById('investAmt').value ='';
				mui.alert("购买金额必须是100的倍数");
				return;
			}
			document.getElementById('investAmt').setAttribute('type','text');
			document.getElementById('investAmt').value =format.formatMoney(investAmt,2);
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			if(!investPeriod){
				mui.alert("请选择定投周期");
				return false;
			}
			if(investPeriod !='2' && !investPeriod){
				mui.alert("请选择定投日期");
				return false;
			}
			var investAmt=0;
			if(amount == "0"){
				investAmt = document.getElementById("investAmt").value;
				investAmt = format.ignoreChar(investAmt,',');
				if(!isValidMoney(investAmt)){
					document.getElementById('investAmt').value ='';
	        		mui.alert("请输入购买金额");
					return;
				}
				if(parseFloat(investAmt)<200){
					return false;
				}
				if((parseFloat(investAmt)%100)!=0){
					return false;
				}
			}else{
				investAmt=amount;
			}
			params = {
				"accountNo" : accountNo,
				"goldAipNo" : goldAipNo,
				"investPeriod" : investPeriod,
				"investDate" : investDate,
				"payAmount" : investAmt,
				"noCheck" : "false"
			};
			mbank.openWindowByLoad("../gold/goldBuyPlanConfirm.html","goldBuyPlanConfirm",'slide-in-right',params);
		},false);
		
		var muiBack = mui.back;
		mui.back=function(){
			mbank.back('goldHome',muiBack);
		}
		
		mbank.resizePage(".btn_bg_f2");
	});
});