$(function() {
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('团队')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	
$(".createTeam").on("click",function(){
	$(".questionCover").fadeIn();
	$("body").css("position", "fixed");
})
$("#workclose,#btnCancel").on("click",function(){
	$(".questionCover").fadeOut();
	$("body").css("position", "");
})
$('.worksamlltit').on('click',function(){
	$('.worksamlltit').removeClass('worksamlltitnow')
	$(this).addClass('worksamlltitnow')
	var st = $(this).attr("data-status")
	articalList(10, 1, true, st);
})

var imgStr=[];
var uploader =new WebUploader.create({
	auto: true,
	fileNumLimit: 2,
	swf: '../js/webuploader/Uploader.swf',
	server: '../ajax/team/upload',
	fileSingleSizeLimit: 2 * 1024 * 1024,
	pick: {
		id: "#filePicker",
		multiple: false
	},
	accept: {
		title: 'Images',
		extensions: 'jpg,jpeg,png',
		mimeTypes: 'image/jpg,image/jpeg,image/png'
	}

});

// 当有文件添加进来的时候
uploader.on('fileQueued', function(file) {
	fileId = file.id;
	var $len = $("#fileList").find("img").length;
	if($len == 0 || $len == 1) {
		var oRemove = $("#fileList").find("dd");
		oRemove.eq(oRemove.length - 1).remove();
	} 
	var $li = $(
			'<dd>' +
				'<div class="imgItem" id="' + file.id + '">'+
					'<img />' +
				'</div>'+
			'</dd>'
		),
		$btns = $('<div class="file-panel">' +
			'<span class="cancel"></span>' +
			'</div>').appendTo($li),
		$img = $li.find('img');
	var $list = $("#fileList");
	if($len == 1) {
		$list.find("dd").eq(0).after($li)
	} else if($len == 2) {
		$list.find("dd").eq(1).after($li)
	} else {
		$list.prepend($li);
	}

	// 创建缩略图
	// 如果为非图片文件，可以不用调用此方法。
	// thumbnailWidth x thumbnailHeight 为 100 x 100
	uploader.makeThumb(file, function(error, src) {
		if(error) {
			$img.replaceWith('<span>不能预览</span>');
			return;
		}
		$img.attr('src', src);
	}, 1, 1);
});
uploader.onError = function(code) {
	if(code=="F_EXCEED_SIZE"){
		$.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过2M')	
	}
};
uploader.on('uploadSuccess', function(file, data) {
	if(data.success) {
			uploader.removeFile(fileId);
			//console.log(data)
			imgStr.push(data.data[0].uri);
			$("#fileList").parents(".postUl").find(".frmconmsg").hide()
			
	}else{
		$.MsgBox.Alert('提示', '只支持jpeg/jpg/png格式的图片');
	}
});
/*删除图片*/
$("#fileList").on("click", ".cancel", function() {
	var flag=$(this).attr("flag");
	var oNum=$(this).parents("dd").index();
	if(flag==1) {
		array.splice(oNum,1);
	}else{
		imgStr.splice(oNum,1);
	}
	$(this).parent().parent().remove();
	
	var $len = $("#fileList").find("img").length;
	if($len != 2) {
		$("#fileList").append("<dd></dd>")
	}
});

$("#teamName,#teamOrgName").bind({
	focus: function() {
		$(this).parents(".postUl").find(".frmconmsg").show();
	},
	blur: function() {
		$(this).parents(".postUl").find(".frmconmsg").hide();
	}
})
function test() {
	var teamName=$("#teamName").val();
	var teamOrgName=$("#teamOrgName").val();
	
	if (teamName.length === 0) {
		$("#teamName").parents(".postUl").find(".frmconmsg").show().text("请填写团队名称");
		$("#teamName").parents(".postUl").find(".frmcontype").css("border-color","#e03b43");
		return;
	}
	if(teamName.length>50) {
		$("#teamName").parents(".postUl").find(".frmconmsg").show().text("不可超过50个字");
		$("#teamName").parents(".postUl").find(".frmcontype").css("border-color","#e03b43");
		return;
	}
	if (teamOrgName.length === 0) {
		$("#teamOrgName").parents(".postUl").find(".frmconmsg").text("请填写团队所属机构");
		$("#teamOrgName").parent().css("border-color","#e03b43");
		return;
	}
	if(teamOrgName.length>50) {
		$("#teamOrgName").parents(".postUl").find(".frmconmsg").text("不可超过50个字");
		$("#teamOrgName").parent().css("border-color","#e03b43");
		return;
	}
	if($("#oprovince").text() == "请选择省/直辖市") {
		$("#Province").parents(".postUl").find(".frmconmsg").text("请选择省/直辖市");
		$("#Province").parent().css("border-color","#e03b43");
		return;
	}
	if($("#ocity").text() == "请选择城市") {
		$("#City").parents(".postUl").find(".frmconmsg").text("请选择城市");
		$("#City").parent().css("border-color","#e03b43");
		return;
	}
	if(imgStr.length === 0) {
		$("#fileList").parents(".postUl").find(".frmconmsg").show().text("至少上传一张团队材料");
		$("#fileList").parent().css("border-color","#e03b43");
		return;
	}
	return 1;
}
//发布
$("#pubSte").on("click",function(){
	test()
	if (!test()) {
		return
	}
	var teamName=$("#teamName").val();
	var teamOrgName=$("#teamOrgName").val();
	var teamProvince=$("#oprovince").text();
	var teamCity=$("#ocity").text();
	
	var dataSt={
			name: teamName,
			orgName: teamOrgName,
			province: teamProvince,
			city: teamCity,
			certify: imgStr.join(","),
			secretary: userid
		}
	$.ajax({
		url:'/ajax/team/apply', 
		data: dataSt,
		dataType: 'json',
		traditional: true,
		type: 'POST', 
		success: function(data) {
			if(data.success) {
				$(".questionCover").fadeOut();
				$("body").css("position", "");
				var $len = $("#fileList").find("img").length;
				for(var i=0;i<$len;i++) {
					$("#fileList").find(".imgItem").parent().remove()
					$("#fileList").append("<dd></dd>")
				}
				$(".queStep").find("input").val("")
				$.MsgBox.Alert("提示","创建团队的申请已经发送，请耐心等待审核结果");
				$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
				$('.worksamlltit').removeClass('worksamlltitnow')
				$('.worksamlltit:nth-child(2)').addClass('worksamlltitnow')
				articalList(10, 1, true, 1);
			}
		}
	});
	
})


	articalList(10, 1, true, 3);

	//退出
	$("#articalList").on("click", ".closeThis", function() {
		var _this = this;
		$.MsgBox.Confirm("提示", "确认退出该团队？", function() {
			newsDelet(_this);
		})
	})
	//管理
	$("#articalList").on("click", ".delayThis", function() {
		var dId = $(this).parents(".newbox").attr("data-id");
		location.href="teamManage.html?id="+dId
	})

});

