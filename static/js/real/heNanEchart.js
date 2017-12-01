/* 2017-12-01 13:47版 */
/**
 * 控制h4 样式（包括“今日累计用户数”/“当前活跃用户数”/“当前登录成功率”）
 */
$('.content_left_height3 h4').css('line-height',$('.content_left_height3 h4').parent().height()+'px');
$('.content_left_height2 h4').css('line-height',$('.content_left_height2 h4').parent().height()+'px');

//span css
$('.leftSpanBtn').css('lineHeight',$('.leftSpanBtn').parent('div').height()+'px');

$('#nav_ulTabs li a').css('lineHeight',$('#nav_ulTabs li a').parent('li').height()+'px');
$('#nav_ulTabs1 li a').css('lineHeight',$('#nav_ulTabs1 li a').parent('li').height()+'px');

$('.jsLineHeight').css('lineHeight',$('.jsLineHeight').parent().height()+'px');
for(var t = 0; t<$('.numberBar').length; t++){
	$($('.numberBar')[t]).css('lineHeight',$($('.numberBar')[t]).parent().height()+'px');
}

/**
 * 控制选项卡切换
 */
$(function(){
	$('.nav-tabs').on('click','a',function(){
		if(!$(this).hasClass('select')){
			//点击切换
			$(this).addClass('select').parent().siblings().find('a').removeClass('select');
		}
	});
});


/**
 * sockitIo
 * 实时展示数据
 */
var numberJ		=	0;
var maxValue;//用于动态设置最大值以显示地图颜色
sockitIoMap ();
function sockitIoMap (){
	//var socket = io.connect('http://192.168.4.3:7090/realhook');/*192.168.4.153:8090*/
	/*var socket = io.connect('http://192.168.4.153:18090/realhook');*/
	var socket = io.connect('http://218.206.203.241:18090/realhook');/*192.168.4.153:8090*/
	//http://218.206.203.241:18090/realhook
    socket.emit('getstatus');
    setInterval(function(){socket.emit('getstatus')},10000);
    
    socket.on('status', function (data){
    	//重置maxValue的值，防止重启数据归零造成的显示问题
    	maxValue	=	0;
    	//河南地图图表
       	console.log(data);
       	var dataAreas	=	[];
       	
    	function dataAreasFun (thisName,thisValue,thisUv,thisIuv,label,itemStyle,selected){
       		/*if(thisValue === 0){
       			this.value	=	Math.round(Math.random()*5000);
       			if(this.value > maxValue ){
       				maxValue = this.value;//赋值 找到最大值
       			}
       		}else{*/
    		
       			this.value	=	thisValue;
       			if(this.value > maxValue ){
       				maxValue = this.value;// 找到最大值
       			}
       		/*	
       		};*/
       		this.selected	=	selected//随机选中
       		this.name		=	thisName;
       		this.uv			=	thisUv;
       		this.iuv		=	thisIuv;
       		this.itemStyle	=	itemStyle;//设置选中的样式
       		this.label		=	label;//设置选中后当前市是否显示名字
       	}
    	var J;
    	if(numberJ === 0){
    		J	=	0
    		numberJ++;
    	}else{
    		J	=	Math.round(Math.random()*data.areas.length) ;//随机显示哪个市被选中
       		J 	===	18 ? J=17 :J; 
    	}
    		
       	//console.log(J);
       	var thisName	=	'';
       	var thisUv		=	'';
    	var thisIUv		=	'';
       	
       
       	for(var i = 0; i<data.areas.length; i++){
   		var val			=	data.areas[i];
       		if(i === J){
       			var selected	=	true;	//标示被选中状态
       			var itemStyle	=	{emphasis:{areaColor:'#12006A',borderColor:"#fff",borderWidth:1.5}};//标识当前选中状态样式以区别其他
       			var label		=	{normal: {
					                    show: false,//2017.9.15 市名字问题暂时隐藏
					                    color:'#dcfffe',
					                    fontSize:20,
					                },
					                emphasis: {
					                    show: false,
					                     color:'#dcfffe',
					                    fontSize:20,
					                }};//标识当前被选中市名字是否显示 自动显示
       			thisName		=	val.name;
       			thisUv			=	val.uv;
       			thisIUv			=	val.iuv;
       		}else{
       			var itemStyle	=	{emphasis:{areaColor:'#12006A'}};
       			var selected	=	false;
       			var label		=	{normal: {
					                    show: false,
					                    color:'#dcfffe',
					                    fontSize:20,
					                },
					                emphasis: {
					                    show: false,
					                     color:'#dcfffe',
					                    fontSize:20,
					                }};//标识当前被选中市名字是否显示 自动显示//标识当前被选中市名字是否显示 触发显示
       			
       		}
       		//console.log(val.name+'---'+val.iuv);
       		/*dataAreas.push(new dataAreasFun(val.name,val.uv,val.uv,val.iuv,selected,itemStyle,label));*/
       		dataAreas.push(new dataAreasFun(val.name,val.uv,val.uv,val.iuv,label,itemStyle,selected));
       	}
       	//console.log(thisName+"--"+thisUv);
        var p = '<h3 style="color:#50ffff;text-align:center;font-size:20px;font-weight:bold;line-height:20px;">【 '+ thisName +' 】</h3>'+
        '<p style="padding-left:5px;color:#fff;font-size:18px;height:20px;line-height:20px;margin:15px 0;border-left:6px solid #0fdc96;">今日累计用户数：<span class="" style="color:#50ffff;font-size:20px;">'+formatTmpl(thisUv)+'</span></p>'+
        '<p style="padding-left:5px;color:#fff;font-size:18px;height:20px;line-height:20px;border-left:6px solid #0fdc96;">当前活跃用户数：<span class="" style="color:#50ffff;font-size:20px;">'+formatTmpl(thisIUv)+'</span></p>'
        $('#echarts_mapTip').html(p);
        console.log(maxValue);
        var maxValue6 = parseInt(maxValue/6,10);
        console.log(maxValue6);
        $('#cutline_ul_li6_span2').text('');
        $('#cutline_ul_li5_span2').text('');
        $('#cutline_ul_li4_span2').text('');
        $('#cutline_ul_li3_span2').text('');
        $('#cutline_ul_li2_span2').text('');
        $('#cutline_ul_li1_span2').text('');
        //console.log(formatTmpl(maxValue));
        
       /* $('#cutline_ul_li6_span2').text('0 ~ '+maxValue6);
        $('#cutline_ul_li5_span2').text(maxValue6+' ~ '+maxValue6*2);
        $('#cutline_ul_li4_span2').text(maxValue6*2+' ~ '+maxValue6*3);
        $('#cutline_ul_li3_span2').text(maxValue6*3+' ~ '+maxValue6*4);
        $('#cutline_ul_li2_span2').text(maxValue6*4+' ~ '+maxValue6*5);
        $('#cutline_ul_li1_span2').text(maxValue6*5+' ~ '+maxValue);*/

        $('#cutline_ul_li6_span2').text('0 ~ '+formatTmpl(maxValue6));
        $('#cutline_ul_li5_span2').text(formatTmpl(maxValue6)+' ~ '+formatTmpl(maxValue6*2));
        $('#cutline_ul_li4_span2').text(formatTmpl(maxValue6*2)+' ~ '+formatTmpl(maxValue6*3));
        $('#cutline_ul_li3_span2').text(formatTmpl(maxValue6*3)+' ~ '+formatTmpl(maxValue6*4));
        $('#cutline_ul_li2_span2').text(formatTmpl(maxValue6*4)+' ~ '+formatTmpl(maxValue6*5));
        $('#cutline_ul_li1_span2').text(formatTmpl(maxValue6*5)+' ~ '+formatTmpl(maxValue));
        
		echarts_map ('echarts_map',dataAreas,thisName,maxValue);//生成echarts地图
    });
};


