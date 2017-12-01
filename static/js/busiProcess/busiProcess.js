//选择点击效果函数

$(".xuanze1").click(function(){
	$(this).addClass("xuanze1h").siblings().removeClass("xuanze1h");
})
$(".xuanze2").click(function(){
	$(this).addClass("xuanze2h").siblings().removeClass("xuanze2h");
	
})

$("#zdcx").click(function(){
	sockitIoshang_zdcx (5);
	
})

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
		
		//生成文字居中效果样式
		/*$(targetId).css('padding-left',0);//首先重置padding-left
		var $width	=	0;
		for (var i = 0; i<$(targetId).children().length; i++) {
			$width	+=	$($(targetId).children()[i]).width();
		};
		$(targetId).css('padding-left',(($(targetId).width()-$width)/2));*/
		//console.log($(targetId).css('padding-left'));
	};
	
	
	
	
	
	
	
	
	        
