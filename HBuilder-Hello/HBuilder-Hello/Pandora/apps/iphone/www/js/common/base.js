function setMiddle(aChild){
	if(aChild[0]){
		for(var i = 0;i<aChild.length;i++){
			if(aChild[i].currentStyle){
				var oPaddingTop = aChild[i].parentNode.currentStyle["paddingTop"];
				var oPaddingBottom = aChild[i].parentNode.currentStyle["paddingBottom"];
			}else{
				var oPaddingTop = getComputedStyle(aChild[i].parentNode,false)["paddingTop"];
				var oPaddingBottom = getComputedStyle(aChild[i].parentNode,false)["paddingBottom"];
			}
			parseInt()
    	 	aChild[i].style.marginTop = ((aChild[i].parentNode.offsetHeight - aChild[i].offsetHeight - parseInt(oPaddingTop) - parseInt(oPaddingBottom))/2) + "px";
    	}
	}else{
		aChild.style.marginTop = ((aChild.parentNode.offsetHeight - aChild.offsetHeight)/2) + "px";
	}
	
}

function Square(ele){
	if(ele[0]){
		for(var i = 0;i<ele.length;i++){
    	 	ele[i].style.height = ele[i].offsetWidth + "px";
    	}
	}else{
		ele.style.height = ele.offsetWidth + "px";
	}
	
}
