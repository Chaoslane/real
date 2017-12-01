
/**
 * 堆叠折线图
 */
function echarts_lines (thisId,thisData,thisTime,indexname){
	var yName = '';
	if(indexname == 'APP平均使用时长中位数'){
		yName = '';
	}else if(indexname == '登录成功率'){
		yName = '(%)';
	}
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
	        },
	        formatter : function (params){
	        	if(params[0].seriesName == '登录成功率'){
	        		return '<p>'+params[0].axisValue +'</p>' + '<p>'+params[0].seriesName + ':' + params[0].value + '%</p>'
	        		 +'</p>';
	        	}else if(params[0].seriesName == 'APP平均使用时长中位数'){
	        		return '<p>'+params[0].axisValue +'</p>' + '<p>'+params[0].seriesName + ':' + formatTmpl(params[0].value) + '</p>'
	        		 +'</p>';
	        	}else{
	        		return '<p>'+params[0].axisValue +'</p>' + '<p>'+params[0].seriesName + ':' + formatTmpl(params[0].value) + '</p>'
	        		 +'</p>';
	        	}
	        	
	        }
	    },
	    
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
	        bottom: '2%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	        	
	            type : 'category',
	            boundaryGap : false,
	            data : thisTime,
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
	            name:yName,
	            nameGap:10,
	            axisLabel : {
					show : true,
					textStyle : {
						color : '#c8c8c8',
						fontSize: 12
					},
					formatter: function (a) {
						if(indexname == '登录成功率'){
							return a+'%';
						}else{
							return formatTmpl(a);
						}
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
				},
	        }
	    ],
	    dataZoom: [
	               {
	                   type: 'slider',
	                   show: true,
	                   xAxisIndex: [0],	                   
	                   //left: 30, //左边的距离
	                   //right: 40,//右边的距离
	                   bottom: 30,//右边的距离
	               },
	               //下面这个属性是里面拖到
	               {
	                   type: 'inside',
	                   show: true,
	                   xAxisIndex: [0],
	                   start: 1,
	                   end: 100
	               }
	           ],
	    series : [
	        {
	            name:indexname,
	            type:'line',
	            stack: '总量',
	            areaStyle: {
	            	normal: {
	            		
	            	}
	            },
	            color:['rgba(14,159,113,0.6)'],//对应上面data的背景色
	            data:thisData
	        }
	    ]
	};
	myChart.setOption(option,true);
}
/**
 * 图片表示文字
 */	
function imgNumber (dataS,targetId){
	var flag = true;
	$(targetId).empty();
	for(var i=0; i<dataS.length; i++){	//插入span	
		var $liHtml	=	$('<span></span>');
		$(targetId).append($liHtml);
		var xbar = 52 + dataS[i]*26;
		if(dataS[i] == '.'){
			flag = false;
			$liHtml.css({'backgroundPosition':-392+'px '+ '36px'});
		}else{
			$liHtml.css({'backgroundPosition':-xbar+'px '+ 0});
		}
		
		
	};
	if(flag){
		for(var j=dataS.length; j>0; j--){			
			if( +j%3 === 0 ){
				if(dataS.length%3 === 0){
					$(targetId+ ' span').eq(j).before($('<span class="splitLi" ></span>'));	
				};
				if(dataS.length%3 === 1){
					$(targetId+ ' span').eq(j-2).before($('<span class="splitLi" ></span>'));	
				};
				if(dataS.length%3 === 2){
					$(targetId+ ' span').eq(j-1).before($('<span class="splitLi" ></span>'));	
				};
			};
		};
	}
	$(targetId).prepend($('<i class="leftSpan"></i>')).append($('<i class="rightSpan"></i>'));//插入左右边框
	if(dataS.length >10){
		$(targetId).width(70+27.5*dataS.length);	
	};
};
/**
 * 仪表图 echarts_gauge 
 * @param {Object} thisId
 */
