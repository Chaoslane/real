/**
 * 根据数字位数自动挪位置
 */
function position(div,value,leftArea){
	//console.log(value +"     "+value.toString().length +"   "+leftArea)
	var css = $(div).css('left',$(div).css('left',(leftArea)+'px'));
	
	value.toString().length == 4 ? $(div).css('left',$(div).css('left',(leftArea+5)+'px')) : css;
	value.toString().length == 3 ? $(div).css('left',$(div).css('left',(leftArea+13)+'px')) : css;
	value.toString().length == 2 ? $(div).css('left',$(div).css('left',(leftArea+13+7)+'px')) : css;
}


/**
 * 千分位格式化
 * @param num
 * @returns
 */
function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

$(function(){
	var date = new Date();
	$("#pickStartDate").val(cal_date_s(date,7));
	$("#pickEndDate").val(cal_date_e(date,1));
	
	$('#activeSearch').click(function (){
		//alert($('#pagSelect option:selected').text());
		//alert($('#pickEndDate').val())
		queryClick($('#pagSelect option:selected').text(), $('#pickStartDate').val(),$('#pickEndDate').val());
	})
	
	queryClick('首页', $('#pickStartDate').val(),$('#pickEndDate').val());
});


/**
 * 点击热力图数据查询
 * @param type 类型
 * @param date 日期
 */
function queryClick(type,sdate,edate){
	$.post('../../clickFigure/query.do',{'type':type,'sdate':sdate,'edate':edate},function(res){
		if(res.data == null || res.data == "null" || res.data == ''){
			$('#data-num').html('');
			$('#main div').remove();
			console.log('暂无数据!')
			return false;
		}
		datas = res.data;
		console.log(datas)
		switch (type) {
		case "首页":
			for(var i=1;i<=36;i++){
				$('#data-num').append('<div id="data_num_'+i+'" class="_one"></div>')								
			}
			$("#data-num :not(._one)").hide(); //不等于当前元素的移除
			$("#data-num ._one").show();
			break;
//		case "发现":
			$("#data-num :not(._two)").hide(); //不等于当前元素的移除
			$("#data-num ._two").show();
//			break;
		case "优惠":
			for(var i=1;i<=6;i++){
				$('#data-num').append('<div id="yh_data_num_'+i+'" class="_three"></div>')								
			}
			$("#data-num ._three").css('font-size','14px');
			$("#data-num :not(._three)").hide(); //不等于当前元素的移除
			$("#data-num ._three").show();
			break;
		case "服务":
			for(var i=1;i<=10;i++){
				$('#data-num').append('<div id="fw_data_num_'+i+'" class="_four"></div>')								
			}
			$("#data-num :not(._four)").hide(); //不等于当前元素的移除
			$("#data-num ._four").show();
			break;
		case "我的":
			for(var i=1;i<=17;i++){
				$('#data-num').append('<div id="wd_data_num_'+i+'" class="_five"></div>')								
			}
			$("#data-num :not(._five)").hide(); //不等于当前元素的移除
			$("#data-num ._five").show();
			break;
		}
		var heatData = [];
		for(var i in datas){
			var arr = (datas[i].x_axis+","+datas[i].y_axis+","+datas[i].hits).split(','); //拼接一个数组
			heatData.push(arr);
			$('#'+datas[i].nick_name).text(toThousands(datas[i].value));
			$('#'+datas[i].nick_name).attr('name',datas[i].clk_position).css({'top':(datas[i].y_axis - 10)+'px','left':(datas[i].x_axis - 30)+'px'});
			position($('#'+datas[i].nick_name),datas[i].value,datas[i].x_axis-30);
			/*console.log($('#'+datas[i].nick_name)[0]);
			console.log(datas[i]);*/
		}
		//console.log(heatData)
		hotMap("main",heatData);
	});
	
}

/**
 * 获取热力图数据
 */
function hotMap(thisId,heatData) {
//	var heatData = new Array();
//	
//	heatData[0] = [120, 320, 0.805];
//	heatData[1] = [180, 380, 0.51];
//	heatData[2] = [240, 440, 0.82];
//	heatData[3] = [300, 380, 0.85];
//	heatData[4] = [360, 320, 0.75];
	
//	$("#data-num0").text(10000);
//	$("#data-num1").text(2000);
//	$("#data-num2").text(3000);
//	$("#data-num3").text(4000);
//	$("#data-num4").text(5000);
	
	// 使用
	require(['echarts', 'echarts/chart/heatmap' // 使用柱状图就加载bar模块，按需加载
	], function(ec) {
		var myChart = ec.init(document.getElementById(thisId));
		var option = {
			backgroundColor: 'rgba(0, 0, 0, .05)',
			visualMap: [{
				type: 'piecewise', //类型为分段型
				splitNumber: 5, //对于连续型数据，自动平均切分成几段。默认为5段。 连续数据的范围需要 max 和 min 来指定
				min: 0, //指定 visualMapPiecewise 组件的最小值
				max: 300, //指定 visualMapPiecewise 组件的最大值
				inRange: { //定义 在选中范围中 的视觉元素
					color: ['#d94e5d', '#eac736', '#50a3ba'] //图元的颜色
						.reverse() //反转数组
				},
				textStyle: {
					color: '#fff' //visualMap 文字的颜色
				}
			}],
			series: [{
				type: 'heatmap', //定义类型
				data: heatData, //系列中的数据内容数组。数组项通常为具体的数据项
				gradientColors: [ //热力图点的配置项
					{
						offset: 0.4,
						color: 'green'
					},
					{
						offset: 0.5,
						color: 'yellow'
					},
					{
						offset: 0.8,
						color: 'orange'
					},
					{
						offset: 1,
						color: 'red'
					}
				],
				minAlpha: 0.2,
				valueScale: 2,
				opacity: 0.7 //透明度
			}]
		};
		// 为echarts对象加载数据 
		myChart.setOption(option);
	});
}


/*切换热力图的select  change事件*/
$(function(){
	$("#pagSelect").on("change",function(){
		var selectVal = $("#pagSelect").val();
		console.log(selectVal);
		if(selectVal == 'sy'){
			console.log('首页');
			queryClick('首页', $('#pickStartDate').val(),$('#pickEndDate').val());
			$("#graphic").css("background","url('../../img/sy.jpg') no-repeat top center");
			/*hotMap("main");
			$("#graphic>div").css("height","2767px");*/
		}else if(selectVal == 'fx'){
			console.log('发现');
			queryClick('发现', $('#pickStartDate').val(),$('#pickEndDate').val());
			$("#graphic").css("background","url('../../img/fx.jpg') no-repeat top center");
		}else if(selectVal == 'yh'){
			console.log('优惠');
			queryClick('优惠', $('#pickStartDate').val(),$('#pickEndDate').val());
			$("#graphic").css("background","url('../../img/yh.jpg') no-repeat top center");
		}else if(selectVal == 'fw'){
			console.log('服务');
			queryClick('服务', $('#pickStartDate').val(),$('#pickEndDate').val());
			$("#graphic").css("background","url('../../img/fw.jpg') no-repeat top center");
		}else{
			console.log('我的');
			queryClick('我的', $('#pickStartDate').val(),$('#pickEndDate').val());
			$("#graphic").css("background","url('../../img/wd.jpg') no-repeat top center");
		}
	});
});




