//echarts div背景色
var bgcolor = {
	green : "#28A596",// #289CBD"
	blue : "#21ADAD",// #"//#289BAB"//"#289B9F"//"#28909F"//#13B1CD"//
	// #16A0CD
	black : "#344C5A"
// "#289BA9"
}
// 柱状图 折线图 线条颜色
var linecolor = {
	orange : "#E98660",// 橘黄
	blue : "#52D2DD",// 蓝色
	white : "#F1F1EE",// 白色
	black : "#344C5A",// 黑色
	purple : "#844BA1",// 紫色
	tblack : "#526773",// 浅黑色
	twhite : "#E5F3F0",// "#D4EDEA"// 浅白色
	torange : "#FFB324",// 浅橘黄
	brightOrange : "#ff9080",// 鲜橙
	glaucous : "#00bfb7",// 蓝绿色
	grayish : '#bbb',// 浅灰
	darkgray : '#777',// 深灰

}

/*******************************************************************************
 * 格式化开始日期
 * 
 * @param date
 *            传入的日期
 * @param type
 *            1，2,3 表示返回不同的日期格式
 * @returns
 */
function cal_date_s(date, type) {

	var r_date;// return
	// 返回格式为 yyyy-MM-dd
	if (type == "1") {
		var date = new Date();
		date.setTime(date.getTime() - 1000 * 60 * 60 * 24);
		// r_date = date.pattern("yyyy-MM-dd");
		r_date = "2017-04-30";

	}
	// 返回格式为 yyyy-MM-dd HH
	else if (type == "2") {
		r_date = date.pattern("yyyy-MM-dd HH");
	}
	// 返回格式为 yyyy-MM-dd HH:mm
	else if (type == "3") {
		// 小时减5个时辰
		var data = date.setTime(date.getTime() - 1000 * 60 * 60 * 5);
		r_date = date.pattern("yyyy-MM-dd HH:mm");
	} else if (type == "4") {
		var date = new Date();
		date.setTime(date.getTime() - 2000 * 60 * 60 * 24);
		// r_date = date.pattern("yyyy-MM-dd");
		r_date = "2017-03-01";

	} else if(type =="5"){
		var date=new Date();
		//月初第一天    by LiQ 2017-03-03
		r_date = new Date(date.setDate(1)).pattern("yyyy-MM-dd");
//		r_date = "2017-04-01";
	}else if(type =="6"){
		//上个月初第一天    by LiQ 2017-03-03
		var date=new Date();
		r_date = new Date(new Date(date.setDate(1)).setMonth(new Date(date.setDate(1)).getMonth()-1)).pattern("yyyy-MM-dd");;
//		r_date = '2017-03-01';
	}else if(type="7"){
    	date.setMonth(date.getMonth()-1);//当前日期的上个月
    	date.setTime(date.getTime() - 1000 * 60 * 60 * 24);//当前日期的上个月的前一天
		r_date = date.pattern("yyyy-MM-dd");
	}else {
		r_date = date.pattern("yyyy-MM-dd");
	}
	// console.log(r_date)
	return r_date;

}
/*******************************************************************************
 * 格式化结束日期
 * 
 * @param date
 *            传入的日期
 * @param type
 *            1，2,3 表示返回不同的日期格式
 * @returns
 */
function cal_date_e(date, type) {
	var r_date;// return
	// 返回格式为 yyyy-MM-dd
	if (type == "1") {
		var date = new Date();
		date.setTime(date.getTime() - 1000 * 60 * 60 * 24);
		r_date = date.pattern("yyyy-MM-dd");
//		r_date = "2017-04-30";
	}
	// 返回格式为 yyyy-MM-dd HH
	else if (type == "2") {
		r_date = date.pattern("yyyy-MM-dd HH");
	}
	// 返回格式为 yyyy-MM-dd HH：mm
	else if (type == "3") {
		r_date = date.pattern("yyyy-MM-dd HH:mm");
	} else if (type == "4") {
		date.setTime(date.getTime() - 2000 * 60 * 60 * 24);
		// r_date = date.pattern("yyyy-MM-dd");
//		r_date = "2017-03-31";
	}else if(type =="5"){
		var date=new Date();
		r_date = new Date(new Date(date.setTime(date.getTime() - 1000 * 60 * 60 * 24)).setMonth(new Date(date.setTime(date.getTime() - 1000 * 60 * 60 * 24)).getMonth())).pattern("yyyy-MM-dd");;
//		r_date = '2017-03-31';
	}
	else if(type =="6"){
		//当天日期的前一天 （月为上个月） by LiQ  2017-03-03
		var date=new Date();
		r_date = new Date(new Date(date.setTime(date.getTime() - 1000 * 60 * 60 * 24)).setMonth(new Date(date.setTime(date.getTime() - 1000 * 60 * 60 * 24)).getMonth()-1)).pattern("yyyy-MM-dd");;
//		r_date = '2017-03-31';
	}else {
		r_date = date.pattern("yyyy-MM-dd");
	}
	// console.log(r_date)
	return r_date;

}

