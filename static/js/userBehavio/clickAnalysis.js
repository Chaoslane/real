
$(document).ready(function(){
	var date = new Date();
	//$("#pickStartDate").val(cal_date_s(date,7));
	$("#pickEndDate").val(cal_date_e(date,1));
	listPageName();
	listPageAreaBar();
	//listClickBar();
	$("#page_select").change(function(){
		listPageAreaBar();
		//listClickBar();
	});
	$("#area_select").change(function(){
		listClickBar($("#area_select").children('option:selected').val());
	});
	$('#activeSearch').click(function (){
		listPageName();
		listPageAreaBar();
		//listClickBar();
	});
});





function listPageAreaBar(){
	$.ajax({
		type:'post',
		url:'../../click/listPageAreaBar.do',
		data:{
			sdate: $("#pickEndDate").val(),
			edate: $("#pickEndDate").val(),
			page: $("#page_select").children('option:selected').val(),
		},
		success:function(result){
			var datas=[]; var are=[];var daytime=[];
			if(result!=''&& result!=null){
				$("#area_select").empty();
				$.each(result,function(i,item){
					datas.push(item.val);
					are.push(item.page_area);
					$("#area_select").append("<option value='"+item.page_area+"'>"+item.page_area+"</option>");
				});
				
				$('#area_select option:last').attr('selected','selected');
				var area=$("#area_select").children('option:selected').val();
				listClickBar(area);
				echarts_bar("clickConTL",are,datas);
				listPageAreaLine(are[are.length-1]);
			}else{
				echarts_bar("clickConTL",are,datas);
				echarts_line("clickConTR",daytime,datas);
			}
		}
	})
}

function listPageAreaLine(area){
	$.ajax({
		type:'post',
		url:'../../click/listPageAreaLine.do',
		data:{
			sdate: $("#pickEndDate").val(),
			edate: $("#pickEndDate").val(),
			page: $("#page_select").children('option:selected').val(),
			area:area
		},
		success:function(result){
			var datas=[]; var daytime=[];
			if(result!=''&& result!=null){				
				$.each(result,function(i,item){
					datas.push(item.val);
					daytime.push(item.daytime);
				});
				echarts_line("clickConTR",daytime,datas,area);
			}else{
				echarts_line("clickConTR",daytime,datas,area);
			}
		}
	})
}

function listClickBar(area){
	$.ajax({
		type:'post',
		url:'../../click/listClickBar.do',
		data:{
			sdate: $("#pickEndDate").val(),
			edate: $("#pickEndDate").val(),
			area: area,
			page: $("#page_select").children('option:selected').val(),
		},
		success:function(result){
			var datas=[]; var click=[];var daytime=[];
			if(result!=''&& result!=null){				
				$.each(result,function(i,item){
					datas.push(item.val);
					click.push(item.click_event);
				});
				if(result.length >10 ){
					var dataZoom_end = 100-(9/result.length)*100;
				}else{
					var dataZoom_end = 0;
				}
				echarts_bar("buttonConTL",click,datas);
				buttonClickLine(click[click.length-1],area);
			}else{
				echarts_bar("buttonConTL",click,datas);
				echarts_line("buttonConTR",daytime,datas);
			}
		}
	})
}

function buttonClickLine(click,area){
	$.ajax({
		type:'post',
		url:'../../click/listClickLine.do',
		data:{
			sdate: $("#pickEndDate").val(),
			edate: $("#pickEndDate").val(),
			area: area,
			page: $("#page_select").children('option:selected').val(),
			click:click,
		},
		success:function(result){
			var datas=[]; var daytime=[];
			if(result!=''&& result!=null){				
				$.each(result,function(i,item){
					datas.push(item.val);
					daytime.push(item.daytime);
				});
				echarts_line("buttonConTR",daytime,datas,click);
			}else{
				echarts_line("buttonConTR",daytime,datas,click);
			}
		}
	})
}
function listPageName(){
	$("#page_select").empty();
	$.ajax({
		type:'get',
		async : false,// 是否为异步
		url:'../../click/listPageName.do',
		data:{
			sdate: $("#pickEndDate").val(),
			edate: $("#pickEndDate").val(),
		},
		success:function(result){
			var datas=[]; var are=[];
			if(result!=''&& result!=null){				
				$.each(result,function(i,item){
					$("#page_select").append("<option value='"+item.page_name+"'>"+item.page_name+"</option>");
				});
			}else{
			}
		}
	})
}


/**
 * 横向柱状图
 * @param {Object} thisId
 */
