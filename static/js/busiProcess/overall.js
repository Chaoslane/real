$(function(){
	if(getParam('date')==''){
		$("#pickEndDate").val(cal_date_e(new Date(),5));
	}else{
		$("#pickEndDate").val(getParam('date'));
	}
	
	var date=$("#pickEndDate").val();
	showVisit('ywfwl',date,20);
	showVisit('blcgcs',date,99);
	showVisitRate(date);
	showName();
	showLines($("#ywmc").val(),date);
	$("#qushi").text($("#ywmc").find("option:selected").text()+"趋势");
	/**
	 * 切换业务名称
	 */
	$("#ywmc").change(function(){
		var date=$("#pickEndDate").val();
		$("#qushi").text($("#ywmc").find("option:selected").text()+"趋势");
		showLines($("#ywmc").val(),date);
		
	});
	//查询按钮点击
	$("#activeSearch").click(function(){
		var date=$("#pickEndDate").val();
		showVisit('ywfwl',date,20);
		showVisit('blcgcs',date,99);
		showVisitRate(date);
		showLines($("#ywmc").val(),date);
		
	});
});

/**
 * 最下面的折线图
 * @param name
 * @param date
 */
function showLines(name,date){
	if($('#qs div')){
		$('#qs div').hide();
	}
	if($('#qs .no_data')){
		$('#qs .no_data').remove();
	}
	var daytimes=new Array();
	var suc=new Array();
	var los=new Array();
	var rates=new Array();
	var dataZoom_end;
	$.post('../../overRall/getLines.do', {
		'name' : name,
		'date':date
	}, function(result, resultState) {
		if (resultState == "success") {
			var resultJson = eval(result);
			if(result.length >10){
				 dataZoom_end = 100-(10/result.length)*100;
			}else{
				 dataZoom_end = 0;
			}
			$.each(resultJson, function(i, item) {
				daytimes.push(item.daytime);
				suc.push(item.suc);
				los.push(item.los);
				rates.push(item.rates.toFixed(2));
			});
			if(daytimes.length > 0){
				$('#qs div').show();
				showColumnar(daytimes,suc,los,rates,dataZoom_end);	
			}else{
				$('#qs').append("<span class='no_data'>当前选择时间无数据</span>");
			}
			
		}
	});
	
}
/**
 * 显示下拉框里面的业务名称
 */
function showName(){
	$.ajaxSetup({   
        async : false  
    }); 
	
	$.post('../../overRall/getName.do', {
	}, function(result, resultState) {
		$("#ywmc").empty();
		if (resultState == "success") {
			var resultJson = eval(result);
			$.each(resultJson, function(i, item) {
			$("#ywmc").append(" <option value='"+item.name+"'>"+item.name+"</option>");
			});
		
		}
	});
	
}
/**
 * 业务成功办理率
 * @param date
 */
function showVisitRate(date){
	if($('#ywblcgl-2 div')){
		$('#ywblcgl-2 div').hide();
	}
	if($('#ywblcgl-2 .no_data')){
		$('#ywblcgl-2 .no_data').remove();
	}
	var names=new Array();
	var uvs=new Array();
	$.post('../../overRall/getVisitRate.do', {
		'date' : date
	}, function(result, resultState) {
		if (resultState == "success") {
			var resultJson = eval(result);
			$.each(resultJson, function(i, item) {
				names.push(item.name);
				uvs.push(item.rates.toFixed(2));
			});
			if(names.length > 0){
				$('#ywblcgl-2 div').show();
				getFirst('ywblcgl-2',names ,uvs,2);
			}else{
				$('#ywblcgl-2').append("<span class='no_data'>当前选择时间段无数据</span>");
			}		
		}
	});
	
}
/**
 * 业务访问量，业务成功次数
 *  @param  thisId
 * @param daytime
 * @param flag
 */
function showVisit(thisId,date,flag){
	var names=new Array();
	var uvs=new Array();
	if($('#'+thisId+' div')){
		$('#'+thisId+' div').hide();
	}
	if($('#'+thisId+' .no_data')){
		$('#'+thisId+' .no_data').remove();
	}
	$.post('../../overRall/getVisit.do', {
		
		'date' : date,'flag':flag
	}, function(result, resultState) {
		if (resultState == "success") {
			var resultJson = eval(result);
			$.each(resultJson, function(i, item) {
				names.push(item.name);
				uvs.push(item.uv);
			});
			if(names.length > 0){
				$('#'+thisId+' div').show();
				getFirst(thisId,names ,uvs,1);
			}else{
				$('#'+thisId).append("<span class='no_data'>当前选择时间段无数据</span>");
			}					
		}
	});
	
}
/**
 * 趋势图
 * @param date
 * @param suc
 * @param los
 * @param rates
 * @param dataZoom_end
 */
