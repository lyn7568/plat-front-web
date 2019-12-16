$(document).ready(function(){
	//处理点击事件，需要打开原生浏览器
	$("body").on("click","a.advertsub",function(){
		var adId = this.getAttribute('data-id');
		console.log(adId)
		wlog("ad", adId ,"3");
		return true;	
	})
})

/*控制提示框样式*/
function bombox(textt) {
	$(".bomb-box").fadeIn("slow");
	$(".bomb-box").text(textt);
	var bombwidth = $(".bomb-box").width();
	$(".bomb-box").css({
		"marginLeft": -(bombwidth + 25) / 2 + "px"
	});
	setTimeout(function() {
		$(".bomb-box").fadeOut("slow");
	}, 4000);
}