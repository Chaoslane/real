//初始化用户规模/累积、活跃用户情况 
$(function (){	
	var date = new Date();
	//$("#pickStartDate").val(cal_date_s(date,7));
	$("#pickEndDate").val(cal_date_e(date,1));
	//屏幕分辨率为1600跟1920时，一屏显示（下面的内容自适应）
	var width_win = $(window).outerWidth();
	if(width_win >1500){
		var height_win = $(window).outerHeight();
		$('#content').height(height_win - $('#header').outerHeight() - $('#currentLocation').outerHeight() - 10);
		$('.content_bottom').height($('#content').outerHeight() - $('.content_top').outerHeight() -16);
		$('.content_bottom_bg').height($('.content_bottom').height() - 40);
		$('#new_old_user div').height($('.content_bottom_bg').height());
		if(width_win >1892){
			$('#new_old_img img').css({'width':'70px'});
			$('#new_old_img').css({'margin-top':"-35px",'margin-left':"-40px"});
		}
	}else{
		$('.content_bottom_bg').height(194);
	}
	var indexnameArr = ["'"+$('.index_name').eq(1).attr('code')+"'","'"+$('.index_name').eq(2).attr('code')+"'","'"+$('.index_name').eq(3).attr('code')+"'"];	
	var indexname=indexnameArr.join(",");
	var hoursName = $('#hoursName').html();
	var indexName=$('.index_part.active .index_name').attr('code');
	//var sdate = $("#pickStartDate").val()
	var edate = $("#pickEndDate").val();
	getSundataFun(edate,edate,indexname);
	listHours();
	listAppVersion();
	getlines(edate,edate,indexName);//折线图
	//累积、活跃用户情况左边指标点击右边跟的变
	$('#index_list').on('click','.index_part',function (){
		$('#index_list .index_part').removeClass('active');
		$(this).addClass('active');
		var indexName = $(this).find('.index_name').attr('code');
		$('#index_name_content').html($(this).find('.index_name').html() + '趋势图');
		//var sdate = $("#pickStartDate").val();
		var edate = $("#pickEndDate").val();
		getlines(edate,edate,indexName);
	});
	//查询
	$('#activeSearch').click(function (){
		var indexnameArr = ["'"+$('.index_name').eq(1).attr('code')+"'","'"+$('.index_name').eq(2).attr('code')+"'","'"+$('.index_name').eq(3).attr('code')+"'"];	
		var indexname=indexnameArr.join(",");
		var indexName=$('.index_part.active .index_name').attr('code');
		//var sdate = $("#pickStartDate").val();
		var edate = $("#pickEndDate").val();
		getSundataFun(edate,edate,indexname);
		listHours();
		listAppVersion();
		getlines(edate,edate,indexName);//折线图
	});
});

function getlines(sdate,edate,indexname){// line  indexname seleted 
	$.ajax({
		type:'post',
		url:'../../activeUser/getLines.do',
		data:{
			sdate: sdate,
			edate: edate,
			indexname:indexname
		},
		success:function(result){
			var datas=[]; var daytime=[];
			if($('#index_trends div')){
				$('#index_trends div').hide();
			}
			if($('#index_trends').parent().find('.no_data')){
				$('#index_trends').parent().find('.no_data').remove();
			}
			if(result!=''&& result!=null){
				$('#index_trends div').show();
				$.each(result,function(i,item){
					datas.push(item.indexvalue);
					daytime.push(item.daytime);
				});
				echarts_lines ('index_trends',datas,daytime,$('.index_part.active .index_name').html());								
			}else{
				$('#index_trends').parent().append("<span class='no_data'>当前选择时间段无数据</span>");
			}
		},
		error:function(result){
		}
	})
	
}

function listHours(){//分小时访客数
	if($('#hourse_active_user div')){
		$('#hourse_active_user div').hide();
	}
	if($('#hourse_active_user').parent().find('.no_data')){
		$('#hourse_active_user').parent().find('.no_data').remove();
	}
	$.ajax({
		type:'post',
		url:'../../activeUser/listHours.do',
		data:{
			sdate: $("#pickEndDate").val(),
			edate : $("#pickEndDate").val(),
			indexname:$('#hoursName').attr("code"),
		},
		success:function(result){			
			var dataName=[];var dataNumber=[];
			if(result!=''&&result!=null){
				$('#hourse_active_user div').show();
				$.each(result,function(i,item){
					dataName.push(item.subcode);
					dataNumber.push(item.indexvalue);
				});
				echartsColumn('hourse_active_user',dataName,dataNumber);
			}else{
				$("#hourse_active_user").append("<span class='no_data'>当前选择时间段无数据</span>");
			}
		},
		error:function(result){
		}
	})
}
function listAppVersion(){//分APP版本访客数
	if($('#edition_use_visitor div')){
		$('#edition_use_visitor div').hide();
	}
	if($('#edition_use_visitor').parent().find('.no_data')){
		$('#edition_use_visitor').parent().find('.no_data').remove();
	}
	$.ajax({
		type:'post',
		url:'../../activeUser/listAppVersion.do',
		data:{
			sdate: $("#pickEndDate").val(),
			edate : $("#pickEndDate").val(),
			indexname:$('#appName').attr("code"),
		},
		success:function(result){
			$('#edition_use_visitor div').show();
			var dataName=[];var dataNumber=[];
			if(result!=''&&result!=null){
				$.each(result,function(i,item){
					dataName.push(item.subcode);
					dataNumber.push(item.indexvalue);
				});
				echartsTransverse('edition_use_visitor',dataName,dataNumber);
			}else{
				$("#edition_use_visitor").append("<span class='no_data'>当前选择时间段无数据</span>");
			}
			
		},
		error:function(result){
		}
	})
}


