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
		var choosePickerList = [];
		var choosePickerCity;
		$("#list li").on("tap",function(){
			$("#list .pickernew_cion2").hide();
			$(this).find(".pickernew_cion2").show();
			var value=$(this).attr("value");
			var text=$(this).attr("text");
			console.log("text=="+text);
//			getPickerList("2");
//			document.activeElement.blur();
//			choosePickerCity.show();
			if( options.fireEvent ){
				mui.fire(opener,options.fireEvent,{value:value,text:text});
			}
			closeMask();
		});
		
		choosePickerCity = new mui.SmartPicker({title:"请选择城市",fireEvent:"pickCity"});
		function getPickerList(flag){
				choosePickerList=[];
				if(flag=='2'){
								var pickItem={
										value: "",
										text: "全部区域"
								};
								choosePickerList.push(pickItem);
								pickItem={
										value: "10",
										text: "武汉"
								};
								choosePickerList.push(pickItem);
								pickItem={
										value: "11",
										text: "襄阳"
								};
								choosePickerList.push(pickItem);
						choosePickerCity.setData(choosePickerList);
				}
		}		
		
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