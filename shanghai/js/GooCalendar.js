/*日历控件定义-GooCalendar类*/
//InputID :要被绑定的INPUT对象的ID
//property  :JSON变量，Progress的详细参数设置
function GooCalendar(InputID,property){
	
	this.$divId=property.divId;//日历控件所在DIV的ID
	this.$div=$("<div id='"+this.$divId+"' class='Calendar' style='display:none'></div>");
	this.$div.addClass("Calendar");
	if(property.fixid)
		this.$fixid=property.fixid;
	temp="<div class='top'><b class='arrow'><div class='left'></div></b><b class='arrow' style='float:right;'><div class='right'></div></b></div>"+
		"<div class='week'></div><div class='day'></div>"+
		"<div class='bottom'><div class='cal_btn'>今天</div><div class='time'></div><div class='cal_btn' style='float:right'>关闭</div></div>";
	this.$div.append(temp);
	var now =new Date();
	this.$daysNum=[31,28,31,30,31,30,31,31,30,31,30,31];
	this.$date={
		year:now.getFullYear(),
		month:now.getMonth()+1,
		day:now.getDate(),
		hour:now.getHours(),
		minute:now.getMinutes(),
		second:now.getSeconds()
	};//用来保存当前所选的时间
	this.$days=this.$div.children(".day");
	this.$selectMonth=$("<b id='"+this.$divId+"Month' style='width:92px;'><span>aa</span><select style='display:none'></select></b>");
	this.$selectYear=$("<b id='"+this.$divId+"Year' style='width:36px;'><span>aa</span><select style='display:none'></select></b>");
	this.$div.children(".top").children("b:eq(0)").after(this.$selectYear).after(this.$selectMonth);
	this.$selectDay=null;
	this.$selectTime=null;
	//是否需要显示精确到秒的时间选择器
	this.$needTime=false;
	if(property.needTime){
		this.$needTime=property.needTime;
		this.$selectTime={
			hour:$("<input type='text' size='2' maxlength='2' title='hour' value='"+this.$date.hour+"' onkeyup=\"if(isNaN(this.value)||this.value<0||this.value>23) this.value='0'\"/>"),
			minute:$("<input type='text' size='2' maxlength='2' title='minute' value='"+this.$date.minute+"' onkeyup=\"if(isNaN(this.value)||this.value<0||this.value>59) this.value='0'\"/>"),
			second:$("<input type='text' size='2' maxlength='2' title='second' value='"+this.$date.second+"' onkeyup=\"if(isNaN(this.value)||this.value<0||this.value>59) this.value='0'\"/>")
		};
		this.$div.children(".bottom").children(".time").append(this.$selectTime.hour).append("：").append(this.$selectTime.minute).append("：").append(this.$selectTime.second);
	}
	//设定WEEK
	if(property.week)
		this.$week=property.week;
	else
		this.$week=['Su','Mo','Tu','We','Th','Fr','Sa'];//从左至右，周日，周一。。。。。。周六
	temp="";
	for(i=0;i<this.$week.length;++i){
		temp+="<div>"+this.$week[i]+"</div>";
	}
	this.$div.children("div:eq(1)").append(temp);
	
	//设定年份范围
	if(property.yearRange)
		this.$yearRange=property.yearRange;
	else
		this.$yearRange=[1970,2030];//数组第一个为开始年份，第二个为结束年份
	temp="";
	for(i=this.$yearRange[0];i<=this.$yearRange[1];++i){
		temp+="<option value='"+i+"'>"+i+"</option>";
	}
	this.$selectYear.children("select").html(temp);
	this.$selectYear.children("select").val(this.$date.year);
	this.$selectYear.children("span").html(this.$date.year);
	
	//设定月份格式
	if(property.month)
		this.$month=property.month;
	else
		this.$month=['January','February','March','April','May','June','July','August','September','October','November','December'];//数组顺序，从一月至十二月
	temp="";
	for(i=0;i<this.$month.length;++i){
		temp+="<option value='"+(i+1)+"'>"+this.$month[i]+"</option>";
	}
	this.$selectMonth.children("select").html(temp);
	this.$selectMonth.children("select").val(this.$date.month);
	this.$selectMonth.children("span").text(this.$month[this.$date.month-1]);
	//设定日期输出格式
	if(property.format)
		this.$format=property.format;
	else
		this.$format="yyyy-MM-dd hh:mm:ss";
		
	//根据传入的年，月，设定这个月内的所有日期
	this.initDatesByYM=function(year,month){
		this.$days.empty();
		first=new Date(year,month-1,1).getDay();
		if(first>0)
			var temp="<div style='width:"+(27*first)+"px;height:20px;float:left;'></div>";//占位而已
		else
			var temp="";
		var i;
		now=new Date();
		nowYear=now.getFullYear();nowMonth=now.getMonth();nowDate=now.getDate();
		for(i=1;i<=this.$daysNum[month-1];++i){
			temp+="<a href='#' class='";
			if(year==nowYear&&month==nowMonth+1&&i==nowDate)
				temp+="today";
			if(year==this.$date.year&&month==this.$date.month&&i==this.$date.day)
				temp+=" select";
			temp+="'>"+i+"</a>";
		}
		if(year%4==0&&month==2){//如果是闰年
			temp+="<a href='#' class='";
			if(year==nowYear&&month==nowMonth+1&&i==nowDate)
				temp+="today";
			if(year==this.$date.year&&month==this.$date.month&&i==this.$date.day)
				temp+=" select";
			temp+="'>"+i+"</a>";
		}
		this.$days.append(temp);
		this.$selectDay=this.$days.children(".select");
	};	
		
	//跳转至上一个月
	this.preMonth=function(){
		year=this.$selectYear.children("span").text();
		month=this.$selectMonth.children("select").val();
		if(month>1) month--; 
		else{
			month=12;
			year--; this.$selectYear.children("span").text(year);
			this.$selectYear.children("span").text(year);
			this.$selectYear.children("select").val(year);
		}
		this.$selectMonth.children("span").text(this.$month[month-1]);
		//this.$tempDate.month=month;
		this.$selectMonth.children("select").attr("value",month);
		this.initDatesByYM(year,month);
	};
	//跳转至下一个月
	this.nextMonth=function(){
		year=this.$selectYear.children("span").text();
		month=this.$selectMonth.children("select").val();
		if(month<12) month++;
		else{
			month=1;
			year++; this.$selectYear.children("span").text(year);
			this.$selectYear.children("span").text(year);
			this.$selectYear.children("select").val(year);
		}
		this.$selectMonth.children("span").text(this.$month[month-1]);
		this.$selectMonth.children("select").val(month);
		this.initDatesByYM(year,month);
	};
	//设定当用户定击日期后的事件
	this.$days.bind("click",{inthis:this},function(e){
		inthis=e.data.inthis;
		var $clicked = $(e.target);
		if($clicked.is("a")){
			if ( e && e.preventDefault )
			//阻止默认浏览器动作(W3C)
			e.preventDefault();
			else
			//IE中阻止函数器默认动作的方式
			window.event.returnValue = false;
			inthis.$selectDay.removeClass("select");
			$clicked.addClass("select");
			inthis.$selectDay=$clicked;
			inthis.$date.year=inthis.$selectYear.children("select").val();
			inthis.$date.month=inthis.$selectMonth.children("select").val();
			inthis.$date.day=$clicked.text();
			if(inthis.$needTime){
				inthis.$date.hour=inthis.$selectTime.hour.val();
				inthis.$date.minute=inthis.$selectTime.minute.val();
				inthis.$date.second=inthis.$selectTime.second.val();
			}
			var lastDate=new Date(inthis.$date.year,inthis.$date.month-1,inthis.$date.day);
			if(inthis.$needTime){
				lastDate.setHours(inthis.$date.hour,inthis.$date.minute,inthis.$date.second);
			}
			if(!inthis.$fixid) inthis.$div.css("display","none");
			$("#"+InputID).val(lastDate.format(inthis.$format));
			return false;
		}
	});
	this.initDatesByYM(this.$date.year,this.$date.month);
	this.$div.children(".top").children("b:eq(0)").bind("click",{inthis:this},
		function(e){inthis=e.data.inthis;inthis.preMonth();}
	);
	this.$div.children(".top").children("b:eq(3)").bind("click",{inthis:this},
		function(e){inthis=e.data.inthis;inthis.nextMonth();}
	);
	this.$selectMonth.bind("mousedown",function(e){
		tmpThis=$(this).children("span");
		if(tmpThis.css("display")!='none'){
			tmpThis.hide();
			$(this).children("select").show();
			$(this).children("select").focus();
			$(this).next().children("select").blur();
		}
	});
	this.$selectYear.bind("mousedown",function(e){
		tmpThis=$(this).children("span");
		if(tmpThis.css("display")!='none'){
			tmpThis.hide();
			$(this).children("select").show();
			$(this).children("select").focus();
			$(this).prev().children("select").blur();
		}
	});
	this.$selectMonth.children("select").bind("blur",{span:this.$selectMonth.children("span"),inthis:this},
	function(e){
		tmpThis=$(this);
		inthis=e.data.inthis;
		if(e.data.span.text!=inthis.$month[tmpThis.val()-1]){
			e.data.span.text(inthis.$month[tmpThis.val()-1]);
			inthis.initDatesByYM(inthis.$selectYear.children("select").val(),tmpThis.val());
		}
		tmpThis.hide();
		e.data.span.show();
	});
	this.$selectMonth.children("select").bind("change",function(){this.blur()});
	
	this.$selectYear.children("select").bind("blur",{span:this.$selectYear.children("span"),inthis:this},
	function(e){
		tmpThis=$(this);
		inthis=e.data.inthis;
		if(e.data.span.text!=tmpThis.val()){
			e.data.span.text(tmpThis.val());
			inthis.initDatesByYM(tmpThis.val(),inthis.$selectMonth.children("select").val());
		}
		tmpThis.hide();
		e.data.span.show();
	});
	this.$selectYear.children("select").bind("change",function(){this.blur()});
	//返回本年本月界面
	this.gotoToday=function(){
		now = new Date();
		year=now.getFullYear();month=now.getMonth()+1;
		this.$selectMonth.children("span").text(this.$month[month-1]);
		this.$selectMonth.children("select").val(month);
		this.$selectYear.children("span").text(year);
		this.$selectYear.children("select").val(year);
		this.initDatesByYM(year,month);
		if(this.$needTime){
			this.$selectTime.hour.val(now.getHours());
			this.$selectTime.minute.val(now.getMinutes());
			this.$selectTime.second.val(now.getSeconds());
		}
	};
	this.$div.children(".bottom").children("div:eq(0)").bind("click",{inthis:this},function(e){e.data.inthis.gotoToday();});
	//放弃本次的时间修改
	this.cancel=function(){
		this.$selectMonth.children("span").text(this.$month[this.$date.month-1]);
		this.$selectMonth.children("select").val(this.$date.month);
		this.$selectYear.children("span").text(this.$date.year);
		this.$selectYear.children("select").val(this.$date.year);
		this.initDatesByYM(this.$date.year,this.$date.month);
		if(this.$needTime){
			this.$selectTime.hour.val(this.$date.hour);
			this.$selectTime.minute.val(this.$date.minute);
			this.$selectTime.second.val(this.$date.second);
		}
		if(!this.$fixid)this.$div.hide();
	}
	this.$div.children(".bottom").children("div:eq(2)").bind("click",{inthis:this},function(e){e.data.inthis.cancel();});
	
	//与INPUT联系上
	if(!this.$fixid){
		$("body").append(this.$div);//把渲染好的控件UI附加在BODY的最后部分
		$("#"+InputID).bind("mousedown",{div:this.$div},function(e){
			var locate=getElCoordinate(this);
			locate.top+=$(this).attr("offsetHeight");
			e.data.div.css({top:locate.top+"px",left:locate.left+"px",display:"block"});
		});
	}
	else
		$("#"+this.$fixid).append(this.$div.css("display","block"));
	document.getElementById(InputID).value="";
	//设定当前所选日期,用户直接传入年月日或者再加上小时：分秒最多6个数字的JSON,参数date为一JSON，由用户自行组装
	this.setDate=function(date){
		this.$date.year=date.year||this.$date.year;
		this.$date.month=date.month||this.$date.month;
		this.$date.day=date.day||this.$date.day;
		this.$date.hour=date.hour||this.$date.hour;
		this.$date.minute=date.minute||this.$date.minute;
		this.$date.second=date.second||this.$date.second;
		lastDate=new Date(this.$date.year,this.$date.month-1,this.$date.day);
		//刷新日历控件的显示
		this.$selectMonth.children("span").text(this.$month[this.$date.month-1]);
		this.$selectMonth.children("select").val(this.$date.month);
		this.$selectYear.children("span").text(this.$date.year);
		this.$selectYear.children("select").val(this.$date.year);
		this.initDatesByYM(this.$date.year,this.$date.month);
		
		if(this.$needTime){
			lastDate.setHours(this.$date.hour,this.$date.minute,this.$date.second);
			this.$selectTime.hour.val(this.$date.hour);
			this.$selectTime.minute.val(this.$date.minute);
			this.$selectTime.second.val(this.$date.second);
		}
		$("#"+InputID).val(lastDate.format(this.$format));
		//刷新日历控件的显示
		this.initDatesByYM(this.$date.year,this.$date.month);
	};
}

//将此类的构造函数加入至JQUERY对象中
jQuery.extend({
	createGooCalendar: function(InputId,property) {
		return new GooCalendar(InputId,property);
  }
}); 