function echartsGauge(thisId,rate_number){
	$('#'+thisId +' div').eq(1).hide();
	var myChart = echarts.init(document.getElementById(thisId));
	option = {
			
		    backgroundColor: 'rgba(0,0,0,0)',
		    tooltip : {
		        formatter: "{a} <br/>{c} {b}%"
		    },
		    toolbox: {
		        show : false,//右上角图标
		        feature : {
		            mark : {show: true},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    series : [
		        {
		            name:'',//图表名称
		            type:'gauge',
		            left:'20%',
		            min:0,
		            max:100,//设置最大值
		            splitNumber:4,//调整分割形式0-100分几份
		            radius: '100%',//整体图的大小
		            axisLabel: {        
		                show: true,
		                formatter: '{value}%',
		                textStyle: {
		                    color: '#ccc',
		                    fontSize:'10',
		                    
		                }
		            },
		            axisTick: {            // 坐标轴小标记
		                length: 2,        // 属性length控制线长
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    color: 'auto'
		                }
		            },
		            axisLine: {            // 坐标轴线
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    width: 6,
		                    color:[[0.25,'#f00000'],[0.5,'#F6400F'],[0.75,'#50FFFF'],[1,'#1E5AE1']]
		                },
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    size:10,
		                }
		            },
		            splitLine: {           // 分隔线
		                length: 5,         // 属性length控制线长
		                
		                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
		                    color: 'auto'
		                }
		            },
		            pointer: {    
		            	 length :'70%',//指针长度
		            	 width:3.5,//指针宽度
		                shadowColor : '#fff', //默认透明
		                shadowBlur: 1
		            },
		            title : {
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    fontWeight: 'bolder',
		                    fontSize: 20,
		                    fontStyle: 'italic',
		                    color: '#fff',
		                    shadowColor : '#fff', //默认透明
		                    shadowBlur: 0
		                }
		            },
		            detail : {
		            	show:false,
		                backgroundColor: 'rgba(0,0,0,0)',
		                borderWidth: 0,
		                borderColor: '#fff',
		                shadowColor : '#fff', //默认透明
		                shadowBlur: 5,
		                offsetCenter: ['0', '0'],       // x, y，单位px 控制data中value显示位置
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    fontWeight: 'bolder',
		                    color: '#50ffff'
		                },
		                formatter: function (a){
		                	return a+'%';
		                }
		            },
		            data:[{value: rate_number, name: ''}]
		        }
		    ]
		};
	myChart.setOption(option);
}

/**
 * 环形图 echarts_gauge 
 * @param {Object} thisId
 */
