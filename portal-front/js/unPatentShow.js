$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	var userid = $.cookie("userid");
	var resourceId = GetQueryString("id");
	console.log(resourceId)
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
		location.href = "http://" + window.location.host + "/e/pr.html?id=" + resourceId;
	}
	$(".jqzoom").imagezoom();
	$("#thumblist").on("click", "li a", function() {
		$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
		$(".jqzoom").attr('src', $(this).find("img").attr("src"));
		$(".jqzoom").attr('rel', $(this).find("img").attr("src"));
	});
	$('.shareWeixin').hover(function() {
		$('.shareCode').stop(true, false).fadeToggle();
	});

	ifcollectionAbout(resourceId, $("#attention").find("em"), 12)
	pageViewLog(resourceId, 12)
	var professorId = "";
	getRecourceMe();

	/*获取资源信息*/
	function getRecourceMe() {
		$.ajax({
			"url": "/ajax/resResult/qo",
			"type": "GET",
			"success": function(data) {
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
		if ($da.orgId)
		comMess($da.orgId);
		if ($da.industry) {
			$("#industry").text('行业领域：'+$da.industry)
		}
		if ($da.subject) {
			$("#subject").text('应用领域：'+$da.subject)
		}
		$("#resourceName").text($da.name); //名字
		if($da.descp) {
			$("#descp").html(outHTML($da.descp)).parents("li").show();
		}
		if($da.applyDescp) {
			$("#applyDescp").html(outHTML($da.applyDescp)).parents("li").show();
		}
		if($da.prospect) { //厂商型号
			$("#prospect").html(outHTML($da.prospect)).parents("li").show();
		}
		if($da.advantage) { //厂商型号
			$("#advantage").html(outHTML($da.advantage)).parents("li").show();
		}
		if($da.benefit) { //厂商型号
			$("#benefit").html(outHTML($da.benefit)).parents("li").show();
		}
		if($da.indicator) { //性能参数
			$("#indicator").html(outHTML($da.indicator)).parents("li").show();
		}
		if($da.pageViews > 0) {
			$("#pageView").html($da.pageViews)
		}
		// if($da.keywords) {
		// 	var oSub = $da.keywords.split(",");
		// 	var oSt = "";
		// 	for(var i = 0; i < oSub.length; i++) {
		// 		oSt += '<li><p class="h2Font">' + oSub[i] + '</p></li>'
		// 	}
		// 	$(".tagList").html(oSt);
		// }
		var weibotitle = $da.name;
		var weibourl = window.location.href;
		//return;
		if($da.pic) {
			var weibopic = "http://" + window.location.host + "/data/researchResult" + $da.pic.split(',')[0];
			$("#firstFigure").attr({
				"src": "/data/researchResult" + $da.pic.split(',')[0],
				"rel": "/data/researchResult" + $da.pic.split(',')[0]
			}).parent().attr("href", "/data/researchResult" + $da.pic.split(',')[0]);
			var arr = "";
			var images = $da.pic.split(',')
			for(var i = 0; i < images.length; i++) {
				if(i == 0) {
					var oString = '<li class="tb-selected">' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/researchResult' + images[0] + '"/>' +
						'</a>' +
						'</div>' +
						'</li>'
				} else {
					var oString = '<li >' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/researchResult' + images[i] + '"/>' +
						'</a>' +
						'</div>' +
						'</li>'
				}

				arr += oString;
			}
			$("#thumblist").html(arr);
		} else {
			var weibopic = "http://" + window.location.host + "../images/default-resource.jpg";
			$("#firstFigure").attr({
				"src": '../images/default-resource.jpg',
				"rel": '../images/default-resource.jpg'
			});
		}
		$("#weibo").attr("href", "http://service.weibo.com/share/share.php?appkey=3677230589&title=" + encodeURIComponent(weibotitle) + "&url=" + encodeURIComponent(weibourl) + "&pic=" + encodeURIComponent(weibopic) + "&content=utf-8" + "&ralateUid=6242830109&searchPic=false&style=simple");

	}
	/*点击名字及头像跳转个人浏览页面*/
	$("#nameS,#headImg").click(function() {
		location.href = "userInforShow.html?professorId=" + professorId;
	})
	/*点击咨询*/
	$("#consultin").on('click', function() {
		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			location.href = "tidings.html?id=" + professorId
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	});
	$("#expertli").on("click", ".addbtn", function(event) {
		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			var id = $(this).attr("data-id");
			location.href = "tidings.html?id=" + id;
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
		event.stopPropagation()
	});
	$("#enterprise").on("click", '.attenSpan', function() {
		if(userid && userid != "null" && userid != null) {
			if($(this).is('.attenedSpan')) {
				cancelCollectionAbout($(".qiyego").attr('dataid'), $(this), 6)
			} else {
				collectionAbout($(".qiyego").attr('dataid'), $(this), 6);
			}
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	})

	//点击产品收藏
	$('#attention em').click(function() {
		if(userid && userid != "null" && userid != null) {
			if($(this).is('.icon-collected')) {
				cancelCollectionAbout(resourceId, $(this), 12)
			} else {
				collectionAbout(resourceId, $(this), 12)
			}
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	})

	selUse();

	function selUse() {
		$.ajax({
			url: "/ajax/resResult/researcher",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: true,
			data: {
				"id": resourceId,
			},
			success: function(data, textState) {
				if(data.success) {
					if(data.data.length > 0) {
						$("#expertli").parents(".currentBlock").removeClass("displayNone");

					} else {
						$("#expertli").parents(".currentBlock").addClass("displayNone");
					}

					for(var i = 0; i < data.data.length; i++) {
						if (data.data[i].professorId === "################################") {
						var oSt = '<li data-id="################################" style="cursor:auto">'
						oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(../images/default-photo.jpg);"></div>'
						oSt += '<div class = "madiaInfo">'
						oSt += '<p class = "ellipsisSty">'
						oSt += '<span class = "h1Font" id="name">' + data.data[i].name + '</span>'
						oSt += '</p>'
						oSt += '</div>'
						oSt += '</li>'
						$("#expertli").append(oSt);
						} else {
							(function(n) {
								professorList(data.data[n].professorId);
							})(i)
							
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}

	function professorList(par) {
		$.ajax({
			url: "/ajax/professor/baseInfo/" + par,
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: true,
			traditional: true,
			success: function(data) {
				if(data.success) {
					
						unauthUser(data.data);
						$("#resPerson").show();
					

				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}

	function ajaxRequist(url, obj, type, fn) {
		$.ajax({
			url: url,
			data: obj,
			dataType: 'json', //服务器返回json格式数据
			type: type, //支持'GET'和'POST'
			traditional: true,
			success: function(data) {
				if(data.success) {
					fn(data)
				}
			},
			error: function(xhr, type, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败');
			}
		});
	}

	function unauthUser($res) {
		var osting = ""
			var img;
			var styC = "";
			var oClass = autho($res.authType, $res.orgAuth, $res.authStatus);
			var oTitle = "";
			if($res.title) {
				oTitle = $res.title;
			} else {
				if($res.office) {
					oTitle = $res.office;
				}
			}
			if($res.hasHeadImage) {
				img = "/images/head/" + $res.id + "_l.jpg";
			} else {
				img = "../images/default-photo.jpg"
			}
			var oSt = '<li data-id="' + $res.id + '" style="cursor:pointer;">'
			oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
			oSt += '<div class = "madiaInfo">'
			oSt += '<p class = "ellipsisSty">'
			oSt += '<span class = "h1Font" id="name">' + $res.name + '</span><em class="authicon ' + oClass.sty + '" title="' + oClass.title + '"></em >'
			oSt += '</p>'
			oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
			oSt += '</div>'
			if(userid != $res.id)
				oSt += '<span class="addbtn" data-id="' + $res.id + '">联系</span>'
			oSt += '</li>'
			osting += oSt;
		
		$("#expertli").append(osting);
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
					$(".qiyego").attr('dataid', $da.id);
					$(".qiyego").attr("href", "cmpInforShow.html?orgId=" + $da.id);
					if(userid) {
						ifcollectionAbout($da.id, $("#enterprise").find(".attenSpan"), 6)
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	$("#expertli").on("click",'li', function() {
		if ($(this).attr("data-id") === "################################")
		{
			return
		}
		location.href = "userInforShow.html?professorId=" + $(this).attr("data-id");
	})
	//纠错反馈
	$(".correctSubmit").on("click", function() {
		var cntCon = $(this).siblings(".correctCon").val();
		var cntUser = "";
		if(userid && userid != null && userid != "null") {
			cntUser = userid;
		}
		if(cntCon.length > 500) {
			$.MsgBox.Alert('提示', '纠错反馈内容不得超过500个字');
			return;
		} else {
			$.ajax({
				"url": "/ajax/feedback/error/resResult",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": resourceId,
					"cnt": cntCon,
					"user": cntUser
				},
				"success": function(data) {
					if(data.success) {
						backSuccessed();
					}
				},
				"error": function() {
					$.MsgBox.Alert('提示', '链接服务器超时')
				}
			});
		}
	})
	relatedArticles()
	/*产品里面相关文章*/
	function relatedArticles() {
		$.ajax({
			"url": "/ajax/article/lq/byProduct",
			"type": "GET",
			"data": {
				"product": resourceId,
				"rows": 5
			},
			dataType: "json",
			"success": function(data) {
				if(data.success) {
					if(data.data.length > 0) {
						var $data = data.data;
						$("#oArticle").parents(".otherShow").removeClass("displayNone");
						for(var i = 0; i < $data.length; i++) {
							var str = "",
								ovel = "";
							/*if($data[i].pageViews) {
								ovel="阅读量 "+$data[i].pageViews;
							}*/
							str += '<li data-id="' + $data[i].articleId + '" data-createTime="' + $data[i].createTime + '" data-shareId="' + $data[i].shareId + '"><a class="flexCenter OflexCenter">'
							if($data[i].articleImg) {
								str += '<div class="madiaHead artHead" style="background-image: url(/data/article/' + $data[i].articleImg + ')"></div>'
							} else {
								str += '<div class="madiaHead artHead"></div>'
							}
							str += '<div class="madiaInfo"  style="margin-top:18px;padding-bottom:8px">'
							str += '<p class="h1Font ellipsisSty">' + $data[i].articleTitle + '</p>'
							str += '<p class="h2Font"><span class=" name" style="margin-right:10px"></span><span class="time" style="margin-right:10px;">' + commenTime($data[i].publishTime) + '</span></p>'
							str += '</div></a></li>'
							//<span class="yue" style="margin-right:10px">'+ovel+'</span><span class="zan" style="margin-right:10px"></span><span class="leword"></span>
							var $str = $(str);
							$("#oArticle").append($str);
							(function($str, i) {
								if($data[i].articleType == "1") {
									ajaxRequist("/ajax/professor/baseInfo/" + $data[i].ownerId, {}, "get", function(data) {
										$str.find(".name").text(data.data.name);
									})
								} else if($data[i].articleType == "2") {
									ajaxRequist("/ajax/org/" + $data[i].ownerId, {}, "get", function(data) {
										if(data.data.forShort) {
											$str.find(".name").text(data.data.forShort);
										} else {
											$str.find(".name").text(data.data.name);
										}
									})
								} else if($data[i].articleType == "3") {
									ajaxRequist("/ajax/platform/info", {
										id: $data[i].ownerId
									}, "get", function(data) {
										$str.find(".name").text(data.data.name);
									})
								}
								/*if($data[i].articleAgree) {
									$str.find(".zan").text('赞 ' + $data[i].articleAgree);
								}
								ajaxRequist("/ajax/leavemsg/count" , {sid:$data[i].articleId,stype:1}, "get", function(data) {
										if(data.data) {
											$str.find(".leword").text('留言 ' + data.data);
										}
									})*/
							})($str, i)
						}
					}
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*文章跳转*/
	$("#oArticle").on("click", "li", function() {
		var oArticle = {
			shareId: $(this).attr("data-shareId"),
			createTime: $(this).attr("data-createTime")
		};
		location.href = "/" + pageUrl('a', oArticle)
	})

})