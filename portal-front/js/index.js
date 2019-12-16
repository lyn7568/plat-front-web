
$(function(){
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/index.html";
	}
	$(".headnav li").eq(0).addClass("navcurrent");
	loginStatus();//判断个人是否登录
	var userid = $.cookie('userid');
	//加载页面时，判断企业账号是否登录
	var orgid = $.cookie('orgId');
	$("#cmpSettled").on("click",function(){
		if (orgid && orgid != "null" && orgid != null) {
			location.href="cmp-portal/cmp-needList.html"
		}else{
			location.href="cmp-portal/cmp-settled-reg.html"
		}
	})
	
	$("#gocmp").on("click",function(){
		if (orgid && orgid != "null" && orgid != null) {
			location.href="cmp-portal/cmp-needList.html"
		}else{
			location.href="cmp-portal/cmp-settled-log.html"
		}
	})
	var sureOrg ='<div class="mb-list mb-listL" style="text-align:left"><p class="msg-tit">请先确认您的所在机构：<small>（建议填写正式全称）</small></p>'+
		'<div style="height:56px;"><input type="text" class="form-control sureOrg" placeholder="如：北京科袖科技有限公司" /><p class="msg-warning">50字以内</p></div>'+
		'<div class="msg-tip"><p>注：</p><p>1. 只能发布您所在机构的需求。</p><p>2. 当您在资料中变更了所在机构后，该需求将会自动关闭。</p></div></div>';

	$(".setTimeBlock").on("focus",".sureOrg",function(){
		$(".msg-warning").show();
	}).on("blur",".sureOrg",function(){
		$(".msg-warning").hide();
	}).on("keyup",".sureOrg",function(){
		if($(this).val().length>0){
			$(".setTimeBlock").find(".mb_btnOkpub").removeAttr("disabled");
		}else{
			$(".setTimeBlock").find(".mb_btnOkpub").attr("disabled",true)
		}
	})
	
	/*发布需求*/
	$("#postNow").click(function(){
		if(userid=="null"||userid==undefined){
			location.href="login.html";
			return;
		}
	    window.open("postDemand.html");
	})
	/*我是专家*/
	$("#JoinKeXiu").click(function(){
		if(userid=="null"||userid==undefined){
			location.href="login.html";
		}
		location.href="expert-authentication.html"
	})
	mouseIn()
	ruZhuCmp()
	resShare()
	hotArea()
//	carouselThis()
	var thisTabcon=$("#hotArea>li:first-child").text();
	var thisTabcon2=$("#hotArea2>li:first-child").text();
	$("#hotArea>li").eq(0).addClass("liNow");
	$("#hotArea2>li").eq(0).addClass("liNow");
	proShow(thisTabcon)
	teamShow(thisTabcon2)
	
	$("#hotArea").on("click","li",function(){
		thisTabcon=$(this).text();
		$("#hotArea>li").eq($(this).index()).addClass("liNow").siblings().removeClass("liNow")
		proShow(thisTabcon);
	})
	$("#hotArea2").on("click","li",function(){
		thisTabcon2=$(this).text();
		$("#hotArea2>li").eq($(this).index()).addClass("liNow").siblings().removeClass("liNow")
		teamShow(thisTabcon2);
	})
	$(".con-ulList").on("mouseenter","li",function(){
		$(this).find(".boxBlockimg").css("transform", "scale(1.1)");
	}).on("mouseleave","li",function(){
		$(this).find(".boxBlockimg").css("transform", "scale(1)");
	})
	function ruZhuCmp(){//入驻企业
		$.ajax({
			url: "/ajax/org/index/search",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data:{
				"rows": 6
			},
			success: function(data) {
				if(data.success) {
					var $info = data.data;
					for(var i = 0; i < $info.length; i++) {
						var liStr=$("<li></li>").appendTo("#ruZhuCmp");
						var cmpname,imgurl='../images/default-icon.jpg'
						if($info[i].hasOrgLogo) {
							imgurl='/images/org/' + $info[i].id + '.jpg';
						}
						if($info[i].forShort){
							cmpname = $info[i].forShort;
						}else{
							cmpname = $info[i].name;
						}
						var oSty={sty:"",tit:""};
						if($info[i].authStatus == 3) {
							oSty.sty="authicon-com-ok"
							oSty.tit="科袖认证企业"
						}
						var orgOther = "",orgType="";
						if($info[i].industry) {
							orgOther = $info[i].industry.replace(/,/gi, " | ");
						}
						if($info[i].orgType == "2") {
							orgType = orgTypeShow[$info[i].orgType] + "<span style='margin-right:16px;'></span>";
						}
						var strCon='';
						strCon += '<a target="_blank" href="cmpInforShow.html?orgId='+$info[i].id+'">'
						strCon += '<div class="madiaHead">'
						strCon += '<div class="boxBlock"><img class="boxBlockimg" src="'+imgurl+'"></div></div>'
						strCon += '<div class="madiaInfo">'
						strCon += '<div class="h1Font clearfix">'
						strCon += 	'<span class="qiyego ellipsisSty">'+cmpname+'</span>'
						strCon += 	'<span class="authiconNew '+oSty.sty+'" title="'+oSty.tit+'"></span>'
						strCon += '</div>'
						strCon += '<div class="h3Font ellipsisSty">'
						strCon += 	'<span>'+orgType+orgOther+'</span>'
						strCon += '</div>'
						strCon += '</div></a>'
						liStr.html(strCon);
					}
				}
			},
			error: function() {

			}
		})
	}
	function resShare(){//资源共享
		$.ajax({
			url: "/ajax/resource/index/search",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data:{
				"rows":8
			},
			success: function(data) {
				if(data.success) {
					var $info = data.data;
					for(var i = 0; i < $info.length; i++) {
						var liStr=$("<li></li>").appendTo("#resShare");
						var cmpname,imgurl='../images/default-resource.jpg'
						var oSty={sty:"",tit:""};
						if($info[i].images.length > 0) {
							imgurl='/data/resource/' + $info[i].images[0].imageSrc 
						}
						if($info[i].resourceType == 1) { //个人资源
							cmpname = $info[i].editProfessor.name;
							oSty = autho($info[i].editProfessor.authType, $info[i].editProfessor.orgAuth, $info[i].editProfessor.authStatus);
						} else if($info[i].resourceType == 2) { //企业资源
							if($info[i].organization.forShort) {
								cmpname = $info[i].organization.forShort;
							}else{
								cmpname = $info[i].organization.name;
							}
							if($info[i].organization.authStatus==3){
								oSty.sty="authicon-com-ok"
								oSty.tit="科袖认证企业"
							}
						}
						var strCon='';
						strCon += '<a target="_blank" class="madiaOuter" href="resourceShow.html?resourceId='+$info[i].resourceId+'" style="background-image:url('+imgurl+');">'
//						strCon += '<div class="madiaHead" style="background-image:url('+imgurl+')"></div>'
						strCon += '<div class="madiaInfo madiaInner">'
						strCon += '<div class="h1Font ellipsisSty-2">'+$info[i].resourceName+'</div>'
						strCon += '<div class="h3Font clearfix">'
						strCon += 	'<span class="qiyego ellipsisSty">'+cmpname+'</span>'
						strCon += 	'<span class="authiconNew '+oSty.sty+'" title="'+oSty.tit+'"></span>'
						strCon += '</div>'
						strCon += '</div></a>'
						liStr.html(strCon);
					}
					$(".madiaOuter").each(function(i){
						$(this).showOn($(".madiaInner").eq(i));
					});
				}
			},
			error: function() {

			}
		})
	}
	function proShow(thiscon){//专家
		$.ajax({
			url: "/ajax/professor/index/search",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:false,
			data:{
				"subject":thiscon,
				"rows": 6
			},
			success: function(data) {
				if(data.success) {
					var $info = data.data;
					//console.log(data)
					$("#proShow").html("");
					for(var i = 0; i < $info.length; i++) {
						var liStr=$("<li class='flexCenter'></li>").appendTo("#proShow");
						var cmpname,imgurl='../images/default-photo.jpg'
						var oSty=autho($info[i].authType, $info[i].orgAuth, $info[i].authStatus);
						cmpname = $info[i].name;
						if($info[i].hasHeadImage) {
							imgurl='/images/head/' + $info[i].id + '_l.jpg';
						}
						var oTitle='';
						if($info[i].title) {
							oTitle = $info[i].title;
							if($info[i].orgName){
								oTitle = $info[i].title +'，'+ $info[i].orgName;
							}
						} else {
							if($info[i].office) {
								oTitle = $info[i].office;
								if($info[i].orgName){
									oTitle = $info[i].office +'，'+ $info[i].orgName;
								}
							}
						}
						var oResult=""
						if($info[i].researchAreas.length > 0){
							oResult = '研究方向：';
							for(var n = 0; n < $info[i].researchAreas.length; n++) {
								oResult += $info[i].researchAreas[n].caption
								if(n < $info[i].researchAreas.length - 1) {
									oResult += "；"
								}
							}
						}
						
						var strCon='';
						strCon += '<a target="_blank" href="userInforShow.html?professorId='+$info[i].id+'">'
						strCon += '<div class="madiaHead" style="background-image:url('+imgurl+')"></div>'
						strCon += '<div class="madiaInfo">'
						strCon += '<div class="h1Font clearfix">'
						strCon += 	'<span class="qiyego ellipsisSty">'+cmpname+'</span>'
						strCon += 	'<span class="authiconNew '+oSty.sty+'" title="'+oSty.tit+'"></span>'
						strCon += '</div>'
						strCon += '<div class="h3Font ellipsisSty" style="margin-top:0;">'+oTitle+'</div>'
						strCon += '<div class="h3Font ellipsisSty-2">'+oResult+'</div>'
						strCon += '</div></a>'
						liStr.html(strCon);
					}
				}
			},
			error: function() {

			}
		})
	}
	function teamShow(thiscon){
		$.ajax({
			url: "/ajax/team/pq",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:false,
			data:{
				"subject":thiscon,
				"status": 3,
				"pageSize": 6,
				"pageNo": 1
			},
			success: function(data) {
				if(data.success) {
					var $info = data.data.data;
					//console.log(data)
					$("#teamShow").html("");
					for(var i = 0; i < $info.length; i++) {
						var liStr=$("<li class='flexCenter'></li>").appendTo("#teamShow");					
						var strCon='';
						strCon += '<a target="_blank" href="teamInfoShow.html?id='+$info[i].id+'">'
						strCon += '<div class="madiaInfo" style="padding-left:0">'
						strCon += '<div class="h1Font clearfix">'
						strCon += 	'<span class="qiyego ellipsisSty">'+$info[i].name+'</span>'
						strCon += '</div>'
						strCon += '<div class="h3Font ellipsisSty" style="margin-top:0;">'+$info[i].orgName+' '+ $info[i].city +'</div>'
						strCon += '<div class="h3Font ellipsisSty-2">行业领域：'+$info[i].industry+'</div>'
						strCon += '</div></a>'
						liStr.html(strCon);
					}
				}
			},
			error: function() {

			}
		})
	}
	function hotArea(){//领域名称
		$.ajax({
			url: "/ajax/dataDict/qaDictCode",
			type: "GET",
			timeout: 10000,
			async:false,
			dataType: "json",
			data: {
				"dictCode":"SUBJECT",
			},
			success: function(data) {
				if(data.success) {
					var $info = data.data;
					//console.log(data)
					for(var i = 0; i < $info.length; i++) {
						$("<li>"+$info[i].caption+"</li>").appendTo("#hotArea");
						$("<li>"+$info[i].caption+"</li>").appendTo("#hotArea2");
					}
				}
			},
			error: function() {

			}
		})
	}
	
	//kexiu carousel
	function carouselThis(){
		$.ajax({
			url: "/ajax/article/find",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data:{
				"col": 7,
				"pageSize": 3,
				"pageNo": 1
			},
			success: function(data) {
				if(data.success) {
					$("#carouselThis").html("");
					var $info = data.data.data;
					for(var i = 0; i < $info.length; i++) {
						var liStr=$('<div class="item"></div>').appendTo("#carouselThis");
						if(i==0){
							$(".item").addClass("active")
						}
						var imgurl="../images/default-artical.jpg";
						if($info[i].articleImg) {
							imgurl ='/data/article/' + $info[i].articleImg ;
						}
						if($info[i].articleType==1){
							
						}
						var strCon='';
						strCon += '<a target="_blank" class="aitemLink" href="/'+ pageUrl('a',$info[i])+'" style="background-image: url('+ imgurl+')" alt="'+$info[i].articleTitle+'">'
						strCon += '<div class="carousel-caption">'
						strCon += '<div class="homeinfo">'
						strCon += 	'<p class="h1Font ellipsisSty-2">'+ $info[i].articleTitle+'</p>'
//						strCon += 	'<p class="h2Font ">'+ authorInfo +'</p>'
//						strCon += 	'<p class="h2Font">'+ $info[i].articleContent +'</p>'
						strCon += '</div>'
						strCon += '</div></a>'
						liStr.html(strCon);
//						if($info[i].articleType==1){
//							userFun($info[i].professorId, liStr);
//						}else{
//							cmpFun($info[i].orgId, liStr);
//						}
					}
				}
			},
			error: function() {

			}
		})
	}
	
	/*用户信息*/
	function userFun(id,$listItem) {
		$.ajax({
			"url": "/ajax/professor/baseInfo/" + id,
			"type": "get",
			"async": true,
			"success": function(data) {
				if(data.success && data.data) {
					$listItem.find(".ownerName").text(data.data.name);
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
	/*企业用户信息*/
	function cmpFun(id,$listItem) {
		$.ajax({
			"url": "/ajax/org/" + id,
			"type": "get",
			"async": true,
			"success": function(data) {
				if(data.success && data.data) {
					if(data.data.forShort) {
						$listItem.find(".ownerName").text(data.data.forShort);
					}else{
						$listItem.find(".ownerName").text(data.data.name);
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
	//资源mouseIn效果
	function mouseIn(){
		$.fn.extend({
			showOn : function(div){
				var w = this.width(),
					h = this.height(),
					xpos = w/2,
					ypos = h/2,
					eventType = "",
					direct = "";
				this.css({"overflow" : "hidden", "position" : "relative"});
				div.css({"position" : "absolute", "top" : this.width()});
				this.on("mouseenter mouseleave", function(e){
					var oe = e || event;
					var x = oe.offsetX;
					var y = oe.offsetY;
					var angle = Math.atan((x - xpos)/(y - ypos)) * 180 / Math.PI;
					if(angle > -45 && angle < 45 && y > ypos){
						direct = "down";
					}
					if(angle > -45 && angle < 45 && y < ypos){
						direct = "up";
					}
					if(((angle > -90 && angle <-45) || (angle >45 && angle <90)) && x > xpos){
						direct = "right";
					}
					if(((angle > -90 && angle <-45) || (angle >45 && angle <90)) && x < xpos){
						direct = "left";
					}
					move(e.type, direct)
				});
				function move(eventType, direct){
					if(eventType == "mouseenter"){
						switch(direct){
							case "down":
								div.css({"left": "0px", "top": h}).stop(true,true).animate({"top": "0px"}, "fast");	
								break;
							case "up":
								div.css({"left": "0px", "top": -h}).stop(true,true).animate({"top": "0px"}, "fast");	
								break;
							case "right":
								div.css({"left": w, "top": "0px"}).stop(true,true).animate({"left": "0px"}, "fast");	
								break;
							case "left":
								div.css({"left": -w, "top": "0px"}).stop(true,true).animate({"left": "0px"}, "fast");	
								break;
						}
					}else{
						switch(direct){
							case "down":
								div.stop(true,true).animate({"top": h}, "fast");	
								break;
							case "up":
								div.stop(true,true).animate({"top": -h}, "fast");	
								break;
							case "right":
								div.stop(true,true).animate({"left": w}, "fast");	
								break;
							case "left":
								div.stop(true,true).animate({"left": -w}, "fast");	
								break;
						}
					}
				}
			}
		});
	}
	
})

