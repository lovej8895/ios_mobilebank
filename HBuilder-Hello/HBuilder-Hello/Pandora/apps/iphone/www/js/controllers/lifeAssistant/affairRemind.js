define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		showRemindDate=function(month){
		    var url = mbank.getApiURL() + 'getAffairDateByMonth.do';
            var m=$('#month').attr('month');
            var y=$('#year').attr('year');
            var month=y+""+(m<10?('0'+m):m);
			mbank.apiSend('post', url, {month:month}, querySuccess, queryError, false);	
			function querySuccess(data){
				var allAffairList=data.allAffairList;
				if( null!=allAffairList && allAffairList.length>0 ){
					for( var i=0;i<allAffairList.length;i++ ){
						var affairDate=allAffairList[i].affairDate;
						var affairType=allAffairList[i].affairType;
						var dateStr=format.dataToDate(affairDate);
						if(affairType=='0'){
							$('a[date="'+dateStr+'"]').append('<span class="round_x"></span>');
						}else if(affairType=='1'){
							$('a[date="'+dateStr+'"]').append('<span class="round_y"></span>');
						}else if(affairType=='2'){
							$('a[date="'+dateStr+'"]').append('<span class="round_z"></span>');
						}else{
							$('a[date="'+dateStr+'"]').append('<span class="round_w"></span>');
						}
					}
				}
			}
			function queryError(){

			}
		}
		getAffairRemindByDate=function(affairDate){
		    var url = mbank.getApiURL() + 'getAffairByDate.do';
			mbank.apiSend('post', url, {affairDate:affairDate}, querySuccess, queryError, false);
			function querySuccess(data){
				var allAffairList=data.allAffairList;
				if( null!=allAffairList && allAffairList.length>0 ){
					for( var j=0;j<allAffairList.length;j++ ){
						var affair=allAffairList[j];
						var affairType=affair.affairType;
					    var topic=affair.affairTopic;
					    var dateTime=affair.affairDate;
					    var remark=affair.affairRemark;
					    var affairTime=affair.affairTime;
					 
						var ul='<ul class="help_conbox ove_hid" id='+ j +' value='+JSON.stringify(affair)+'>'					
	            	    	    +	    '<li class="color_9 m_left10px">'+affair.affairTopic+'</li>'
	            	    	    +		'</ul>'
	            	    	    +		'<ul>'
	            	    	    +	    '<li class="help_con m_left10px">'+affair.affairRemark+'</li>'
	            	    	    +'</ul>';

	            	    $('#affair').append(ul);	    
					}
					/*$('#affair ul').on('tap',function(){
						var i=$(this).attr('id');
						var j = this.getAttribute('id');
						console.log("***************"+i+','+j);
					    var param={
                            type:allAffairList[i].affairType,
                            topic:allAffairList[i].affairTopic,
                            dateTime:allAffairList[i].affairDate,
                            remark:allAffairList[i].affairRemark,
                            affairTime:allAffairList[i].affairTime,
					        noCheck:false
				       }	
			            mbank.openWindowByLoad("../../views/lifeAssistant/affairDetail.html","affairDetail","slide-in-right",param);						
					});*/
				}
			}
			function queryError(){
				
			}			
		}
		
		mui('#affair').on('tap','.help_conbox',function(event) {
			var value = JSON.parse(this.getAttribute('value'));
			var param={
				type:value.affairType,
				topic:value.affairTopic,
				dateTime:value.affairDate,
				remark:value.affairRemark,
				affairTime:value.affairTime,
				noCheck:false
			}
			mbank.openWindowByLoad("../../views/lifeAssistant/affairDetail.html","affairDetail","slide-in-right",param);
		},false);

		calendar.init({showRemindDate:showRemindDate,getAffairRemindByDate:getAffairRemindByDate});
		 		
		$("#add").on("tap", function(){
			var affairDate=calendar.getSelectDay();
			mbank.openWindowByLoad('../../views/lifeAssistant/addRemind.html', 'addRemind', "slide-in-right", {affairDate:affairDate,noCheck:false});
		});
		
		window.addEventListener("reload",function(event){
			$('#affair').empty();
            calendar.init({showRemindDate:showRemindDate,getAffairRemindByDate:getAffairRemindByDate});
        });
	
	
	});
});