$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	valUser();
	var userid = $.cookie("userid");
	$(".jqzoom").imagezoom();
	$("#thumblist").on("click", "li a", function() {
		$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
		$(".jqzoom").attr('src', $(this).find("img").attr("src"));
		$(".jqzoom").attr('rel', $(this).find("img").attr("src"));
	});
	$('.shareWeixin').hover(function() {
		$('.shareCode').stop(true, false).fadeToggle();
	});
	var resourceId = GetQueryString("productId");
	var professorId = "";
	getRecourceMe();
	/*获取资源信息*/
	function getRecourceMe() {
		$.ajax({
			"url": "/ajax/product/qo",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					resourceHtml(data.data);
					var resourceName = data.data.name + "-科袖网";
					document.title = resourceName;
				}
			},
			"data": {
				"id": resourceId
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*合作备注及性能参数存储换行格式*/
	function outHTML(selecter) {
		var getValue = selecter;
		var aa = "";
		if(getValue) {
			var endValue = ((getValue.replace(/<(.+?)>/gi, "&lt;$1&gt;")).replace(/ /gi, "&nbsp;")).replace(/\n/gi, "|");
			var cc = endValue.split("|");
			for(var i = 0; i < cc.length; i++) {
				aa += cc[i] + '<br/>'
			}
		}
		return aa;
	}
	/*处理资源html代码*/
	function resourceHtml($da) {
		comMess($da.owner);
		$("#resourceName").text($da.name); //名字
		$("#application").text($da.cnt); //应用用途
		if($da.producingArea) {
			$("#productArea").text($da.producingArea).parents("li").show();
		}
		if($da.price) {
			$("#officialPrice").text($da.price).parents("li").show();
		}
		if($da.spec) { //厂商型号
			$("#modelNumber").text($da.spec).parents("li").show();
		}
		if($da.parameter) { //性能参数
			$("#performancePa").html(outHTML($da.parameter)).parents("li").show();
		}
		if($da.keywords) {
			var oSub = $da.keywords.split(",");
			var oSt = "";
			for(var i = 0; i < oSub.length; i++) {
				oSt += '<li><p class="h2Font">' + oSub[i] + '</p></li>'
			}
			$(".tagList").html(oSt);
		}
		if($da.descp) { //编辑器
			$("#descp").html($da.descp).parents("li").show();
		}
		//return;
		if($da.images) {
			$("#firstFigure").attr({
				"src": "/data/product" + $da.images.split(',')[0],
				"rel": "/data/product" + $da.images.split(',')[0]
			}).parent().attr("href", "/data/product" + $da.images.split(',')[0]);
			var arr = "";
			var images = $da.images.split(',')
			for(var i = 0; i < images.length; i++) {
				if(i == 0) {
					var oString = '<li class="tb-selected">' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/product' + images[0] + '"/>' +
						'</a>' +
						'</div>' +
						'</li>'
				} else {
					var oString = '<li >' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/product' + images[i] + '"/>' +
						'</a>' +
						'</div>' +
						'</li>'
				}

				arr += oString;
			}
			$("#thumblist").html(arr);
		}

	}

	selUse();

	function selUse() {
		$.ajax({
			url: "/ajax/product/pro",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: true,
			data: {
				"id": resourceId,
			},
			success: function(data, textState) {
				console.log(data)
				if(data.success) {
					//unauthUser(data.data);
					var arr = [];
					for(var i = 0; i < data.data.length; i++) {
						arr.push(data.data[i].professor)
					}
					console.log(arr)
					professorList(arr);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}

	function professorList(par) {
		$.ajax({
			url: "/ajax/professor/qm",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: true,
			traditional: true,
			data: {
				"id": par,
			},
			success: function(data, textState) {
				console.log(data)
				if(data.success) {
					if(data.data.length) {
						unauthUser(data.data);
						$("#resPerson").show();
					}

				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}

	function unauthUser($res) {
		var osting = ""
		for(var i = 0; i < $res.length; i++) {
			var img;
			var styC = "";
			var oClass = autho($res[i].authType, $res[i].orgAuth, $res[i].authStatus);
			var oTitle = "";
			if($res[i].title) {
				oTitle = $res[i].title;
			} else {
				if($res[i].office) {
					oTitle = $res[i].office;
				}
			}
			if($res[i].hasHeadImage) {
				img = "/images/head/" + $res[i].id + "_l.jpg";
			} else {
				img = "../images/default-photo.jpg"
			}
			var oSt = '<li>'
			oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
			oSt += '<div class = "madiaInfo">'
			oSt += '<p class = "ellipsisSty">'
			oSt += '<span class = "h1Font" id="name">' + $res[i].name + '</span><em class="authicon ' + oClass.sty + '" title="' + oClass.title + '"></em >'
			oSt += '</p>'
			oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
			oSt += '</div>'
			oSt += '<div class="' + styC + '" flag=1></div>'
			oSt += '</li>'
			osting += oSt;
		}
		$("#expertli").html(osting);
	}

	function comMess(oid) {
		$.ajax({
			url: "/ajax/org/" + oid,
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: "true",
			success: function(data, textState) {
				if(data.success) {
					var $da = data.data;
					$("#enterprise,#resPerson").show();
					if($da.hasOrgLogo) {
						$("#companyImg").attr("src", "/images/org/" + $da.id + ".jpg");
					} else {
						$("#companyImg").attr("src", "/images/default-icon.jpg");
					}
					if($da.authStatus == 3) {
						$("#QauthFlag").addClass("authicon-com-ok").attr("title", "认证企业");
					}
					$("#Qname").text($da.name);
					if($da.industry) {
						$("#Qindustry").text($da.industry.replace(/,/gi, " | "));
					}
				}
			}
		})
	}
})