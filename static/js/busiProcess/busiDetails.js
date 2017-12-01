/**
	 * sockitIo
	 * 实时展示数据
	 */
	var choose=3;
	sockitIoshang_zdcx ();
	function sockitIoshang_zdcx ()
	{
		
		var socket = io.connect('http://218.206.203.241:18090/realhook');
	        socket.emit('getstatus');
	        setInterval(function(){socket.emit('getstatus')},1000);
	        $("#zdcx").click(function(){
	        	choose=3;
	        	
	        });
	        $("#xdcx").click(function(){
	        	choose=4;
	        	
	        });
	        $("#llcx").click(function(){
	        	choose=5;
	        	
	        });
	        socket.on('status', function (data){
	        /*$('#total_uv').text(JSON.stringify(data, null, '\t'));*/        
	       	//调用生成图片文字 所有累计的数据——uv iuv 
	        	imgNumber (data.campaigns[choose].uv+"",'#ljcxyhs-sz');
	        	imgNumber (data.campaigns[choose].iuv+"",'#jrljcxcgl-sz');
	        	var yArray = new Array();
	        	var length = data.campaigns[choose].history_uv.length;
	        	for(i=length-11;i<length;i++){
	        		yArray.push(data.campaigns[choose].history_uv[i]);
	        	}
	        	
	        	line('ljcxyhs','累计查询用户数',yArray);
	        	
	        	
	        	
	        	
	        	var yArray2 = new Array();
	        	var length2 = data.campaigns[choose].history_iuv.length;
	        	for(i2=length2-11;i2<length2;i2++){
	        		yArray2.push(data.campaigns[choose].history_iuv[i2]);
	        	}
	        	
	        	bar('jrljcxcgl','累计查询成功量',yArray2);
	        	
	        	
	        	
	        	var yArray3 = new Array();
	        	var length3 = data.campaigns[choose].history_iuv.length;
	        	for(i3=length3-11;i3<length3;i3++){
	        		yArray3.push(data.campaigns[choose].history_iuv[i3]);
	        	}
	        	
	        	line2('dqcxcgl','当前查询成功率',yArray3);
	        	
	        	
	        	
	        	/*var y4 = data.campaigns[choose].suc_rate*100;*/
	        	var y4 = data.campaigns[choose].isuc_rate;
	        	
	        	ybp('dqcxcgl-1','当前查询成功率',y4);
  
	        	
	        	
	        	
	        	//判断日环比 速率 累计查询用户数
		         var ljcxyhs_rhb =data.campaigns[choose].chain_uv;
		         var ljcxyhs_sl=data.campaigns[choose].speed_uv;
		          $("#ljcxyhs-sl").html(ljcxyhs_sl);
		         if(ljcxyhs_rhb>=0){
		         	$("#ljcxyhs-rhb").html("+"+ljcxyhs_rhb+"%<span class='glyphicon glyphicon-arrow-up'></span>");
		         }
		         else{
		         $("#ljcxyhs-rhb").html(ljcxyhs_rhb+"%<span class='glyphicon glyphicon-arrow-down'></span>");
		         }
		         


		      //今日累计查询成功率
		         var jrljcxcgl_rhb =data.campaigns[choose].chain_iuv;
		         var jrljcxcgl_sl=data.campaigns[choose].speed_iuv;
		          $("#jrljcxcgl-sl").html(jrljcxcgl_sl);
		         if(jrljcxcgl_rhb>=0){
		         	$("#jrljcxcgl-rhb").html("+"+jrljcxcgl_rhb+"%<span class='glyphicon glyphicon-arrow-up'></span>");
		         }
		         else{
		         $("#jrljcxcgl-rhb").html(jrljcxcgl_rhb+"%<span class='glyphicon glyphicon-arrow-down'></span>");
		         }
		         
		      //当前查询成功率
		         var dqcxcgl_sz =data.campaigns[choose].isuc_rate;
		         
		         $("#dqcxcgl-sz").html((dqcxcgl_sz).toFixed(2)+"%");
		         

	        })
	        
	var choose2 =6;        
	sockitIoxia ();
	function sockitIoxia ()
	{
		
		var socket = io.connect('http://218.206.203.241:18090/realhook');
	        socket.emit('getstatus');
	        setInterval(function(){socket.emit('getstatus')},1000);
	        $("#4gfx").click(function(){
	        	choose2=6;
	        	
	        });
	        $("#4gzx").click(function(){
	        	choose2=7;
	        	
	        });
	        $("#llyb").click(function(){
	        	choose2=8;
	        	
	        });
	        
	        socket.on('status', function (data){
	        /*$('#total_uv').text(JSON.stringify(data, null, '\t'));*/        
	       	//调用生成图片文字 所有累计的数据——uv iuv 
	        	imgNumber (data.campaigns[choose2].uv+"",'#ljblyhs-sz');
	        	imgNumber (data.campaigns[choose2].iuv+"",'#ljblcgl-sz'); 
	        	//累计办理用户数折线图
	        	var yArray = new Array();
	        	var length = data.campaigns[choose2].history_uv.length;
	        	for(i=length-11;i<length;i++){
	        		yArray.push(data.campaigns[choose2].history_uv[i]);
	        	}
	        	
	        	line('ljblyhs','累计办理用户数',yArray); 
	        	
	        	//累计办理成功量柱状图
	        	var yArray2 = new Array();
	        	var length2 = data.campaigns[choose2].history_iuv.length;
	        	for(i2=length2-11;i2<length2;i2++){
	        		yArray2.push(data.campaigns[choose2].history_iuv[i2]);
	        	}
	        	
	        	bar('jrljblcgl','累计办理成功量',yArray2);
	        	
	        	
	        	
	        	var yArray3 = new Array();
	        	var length3 = data.campaigns[choose2].history_iuv.length;
	        	for(i3=length3-11;i3<length3;i3++){
	        		yArray3.push(data.campaigns[choose2].history_iuv[i3]);
	        	}
	        	
	        	line2('dqblcgl','当前办理成功率',yArray3);
	        	
	        	
	        	
	        	
	        	var y4 = data.campaigns[choose2].isuc_rate;
	        	
	        	
	        	ybp('dqblcgl-1','当前办理成功率',y4);
	        	
	        	
		      
		         var ljblyhs_rhb =data.campaigns[choose2].chain_uv;
		         var ljblyhs_sl=data.campaigns[choose2].speed_uv;
		          $("#ljblyhs-sl").html(ljblyhs_sl);
		         if(ljblyhs_rhb>=0){
		         	$("#ljblyhs-rhb").html("+"+ljblyhs_rhb+"%<span class='glyphicon glyphicon-arrow-up'></span>");
		         }
		         else{
		         $("#ljblyhs-rhb").html(ljblyhs_rhb+"%<span class='glyphicon glyphicon-arrow-down'></span>");
		         }
		      //累计办理成功量
		         var ljblcgl_rhb =data.campaigns[choose2].chain_iuv;
		         var ljblcgl_sl=data.campaigns[choose2].speed_iuv;
		          $("#ljblcgl-sl").html(ljblcgl_sl);
		         if(ljblcgl_rhb>=0){
		         	$("#ljblcgl-rhb").html("+"+ljblcgl_rhb+"%<span class='glyphicon glyphicon-arrow-up'></span>");
		         }
		         else{
		         $("#ljblcgl-rhb").html(ljblcgl_rhb+"%<span class='glyphicon glyphicon-arrow-down'></span>");
		         }
		      //当前办理成功率
		         var dqblcgl_sz =data.campaigns[choose2].isuc_rate;
		         
		         $("#dqblcgl-sz").html((dqblcgl_sz).toFixed(2)+"%");

	        })
	
	
}
}
//累计查询用户数折线图  累计办理用户数折线图
function line(id,name,y){
	var myChart = document.getElementById(id);
	
	// 自适应宽高
//	var myChartContainer = function () {
//	    myChart.style.width = $(".middle4-1").width()+'px';
//	    myChart.style.height = '160px';
//	};
//	myChartContainer();
	var myChart = echarts.init(myChart);
	
	var option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer: {
	        	type : 'line',
	            
	            label: {
	                backgroundColor: '#6a7985'
	            }
	        }
	    },
	    grid: {
	       top:'5%',
	       left:'3%',
	       bottom:'3%',
	        
	        containLabel: true
	    },
	    xAxis : [
	        {
	        	axisLabel:{  
	            interval: 0  
	        },
            axisLine:{
                lineStyle:{
                    color:'#ccc',
                    width:1,                  // 这里是坐标轴的宽度
                }
            },
            type : 'category',
            boundaryGap : false,
            data : ['-50','-45','-40','-35','-30','-25','-20','-15','-10','-5min','now']
        }
    ],
    yAxis : [
        {
    		name:'万',
            
            splitLine:{  
                        　　　　	show:false  
                        　　	}, 
            axisLine:{
                lineStyle:{
                color:'#ccc',
                width:0,                  // 这里是坐标轴的宽度
            },
                            
        },
        type : 'value',
            
    }],
    series : [
        {
            name:name,
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:y,
            symbol:'',
            symbolSize:5,
            itemStyle:{
                normal:{
                    lineStyle:{
                        color:'#0FDC96',
                        
                    },
                    
                    color:['rgba(14,159,113,0.6)'],
                }
            }
        }]
	};
	myChart.setOption(option);
}


