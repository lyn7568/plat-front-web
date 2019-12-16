$(document).ready(function() {
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('需求')").addClass("nowLi");
	loginStatus();//判断个人是否登录
	valUser();
	
	demandList(true,5, 1);
	/*点击搜索*/
	$(".searchSpan").click(function(){
		$(".tcdPageCode").remove();
		$(".aboutRes").append('<div class="tcdPageCode"></div>');
		demandList(true,5,1);
	})
	/*需求列表*/
	function demandList(isbind, pageSize, pageNo) {
		$.ajax({
			url: "/ajax/demand/search",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			traditional:true,
			data: {
				"state":[1],
				"key":$("#needKey").val(),
				"pageNo": pageNo,
				"pageSize":pageSize
			},
			beforeSend: function() {
				$("#demandList").append('<img src="../images/loading.gif" class="loading" />');
			},
			success: function(data) {
				if(data.success) {
					$("#demandList").html(" ");
					var $info = data.data.data;
					console.log(data)
					if($info.length > 0){
						for(var i = 0; i < $info.length; i++) {
							var liStr=$("<li></li>").appendTo("#demandList");
							demandHtml($info[i],liStr);
						}
						if(isbind == true) {
							$(".tcdPageCode").createPage({
								pageCount: Math.ceil(data.data.total / pageSize),
								current: data.data.data.pageNo,
								backFn: function(p) {
									demandList(false,5, p);
								}
							});
						}
					}else{
						$("#demandList").parent().find(".nodatabox").removeClass("displayNone")
					}
				}
				$(".loading").remove();
			},
			error: function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		})
	}
	function demandHtml($data,liStr) {
		var sowU="";
		if($data.pageViews!=0){
			sowU='<li><span>浏览量 '+$data.pageViews +'</span></li>'
		}
		var strCon='';
			strCon+='<a class="" target="_blank" href="demandShow.html?demandId='+$data.id+'" class="madiaInfo">'
			strCon+='<p class="h1Font ellipsisSty">'+ $data.title +'</p>'
			strCon+='<ul class="showliTop h3Font clearfix">'
			strCon+='<li><span class="cmpName">'+ $data.orgName +'</span></li><li><span>发布于 '+TimeTr($data.createTime)+'</span></li>'
			strCon+= sowU
			strCon+='</ul>'
			strCon+='<p class="h2Font ellipsisSty-2">'+$data.descp+'</p>'
			strCon+='<ul class="showli clearfix h3Font">'
			
			if($data.city){ strCon+='<li>所在城市：'+$data.city+'</li>' }
			if($data.duration!=0){ strCon+='<li>预计周期：'+demandDuration[$data.duration]+'</li>' }
			if($data.cost!=0){ strCon+='<li>费用预算：'+demandCost[$data.cost]+'</li>' }
			if($data.invalidDay){ strCon+='<li>有效期至：'+TimeTr($data.invalidDay)+'</li>' }
			
			strCon+='</ul>'
			strCon+='</a>'
		$(strCon).appendTo(liStr);	
	}
});