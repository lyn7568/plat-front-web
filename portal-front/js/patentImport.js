$(document).ready(function() {
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('成果')").addClass("nowLi");
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	console.log(userid)
	var userName = $.cookie("userName");
	/*资源列表查询*/
	function getRecourceMe(n, isbind, num) {
		var resourceNameVa = $("#patentName").val();
		var $info = {};
		$info.id = userid;
		$info.author = userName;
		$info.pageSize = 10;
		if(resourceNameVa != "") {
			$info.name = resourceNameVa;
		}
		$info.pageNo = n;
		$.ajax({
			"url": "/ajax/ppatent/byAuthor",
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					$(".importUl").html("");
					if(num == 1) {
						if(data.data.data.length == 0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("没有需要导入的专利");
							return;
						} else {
							$("#noresource").addClass("displayNone");
						}
					} else {
						if(data.data.data.length == 0) {
							$("#noresource").removeClass("displayNone");
							$(".noContip").text("没有符合该搜索条件的内容");
							return;
						} else {
							$("#noresource").addClass("displayNone");
						}
					}
					resourceHtml(data.data.data);
					if(isbind == true) {
						$(".tcdPageCode").createPage({
							pageCount: Math.ceil(data.data.total / data.data.pageSize),
							current: data.data.pageNo,
							backFn: function(p) {
								getRecourceMe(p, false);
								document.body.scrollTop = document.documentElement.scrollTop = 0;
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
	getRecourceMe(1, true,1);

	function resourceHtml($data) {
		for(var i = 0; i < $data.length; i++) {
			var oSpec = "",
				comp = "";
			if($data[i].authors) {
				oSpec = "发明人：" + $data[i].authors;

			}
			if($data[i].code) {
				comp = "专利号：" + $data[i].code;
			}
			var oT, oText,cs;
			if($data[i].professorId.substring(0,1)!="#") {
				oT = "importSpan-3";
				oText = "已导入";
				cs="auto"
			} else {
				oT = "importSpan-1";
				oText = "导入";
				cs="pointer";
			}
			var oString = '<li>' +
				'<a class="flexCenter">' +
				'<div class="madiaHead patentHead"></div>' +
				'<div class="madiaInfo">' +
				'<p class="h1Font ellipsisSty">' + $data[i].name + '</p>' +
				'<p class="h2Font ellipsisSty">' + oSpec.substring(0,oSpec.length-2) + '</p>' +
				'<p class="h2Font ellipsisSty">' + comp + '</p>' +
				'</div>' +
				'</a>' +
				'<div class="importBtn">' +
				'<span class="importResource ' + oT + '" data-id="' + $data[i].id + '" style="cursor:'+cs+'">' + oText + '</span>' +
				/*'<span class="importSpan-2">再次导入</span>' +
				'<span class="importSpan-3">已导入</span>' +*/
				'</div>' +
				'</li>'
				var $st=$(oString);
			$(".importUl").append(oString);
	}
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
$(".searchSpan").click(function() {
	$(".tcdPageCode").remove();
	$(".aboutRes").append('<div class="tcdPageCode"></div>');
	getRecourceMe(1, true);
})

/*导入资源*/
$(".importUl").on("click", ".importSpan-1", function() {
	var oF = $(this).attr("flag");
	var $this = $(this);
	$.ajax({
		"url": "/ajax/ppatent/ass",
		"type": "POST",
		"success": function(data) {
			if(data.success) {
				if(data.data > 0) {
					$this.text("导入成功").addClass("importSpan-3").removeClass("importSpan-1").removeClass("importSpan-2").css("cursor", "auto");
				}
			}
		},
		"data": {
			id: $(this).attr("data-id"),
			uid: userid,
			author: userName,
		},
		dataType: "json",
		'error': function() {
			$.MsgBox.Alert('提示', '服务器连接超时！');
		}
	});
});

})