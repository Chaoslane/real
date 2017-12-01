//初始化
$(function (){
	// 按时间查询
	$("#attributeSearch").click(function() {
		getData();
	});
	startAndEndTime();
	getData();
});

// 设置初始日期
function startAndEndTime() {
//	$.post('../../attributeAnalysis/getDate.do', {
//	}, function (results, resultState) {
//		if (resultState == "success") {
//			var d = new Date(results.daytime);
//			var eM = (d.getMonth() + 1) < 10 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1); //月补零
//			var eD = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate(); //日补零
//			var edate = d.getFullYear() + '-' + eM + '-' + eD;
//			$('#pickDate').val(edate);
//		}
//	});
	var myDate = new Date();
	var d = new Date(new Date(myDate.getTime() - 86400000));
	var eM = (d.getMonth() + 1) < 10 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1); //月补零
	var eD = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate(); //日补零
	var edate = d.getFullYear() + '-' + eM + '-' + eD;
	$('#pickDate').val(edate);
}

// 页面数据
function getData() {
	var date = $("#pickDate").val();
	$.post('../../attributeAnalysis/getUserInformation.do', {
		'date' : date
	}, function(results, resultState) {
		if (resultState == "success") {
			if($('#currentCity').parent()){
				$('#currentCity').parent().hide();
			}
			if($('#provincial_star').parent()){
				$('#provincial_star').parent().hide();
			}
			if($('#currentCity').parent().parent().find('#data0')){
				$('#currentCity').parent().parent().find('#data0').remove();
			}
			if (results["010"].length > 0) {
				$('#currentCity').parent().show();
				$('#provincial_star').parent().show();
				var user_ascription_number = results["010"][0].value;
				imgNumber (user_ascription_number+'','#user_ascription');//累计用户数
				//地图
				echarts_map ('echarts_map', results["010"],results["max"]);
			} else {
				$('#currentCity').parent().parent().append("<span class='no_data' id='data0'>当前选择时间无数据</span>");
				$('#currentCity').parent().css({'display':'none'});
			}
			var dataName_xh = [];
			var dataNumber_xh = [];
			for (var i = results["011"].length - 1; i >= 0; i--) {
				dataName_xh.push(results["011"][i].subcode);
				dataNumber_xh.push(results["011"][i].value);
			}
			//用户设备型号
//			var dataName_xh = ['魅族','三星','vivo','锤子','诺基亚','小米','华为','oppo','iphone'];
//			var dataNumber_xh = [580000,980000,1400000,400000,580000,980000,1400000,400000,980000];
			if($('#equipment_model div')){
				$('#equipment_model div').hide();
			}
			if($('#equipment_model').parent().find('#data1')){
				$('#equipment_model').parent().find('#data1').remove();
			}
			if (results["011"].length > 0) {
				$('#equipment_model div').show();
				echartsTransverse('equipment_model',dataName_xh,dataNumber_xh);
			} else {
				$('#equipment_model').parent().append("<span class='no_data' id='data1'>当前选择时间无数据</span>");
				$('#equipment_model div').css({'display':'none'});
			}
			var dataName_rate = [];
			var dataNumber_rate = [];
			for (var i = results["012"].length - 1; i >= 0; i--) {
				dataName_rate.push(results["012"][i].subcode);
				dataNumber_rate.push(results["012"][i].value);
			}
			//用户设备分辨率
//			var dataName_rate = ['800×600','1024×600','1024×768','1280×720','1366×768','1440×900','1600×900','1680×1050','1920×1080'];
//			var dataNumber_rate = [580000,980000,1400000,400000,580000,980000,1400000,400000,980000];
//			echartsTransverse('equipment_rate',dataName_rate,dataNumber_rate);
			if($('#equipment_rate div')){
				$('#equipment_rate div').hide();
			}
			if($('#equipment_rate').parent().find('#data2')){
				$('#equipment_rate').parent().find('#data2').remove();
			}
			if (results["011"].length > 0) {
				$('#equipment_rate div').show();
				echartsTransverse('equipment_rate',dataName_rate,dataNumber_rate);
			} else {
				$('#equipment_rate').parent().append("<span class='no_data' id='data2'>当前选择时间无数据</span>");
				$('#equipment_rate div').css({'display':'none'});
			}
			//用户操作系统版本
//			var dataName = [{name:'v1.0',icon:'circle'},{name:'v2.0',icon:'circle'},{name:'v3.0',icon:'circle'},{name:'v4.0',icon:'circle'},{name:'v5.0',icon:'circle'}];
//			var dataNumber = [{value:10,name:'v1.0'},{value:20,name:'v2.0'},{value:30,name:'v3.0'},{value:30,name:'v4.0'},{value:92,name :'v5.0'}];
			var dataName = [];
			var dataNumber = [];
			var value = 0;
			for (var i = 0; i < results["013"].length; i++) {
				if (i > 4 && i < results["013"].length - 1) {
					value += results["013"][i].value;
				} else if (i == results["013"].length - 1) {
					value += results["013"][i].value;
					dataName.push({name:'其它', icon:'circle'});
					dataNumber.push({value:value, name:'其它'});
					$("#iName6").text("其它");
				} else {
					dataName.push({name:results["013"][i].subcode, icon:'circle'});
					dataNumber.push({value:results["013"][i].value, name:results["013"][i].subcode});
					$("#iName" + (i + 1)).text(results["013"][i].subcode);
				}
			}
			//初始化环形图表右侧数值
			var currentPercent =0;
			for(var i = 0 ; i < dataNumber.length; i++){
				currentPercent +=  dataNumber[i].value;
			}
			
			if($('#user_name div')){
				$('#user_name div').hide();
			}
			if($('#user_name').parent().find('#data3')){
				$('#user_name').parent().find('#data3').remove();
			}
			if (dataNumber.length > 0) {
				$('#user_name div').show();
				$('#user_operation').show();
				$('#userVolume').show();
				$('#userShare').show();
				$('#userAllId').show();
				$('#user_name .user_name').html(dataNumber[0].name);
	    		$('#user_volume').html(formatTmpl(dataNumber[0].value));
	    		$('#user_share').html((dataNumber[0].value/currentPercent*100).toFixed(2) + '%');
				pieChart('user_operation',dataName,dataNumber,false);
			} else {
				$('#userVolume').hide();
				$('#user_operation').hide();
				$('#userShare').hide();
				$('#userAllId').hide();
				$('#user_name').parent().append("<span class='no_data' id='data3'>当前选择时间无数据</span>");
				$('#user_name div').css({'display':'none'});
			}
		}
	});
	//动态设置高度
	var height = $(window).outerHeight();
	$('#content').height(height - $('#header').outerHeight() - $('#currentLocation').outerHeight() - 30);
	$('.attribute_content').height($('#content').height());
	$('#content').height()
	/*左边自适应的高度为地图的高度开始*/
	$('#common_number_bg_top').height($('.attribute_content').height() - 284);//272为下面那块的高度+第一块标题
	$('#common_number_bg_top').css({'margin-bottom':'12px'});
	$('#echarts_map').height($('#common_number_bg_top').height() - 90);//78用户数的高度30为margin的高度
	/*左边自适应的高度为地图的高度结束*/
	/*右边自适应的高度为地图的高度开始*/
	$('#big_width').height($('.attribute_content').height());
	$('.user_equipment').height(($('#big_width').height() - 12)/2);
	$('.user_equipment.margin_bottom').css({'margin-bottom':'14px'});
	$('.attribute_content .user_equipment .common_number_bg').height($('.user_equipment').height()-34);
	$('#equipment_model').height($('.attribute_content .user_equipment .common_number_bg').height());
	$('#equipment_model div').height($('.attribute_content .user_equipment .common_number_bg').height());
	$('#equipment_model canvas').height($('.attribute_content .user_equipment .common_number_bg').height()-30);
	$('#equipment_rate').height($('.attribute_content .user_equipment .common_number_bg').height());
	$('#equipment_rate div').height($('.attribute_content .user_equipment .common_number_bg').height());
	$('#equipment_rate canvas').height($('.attribute_content .user_equipment .common_number_bg').height()-30);
	/*右边自适应的高度为地图的高度结束*/
	if($(window).width()>1650){
		$('#provincial_star').css({'top':'35%','left':'50%'});
	}else if($(window).width()>1390){
		$('#provincial_star').css({'top':'33%','left':'45%'});
	}else{
		$('#provincial_star').css({'top':'32%','left':'50%'});
	}
	//省会星星位置调整
	$(window).resize(function() {
		if($(window).width()>1650){			
			$('#provincial_star').css({'top':'37%','left':'50%'});
		}else if($(window).width()>1390){
			$('#provincial_star').css({'top':'33%','left':'45%'});
		}else{
			$('#provincial_star').css({'top':'30%','left':'50%'});
		}
	});
}

