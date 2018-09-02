define(function(require, exports, module){
//	var app = require('../../core/app');
	var mbank = require('../../core/bank');
	
	var returnBtn = document.getElementById('returnBtn');
	
	
	mui.init();
	mui.plusReady(function(){
		
		returnBtn.addEventListener('tap',function(){
			
			mui.back();
			
		},false)
		
		
	})
});
