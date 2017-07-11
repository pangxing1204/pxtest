<?php
	// <!-- 链接数据库 -->
	$link = mysql_connect('127.0.0.1','root','root');
	// <!-- 设置字符集 -->
	mysql_query("set names utf8");
	// <!-- 选择数据库 -->
	mysql_select_db('test',$link);
	$sql = "select * from sh_order";
	$info = mysql_query($sql);
	$arr = "";
	while ($order_data = mysql_fetch_assoc($info)) {
		$arr[] = $order_data;
	}


	//生成token值 并且将token值保存在session中
	session_start();
	$csrf_token = md5(uniqid());
	$_SESSION['csrf_token'] = $csrf_token;
?>

<html>
<head>
	<title>课程订单</title>
	<link rel="stylesheet" type="text/css" href="http://localhost/new/shanghai/css/GooCalendar.css"/>
	<script type="text/javascript" src="http://localhost/new/shanghai/js/jquery-1.3.2.min.js"></script>
	<script type="text/javascript" src="http://localhost/new/shanghai/js/GooFunc.js"></script>
	<script type="text/javascript" src="http://localhost/new/shanghai/js/GooCalendar.js"></script>
	<!-- <script type="text/javascript" src="jquery.min.js"></script> -->
</head>
<body>
	<form>
		<table>
		    <!-- 传隐藏的token值 -->
			<input type="hidden" name="csrf_token" id="csrf_token" value="<?php echo $csrf_token?>">
			<h3>课程订单</h3>
			<tr>
				<td>创建时间：</td>
				<td><input type="text" name="create_start_time" id="calen">-<input type="text" name="create_end_time" id="calen2"></td>
			</tr>
			<tr>
				<td>筛选条件：</td>
				<td id="selects">
					<select name="status">
						<option value="2">请选择</option>
						<option value="1">已支付</option>
						<option value="0">未支付</option>
					</select>
					<select name="pays">
						<option value="0">请选择</option>
						<option value="1">支付宝</option>
						<option value="2">微信</option>
						<option value="3">现金</option>
						<option value="4">网银</option>
					</select>
					<input type="text" name="order_numb" id="searchs">
					<input type="button" name="" value="搜索" id="btn">
				</td>
			</tr>
		</table>
			<span id="onlys">
		<table border="1">
			<tr>
				<td>订单号</td>
				<td>创建时间</td>
				<td>状态</td>
				<td>实付</td>
				<td>购买者</td>
				<td>支付方式</td>
				<td>操作</td>
			</tr>
				<?php foreach ($arr as $k=>$v) {?>
					<tr>
						<td><?=$v['order_numb']?></td>
						<td><?=$v['order_time']?></td>
						<td><?=$v['status']?></td>
						<td><?=$v['price']?></td>
						<td><?=$v['order_user']?></td>
						<td><?=$v['pay_type']?></td>
						<td><button>订单详情</button></td>
					</tr>
				<?php }?>
		</table>
			</span>
	</form>
</body>
</html>





<script type="text/javascript">
var property={
	divId:"demo2",//日历控件最外层DIV的ID
	needTime:true,//是否需要显示精确到秒的时间选择器，即输出时间中是否需要精确到小时：分：秒 默认为FALSE可不填
	yearRange:[1970,2030],//可选年份的范围,数组第一个为开始年份，第二个为结束年份,如[1970,2030],可不填
	week:['日','一','二','三','四','五','六'],//数组，设定了周日至周六的显示格式,可不填
	month:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],//数组，设定了12个月份的显示格式,可不填
	format:"yyyy-MM-dd hh:mm:ss"
	/*设定日期的输出格式,可不填*/
};
var property2={
	divId:"demo2",//日历控件最外层DIV的ID
	needTime:true,//是否需要显示精确到秒的时间选择器，即输出时间中是否需要精确到小时：分：秒 默认为FALSE可不填
	yearRange:[1970,2030],//可选年份的范围,数组第一个为开始年份，第二个为结束年份,如[1970,2030],可不填
	week:['日','一','二','三','四','五','六'],//数组，设定了周日至周六的显示格式,可不填
	month:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],//数组，设定了12个月份的显示格式,可不填
	format:"yyyy-MM-dd hh:mm:ss"
	/*设定日期的输出格式,可不填*/
};
$(document).ready(function(){
	canva1=$.createGooCalendar("calen",property);
	canva2=$.createGooCalendar("calen2",property2);
	//canva2.setDate({year:2008,month:11,day:22,hour:14,minute:52,second:45});
});


/*
*	实现下拉框的搜索 
*/ 
$("#btn").click(function(){
	var status = $("select[name = status]").val();
	var pays = $("select[name = pays]").val();
	var searchs = $("#searchs").val();
	// 时间
	var starttime = $("#calen").val();//开始
	var endtime = $("#calen2").val();//结束
	var format = 'jsonp';
	alert(endtime);
	$.ajax({
		url:"http://www.getinfo.com",
		data:{status:status,pays:pays,searchs:searchs,format:format,starttime:starttime,endtime:endtime},
		dataType:"jsonp",
		jsonp: "callback", 
		jsonp:'jsoncallback',
		success:function(msg){
			str = '';
			$.each(msg,function(k,v){
				str += '<table border="1"><tr>\
				<td>订单号</td>\
				<td>创建时间</td>\
				<td>状态</td>\
				<td>实付</td>\
				<td>购买者</td>\
				<td>支付方式</td>\
				<td>操作</td>\
			</tr>\
			<tr>\
				<td>'+v.order_numb+'</td>\
				<td>'+v.order_time+'</td>\
				<td>'+v.status+'</td>\
				<td>'+v.price+'</td>\
				<td>'+v.order_user+'</td>\
				<td>'+v.pay_type+'</td>\
				<td><button>订单详情</botton></td>\
				</tr></table>';
			})
			$("span").html(str);
		},
		error:function() {
			alert('fail');
		}
	},"json");
})

</script>












<!-- function sou() {
var times = $('input[name=times_k]').val()+$('input[name=times_j]').val();
var state = $('#state').val();
var price_fa = $('#price_fa').val();
var on_order = $('input[name=on_order]').val();
jQuery(document).ready(function(){
     var url = "http://good.com/show.php";
        $.ajax({
             type: "get",
             async: false,
             url: url,
             data:{times:times,state:state,price_fa:price_fa,on_order:on_order},
             dataType: "jsonp",
             jsonp: "callback",
             jsonpCallback:"data",
             success: function(data){
             	var table = "";
             	table +='<table border="1">'
             	$.each(data,function (i,v) {
                 	table +="<tr>";
                 	table +="<td>"+data[i].times+"</td>"
                 	table +="<td>"+data[i].state+"</td>"
                 	table +="<td>"+data[i].price+"</td>"
                 	table +="<td>"+data[i].user+"</td>"
                 	table +="<td>"+data[i].price_fa+"</td>"
                 	table +="<td>"+data[i].on_order+"</td>"
                 	table +="<td><button>详情<双击查看原图tton></td>"
                 	table +="</tr>";
             	})
             	table +="</table>"
             	$('#box').html(table);
             },
             error: function(){
                 alert('fail');
             }
         });
     });	
} -->