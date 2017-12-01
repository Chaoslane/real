/**
 * 钻取页面的
 */
$(function(){
	var name=decodeURI(getParam('name'));
	var date=getParam('date');
	//业务区分档次办理流程数据
	$("#ywmc").text(name+"区分档次办理流程数据");
	showTable(name,date);
	$("#pickDate").hide();
	$(".glyphicon").hide();
	
});
/**
 * 整体的表格
 * @param name
 * @param date
 */
function showTable(name,date){
	$.ajaxSetup({   
        async : false  
    }); 
	
	$.post('../../overRall/getTable.do',{'name':name,'date':date}, function(result, resultState) {
		if (resultState == "success") {
			var resultJson = eval(result);
			$.each(resultJson, function(i, item) {
				console.log(resultJson);
			if(i==0){//遍历一级列表
				$(".tr2").append('<td><div id="jiajian">+</div>'+item.name+'</td>'+
						'<td>'+formatTmpl(item.vis)+'</td>'+
						'<td>'+formatTmpl(item.suc)+'</td> '+
						'<td>'+formatTmpl(item.los)+'</td>'+
						'<td>'+item.cvr.toFixed(2)+'%</td>'+
						'<td>'+item.rates.toFixed(2)+'%</td>');
		}else{
			var result;
			 if(i%2!=0){//遍历二级列表，俩个判断区分背景颜色
			    result= '<tr class="jishu"><td>'+item.name+'</td>'+
				'<td>'+formatTmpl(item.vis)+'</td>'+
				'<td>'+formatTmpl(item.suc)+'</td> '+
				'<td>'+formatTmpl(item.los)+'</td>'+
				'<td>'+item.cvr.toFixed(2)+'%</td>'+
				'<td>'+item.rates.toFixed(2)+'%</td></tr>';
			 }else{
				  result= '<tr class="oushu"><td>'+item.name+'</td>'+
					'<td>'+formatTmpl(item.vis)+'</td>'+
					'<td>'+formatTmpl(item.suc)+'</td> '+
					'<td>'+formatTmpl(item.los)+'</td>'+
					'<td>'+item.cvr.toFixed(2)+'%</td>'+
					'<td>'+item.rates.toFixed(2)+'%</td></tr>';
			 }
			$("#tbody").append(result);
			$("#tbody tbody").hide();
			
		    }
		});
			
		
		}
	});	
	
}
$("#fanhuibtn").click(function(){
	window.location.href="overall.html?date="+getParam('date');
});



/*$("#jiajian").click(function(){
	   if($("#show").css("display")=="none"){
	        $("#show").slideDown();
	        $("#jiajian").text("－");
	    }else{
	   $("#show").slideUp();
	   $("#jiajian").text("&nbsp;+&nbsp;");
	}
	});*/
$(".tr2").on('click','#jiajian',function(){
	if($('#jiajian').html() == '+'){
		$("#tbody tbody").show();
		$('#jiajian').html('-');
	}else{
		$("#tbody tbody").hide();
		$('#jiajian').html('+');
	}
	
});



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