// 今日累计查询成功量柱状图  今日累计办理量柱状图
function bar(id2,name2,y2){
	var myChart = document.getElementById(id2);
	
	// 自适应宽高
//	var myChartContainer = function () {
//	    myChart.style.width = $(".middle4-1").width()+'px';
//	    myChart.style.height = '160px';
//	};
//	myChartContainer();
	var myChart = echarts.init(myChart);
	
	var option = {
			color: ['#3398DB'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	        top:'5%',
	       left:'3%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['-50','-45','-40','-35','-30','-25','-20','-15','-10','-5min','now'],
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLabel: {        
                    interval: 0 ,
                    show: true,
                    textStyle: {
                        color: '#ccc',
                        fontSize:'1'
                    }
                },
                axisLine:{
                    lineStyle:{
                    color:'#ccc',
                    width:1,                  // 这里是坐标轴的宽度
                }
            }
          }],
	    yAxis : [
	    	{
	    		type : 'value',
	    		splitLine:{  
                        　　　　	show:false  
                    　	},
            axisLine:{
                lineStyle:{
                color:'#fff',
                width:0,                  // 这里是坐标轴的宽度
            }
                    　	},
            axisLabel: {        
                show: true,
                textStyle: {
                    color: '#ccc',
                    fontSize:'1'
                }
            }}
    	],
    	series : [
    		{
	            name:name2,
	            type:'bar',
	            barWidth: '20',
	            itemStyle:{
                    normal:{
                        color:'#1E5AE1'
                    }
                },
            data:y2,
        }]
	};
	myChart.setOption(option);
}