function articalList(pageSize, pageNo, isbind, status) {
	var $data = {};
	$data.professor = userid;
	$data.status = status;
	$data.pageSize = pageSize;
	$data.pageNo = pageNo;
	$.ajax({
		"url": "/ajax/team/myTeam",
		"type": "get",
		"async": false,
		"data": $data,
		"beforeSend": function() {
			$("#articalList").append('<img src="../images/loading.gif" class="loading"  />');
		},
		"success": function(data) {
			if(data.success && data.data.data != "") {
				var itemlist = '';
				$("#articalList").html("");
				$("#noartical").addClass("displayNone");
				$(".tcdPageCode").css("display", "block");
				for(var i = 0; i < data.data.data.length; i++) {
					var li = '<li class="newbox draftList"><a class="newurl">', li2 = '', li3 = '',li4 = ''
					if(data.data.data[i].status == 3) {
						li = '<li class="newbox"><a href="teamInfoShow.html?id='+data.data.data[i].id+'" target="_blank" class="newurl">';
						li3 = ' <small> 团队人数 <span class="teamCount"></span>人</small>'
						if (userid ===  data.data.data[i].secretary) {
							li4 += '<li><span class="delayThis">管理团队</span></li>';
						} else {
							li4 += '<li><span class="closeThis">退出团队</span></li>';
						}
					} else if(data.data.data[i].status == 1) {
						li2 = '<li><span style="color:#ec801a">待审核</span></li>';
					} else if(data.data.data[i].status == 2) {
						li2 = '<li><span style="color:#e20000">未通过</span></li>';
					}
					var itemlist = li;
					itemlist += '<div class="madiaInfo">';
					itemlist += '<p class="h1Font ellipsisSty">'+ data.data.data[i].name; 
					itemlist += li3 + '</p>'; 
					itemlist += '<ul class="showliTop h2Font clearfix">'
					itemlist += '<li><span>'+ data.data.data[i].city +'</span></li>'
					itemlist += '<li><span>'+ data.data.data[i].orgName +'</span></li>'
					itemlist += li2+'</ul>';
					itemlist += '</div></a>';
					itemlist += '<ul class="madiaEdit">'
					itemlist += li4;
					itemlist += '</ul></li>';
					$itemlist = $(itemlist);
					$("#articalList").append($itemlist);
					var datalist = data.data.data[i];
					$itemlist.attr("data-id", datalist.id);
					$itemlist.find("#arttitle").text(datalist.name);
					teamProCount(data.data.data[i].id, $itemlist)
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
				$(".noContip").text("暂无专家团队");
				$(".tcdPageCode").css("display", "none");
			}
			$(".loading").remove();
		},
		"error": function() {
			$.MsgBox.Alert('提示', '链接服务器超时')
		}
	});
}


/*退出*/
function newsDelet(_this) {
	var dId = $(_this).parents(".newbox").attr("data-id");
	$.ajax({
		"url": "/ajax/team/quit",
		"type": "POST",
		"dataType": "json",
		"data": {
			"id": dId,
			"professor": userid
		},
		"success": function($data) {
			if($data.success) {
				articalList(10, 1, true, 1);
			}
		}
	})
}

function teamProCount(id, $list) {
	$.ajax({
		"url": "/ajax/team/pro/count",
		"type": "GET",
		"dataType": "json",
		"data": {
			"id": id
		},
		"success": function($data) {
			if($data.success) {
				$list.find('.teamCount').text($data.data)
			}
		}
	})
}