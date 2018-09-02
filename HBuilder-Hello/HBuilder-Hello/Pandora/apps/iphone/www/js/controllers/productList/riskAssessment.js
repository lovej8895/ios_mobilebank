define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var cstName = "";
		queryCstInfo();
		function queryCstInfo(){
			var dataNumber = {
				cstType : "1",
				certType : userInfo.getSessionData("session_certType"),
				certNo : userInfo.getSessionData("session_certNo")
			};
			var url = mbank.getApiURL() + 'queryCstInfo.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				if(data.cstno == null){
					$('#noRisk').show();
					return false;
				}else{
					cstName = data.cstName;
					$('#mainDiv').show();
				}
			}
			function errorCallback(e){
		    	mui.alert(e.em);
		    }
		}
		
		$("#confirmButton").on("tap", function(){
			var nameObj;
			var totalGrade = '';
			var riskLevel = 0;
			for(var i = 1; i <= 10; i++) {
				nameObj = "radio" + i;
				var value = $('[name="' + nameObj + '"]:checked').val();
				if(value == null || value == ""){
					mui.alert("请为第" + i + "题选择答案！");
					return false;
				} else {
					totalGrade += new Number(value) + ",";
				}
			}
			totalGrade = totalGrade.substring(0,19);
		    var dataNumber = {
		    	customerId : userInfo.getSessionData("session_hostId"),
		    	paperCode : "1",
		    	riskAns : totalGrade,
		    	cstName : cstName
		    };
		    var url = mbank.getApiURL() + '009002_riskTitelSubmit.do';
		    mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
		    function successCallback(data){
		    	var cusriskLevel = data.cusriskLevel;
		    	var riskendDate = data.riskendDate;
		    	var riskResultDes = data.riskResultDes;
		    	var cstName = data.cstName;
		    	var params = {
		    		cusriskLevel : cusriskLevel,
		    		riskendDate : riskendDate,
		    		riskResultDes : riskResultDes,
		    		cstName : cstName,
		    		noCheck : false
		    	};
				mbank.openWindowByLoad('riskAsseResult.html','riskAsseResult','slide-in-right',params);
		    }
		    function errorCallback(e){
		    	mui.alert(e.em);
		    }
		});
		
		$("#resetButton").on("tap", function(){
			for (var i = 0; i <= 10; i++) {
				nameObj = "radio" + i;
				$('[name="' + nameObj + '"]').attr("checked", false);
			}
		});
	});
});