// 当前查询成功率仪表盘
function ybp(id4,name4,y4){
	var myChart = document.getElementById(id4);
	
	/*// 自适应宽高
	var myChartContainer = function () {
	    myChart.style.width = $(".middle4-1").width()*0.6+'px';
	    myChart.style.height = $(".middle4-1").height()/2+'px';
	};
	myChartContainer();*/
	var myChart = echarts.init(myChart);

	var option = {
	    tooltip : {
	        formatter: "{a}:<br/>{c}%"
	    },
    
	    series : [
	        {
	            name:name4,
	            type: 'gauge',
	            
	            z: 1,
	            top:5,
	            left:10,
	            min: 0,
	            max: 100,
	            splitNumber: 4,
	            radius: '95%',
	            pointer: {// 这个show属性好像有问题，因为在这次开发中，需要去掉指正，我设置false的时候，还是显示指针，估计是BUG吧，我用的echarts-3.2.3；希望改进。最终，我把width属性设置为0，成功搞定！
            		length:'90%',// 指针长度
                    width:3,
                },
	            axisLabel: {        
                    show: true,
                    formatter: '{value}%',
                    textStyle: {
                        color: '#ccc',
                        fontSize:'10'
                    }
                },
	            axisLine: {            // 坐标轴线
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    width: 10,
	                    color:[[0.25,'#f00000'],[0.5,'#F6400F'],[0.75,'#50FFFF'],[1,'#1E5AE1']]
	                },
	                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
	                    size:15,
	                }
	            },
	            axisTick: {            // 坐标轴小标记
	                length: 6,        // 属性length控制线长
	                lineStyle: {       // 属性lineStyle控制线条样式
	                    color: 'auto'
	                }
	            },
	            splitLine: {           // 分隔线
	                length: 5,         // 属性length控制线长
	                
	                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
	                    color: 'auto'
	                }
	            },
	           
	            detail : {
	                show:false,
	               
	            },
	            data:[{value:y4,}]
	            
	        }
	    ]
	};
	myChart.setOption(option);
}


// 当前查询成功率折线图  当前办理成功率折线图
 function line2(id3,name3,y3){
	var myChart = document.getElementById(id3);

	// 自适应宽高
//	var myChartContainer = function () {
//	    myChart.style.width = $(".middle4-1").width()+'px';
//	    myChart.style.height = '160px';
//	};
//	myChartContainer();
	var myChart = echarts.init(myChart);
	var option = {
	    tooltip : {
	        trigger: 'axis',
	        axisPointer: {
	        	type : 'line',
	            label: {
	                backgroundColor: '#6a7985'
	            }
	        }
	    },
	    grid: {
	    		top:'10',
	      	left:'3%',
	        bottom:'3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	        	axisLabel:{  
	            interval: 0  
	        },
        axisLine:{
            lineStyle:{
            	color:'#ccc',
            	width:1,                  // 这里是坐标轴的宽度
            }
        },
            
        type : 'category',
        boundaryGap : false,
        data : ['-50','-45','-40','-35','-30','-25','-20','-15','-10','-5min','now']
    }],
    yAxis : [
        {
            min:60,
            splitLine:{  
                        　　　　show:false  
        }, 
      	axisLine:{
            lineStyle:{
                color:'#ccc',
                  width:0,                  // 这里是坐标轴的宽度
            }
        },
        type : 'value'
    }],
    series : [
        {
            name:name3,
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:y3,
            symbol:'',
            symbolSize:5,
            itemStyle:{
                normal:
                {
                    lineStyle:{
                        color:'#51FFFF',
                        
                    },
                    color:'#51FFFF',
                    areaStyle:{
                    color:'rgba(128, 128, 128, 0)'
                }
            }
        }
    }]};
	myChart.setOption(option);
}



