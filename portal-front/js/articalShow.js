/*文章预览*/
$(document).ready(function() {
	var articleId = GetQueryString("articleId");
	$(".commentList").parent().append('<button class="js-load-more displayNone"></button>')
	module.lWord(articleId,1,1);
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/a.html?id="+articleId;
	}
	var userid = $.cookie("userid");
	var zjreturnId;
	var wzreturnId;
	var experarray = [];
	var createTime,orderKey;

	loginStatus();//判断个人是否登录
	articleshow();
	relevantExperts();
	relatedServices();
	relevantResources(); 

	pageViewLog(articleId,3)
	wlog("article",articleId,"1");
	$('.wordHave').click(function(){$('html,body').animate({scrollTop: ($('.offmsg').outerHeight(true)+60)+'px'}, 800);}); //留言
	$('.shareWeixin').hover(function(){$('.shareCode').stop(true,false).fadeToggle();});//微信分享
	//微信分享
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width: 100,
		height: 100
	});

	function makeCode() {
		var hurl = window.location.host;
		var elurl = "http://" + hurl + "/e/a.html?id=" + articleId;
		qrcode.makeCode(elurl);
	}
	makeCode();
	
	//判断是否登录转态
	if(userid && userid != "null" && userid != null){
		$(".ifLoginOn").removeClass("displayNone");
	}else{
		$(".ifLoginUn").removeClass("displayNone");
		$(".ifLoginUn").on('click',".loginGo", function() {
			quickLog();
			operatTab();
			closeLog();
		})
	}
	//附件
	function queryFileAtach(){
		$.ajax({
			"url": "/ajax/article/files/byArticleId",
			"type": "get",
			"dataType" : "json",
			"data" :{"id":articleId},
			"success": function(data) {
				if(data.success && data.data) {
					for(var i = 0; i < data.data.length; i++) {
						var itlist = '<li>'+
							'<span class="atach-name ellipsisSty">'+data.data[i].name+'</span>'+
							'<span class="atach-size">'+sizeTo(data.data[i].size)+'</span>'+
							'<a href="/data/article/file'+data.data[i].url+'" class="atach-down">点击下载</a>'+
						'</li>'
						$("#atachList").append(itlist);
					}
				}
			}
		});
	}
	//最近文章
	function recentlyArticle(num,obj) {
		var ourl=num==1?"/ajax/article/pqOrgPublish":"/ajax/article/pqProPublish";
		$.ajax({
			"url" :ourl ,
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :obj,
			"success" : function(data) {
				if (data.success){
					var $data=data.data.data;
					var only=false;
					if($data.length>1){
						$(".recentlyList").parents(".currentBlock").removeClass("displayNone");
						var oLeng=$data.length<5?$data.length:5;
						for(var i=0;i<oLeng;i++) {
							if(articleId==$data[i].articleId) {
								only=true;
								continue;
							}
							if(only==true) {
								if(oLeng<5) {
									
								}else{
									oLeng=6;
								}
								
							}
							var listLi=$('<li class="flexCenter"></li>').appendTo($(".recentlyList"));
							var str='<a href="/'+pageUrl('a',$data[i])+'"><p class="h2Font ellipsisSty-2"><em class="circlePre"></em>'+$data[i].articleTitle+'</p>'+
								'<span class="smalltip">'+commenTime($data[i].publishTime)+'</span></a></li>'
							$(str).appendTo(listLi);
						}
					}
				}
				
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
    //平台最近文章
    function platfromRecentlyArticle(obj) {
        $.ajax({
            "url" :"/ajax/article/pageQuery" ,
            "type" :  "GET" ,
            "dataType" : "json",
            "data" :{ownerId:obj,articleType:'3',status:'1'},
            "success" : function(data) {
                if (data.success){
                    var $data=data.data.data;
                    console.log($data);
                    var only=false;
                    if($data.length>1){
                        $(".recentlyList").parents(".currentBlock").removeClass("displayNone");
                        var oLeng=$data.length<5?$data.length:5;
                        for(var i=0;i<oLeng;i++) {
                            if(articleId==$data[i].articleId) {
                                only=true;
                                continue;
                            }
                            if(only==true) {
                                if(oLeng<5) {

                                }else{
                                    oLeng=6;
                                }
                            }
                            var listLi=$('<li class="flexCenter"></li>').appendTo($(".recentlyList"));
                            var str='<a href="/'+pageUrl('a',$data[i])+'"><p class="h2Font ellipsisSty-2"><em class="circlePre"></em>'+$data[i].articleTitle+'</p>'+
                                '<span class="smalltip">'+commenTime($data[i].publishTime)+'</span></a></li>'
                            $(str).appendTo(listLi);
                        }
                    }
                }

            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }
	//初始化文章内容
	function articleshow(){
		$.ajax({
			"url" : "/ajax/article/query",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{"articleId":articleId},
			"success" : function(data) {
				if (data.success){
					var articletitle = data.data.articleTitle + "-科袖网";
					document.title = articletitle;
					$("#articleTitle").text(data.data.articleTitle);
					$("#pageViews").text("阅读量 "+data.data.pageViews);
					$("#publishTime").text(commenTime(data.data.publishTime));
					$("#articleContent").html(data.data.articleContent);
					if(data.data.articleImg){
						$("#articleImg").attr("style", "background-image: url(/data/article/" + data.data.articleImg + ")");
					}else{
						$("#articleImg").attr("style", "background-image: url(../images/default-artical.jpg)");
					}
					$("#tagList").text(industryShow(data.data.subject));
					if (userid && userid != "null" && userid != null) {
						isAgree(data.data.articleAgree)//文章点赞
					}else{
						$(".thumbBtn").html("赞 <span>"+data.data.articleAgree+"</span>");
					}
					ifcollectionAbout(articleId,$("#attention").find("em"), 3)
					if(data.data.articleType==1){
						$("#expert").removeClass("displayNone");
						relevantarticalList(data.data.ownerId);
						expert(data.data.ownerId);
						recentlyArticle(2,{"ownerId":data.data.ownerId})
					}
					if(data.data.articleType==2){
						$("#enterprise").removeClass("displayNone");
						relevantarticalList(data.data.ownerId);
						cmpFun(data.data.ownerId);
						companylist();
						recentlyArticle(1,{"ownerId":data.data.ownerId});
					}
					if(data.data.articleType==3){
						$("#enterprise").removeClass("displayNone");
						relevantarticalList(data.data.ownerId);
						platform(data.data.ownerId);
                        platfromRecentlyArticle(data.data.ownerId);
					}
					var weibotitle = data.data.articleTitle;
					var weibourl =window.location.href;
					var weibopic ="http://"+window.location.host+"/data/article/" + data.data.articleImg;
					$("#weibo").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+encodeURIComponent(weibotitle)+"&url="+encodeURIComponent(weibourl)+"&pic="+encodeURIComponent(weibopic)+"&content=utf-8"+"&ralateUid=6242830109&searchPic=false&style=simple");
				}
				window.setTimeout(function() {
					$('body').scrollTop(4);
					$('.shareBlock').scrollFix({
				        startTop:'body',
				        bottom: 0,
				        endPos : '.share-bottom',
						width: $('.share-nav').outerWidth(true),
				        zIndex : 999
				    });	
				    
				}, 300);
				//不随滚动条滚动的固定层广告代码
				window.setTimeout(function() {
					$('#scroll-fixed-ad').scrollFix({
				    	oflag:true,
				    	startTop:'#scroll-fixed-ad',
				    	startBottom:".privateInfo",
				        distanceTop: $("header").outerHeight(true) + 20,
				        endPos: 'footer',
				        zIndex: 998
				    });	
				}, 300);
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}

	//专家信息
	function expert(professorId){
	
		$.ajax({
			"url" : "/ajax/professor/baseInfo/"+professorId,
			"type" :  "GET" ,
			"dataType" : "json",
			"success" : function(data) {
				if (data.success && data.data){
					if(data.data.hasHeadImage==1) {
						$("#Zimg,.userimg").attr("style", "background-image: url(/images/head/" + data.data.id + "_l.jpg);");
					}
					if(data.data.title==""){
					  var title = data.data.office;
					}else{
					  var title = data.data.title;
					}
					$("#Zname,.username").text(data.data.name);
					$("#Zname").attr("dataid",data.data.id);
					$(".hrefgo,.useurl").attr("href", "userInforShow.html?professorId="+data.data.id);
					$("#Ztitle").text(title);
					$("#ZorgName").text(data.data.orgName);
					var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
					$("#ZauthFlag,.labels").attr("title", userType.title);
					$("#ZauthFlag,.labels").addClass(userType.sty);
					if(data.data.id!=userid){
						$("#expert").find(".goSpan").removeClass("displayNone");
						ifcollectionAbout(data.data.id,$("#expert").find(".attenSpan"), 1)
					}
					
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	
	/*企业用户信息*/
	function cmpFun(orgId) {
		$.ajax({
			"url": "/ajax/org/" + orgId,
			"type": "get",
			"dataType" : "json",
			"success": function(data) {
				if(data.success && data.data) {
					$(".userimg").removeClass("useHead");
					if(data.data.forShort) {
						$("#Qname,.username").text(data.data.forShort);
					}else{
						$("#Qname,.username").text(data.data.name);
					}
					$("#Qname").attr("dataid",data.data.id);
					$(".qiyego,.useurl").attr("href", "cmpInforShow.html?orgId="+data.data.id);
					if(data.data.hasOrgLogo) {
						$(".userimg").attr("style","background: #fff;")
						$(".userimg").html('<div class="boxBlock" style="width:50px;height:50px"><img class="boxBlockimg" src="" id="companyImg2"></div>');
						$("#companyImg,#companyImg2").attr("src", "/images/org/" + data.data.id + ".jpg");
					}else{
						$("#companyImg,#companyImg2").attr("src", "/images/default-icon.jpg");
					}
					if(data.data.authStatus==3){
						$("#QauthFlag,.labels").addClass("authicon-com-ok").attr("title", "认证企业");;	
					}
					if(data.data.industry) {
						$("#Qindustry").text(data.data.industry.replace(/,/gi, " | "));
					}
					if(userid){
						ifcollectionAbout(data.data.id,$("#enterprise").find(".attenSpan"), 6)
					}
					
					if(!data.data.colMgr && !data.data.resMgr) {
						relatedProducts();
					}
					if(data.data.colMgr) {
						queryFileAtach();
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
    function platform(platformId) {
        $.ajax({
            "url": "/ajax/platform/info",
			"data":{id:platformId},
            "type": "get",
            "dataType" : "json",
            "success": function(data) {
                if(data.success && data.data) {
                    $(".userimg").removeClass("useHead");
					$("#Qname,.username").text(data.data.name);
                    $("#Qname").attr("dataid",data.data.id);
                    $(".qiyego,.useurl").attr("href", "javascript:void(0)");
                    $(".qiyego,.useurl").css("cursor", "default");
                    if(data.data.logo!=null) {
                        $(".userimg").attr("style", "background: #fff;");
                        $(".userimg").html('<div class="boxBlock" style="width:50px;height:50px"><img class="boxBlockimg" src="" id="companyImg2"></div>');
                        $("#companyImg,#companyImg2").attr("src", "/data/platform" + data.data.logo);
                    }else{
                        $("#companyImg,#companyImg2").attr("src", "/images/default-plat.jpg");
                    }
                    if(data.data.industry) {
						$("#Qindustry").text(data.data.industry.replace(/,/gi, " | "));
					}
                    $("#enterprise").find(".attenSpan").hide();
                }
            },
            "error": function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        });
    }

	//相关专家
	function relevantExperts(){
		$.ajax({
			"url": "/ajax/article/ralatePro",
			"type": "get",
			"dataType" : "json",
			"data" :{"articleId":articleId},
			"success": function(data) {
				if(data.success && data.data) {
					for(var i = 0; i < data.data.length; i++) {
						var professorId = data.data[i].professorId;
						relevantExpertsList(professorId)
					}
					
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
	
	//相关专家信息
	function relevantExpertsList(professorId){
		$.ajax({
			"url" : "/ajax/professor/info/"+professorId,
			"type" :  "GET" ,
			"dataType" : "json",
			"success" : function(data) {
				if (data.success && data.data!=""){
					$("#relevantExperts").parent().parent().removeClass("displayNone");
					var itemlist = '';
					$("#trelevantExperts").html("");
					var itemlist = '<li><a href="" class="flexCenter urlgo" style="min-height:80px;">';
						itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
						itemlist += '<div class="madiaInfo">';
						itemlist += '<p><span class="h1Font" id="userName"></span><em class="authiconNew" title=""></em></p>';
						itemlist += '<p class="ellipsisSty h2Font" id="usertitle"></p>';
						itemlist += '<p class="h2Font ellipsisSty" id="researchAreas"></p>';
						itemlist += '</div></a></li>';
						$itemlist = $(itemlist);
						$("#relevantExperts").append($itemlist);
						if(data.data.title) {
							if(data.data.orgName) {
								$itemlist.find("#usertitle").text(data.data.title +"，"+ data.data.orgName);
							}else{
								$itemlist.find("#usertitle").text(data.data.title);
							}
						}else{
							if(data.data.office) {
								if(data.data.orgName) {
									$itemlist.find("#usertitle").text(data.data.office +"，"+ data.data.orgName);
								}else{
									$itemlist.find("#usertitle").text(data.data.office);
								}
							}else{
								if(data.data.orgName) {
									$itemlist.find("#usertitle").text(data.data.orgName);
								}
							}
						}
						$itemlist.find("#userName").text(data.data.name);
						
						$itemlist.find(".urlgo").attr("href", "userInforShow.html?professorId="+data.data.id);
						/*获取研究方向信息*/
						var researchAreas = data.data.researchAreas;
						if(researchAreas != ""){
							var rlist = '研究方向：';
						}else{
							var rlist = '';
						}
						for(var n = 0; n < researchAreas.length; n++) {
							//console.log(researchAreas[n].caption);
							rlist += researchAreas[n].caption
							if(n < researchAreas.length - 1) {
								rlist += "；"
							}
						}
						$itemlist.find("#researchAreas").text(rlist);
						if(data.data.hasHeadImage == 1) {
							$itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + data.data.id + "_l.jpg);");
						}
						var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
						$itemlist.find(".authiconNew").attr("title", userType.title);
						$itemlist.find(".authiconNew").addClass(userType.sty);
						
				}else{
					$("#relevantExperts").parent().parent().style.display="none";
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	
	//相关资源
	function relevantResources(){
		$.ajax({
			"url": "/ajax/article/ralateRes",
			"type": "get",
			"dataType" : "json",
			"data" :{"articleId":articleId},
			"success": function(data) {
				if(data.success && data.data) {
					for(var i = 0; i < data.data.length; i++) {
						var resourceId = data.data[i].resourceId;
						relevantResourcesList(resourceId)
					}
					
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
	
	//相关资源信息
	function relevantResourcesList(resourceId){
		$.ajax({
			"url" : "/ajax/resource/queryOne",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{"resourceId":resourceId},
			"success" : function(data) {
				console.log(data);
				if (data.success && data.data!=""){
					$("#resources").parent().parent().removeClass("displayNone");
					var itemlist = '<li><a href="" class="flexCenter urlgo">';
						itemlist += '<div class="madiaHead resouseHead" id="userimg"></div>';
						itemlist += '<div class="madiaInfo">';
						itemlist += '<p class="h1Font ellipsisSty" id="resourceName"></p>';
						itemlist += '<p><span class="h2Font uname"></span><em class="authiconNew" title="科袖认证专家"></em></p>';
						itemlist += '<p class="h2Font ellipsisSty-2" id="Ytname"></p>';
						itemlist += '</div></a></li>';
						$itemlist = $(itemlist);
						$("#resources").append($itemlist);
						var datalist = data.data;
						$itemlist.find("#resourceName").text(datalist.resourceName);
						$itemlist.find("#Ytname").text("用途："+datalist.supportedServices);
						$itemlist.find(".urlgo").attr("href", "resourceShow.html?resourceId="+datalist.resourceId);
						if(datalist.images.length > 0) {
							$itemlist.find("#userimg").attr("style", "background-image: url(/data/resource/" + datalist.images[0].imageSrc + ");");
						}
						if(datalist.resourceType==1){
							$itemlist.find(".uname").text(datalist.editProfessor.name);
							var userType = autho(datalist.editProfessor.authType, datalist.editProfessor.orgAuth, datalist.editProfessor.authStatus);
							$itemlist.find(".authiconNew").attr("title", userType.title);
							$itemlist.find(".authiconNew").addClass(userType.sty);
						}
						if(datalist.resourceType==2){
							if(datalist.organization.forShort){
								$itemlist.find(".uname").text(datalist.organization.forShort);
							}else{
								$itemlist.find(".uname").text(datalist.organization.name);
							}
							if(datalist.organization.authStatus==3){
								$itemlist.find(".authiconNew").addClass("authicon-com-ok").attr("title", "认证企业");
							}
						}
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	/*相关产品*/
	function relatedProducts() {
		$.ajax({
			"url": "/ajax/article/product",
			"type": "GET",
			"data": {
				"id": articleId,
				"rows":5
			},
			dataType: "json",
			"success": function(data) {
				if(data.success && data.data) {
					$("#oProducts").parents(".otherShow").removeClass("displayNone");
					for(var i = 0; i < data.data.length; i++) {
						var productId = data.data[i].product;
						relatedProductsList(productId)
					}
					
				}
			}
		});
	}
	function relatedProductsList(Id){
		$.ajax({
			"url" : "/ajax/product/qo",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{"id":Id},
			"success" : function(data) {
				if (data.success && data.data!=""){
					var $html=data.data
					var cnt="", img="../images/default-product.jpg"
					if($html.images) {
						var subs = strToAry($html.images)
						if(subs.length > 0) {
							img="/data/product" + subs[0]
						}
					}
					if($html.cnt){
						cnt="简介："+$html.cnt
					}
					var itemlist = '<li data-id="'+$html.id+'">'
						itemlist += '<a class="flexCenter OflexCenter"><div class="madiaHead resourceHead" style="background-image:url('+img+')"></div>';
						itemlist += '<div class="madiaInfo OmadiaInfo">';
						itemlist += '<p class="ellipsisSty h1Font" id="usertitle">'+$html.name+'</p>';
						itemlist += '<p class="ellipsisSty-2 h2Font">'+cnt+'</p>';
						itemlist += '</div></a></li>';
			
					$("#oProducts").append(itemlist)
					
				}
			}
		});
	}
	
	/*相关服务*/
	function relatedServices() {
		$.ajax({
			"url": "/ajax/ware/byArticle",
			"type": "GET",
			"data": {
				"id": articleId,
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
	$("#oService").on("click","li",function(){
		var id = $(this).attr("data-id");
		location.href = "sevriceShow.html?sevriceId=" + id;
	})
	$("#oProducts").on("click","li",function(){
		var id = $(this).attr("data-id");
		location.href = "productShow.html?productId=" + id;
	})
	
	function keysli() {
		$("#tagList li").each(function(i) {
			var liid = $(this).text();
			experarray.push(liid);
		});
		return $.unique(experarray);
	}
	//关键词标签点击进去搜索
	$(".tagList").on("click","li",function(){
		var tagText = $(this).find("p").text();
		location.href = "searchNew.html?searchContent=" + tagText + "&tagflag=3";
	})
	//相关企业
	function companylist() {
		$.ajax({
		url:"/ajax/article/ralateOrg",
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		data: {
			"articleId": articleId,
		},
		success: function(data) {
			if(data.success) {
				
				var $data=data.data;
				if($data.length) {
					$("#busList").parents(".form-item").show();
				}
				for(var i=0;i<$data.length;i++) {
					angleBus.call($data[i])
				}
			}
		},
		error: function() {
			$.MsgBox.Alert('提示', '服务器请求失败')
		}
	});
	}
	function angleBus() {
		$.ajax({
			url: "/ajax/org/" +this.orgId,
			type: "GET",
			dataType: "json",
			context: $("#busList"),
			success: function(data) {
				if(data.success) {
					busfil.call(this,data.data);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	function busfil($data) {
		var itemlist = '<li><a href="" target="_blank" class="flexCenter urlgo">';
		itemlist += '<div class="madiaHead cmpHead">';
		itemlist += '<div class="boxBlock"><img class="boxBlockimg companyImg"></div></div>';
		itemlist += '<div class="madiaInfo">';
		itemlist += '<p class="h1Font"><span class="orgName"></span><em class="authiconNew"></em></p>';
		itemlist += '<p class="h2Font ellipsisSty"><span class="orgTit"></span> <span class="orgOther"></span></p>';
		itemlist += '</div></a></li>';
		$itemlist = $(itemlist);
		this.append($itemlist);
		var datalist = $data;
		var companyType = datalist.authStatus;
		if(datalist.forShort) {
			$itemlist.find(".orgName").text(datalist.forShort);
		} else {
			$itemlist.find(".orgName").text(datalist.name);
		}
		$itemlist.find(".urlgo").attr("href", "cmpInforShow.html?orgId=" + datalist.id);
		if(datalist.hasOrgLogo) {
			$itemlist.find(".companyImg").attr("src", "/images/org/" + datalist.id + ".jpg");
		} else {
			$itemlist.find(".companyImg").attr("src", "/images/default-icon.jpg");
		}
		if(companyType == 3) {
			$itemlist.find(".authiconNew").addClass("authicon-com-ok").attr("title", "科袖认证企业");;
		}
		var orgOther = "";
		if(datalist.industry) {
			orgOther = datalist.industry.replace(/,/gi, " | ");
		}
		$itemlist.find(".orgOther").text(orgOther);
	
		if(datalist.orgType == "2") {
			$(".orgTit").html(orgTypeShow[datalist.orgType] + "<span style='margin-right:10px;'></span>");
		}
	
	}
	//相关文章信息
	function relevantarticalList(id){
	    keysli();
		var data = {"keys":experarray,"ownerId":id,"articleId":articleId,"rows":10}
		$.ajax({
			"url" : "/ajax/article/ralateArticles",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :data,
			//"async":false,
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				console.log(data);
				if (data.success && data.data!=""){
					$("#abutartical").parent().parent().removeClass("displayNone");
					var itemlist = '';
					$("#abutartical").html("");
					for(var i = 0; i < data.data.length; i++) {
						var itemlist = '<li><a href="" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead artHead" id="userimg"></div>';
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty" id="resourceName"></p>';
							itemlist += '<p><span class="h2Font username2" style="margin-right:10px"></span><span class="time"></span></p>';
							itemlist += '</div></a></li>';
							$itemlist = $(itemlist);
							$("#abutartical").append($itemlist);
							var datalist = data.data[i];
							$itemlist.find("#resourceName").text(datalist.articleTitle);
							$itemlist.find(".urlgo").attr("href", "/"+pageUrl('a',datalist));
							if(datalist.articleImg!=undefined){
								$itemlist.find("#userimg").attr("style", "background-image: url(/data/article/" + datalist.articleImg + ");");
							}
							$itemlist.find(".time").text(commenTime(datalist.publishTime))
							if(datalist.articleType==1){
								$.ajax({
									"url" : "/ajax/professor/baseInfo/"+datalist.ownerId,
									"type" :  "GET" ,
									"dataType" : "json",
									"async":false,
									"success" : function($data) {
										if ($data.success && $data.data){
											$itemlist.find(".username2").text($data.data.name);
											
										}
									},
									"error":function(){
										$.MsgBox.Alert('提示','链接服务器超时')
									}
								});
							}
							if(datalist.articleType==2){
								$.ajax({
									"url" : "/ajax/org/"+datalist.ownerId,
									"type" :  "GET" ,
									"dataType" : "json",
									"async":false,
									"success" : function($data) {
										if ($data.success && $data.data){
											if($data.data.forShort){
												$itemlist.find(".username2").text($data.data.forShort);
											}else{
												$itemlist.find(".username2").text($data.data.name);
											}
										}
									},
									"error":function(){
										$.MsgBox.Alert('提示','链接服务器超时')
									}
								});
							}
							if(datalist.articleType==3){
								$.ajax({
									"url" : "/ajax/platform/info",
									"data":{id:datalist.ownerId},
									"type" :  "GET" ,
									"dataType" : "json",
									"async":false,
									"success" : function($data) {
										if ($data.success && $data.data){
											$itemlist.find(".username2").text($data.data.name);
										}
									},
									"error":function(){
										$.MsgBox.Alert('提示','链接服务器超时')
									}
								});
							}
							
					}
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	
	//拆解关键字
	function industryShow(data){
		if(data != undefined && data.length != 0 ){
			var subs=strToAry(data)
			if(subs.length>0){
				for (var i = 0; i < subs.length; i++) 
				{
					$("#tagList").append('<li class="delkeylist"><p class="h2Font">'+ subs[i] +'</p></li>');
				};
			}	
		}			
	}
	
	//文章点击点赞
	$('.thumbBlock').on("click",".thunbgo",function(){
		if (userid && userid != "null" && userid != null) {
			addAgree();
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	})
	
	/*判断文章是否被赞*/
	function isAgree(articleAgree) {
		var data = {"operateId": userid,"articleId": articleId}
		$.ajax({		
			url:"/ajax/article/isAgree",
			data:data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			
			async: false,
			success: function(data) {
				if(data.success){
					if(data.data!= null){
						$(".thumbBtn").html("已赞 <span>"+articleAgree+"</span>");
						$(".thumbBtn").addClass("thumbedBtn");
					}else{
						$(".thumbBtn").html("赞 <span>"+articleAgree+"</span>");
						$(".thumbBtn").addClass("thunbgo");
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('提示',"服务器链接超时");
			}
		});
	}
	
	/*点赞*/
	function addAgree() {
		var data = {"operateId": userid,"articleId": articleId,"uname":$.cookie("userName")}
		$.ajax({		
			url:"/ajax/article/agree",
			data:data,
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			async: false,
			success: function(data) {
				if(data.success){
					var articleAgreeval = $(".thumbBtn span").text();
					$(".thumbBtn").html("已赞 <span>"+(parseInt(articleAgreeval)+1)+"</span>");
					$(".thumbBtn").addClass("thumbedBtn");
					$(".thumbBtn").removeClass("thunbgo");
				}
			},
			error: function() {
				$.MsgBox.Alert('提示',"服务器链接超时");
			}
		});
	}
	
	//点击专家关注
	$("#expert").on('click','.attenSpan',function(){
		if(userid && userid != null && userid != "null") {
			if($(this).is('.attenedSpan')){
				cancelCollectionAbout($("#Zname").attr("dataid"),$(this), 1)
			} else {
				collectionAbout($("#Zname").attr("dataid"),$(this), 1);
			}	
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	})
	$("#enterprise").on('click','.attenSpan',function(){
		if(userid && userid != null && userid != "null") {
			if($(this).is('.attenedSpan')){
				cancelCollectionAbout($("#Qname").attr("dataid"),$(this), 6)
			} else {
				collectionAbout($("#Qname").attr("dataid"),$(this),6);
			}	
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	})
	//点击文章收藏
	$('#attention').on("click","em",function(){
		if (userid && userid != "null" && userid != null) {
			if($(this).is('.icon-collected')){
				cancelCollectionAbout(articleId,$(this),3)
			}else{
				collectionAbout(articleId,$(this),3)
			}	
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	})

	
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
				"url": "/ajax/feedback/error/article",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": articleId,
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
});