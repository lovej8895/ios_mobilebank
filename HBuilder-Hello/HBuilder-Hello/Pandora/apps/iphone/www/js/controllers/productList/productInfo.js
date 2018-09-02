define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var turnPageShowNum=1;
	var turnPageBeginPos=1;
	var total=0;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
        var productNo=self.productNo;
		
		productInfo();
		
		function productInfo(){
			var url = mbank.getApiURL() + '009006_productInfo.do';
			var params={
				productNo: productNo,
				turnPageShowNum:turnPageShowNum,
				turnPageBeginPos:turnPageBeginPos
			}
			mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			function successCallback(data){
				total = data.turnPageTotalNum;
				if (total != 0) {
					document.getElementById("smsContent").innerHTML = dataReplace(data.smsContent);
					document.getElementById("smsTitle").innerHTML = dataReplace(data.msgTitle);
				}
				if(turnPageBeginPos == 1){
					document.getElementById("preButton").setAttribute("disabled",true);
					//document.getElementById("nextButton").setAttribute("disabled",true);
				}else{
					document.getElementById("preButton").removeAttribute("disabled");
				}
				if(turnPageBeginPos == total){
					document.getElementById("nextButton").setAttribute("disabled",true);
				}
				else{
					document.getElementById("nextButton").removeAttribute("disabled");
				}
			}
			function errorCallback(e){
				document.getElementById("nextButton").style.display='none';
				document.getElementById("preButton").style.display='none';
		    	mui.alert(e.em);
		    }
		}
		function dataReplace(content){
			var flag=true;
			while(flag){
				content=content.replace("|","<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
				var index=content.indexOf("|");
				if(index == -1)
				{
			  		flag=false;	
				}
			}
			return content;
		} 
		
		$("#preButton").click(function(){		
			var currentPage = parseInt(turnPageBeginPos) - 1;
			if(currentPage < 1){
				mui.alert("当前页已经是第一页了！");
				return false;
			}else{
				turnPageBeginPos=currentPage;
				productInfo();
			}
		})
		$("#nextButton").click(function(){		
			var currentPage = parseInt(turnPageBeginPos) + 1;
			if(currentPage > total){
				mui.alert("当前页已经是最后一页了！");
				return false;
			}else{
				turnPageBeginPos=currentPage;
				productInfo();
			}
		})
		
	});
});