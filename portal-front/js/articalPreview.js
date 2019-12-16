/*文章预览*/
$(function() {
	loginStatus();//判断个人是否登录
	var articleId = GetQueryString("articleId");
	articleshow();
	relevantExperts();
	relevantResources(); 
	relatedServices();
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
	//文章内容
	function articleshow(){
		$.ajax({
			"url" : "/ajax/article/query",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{"articleId":articleId},
			"success" : function(data) {
				if (data.success){
					$("#articleTitle").text(data.data.articleTitle);
					$("#articleContent").html(data.data.articleContent);
					if(data.data.articleImg){
						$("#articleImg").attr("style", "background-image: url(/data/article/" + data.data.articleImg + ")");
					}else{
						$("#articleImg").attr("style", "background-image: url(../images/default-artical.jpg)");
					}
					$("#tagList").text(industryShow(data.data.subject));
					if(data.data.articleType==1){
						$("#expert").removeClass("displayNone");
						expert(data.data.ownerId);
					}
					if(data.data.articleType==2){
						$("#enterprise").removeClass("displayNone");
						cmpFun(data.data.ownerId);
						companylist();
					}
                    if(data.data.articleType==3){
                        $("#enterprise").removeClass("displayNone");
                        platform(data.data.ownerId);
                    }
				}
				var articletitle = data.data.articleTitle + "-科袖网";
				window.setTimeout(function() {
					document.title = articletitle;
				}, 500);
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
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
	//专家信息
	function expert(professorId){
		$.ajax({
			"url" : "/ajax/professor/baseInfo/"+professorId,
			"type" :  "GET" ,
			"dataType" : "json",
			"success" : function(data) {
				if (data.success && data.data){
					if(data.data.hasHeadImage==1) {
						$("#Zimg").attr("style", "background-image: url(/images/head/" + data.data.id + "_l.jpg);");
					}
					if(data.data.title==""){
					  var title = data.data.office;
					}else{
					  var title = data.data.title;
					}
					$("#Zname").text(data.data.name);
					$("#Ztitle").text(title);
					$("#ZorgName").text(data.data.orgName);
					var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
					$("#ZauthFlag").attr("title", userType.title);
					$("#ZauthFlag").addClass(userType.sty);
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
					$("#Qname").text(data.data.name);
					if(data.data.hasOrgLogo) {
						$("#companyImg").attr("src", "/images/org/" + data.data.id + ".jpg");
					}else{
						$("#companyImg").attr("src", "/images/default-icon.jpg");
					}
					if(data.data.authStatus==3){
						$("#QauthFlag").addClass("authicon-com-ok").attr("title", "认证企业");;	
					}
					if(data.data.industry) {
						$("#Qindustry").text(data.data.industry.replace(/,/gi, " | "));
					}
					if(!data.data.colMgr && !data.data.resMgr) {
						relatedProducts();
					}
					if(data.data.colMgr) {
						queryFileAtach();
					}
				}
			}
		});
	}

	/*平台信息*/
    function platform(platform) {
        $.ajax({
            "url": "/ajax/platform/info",
			"data":{id: platform},
            "type": "get",
            "dataType" : "json",
            "success": function(data) {
                if(data.success && data.data) {
                    $("#Qname").text(data.data.name);
                    if(data.data.logo!=null) {
                        $("#companyImg").attr("src", "/data/platform" + data.data.logo);
                    }else{
                        $("#companyImg").attr("src", "/images/default-plat.jpg");
                    }
                    if(data.data.industry) {
						$("#Qindustry").text(data.data.industry.replace(/,/gi, " | "));
					}
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
					var itemlist = '<li><a class="flexCenter">';
						itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
						itemlist += '<div class="madiaInfo">';
						itemlist += '<p><span class="h1Font" id="userName"></span><em class="authiconNew" title=""></em></p>';
						itemlist += '<p class="ellipsisSty h2Font" id="usertitle"></p>';
						itemlist += '<p class="h2Font ellipsisSty" id="researchAreas"></p>';
						itemlist += '</div></a></li>';
						$itemlist = $(itemlist);
						$("#relevantExperts").append($itemlist);
						var title = data.data.title || "";
						var office = data.data.office || "";
						if(title != "") {
							 title = title  + " , ";
						}
						$itemlist.find("#userName").text(data.data.name);
						$itemlist.find("#usertitle").text(title + office);
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
							$itemlist.find(".uname").text(datalist.organization.name);
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
	
	//拆解关键字
	function industryShow(data){
		if(data != undefined && data.length != 0 ){
			var subs=strToAry(data)
			if(subs.length>0){
				for (var i = 0; i < subs.length; i++) 
				{
					$("#tagList").append('<li><p class="h2Font">'+ subs[i] +'</p></li>');
				};
			}	
		}			
	}
	
	//相关企业
	function companylist() {
		$.ajax({
		url:"/ajax/article/ralateOrg",
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		data: {
			"articleId": articleId,
		},
		timeout: 10000, //超时设置
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
			timeout: 10000,
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
	
	$("#oService").on("click","li",function(){
		var id = $(this).attr("data-id");
		location.href = "sevriceShow.html?sevriceId=" + id;
	})
	$("#oProducts").on("click","li",function(){
		var id = $(this).attr("data-id");
		location.href = "productShow.html?productId=" + id;
	})
});


