define(function(require, exports, module) {
	var mbank = require('../../core/bank');
//  var myAcctInfo = require('../../core/myAcctInfo');
//	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	
	var f_paper_cnt = "";
	var f_paper_code = '';
//	var f_bank_cust_code = userInfo.getSessionData("session_hostId");
	var f_operorg = ""; //开户网点
	var accountNo = "";
	var f_methodflag = "";
	var turnPageBeginPos = 1;
	var turnPageShowNum = 20;
	var turnPageTotalNum;
	var f_question_code;
	
	if (mui.os.android) {    		
		document.getElementById("questionListTable").style.paddingTop = "0px";
	}else{
		document.getElementById("questionListTable").style.paddingTop = "60px";
	}
	
	mui.init({
		pullRefresh: {
			container: '#pullRefresh',
			/*down: {
				callback:pulldownfresh
			},*/
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	
	/*function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos = 1;
			queryQuestionInfo(1);
			mui('#pullRefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullRefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }*/
	
 	function pullupRefresh(){
		setTimeout(function() {			
			var currentNum = $('#questionList li').length;
			if(currentNum >= turnPageTotalNum) { 
				mui('#pullRefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryQuestionInfo(turnPageBeginPos);
			mui('#pullRefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
   	}
	
	

	mui.plusReady(function() {		
		plus.screen.lockOrientation("portrait-primary");
		plus.webview.close(plus.webview.getWebviewById("fundCustomerSign_Result"));
		//要求别人页面直接传递账号过来
		var self = plus.webview.currentWebview();		
		accountNo = self.accountNo;
		queryQuestionInfo = function(turnPageBeginPos){
			var dataNumber = {
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum,	
				f_cust_type : "1"
			};
			var url = mbank.getApiURL() + 'fundRiskProblemQuery.do';
			mbank.apiSend("post",url,dataNumber,queryQuestionInfoSuc,queryQuestionInfoErr,true);
			function queryQuestionInfoSuc(data){
				turnPageTotalNum = data.turnPageTotalNum;
				var f_fundRiskProblemList = data.f_fundRiskProblemList;
				if( turnPageBeginPos == 1 ){
		       	   	$("#questionList").empty();
		       	}
				if (f_fundRiskProblemList.length == 0) {
					return;
				}	       			       	
				var html = '';				
				var f_question_code = '';
				var f_question_name = '';
				
				f_paper_cnt = data.f_paper_cnt;						
				
				for(var i=0;i<f_fundRiskProblemList.length;i++){	
					
					f_paper_code = f_fundRiskProblemList[i].f_paper_code; //题库代码
					f_question_code = f_fundRiskProblemList[i].f_question_code; //题目代码
					var f_question_name = f_fundRiskProblemList[i].f_question_name; //题目名称
					var f_options = f_fundRiskProblemList[i].f_options; //题目选项
					var f_option_content = f_fundRiskProblemList[i].f_option_content; //题目选项内容
					var f_option_point = f_fundRiskProblemList[i].f_option_point; //题目选项分值
					var optionsArray = f_options.split("|");
					var contentArray = f_option_content.split("|");
					
							
						html+='<p class="fz_15 color_333 m_top10px">' + f_question_code + '.' + f_question_name + '</p>';
	
						for(var j = 0;j<optionsArray.length;j++){
							html+='<div class="mui-input-row mui-radio mui-left">';	
			      	    	html+='<label>' + optionsArray[j] + '、' + contentArray[j] +'</label>';
			      	    	html+='<input name='+(f_paper_code+i)+' type="radio" value=' +optionsArray[j]+ '>';
			      	    	html+='</div>';
			      	    }			      	 																							
				}
								
				$("#questionList").append(html);
			}
			function queryQuestionInfoErr(e){
		    	mui.alert(e.em);
		    }
		}
		
		turnPageBeginPos = 1;
		queryQuestionInfo(turnPageBeginPos);
		
		
		$("#confirmButton").on("tap", function(){
			var nameObj;
			var totalGrade = '';
			var riskLevel = 0;
			for(var i = 0; i <f_paper_cnt; i++) {
				nameObj = f_paper_code + i;
				var value = $('[name="' + nameObj + '"]:checked').val();				
				if(value == null || value == ""){
					mui.alert("请为第" + (i+1) + "题选择答案！");
					return false;
				} else {
					totalGrade += new Number(value) + ",";
				}
			}
			totalGrade = totalGrade.substring(0,totalGrade.length-1);
			
		    var dataNumber = {
		    	f_paper_code : f_paper_code, //试题编号
		    	f_risk_ans : totalGrade,
		    	f_deposit_acct : accountNo
		    };
		    var url = mbank.getApiURL() + 'fundRiskCheck.do';
		    mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
		    function successCallback(data){		    	
		    	var f_cust_risk = data.f_cust_risk;
				var f_risk_end_date = data.f_risk_end_date;
				
		    	var params = {
		    		f_deposit_acct : accountNo,
		    		f_cust_risk : f_cust_risk,
		    		f_risk_end_date : f_risk_end_date,		    		
		    		noCheck : false
		    	};
				mbank.openWindowByLoad('../fund/fundRiskQuery.html','fundRiskQuery','slide-in-right',params);
		    }
		    function errorCallback(e){
		    	mui.alert(e.em);
		    }
		});
		
		
		$("#resetButton").on("tap", function(){
			
			for (var i = 0; i <f_paper_cnt; i++) {				
				var temp = f_paper_code+i;
				$('[name="' + temp + '"]').attr("checked", false);
			}
		});
		
		mbank.resizePage(".btn_bg_f2");
	});
});