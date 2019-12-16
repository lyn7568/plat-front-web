//纠错反馈
var Html = '';
Html +='<div class="footer_tools">'+
			  	'<a id="scrollUp" href="javascript:;" title="返回顶部"></a>'+
			  	'<a id="feedback" href="javascript:;" title="纠错反馈"></a>'+
			  	'<div class="correctBlock" id="correctBlock">'+
					'<div class="cBacktit">'+
						'<span>纠错反馈</span>'+
						'<em class="closeBack"></em>'+
					'</div>'+
					'<textarea class="frmcontype correctCon" placeholder="请具体说明您发现的问题，以便我们为您快速解决"></textarea>'+
					'<button class="frmcontype btnModel correctSubmit" disabled>提交</button>'+
				'</div>'+
			'</div>'
document.write(Html);
$(function() {
  //回到顶部
	var $body = $(document.body);
	var $bottomTools = $('.footer_tools');
	$(window).scroll(function () {
		var scrollHeight = $(document).height();
		var scrollTop = $(window).scrollTop();
		var $footerHeight = $('footer').outerHeight(true);
		var $windowHeight = $(window).innerHeight();
		scrollTop > 50 ? $("#scrollUp").fadeIn(200).css("display","block") : $("#scrollUp").fadeOut(200);			
		$bottomTools.css("bottom", scrollHeight - scrollTop - $footerHeight > $windowHeight ? 20 : $windowHeight + scrollTop + $footerHeight + 20 - scrollHeight);
	});
	$('#scrollUp').click(function (e) {
		e.preventDefault();
		$('html,body').animate({ scrollTop:0});
	});
	$("#feedback").click(function(){
		$("#correctBlock").fadeToggle();
	})
	$(".closeBack").click(function(){
		$("#correctBlock").fadeOut();
	})
	$("html,body").animate({"scrollTop": "1px"}, 400);
	
	$(".correctBlock").on("keyup",".correctCon",function(){
		var cntCon=$(this).val();
		if(cntCon.length>0){
			$(this).siblings(".correctSubmit").attr("disabled",false);
		}else{
			$(this).siblings(".correctSubmit").attr("disabled",true);
		}
	})
	
})