function getSundataFun(sdate,edate,indexname){
	$.ajax({
		type:'post',		
		url:'../../activeUser/getListData.do',
		data:{
			sdate: sdate,
			edate: edate,
			indexname:indexname,
		},
		success:function(result){
			if(indexname !='' && indexname != null){
				if($('#new_old_user div')){
					$('#new_old_user div').hide();
				}
				if($('#new_old_user').parent().find('.no_data')){
					$('#new_old_user').parent().find('.no_data').remove();
				}
				if(result!=''&& result !=null){
					$('#new_old_user div').show();
					$('#new_old_img').show();
					if(result.success){
						echartsGauge('login_success',result.success);// 登录成功率 仪表图 
						$("#success_id").html(result.success+'%');
					}else{
						echartsGauge('login_success',0.00);// 登录成功率 仪表图 
						$("#success_id").html('0.00%');
					}
					if(result.success_ratio){
						$("#success_ratio").html(result.success_ratio+"%");
						if(Number(result.success_ratio) < 0){
							$("#success_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down')
						}else if(Number(result.success_ratio) > 0){
							$("#success_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
						}else{
							$("#success_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down')
						}
					}else{
						$("#success_ratio").html(0+"%");
					}					
					var dataNumber = [{value:result.newuser,name:'新增用户'},{value:result.olduser,name :'老用户'}];
					var dataName = ['新增用户','老用户'];
					if(result.newuser){
						pieChart('new_old_user',dataName,dataNumber,true);////新老用户环形图
					}else{
						$('#new_old_user').parent().append("<span class='no_data'>当前选择时间段无数据</span>");
						$('#new_old_img').hide();
						$('#new_old_user div').css({'display':'none'});
					}
					
					if(result.median){
						imgNumber (result.median,'#average_time');//APP平均使用时长中位数
					}else{
						imgNumber ('0','#average_time');//APP平均使用时长中位数
					}
					if(result.median_ratio){
						$("#app_ratio").html(result.median_ratio+"%");
						if(Number(result.median_ratio) < 0){
							$("#app_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down')
						}else if(Number(result.median_ratio) > 0){
							$("#app_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
						}else{
							$("#app_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down')
						}
					}else{
						$("#app_ratio").html(0+"%");
					}				
					var total_value='0' ;var total_ratio='0%';
					if(result.total_value!==''&&result.total_value!==null){
						var total_value=result.total_value;
					}
					if(result.total_ratio!==''&& result.total_ratio!==null){
						total_ratio=result.total_ratio;
					}
					if(total_value){
						imgNumber (total_value,'#cumulative_user');//累计用户数
					}else{
						imgNumber ('0','#cumulative_user');//累计用户数
					}
					
					if(Number(total_ratio) < 0){
						$("#sumuser_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
					}else if(Number(total_ratio) > 0){
						$("#sumuser_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
					}else{
						$("#sumuser_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down')
					}
					
					$("#sumuser_ratio").html(total_ratio);
				}else{
					imgNumber ('0','#cumulative_user');//累计用户数
					imgNumber ('0','#active_user');//活跃用户数
					imgNumber ('0','#activate_user');//激活用户数
					imgNumber ('0','#add_user');//新增用户数
					imgNumber ('0','#average_time');//APP平均使用时长中位数					
				}
				
			}
			if(result.sumAll !=='' &&result.sumAll != null){
				var dataName_app=[];var dataNumber_app=[];
				$.each(result.sumAll,function(i,item){				
					switch(item.code){
					case '002':
						imgNumber (item.indexvalue,'#active_user');//活跃用户数
						
						if(Number(item.link_ratio) < 0){
							$("#active_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
						}else if(Number(item.link_ratio) > 0){
							$("#active_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
						}else{
							$("#active_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down')
						}


						$("#active_ratio").html(item.link_ratio+"%");
						break;
					case '003':
						imgNumber (item.indexvalue,'#activate_user');//激活用户数
						if(Number(item.link_ratio) < 0){
							$("#activate_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
						}else if(Number(item.link_ratio) > 0){
							$("#activate_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');	
						}else{
							$("#activate_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down');
						}
						$("#activate_ratio").html(item.link_ratio+"%");
						break;
					case '004':
						imgNumber (item.indexvalue,'#add_user');//新增用户数
						if(Number(item.link_ratio) < 0){
							$("#add_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
						}else if(Number(item.link_ratio) > 0){
							$("#add_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');							
						}else{
							$("#add_ratio").parent().find('.glyphicon').removeClass('glyphicon-arrow-up').removeClass('glyphicon-arrow-down')
						}
						$("#add_ratio").html(item.link_ratio+"%");
						break;
					}
				})
			}
		},
		error:function(result){
			
		}
	})
}