sockitIo ();
function sockitIo ()
{
	/*var socket = io.connect('http://192.168.4.153:8090/realhook');*/
	var socket = io.connect('http://218.206.203.241:18090/realhook');/*192.168.4.153:8090*/
        socket.emit('getstatus');
        setInterval(function(){socket.emit('getstatus')},1000);
        
        socket.on('status', function (data){
        /*$('#total_uv').text(JSON.stringify(data, null, '\t'));*/        
       	//调用生成图片文字 所有累计的数据——uv iuv 
       	console.log(data);
       	//今日累计
       	imgNumber (data.summary.uv+"",'#uv1');
       	if(data.summary.chain_uv < 0){//今日累计日环比
       		$('#summary_chain_uv').text(data.summary.chain_uv + '%');
       		$('#indicate_span').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
       	}else{
       		$('#summary_chain_uv').text('+' + data.summary.chain_uv + '%');	
       		$('#indicate_span').attr('class','upSpan glyphicon glyphicon-arrow-up');
       	};
       	if(data.summary.speed_uv < 0){//今日累计速率
       		$('#summary_speed_uv').text(data.summary.speed_uv);
       	}else{
       		$('#summary_speed_uv').text('+' + data.summary.speed_uv );
       	};
       	
       	//当前活跃用户数
       	imgNumber (data.summary.iuv+"",'#iuv1');
       	if(data.summary.chain_iuv < 0){//当前活跃计日环比
       		$('#summary_chain_iuv').text(data.summary.chain_iuv + '%');
       		$('#indicate_spanI').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
       	}else{
       		$('#summary_chain_iuv').text('+' + data.summary.chain_iuv + '%');	
       		$('#indicate_spanI').attr('class','upSpan glyphicon glyphicon-arrow-up');
       	};
       	if(data.summary.speed_iuv < 0){//当前活跃速率
       		$('#summary_speed_iuv').text(data.summary.speed_iuv );
       	}else{
       		$('#summary_speed_iuv').text('+' + data.summary.speed_iuv );
       	};
       	
       	//右侧流量折扣uv_llzk
       	/*for(let val of data.campaigns){*/
       	for(var i=0; i<data.campaigns.length; i++){
       		var val	=	data.campaigns[i];
       		//循环判定 login llzk rwk zdcx xdcx llcx 4gfx 4gzx 4gll cxl bll mobile (index只用其中5个)
       		
       		//当前登录成功率
       		if(val.name === 'login'){
       			console.log(val);
				echartsGauge('echarts_gauge',val.isuc_rate);//仪表图
				var valSucRateLogin	=	val.isuc_rate.toFixed(1);
				$('#echarts_gauge_text').text(valSucRateLogin+'%');
				//下方文字
				if(val.chain_suc < 0){//当前计日环比
		       		$('#login_chain_iuv').text(val.chain_suc + '%');
		       		$('#indicate_spanIuv').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
		       	}else{
		       		$('#login_chain_iuv').text('+' + val.chain_suc + '%');	
		       		$('#indicate_spanIuv').attr('class','upSpan glyphicon glyphicon-arrow-up');
		       	};
		       	if(val.speed_suc < 0){//当前登陆成功速率
		       		$('#login_speed_iuv').text(val.speed_suc);
		       	}else{
		       		$('#login_speed_iuv').text('+' + val.speed_suc);
		       	};
		       	
		       	var dataTime	=	['-90','-85', '-80', '-75', '-70', '-65', '-60','-55', '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5'];
		    	/*var data1		=	val.history_suc.length > 18 ? val.history_suc.slice(-18) : val.history_suc ;*/	
		    	var data1		=	val.history_isuc.length > 18 ? val.history_isuc.slice(-18) : val.history_isuc ;	
		       	
		       	/*var data1		=	[];*/	
				/*if(val.history_suc.length > 0){
					for(var j= 0; j<val.history_suc.length; j++){
						data1.push(((+val.history_suc[j])/(+val.history_uv[j] === 0 ? 1 : val.history_uv[j])*100).toFixed(1));
					}
				}*/
				echarts_line1 ('echarts_centerBottomLine',dataTime,(data1.length > 18 ? data1.slice(-18) : data1));
       		};
       		
       		//当前实时参与用户数（流量折扣专区or任我看）
       		var select = $("#nav_ulTabs").find('a.select').text();
       		if(select == '流量折扣专区'){
       			if(val.name == 'llzk'){
       				//当前时时参与用户数
           			//上方文字
       				imgNumber (val.iuv+"",'#iuv_llzk');//流量折扣 今日参与
           			if(val.chain_iuv < 0){////当前计日环比
           				$('#llzk_chain_iuv').text(val.chain_iuv + '%');
           				$('#llzk_spanI').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#llzk_chain_iuv').text('+' + val.chain_iuv + '%');	
    		       		$('#llzk_spanI').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_iuv < 0){
           				$('#llzk_speed_iuv').text(val.speed_iuv);
           			}else{
           				$('#llzk_speed_iuv').text('+' + val.speed_iuv);
           			};
           			
           			var valHistoryIuvLlzk	=	val.history_iuv.length > 12 ? val.history_iuv.slice(-12) : val.history_iuv ;
           			echartsBar('echarts_rightTopLine_cxl1',valHistoryIuvLlzk);//柱状图
           			
           			
           			//今日累计参与用户数
           			//上方文字
           			imgNumber (val.uv+"",'#uv_llzk');//流量折扣 今日参与
           			if(val.chain_uv < 0){////当前计日环比
           				$('#llzk_chain_iuv1').text(val.chain_uv + '%');
           				$('#llzk_spanI1').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#llzk_chain_iuv1').text('+' + val.chain_uv + '%');	
    		       		$('#llzk_spanI1').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_uv < 0){
           				$('#llzk_speed_iuv1').text(val.speed_uv);
           			}else{
           				$('#llzk_speed_iuv1').text('+' + val.speed_uv);
           			};
           			var timeLine = ['-60','-55', '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5'];
           			var historyUv	=	val.history_uv.length > 12 ? val.history_uv.slice(-12) : val.history_uv ;
           			echarts_line('echarts_rightTopLine_cxl',timeLine,historyUv);//折线图
           			
           			
           			//今日累计活动办理成功量
           			//上方文字
           			imgNumber (val.suc_time+"",'#uv1_llzk');
           			if(val.chain_suc < 0){////当前计日环比
           				$('#llzk_chain_iuv2').text(val.chain_suc + '%');
           				$('#llzk_spanI2').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#llzk_chain_iuv2').text('+' + val.chain_suc + '%');	
    		       		$('#llzk_spanI2').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_suc < 0){
           				$('#llzk_speed_iuv2').text(val.speed_suc);
           				//console.log(val.speed_suc);
           			}else{
           				$('#llzk_speed_iuv2').text('+' + val.speed_suc);
           			};
           			//console.log(val.suc_rate);
           			echartsGauge('echarts_rightTopLine_cxl2',val.isuc_rate);//仪表盘
           			var valSucRateLlzk	=	val.isuc_rate.toFixed(1);
           									
           			
           			$('#echarts_rightTopLine_cxl2_text').text(valSucRateLlzk+'%');
           		}
       		}else{
       			if(val.name == 'rwk'){
       				//当前时时参与用户数
           			//上方文字
       				console.log(val.iuv);
       				imgNumber (val.iuv+"",'#iuv_llzk');
           			if(val.chain_iuv < 0){////当前计日环比
           				$('#llzk_chain_iuv').text(val.chain_iuv + '%');
           				$('#llzk_spanI').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#llzk_chain_iuv').text('+' + val.chain_iuv + '%');	
    		       		$('#llzk_spanI').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_iuv < 0){
           				$('#llzk_speed_iuv').text(val.speed_iuv);
           			}else{
           				$('#llzk_speed_iuv').text('+' + val.speed_iuv);
           			};
           			var historyIuv1	=	val.history_iuv.length > 12 ? val.history_iuv.slice(-12) : val.history_iuv ;
           			echartsBar('echarts_rightTopLine_cxl1',historyIuv1);//柱状图
           			
           			
           			//今日累计参与用户数
           			//上方文字
           			imgNumber (val.uv+"",'#uv_llzk');//流量折扣 今日参与
           			if(val.chain_uv < 0){////当前计日环比
           				$('#llzk_chain_iuv1').text(val.chain_uv + '%');
           				$('#llzk_spanI1').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#llzk_chain_iuv1').text('+' + val.chain_uv + '%');	
    		       		$('#llzk_spanI1').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_uv < 0){
           				$('#llzk_speed_iuv1').text(val.speed_uv);
           			}else{
           				$('#llzk_speed_iuv1').text('+' + val.speed_uv);
           			};
           			var timeLine = ['-60','-55', '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5'];
           			var valHistoryUvRwk	=	val.history_uv.length > 12 ? val.history_uv.slice(-12) : val.history_uv ;
           			//console.log(valHistoryUvRwk);
           			echarts_line('echarts_rightTopLine_cxl',timeLine,valHistoryUvRwk);//折线图
           			
           			
           			//今日累计活动办理成功量
           			//上方文字
           			imgNumber (val.suc_time+"",'#uv1_llzk');
           			if(val.chain_suc < 0){////当前计日环比
           				$('#llzk_chain_iuv2').text(val.chain_suc + '%');
           				$('#llzk_spanI2').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#llzk_chain_iuv2').text('+' + val.chain_suc + '%');	
    		       		$('#llzk_spanI2').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_suc < 0){
           				$('#llzk_speed_iuv2').text(val.speed_suc);
           			}else{
           				$('#llzk_speed_iuv2').text('+' + val.speed_suc);
           			};
           			echartsGauge('echarts_rightTopLine_cxl2',val.isuc_rate);//仪表盘
           			var valSucRateLlzk	=	val.isuc_rate.toFixed(1);
           			$('#echarts_rightTopLine_cxl2_text').text(valSucRateLlzk+'%');
           		}
       		};
       		
       		
       		//当前实时参与用户数（查询类or办理类）
       		var select1 = $("#nav_ulTabs1").find('a.select').text();
       		if(select1 == '查询类'){
       			if(val.name == 'cxl'){
           			//上方文字
       				imgNumber (val.iuv+"",'#iuv_cxl');
           			imgNumber (val.uv+"",'#uv_cxl');
           	       	imgNumber (val.suc_time+"",'#uv1_cxl');
       				//当前实时参与用户数
           			if(val.chain_uv < 0){////当前计日环比
           				$('#cxl_chain_iuv').text(val.chain_iuv + '%');
           				$('#cxl_spanI').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#cxl_chain_iuv').text('+' + val.chain_iuv + '%');
    		       		$('#cxl_spanI').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_iuv < 0){
           				$('#cxl_speed_iuv').text(val.speed_iuv);
           			}else{
           				$('#cxl_speed_iuv').text('+' + val.speed_iuv);
           			};
           			var valHistoryIuvBll	=	val.history_iuv.length > 12 ? val.history_iuv.slice(-12) : val.history_iuv ;
           			//console.log(valHistoryIuvBll);
           			echartsBar('echarts_rightTopLine_cxl11',valHistoryIuvBll);//柱状图
           			
           			//今日累计参与用户数
           			//上方文字
           			if(val.chain_uv < 0){////当前计日环比
           				$('#cxl_chain_iuv1').text(val.chain_uv + '%');
           				$('#cxl_spanI1').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#cxl_chain_iuv1').text('+' + val.chain_uv + '%');	
    		       		$('#cxl_spanI1').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_uv < 0){
           				$('#cxl_speed_iuv1').text(val.speed_uv);
           			}else{
           				$('#cxl_speed_iuv1').text('+' + val.speed_uv);
           			};
           			var timeLine = ['-60','-55', '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5'];
           			var valHistoryUvCxl	=	val.history_uv.length > 12 ?  val.history_uv.slice(-12) : val.history_uv ;
           			//console.log(valHistoryUvCxl);
           			echarts_line('echarts_rightTopLine',timeLine,valHistoryUvCxl);//折线图
           			
           			
           			//今日累计活动办理成功量
           			//上方文字
           			if(val.chain_suc < 0){////当前计日环比
           				$('#cxl_chain_iuv2').text(val.chain_suc + '%');
           				$('#cxl_spanI2').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#cxl_chain_iuv2').text('+' + val.chain_suc + '%');	
    		       		$('#cxl_spanI2').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_suc < 0){
           				$('#cxl_speed_iuv2').text(val.speed_suc);
           			}else{
           				$('#cxl_speed_iuv2').text('+' + val.speed_suc);
           			};
           			echartsGauge('echarts_rightTopLine_cxl22',val.isuc_rate);//仪表盘
           			var valSucRate	=	val.isuc_rate.toFixed(1);
           			$('#echarts_rightTopLine_cxl22_text').text(valSucRate+'%');
           		}
       		}else{
       			if(val.name == 'bll'){
       				//上方文字
       				imgNumber (val.iuv+"",'#iuv_cxl');
           			imgNumber (val.uv+"",'#uv_cxl');
           	       	imgNumber (val.suc_time+"",'#uv1_cxl');
       				//当前实时参与用户数
           			if(val.chain_uv < 0){////当前计日环比
           				$('#cxl_chain_iuv').text(val.chain_iuv + '%');
           				$('#cxl_spanI').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#cxl_chain_iuv').text('+' + val.chain_iuv + '%');
    		       		$('#cxl_spanI').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_iuv < 0){
           				$('#cxl_speed_iuv').text(val.speed_iuv);
           			}else{
           				$('#cxl_speed_iuv').text('+' + val.speed_iuv);
           			};
           			
           			var valHistoryIuvBll	=	val.history_iuv.length > 12 ? val.history_iuv.slice(-12) : val.history_iuv ;
           			//console.log(valHistoryIuvBll);
           			echartsBar('echarts_rightTopLine_cxl11',valHistoryIuvBll);//柱状图
           			
           			
           			
           			//今日累计参与用户数
           			//上方文字
           			if(val.chain_uv < 0){////当前计日环比
           				$('#cxl_chain_iuv1').text(val.chain_uv + '%');
           				$('#cxl_spanI1').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#cxl_chain_iuv1').text('+' + val.chain_uv + '%');	
    		       		$('#cxl_spanI1').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_uv < 0){
           				$('#cxl_speed_iuv1').text(val.speed_uv);
           			}else{
           				$('#cxl_speed_iuv1').text('+' + val.speed_uv);
           			};
           			var timeLine = ['-60','-55', '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5'];
           			var valHistoryUvBll	=	val.history_uv.length > 12 ? val.history_uv.slice(-12) : val.history_uv ;
           			//console.log(valHistoryUvBll);
           			echarts_line('echarts_rightTopLine',timeLine,valHistoryUvBll);//折线图
           			
           			
           			//今日累计活动办理成功量
           			//上方文字
           			
           			if(val.chain_suc < 0){////当前计日环比
           				$('#cxl_chain_iuv2').text(val.chain_suc + '%');
           				$('#cxl_spanI2').attr('class','glyphicon glyphicon-arrow-down').css({'color':'#f00000','font-size':'12px'});
           			}else{
           				$('#cxl_chain_iuv2').text('+' + val.chain_suc + '%');	
    		       		$('#cxl_spanI2').attr('class','upSpan glyphicon glyphicon-arrow-up');
           			};
           			if(val.speed_suc < 0){
           				$('#cxl_speed_iuv2').text(val.speed_suc);
           			}else{
           				$('#cxl_speed_iuv2').text('+' + val.speed_suc);
           			};
           			//console.log(val.suc_rate);
           			echartsGauge('echarts_rightTopLine_cxl22',val.isuc_rate);//仪表盘
           			//console.log(val.suc_rate);
           			var valSucRate	=	val.isuc_rate.toFixed(1);
           			$('#echarts_rightTopLine_cxl22_text').text(valSucRate+'%');
           		}
       		}
       	};
       	//活跃用户趋势柱状图
       	var historyIuv	=	data.summary.history_iuv.length > 12 ? data.summary.history_iuv.slice(-12) : data.summary.history_iuv ;
       	echartsBar ('echarts_bar',historyIuv);
		/*console.log(historyIuv);*/
		//2017.9.6  19：50  孙: 右侧的柱状图 折线图  仪表图 需要判断 流量折扣 任我看 查询类 办理类 再填数据
		
		
		
		//折线图 中间下面
    });	
};
 


