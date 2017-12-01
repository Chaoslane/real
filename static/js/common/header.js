/**
 * by_cjt
 * 头部导航
*/
var header = '<ul class="clearfix">' +
				'<li class="fl">' +
					'<img src="../../img/logo.png"/>' +
				'</li>' +
				'<li class="fl title">' +
					'<h1>河南移动电子渠道可视化监控平台</h1>' +
				'</li>' +
				/*'<li class="fr user">' +
					'<span class="glyphicon glyphicon-user"></span>' +
					'<span id="adminName">admin</span>' +
				'</li>' +*/
				'<li class="menuNav fr">' +
					'<ul class="menu clearfix">' +
						'<li class="border">' +
							'<a href="/carnot/page/real/index.html" class="active">总体概览</a>' +
						'</li>' +
						'<li class="border">' +
							'<a href="javascript:void(0);" class="findA">用户规模</a>' +
							'<ul class="erji">' +
								'<li>' +
									'<a href="/carnot/page/userScale/activeUsers.html">累积、活跃用户情况</a>' +
								'</li>' +
								'<li>' +
									'<a href="/carnot/page/userScale/UseRetention.html">用户留存情况</a>' +
								'</li>' +
								'<li>' +
									'<a href="/carnot/page/userScale/attributeAnalysis.html">用户属性分析</a>' +
								'</li>' +
							'</ul>' +
						'</li>' +
						'<li class="border">' +
							'<a href="javascript:void(0);" class="findA">用户行为分析</a>' +
							'<ul class="erji">' +
								'<li>' +
									'<a href="/carnot/page/userBehavio/clickFigure.html">按钮点击热力图</a>' +
								'</li>' +
								'<li>' +
									'<a href="/carnot/page/userBehavio/clickAnalysis.html">按钮点击分析</a>' +
								'</li>' +
								/*'<li>' +
									'<a href="#">总体路径图</a>' +
								'</li>' +
								'<li>' +
									'<a href="#">重点业务路径图</a>' +
								'</li>' +*/
							'</ul>' +
						'</li>' +
						'<li class="border">' +
							'<a href="javascript:void(0);" class="findA">业务办理分析</a>' +
							'<ul class="erji">' +
								'<li>' +
									'<a href="/carnot/page/busiProcess/realTime.html">实时办理情况</a>' +
								'</li>' +
								'<li>' +
									'<a href="/carnot/page/busiProcess/overall.html">总体办理情况</a>' +
								'</li>' +
								'<li>' +
									'<a href="/carnot/page/busiProcess/busiDetails.html">业务明细分析</a>' +
								'</li>' +
							'</ul>' +
						'</li>' +
						/*'<li>' +
							'<a href="javascript:void(0);">重点营销分析</a>' +
						'</li>' +*/
					'</ul>' +
				'</li>' +
				'<li class="fr time">' +
					'<span class="glyphicon glyphicon-time"></span>' +
					'<span id="currentTime"></span>' +
				'</li>' +
			'</ul>';
document.getElementById('header').innerHTML = header;


/*获取当前时间戳*/
//js 获取当前时间
//定时器每秒调用一次fnDate()
fnDate();
window.onload=function(){
	//定时器每秒调用一次fnDate()
	setInterval(function(){
		fnDate();
	},1000);
}
function fnDate(){
	var oCurren=document.getElementById("currentTime");
	var date=new Date();
	var year=date.getFullYear();//当前年份
	var month=date.getMonth();//当前月份
	var data=date.getDate();//天
	var hours=date.getHours();//小时
	var minute=date.getMinutes();//分
	var second=date.getSeconds();//秒
	var time=year+"-"+fnW((month+1))+"-"+fnW(data)+" "+fnW(hours)+":"+fnW(minute)+":"+fnW(second);
	oCurren.innerHTML=time;
}
//补0
function fnW(str){
	var num;
	str>=10?num=str:num="0"+str;
	return num;
}

/**
 * 当前位置
 */