function echarts_map (thisId, data,maxData){
	var partNumber = parseInt(maxData/6);
    $.get('../real/map/json/henan.json', function (chinaJson) {
        echarts.registerMap('henan', chinaJson);
        var chart = echarts.init(document.getElementById(thisId));
        chart.setOption({
        	visualMap: {
           	 textStyle:{  
                    // 颜色  
                    color: '#fff',  
                    // 水平对齐方式，可选为：'left' | 'right' | 'center'  
                    align: 'left',  
                    // 垂直对齐方式，可选为：'top' | 'bottom' | 'middle'  
                    baseline: 'bottom',  
                    // 字体系列  
                    fontFamily: 'Arial, 宋体, sans-serif',  
                    // 字号 ，单位px  
                    fontSize: 20,  
                    // 样式，可选为：'normal' | 'italic' | 'oblique'  
                    fontStyle: 'italic',  
                    // 粗细，可选为：'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 |... | 900  
                    fontWeight: 'normal'  
                }, 
               show:false,//不显示也有颜色区分的效果
               min: 0,
               max: 1000,
               left: 'left',
               top: 'bottom',
               text: ['高','低'], // 文本，默认为数值文本
               calculable: false,//是否显示可拖动的句柄
               inRange: {
               	//['#19FFFF','#01637E','#03B8BF','#039DA5','#06C6CB','#04C8C9']
               	//#0082d2  #00d2aa  #00415a  #00aae1  #00d7e1
            	   color:["#00423c", "#008788", "#1e5ae1", "#4f85ff", "#97b5f7", "#a4d6d4"]
               	//color:['rgba(15,220,150,.5)','#03B8BF','#039DA5','#06C6CB','#04C8C9']
               }
           },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                backgroundColor: '#c6e8e9',//浮框背景色
                transitionDuration: 0.2,
                /*formatter: function (params) {//设置提示框内的文字
                    var p = '<h3 style="color:#29667b;text-align:center;font-size:14px;font-weight:bold;line-height:20px;">['+params.name+']</h3>'+
                        '<p style="color:#26677b;font-size:12px;">今日累计用户数：'+params.data.uv+'</p>'+
                        '<p style="color:#26677b;font-size:12px;">当前活跃用户数：'+params.data.iuv+'</p>'
                    return p;
                }*/
            }, 
            dataRange:{
                  x:'left',
                  y:'bottom',
                  textStyle: {
						//fontWeight:'bold',
					  color: "#fff",
					  fontSize:'8'
                  },
                  itemWidth:'6',
                  itemHeight:'6',
                  hoverLink:false,//去除鼠标移入
                  splitList:[
                     {end:parseInt(maxData/6)},
                     {start:parseInt(maxData/6),end:parseInt(maxData/6)*2},
                     {start:parseInt(maxData/6)*2,end:parseInt(maxData/6)*3},
                     {start:parseInt(maxData/6)*3,end:parseInt(maxData/6)*4},
                     {start:parseInt(maxData/6)*4,end:parseInt(maxData/6)*5},
                     {start:parseInt(maxData/6)*5,end:maxData},
                     
                  ],
                  color:["#00423c", "#008788", "#1e5ae1", "#4f85ff", "#97b5f7", "#a4d6d4"]
            },
            series: [{
            	name:'用户量',
                type: 'map',
                map: 'henan',
                roam: false,//标识是否可以缩放和拖动
                aspectScale:1.1,//设置地图的长宽比 数值越大 高度越小 数值越小 宽度越小
                zoom:1.25,//定义当前视角的缩放比
                label: {
                    normal: {
                        show: false,//标示是否显示提示文字
                    },
                    emphasis: {
                        show: false,
                        color:''
                    }
                },
                itemStyle:{
                	normal:{
                		areaColor:'rgba(15,220,150,.5)'
                	}
                },
                data:data,
            }]
        });
        chart.on('mouseover', function (e) {
            e.event.target.style.fill = '#12006a';
            $('#currentCity').html(e.name + '用户量：');
            if(e.value){
            	imgNumber (e.value + '','#user_ascription');//累计用户数
            }else{
            	imgNumber ('0','#user_ascription');//累计用户数
            }
            
        });
    });
};