/**
 * 图片表示文字
 */	
 	
	function imgNumber (dataS,targetId)
	{
		$(targetId).html('');
		for(var i=0; i<dataS.length; i++){
			var $liHtml	=	$('<span></span>');
			var xbar	=	(+dataS[i]*(-55)-575)/1.42125;
			//除以1.263333333是为了缩小背景图，设置background-size为900px 300px 与原图的比例为1.263333333; 原像素尺寸1137*379 px
			//  1.895  size : 600 * 200 
			// 1.42125  size : 800 * 266.666667
			$(targetId).append($liHtml);
			$liHtml.css({'backgroundPosition':xbar+3+'px '+'-5%','background-size':'800px 266.6667px'});
			
		};
		for(var j=dataS.length; j>0; j--)
		{
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
		$(targetId).prepend($('<i class="leftSpan"></i>')).append($('<i class="rightSpan"></i>'));
		if(dataS.length >10){
			$(targetId).width(70+33*dataS.length);	
		};
		//生成文字居中效果样式
		/*$(targetId).css('padding-left',0);//首先重置padding-left
		var $width	=	0;
		for (var i = 0; i<$(targetId).children().length; i++) {
			$width	+=	$($(targetId).children()[i]).width();
		};
		$(targetId).css('padding-left',(($(targetId).width()-$width)/2));*/
		//console.log($(targetId).css('padding-left'));
	};
	
	//在回调函数中执行此函数
	
	
	//折线图 流量折扣
	//echarts_line ('echarts_rightTopLine');
	//折线图 查询类
	//echarts_line ('echarts_rightTopLine_cxl');
	
	



/**
 * 堆叠折线图
 */
function echarts_line1 (thisId,dataTime,data1){
var myChart = echarts.init(document.getElementById(thisId));
	option = {
		backgroundColor:'rgba(0,0,0,0)',
	    color: ['#1e5ae1'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	    	top:'25%',
	        left: '3%',
	        right: '4%',
	        bottom: '2%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : dataTime,
	            axisTick: {
	                alignWithLabel: true
	            },
	            splitLine : {//去掉网格线
					show : false,
				},
				axisLabel : {
					show : true,
					interval:'0',
					textStyle : {
						color : '#c8c8c8',
						fontSize: 12
					}
				},
				
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            name:'(%)',
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
					lineStyle : {
						color : '#c8c8c8',
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
	    series : [
	        {
	            name:'登陆成功率趋势',
	            type:'bar',
	            barWidth: '60%',
	           data:data1
	        }
	    ]
	};
	myChart.setOption(option);
}
/*function echarts_line1 (thisId,dataTime,data1){
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
	    
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    toolbox: {
        show:false,
   		},
	    grid: {
	    	top:'25%',
	        left: '3%',
	        right: '4%',
	        bottom: '2%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	        	
	            type : 'category',
	            boundaryGap : false,
	            data : dataTime,
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
	            name:'(%)',
	            nameGap:10,
	              axisLabel : {
						show : true,
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
							color : '#c8c8c8',
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
	    series : [
	        {
	            name:'登陆成功率趋势',
	            type:'line',
	            stack: '总量',
	            areaStyle: {
	            	normal: {
	            		
	            	}
	            },
	            color:['rgba(14,159,113,0.6)'],//对应上面data的背景色
	            data:data1
	        }
	    ]
	};
	myChart.setOption(option);
}*/

function echarts_line (thisId,dataTime,dataArr){
	var nameS	=	'';
	if(thisId	===	'echarts_rightTopLine_cxl'){
		nameS	=	'累计用数趋势';
	};
	if(thisId	===	'echarts_rightTopLine'){
		nameS	=	'累计办理用户数趋势';
	}
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
	    
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    toolbox: {
        show:false,
   		},
	    grid: {
	    	top:'25%',
	        left: '3%',
	        right: '4%',
	        bottom: '2%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            //data : [1,2,3,4,5,6,7],
	            data : dataTime,
	            axisLabel : {
	                	interval:'0',//强制显示所有刻度 默认为auto即当宽度过小自动间隔隐藏部分刻度名称
						show : true,
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
	            name:'(人)',
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
						lineStyle : {
							color : '#c8c8c8',
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
	    series : [
	        {
	            name:nameS,
	            type:'line',
	            stack: '总量',
	            areaStyle: {normal: {}},
	            color:['rgba(14,159,113,0.6)'],//对应上面data的背景色
	            //data:[12, 13, 14, 15, 16, 17, 18]
	            data:dataArr
	        }
	    ]
	};
	myChart.setOption(option);
}


/**
 * 仪表图 echarts_gauge 
 * @param {Object} thisId
 */
function echartsGauge(thisId,sucRate){

	//sucRate === undefined ? '' : sucRate;
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
            radius: '95%',//整体图的大小
            center: ['50%', '52%'],    //调整位置
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
            data:[{value: sucRate, name: ''}]
        }
    ]
};

	myChart.setOption(option);
}

/**
 * 柱状图
 * @param {Object} thisId
 */
function echartsBar (thisId,dataArr){
	var nameS = '';
	if(thisId === 'echarts_bar'){
		nameS	=	'活跃用户趋势';
	};
	if(thisId === 'echarts_rightTopLine_cxl1'){
		nameS	=	'实时参与用户趋势';
	};
	if(thisId === 'echarts_rightTopLine_cxl11'){
		nameS	=	'实时办理用户趋势';
	};
	
	var myChart = echarts.init(document.getElementById(thisId));
	
	option = {
		/*backgroundColor: 'url("img/HeNan01.png")no-repeat',*/
		backgroundColor:'rgba(0,0,0,0)',
	    color: ['#1e5ae1'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	    	top:'25%',
	        left: '4%',
	        right: '5%',
	        bottom: '4%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : ['-60','-55', '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5'],
	            axisTick: {
	                alignWithLabel: true
	            },
	            splitLine : {//去掉网格线
					show : false,
				},
				axisLabel : {
					show : true,
					interval:'0',
					textStyle : {
						color : '#c8c8c8',
						fontSize: 12
					}
				},
				
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            name:'(人)',
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
					lineStyle : {
						color : '#c8c8c8',
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
	    series : [
	        {
	            name:nameS,
	            type:'bar',
	            barWidth: '60%',
	            /*data:[10, 22, 30, 20, 50, 60, 70, 85, 96, 105, 120, 130]*/
	           data:dataArr
	        }
	    ]
	};
	myChart.setOption(option);
};


/**
 * 地图
 * @param thisId
 * @param data
 * @returns
 */

function echarts_map (thisId,data,thisName,maxValue){
	/*setInterval(function(){},15000)*/
    $.get('map/json/henan.json', function (chinaJson) {
        echarts.registerMap('henan', chinaJson);
        //var COLORS = ["#070093", "#1c3fbf", "#1482e5", "#70b4eb", "#b4e0f3", "#ffffff"];
        var COLORS = ["#00423c", "#008788", "#1e5ae1", "#4f85ff", "#97b5f7", "#a4d6d4"];
       
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
                max: maxValue,
                left: 'left',
                top: 'bottom',
                text: [maxValue,0], // 文本，默认为数值文本
                calculable: false,//是否显示可拖动的句柄
                inRange: {
                	//color:["#070093", "#1c3fbf", "#1482e5", "#70b4eb", "#b4e0f3", "#ffffff"].reverse()
                	color:["#00423c", "#008788", "#1e5ae1", "#4f85ff", "#97b5f7", "#a4d6d4"].reverse()
                	
                	//#0082d2  #00d2aa  #00415a  #00aae1  #00d7e1
                    //color: ['#0082d2','#00d2aa',"#00aae1","#00d7e1"]
                	//color:['rgba(15,220,150,.5)','#03B8BF','#039DA5','#06C6CB','#04C8C9']
                } // 2017.11.8之前版本
            	 /*type: 'piecewise',
                 inverse: true,
                 bottom: 10,
                 left: 10,
                 pieces: [{
                     value: maxValue/6*5, color: COLORS[0]
                 }, {
                     value: maxValue/6*4, color: COLORS[1]
                 }, {
                     value: maxValue/6*3, color: COLORS[2]
                 }, {
                     value: maxValue/6*2, color: COLORS[3]
                 }, {
                     value: maxValue/6, color: COLORS[4]
                 }, {
                     value: 0, color: COLORS[5]
                 }],
                 borderColor: '#ccc',
                 borderWidth: 0,
                 backgroundColor: 'rgba(0,0,0,0)',
                 dimension: 2,
                 inRange: {
                     color: COLORS,
                     opacity: 0.7
                 }*/
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                backgroundColor: 'rgba(220,255,254,.9)',//浮框背景色
                transitionDuration: 0.2,
                formatter: function (params) {//设置提示框内的文字
                    var p = '<h3 style="color:#29667b;text-align:center;font-size:14px;font-weight:bold;line-height:20px;">['+params.name+']</h3>'+
                        '<p style="color:#26677b;font-size:12px;">今日累计用户数：'+formatTmpl(params.data.uv)+'</p>'+
                        '<p style="color:#26677b;font-size:12px;">当前活跃用户数：'+formatTmpl(params.data.iuv)+'</p>'
                    return p;
                }
            },           
            /*formatTmpl(maxValue)*/
            series: [{
                type: 'map',
                map: 'henan',
                roam: false,//标识是否可以缩放和拖动
                aspectScale:1.1,//设置地图的长宽比 数值越大 高度越小 数值越小 宽度越小
                zoom:1.25,//定义当前视角的缩放比
                /*label: {
                    normal: {
                        show: false,//标示是否显示提示文字
                       color:'#fff',
                       fontSize:'200'
                    },
                    emphasis: {
                        show: false,
                        color:'#fff',
                        fontSize:'200'
                    }
                },*/
                itemStyle:{
                	normal:{
                		//#19FFFF #01637E  #03B8BF  #039DA5 #06C6CB  #04C8C9
                		areaColor:'rgba(15,220,150,.5)'
                	}
                },
                data:data
            }]
        });
        console.log(data);
     /* chart.on('mouseover', function (e) {
          $('#echarts_mapTip').hide();
          //e.event.target.style.fill = '#12006a';
      });
      chart.on('mouseout', function (e) {
          $('#echarts_mapTip').show();
      });*/
    });
};
/**
 * 点击折叠展开
 */
clickShowLeft ();
function clickShowLeft ()
{
	//点击显示折叠右侧图表
	$('#content_rightBtn').on('click',function(){
		
		if($('#content_center').css('display') === 'block'){
			$('#button-prev-bottom,#button-next-bottom,#button-prev-top,#button-next-top').hide('1');
			//中间内容隐藏
			$('#content_center').hide('1');	
			$('.leftSpanBtn').attr('class','glyphicon glyphicon-chevron-right leftSpanBtn');
			//left init 归0
			$('#swiper_wrapper>.swiper-wrapper').css('left','0px');
			$('#swiper_wrapper1>.swiper-wrapper').css('left','0px');
			//修改宽度 添加另外两个图标显示第一个图表宽度30%
			$('#content_right').css('width','75%');
			$('#swiper-slide1').css('width','33%');
			$('#swiper-slide11').css('width','33%');
			$('#swiper-slide2').css('width','33%');
			$('#swiper-slide22').css('width','33%');
			$('#swiper-slide3').css('width','33%');
			$('#swiper-slide33').css('width','33%');
		
			$('#nav_ulTabs1,#nav_ulTabs').css('marginTop',0);
			$('.content_right_div1').css('marginBottom','0.6%');
			$('#swiper-slide2').css('margin','0 .5%');
			$('#swiper-slide22').css('margin','0 .5%');
		}else{
			$('#button-prev-bottom,#button-next-bottom,#button-prev-top,#button-next-top').show('1');
			//中间内容显示
			$('#content_center').show('1');
			$('.leftSpanBtn').attr('class','glyphicon glyphicon-chevron-left leftSpanBtn');
			//修改宽度 添加另外两个图标隐藏 第一个图表宽度100%
			$('#content_right').css('width','25%');
			$('#swiper-slide2').css('width','100%');
			$('#swiper-slide22').css('width','100%');
			$('#swiper-slide3').css('width','100%');
			$('#swiper-slide33').css('width','100%');
			$('#swiper-slide1').css('width','100%');
			$('#swiper-slide11').css('width','100%');
			$('#swiper-slide2').css('margin','0');
			$('#swiper-slide22').css('margin','0');
		}
	});
}

/**
 * 左右点击
 * @returns
 */

clickLoop ();
function clickLoop (){
	
	var clickSize	=	0;
	var clickSize1	=	0;
	/*timeLoop ();//按时间显示间隔轮播
*/	$('#button-prev-top').on('click',function(){
		//判断展开时不可点击 非展开时可点击
			leftFun ('#swiper_wrapper');	
	});
	$('#button-next-top').on('click',function(){
			rightFun ('#swiper_wrapper');	
	});
	$('#button-prev-bottom').on('click',function(){
			leftFun1 ('#swiper_wrapper1');	
	});
	$('#button-next-bottom').on('click',function(){
			rightFun1 ('#swiper_wrapper1');	
	});
	
	/**
	 * 左点击
	 * @param wrapperId
	 * @returns
	 */
	function leftFun (wrapperId){
		if($('#content_center').css('display') === 'block'){
			clickSize += 1;
			if(clickSize === 3){
				clickSize = 0;
				$('#nav_ulTabs li').find("a[class='select']").removeClass('select').parent().siblings().find('a').addClass('select');
			};
			var nowLeft	=	-$(wrapperId).width()*clickSize;
			$(wrapperId+'>.swiper-wrapper').css({'left':nowLeft+'px'});
		}
	};
	function leftFun1 (wrapperId){
		if($('#content_center').css('display') === 'block'){
			clickSize1 += 1;
			if(clickSize1 === 3){
				clickSize1 = 0;
				$('#nav_ulTabs1 li').find("a[class='select']").removeClass('select').parent().siblings().find('a').addClass('select');
			};
			//console.log(clickSize1);
			var nowLeft	=	-$(wrapperId).width()*clickSize1;
			$(wrapperId+'>.swiper-wrapper').css('left',nowLeft+'px');
		}
	};
	/**
	 * 右点击
	 * @param wrapperId
	 * @returns
	 */
	function rightFun (wrapperId){
		if($('#content_center').css('display') === 'block'){
			clickSize += -1;
			if(clickSize < 0){
				clickSize = 2;
				$('#nav_ulTabs li').find("a[class='select']").removeClass('select').parent().siblings().find('a').addClass('select');
			};
			var nowLeft	=	-$(wrapperId).width()*clickSize;
			$(wrapperId+'>.swiper-wrapper').css('left',nowLeft+'px');
		}
	};
	function rightFun1 (wrapperId){
		if($('#content_center').css('display') === 'block'){
			clickSize1 += -1;
			if(clickSize1 < 0){
				clickSize1 = 2;
				$('#nav_ulTabs1 li').find("a[class='select']").removeClass('select').parent().siblings().find('a').addClass('select');
			};
			var nowLeft	=	-$(wrapperId).width()*clickSize1;
			$(wrapperId+'>.swiper-wrapper').css('left',nowLeft+'px');
		}
	};
//循环 上面30s下面45s		
	setInterval(function(){
		leftFun ('#swiper_wrapper');
	},30000);
	setInterval(function(){
		leftFun1 ('#swiper_wrapper1');	
	},45000);
};

/**
 * 加千分号
 * @param data
 * @returns
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

