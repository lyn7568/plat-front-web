/*文章个人列表*/
$(function() {
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('文章')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	var  falseno = false;
	articalList(10, 1, true, 1);
	$("#articleSearch").on("keyup", function() {
		var inputval = $(this).val();
		var inputlen = inputval.replace(/[^\u0000-\u00ff]/g, "aa").length;
		if(inputlen > 60) {
			var value = inputval.substring(0, 60);
			$(this).val(value);
		}

	})

	//删除新闻
	$("#articalList").on("click", ".deteleThis2", function() {
		var _this = this;
		$.MsgBox.Confirm("提示", "确认删除该文章？", function() {
			newsDelet(_this);
		})
	})

	//文章搜索
	$(".searchSpan").on("click", function() {
		articalList(10, 1, true, 2);
	})
});

function articalList(pageSize, pageNo, isbind, num) {
	var $data = {};
	if(num == 1) {
		$data.ownerId = userid;
        $data.articleType = "1";
		$data.pageSize = pageSize;
		$data.pageNo = pageNo;
	} else {
		$data.ownerId = userid;
        $data.articleType = "1";
		$data.pageSize = pageSize;
		$data.pageNo = pageNo;
		$data.articleTitle = $("#articleSearch").val();
	}
	$.ajax({
		"url": "/ajax/article/pqself",
		"type": "get",
		"async": false,
		"data": $data,
		"beforeSend": function() {
			$("#articalList").append('<img src="../images/loading.gif" class="loading"  />');
		},
		"success": function(data) {
			console.log(data);
			if(data.success && data.data.data != "") {
				var itemlist = '';
				$("#articalList").html("");
				$("#noartical").addClass("displayNone");
				$(".tcdPageCode").css("display", "block");
				for(var i = 0; i < data.data.data.length; i++) {
					if(data.data.data[i].status == 1) {
						var li = '<li class="newbox"><a href="" target="_blank" class="newurl">';
						var li2 = '<ul class="showliTop h2Font clearfix"><li><span class="time"></span></li><li><span id="pageViews"></span></li><li><span id="articleAgree"></span></li><li><span class="leaveMsgCount"></span></li></ul>';
						var li3 = '';
						var li4 = '';
					} else if(data.data.data[i].status == 0) {
						var li = '<li class="newbox draftList"><a href="" target="_blank" class="newurl">';
						var li2 = '<ul class="showliTop h2Font clearfix"><li><span class="time"></span></li></ul>';
						var li3 = '<span class="draftLable">草稿</span>';
						var li4 = '<li><a class="editThis" target="_blank"></a></li>';
					} else if(data.data.data[i].status == 2) {
						var li = '<li class="newbox draftList"><a href="" class="newurl">';
						var li2 = '<ul class="showliTop h2Font clearfix"><li><span class="time"></span></li></ul>';
						var li3 = '<span class="draftLable" id="dsfbtime"></span>';
						var li4 = '<li><a class="editThis" target="_blank"></a></li>';
					}
					var itemlist = li;
					itemlist += '<div class="madiaHead artHead" id="artimg"></div>';
					itemlist += '<div class="madiaInfo">';
					itemlist += '<p class="h1Font ellipsisSty" id="arttitle"></p>';
					itemlist += li2;
					itemlist += li3;
					itemlist += '</div></a>';
					itemlist += '<ul class="madiaEdit"><li><span class="deteleThis2"></span></li>';
					itemlist += li4;
					itemlist += '</ul></li>';
					$itemlist = $(itemlist);
					$("#articalList").append($itemlist);
					var datalist = data.data.data[i];
					$itemlist.attr("data-id", datalist.articleId);
					$itemlist.find("#arttitle").text(datalist.articleTitle);
					if(datalist.articleAgree>0){
						$itemlist.find("#articleAgree").text("赞 " + datalist.articleAgree);
					}
					if(datalist.pageViews>0){
						$itemlist.find("#pageViews").text("阅读量 " + datalist.pageViews);
					}
					leaveMsgCount(datalist.articleId,1,$itemlist);
					if(datalist.articleImg) {
						$itemlist.find("#artimg").attr("style", "background-image: url(/data/article/" + datalist.articleImg + ");");
					}
					if(datalist.status == 1) {//发布
						$itemlist.find(".time").text("发布于 "+TimeTr(datalist.publishTime));
						$itemlist.find(".newurl").attr("href", "articalShow.html?articleId=" + datalist.articleId);
					}
					if(datalist.status == 0){//草稿
						$itemlist.find(".time").text("修改于 "+TimeTr(datalist.modifyTime));
						$itemlist.find(".newurl").attr("href", "articalModify.html?articleId=" + datalist.articleId);
						$itemlist.find(".editThis").attr("href", "articalModify.html?articleId=" + datalist.articleId);
					}
					if(datalist.status == 2){//定时发布
						$itemlist.find(".time").text("修改于 "+TimeTr(datalist.modifyTime));
						$itemlist.find("#dsfbtime").text("草稿 | 将于" +TimeTr(datalist.publishTime)+ "定时发布");
						$itemlist.find(".editThis,.newurl").on("click",function(){
							var newarticleId = $(this).parents(".newbox").attr("data-id");
							$.ajax({
								"url": "/ajax/article/updateDraft",
								"type": "POST",
								"dataType": "json",
								"async": false,
								"data": {
									"articleId": newarticleId
								},
								"success": function(data) {
									if(data.success) {
										falseno = true;
									}
									if(falseno) {
										window.open("articalModify.html?articleId=" +newarticleId)
									}
								},
								"error": function() {
									$.MsgBox.Alert('提示', '链接服务器超时')
								}
							});
						})
					}
				}
				//分页
				if(isbind == true) {
					$(".tcdPageCode").createPage({
						pageCount: Math.ceil(data.data.total / 10),
						current: data.data.pageNo,
						backFn: function(p) {
							$("#articalList").html("");
							articalList(10, p, false, 1);
							document.body.scrollTop = document.documentElement.scrollTop = 0;
						}
					});
				}

			} else {
				$("#articalList").html("");
				$("#noartical").removeClass("displayNone");
				if(num==1){
					$(".noContip").text("您还未发布任何文章");
				}else{
					$(".noContip").text("没有符合该搜索条件的内容");
				}
				$(".tcdPageCode").css("display", "none");
			}
			$(".loading").remove();
		},
		"error": function() {
			$.MsgBox.Alert('提示', '链接服务器超时')
		}
	});
}


/*文章删除*/
function newsDelet(_this) {
	var delarticleId = $(_this).parents(".newbox").attr("data-id");
	$.ajax({
		"url": "/ajax/article/deleteArticle",
		"type": "POST",
		"dataType": "json",
		"data": {
			"articleId": delarticleId
		},
		"success": function($data) {
			if($data.success) {
				articalList(10, 1, true, 1);
			}
		},
		"error": function() {
			$.MsgBox.Alert('提示', '链接服务器超时')
		}
	})
}