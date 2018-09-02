$(function(){
	$(".turn_on_way").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	var j = "r";
	$(".automatic_btn_box").on("click", function () {
		if(j == "l"){
			$(".round_btn").animate({right : "-=22px"},100,function(){
				$(".automatic_btn_box").css("background","#2479f4");
				j = "r";
				//是否接受 是
			});
		
		}else{
			$(".round_btn").animate({right	 : "24px"},100,function(){
				$(".automatic_btn_box").css("background","#ddd");
				j = "l";
				//是否接受 否
			});
		}
		
	});
});