/**
 * 横向柱状图
 * @param {Object} thisId
 */
function echartsTransverse(thisId,dataName,dataNumber){
	/*for(var i =0;i<dataName.length;i++){
		dataName[i] = '<p style="background:green;">'+dataName[i]+'</p>'
	}*/
	//初始化echarts
	var myChart = echarts.init(document.getElementById(thisId));
	
	option = {
		    title : {
		        text: '',
		        subtext: ''
		    },
		    tooltip : {
		        trigger: 'axis',
		        formatter: function(params){
					return params[0].name + ':' + formatTmpl(params[0].value);
				}
		        /*formatter : "{b}:{c}",*/
		    },
		    grid : {//间距距离左右下
				top: '3%',
				bottom: '3%',
				left : '1%',
				right : '10%',
				containLabel : true
			},
		    legend: {
		        data:['2011年', '2012年']
		    },
		    calculable : true,
		    xAxis : [
		        {
		        	type : 'value',
		            boundaryGap : [0, 0.01],
		            splitLine : {//去掉网格线
						show : false
					},
					axisLine : {//坐标轴轴线相关设置。
					    show : false,
						lineStyle : {
							color : '#FFF'
						}
					},
					axisTick : {//坐标轴刻度相关设置
						lineStyle : {
							color : '#FFF'
						}
					},
		        }
		    ],
		    yAxis : [
		        {
		            type : 'category',
		            data : dataName,
		            splitLine : {//去掉网格线
						show : false
					},
					axisLine : {//坐标轴轴线相关设置。
						show : false,
						lineStyle : {
							color : '#FFF'
						}
					},
					axisTick : {//坐标轴刻度相关设置
						show : false,
						lineStyle : {
							color : '#FFF'
						}
					},
		        }
		    ],
		    series : [
		        {
		            type:'bar',
		            data:dataNumber,
		            label : {
						normal : {
							show : true,//显示数字
							position : 'right',
							formatter:function (dataNmu){
								return toThousands(dataNmu.data)
							}
						},
					},
		            itemStyle : {
						normal : {
							color:'#0fdc97',//柱状的颜色
							label : {
		          				textStyle : {
		          					fontSize : '15',//柱状上的显示的文字
		          					color:'#0fdc97',
		          				}
		          			}
						}
					},
		        }
		    ]
		};
	
	// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

/*sockitIo ();
function sockitIo ()
{
	var socket = io.connect('http://192.168.4.3:7090/realhook');
        socket.emit('getstatus');
        setInterval(function(){socket.emit('getstatus')},1000);
        
        socket.on('status', function (data){
        	//热力地图
           	var dataAreas	=	[];
           	function dataAreasFun (thisName,thisValue,thisUv,thisIuv){
           		this.name	=	thisName;
           		this.value	=	thisValue;
           		this.uv		=	thisUv;
           		this.iuv	=	thisIuv;
           	}
           	for(var i = 0; i<data.areas.length; i++){
           		var val	=	data.areas[i];
           		//console.log(val.name+'---'+val.iuv)
           		dataAreas.push(new dataAreasFun(val.name,val.uv,val.uv,val.iuv))
           	}
    		
    		//用户归属-郑州用户量
    		//var user_ascription_number = data.areas[0].uv;//暂时先不用实时数据的了
    		//imgNumber (user_ascription_number+'','#user_ascription');//累计用户数
        })
       	
}*/

