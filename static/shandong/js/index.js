$(function(){
	cssFun ('.dataList div:nth-child(1)');
	cssFun ('.dataLeft li:nth-child(2n)');
	cssFun ('.dataLeft li:nth-child(2n+1)');
	function cssFun (a){
		$(a).css('line-height',$(a).height()+'px');
	}
	
	var socketIo = io.connect('ws://192.168.4.153:18090/realhook');//建立一个socket链接
	emitFun();
	//socketIo.emit('getstatus','');
	function emitFun(){
		socketIo.emit('getstatus','');
		
		setTimeout(function(){
			emitFun();
		},5000);
	};
	
	socketIo.on('status',function(data){//监听服务器返回信息
		console.log(data);

		var colorS = ['#0fcfc4','#2fa1f7','#497af3','#4955bb'];
		
		$('#dataPv').text(formatTmpl(data.summary.pv));
		$('#dataUv').text(formatTmpl(data.summary.uv));
		$('#dataSuc_rate').text(formatTmpl(data.summary.suc_rate) + '%');
		
		$('#datalist_wrap').empty();
		//循环回传的data得到折线图和漏斗图的dataS数组
		for (var i = 0; i<data.campaigns.length; i++) {
			var ulId			=	"ulId"+i;
			var f_id			=	"echarts_funnel"+i;
			var l_id			=	"echarts_line"+i;
			var dataS_l			=	[];
			var legendData		=	[];
			var dataS_f			=	[];
			var dataStep		=	data.campaigns[i].step;
			var liS				=	'<li class="dataList">'
										+'<div><span id="" class="spanClassColor tipColor"></span>&emsp;<span id="">'+data.campaigns[i].alias+'</span></div>'
										+'<div id="" class="clearfix dataList_div1" >'
											+'<ul class="dataLeft floatLeft" id='+ulId+'>'
											+'</ul>'
											+'<ul class="dataRight floatLeft">'
												+'<li id='+f_id+'></li>'
												+'<li id='+l_id+'></li>'
											+'</ul>'
										+'</div>'
									+'</li> ';
									
			$('#datalist_wrap').append(liS);
			
			for (var j = 0; j < dataStep.length; j++) {
			
				var dataLeftLi =	'<li id="">'+dataStep[j].alias_uv+'：</li>'
									+'<li id="">'+formatTmpl(dataStep[j].uv)+'</li>';
				$('#'+ulId).append(dataLeftLi);
				
				legendData.push(dataStep[j].alias_con);
				
				dataS_f.push( {value: dataStep[j].con_rate, name: dataStep[j].alias_con,itemStyle:{normal:{color:colorS[j]}}});
				dataS_l.push({name:dataStep[j].alias_con,type:'line',data:dataStep[j].history_con_rate.slice(-18),itemStyle:{normal:{color:colorS[j]}}});
				//console.log(dataStep[j].history_con_rate.slice(-18));
			}
			
			funnelFun (f_id,dataS_f,legendData);
			lineFun (l_id,dataS_l,legendData);
			$('#'+l_id+' div:nth-child(2)').css({'top':'0','left':'0'});//防止图表tip位置靠下产生滚动条使屏幕‘闪动’一下
		}
	
	/**
	 * 折线图
	 * @param {Object} thisId
	 * @param {Object} dataS 数组 包含多个对象 每个对象是一条折线
	 * @param {Object} legendData 数组 存着每条线的名字
	 */
	function lineFun (thisId,dataS,legendData){
		
		var myChart = echarts.init(document.getElementById(thisId));
		option = {
		grid: {
        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	    	show:false,
	    	textStyle : {
					color : '#FFF',
					align : 'center',
					fontSize : 14
				},
	        /*data:['最高气温','最低气温']*/
	      data:legendData
	    },
	    
	    xAxis:  {
	    	axisLabel : {
				show : true,
				interval:'0',//强制显示所有标签
				textStyle : {
					interval:'0',
					color : '#FFF',
					align : 'center',
					fontSize : 14
				}
			},
	        type: 'category',
	        boundaryGap: false,
	        data: ['-5','-10','-15','-20','-25','-30','-35','-40','-45','-50','-55','-60','-65','-70','-75','-80','-85','-90'].reverse()
	    },
	    yAxis: {
	        type: 'value',
	        axisLabel: {
	            formatter: '{value}',
	            textStyle : {
					color : '#FFF',
					align : 'center',
					fontSize : 12
				}
	        },
	        splitLine : {//去掉网格线
					show : false
				},
	    },
	    /*series: [
	    
	         {
	            name:'最高气温',
	            type:'line', 
	            data:[1, 15, 14, 11, 18, 12, 8, 14, 11, 18, 12, 8],
	        },
	        {
	            name:'最低气温',
	            type:'line',
	            data:[1, 2, 2, 5, 3, 2, 0, 14, 11, 18, 12, 8],
	            
	        }
	    ]*/
	    series: dataS
	};

		myChart.setOption(option);
	}
	
	/**
	 * 漏斗图
	 * @param {Object} thisId
	 * @param {Object} dataS 
	 * @param {Object} legendData
	 */
	function funnelFun (thisId,dataS,legendData){
		var myChart = echarts.init(document.getElementById(thisId));
  
    option = {
    	
    	title: {
    		textStyle : {
				color : '#FFF',
				fontSize : 18
			},
	        text: '转化率',
	    },
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c}%"
	    },
	   
	    legend: {
	    	textStyle : {
				color : '#FFF',
				fontSize : 16
			},
	       /* data: ['展现','点击','访问','咨询','订单'],*/
	        data:legendData,
	        right:'right',
	        top:'center',
	    },
	    calculable: true,
	    series: [
	        {
	            name:'转化率',
	            type:'funnel',
	            left: '20%',
	            top: 20,
	            bottom: 2,
	            width: '60%',
	            min: 0,
	            max: 100,
	            minSize: '0%',
	            maxSize: '100%',
	            sort: 'descending',
	            gap: 1,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'inside',
	                    formatter: '{c}%',
	                },
	                emphasis: {
	                    textStyle: {
	                        fontSize: 20
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    length: 10,
	                    lineStyle: {
	                        width: 1,
	                        type: 'solid'
	                    }
	                }
	            },
	            itemStyle: {
	                normal: {
	                	
	                    borderColor: '#fff',
	                    borderWidth: 0.5
	                }
	            },
	            /*data: [
	                {value: 60, name: '访问'},
	                {value: 40, name: '咨询'},
	                {value: 20, name: '订单'},
	                {value: 80, name: '点击'},
	                {value: 100, name: '展现'}
	            ]*/
	            data : dataS
	        }
	    ]
	};
		myChart.setOption(option);
	}
	
		cssFun ('.dataList div:nth-child(1)');
		cssFun ('.dataLeft li:nth-child(2n)');
		cssFun ('.dataLeft li:nth-child(2n+1)');
		
		
		
		//千分号
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
		};
	});

setInterval(function(){
	fnDate();
},1000)
	
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

});//$function_end







