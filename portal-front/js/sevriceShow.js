$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	var userid = $.cookie("userid");
	var sevriceId = GetQueryString("sevriceId");
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
		location.href = "http://" + window.location.host + "/e/s.html?id=" + sevriceId;
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
	ifcollectionAbout(sevriceId, $("#attention").find("em"), 2)
	pageViewLog(sevriceId,10)
	var professorId = "";
	getRecourceMe();
	relatedArticles();
	interestingResources();

	//热门资源
	function recentlyRe(catagory, owner) {
		$.ajax({
			"url": "/ajax/ware/byOwnerWithPageViews",
			"type": "GET",
			"dataType": "json",
			"data": {
				'id': sevriceId,
				'category': catagory,
				'owner': owner,
				'rows': 5,
			},
			"success": function(data) {
				if(data.success) {
					var $data = data.data;
					if($data.length) {
						$(".recentlyList").parents(".currentBlock").removeClass("displayNone");
						for(var i = 0; i < $data.length; i++) {
							var resIM = "../images/default-service.jpg";
							if($data[i].images) {
							if($data[i].images.split(",").length) {
								resIM = '/data/ware' + $data[i].images.split(",")[0];
							}}
							var str = '<li><a class="flexCenter" style="min-height:46px;" href="sevriceShow.html?sevriceId=' + $data[i].id + '">' +
								'<div class="madiaHead resourceHead" style="width:50px;height:36px;margin-top:-18px;background-image: url(' + resIM + ');"></div>' +
								'<div class="madiaInfo"><p class="h2Font ellipsisSty-2">' + $data[i].name + '</p></div></a></li>'
							$(".recentlyList").append(str);
						}
					}
				}

			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
	/*获取服务信息*/
	function getRecourceMe() {
		$.ajax({
			"url": "/ajax/ware/qo",
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					resourceHtml(data.data);
					var resourceName = data.data.name + "-科袖网";
					document.title = resourceName;
				}
			},
			"data": {
				"id": sevriceId
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
		$("#resourceName").text($da.name); //名字
		if($da.cnt){
			$("#application").text($da.cnt); //应用用途
		}else{
			$("#application").parent().hide();
		}
		if($da.pageViews>0){
			$("#pageView").html($da.pageViews)
		}
		if($da.category == 1) {
			ajaxRequist("/ajax/professor/baseInfo/" + $da.owner, {}, "get", function(data) {
				$da.editProfessor = data.data;
				recentlyRe(1, $da.editProfessor.id);
				$("#person").show();
				if($da.orgName) { //所属机构
					$("#organizationName").text($da.orgName).parents("li").show();
				}
				$("#nameS").text($da.editProfessor.name);
				if($da.editProfessor.title) {
					$("#titleOffice").text($da.editProfessor.title);
				} else {
					if($da.editProfessor.office) {
						$("#titleOffice").text($da.editProfessor.office);
					}
				}
				if($da.editProfessor.orgName) {
					$("#orgType").text($da.editProfessor.orgName);
				}
				professorId = $da.editProfessor.id;
				if(userid != professorId) {
					ifcollectionAbout(professorId, $("#person").find(".attenSpan"), 1)
					$(".goSpan").show();
				}
				var professorFlag = autho($da.editProfessor.authType, $da.editProfessor.orgAuth, $da.editProfessor.authStatus);
				$("#authFlag").addClass(professorFlag.sty).attr("title", professorFlag.title);
				if($da.editProfessor.hasHeadImage == 1) {
					$("#headImg").css("background-image", 'url(/images/head/' + $da.editProfessor.id + '_l.jpg)');
				} else {
					$("#headImg").css("background-image", 'url(../images/default-photo.jpg)');
				}

			})
		} else {
			ajaxRequist("/ajax/org/" + $da.owner, {}, "get", function(data) {
				$da.organization = data.data;
				recentlyRe(2, $da.organization.id);
				$("#enterprise").show();
				$(".qiyego").attr('dataid', $da.organization.id);
				$(".qiyego").attr("href", "cmpInforShow.html?orgId=" + $da.organization.id);
				if($da.organization.hasOrgLogo) {
					$("#companyImg").attr("src", "/images/org/" + $da.organization.id + ".jpg");
				} else {
					$("#companyImg").attr("src", "/images/default-icon.jpg");
				}
				if($da.organization.authStatus == 3) {
					$("#QauthFlag").addClass("authicon-com-ok").attr("title", "认证企业");
				}
				if($da.organization.forShort) {
					$("#Qname").text($da.organization.forShort).attr("href", "cmpInforShow.html?orgId=" + $da.organization.id);
				} else {
					$("#Qname").text($da.organization.name).attr("href", "cmpInforShow.html?orgId=" + $da.organization.id);
				}

				if($da.organization.industry) {
					$("#Qindustry").text($da.organization.industry.replace(/,/gi, " | "));
				}
				if(userid) {
					ifcollectionAbout($da.organization.id, $("#enterprise").find(".attenSpan"), 6)
				}
			})
		}
		if($da.cooperation) { //合作备注
			$("#remarkContent").html(outHTML($da.cooperation)).parents("li").show();
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
		var weibotitle = $da.name;
		var weibourl = window.location.href;
		if($da.images) {
			if($da.images.split(",").length) {
				var weibopic = "http://" + window.location.host + "/data/ware" + $da.images.split(",")[0];
				$("#firstFigure").attr({
					"src": "/data/ware" + $da.images.split(",")[0],
					"rel": "/data/ware" + $da.images.split(",")[0]
				}).parent().attr("href", "/data/ware" + $da.images.split(",")[0]);
				var arr = "";
				for(var i = 0; i < $da.images.split(",").length; i++) {
					if($da.images.split(",")[i] == $da.images.split(",")[0]) {
						var oString = '<li class="tb-selected">' +
							'<div class="tb-pic tb-s66">' +
							'<a href="javascript:void(0);">' +
							'<img src="/data/ware' + $da.images.split(",")[i] + '"/>' +
							'</a>' +
							'</div>' +
							'</li>'
					} else {
						var oString = '<li >' +
							'<div class="tb-pic tb-s66">' +
							'<a href="javascript:void(0);">' +
							'<img src="/data/ware' + $da.images.split(",")[i] + '"/>' +
							'</a>' +
							'</div>' +
							'</li>'
					}
		
					arr += oString;
				}
				$("#thumblist").html(arr);
			}
		} else {
			var weibopic = "http://" + window.location.host + "../images/default-service.jpg";
			$("#firstFigure").attr({
				"src": '../images/default-service.jpg',
				"rel": '../images/default-service.jpg'
			});
		}
		$("#weibo").attr("href", "http://service.weibo.com/share/share.php?appkey=3677230589&title=" + encodeURIComponent(weibotitle) + "&url=" + encodeURIComponent(weibourl) + "&pic=" + encodeURIComponent(weibopic) + "&content=utf-8" + "&ralateUid=6242830109&searchPic=false&style=simple");
	}
	/*点击名字及头像跳转个人浏览页面*/
	$("#nameS,#headImg").click(function() {
		location.href = "userInforShow.html?professorId=" + professorId;
	})
	//关键词标签点击进去搜索
	$(".tagList").on("click", "li", function() {
		var tagText = $(this).find("p").text();
		location.href = "searchNew.html?searchContent=" + tagText + "&tagflag=7";
	})
	seresource()
	/*感兴趣的资源*/
	function seresource() {
		$.ajax({
			"url": "/ajax/ware/res",
			"type": "GET",
			"data": {
				"id": sevriceId
			},
			"traditional": true,
			dataType: "json",
			"success": function(data) {
				if(data.success) {
					if(data.data.length == 0) {
						return;
					}
					$("#oResource").parents(".otherShow").removeClass("displayNone");
					for(var i = 0; i < data.data.length; i++) {
						(function(n) {
							ajaxRequist("/ajax/resource/queryOne", {
								"resourceId": data.data[n].resource
							}, "get", function(data) {
								sevrResource(data.data);
							})
						})(i)
					}
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*感兴趣资源的html*/
	function sevrResource($respond) {
		var imgL = "../images/default-resource.jpg";
		if($respond.images.length) {
			imgL = '/data/resource/' + $respond.images[0].imageSrc
		}
		var oURL;
		if($respond.resourceType == 1) {
			oURL = "/ajax/professor/baseInfo/" + $respond.professorId;
		} else {
			oURL = "/ajax/org/" + $respond.orgId;
		}
		$.ajax({
			"url": oURL,
			"type": "GET",
			'dataType': "json",
			"success": function(data) {
				if(data.success) {
					var add = document.createElement("li");
					add.className = "mui-table-view-cell";
					add.setAttribute("data-id", $respond.resourceId);
					var itemlist = '<a class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url(' + imgL + ')"></div>';
					itemlist += '<div class="madiaInfo OmadiaInfo">';
					itemlist += '<p class="ellipsisSty h1Font" id="usertitle">' + $respond.resourceName + '</p>';
					itemlist += '<p class="ellipsisSty-2 h2Font">用途：' + $respond.supportedServices + '</p>';
					itemlist += '</div></a>';

					add.innerHTML = itemlist;
					document.getElementById("oResource").appendChild(add);
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*点击资源列表*/
	$("#oResource").on("click", "li", function() {
		location.href = "resourceShow.html?resourceId=" + $(this).attr("data-id");
	})
	/*服务里面相关文章*/
	function relatedArticles() {
		$.ajax({
			"url": "/ajax/article/lq/byWare",
			"type": "GET",
			"data": {
				"ware": sevriceId,
				"rows": 5
			},
			dataType: "json",
			"success": function(data) {
				if(data.success) {
					if(data.data.length > 0) {
						var $data=data.data;
						$("#oArticle").parents(".otherShow").removeClass("displayNone");
						for(var i = 0; i < $data.length; i++) {
							var str = "",ovel="";
							/*if($data[i].pageViews) {
								ovel="阅读量 "+$data[i].pageViews;
							}*/
							str += '<li data-id="' + $data[i].articleId + '" data-createTime="' + $data[i].createTime + '" data-shareId="' + $data[i].shareId + '"><a class="flexCenter OflexCenter">'
							if( $data[i].articleImg) {
								str += '<div class="madiaHead artHead" style="background-image: url(/data/article/' +  $data[i].articleImg + ')"></div>'
							} else {
								str += '<div class="madiaHead artHead"></div>'
							}
							str += '<div class="madiaInfo"  style="margin-top:18px;padding-bottom:8px">'
							str += '<p class="h1Font ellipsisSty">' +  $data[i].articleTitle + '</p>'
							str += '<p class="h2Font"><span class=" name" style="margin-right:10px"></span><span class="time" style="margin-right:10px;">' + commenTime( $data[i].publishTime) + '</span></p>'
							str += '</div></a></li>'
							//<span class="yue" style="margin-right:10px">'+ovel+'</span><span class="zan" style="margin-right:10px"></span><span class="leword"></span>
							var $str=$(str);
							$("#oArticle").append($str);
							(function($str,i) {
								if($data[i].articleType=="1") {
									ajaxRequist("/ajax/professor/baseInfo/" + $data[i].ownerId, {}, "get", function(data) {
										$str.find(".name").text(data.data.name);
									})
								}else if($data[i].articleType=="2"){
									ajaxRequist("/ajax/org/" + $data[i].ownerId, {}, "get", function(data) {
										if(data.data.forShort) {
											$str.find(".name").text(data.data.forShort);
										}else{
											$str.find(".name").text(data.data.name);
										}
									})
								}else if($data[i].articleType=="3"){
									ajaxRequist("/ajax/platform/info", {id:$data[i].ownerId}, "get", function(data) {
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
							})($str,i)
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
	/*感兴趣的服务*/
	function interestingResources() {
		$.ajax({
			"url": "/ajax/ware/ralateWare",
			"type": "GET",
			"data": {
				"id": sevriceId,
				"rows": 5
			},
			"traditional": true,
			dataType: "json",
			"success": function(data) {
				if(data.success) {
					if(data.data.length == 0) {
						return;
					}
					$("#relateArt").parents(".otherShow").removeClass("displayNone");
					var arr = [];
					for(var i = 0; i < data.data.length; i++) {
						arr.push(data.data[i].id)
					}
					ajaxRequist("/ajax/ware/qm", {
						"id": arr
					}, "get", function(data) {
						for(var i = 0; i < data.data.length; i++)
							(function(i) {
								interestingResourcesHtml(data.data[i]);
							})(i)

					})
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*感兴趣资源的html*/
	function interestingResourcesHtml($respond) {
		var imgL = "../images/default-service.jpg";
		if($respond.images) {
			if($respond.images.split(",").length) {
				imgL = '/data/ware' + $respond.images.split(",")[0]
			}
		}
		var oURL;
		if($respond.category == 1) {
			oURL = "/ajax/professor/baseInfo/" + $respond.owner;
		} else {
			oURL = "/ajax/org/" + $respond.owner;
		}
		$.ajax({
			"url": oURL,
			"type": "GET",
			'dataType': "json",
			"success": function(data) {
				if(data.success) {
					var thisName, userType, thisAuth, thisTitle
					if(data.data.forShort) {
						thisName = data.data.forShort;
					} else {
						thisName = data.data.name;
					}
					if($respond.resourceType == 1) {
						userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
						thisTitle = userType.title;
						thisAuth = userType.sty;
					} else {
						if(data.data.authStatus == 3) {
							thisTitle = "科袖认证企业";
							thisAuth = "authicon-com-ok";
						}
					}
					if($respond.cnt) {
						var cnt = "内容：" + $respond.cnt;
					} else {
						var cnt = ""
					}
					var add = document.createElement("li");
					add.className = "mui-table-view-cell";
					add.setAttribute("data-id", $respond.id);
					var itemlist = '<a class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url(' + imgL + ')"></div>';
					itemlist += '<div class="madiaInfo OmadiaInfo">';
					itemlist += '<p class="ellipsisSty h1Font" id="usertitle">' + $respond.name + '</p>';
					itemlist += '<p><span class="h2Font">' + thisName + '</span><em class="authiconNew ' + thisAuth + '" title="' + thisTitle + '"></em></p>';
					itemlist += '<p class="ellipsisSty-2 h2Font ">' + cnt + '</p>';
					itemlist += '</div></a>';

					add.innerHTML = itemlist;
					document.getElementById("relateArt").appendChild(add);
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*点击资源列表*/
	$("#relateArt").on("click", "li", function() {
		location.href = "sevriceShow.html?sevriceId=" + $(this).attr("data-id");
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
	$("#expertli").on("click", "li", function() {
			var id = $(this).attr("data-id");
			location.href = "userInforShow.html?professorId=" + id;
	});
	//点击专家关注
	$("#person").on("click", '.attenSpan', function() {
		if(userid && userid != "null" && userid != null) {
			if($(this).is('.attenedSpan')) {
				cancelCollectionAbout(professorId, $(this), 1)
			} else {
				collectionAbout(professorId, $(this), 1);
			}
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
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

	//点击资源收藏
	$('#attention em').click(function() {
		if(userid && userid != "null" && userid != null) {
			if($(this).is('.icon-collected')) {
				cancelCollectionAbout(sevriceId, $(this), 10)
			} else {
				collectionAbout(sevriceId, $(this), 10)
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
			url: "/ajax/ware/pro",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: true,
			data: {
				"id": sevriceId,
			},
			success: function(data, textState) {
				if(data.success) {
					if(data.data.length > 0) {
						$("#expertli").parents(".currentBlock").removeClass("displayNone");
						unauthUser(data.data);
					} else {
						$("#expertli").parents(".currentBlock").addClass("displayNone");
					}

				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}

	function unauthUser(data) {
		for(var i = 0; i < data.length; i++) {
			(function(i) {
				ajaxRequist("/ajax/professor/baseInfo/" + data[i].professor, {}, "get", function(data) {
					
					var $res=data.data;
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
					var oSt = '<li class="flexCenter" data-id="' + $res.id + '">'
					oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
					oSt += '<div class = "madiaInfo">'
					oSt += '<p class = "ellipsisSty">'
					oSt += '<span class = "h1Font" id="name">' + $res.name + '</span><em class="authiconNew ' + oClass.sty + '" title="' + oClass.title + '"></em >'
					oSt += '</p>'
					oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
					oSt += '</div>'
					if(userid !=$res.id)
					oSt += '<span class="addbtn" data-id="' + $res.id + '">联系</span>'
					oSt += '</li>'
					osting += oSt;

					$("#expertli").append(osting);
				})
			})(i)
		}
	}

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
				"url": "/ajax/feedback/error/ware",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": sevriceId,
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

})