	function loadADHtml(divH,fixDivBlock,replaceDivBlock,htmlFile,na){
	//用于轮播图片的替换
				if(divH){
					jQuery("#"+fixDivBlock).height(divH);
				}
//				jQuery("#"+replaceDivBlock).hide();
				setTimeout(fadeInAd(htmlFile,replaceDivBlock,na),400);	 
			} 
		function fadeInAd(htmlFile,replaceDivBlock,na){
				var ranmdomNmu = Math.random();
				jQuery("#"+replaceDivBlock).load(jQuery.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/"+ htmlFile+"?t="+ranmdomNmu,function(response,status,xhr){
 			  			if(status == "error"){
							jQuery("#"+replaceDivBlock).fadeIn(500);
 						}
 		  				if(status == "success"){
 		  					var test = jQuery("#"+replaceDivBlock+">div>.mui-slider-indicator>div")	;	
 		  					if(test.length >1){
								mui('#slider').slider({ "interval": 3800 });
 		  					}else{
   		  							test.css("display","none");
 		  					}
		  				}
   		  			 	jQuery("#"+replaceDivBlock).show();
   		  			 	var obj = jQuery("#"+replaceDivBlock) ;
   		  			 	obj.css("visibility","");
 		  				if(na){
 		  					setTimeout(function(){na.close()},800);
 		  				}
 		  		});
			} 
	function loadListADHtml(replaceDivBlock,htmlFile,na){
		//用于单张图片的替换
				jQuery("#"+replaceDivBlock).fadeOut(500) ;
				setTimeout(fadeInAdList(htmlFile,replaceDivBlock,na),400);	 
			} 		
		function fadeInAdList(htmlFile,replaceDivBlock,na){
				jQuery("#"+replaceDivBlock).load(jQuery.param.getReMoteUrl("REMOTE_URL_ADDR")+"/perbank/mbank/html/"+ htmlFile+"?t="+ranmdomNmu,function(response,status,xhr){
 			  			if(status == "error"){
							jQuery("#"+replaceDivBlock).fadeIn(500);
 						}
 		  				if(status == "success"){
 		  					jQuery("#"+replaceDivBlock).fadeIn(500);
		  				}
   		  				setTimeout(function(){na.close()},600);
 		  		});
			}
	function jumpOrShow(mbank,str){
				if(str == ""){
				}else if(str.indexOf("|") != -1){
					str = str.split("|");
				
				var params = {
						returnurl : str[0],
						ADValue : str[1],
						ADtitle : str[2],
						noCheck : "true"
						};
						if(str[0]!= "" || str[1] !=  ""){
							mbank.openWindowByLoad('../adView/adViewDetail.html','adViewDetail','slide-in-right',params);
						}
				 	}
		}
