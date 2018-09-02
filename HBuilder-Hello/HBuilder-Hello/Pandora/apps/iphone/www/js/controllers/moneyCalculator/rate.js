define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	mui.init({
      		   swipeBack:true //启用右滑关闭功能  		   
      	    });	

	mui.plusReady(function() {
	var url = mbank.getApiURL() + 'depositRateAllQuery.do';
			mbank.apiSend('post', url, {}, querySuccess, null, false);

			function querySuccess(result) {
				var ratesList= result.iDepositRate;
				if(ratesList){
					for(var  i=0;i<ratesList.length;i++){
						
						if(ratesList[i].depositType=='00'||ratesList[i].depositType=='01'){//活期、定期
							jQuery("#"+ratesList[i].depositType+"_"+ratesList[i].savingCode).html(ratesList[i].depositRate);
						}
					}
				}
			}
	});
});