$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	var userid = $.cookie("userid");
	var resourceId = GetQueryString("resourceId");
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/r.html?id="+resourceId;
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
	
	ifcollectionAbout(resourceId,$("#attention").find("em"), 2)
	pageViewLog(resourceId,2)
	var professorId = "";
	getRecourceMe();
	relatedArticles();
	relatedServices();
	interestingResources();
	
	//热门资源
	function recentlyRe(num,obj) {
		var ourl=num==1?"/ajax/resource/qaOrgPublish":"/ajax/resource/qaProPublish";
		$.ajax({
			"url" :ourl ,
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :obj,
			"success" : function(data) {
				if (data.success){
					var $data=data.data;
					var only=false;
					if($data.length>1){
						$(".recentlyList").parents(".currentBlock").removeClass("displayNone");
						var oLeng=$data.length<5?$data.length:5;
						for(var i=0;i<oLeng;i++) {
							if(resourceId==$data[i].resourceId) {
								only=true;
								continue;
							}
							if(only==true) {
								if(oLeng<5) {
									
								}else{
									oLeng=6;
								}
								
							}
							var resIM="../images/default-resource.jpg";
							if($data[i].images.length) {
								resIM='/data/resource/' + $data[i].images[0].imageSrc;
							}
							var str='<li><a class="flexCenter" style="min-height:46px;" href="resourceShow.html?resourceId='+$data[i].resourceId+'">'+
									'<div class="madiaHead resourceHead" style="width:50px;height:36px;margin-top:-18px;background-image: url('+ resIM +');"></div>'+
								'<div class="madiaInfo"><p class="h2Font ellipsisSty-2">'+$data[i].resourceName+'</p></div></a></li>'
							$(".recentlyList").append(str);	
						}
					}
				}
					
				
				
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	/*获取资源信息*/
	function getRecourceMe() {
		$.ajax({
			"url": "/ajax/resource/queryOne",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					resourceHtml(data.data);
					var resourceName = data.data.resourceName + "-科袖网";
					window.setTimeout(function() {
						document.title = resourceName;
					}, 500);
				}
			},
			"data": {
				"resourceId": resourceId
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
		$("#resourceName").text($da.resourceName); //名字
		$("#application").text($da.supportedServices); //应用用途
		if($da.editProfessor) {
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
			console.log(professorId);
			console.log(userid);
			if(userid != professorId) {
				ifcollectionAbout(professorId,$("#person").find(".attenSpan"), 1)
				$(".goSpan").show();
			}
			var professorFlag = autho($da.editProfessor.authType, $da.editProfessor.orgAuth, $da.editProfessor.authStatus);
			$("#authFlag").addClass(professorFlag.sty).attr("title", professorFlag.title);
			if($da.editProfessor.hasHeadImage == 1) {
				$("#headImg").css("background-image", 'url(/images/head/' + $da.editProfessor.id + '_l.jpg)');
			}else{
				$("#headImg").css("background-image", 'url(../images/default-photo.jpg)');
			}
			recentlyRe(2,{"professorId":professorId}) 
		}else{
			$("#enterprise").show();
			$(".qiyego").attr('dataid',$da.organization.id);
			$(".qiyego").attr("href","cmpInforShow.html?orgId="+$da.organization.id);
			if($da.organization.hasOrgLogo) {
				$("#companyImg").attr("src", "/images/org/" + $da.organization.id + ".jpg");
			}else{
				$("#companyImg").attr("src", "/images/default-icon.jpg");
			}
			if($da.organization.authStatus==3){
				$("#QauthFlag").addClass("authicon-com-ok").attr("title", "认证企业");	
			}
			if($da.organization.forShort) {
				$("#Qname").text($da.organization.forShort).attr("href","cmpInforShow.html?orgId="+$da.organization.id);
			}else{
				$("#Qname").text($da.organization.name).attr("href","cmpInforShow.html?orgId="+$da.organization.id);
			}
			
			if($da.organization.industry) {
				$("#Qindustry").text($da.organization.industry.replace(/,/gi, " | "));
			}
			if(userid){
				ifcollectionAbout($da.organization.id,$("#enterprise").find(".attenSpan"), 6)
			}
			recentlyRe(1,{"orgId":$da.organization.id}) 
		}
		if($da.spec) { //厂商型号
			$("#modelNumber").text($da.spec).parents("li").show();
		}
		if($da.parameter) { //性能参数
			$("#performancePa").html(outHTML($da.parameter)).parents("li").show();
		}
		if($da.cooperationNotes) { //合作备注
			$("#remarkContent").html(outHTML($da.cooperationNotes)).parents("li").show();
		}
		if($da.pageViews>0){
			$("#pageView").html($da.pageViews)
		}
		if($da.subject) {
			var oSub = $da.subject.split(",");
			var oSt = "";
			for(var i = 0; i < oSub.length; i++) {
				oSt += '<li><p class="h2Font">' + oSub[i] + '</p></li>'
			}
			$(".tagList").html(oSt);
		} 
		if($da.descp) { //编辑器
			$("#descp").html($da.descp).parents("li").show();
		}
		var weibotitle = $da.resourceName;
		var weibourl = window.location.href;
		//return;
		if($da.images.length) {
			var weibopic = "http://" + window.location.host + "/data/resource/" + $da.images[0].imageSrc;
			$("#firstFigure").attr({
				"src": "/data/resource/" + $da.images[0].imageSrc,
				"rel": "/data/resource/" + $da.images[0].imageSrc
			}).parent().attr("href", "/data/resource/" + $da.images[0].imageSrc);
			var arr = "";
			for(var i = 0; i < $da.images.length; i++) {
				if($da.images[i] == $da.images[0]) {
					var oString = '<li class="tb-selected">' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/resource/' + $da.images[i].imageSrc + '"/>' +
						'</a>' +
						'</div>' +
						'</li>'
				} else {
					var oString = '<li >' +
						'<div class="tb-pic tb-s66">' +
						'<a href="javascript:void(0);">' +
						'<img src="/data/resource/' + $da.images[i].imageSrc + '"/>' +
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
		$("#weibo").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+encodeURIComponent(weibotitle)+"&url="+encodeURIComponent(weibourl)+"&pic="+encodeURIComponent(weibopic)+"&content=utf-8"+"&ralateUid=6242830109&searchPic=false&style=simple");
	}
	/*点击名字及头像跳转个人浏览页面*/
	$("#nameS,#headImg").click(function() {
		location.href = "userInforShow.html?professorId=" + professorId;
	})
	//关键词标签点击进去搜索
	$(".tagList").on("click","li",function(){
		var tagText = $(this).find("p").text();
		location.href = "searchNew.html?searchContent=" + tagText + "&tagflag=2";
	})
	/*资源里面相关文章*/
	function relatedArticles() {
		$.ajax({
			"url": "/ajax/article/byAssResource",
			"type": "GET",
			"data": {
				"id": resourceId,
			},
			dataType: "json",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data.length> 0) {
						$("#oArticle").parents(".otherShow").removeClass("displayNone");
						var StrData = data.data
						var lengthT;
						if(StrData.length>5){
							lengthT=5;
						}else{
							lengthT=StrData.length
						}
						for(var i = 0; i < lengthT; i++) {
							relatedArticlesHtml(StrData[i]);
						}
					}
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*资源相关文章html*/
	function relatedArticlesHtml($html) {
		var oURL;
		if($html.articleType==1) {
			oURL="/ajax/professor/baseInfo/" + $html.ownerId;
		}else if($html.articleType==2) {
			oURL="/ajax/org/" + $html.ownerId;
		}else if($html.articleType==2) {
			oURL="/ajax/platform/info";
		}
		$.ajax({
			"url":oURL,
			"data":{id:$html.ownerId},
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					var cmpname="";
					if(data.data.forShort){
						cmpname=data.data.forShort;
					}else{
						cmpname=data.data.name;
					}
					if($html.articleType==1) {
						var stl = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
					}else if($html.articleType==2){
						var stl={};
						stl.sty="";
						stl.title="";
						if(data.data.authStatus==3) {
							stl.sty="authicon-com-ok";
							stl.title="认证企业";
						}
					}else if($html.articleType==3){
						var stl={};
						stl.sty="";
						stl.title="";
					}
					var sowU=''
					if($html.pageViews!=0){
							if($html.articleAgree!=0){
								sowU='<span>阅读量 '+$html.pageViews+'</span><span>赞 '+$html.articleAgree+'</span>'
							}else{
								sowU='<span>阅读量 '+$html.pageViews+'</span>'
							}
						}
					var str = ""
					str += '<li data-id="' + $html.articleId + '" data-createTime="' + $html.createTime + '" data-shareId="' + $html.shareId + '"><a class="flexCenter OflexCenter">'
					if($html.articleImg) {
						str += '<div class="madiaHead artHead" style="background-image: url(/data/article/' + $html.articleImg + ')"></div>'
					} else {
						str += '<div class="madiaHead artHead"></div>'
					}
					str += '<div class="madiaInfo OmadiaInfo">'
					str += '<p class="h1Font ellipsisSty-2">' + $html.articleTitle + '</p>'
					str += '<div class="h2Font showInfo"><span>'+ cmpname +'</span><span>'+commenTime($html.publishTime)+'</span>'+sowU+'<span class="leaveMsgCount"></span></div>'
					str += '</div></a></li>'
					var $itemlist =$(str);
					$("#oArticle").append(str);
					leaveMsgCount($html.articleId,1,$itemlist);
				}
			},
			'dataType': "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*文章跳转*/
	$("#oArticle").on("click", "li", function() {
		var oArticle={
			shareId:$(this).attr("data-shareId"),
			createTime:$(this).attr("data-createTime")
		};
		location.href = "/"+pageUrl('a',oArticle)
	})
	/*服务跳转*/
	$("#oService").on("click", "li", function() {
		location.href = "sevriceShow.html?sevriceId=" + $(this).attr("data-id");
	})
	/*资源里面相关服务*/
	function relatedServices() {
		$.ajax({
			"url": "/ajax/ware/byResourceWithModifyTime",
			"type": "GET",
			"data": {
				"id": resourceId,
				"rows":5
			},
			dataType: "json",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data.length> 0) {
						$("#oService").parents(".otherShow").removeClass("displayNone");
						var StrData = data.data
						var lengthT;
						if(StrData.length>5){
							lengthT=5;
						}else{
							lengthT=StrData.length
						}
						for(var i = 0; i < lengthT; i++) {
							var $html=StrData[i]
							var cnt="", img="../images/default-service.jpg"
							if($html.images) {
								var subs = strToAry($html.images)
								if(subs.length > 0) {
									img="/data/ware" + subs[0]
								}
							}
							if($html.cnt){
								cnt="内容："+$html.cnt
							}
							var itemlist = '<li data-id="'+$html.id+'">'
								itemlist += '<a class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url('+img+')"></div>';
								itemlist += '<div class="madiaInfo OmadiaInfo">';
								itemlist += '<p class="ellipsisSty h1Font" id="usertitle">'+$html.name+'</p>';
								itemlist += '<p><span class="h2Font ownerName"></span><em class="ownerSty authiconNew"></em></p>';
								itemlist += '<p class="ellipsisSty-2 h2Font">'+cnt+'</p>';
								itemlist += '</div></a></li>';
							var $itemlist = $(itemlist);
							$("#oService").append($itemlist)
							if($html.category=="1"){
								(function(mo){
									cacheModel.getProfessor($html.owner,function(sc,value){
										if(sc){
											mo.find(".ownerName").html(value.name)
											var userType = autho(value.authType, value.orgAuth, value.authStatus);
											mo.find(".ownerSty").addClass(userType.sty).attr("title",userType.title)
										}else{
											console.log("error")
										}
									})
								})($itemlist);
							}else if($html.category=="2"){
								(function(mo){
									cacheModel.getCompany($html.owner,function(sc,value){
										if(sc){
											if(value.forShort){
												mo.find(".ownerName").html(value.forShort)
											}else{
												mo.find(".ownerName").html(value.name)
											}
											if(value.authStatus==3) {
												mo.find(".ownerSty").addClass("authicon-com-ok").attr("title","科袖认证企业")
											}
										}else{
											console.log("error")
										}
									})
								})($itemlist);
							}
						}
					}
				}
			}
		});
	}
	/*感兴趣的资源*/
	function interestingResources() {
		$.ajax({
			"url": "/ajax/resource/ralateResources",
			"type": "GET",
			"data":{"resourceId": resourceId},
			"traditional": true,
			dataType: "json",
			"success": function(data) {
				//console.log(data);
				if(data.success) {
					if(data.data.length == 0) {
						return;
					}
					$("#relateArt").parents(".otherShow").removeClass("displayNone");
					var StrData = data.data
					var lengthT;
					if(StrData.length>5){
						lengthT=5;
					}else{
						lengthT=StrData.length
					}
					for(var i = 0; i < lengthT; i++) {
						interestingResourcesHtml(StrData[i]);
					}
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*感兴趣资源的html*/
	function interestingResourcesHtml($respond) {
		var imgL="../images/default-resource.jpg";
		if($respond.images.length){
			imgL='/data/resource/' + $respond.images[0].imageSrc
		}
		var oURL;
		if($respond.resourceType==1) {
			oURL="/ajax/professor/baseInfo/"+$respond.professorId;
		}else{
			oURL="/ajax/org/" + $respond.orgId;
		}
		$.ajax({
			"url":oURL,
			"type": "GET",
			'dataType': "json",
			"success": function(data) {
				if(data.success){
					//console.log(data)
					var thisName,userType,thisAuth,thisTitle
					if(data.data.forShort){
						thisName=data.data.forShort;
					}else{
						thisName=data.data.name;
					}
					if($respond.resourceType==1) {
						userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
						thisTitle = userType.title;
						thisAuth = userType.sty;
					}else {
						if(data.data.authStatus==3) {
							thisTitle = "科袖认证企业";
							thisAuth = "authicon-com-ok";
						}
					}
					var add = document.createElement("li");
					add.className = "mui-table-view-cell"; 
					add.setAttribute("data-id",$respond.resourceId);
					var itemlist = '<a class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url('+imgL+')"></div>';
						itemlist += '<div class="madiaInfo OmadiaInfo">';
						itemlist += '<p class="ellipsisSty h1Font" id="usertitle">'+$respond.resourceName+'</p>';
						itemlist += '<p><span class="h2Font">'+thisName+'</span><em class="authiconNew '+thisAuth+'" title="'+thisTitle+'"></em></p>';
						itemlist += '<p class="ellipsisSty-2 h2Font">用途：'+$respond.supportedServices+'</p>';
						itemlist += '</div></a>';
						
					add.innerHTML=itemlist;
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
		location.href = "resourceShow.html?resourceId=" + $(this).attr("data-id");
	})
	/*点击咨询*/
	$("#consultin").on('click', function(){
		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			location.href="tidings.html?id="+professorId
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	});
	$("#expertli").on("click",".addbtn",function(event) {
		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			var id=$(this).attr("data-id");
			location.href="tidings.html?id="+id;
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
		event.stopPropagation()
	});
	$("#expertli").on("click",'li',".addbtn",function() {
			var id=$(this).attr("data-id");
			location.href="userInforShow.html?professorId="+id;
	});
	//点击专家关注
	$("#person").on("click",'.attenSpan',function() {
		if(userid && userid != "null" && userid != null) {
			if($(this).is('.attenedSpan')){
				cancelCollectionAbout(professorId,$(this), 1)
			} else {
				collectionAbout(professorId,$(this),1);
			}	
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	})
	$("#enterprise").on("click",'.attenSpan',function() {
		if(userid && userid != "null" && userid != null) {
			if($(this).is('.attenedSpan')){
				cancelCollectionAbout($(".qiyego").attr('dataid'),$(this), 6)
			} else {
				collectionAbout($(".qiyego").attr('dataid'),$(this),6);
			}	
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	})

	//点击资源收藏
	$('#attention em').click(function() {
		if (userid && userid != "null" && userid != null) {
			if($(this).is('.icon-collected')){
				cancelCollectionAbout(resourceId,$(this),2)
			}else{
				collectionAbout(resourceId,$(this),2)
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
			url: "/ajax/resource/qaLinkman",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: true,
			data: {
				"resourceId": resourceId,
			},
			success: function(data, textState) {
				console.log(data)
				if(data.success) {
					if(data.data.length>0){
						$("#expertli").parents(".currentBlock").removeClass("displayNone");
						unauthUser(data.data);
					}else{
						$("#expertli").parents(".currentBlock").addClass("displayNone");
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
			var oClass = autho($res[i].professor.authType, $res[i].professor.orgAuth, $res[i].professor.authStatus);
			var oTitle = "";
			if($res[i].professor.title) {
				oTitle = $res[i].professor.title;
			} else {
				if($res[i].professor.office) {
					oTitle = $res[i].professor.office;
				}
			}
			if($res[i].professor.hasHeadImage) {
				img = "/images/head/" + $res[i].professor.id + "_l.jpg";
			} else {
				img = "../images/default-photo.jpg"
			}
			var oSt = '<li class="flexCenter" data-id="' + $res[i].professor.id + '">'
			oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
			oSt += '<div class = "madiaInfo">'
			oSt += '<p class = "ellipsisSty">'
			oSt += '<span class = "h1Font" id="name">' + $res[i].professor.name + '</span><em class="authiconNew ' + oClass.sty + '" title="' + oClass.title + '"></em >'
			oSt += '</p>'
			oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
			oSt += '</div>'
				if(userid != $res[i].professor.id)
			oSt += '<span class="addbtn" data-id="' + $res[i].professor.id + '">联系</span>'
			oSt += '</li>'
			osting += oSt;
		}
		$("#expertli").append(osting);
	}
	
	//纠错反馈
	$(".correctSubmit").on("click",function(){
		var cntCon=$(this).siblings(".correctCon").val();
		var cntUser="";
		if(userid && userid != null && userid != "null") {
			cntUser = userid;
		}
		if(cntCon.length>500){
			$.MsgBox.Alert('提示', '纠错反馈内容不得超过500个字');
			return;
		}else{
			$.ajax({
				"url": "/ajax/feedback/error/resource",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": resourceId,
					"cnt":cntCon,
					"user":cntUser
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
