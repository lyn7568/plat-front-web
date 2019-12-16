$(function() {
	loginStatus(); //判断个人是否登录
	var userid = $.cookie("userid");
	var orgId = GetQueryString("orgId");
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/c.html?id="+orgId;
	}
	var rows = 20,
		dataO = {
			artPublishTime:"",
			artShareId:"",
			
			resPublishTime:"",
			resShareId:"",
			
			serModifyTime: "",
			
			prdModifyTime: ""
		},
		watchO={
			beiTime:"",
			beiProId:"",
		},
		ifHasDefaultUser=false,
		firstLinkman;

	var oAjax = function(url, dataS, otype, oFun,beforeFun,completeFun) {
			$.ajax({
				url:url,
				dataType: 'json',
				type: otype,
				data: dataS,
				traditional: true,
				beforeSend: beforeFun,
				success: function(res) {
					if(res.success) {
						oFun(res)
					}
				},
				complete:completeFun
	            
			});
		},	
		insertNodata = function (targetE,newStr) {
            var parent = document.getElementById(targetE).parentNode;
            var kong = document.createElement("div");
            kong.className = "con-kong";
            kong.innerHTML ='<div class="picbox picNull"></div>'+
			            '<div class="txtbox">暂时没有符合该搜索条件的内容</div>'
            if(newStr){
            	kong.querySelector(".txtbox").innerHTML = newStr;
            }
            if (parent.firstChild.className == "con-kong") {
                return
            } else {
                parent.insertBefore(kong,parent.firstChild);
            }

        },
        removeNodata = function (targetE) {
            var parent = document.getElementById(targetE).parentNode;
            if (parent.firstChild.className == "con-kong") {
                parent.removeChild(parent.firstChild);
            } else {
                return
            }
        },
       	getCmpInfo=function() {
       		oAjax("/ajax/org/" + orgId,{}, "get", function(data){
				var $info = data.data;
				if($info.resMgr){
					resourceListVal(true);
					serviceListVal(true);
					$(".establishments").show()
				}
				if(!$info.colMgr && !$info.resMgr){
					productListVal(true);
					$(".productions").show()
				}
				if($info.hasOrgLogo) {
					$("#proHead").attr("src", "/images/org/" + $info.id + ".jpg");
				}else{
					$("#proHead").attr("src", "/images/default-icon.jpg");
				}
				if($info.forShort) {
					$("#proName").text($info.forShort);
				} else {
					$("#proName").text($info.name);
				}
				demandListVal(true, $info.name);
				commerceInfo($info.name);//工商信息
				if($info.authStatus == "3") {
					$("#proAuth").addClass("authicon-com-ok");
					$("#proAuth").attr("title", "科袖认证企业");
				}
				if($info.city) {
					$("#proAddress").html($info.city + "<span style='margin-right:10px;'></span>");
				}
				var proOther = "";
				if($info.industry) {
					proOther = $info.industry.replace(/,/gi, " | ");
				}
				$("#proOther").text(proOther);
				if($info.orgType == "2") {
					$("#proTit").html(orgTypeShow[$info.orgType] + "<span style='margin-right:10px;'></span>");
				}
				var llqtitle = $info.name + "-" + proOther + "科袖网"; //修改浏览器title信息
				document.title = llqtitle;
				//简介
				if($info.descp) {
					$("#item1user>.nodatabox").addClass("displayNone");
					$("#descpS").parents(".coninfobox").removeClass("displayNone");
					$("#descpS").text($info.descp);
				} else {
					$("#descpS").parents(".coninfobox").addClass("displayNone");
				}
				//学术领域		
				if($info.subject) {
					$("#item1user>.nodatabox").addClass("displayNone");
					$("#subjectShow").parents(".coninfobox").removeClass("displayNone");
					
					var subs=strToAry($info.subject)
					if(subs.length > 0) {
						for(var i = 0; i < subs.length; i++) {
							$("#subjectShow").append("<li>" + subs[i] + "</li>");
						};
					}
				} else {
					$("#subjectShow").parents(".coninfobox").addClass("displayNone");
				}
				//企业资质
				if($info.qualification) {
					var subs=strToAry($info.qualification)
					if(subs.length > 0) {
						for(var i = 0; i < subs.length; i++) {
							$("#qualification").append("<li><div class='h4tit'>" + subs[i] + "</div></li>");
						};
					}
				} else {
					$("#qualification").parents(".coninfobox").hide();
				}

				//企业详情
				$("#orgName").text($info.name);
				if($info.orgSize) {
					$("#orgSize").text(orgSizeShow[$info.orgSize]);
				} else {
					$("#orgSize").parent("li").hide();
				}
				if($info.industry) {
					$("#orgIndustry").text($info.industry);
				} else {
					$("#orgIndustry").parent("li").hide();
				}
				if($info.city) {
					$("#orgCity").text($info.city);
				} else {
					$("#orgCity").parent("li").hide();
				}
				if($info.orgType) {
					$("#orgType").text(orgTypeShow[$info.orgType]);
				} else {
					$("#orgType").parent("li").hide();
				}

				if($info.foundTime) {
					$("#foundTime").text(TimeTr($info.foundTime));
				} else {
					$("#foundTime").parent("li").hide();
				}
				if($info.orgUrl) {
					$("#orgUrl").text($info.orgUrl);
				} else {
					$("#orgUrl").parent("li").hide();
				}
				if($info.addr) {
					$("#cmpAddress").text($info.addr);
				} else {
					$("#cmpAddress").parent("li").hide();
				}

				var weibotitle = $info.name;
				var weibourl = window.location.href;
				var weibopic = "http://" + window.location.host + "/images/org/" + $info.id + ".jpg";
				$("#weibo").attr("href", "http://service.weibo.com/share/share.php?appkey=3677230589&title=" + encodeURIComponent(weibotitle) + "&url=" + encodeURIComponent(weibourl) + "&pic=" + encodeURIComponent(weibopic) + "&content=utf-8" + "&ralateUid=6242830109&searchPic=false&style=simple");
			});
		},
        commerceInfo=function(oName){
			oAjax("/ajax/org/regInfo",{
				"name": oName
			}, "get", function(data){
				if(data.data) {
					$("#comMes").parents(".coninfobox").show();
					var $data = data.data;
					var str = "";
					if($data.num) {
						str += "<li>工商注册号：" + $data.num + "</li>"
					}
					if($data.code) {
						str += "<li>组织机构代码：" + $data.code + "</li>"
					}
					if($data.creditCode) {
						str += "<li>统一信用代码：" + $data.creditCode + "</li>"
					}
					if($data.type) {
						str += "<li>企业类型：" + $data.type + "</li>"
					}
					if($data.industry) {
						str += "<li>行业：" + $data.industry + "</li>"
					}
					if($data.operatingPeriod) {
						str += "<li>营业期限：" + $data.operatingPeriod + "</li>"
					}
					if($data.dayOfApproval) {
						str += "<li>核准日期：" + $data.dayOfApproval + "</li>"
					}
					if($data.manager) {
						str += "<li>登记机关：" + $data.manager + "</li>"
					}
					if($data.addr) {
						str += "<li>注册地址：" + $data.addr + "</li>"
					}
					if($data.scopeOfBusiness) {
						str += "<li>经营范围：" + $data.scopeOfBusiness + "</li>"
					}
					$("#comMes").html(str);
				}
			});
		},
       	demandListVal=function(isbind, par) {
			oAjax("/ajax/demand/pq/org",{
				"state":[1],
    			'oname':par,
				"pageSize":5
			}, "get", function(data){
				var $info = data.data.data;
				if($info.length > 0){
					$("#showDemand").parents(".coninfobox").removeClass("displayNone");
					$("#item1user>.nodatabox").addClass("displayNone");
					for(var i = 0; i < $info.length; i++) {
						var liStr=$("<li></li>").appendTo("#showDemand");
						var $data=$info[i];
						var sowU="";
						if($data.pageViews!=0){
							sowU='<li><span>浏览量 '+$data.pageViews +'</span></li>'
						}
						var strCon='';
							strCon+='<a class="" target="_blank" href="demandShow.html?demandId='+$data.id+'" class="madiaInfo">'
							strCon+='<p class="h1Font ellipsisSty">'+ $data.title +'</p>'
							strCon+='<ul class="showliTop h3Font clearfix">'
							strCon+='<li><span>发布于 '+TimeTr($data.createTime)+'</span></li>'
							strCon+= sowU
							strCon+='</ul>'
							strCon+='<p class="h2Font ellipsisSty-2">'+$data.descp+'</p>'
							strCon+='<ul class="showli clearfix h3Font">'
							
							if($data.city){ strCon+='<li>所在城市：'+$data.city+'</li>' }
							if($data.duration!=0){ strCon+='<li>预计周期：'+demandDuration[$data.duration]+'</li>' }
							if($data.cost!=0){ strCon+='<li>费用预算：'+demandCost[$data.cost]+'</li>' }
							if($data.invalidDay){ strCon+='<li>有效期至：'+TimeTr($data.invalidDay)+'</li>' }
							
							strCon+='</ul>'
							strCon+='</a>'
						$(strCon).appendTo(liStr);
					}
				}else{
					$("#showDemand").parents(".needinfobox").addClass("displayNone");
				}
			})
		},
        articalListVal=function(isbind){
			var aimId="proArticel",aimIdF="showArticle",newStr="企业尚未发布任何文章"
			oAjax("/ajax/article/publish",{
				"category": "2",
				"owner":orgId,
				"publishTime":dataO.artPublishTime,
				"shareId": dataO.artShareId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".coninfobox").removeClass("displayNone");
					dataO.artPublishTime = $info[$info.length - 1].publishTime;
					dataO.artShareId = $info[$info.length - 1].shareId;
			
					for(var i = 0; i < $info.length; i++) {
						var sowU="",hasImg="/images/default-artical.jpg"
						if($info[i].articleImg) {
							hasImg="/data/article/" + $info[i].articleImg
						}
						if($info[i].pageViews!=0){
							if($info[i].articleAgree!=0){
								sowU='<li><span>阅读量 '+$info[i].pageViews+'</span></li><li><span>赞 '+$info[i].articleAgree+'</span></li>'
							}else{
								sowU='<li><span>阅读量 '+$info[i].pageViews+'</span></li>'
							}
						}
						var itemlist = '<li>';
							itemlist += '<a href="/'+pageUrl('a',$info[i])+'" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead artHead" style="background-image:url(' + hasImg + ')"></div>';
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty-2">'+$info[i].articleTitle+'</p>';
							itemlist += '<ul class="h2Font clearfix">';
							itemlist += '<li><span class="time">' + commenTime($info[i].publishTime) + '</span></li>';
							itemlist += sowU
							itemlist += '<li><span class="leaveMsgCount"></span></li>';
							itemlist += '</ul></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						leaveMsgCount($info[i].articleId,1,$itemlist);
						
						if(isbind && i==0){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
							leaveMsgCount($info[0].articleId,1,$itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	articalListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		resourceListVal=function(isbind){
			var aimId="proResource",aimIdF="showResource",newStr="企业尚未发布任何资源"
			oAjax("/ajax/resource/publish",{
				"category": "2",
				"owner":orgId,
				"publishTime":dataO.resPublishTime,
				"shareId": dataO.resShareId,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.resPublishTime = $info[$info.length - 1].publishTime;
					dataO.resShareId = $info[$info.length - 1].shareId;
			
					for(var i = 0; i < $info.length; i++) {
						var hasImg='/images/default-resource.jpg'
						if($info[i].images.length) {
							hasImg="/data/resource/" + $info[i].images[0].imageSrc
						}
						
						var itemlist = '<li>';
							itemlist += '<a href="resourceShow.html?resourceId=' + $info[i].resourceId + '" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>';
							itemlist += '<div class="madiaInfo"><p class="h1Font ellipsisSty-2">' + $info[i].resourceName + '</p><p class="h2Font ellipsisSty">用途：' + $info[i].supportedServices + '</p></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						
						if(isbind && i==0){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	resourceListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		serviceListVal=function(isbind){
			var aimId="proService",aimIdF="showService",newStr="企业尚未发布任何服务"
			oAjax("/ajax/ware/publish",{
				"category":"2",
				"owner":orgId,
				"modifyTime":dataO.serModifyTime,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".form-item").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.serModifyTime = $info[$info.length - 1].modifyTime;
			
					for(var i = 0; i < $info.length; i++) {
						var cnt="", hasImg="../images/default-service.jpg"
						if($info[i].images) {
							var subs = strToAry($info[i].images)
							if(subs.length > 0) {
								hasImg="/data/ware" + subs[0]
							}
						}
						if($info[i].cnt) {
							cnt = "内容：" +$info[i].cnt; 
						}
						var itemlist = '<li>';
							itemlist += '<a href="sevriceShow.html?sevriceId=' + $info[i].id + '" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>';
							itemlist += '<div class="madiaInfo"><p class="h1Font ellipsisSty-2">' + $info[i].name + '</p><p class="h2Font ellipsisSty">' + cnt+ '</p></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						
						if(isbind && i==0){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	serviceListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		productListVal=function(isbind){
			var aimId="proProduct",aimIdF="showProduct",newStr="企业尚未发布任何产品"
			oAjax("/ajax/product/publish",{
				"owner":orgId,
				"modifyTime":dataO.prdModifyTime,
				"rows": rows
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					$("#"+aimIdF).parents(".leftconItem").find(".nodatabox").hide()
					$("#"+aimIdF).parents(".splitBlock").removeClass("displayNone");
					$("#"+aimIdF).parents(".coninfobox").show();
					dataO.prdModifyTime = $info[$info.length - 1].modifyTime;
			
					for(var i = 0; i < $info.length; i++) {
						var cnt="", hasImg="../images/default-product.jpg"
						if($info[i].images) {
							var subs = strToAry($info[i].images)
							if(subs.length > 0) {
								hasImg="/data/product" + subs[0]
							}
						}
						if($info[i].cnt) {
							cnt = "简介：" +$info[i].cnt; 
						}
						var itemlist = '<li>';
							itemlist += '<a href="productShow.html?productId=' + $info[i].id + '" class="flexCenter urlgo">';
							itemlist += '<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>';
							itemlist += '<div class="madiaInfo"><p class="h1Font ellipsisSty-2">' + $info[i].name + '</p><p class="h2Font ellipsisSty">' + cnt+ '</p></div>';
							itemlist += '</a></li>';
						var $itemlist = $(itemlist);
						$("#"+aimId).append($itemlist)
						
						if(isbind && i==0){
							var $itemlist = $(itemlist);
							$("#"+aimIdF).append($itemlist);
						}
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	serviceListVal(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		relevantarticalList=function(){//相关文章信息
			oAjax("/ajax/article/byAssOrg",{
				"id":orgId
			}, "get", function(data){
				if(data.data.length>0){
					$("#relateArt").parents(".conBlock").removeClass("displayNone");
					var itemlist = '';
					$("#relateArt").html("");
					for(var i = 0; i < data.data.length; i++) {
						var itemlist = '<li class="flexCenter"><a target="_blank" href="/'+ pageUrl('a',data.data[i]) +'" class="urlgo">';
							itemlist += '<p class="h2Font ellipsisSty-2"><em class="circlePre"></em>'+data.data[i].articleTitle+'</p>';
							itemlist += '</a></li>';
							$itemlist = $(itemlist);
						$("#relateArt").append($itemlist);
					}
				}
			});
		},
		likeExperts=function(){//感兴趣的企业
			oAjax("/ajax/org/ralateOrgs",{
				"orgId":orgId
			}, "get", function(data){
					var lengthT;
					if(data.data.length>5){
						lengthT=5;
					}else{
						lengthT=data.data.length
					}
					for(var i = 0; i < lengthT; i++) {
						var ExpId = data.data[i].id;
						(function(Id){
							oAjax("/ajax/org/"+Id,{}, "get", function(data){
								$("#relateCmp").parents(".conBlock").removeClass("displayNone");
								var name="",sty="",styT="",title="",hasImg="images/default-icon.jpg"
								if(data.data.forShort){
									name=data.data.forShort;
								}else{
									name=data.data.name;
								}
								if(data.data.authStatus==3){
									sty="authicon-com-ok"
									styT="科袖认证企业"
								}
								if(data.data.industry){
									title=data.data.industry.replace(/,/gi, " | ");
								}
								if(data.data.hasOrgLogo == 1) {
									hasImg="/images/org/" + data.data.id + ".jpg";
								}
								var itemlist = '<li class="flexCenter"><a target="_blank" href="cmpInforShow.html?orgId='+data.data.id+'" class="urlgo">';
									itemlist += '<div class="madiaHead cmpHead cmpHead2"><div class="boxBlock">';
									itemlist += '<img class="boxBlockimg" src="'+hasImg+'" /></div></div>';
									itemlist += '<div class="madiaInfo">';
									itemlist += '<p class="clearfix"><span class="h1Font ellipsisSty floatL" style="display:block;max-width:136px">'+name+'</span><em class="authiconNew floatL '+sty+'" title="'+styT+'"></em></p>';
									itemlist += '<p class="ellipsisSty h2Font">'+title+'</p>';
									itemlist += '</div></a></li>';
								$itemlist = $(itemlist);
								
								$("#relateCmp").append($itemlist);
							})
						})(ExpId)
					}
			});
		},
		queryPubCount=function(){
			oAjax("/ajax/watch/countProfessor",{//关注企业数量
				"id": orgId,
				"type":"6"
			}, "GET", function(data){
				$("#attenNum").text(data.data);
			});
			oAjax("/ajax/article/count/publish",{//文章总数
				"owner": orgId,
				"category":"2"
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#artCount").text(data.data);
				}
				if(data.data>99){
					$("#artCount").text("99+");
				}
			});
			oAjax("/ajax/resource/count/publish",{//资源总数
				"owner": orgId,
				"category":"2"
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#resCount").text(data.data);
				}
				if(data.data>99){
					$("#resCount").text("99+");
				}
			});
			oAjax("/ajax/ware/count/publish",{//服务总数
				"owner": orgId,
				"category":"2"
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#serCount").text(data.data);
				}
				if(data.data>99){
					$("#serCount").text("99+");
				}
			});
			oAjax("/ajax/product/count/publish",{//产品总数
				"owner": orgId
			}, "GET", function(data){
				if(data.data>0 && data.data<99){
					$("#productCount").text(data.data);
				}
				if(data.data>99){
					$("#productCount").text("99+");
				}
			});
		},
		attentMyself=function(isbind){
			var aimId="attendMy",newStr="企业尚未被任何人关注"
			oAjax("/ajax/watch/watchList",{//关注我的列表
				"watchObject": orgId,
				"createTime": watchO.beiTime,
				"professorId":watchO.beiProId,
				"rows":rows
			}, "GET", function(res){
				var $info = res.data;
				if($info.length > 0) {
					$("#"+aimId).show()
					watchO.beiTime = $info[$info.length - 1].createTime;
					watchO.beiProId = $info[$info.length - 1].professorId;
					
					for(var i = 0; i < $info.length; i++) {
						var liItem = document.createElement("li");
						document.getElementById("attendMy").appendChild(liItem);
						detailPro($info[i].professorId,liItem);
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeNodata(aimId);
                if($info.length == 0 && liLen == 0 ){
                	$("#"+aimId).hide()
                    insertNodata(aimId,newStr);
                }
                if(isbind){
                	$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					 	attentMyself(false)
					})
                }
				if ($info.length < rows) {
                    $("#"+aimId).parent().find(".js-load-more").unbind("click");
                    $("#"+aimId).parent().find(".js-load-more").hide();
                }
			},function(){
				$("#"+aimId).parent().find(".js-load-more").attr("disabled",true);
	       		$("#"+aimId).parent().find(".js-load-more").addClass("active");
			},function(){
				$("#"+aimId).parent().find(".js-load-more").removeAttr("disabled");
	        	$("#"+aimId).parent().find(".js-load-more").removeClass("active");
			})
		},
		detailPro=function(pid,liItem) {
			oAjax("/ajax/professor/baseInfo/" + pid,{},"get",function(data){
				var datalist=data.data;
				var userType = autho(datalist.authType, datalist.orgAuth, datalist.authStatus);
				var os = "";
				if(datalist.title) {
					if(datalist.orgName) {
						os = datalist.title + "，" + datalist.orgName;
					} else {
						os = datalist.title;
					}
				} else {
					if(datalist.office) {
						if(datalist.orgName) {
							os = datalist.office + "，" + datalist.orgName;
						} else {
							os = datalist.office;
						}
					} else {
						if(datalist.orgName) {
							os = datalist.orgName;
						}
					}
				}
				var baImg = "../images/default-photo.jpg";
				if(datalist.hasHeadImage == 1) {
					baImg = "/images/head/" + datalist.id + "_l.jpg";
				}
				var strAdd = '';
					strAdd += '<a target="_blank" href="userInforShow.html?professorId='+ datalist.id +'" class="flexCenter urlgo">';
					strAdd += '<div class="madiaHead useHead" style="width: 80px;height: 80px;margin-top: -40px;background-image:url(' + baImg + ')"></div>';
					strAdd += '<div class="madiaInfo" style="padding-left:92px"><p class="h1Font ellipsisSty">' + datalist.name + '</span><em class="authicon ' + userType.sty + '" title="'+userType.title+'"></em></p>';
					strAdd += '<p class="h2Font ellipsisSty">' + os + '</p>';
					strAdd += '</div>';
					strAdd += '</a>';
				liItem.innerHTML = strAdd
			})
		},
		isInArray2=function(arr,value){
		    var index = $.inArray(value,arr);
		    if(index >= 0){
		        return true;
		    }
		    return false;
		},
		getDefaultLink=function(){
			oAjax("/ajax/org/linkman/queryAll",{
				"oid": orgId
			}, "GET", function(data){
				if(data.success) {
					var $data = data.data,linkmans=[];
					if($data.length>0){
						for(var i = 0; i < $data.length; i++){
							linkmans.push($data[i].pid)
						}
						if(!isInArray2(linkmans,userid)){
							firstLinkman=$data[0].pid
							ifHasDefaultUser = true;
							$("#conbtn").removeClass('consultedSpan')
							//点击联系按钮
							$("#conbtn").on('click', function(){
								if(userid && userid != null && userid != "null") {
									if(ifHasDefaultUser){
										location.href="tidings.html?id="+firstLinkman
									}
								} else {
									quickLog();
									operatTab();
									closeLog();
								}
							});
						};
					}
				}
			});
		},
		bindClickFun=function(){
			//点击关注按钮
			$("#attentBtn").on('click', function() {
				if(userid && userid != null && userid != "null") {
					if($(this).is('.attenedSpan')){
						cancelCollectionAbout(orgId,$(this),6)
					} else {
						collectionAbout(orgId,$(this), 6);
					}
					queryPubCount();
					watchO={
						beiTime:"",
						beiProId:"",
					}
					$("#item8drop1").find("ul").html("")
					$("#item8drop1").find(".js-load-more").show();
					attentMyself(true);
				}else{
					quickLog();
					operatTab();
					closeLog();
				}
			});	
			//点击查看全部服务
			$(".coninfobox").on("click", "#seeMoreS", function() {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab9user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item9user").show();
			})
			//点击查看全部产品
			$(".coninfobox").on("click", "#seeMorePd", function() {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab10user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item10user").show();
			})
			//点击查看全部资源
			$(".coninfobox").on("click", "#seeMoreR", function() {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab2user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item2user").show();
			})
			//点击查看全部文章
			$(".coninfobox").on("click", "#seeMoreA", function() {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
				$("#tab3user").addClass("liNow").siblings().removeClass("liNow");
				$("#item1user").hide();
				$("#item3user").show();
			})
			
			$("#attendmyGo").on("click",function(){
				$(".mainNavUl li.rightbtn").addClass("liNow").siblings().removeClass("liNow");
				$("#item8more").show();
				$("#item8user").show().siblings().hide();
				$(".moreBuUl li.attendMy").addClass("liNow").siblings().removeClass("liNow");
				$("#item8drop1").show().siblings().hide();
				attentMyself();
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
					oAjax("/ajax/feedback/error/org",{
						"id": orgId,
						"cnt":cntCon,
						"user":cntUser
					}, "POST", function(data){
						backSuccessed();
					});
				}
			})
	
		}
	
	pageViewLog(orgId,6)
	queryPubCount();
	getCmpInfo(); //获取详细信息
	getDefaultLink();
	ifcollectionAbout(orgId,$(".goSpan").find(".attenSpan"),6);

	articalListVal(true);
	bindClickFun();
	
	relevantarticalList();//相关文章
	likeExperts();//感兴趣
	attentMyself(true);
})
