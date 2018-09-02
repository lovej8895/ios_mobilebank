define(function(require, exports, module) {
    var mbank = require('../../core/bank');
	var format = require('../../core/format');
    transferType="";
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
        var retPage = plus.webview.currentWebview().opener();
        transferType=self.transferType;
        var hotBank=$.bankParam.HOT_BANK;
        for( var i=0;i<hotBank.length;i++ ){
        	var bank=hotBank[i];
        	if(i%4==0){
        		$("#bankDiv").append('<ul class="main_menu_ul main_w25"></ul>');
        	}
        	var li='<li bankNo="'+bank.bankNo+'" fullBankName="'+bank.fullBankName+'"><a class="bankIcon"><img src="../../img/'+bank.logo+'"/><br/><span class="color_6">'+bank.bankName+'</span></a></li>';
        	$("#bankDiv ul:last-child").append(li);
        }
        $("#bankDiv li").on("tap",function(){
        	var clearBankNo=$(this).attr("bankNo");
        	var signBankName=$(this).attr("fullBankName");
			mui.fire(retPage, 'hotBank', {clearBankNo:clearBankNo,signBankName:signBankName});
			plus.webview.currentWebview().close();
        });
        
        $("#searchButton").on("tap",function(){
			var searchKey=$("#searchKey").val();
			var retPageId=retPage.id;
			mbank.openWindowByLoad('selectBank.html','selectBank','slide-in-right',{searchKey:searchKey,payBookType:transferType,retPageId:retPageId});	 
        });     
     
	});


});