function pieChart(thisId,dataName,dataNumber,flag) {
	if(flag){
		var flagChart = false;	//
		var colors=['#0fdc97','#1f5ae2','#ef0100','#4ffffc','#ff6400','#008788']; 
	}else{
		var flagChart = true;//
		var colors=['#0fdc97','#ff6400','#ef0100','#4ffffc','#1f5ae2','#008788']; 
	}
	$('#'+thisId +' div').eq(1).hide();
	var myChart = echarts.init(document.getElementById(thisId));
	option = {
		
		title : {//饼图标题
			x : 'center',
			textStyle : {
				color : '#FFF',
				fontSize : 16
			}
		},
		/* grid: [
		        {x: '7%', y: '7%', width: '50%', height: '100%'}
		    ],*/
		//
		tooltip : {
			trigger : 'item',
			formatter : "{b}:{d}%",
		},
		legend : {
			orient : 'horizontal',//控制图例是否一行显示
			//selectedMode: false,
            x:'right',
            y:'80%',
           // align:'right',
            itemHeight:10,
            itemWidth:10,
            itemGap:12, 
			data : dataName,
			textStyle : {
				color : '#FFF',
				fontSize : 14
			},
			show:false//是否显示图例
		},
		series : [ {
			//name : '',
			type : 'pie',
			//selected:'新增用户',
			color:['#0edd95','#1e59e1'],//对应上面data的背景色
			radius : [ '40%', '70%' ],//可通过修改内外半径调整大小（防止文字溢出）不添加的话就不是环形图了（变成扇形饼状图）
			avoidLabelOverlap : true,//是否启用防止标签重叠策略，默认开启
			itemStyle : {
				normal : {
					label : {
						show : true,
						formatter : "{b} :{c}"
					},
					color:function(color){  
                      return colors[color.dataIndex%6];  
                    },
				}
			},
			data :dataNumber,
			label: {
                normal: {
                	show: flag,//控制链接线上面的文字显示与否
                    position: 'left',
                    textStyle: {
                        fontSize: '15',
                    	textAlign:'center'
                    },
                    //formatter : "{b}：{c}",
                    formatter:function (params){//这里里面不能识别标签，样式没法修改              		
                    	return params.name + '\n' + formatTmpl(params.value) ;
                    }
                },
                emphasis: {//控制hover时的文字状态
                    show: false,
                    textStyle: {
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {//控制文字与图形的链接线
                normal: {
                    show: false
                }
            },
            
            
		} ]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	myChart.on('mouseover',function(params){
    	if(!flag){
    		$('#user_name .user_name').html(params.name);
    		$('#user_volume').html(formatTmpl(params.value));
    		$('#user_share').html(params.percent + '%');
    	}
	});
}

/**
 * 柱状图
 * @param {Object} thisId
 */
function echartsColumn (thisId,hours,datas){
	$('#'+thisId +' div').eq(1).hide();
	var myChart = echarts.init(document.getElementById(thisId));
	
	option = {
		/*backgroundColor: 'url("img/HeNan01.png")no-repeat',*/
	    color: ['#1e5ae1'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        },
	        /*formatter : "{b}:{c}",*/
	        formatter: function(params){
				return params[0].name + '(小时):' + formatTmpl(params[0].value);
			}
	    },
	    grid: {
	    	top:'10%',
	        left: '4%',
	        right: '5%',
	        bottom: '4%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',	           
	            data : hours,
	            name : '(h)',
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
	            type : 'value',
	            //name:'(万人)',
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
	            name:'直接访问',
	            type:'bar',
	            barWidth: '60%',
	            data:datas,
	            formatter: function(params){
					return formatTmpl(params.value);
				}
	           //data:dataArr
	        }
	    ]
	};
	myChart.setOption(option);
};

/**
 * 横向柱状图
 * @param {Object} thisId
 */
function echartsTransverse(thisId,dataName,dataNumber){
	$('#'+thisId +' div').eq(1).hide();
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
		    dataZoom: [//滚动条
			            {//Y轴
			                type: 'slider',//类型
			                show: true,//是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
			                orient: 'vertical',   // 'vertical'布局方式是横还是竖。不仅是布局方式，对于直角坐标系而言，也决定了，缺省情况控制横向数轴还是纵向数轴
			                width: 20,//宽度
			                //backgroundColor: 'rgb(0, 142, 183)',//托条后的背景上分割颜色
			                /*dataBackgroundColor: {//数据阴影的样式
			                	lineStyle:{//阴影的线条样式
			                		color:'#000'
			                	}
			                },*/
			                fillerColor: 'rgba(157, 207, 187, .7)',//选中范围的填充颜色
			                borderColor: '#fff',//边框样式
			                handleColor: '#fff',//两端托点的样式
			                showDetail: true,//是否显示detail，即拖拽时候显示详细数值信息
			                textStyle: {//文字样式
			                	color:'#fff'
			                },
			                yAxisIndex: 0,//设置 dataZoom-slider 组件控制的 y轴
			                right:5,
			                start: 100-1000/dataName.length,
			                end: 100
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

/**
 * 柱状图+折线图
 * @param {Object} thisId
 */
function echarts_line_column (thisId,thisDataName,monthArr,barArr,lineArr){
	$('#'+thisId +' div').eq(1).hide();
	 var myChart = echarts.init(document.getElementById(thisId));
	 option = {
			    tooltip : {
			        trigger: 'axis'
			    },
			    grid : {//间距距离左右下
					top: '50',
					bottom: '10',
					left : '1%',
					right : '1%',
					containLabel : true
				},
			    legend: {
			    	data:thisDataName,//['活动用户留存量','活动用户留存率']
			        textStyle : {
						color : '#FFF',
						fontSize : 14
					},
			    },
			    calculable : true,
			    xAxis : [
			        {
			            type : 'category',
			            data : monthArr,
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
			            type : 'value',
			            name : '（人）',
			            axisLabel : {
			                formatter: '{value}'
			            },
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
			        },
			        {
			            type : 'value',
			            name : '',
			            axisLabel : {
			                formatter: '{value}%'
			            },
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
			            name:thisDataName[0],
			            type:'bar',
			            data:barArr,
			            itemStyle : {
							normal : {
								color:'#1f58e3',
								label : {
			          				textStyle : {
			          					fontSize : '15',//柱状上的显示的文字
			          					color:'#0fdc97'
			          				}
			          			}
							}
						},
			        },
			        {
			            name:thisDataName[1],
			            type:'line',
			            yAxisIndex: 1,
			            
			            data:lineArr,
			            itemStyle : {
							normal : {
								
								color:'#54fefe',
								label : {
			          				textStyle : {
			          					fontSize : '15',//柱状上的显示的文字
			          					color:'#0fdc97'
			          				}
			          			}
							}
						},
			        }
			    ]
			};
	myChart.setOption(option);
}
/**
 * 333,55数字格式化
 */
function toThousands(num) {//处理千位符的函数
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}