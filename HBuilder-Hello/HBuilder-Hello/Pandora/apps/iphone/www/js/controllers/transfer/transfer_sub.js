define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format=require('../../core/format');
	mui.init();
	mui.plusReady(function(){
		$("#transferMenu>li").on("tap",function(){
			var id =$(this).attr("id");
		    var path=$(this).attr("path");
		    var noCheck=$(this).attr("noCheck");
		    mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});
		
		queryLatestRecAccount();
		
        function queryLatestRecAccount(){
			var url = mbank.getApiURL()+'002007_queryLatestRecAccount.do';
	        var nowDate=new Date();
		    var param={
//		    	beginDate:format.formatDate(format.addDay(nowDate,-30))+'000000',
//		    	endDate:format.formatDate(nowDate)+'235959'
		    };
	    	mbank.apiSend("post",url,param,successCallback,errorCallback,true);
	    	function successCallback(data){
		        var iTransferItems=data.iTransferItems;
		        if( iTransferItems.length>0 ){
		        	var html="";
		        	for( var i=0;i<iTransferItems.length;i++ ){
		        		var tranDetail=iTransferItems[i];
		        		var recAccountOpenBank=tranDetail.recAccountOpenBank;
		        		var recAccountOpenBankName=tranDetail.recAccountOpenBankName;
		        		var transferType=tranDetail.transferType;
		        		if( transferType=="1" || transferType=="3" ){
		        			recAccountOpenBank="";
		        			recAccountOpenBankName="湖北银行";
		        		}
	                    var recAccount=tranDetail.recAccount;					     
		        		html+='<li transferType="'+transferType+'" recAccount="'+recAccount+'" recAccountName="'+tranDetail.recAccountName+'" '
		        		     +'recAccountOpenBank="'+recAccountOpenBank+'" recAccountOpenBankName="'+recAccountOpenBankName+'">'
					     	 +'   <p class="symbol"></p>'
					    	 +'   <p class="fz_16">'+tranDetail.recAccountName+'</p>'
					    	 +'   <p class="m_left15px"><span class="color_9">'+recAccountOpenBankName+'</span><span class="m_left10px">'+format.dealAccountHideFour(recAccount)+'</span></p>'
					    	 +'   <a class="link_rbg m_top5px"></a>'			
						     +'</li>';					     
						     
		        	}
		        	$("#transferList").empty().append("<li><p>最近转账人</p></li>");
		        	$("#transferList").append(html);
			    	$("#transferList li").on("tap",function(){
			    		var transferType=$(this).attr("transferType");
			    		var recAccount=$(this).attr("recAccount");
			    		var recAccountName=$(this).attr("recAccountName");
			    		var recAccountOpenBank=$(this).attr("recAccountOpenBank");
			    		var recAccountOpenBankName=$(this).attr("recAccountOpenBankName");
			    		console.log(transferType);
			            if( transferType=="1" || transferType=="3" ){
			            	var param={
			            		recAccount:recAccount,
			            		recAccountName:recAccountName
			            	};
			            	mbank.openWindowByLoad('../transfer/innerTranInput.html','innerTranInput','slide-in-right',param);
			            }
			            if( transferType=="2" ){
			            	var param={
			            		recAccount:recAccount,
			            		recAccountName:recAccountName,
			            		recAccountOpenBank:recAccountOpenBank,
			            		recAccountOpenBankName:recAccountOpenBankName
			            	};
			            	mbank.openWindowByLoad('../transfer/interTranInput.html','interTranInput','slide-in-right',param);
			            }   
			    	});	        	
		        }
		    }
	    	function errorCallback(data){
	    		mui.alert(data.em);
		    }        	
        }
    	
        window.addEventListener("queryLatestRecAccount",function(event){
           queryLatestRecAccount();
        });
    	
	});
});