function echarts_bar(thisId,yname,datas){
	if($('#'+thisId+' div')){
		$('#'+thisId+' div').hide();
	}
	if($('#'+thisId+' .no_data')){
		$('#'+thisId+' .no_data').remove();
	}
	if(datas.length >0){
		$('#'+thisId+' div').show();
		$('#'+thisId +' div').eq(1).hide();
		//初始化echarts
		var myCharts = echarts.init(document.getElementById(thisId));
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
			    },
			    dataZoom: [
			               {
			            	   width:'15',
			            	   start:100-900/yname.length,
			            	   end:100,
			                   type: 'slider',
			                   yAxisIndex: 0,
			                   //filterMode: 'empty',
			                   textStyle:{
			                	   color:'#fff',
			                	   fontSize:'16'
			                   }
			               },
			               {
				                type: 'inside',
				                show: true,
				                yAxisIndex: 0,
				                start:100-900/yname.length,
				                end: 100,
				            },
			           ],
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
			            data : yname,
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
						}
			        }
			    ],
			    series : [
			        {
			            type:'bar',
			            data:datas,
			            label : {
							normal : {
								show : true,//显示数字
								position : 'right',
								formatter: function(params){
									return formatTmpl(params.value);
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
	    myCharts.setOption(option);
		myCharts.on('click',function(params){
	    	if(thisId=='buttonConTL'){
	    		buttonClickLine(params.name);
	    	}else if(thisId=='clickConTL'){
	    		listPageAreaLine(params.name);
	    	}
		});
	}else{
		$('#'+thisId).append("<span class='no_data'>当前选择时间段无数据</span>");
	}
}
/**
 * 折线图
 */
function echarts_line (thisId,dataArrX,dataArrS,indexname){
	
	if($('#'+thisId+' div')){
		$('#'+thisId+' div').hide();
	}
	if($('#'+thisId+' .no_data')){
		$('#'+thisId+' .no_data').remove();
	}
	if(dataArrS.length >0){
		$('#'+thisId+' div').show();
		$('#'+thisId +' div').eq(1).hide();
		var myChart = echarts.init(document.getElementById(thisId));
		option = {
			backgroundColor: 'rgba(0,0,0,0)',
		    tooltip : {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross',
		            label: {
		                backgroundColor: '#6a7985'//方块颜色
		            }
		        }
		    },
		    legend: {
		    	textStyle : {
					color : '#FFF',
					fontSize : 14
				},
		        data:[indexname]
		    },
		    dataZoom: [
		               {
		            	   start:100-600/dataArrX.length,
		            	   end:100,
		                   type: 'slider',
		                   xAxisIndex: 0,
		                   bottom:30,
		                   height: 20,//宽度
		                   //filterMode: 'empty',
		                   textStyle:{
		                	   color:'#fff',
		                	   fontSize:'16'
		                   }
		               },
		               {
			                type: 'inside',
			                show: true,
			                xAxisIndex: 0,
			                start:100-900/dataArrX.length,
			                end: 100,
			                bottom:30,
			            },
		           ],
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    toolbox: {
	       show:false,
	  		},
		    grid: {
		    	top:'10%',
		        left: '3%',
		        right: '4%',
		        bottom: '13%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		        	
		            type : 'category',
		            boundaryGap : false,
		            data : dataArrX,
		            axisLabel : {
							show : true,
							interval:'0',
							textStyle : {
								color : '#c8c8c8',
								fontSize: 14
							}
						},
						splitLine : {//去掉网格线
							show : false
						},
						axisLine : {
							lineStyle : {
								color : 'rgba(0,0,0,0)',
								fontSize: 14
							}
						},
						axisTick : {
							lineStyle : {
								color : '#c8c8c8',
								fontSize: 14
							}
						}
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            //name:'(万)',
		            nameGap:10,
		            axisLabel : {
						show : true,
						textStyle : {
							color : '#c8c8c8',
							fontSize: 12
						}
					},
					splitLine : {//去掉网格线
						show : false
					},
					axisLine : {
					    show : false,
						lineStyle : {
							color : '#c8c8c8',
							fontSize: 14
						}
					},
					axisTick : {
						show : false,
						lineStyle : {
							color : '#c8c8c8',
							fontSize: 14
						}
					}
		        }
		    ],
		    series : [
		        {
		            name:indexname/*nameS*/,
		            type:'line',
		            //stack: '总量',
		            areaStyle: {
		            	normal: {
		            		
		            	}
		            },
		            color:['rgba(14,159,113,0.6)'],//对应上面data的背景色
		            data:dataArrS
		        }
		    ]
		};
		myChart.setOption(option);
	}else{
		$('#'+thisId).append("<span class='no_data'>当前选择时间段无数据</span>");
	}
	
}
