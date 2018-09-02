define(function(require, exports, module) {
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	    var self=plus.webview.currentWebview();
	    var params=self.params;
	    var pageId=params.pageId;
	    var acctlist=params.acctlist;
	    var options=params.options;
	    var maskview=plus.webview.getWebviewById(pageId);
	    var opener=plus.webview.getWebviewById(params.openerId);
	    var payAccountPop=document.getElementById("list");
	    if( options.title ){
	    	$(".pickerTitle").html(options.title);
	    }
	    initdata(acctlist);
        
		function initdata(acctlist){
			if(!acctlist){
				return;
			}
			var length = acctlist.length,
	        bank = new Object();
	        var html="";
			for (var index = 0; index < length; index++) {
				bank = acctlist[index];
                html+='<li class="" value="'+bank.value+'" text="'+bank.text+'">'
					+ '<p class="m_left10px">'+bank.text+'</p>';
				if( index==params.defaultIndex ){
					html+='<a class="pickernew_cion2"></a>'; 
				}else{
					html+='<a class="pickernew_cion2" style="display: none;"></a>';        
				}
				html+='</li>';

			}
			payAccountPop.innerHTML=html;
		}
		
		$("#list li").on("tap",function(){
			$("#list .pickernew_cion2").hide();
			$(this).find(".pickernew_cion2").show();
			var value=$(this).attr("value");
			var text=$(this).attr("text");
			if( options.fireEvent ){
				mui.fire(opener,options.fireEvent,{value:value,text:text});
			}
			closeMask();
		});
		
		
        mui.back=function(event){
		closeMask()
        };
        $("#cancel").on("tap",closeMask);
        
        function closeMask() {
			maskview.setStyle({
			mask: "none"
			});
			plus.webview.currentWebview().hide();
		}
        
        $(".pickernew_cion1").on("tap",function(){
        	closeMask();
        });
   
         window.addEventListener("setSelectedIndex",function(event){
         	var index=event.detail.index;
 			$("#list .pickernew_cion2").hide(); 
 			$($("#list .pickernew_cion2")[index]).show();
             
         });
        
	});	
	
})