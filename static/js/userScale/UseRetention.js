			
			/*
			 * 下面为当前月初始化
			 */
			var active_user_number=0;
			var user_number=0;
			var add_user_number=0;
			var active_user_percent=0;
			var user_percent=0;
			var add_user_percent=0;
			/*
			 * 下面为环比上月初始化
			 */
			var active_user_number_comp=0;
			var user_number_comp=0;
			var add_user_number_comp=0;
			var active_user_percent_comp=0;
			var user_percent_comp=0;
			var add_user_percent_comp=0;
$(function (){
	$("#pickEndDate").val(cal_date_e(new Date(),5));
	var date=$("#pickEndDate").val();
	showUserDail(date);
	showUserMonth(date);
	//查询按钮点击
	$("#activeSearch").click(function(){
		var date=$("#pickEndDate").val();
		showUserDail(date);
		showUserMonth(date);
		
	});

	
});
function showUserMonth(date){
	/*
	 * 活跃
	 */
	var activeMonthArr=[];
	var activeBarArr=[];
	var activeLineArr=[];
	/*
	 * 存留
	 */
	var monthArr=[];
	var barArr=[];
	var lineArr=[];
	/*
	 * 新增
	 */
	var addMonthArr=[];
	var addBarArr=[];
	var addLineArr=[];
	$.ajax({
		type: 'post',
		url: '../../userRetent/queryUserRetent.do',
		data:{'date': new Date(date)},
		cache: false,
		async: false,
		success: function(res) {
			if(res.length==0){
				$('#active_chart div').hide();
				$('#active_chart').append("<span class='no_data'>当前选择时间无数据</span>");
				$('#user_chart div').hide();
				$('#user_chart').append("<span class='no_data'>当前选择时间无数据</span>");
				$('#add_chart div').hide();
				$('#add_chart').append("<span class='no_data'>当前选择时间无数据</span>");
			}else{
				$(".no_data").hide();
				$('#active_chart div').show();
				$('#user_chart div').show();
				$('#add_chart div').show();
				for(var i=0;i<res.length;i++){
					switch(res[i].code){
					case '100'://"往月活跃用户留存量"
						activeMonthArr.push(res[i].daytime);
						activeBarArr.push(res[i].values);
						  break;
					case '102'://"往月用户留存量"
						monthArr.push(res[i].daytime);
						barArr.push(res[i].values);
					      break;
					case '104':{//往月新增用户数
						addMonthArr.push(res[i].daytime);
						addBarArr.push(res[i].values);
						  break;
					}
					case '101':{//"往月活跃用户留存率"
						activeLineArr.push((res[i].values).toFixed(2));
						  break;
					}
					case '103':{//"往月用户留存率"
						lineArr.push((res[i].values).toFixed(2));
						  break;
					}
					case '105':{//"往月新增用户留存率"
						addLineArr.push((res[i].values).toFixed(2));
						  break;
					   }
					}
			
				}
				/*
				 * 柱形图+折线
				 */
				echarts_line_column ('active_chart',['活动用户留存量','活动用户留存率'],activeMonthArr,activeBarArr,activeLineArr);
				echarts_line_column ('user_chart',['用户留存量','用户留存率'],monthArr,barArr,lineArr);
				echarts_line_column ('add_chart',['新增用户留存量','新增用户留存率'],addMonthArr,addBarArr,addLineArr);
			}

			
		}
	});
	
}
/**
 * 
 */