$(function(){
	var Url = getUrl();
	var currentLocation;
	if(Url == '重点营销分析.html'){
		currentLocation = '<span class="glyphicon glyphicon-map-marker"></span><span id="clOutside"></span>';
	}else if( Url == 'clickFigure.html'){//这里的时间修改为开始时间+结束时间
		currentLocation = '<span class="glyphicon glyphicon-map-marker"></span><span id="clOutside"></span>&nbsp;/&nbsp;<input type="button" value="查询" class="btn btn-warning fr button_small" id="activeSearch"><span id="clInside"></span><span class="fr"><input placeholder="选择结束时间:" class="day-time" id="pickEndDate" type="text" onfocus="WdatePicker({skin:\'twoer\'});"><span class="glyphicon glyphicon-calendar"></span></span><span class="fr" style="margin-right:10px;"><input placeholder="选择开始时间:" class="day-time" id="pickStartDate" type="text" onfocus="WdatePicker({skin:\'twoer\'});"><span class="glyphicon glyphicon-calendar"></span></span>';
	}else if(Url == 'clickAnalysis.html' ||Url == 'activeUsers.html' || Url == 'busiDetails.html'|| Url=='overall.html' || Url=='clickFigure.html'||Url =='UseRetention.html'){//这里的时间修
		currentLocation = '<span class="glyphicon glyphicon-map-marker"></span><span id="clOutside"></span>&nbsp;/&nbsp;<input type="button" value="查询" class="btn btn-warning fr button_small" id="activeSearch"><span id="clInside"></span><span class="fr"><input placeholder="选择查询时间:" class="day-time" id="pickEndDate" type="text" onfocus="WdatePicker({skin:\'twoer\'});"><span class="glyphicon glyphicon-calendar"></span></span><span class="fr" style="margin-right:10px;"></span>';
	}else if(Url == 'attributeAnalysis.html'){
		currentLocation = '<span class="glyphicon glyphicon-map-marker"></span><span id="clOutside"></span>&nbsp;/&nbsp;<input type="button" value="查询" class="btn btn-warning fr button_small" id="attributeSearch"><span id="clInside"></span><span class="fr"><input placeholder="选择时间:" class="day-time" id="pickDate" type="text" onfocus="WdatePicker({skin:\'twoer\'});"><span class="glyphicon glyphicon-calendar"></span></span>';
	}
	else{
		currentLocation = '<span class="glyphicon glyphicon-map-marker"></span><span id="clOutside"></span>&nbsp;/&nbsp;<span id="clInside"></span><span class="fr"><input placeholder="选择时间:" class="day-time" id="pickDate" type="text" onfocus="WdatePicker({skin:\'twoer\'});"><span class="glyphicon glyphicon-calendar"></span></span>';
	}
	$('#currentLocation').html(currentLocation);
	switch (Url) {
	
	/*总体概览*/
	case 'index.html':
		$(".menu>li:eq(0)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		break;
		
	/*用户规模*/
	/*累积活跃用户情况*/
	case 'activeUsers.html':
		$(".menu>li:eq(1)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(1) a.findA").text());
		$("#clInside").text('累积、活跃用户情况');
		break;
	/*用户留存情况*/
	case 'UseRetention.html':
		$(".menu>li:eq(1)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(1) a.findA").text());
		$("#clInside").text('用户留存情况');
		break;
	/*用户属性分析*/
	case 'attributeAnalysis.html':
		$(".menu>li:eq(1)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(1) a.findA").text());
		$("#clInside").text('用户属性分析');
		break;
	
	/*用户行为分析*/
	/*按钮点击热力图*/
	case 'clickFigure.html':
		$(".menu>li:eq(2)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(2) a.findA").text());
		$("#clInside").text('按钮点击热力图');
		break;
	/*按钮点击分析*/
	case 'clickAnalysis.html':
		$(".menu>li:eq(2)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(2) a.findA").text());
		$("#clInside").text('按钮点击分析');
		break;
	/*总体路径图*/
	case '总体路径图.html':
		//$("#nav li:eq(0)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(2) a.findA").text());
		$("#clInside").text('总体路径图');
		break;
	/*重点业务路径图*/
	case '重点业务路径图.html':
		//$("#nav li:eq(0)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(2) a.findA").text());
		$("#clInside").text('重点业务路径图');
		break;
	
	/*业务办理分析*/
	/*实时办理情况*/
	case 'realTime.html':
		$(".menu>li:eq(3)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(3) a.findA").text());
		$("#clInside").text('实时办理情况');
		$('#pickDate').hide();
		$('#pickDate').next().hide();
		
		
		
		break;
	/*总体办理情况*/
	case 'overall.html':
		$(".menu>li:eq(3)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(3) a.findA").text());
		$("#clInside").text('总体办理情况');
		break;
	/*总体办理情况*/
	case 'overall_Children.html':
		$(".menu>li:eq(3)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(3) a.findA").text());
		$("#clInside").text('总体办理情况');
		break;
	/*业务明细分析*/
	case 'busiDetails.html':
		$(".menu>li:eq(3)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text($(".menu>li:eq(3) a.findA").text());
		$("#clInside").text('业务明细分析');
		break;
	
	/*重点营销分析*/
	case '重点营销分析.html':
		$("#nav li:eq(0)>a").addClass("active").parent("li").siblings("li").find('a').removeClass("active");
		$("#clOutside").text('重点营销分析');
		break;
	}
});


/**
 * 获取地址栏参数的方法
 * zxy
 */
function getUrl(){
	var Href = this.location.href;
	//url尾部接参数的情况
    if(Href.indexOf("?")!=-1){
    	var Hrefs = Href.indexOf("?");
    	 Href = Href.substring(0, Hrefs);
    }
	var Hrefs = Href.split("/");
	var sHrefs = Hrefs.slice(Hrefs.length - 1, Hrefs.length);
	 console.log(sHrefs);
	return sHrefs + '';
}