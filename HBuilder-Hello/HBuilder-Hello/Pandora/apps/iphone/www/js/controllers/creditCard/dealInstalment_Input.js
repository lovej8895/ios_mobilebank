define(function(require, exports, module) {
	
	// 引入依赖
	var mbank = require('../../core/bank');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');	
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var nativeUI = require('../../core/nativeUI');
	
	var iAccountInfoList = [];
	var accountPickerList=[];
	//当前选定账号
	var currentAcct ="";
	var accountPicker ="";
	//总记录数
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback:pulldownfresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos=1;
			queryDealInstalmentList(currentAcct,1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#applyTbody ul').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryDealInstalmentList(currentAcct,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	//根据选中账号查询消费分期入账列表
	queryDealInstalmentList = function(accparam,turnPageBeginPos){
		//清空金额笔数
		$("#totalAmountTD").html("0.00");
		$("#totalNumberTD").html("0");

		var messageDiv = document.getElementById("applyTbody");
		var url2 = mbank.getApiURL() + 'postListQuery.do';
		mbank.apiSend('post', url2, {
			cardNo:accparam,
			turnPageBeginPos:turnPageBeginPos,
			turnPageShowNum:turnPageShowNum
		}, callBack2, null, true);
		function callBack2(data){
			var tempMesHtml ="";
			var checkboxVal ="";
			
			turnPageTotalNum = data.turnPageTotalNum;//总记录数
			if( turnPageBeginPos == 1 ){
		       	  $("#applyTbody").empty();
		    }
			if (turnPageTotalNum > 0) {
				for (var index = 0; index < data.creditCardDealList.length; index++) {
					var currObj = data.creditCardDealList[index];
					checkboxVal = currObj.flowno+"&"+currObj.creditCardNo+"&"+currObj.TrxnDate+"&"+currObj.TrxnDesc+"&"+currObj.BillCurrency+"&"+currObj.TrxnAmt;
					tempMesHtml += '<ul>';
					tempMesHtml += '<li class="mui-input-row mui-checkbox">';
					tempMesHtml += '<p><span class="color_g">'+subDateVal(currObj.TrxnDate)+'</span><span class="m_left10px color_6 fz_14">'+currObj.TrxnDesc+'</span></p>';
					tempMesHtml += '<p class="fz_15 m_left44px">￥'+format.formatMoney(currObj.TrxnAmt)+'</p>';
					tempMesHtml += '<input class="checkbox_new" name="selectClick" value="'+checkboxVal+'" type="checkbox" onclick=showDetail()>';
					tempMesHtml += '</li>';
					tempMesHtml += '</ul>';
				}
				messageDiv.innerHTML = tempMesHtml;
				plus.nativeUI.closeWaiting();
				console.log(messageDiv.innerHTML);
			}else{
					$("#applyTbody").empty();
					plus.nativeUI.toast("此卡无可分期的消费记录");
					//document.getElementById("applyTbody").innerText = data.em;
			}
		}
	}
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		//初始化时申请分期金额、申请分期笔数默认0
		$("#totalAmountTD").html("0.00");
		$("#totalNumberTD").html("0");
		
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
					$("#cardNo").val(currentAcct);
					//查询消费分期列表
					queryDealInstalmentList(currentAcct,1);
				}
			}
		}
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择信用卡卡号",fireEvent:"cardNo"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();
		});
		
		window.addEventListener("cardNo",function(event){
			var pickItem1=event.detail;			
			currentAcct=iAccountInfoList[pickItem1.value].accountNo;
			$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
			$("#cardNo").val(currentAcct);
			queryDealInstalmentList(currentAcct,1);
		});
		
		//选择复选框
		showDetail = function(){
			//清空金额笔数
			$("#totalAmountTD").html("0.00");
			$("#totalNumberTD").html("0");
			var count =1;
			var sum="";
			var boxArray = document.getElementsByName("selectClick");
			for (var i = 0;i < boxArray.length;i++) {
				if (boxArray[i].checked) {
					$("#totalAmountTD").html(subchkboxvalue(boxArray[i].value));
					$("#totalNumberTD").html(count++);
					sum++;
				}
				if (sum >= 10) {
					mui.alert("一次性交易分期所选笔数不能超过10笔");
					boxArray[i].checked = false;
					showDetail();
					break;
				}
			}
			
		}
		
		//截取选中的复选框值
		function subchkboxvalue(paramval){
			var totalAmtval ="";
			var totalamountidvalue = $("#totalAmountTD").html();
			if (paramval != "") {
				var trxnAmtVal = paramval.split("&")[5];				
				var number1 = format.ignoreChar(trxnAmtVal,',');
				var number2 = format.ignoreChar(totalamountidvalue,',');
				number3 = Number(number1)+Number(number2);
				var totalAmtval = Math.round(number3*10)/10;
				return format.formatMoney(totalAmtval);
			}
		}
		
		//把日期YYYYMMDD格式为MM/DD
		subDateVal = function(valdate){
			var showval = "";
			if (valdate != null || valdate != "") {
				if (valdate.length =="8") {
					var mm = valdate.substring(4, 6);
					var dd = valdate.substring(6, 8);
					showval = mm + "/" + dd;
				}
			}
			return showval;
		}
		//下一步
		$("#nextButton").on("tap",function(){
			var totalamttemp = $("#totalAmountTD").html();
			var totalAmountValTemp =format.ignoreChar(totalamttemp,',');
			if(turnPageTotalNum < 1){
				mui.alert("请选择可分期的消费记录");
				return false;
			}
			if (parseFloat(totalAmountValTemp)<500) {
				mui.alert("交易金额超过500元才可进行分期");
				return false;
			}
			var chkselectinfo = document.getElementsByName("selectClick");
			var array_flowno = [],array_creditCardNo = [],array_TrxnDate = [],array_TrxnDesc = [],array_BillCurrency = [],array_TrxnAmt = [];
			for (var j = 0;j < chkselectinfo.length;j++) {
				if (chkselectinfo[j].checked) {
					array_flowno.push(chkselectinfo[j].value.split("&")[0]);
					array_creditCardNo.push(chkselectinfo[j].value.split("&")[1]);
					array_TrxnDate.push(chkselectinfo[j].value.split("&")[2]);
					array_TrxnDesc.push(chkselectinfo[j].value.split("&")[3]);
					array_BillCurrency.push(chkselectinfo[j].value.split("&")[4]);
					array_TrxnAmt.push(chkselectinfo[j].value.split("&")[5]);
				}
			}
			var feeNum = $("#totalNumberTD").html();//笔数
			var cardNo = $("#cardNo").val();
			var params1 = {
        		cardNo:cardNo,
        		FeeNum:feeNum,
        		tranAmt:totalAmountValTemp,
        		flowno:array_flowno,
        		creditCardNo:array_creditCardNo,
        		TrxnDate:array_TrxnDate,
        		TrxnDesc:array_TrxnDesc,
        		BillCurrency:array_BillCurrency,
        		TrxnAmt:array_TrxnAmt,
        		noCheck:true
        	};
        	mbank.openWindowByLoad('dealInstalment_Confirm.html','dealInstalment_Confirm','slide-in-right',params1);
		});
	});
});