function showColumnar(date,suc,los,rates,dataZoom_end){
	$('#qs div:last').hide();
	var myChart = document.getElementById('qs');
    myChart = echarts.init(myChart);
	var option = {
			   
			   tooltip : {
			        trigger: 'axis',
			        formatter: "{a0}:{c0}<br/>{a1}:{c1}<br/>{a2}:{c2}%",
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    dataZoom: [//给x轴设置滚动条
				            {
				            	start:dataZoom_end,
				                end: 100,
				                type: 'slider',
				                show: true,
				                xAxisIndex: [0],
				                height: 10,//组件高度
				                bottom:2,
				                showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
				            },
				            //下面这个属性是里面拖到
				            {
				                type: 'inside',
				                show: true,
				                xAxisIndex: [0],
				                start:dataZoom_end,
				                end: 100,
				            },
				        ],
			    legend: {
			        data:['办理成功','办理失败','成功率'],
			        textStyle:{
			            color:'#ccc'
			        }
			    },
			    grid: {
			    	
			    	left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: [
			        {
			            type: 'category',
			            data: date,
			            axisPointer: {
			                type: 'shadow'
			            },
			             axisLine:{
			                            lineStyle:{
			                                color:'#ccc',
			                                  width:0,                  //这里是坐标轴的宽度
			                            },
			                            
			            },
			            splitLine:{  
			                 show:false, 
			            }, 
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value',
			           // name: '万',
			            min: 0,
			           // interval: 50,
			            axisLabel: {
			                formatter: '{value} '
			            },
			           
			            axisLine:{
			                            lineStyle:{
			                                color:'#ccc',
			                                  width:0,                  //这里是坐标轴的宽度
			                            },
			                            
			            },
			            splitLine:{  
			                  show:false, 
			            }, 
			           
			        },
			        {
			            type: 'value',
			            name: '成功率',
			            min: 0,
			            
			             axisLine:{
			                            lineStyle:{
			                                color:'#ccc',
			                                  width:0,                  //这里是坐标轴的宽度
			                            },
			                            
			            },
			            splitLine:{  
			                 show:false,  
			          }, 
			           // interval: 5,
			            axisLabel: {
			                formatter: '{value} %'
			            }
			        }
			    ],
			    series: [
			        {
			            name:'办理成功',
			            type:'bar',
			            
			            itemStyle:{
			                        normal:{
			                            color:'#0FDC96',
			                                }
			                    },
			            data:suc,
			        },
			        {
			            name:'办理失败',
			            type:'bar',
			            barGap: 0,
			            itemStyle:{
			                        normal:{
			                            color:'#1E5AE1',
			                                }
			                    },
			            data:los,
			        },
			        {
			            name:'成功率',
			            type:'line',
			            itemStyle:{
			                        normal:{
			                            color:'#51FFFF',
			                                }
			                    },
			            yAxisIndex: 1,
			            data:rates,
			        }
			    ]
			};
myChart.setOption(option);
}
/**
 * 前三个条形图
 * @param thisId
 * @param names
 * @param uv
 * @param flag:状态位1：表示前两个；2表示第三个
 */
function getFirst(thisId, names,uv,flag){
	$("#"+thisId + ' div:last').hide();
	var n = 0;
	 var  myChart = echarts.init( document.getElementById(thisId));
	var option = {
   tooltip : {
       trigger: 'axis',
       formatter: flag==1?"{b}:{c}":"<br/>{b}:{c}%",
       axisPointer : {            // 坐标轴指示器，坐标轴触发有效
           type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
       }
   },
   legend: {
       data: names,
   },
   grid: {
   	top:'3%',
   	left: '3%',
       right: '12%',
       bottom: '3%',
       containLabel: true,
   },
   xAxis:  {
       type: 'value',
       splitLine:{  
                    show:false,  
           }, 
           axisLine:{
                           lineStyle:{
                               color:'#ccc',
                                 width:0,                  //这里是坐标轴的宽度
                           },
                           
           },
           axisLabel:{
        	   formatter:function (params){
        		   n++;
        		   if(n%2 != 1){
        			   if(flag==1){
        				   return formatTmpl(params); 
        			   }else{
        				   return params+"%"; 
        			   }
        			 
        		   }else{
        			   return '';
        		   }
               }
           }
           
   },
   yAxis: {
       type: 'category',
       splitLine:{  
                show:false,  
                }, 
           axisLine:{
                           lineStyle:{
                               color:'#ccc',
                                 width:0,                  //这里是坐标轴的宽度
                           },
                           
           },
       data: names,
   },
   series: [
       {
           
           type: 'bar',
           stack: '总量',
           barWidth : 25,
           itemStyle:{
                                   normal:{
                                       color:'#0FDC96'
                                   }
                               },
                               label : {
       							normal : {
       								show : true,//显示数字
       								position : 'right',
       								formatter: function(params){
       									if(flag==1){
       										return formatTmpl(params.value);
       									}else{
       										return params.value+"%";
       									}
       								
       								}
       							},
       						},
   
           data: uv,
       },
      
       
   ]
};
myChart.setOption(option);
myChart.on('click', function (params) {
	//当前点击的业务名称：
   var name=params.name;
	window.location.href="overall_Children.html?name="+name+"&date="+$("#pickEndDate").val(); 
});
	
	
}

//获得url中参数的方法		
function getParam(key){
	 var url = location.search.replace(/^\?/,'').split('&');
	    var paramsObj = {};
	    for(var i = 0, iLen = url.length; i < iLen; i++){
	        var param = url[i].split('=');
	        paramsObj[param[0]] = param[1];
	    }
	    if(key){
	        return paramsObj[key] || '';
	    }
	    return paramsObj;
		}