function showUserDail(date){
	$.ajax({
		type: 'post',
		url: '../../userRetent/queryUserDatil.do',
		data: {
			'date': new Date(date),
		},
		cache: false,
		async: false,
		success: function(res) {
			console.log(res);
	    if(res.length==0){
	    	active_user_number=0;
	    	active_user_number_comp=0;
	    	user_number=0;
		    user_number_comp=0;
		    add_user_number=0;
			add_user_number_comp=0;
			active_user_percent=0.00;
		    active_user_percent_comp=0.00;
		    user_percent=0.00;
			user_percent_comp=0.00;
			add_user_percent=0.00;
			add_user_percent_comp=0.00;
	    }else{
	    	for(var i=0;i<res.length;i++){
				//暂时先这么写
				switch(res[i].code){	
			case '014'://"往月活跃用户留存量"
				active_user_number=res[i].values;
				active_user_number_comp=res[i].rates;
				  break;
			case '016'://"往月用户留存量"
				user_number=res[i].values;
			    user_number_comp=res[i].rates;
			      break;
			case '018':{//往月新增用户数
				add_user_number=res[i].values;
				add_user_number_comp=res[i].rates;
				  break;
			}
			case '015':{//"往月活跃用户留存率"
				active_user_percent=res[i].values;
			    active_user_percent_comp=res[i].percent;
				  break;
			}
			case '017':{//"往月用户留存率"
				user_percent=res[i].values;
				user_percent_comp=res[i].percent;
				  break;
			}
			case '019':{//"往月新增用户留存率"
				add_user_percent=res[i].values;
				add_user_percent_comp=res[i].percent;
				  break;
			     }
			   }
			}	
	    }			
			
			imgNumber (active_user_number+"",'#active_user');//活跃用户数
			console.log(active_user_number);
			imgNumber (user_number+"",'#user');//留存用户数
			imgNumber (add_user_number+"",'#add_user');//新增用户数
			echartsGauge('active_user_rate',active_user_percent);//表盘 活跃
			echartsGauge('user_rate',user_percent);//表盘 存留
			echartsGauge('add_user_rate',add_user_percent);//表盘 新增	
			/*
			 * 给表盘旁边的数字
			 */
			$("#active_user_rate1").html((active_user_percent).toFixed(2)+"%");
			$("#user_rate1").html((user_percent).toFixed(2)+"%");
			$("#add_user_rate1").html((add_user_percent).toFixed(2)+"%");
			/*
			 * 环比
			 */
			$("#active_user_comp").html(checkNumber((active_user_number_comp))==false ? 'N/A':(active_user_number_comp).toFixed(2) +"%");
			$("#user_comp").html(checkNumber((user_number_comp))==false ? 'N/A':(user_number_comp).toFixed(2)+"%");
			$("#add_user_comp").html(checkNumber(add_user_number_comp)==false ?'N/A':(add_user_number_comp).toFixed(2)+"%");
			$("#active_user_rate_comp").html(checkNumber(active_user_percent_comp)==false ?'N/A':(active_user_percent_comp.toFixed(2))+"%");
			$("#user_rate_comp").html(checkNumber(user_percent_comp)==false ?'N/A':(user_percent_comp).toFixed(2)+"%");
			$("#add_user_rate_comp").html(checkNumber(add_user_percent_comp)==false ?'N/A':(add_user_percent_comp).toFixed(2)+"%");
			
			getRing('active_user_comp',active_user_number_comp);
			getRing('user_comp',user_number_comp);
			getRing('add_user_comp',add_user_number_comp);
			getRing('active_user_rate_comp',active_user_percent_comp);
			getRing('user_rate_comp',user_percent_comp);
			getRing('add_user_rate_comp',add_user_percent_comp);
		}
	});
	
}
/**
 * 判断环比后面的上下箭头
 * @param thisId
 * @param Number
 */
function getRing(thisId,Number){
	if( Number< 0){
		$("#"+thisId).parent().find('.glyphicon').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
	}else if(Number> 0){
		$("#"+thisId).parent().find('.glyphicon').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
	}else{
		$("#"+thisId).parent().find('.glyphicon').removeClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down');
	}
}
/**
 * 判断是否是数字
 * @param theObj
 * @returns {Boolean}
 */
function checkNumber(theObj) {
	  var reg = /^(\-|\+)?\d+(\.\d+)?$/;
	  if (reg.test(theObj)) {
	    return true;
	  }
	  return false;
	}
//针对最后月份 取前一个月份  注意格式 类似201709,无-;
function getPreMonth(date) {
    var year = date.substring(0,4); //获取当前日期的年份
    var month = date.substring(4,6); //获取当前日期的月份
    var lyear = "";
    var lmonth = "";
    if(month=="01"){
    	lyear = parseInt(year) - 1;
    	lmonth = "12";
    }else{
    	lyear = year;
    	lmonth =  parseInt(month) - 1;
    	if((parseInt(month) - 1)<10){
    		lmonth="0"+lmonth;
    	}
    }
    return lyear+lmonth+"";
}