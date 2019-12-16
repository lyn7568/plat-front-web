$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	var userid = $.cookie("userid");
	var sevriceId = GetQueryString("sevriceId");
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
		location.href = "http://" + window.location.host + "/e/r.html?id=" + sevriceId;
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
	var professorId = "";
	getRecourceMe();

	//热门资源
	
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
		
		if($da.category == 1) {
			ajaxRequist("/ajax/professor/baseInfo/" + $da.owner, {}, "get", function(data) {
				$da.editProfessor = data.data;
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
				$("#enterprise").show();
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
		
		
		//return;
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
	}
	
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
					var oSt = '<li class="flexCenter">'
					oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
					oSt += '<div class = "madiaInfo">'
					oSt += '<p class = "ellipsisSty">'
					oSt += '<span class = "h1Font" id="name">' + $res.name + '</span><em class="authiconNew ' + oClass.sty + '" title="' + oClass.title + '"></em >'
					oSt += '</p>'
					oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
					oSt += '</div>'
					oSt += '</li>'
					osting += oSt;

					$("#expertli").html(osting);
				})
			})(i)
		}
	}

})