// 格式化
Date.prototype.pattern = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
								: "\u5468")
								: "")
								+ week[this.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

// 页面置顶与置底 zhangchengtong 20150825
// 添加判断是否是indix 为fasle时执行置顶和置底 zhangshuru 20151013
$(function() {
	var aname = location.href;
	var bname = aname.split("/");
	var cname = bname.slice(bname.length - 1, bname.length);
	if (cname != "index.html") {
		$(document.body)
				.append(
						'<div id="updown"><span class="up"></span><span class="down"></span></div>');
		$("#updown").css("top", window.screen.availHeight / 2 - 100 + "px");
		$(window).scroll(function() {
			if ($(window).scrollTop() >= 100) {
				$('#updown').fadeIn(300);
			} else {
				$('#updown').fadeOut(300);

			}
		});
		$('#updown .up').click(function() {
			$('html,body').animate({
				scrollTop : '0px'
			}, 800);
		});
		$('#updown .down').click(function() {
			$('html,body').animate({
				scrollTop : document.body.clientHeight + 'px'
			}, 800);
		});
	}

	/* 页面加载完毕 左侧导航显示当前页面 */
	setTimeout(function() {
		var b = getHtmlhref().split('.');
		var c = b[0];
		var d = c.split("_");
		var e = d.indexOf("detail");
		g = d.join("_");
		$("#nav a[title*='" + g + "']").addClass("active");
		$("#nav ul a[title*='" + g + "']").parents("ul").show().prev("a").addClass("active");
	}, 300);

	// 点击tab页事件
	$(document).on("click", "#myTab li a", function() {
		tabCon(this.id);
	});

	
});
/* 获取当前页面的路径 ，并且提取出页面Name 调用getHtmlhref() */
var href = window.location.href;
var stringHref = href.split("/");
var a = stringHref;
var a_i;
function getHtmlhref() {
	for (a_i in a) {
		if (a[a_i].indexOf('.html') >= 0) {
			return a[a_i];
		}
	}
}

/*
 * function getHtmlsrc(){ for(a_i in b){ if(b[a_i].indexOf('.html')>=0){ return
 * b[a_i]; } } }
 */

var resultJson;
var eccp_uid = '';
var eccp_prov = '';
var eccp_chn = '';

// 获取session中的用户信息 （与电子渠道对接时用到） by ningyexin and linying 20150927
function getSessionInfos(url) {

	$.ajax({
		type : "GET",
		url : url + "http_request/getSessionInfos.do",
		cache : false,
		async : false,
		success : function(xmlobj) {
			// var xmlobj = "{eccp_uid:'***',eccp_prov:'***',eccp_chn:'***'}";
			resultJson = eval("(" + xmlobj + ")");

			eccp_uid = resultJson.eccp_uid;
			eccp_prov = resultJson.eccp_prov;
			eccp_chn = resultJson.eccp_chn;
			// alert(resultJson.eccp_prov);
			// console.log("用户id:" + eccp_uid + "省份:" + eccp_prov + "渠道:"
			// + eccp_chn);
		}

	});
	return resultJson;
}
// 判断滚动条的位置，设置底部是否显示 by linying 20151014
function setPositionSta() {
	if (document.documentElement.clientHeight < document.documentElement.offsetHeight) {
		$(".footers").css({
			'position' : 'static'
		});
		$(".contain").css({
			'padding-bottom' : '0'
		});
	} else {
		$(".footers").css({
			'position' : 'fixed'
		});
		$(".contain").css({
			'padding-bottom' : '95px'
		});
	}
}

/*******************************************************************************
 * 指定计时器判断是否已经30秒内查询出结果，如果没有结果进行系统提示并提供选择 by ningyexin linying 2015-10-17
 */
function timeOutLayer() {
	setTimeout(function() {

		if ($("#mb").css("display") != 'none') {
			// layer 提示框
			layer.confirm('很抱歉，当前查询数据较大是否继续等待，或返回首页？', {
				btn : [ '继续等待', '返回首页' ]
			// 按钮
			}, function() {
				// 继续等待的处理
				layer.msg('请继续等待！');
			}, function() {
				// 返回首页
				window.location.href = '../../../index.html';
			});
		}

	}, 30000);
}

/*$(document).scroll(function() {
	if ($(document).scrollTop() > 0 && $(document).scrollTop() < 70) {
		var y2 = $(document).scrollTop();
		var y = 70 - y2;
		$(".menuBox").css({
			'top' : y + 'px'
		});
	} else if ($(document).scrollTop() > 130) {
		$(".menuBox").css({
			'top' : '0px'
		});
	} else if ($(document).scrollTop() == 0) {
		$(".menuBox").css({
			'top' : '70px'
		});
	}
	return;
});*/

/*******************************************************************************
 * 千分号
 * 
 * @param data
 * @returns {String}
 */
function formatTmpl(data) {

	var num = data + "";
	// 针对是否有小数点，分情况处理
	var index = num.indexOf(".");
	// alert(index);
	if (index == -1) {// 无小数点
		var reg = /(-?\d+)(\d{3})/;
		while (reg.test(num)) {
			num = num.replace(reg, "$1,$2");
		}
	} else {
		var intPart = num.substring(0, index);
		var pointPart = num.substring(index + 1, num.length);
		var reg = /(-?\d+)(\d{3})/;
		while (reg.test(intPart)) {
			intPart = intPart.replace(reg, "$1,$2");
		}
		num = intPart + "." + pointPart;
	}
	return num;
}

/*******************************************************************************
 * 根据选择的Tab页对页面iframe重新赋值
 * 
 * @param obj
 * @author lily
 */
function tabCon(obj) {
	$("#myTab>li").attr("class","");
	
	$("#myTab #"+obj).parents("li").attr("class","active");
	
	var url = getUrlParam();
	var surl = 'detail/' + obj + '.html';
	switch (obj) {
		case 'i_flow':							//概览页下的流量分析页面
			$("#tabIframe").attr("src", surl);
			break;
		case 'i_conversion':					//概览页下的业务转化率分析页面
			$("#tabIframe").attr("src", surl);
			break;
		case 'home-zt':							//掌厅下的渠道概要页面
			$("#tabIframe").attr("src", surl);
			break;
		case 'business':						//掌厅&&微厅&&网厅&&本地商城下的    业务转化率分析页面
			$("#tabIframe").attr("src", surl);
			break;	
		case 'wap_terminal':					//掌厅下&&微厅&&本地商城下的              终端销售分析页面
			$("#tabIframe").attr("src", surl);
			break;
		case 'cardSales':						//掌厅下&&微厅&&本地商城下的              号卡销售分析页面
			$("#tabIframe").attr("src", surl);
			break;
		case 'clickRate':						//掌厅下的用户点击行为分析页面
			$("ul.hoverUl>li:first-child").addClass("act").siblings("li").removeClass("act");
			$("#tabIframe").attr("src", surl);
			break;
		case 'home':							//微厅下的渠道概要界面
			$("#tabIframe").attr("src", surl);
			break;
		case 'flow':							//微厅下流量分析页面
			$("#tabIframe").attr("src", surl);
			break;
		case 'touch':							//微厅&&网厅&&本地商城下的用户点击行为分析页面
			$("ul.hoverUl>li:first-child").addClass("act").siblings("li").removeClass("act");
			$("#tabIframe").attr("src", surl);
			break;
		case 'sharingBehavior':					//商城下的用户点击行为分析页面
			$("#tabIframe").attr("src", surl);
			break;
	}
}
/*******************************************************************************
 * 给tbody设置样式
 * 
 * @author lisir
 * 
 */
function setCssByTbody(tdLen) {
	
	if(tdLen !=  null && tdLen != undefined){
		$("#table_id").css("width",(250 * tdLen+"px"));
	}
	
	$(".tbody_css").find("tr:eq(0)").find("td").addClass("td_first");
	$(".tbody_css").find("tr:eq(1)").find("td").addClass("td_one");
	$(".tbody_css").find("tr:eq(2)").find("td").addClass("td_two");
	var url = window.location.href;
	var bname = url.split("/");
	var cname = bname.slice(bname.length - 1, bname.length);

	
	//console.log(cname == 'conversion.html');
	if (cname == 'conversion.html') {
		$(".td_first").each(function(i, item) {
			var text = $(this).text();
			if(text == ""){
				$(this).text("-");
			}else{
				$(this).text(text + "%");
			}
		});
		$(".td_one").each(function(i, item) {
			var text = $(this).text();
			if(text == ""){
				$(this).text("-");
			}else{
				$(this).text(text + "%");
			}
		});
		$(".td_two").each(function(i, item) {
			var text = $(this).text();
			
			if(text == ""){
				$(this).text("-");
			}else{
				if(text > 0){
					$(this).html(text + '%<span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>').css('color', '#00f559');
				}else if(text == 0){
					$(this).html(text).css('color', '#f1e10f');
				}else{
					var absText = Math.abs($(this).text());//取绝对值
					$(this).html(absText + '%<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>').css('color', '#ff907f');
				}
			}
			
		});

	} else {
		$(".td_two").each(function(i, item) {
			var text = $(this).text();
			
			if(text == ""){
				$(this).text("-");
			}else{
				if(text > 0){
					$(this).html(text + '%<span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>').css('color', '#00f559');
				}else if(text == 0){
					$(this).html(text).css('color', '#f1e10f');
				}else{
					var absText = Math.abs($(this).text());//取绝对值
					$(this).html(absText + '%<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>').css('color', '#ff907f');
				}
			}
		});
	}
}

/*******************************************************************************
 * 获取地址栏参数
 * 
 * @author lily
 * @returns
 */
function getUrlParam() {
	var aname = top.location.href;
	var bname = aname.split("/");
	var cname = bname.slice(bname.length - 1, bname.length);
	if (cname != null)
		return cname + "";
	return null; // 返回参数值
}

// 格式化时间
function FormatDate(strTime) {
	var d = new Date(strTime);
	var year = d.getFullYear();
	var day = d.getDate();
	var month = +d.getMonth() + 1;
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();
	var misec = d.getMilliseconds();
	var f = year + "-" + formate(month) + "-" + formate(day);
	return f;
}
function formate(d) {
	return d > 9 ? d : '0' + d;
}

/**
 * 根据开始，结束日期，获取连续日期数组
 * @param sdate
 * @param edate
 * @returns {Array}
 */
function continuousDate(sdate,edate){
	var startDate = new Date(sdate);
	var endDate = new Date(edate);
	var days = (endDate.getTime() - startDate.getTime()) / 86400000 + 1; //算出相差天数
	var dates = [];
	
	for(var i=0; i< days ; i++){
		dates[i] = FormatDate(new Date(startDate.getTime() + i * 86400000).getTime());
	}
	
	return dates;
}

/* 三个渠道下    全部流量来源&&总体营销流量来源&&单个识别码来源  切换公共方法
 *头部页签切换js 
 * */
$(function(){
	var urls = getUrlParam();
	if(urls != 'wap.html'){//如果不是掌厅下的模块执行的隐藏操作
		$("ul.select-ul li:eq(1),ul.select-ul li:eq(2)").show();
	}
	
	$("ul.select-ul").on("click", "li", function(){//三个选项的点击事件
		$("div.dis").hide();
		if($(this).index() == 2){//每次点击前做判断是否点击的是第三个“单个识别码来源”
			$("div.dis").show();
		}
		$(this).siblings("li").removeClass("active");
		$(this).addClass("active");
		
		return false;
	});
});

/*微网商渠道下用户点击行为分析下的条件筛选js操作     控制‘业务转化率分析的’*/
$(function(){
	$("ul.select-ul1").on("click", "li", function(){//三个选项的点击事件
		$("div.dier").hide();
		if($(this).index() == 2){//每次点击前做判断是否点击的是第三个“单个识别码来源”
			$("div.dier").show();
		}
		$(this).siblings("li").removeClass("active");
		$(this).addClass("active");
		return false;
	});
});

/*微网商渠道下用户点击行为分析下的条件筛选js操作     控制‘用户点击行为分析的’*/
$(function(){
	$("ul.select-ul2").on("click", "li", function(){//三个选项的点击事件
		
		if($(this).index() == 2 && $("div.bottom-dier").hasClass('dis')){//每次点击前做判断是否点击的是第三个“单个识别码来源”
			$("div.bottom-dier").removeClass('dis');
		}else{
			$("div.bottom-dier").addClass('dis');
		}
		$(this).addClass("active").siblings("li").removeClass("active");
		return false;
	});
});


/*微网商渠道下用户点击行为分析下的查询按钮js操作控制*/
/*$(function(){
	$(".search-text").on("click", function(){//三个选项的点击事件
		
		分两种情况，如果选择单个识别码来源  会显示 WT.nv WT.event 这两个文本框，而这两个文本框必填一个
		if($(".bottom-dier").css("display") == "block"){	//如果是显示的，加正则判断
			
			var textT1 = $(".textT1").val();
			var textT2 = $(".textT2").val();
			textT1 = textT1.replace(/^\s+|\s+$/g,"");//去除所有的空格和换行
			textT2 = textT2.replace(/^\s+|\s+$/g,"");//去除所有的空格和换行
			if(textT1 == "" && textT2 == ""){
				layer.msg("请至少填写一项参数值!", function() {});
			}
		}
		
		return false;
	});
});*/





/* 一级菜单下    用户点击行为分析的hover事件 出现三级菜单*/
window.onload = function(){
	
	var timer = null,
		contains = $("#myTab a:contains('用户点击行为分析')").parent('li');
	
		/*鼠标移入*/
		contains.on('mouseover',function(){
			if($(this).hasClass("active")){
				clearTimeout(timer);
				setTimeout(function(){
					$(".hoverUl").removeClass('dis-none');
				},200);
			}
		});
		$(".hoverUl").on('mouseover',function(){
			
			clearTimeout(timer);
			setTimeout(function(){
				$(".hoverUl").removeClass('dis-none');
			},200);
			
		});
		
		/*鼠标移出*/
		contains.on('mouseout',function(){
			timer = setTimeout(function(){
				$(".hoverUl").addClass('dis-none');
			},200);
		});
		$(".hoverUl").on('mouseout',function(){
			timer = setTimeout(function(){
				$(".hoverUl").addClass('dis-none');
			},200);
		});
	
	
	//三级点击事件
	$(".hoverUl").on('click', 'li', function(){
		
		var url = getUrlParam();
		
		if(url == 'wap.html'){
			if($(this).index() == 3 && $(this).text() == '点击量图表'){//针对掌厅的   点击量图表     单独定义框架的地址跳转
				$("#tabIframe").attr("src", "detail/clickNumber.html");
			}else{
				$("#tabIframe").attr("src", "detail/clickRate.html");
				if($(this).index() == 0){
					$(this).siblings("div").hide();
					var sdate = $("#sdate_id1").val(); 
					var edate = $("#edate_id1").val();
					var channel = '掌上营业厅';
					 
					getInit(sdate, edate, channel);  //获取热力图数据
				}
			}
		}else{
			if($(this).index() == 1 && $(this).text() == '点击量自助查询'){//针对微网商渠道下的操控     如果点击的是 “点击量自助查询”
				if(!$("#tabIframe").contents().find(".bottom-dier").hasClass("dis")){
					$("#tabIframe").contents().find(".bottom-dier").addClass("dis");
				}
				
				$("#tabIframe").contents().find(".select-ul2>li:first-child").addClass('active').siblings("li").removeClass('active');
				$("#tabIframe").contents().find(".container-hotMap").parent(".chart-content").addClass("dis");
				$("#tabIframe").contents().find(".select-ul2,.middle-dier,.hotMap").removeClass("dis");
			}else{
				$("#tabIframe").contents().find(".select-ul2,.middle-dier,.bottom-dier,.hotMap").addClass("dis");
				$("#tabIframe").contents().find(".container-hotMap").parent(".chart-content").removeClass("dis");
			}
		}
		
		$(this).addClass("act").siblings("li").removeClass("act");
	});
}

/**
 * 获取日期的集合
 * @param start
 * @param end
 * @returns
 */
function getDateArr(start,end){
	var startTime = getDates(start);
	var endTime = getDates(end);
	// console.log(endTime);
	var dateArr = new Array;
	while((endTime.getTime()-startTime.getTime())>=0){
	  var year = startTime.getFullYear();
	//  console.log(startTime.getMonth());
	  var month = parseInt(parseInt((startTime.getMonth().toString().length==1?"0"+startTime.getMonth().toString():startTime.getMonth())) +1)+"";
	  if(month.length==1){
		  month= "0"+month;
	  }
	  var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
	  var d = year+"-"+month+"-"+day;
	//  console.log(d);
	  dateArr.push(d);
	  startTime.setDate(startTime.getDate()+1);
	}
	return dateArr;
}
function getDates(datestr){
	if(datestr.indexOf("00:00:00")!=-1){
		datestr = datestr.replace(" 00:00:00","");
	}
	 var temp = datestr.split("-");
	// console.log(temp[0]+"___________"+temp[1]+"++++++++++"+temp[2]);
	 var pin;
	 var mon;
	 if(temp[1].substr(0,1)=="0"){
		 pin = temp[1].substr(1,2);
	 }else{
		 pin = temp[1];
	 }
	 var date = new Date(temp[0],parseInt(pin-1),temp[2]);
	 return date;
	}

/*翻译指标名称*/
function translation(name){
	switch(name) {
	case 'CB_4GZXTC':
		return name = "4G自选套餐";
		break;
	case 'CB_4GFXTC':
		return name = "4G飞享套餐";
		break;
	case 'CB_4GLLK':
		return name = "4G流量卡套餐";
		break;
	case 'H5流量加油包':
		return name = "流量加油包";
		break;
	case 'CB_4GLLYB':
		return name = "流量可选包";
		break;
	case 'H5流量安心包':
		return name = "流量安心包";
		break;
	case '流量快餐_H5':
		return name = "流量快餐";
		break;
	case '流量日套餐、小时套餐_H5':
		return name = "流量日套餐、小时套餐";
		break;
	case '宽带新装_H5':
		return name = "宽带新装";
		break;
	case '宽带续约_H5':
		return name = "宽带续约";
		break;
	case 'CB_4GZXTC':
		return name = "宽带业务在线续约";
		break;
	case 'CB_YHKJF':
		return name = "在线充值";
		break;
	case '宽带业务在线预约_H5':
		return name = "宽带业务在线预约";
		break;
	case '宽带新装_H5':
		return name = "宽带新装";
		break;
	case '4Gbk':
		return name = "4G备卡";
		break;
	default: return name;
		break;
	}
}



















/**
 * 切换显示隐藏公共方法
 * @param 
 * @param 
 * @returns
 */

function toggle(o1, o2, o3, o4, sum){//最后一个参数代表切换
	o1.on('click', function(){
		if(sum === 0){
			o1.addClass("dis-none").next(o2).removeClass("dis-none");
			o3.addClass("dis-none").next(o4).removeClass("dis-none");
		}else{
			o1.addClass("dis-none").prev(o2).removeClass("dis-none");
			o3.addClass("dis-none").prev(o4).removeClass("dis-none");
		}
	});
}
/**
 * 格式化小数
 * @param srcStr：被格式化的数字
 * @param nAfterDot:保留的小数位数
 * @returns 
 */
function FormatNumber(srcStr,nAfterDot){
 var srcStr,nAfterDot;
var resultStr,nTen;
	 srcStr = ""+srcStr+"";
	strLen = srcStr.length;
	dotPos = srcStr.indexOf(".",0);
	if (dotPos == -1){
	   resultStr = srcStr+".";
	for (i=0;i<nAfterDot;i++){
	   resultStr = resultStr+"0";
	}
	return resultStr;
	}
	 else{
	  if ((strLen - dotPos - 1) >= nAfterDot){
	   nAfter = dotPos + nAfterDot + 1;
	   nTen =1;
	for(j=0;j<nAfterDot;j++){
	   nTen = nTen*10;
	}
	   resultStr = Math.round(parseFloat(srcStr)*nTen)/nTen;
	  return resultStr;
	}
	else{
	   resultStr = srcStr;
	for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
	   resultStr = resultStr+"0";
	}
	   return resultStr;
	   }
	  }
	} 
//月份的起止日期
function getMonth(type, months,d) {
//    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (Math.abs(months) > 12) {
        months = months % 12;
    };
    if (months != 0) {
        if (month + months > 12) {
            year++;
            month = (month + months) % 12;
        } else if (month + months < 1) {
            year--;
            month = 12 + month + months;
        } else {
            month = month + months;
        };
    };
    month = month < 10 ? "0" + month: month;
    var date = d.getDate();
    var firstday = year + "-" + month + "-" + "01";
    var lastday = "";
    if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
        lastday = year + "-" + month + "-" + 31;
    } else if (month == "02") {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
            lastday = year + "-" + month + "-" + 29;
        } else {
            lastday = year + "-" + month + "-" + 28;
        };
    } else {
        lastday = year + "-" + month + "-" + 30;
    };
    var day = "";
    if (type == "s") {
        day = firstday;
    } else {
        day = lastday;
    };
    return day;
};