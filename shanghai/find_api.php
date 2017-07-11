<?php
die;
	// 链接数据库
	header("content-type:text/html;charset=utf-8");
	$link = mysql_connect('127.0.0.1','root','root');
	mysql_query('set names utf8');
	mysql_select_db('test',$link);
	// 订单状态
	$all = $_GET;
	$status = $all['status'];
	$pays = $all['pays'];
	$searchs = $all['searchs'];
	$callback = $all['jsoncallback'];
	$format = $all['format'];
	// 订单查询接口时间
	$search_start_time = $arr['search_start_time'];
	$search_end_time = $arr['search_end_time'];
	//  判断是否在这个时间段内 时间
	$search_start_time = strtotime($search_start_time);
	$search_end_time = strtotime($search_end_time);
	if ($pays == 1) {
		$pays = '支付宝';
	}else if ($pays == 2) {
		$pays = '微信';
	}else if ($pays == 3) {
		$pays = '现金';
	}else if ($pays == 4) {
		$pays = '网银';
	}

	$sql = "select * from sh_order where status = ".$status." and pay_type = '".$pays."' and order_numb like '%".$searchs."%'";
	$info = mysql_query($sql);
	$arr = "";
	while ($info_data = mysql_fetch_assoc($info)){
		$arr[] = $info_data;
	}
	if ($format == 'jsonp') {
		if(!empty($callback)){
			$callback = $all['jsoncallback'];
		}
		$json_data = json_encode($arr);
		$jsonp_data = $callback."(".$json_data.")";
		echo $jsonp_data;
	}



?>