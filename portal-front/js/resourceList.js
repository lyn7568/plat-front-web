$(document).ready(function(){
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('资源')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var resourceId;
	/*资源列表查询*/
	function getRecourceMe(n,isbind,num) {
		var resourceNameVa=$("#resouceName").val();
		var $info={};
		$info.professorId=userid;
		$info.pageSize=10;
		if(resourceNameVa !="") {
			$info.key=resourceNameVa;
		}
		$info.pageNo=n;
		$.ajax({
			"url": "/ajax/resource/pqSelf",
			"type": "GET",
			"success": function(data) {
				console.log(data)
				if(data.success) {
					$("#resourceList").html("");
					if(num==1) {
						if(data.data.data.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("您还未发布任何资源");
							return;
						}else{
							$("#noresource").addClass("displayNone");
						}
					}else{
						if(data.data.data.length==0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("没有符合该搜索条件的内容");
							return;
						}else{
							$("#noresource").addClass("displayNone");
						}
					}
					resourceHtml(data.data.data);
					if(isbind == true) {
						$(".tcdPageCode").createPage({
							pageCount: Math.ceil(data.data.total / data.data.pageSize),
							current: data.data.pageNo,
							backFn: function(p) {
								getRecourceMe(p,false);
							}
						});
					}
				}
			},
			"data": $info,
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	 getRecourceMe(1,true,1);
	 function resourceHtml($data) {
	 	for(var i=0;i<$data.length;i++) {
	 		var imgSrc="../images/default-resource.jpg";
	 		var oTime,pageview="",draftLable="",oHtml,oLi='';
	 		if($data[i].images.length) {
	 			imgSrc="/data/resource/"+$data[i].images[0].imageSrc
	 		}
	 		console.log($data[i].status)
	 		if($data[i].status==0) {
	 			oTime="修改于 "+TimeTr($data[i].modifyTime);
	 			draftLable='<span class="draftLable">草稿</span>';
	 			oHtml="resourceIssue.html";
	 			oLi="class='draftList'"
	 		}else{
	 			oTime="发布于 "+TimeTr($data[i].publishTime);
	 			pageview='<li><span>浏览量 '+$data[i].pageViews+'</span></li>';
	 			oHtml="resourceShow.html"
	 		}
	 	var oStr='<li '+oLi+'>'+
				'<a href="'+oHtml+'?resourceId='+$data[i].resourceId+'" target="_blank">'+
					'<div class="madiaHead resouseHead" style="background-image: url('+imgSrc+');"></div>'	+						
						'<div class="madiaInfo">'+					
							'<p class="h1Font ellipsisSty">'+$data[i].resourceName+'</p>'+						
							'<ul class="showliTop h2Font clearfix">'+
								'<li><span>'+oTime+'</span></li>'+pageview+
							'</ul>'+draftLable+	
						'</div>'+
				'</a>'+
				'<ul class="madiaEdit">'+
					'<li><span class="deteleThis2" data-id="'+$data[i].resourceId+'"></span></li>'+
					'<li><span class="editThis" data-id="'+$data[i].resourceId+'"></span></li>'+
				'</ul>'+
			'</li>'	
			$("#resourceList").append(oStr);
	 	}
	 }
	/*点击修改跳转修改页面*/
	$("#resourceList").on("click",".editThis",function(){
		location.href="resourceIssue.html?resourceId="+$(this).attr("data-id")
	})
	/*点击删除跳转修改页面*/
	$("#resourceList").on("click",".deteleThis2",function(){
		resourceId=$(this).attr("data-id");
		$.MsgBox.Confirm("提示", "确认删除该资源？",deleResource);
	})
	/*删除函数*/
	function deleResource() {
			$.ajax({
					"url": "/ajax/resource/delete",
					"type": "POST",
					"success": function(data) {
						if(data.success) {	
							getRecourceMe(1,false);
						}
					},
					"data": {"resourceId":resourceId},
					"beforeSend": function() {  },
					"contentType": "application/x-www-form-urlencoded",
					dataType: "json"
				});
	}
	/*输入资源名称限制字数*/
	$("#resouceName").bind({
		keyup: function() {
			if($(this).val().length > 30) {
				$(this).val($(this).val().substr(0, 30));
			}
		}
	});
	/*点击搜索*/
	$(".searchSpan").click(function(){
		$(".tcdPageCode").remove();
		$(".aboutRes").append('<div class="tcdPageCode"></div>');
		getRecourceMe(1,true);
	})
})
