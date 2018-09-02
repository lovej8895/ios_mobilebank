define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var formatUtil=require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	m.init();
	m.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	    var self=plus.webview.currentWebview();
	    var params=self.params;
	    var pageId=params.pageId;
	    var acctlist=params.acctlist;
	    var maskview=plus.webview.getWebviewById(pageId);	
	    var payAccountPop=document.getElementById("payAccountPop");
	    	initdata(acctlist);
        
		function initdata(acctlist){
			var length = acctlist.length,
		        bank = new Object();
		        var defaultcard="";
			for (var index = 0; index < length; index++) {
				bank = acctlist[index];
				//账户类型后续判断
				if(1==1){
					var  cardtype="";

					if(bank.accountFlag=='1'){
						defaultcard+= '<a class="list-item" onclick="payaccinfo(\''+index+'\')">'
				   +'<p class="mui-pull-left cor_666"><font class="fz_16 cor_333">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cardtype+formatUtil.dealAccNoWith8Stars(bank.accountNo)+'</font></p></a>';
					}else{
					payAccountPop.innerHTML += '<a class="list-item" onclick="payaccinfo(\''+index+'\')">'
				   +'<p class="mui-pull-left cor_666"><font class="fz_16 cor_333">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cardtype+formatUtil.dealAccNoWith8Stars(bank.accountNo)+'</font></p></a>';
					}
				}
			}
			payAccountPop.innerHTML=defaultcard+payAccountPop.innerHTML;
		}
		payaccinfo=function(id){
			var acct=acctlist[id];
			mui.fire(maskview, 'accinfo', acct);
			closeMask();
		}
        m.back=function(event){
		closeMask()
        };
        $("#cancel").on("tap",closeMask);
        
        function closeMask() {
			maskview.setStyle({
			mask: "none"
			});
			plus.webview.currentWebview().close();
		}
	});	
	
})