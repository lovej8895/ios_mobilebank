var calendar = {

    init: function(data) {
        data=data||{};
        if( data.showRemindDate ){
        	this.showRemindDate=data.showRemindDate; 
        }
        if( data.getAffairRemindByDate ){
        	this.getAffairRemindByDate=data.getAffairRemindByDate;
        }
        var d=new Date();      
        var strDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
        var monthNumber = d.getMonth() + 1;

        $('#month').html(this.getMonthName(monthNumber));
        $('#year').html(d.getFullYear());
        $('#month').attr('month',monthNumber);        
        $('#year').attr('year',d.getFullYear());
        this.setCalendar(d.getFullYear(),monthNumber); 
        this.setSelectDay(d.getFullYear(),monthNumber,d.getDate());
	    $('#preMonth').on('tap',function(){
            calendar.preMonth();
	    });
	    $('#nextMonth').on('tap',function(){
            calendar.nextMonth();
	    }); 
	    
	    document.getElementById("backbox_fo").addEventListener("swipeleft",function(e){	
	    	if (Math.abs(e.detail.angle) > 150) {
                calendar.nextMonth();	
	    	}
	    });
	    document.getElementById("backbox_fo").addEventListener("swiperight",function(e){
	    	if (Math.abs(e.detail.angle) < 30) {
 		        calendar.preMonth(); 
	    	}
	    });	    
    },
    /**
     * 获取月份中文名字
     * @param {Object} monthNumber
     */
    getMonthName: function(monthNumber) {
        var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        return months[monthNumber - 1];
    },
    /**
     * 算某个月的天数
     * @param {int} year
     * @param {int} month
     */
    getDaysInMonth:function(year,month){
    	month=parseInt(month);
    	var d=new Date(year,month,0);
    	return d.getDate();
    },
    /**
     * 算某个月第一天是星期几
     * @param {int} year
     * @param {int} month
     */
    getFirstDay:function(year,month){
    	month=month-1;
    	var d=new Date(year,month,1);
    	if(d.getDay()==0){
    		return 7;
    	}else{
    		return d.getDay();
    	}
    },
    /**
     * 算某个月最后一天是星期几
     * @param {int} year
     * @param {int} month
     */
    getLastDay:function(year,month){
    	var d=new Date(year,month,0);
    	if(d.getDay()==0){
    		return 7;
    	}else{
    		return d.getDay();
    	}
    },    
    setCalendar:function(year,month){
    	//计算本月总天数 30
        var daysInMonth=this.getDaysInMonth(year,month);
        
        //计算本月第一天是星期几 5
        var firstDayInMonth=this.getFirstDay(year,month); 

        //计算本月最后一天是星期几 6
        var lastDayInMonth=this.getLastDay(year,month);

        //计算上个月最后一天是星期几4
        var showPreMonthDays=firstDayInMonth-1;       

         //计算下个月第一天是星期几 7
        var showNextMonthDays=(lastDayInMonth+1) > 7 ? 1:(lastDayInMonth+1);        

        $('.backbox_fo').empty();
           
    	for( var i=0;i<42;i++){
    		if( i%7==0 ){
    			if( i/7==0 ){
    				$('.backbox_fo').append('<div class="calendar_daybox p_top10px"></div>');
    			}else{
    				$('.backbox_fo').append('<div class="calendar_daybox"></div>');
    			}
    			
    		}
    		var dayHtml='';
    		if( i<showPreMonthDays || i>(daysInMonth+showPreMonthDays-1) ){
    			dayHtml='<a class="color_9"></a>';

    		}else{
    			var day=i-showPreMonthDays+1;    			
    			var date=year+'-'+(month<10?('0'+month):month)+'-'+(day<10?('0'+day):day);
    			dayHtml='<a class="color_9" date="'+date+'">'+day+'</a>';

    		}
    		$('.calendar_daybox:last-child').append(dayHtml);
    	}
    	var d=new Date();
    	var currentYear=d.getFullYear();
    	var currentMonth=d.getMonth()+1;
    	var currentDay=d.getDate();
    	var dateStr=currentYear+'-'+(currentMonth<10?('0'+currentMonth):currentMonth)+'-'+(currentDay<10?('0'+currentDay):currentDay);
    	if( year==currentYear && month==currentMonth ){
    		$('a[date="'+dateStr+'"]').prepend('<span class="today_on"></span>');
    		calendar.getAffairRemindByDate(''+currentYear+(currentMonth<10?('0'+currentMonth):currentMonth)+(currentDay<10?('0'+currentDay):currentDay));
    	}
        calendar.showRemindDate(year+(month>9?month:('0'+month)));
	    $('.calendar_daybox a').on('tap',function(){
	    	$('#affair').empty();
	    	var date=$(this).attr('date');
	    	var dateArray=date.split('-');
	    	$('.today_choose').remove();
	    	var year=dateArray[0];
	    	var month=dateArray[1];
	    	var day=dateArray[2];    	
	    	calendar.setSelectDay(year,month,day);
	    	calendar.getAffairRemindByDate(year+month+day);
	    } );
    },
    setSelectDay:function(year,month,day){
    	var date=year+'-'+month+'-'+day;
    	$('a[date="'+date+'"]').prepend('<span class="today_choose">'+parseInt(day)+'<span>');
    },
    getSelectDay:function(){
    	return $('.today_choose').parents('a').attr('date');
    },
    preMonth:function(){
        var year=parseInt($('#year').attr('year'));
        var month=parseInt($('#month').attr('month'));
        if( month>1 ){
        	month=month-1;
        }else{
        	year=year-1;
        	month=12;
        }
        $('#month').attr('month',month);
        $('#year').attr('year',year);	        
        $('#month').html(calendar.getMonthName(month));
        $('#year').html(year);
        $('#affair').empty();
        calendar.setCalendar(year,month);        	
    },
    nextMonth:function(){
        var year=parseInt($('#year').attr('year'));
        var month=parseInt($('#month').attr('month'));
        if( month==12 ){
        	year=year+1;
        	month=1;
        }else{
        	month=month+1;
        } 
        $('#month').attr('month',month);
        $('#year').attr('year',year);	        
        $('#month').html(calendar.getMonthName(month));
        $('#year').html(year);
        $('#affair').empty();
        
        calendar.setCalendar(year,month);    	
    }
    
};