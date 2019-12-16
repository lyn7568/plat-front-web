$(document).ready(function() {
	loginYesOrNo()
	var userid = $.cookie("userid");
	var userName = $.cookie("userName");
	var paperId = window.staticPageData.id;
	var hurl = window.location.host;
	$(".commentList").parent().append('<button class="js-load-more displayNone"></button>')
	module.lWord(paperId,2,1);
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/l.html?id="+paperId;
	}
	
	//分享关注按钮
	$('.shareWeixin').hover(function(){$(this).find('.shareCode').stop(true,false).fadeToggle();});
	$('.goSpan').hover(function(){$(this).find('.shareCode').stop(true,false).fadeToggle();});
	
	//微信分享
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width : 100,
		height : 100
	});
	function makeCode(){
		var elurl = "http://" + hurl + "/e/l.html?id=" + paperId ; 
		qrcode.makeCode(elurl);
	}
	makeCode();
	
	ifcollectionAbout(paperId,$("#collectBtn"), 5)
	getPaperMe();
	pageViewLog(paperId,5)
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
	//点击收藏按钮
	$("#collectBtn").on('click', function() {
		if(userid && userid != null && userid != "null") {
			if($(this).is('.icon-collected')){
				cancelCollectionAbout(paperId,$(this), 5)
			} else {
				collectionAbout(paperId,$(this), 5);
			}
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	});
	
	//关键词标签点击进去搜索
	$(".tagList").on("click","li",function(){
		var tagText = $(this).find("p").text();
		location.href = "/searchNew.html?searchContent=" + tagText + "&tagflag=6";
	})
	
	//点击进入个人详情页面
	$("#aboutAuthors").on("click","li>a",function(){
		var oDataId = $(this).attr("data-id");
		if(oDataId.substring(0,1)!="#"){
			$(this).attr("href","/userInforShow.html?professorId="+oDataId);
		}else{
			$(this).attr("href","javascript:void(0)");
		}
	})
	$("#aboutAuthors").on("click","li.lastBtn",function(){
		$("#aboutAuthors li").css("display","block");
		$(this).hide();
	})
	//点击关注按钮
	$("#aboutAuthors").on('click',"span.attenSpan", function() {
		var pId=$(this).parent().siblings("a").attr("data-id");
		if(userid && userid != null && userid != "null") {
			if($(this).is('.attenedSpan')){
				cancelCollectionAbout(pId,$(this),1)
			} else {
				collectionAbout(pId,$(this),1);
			}
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	});
	/*获取论文信息*/
	function getPaperMe() {
		$.ajax({
			"url": "/ajax/ppaper/qo",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					paperHtml(data.data);
					getPaperAuthors(data.data.id)
					var paperName = data.data.name + "-科袖网";
					document.title = paperName;
				}
			},
			"data": {
				"id": paperId
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*获取论文作者信息*/
	function getPaperAuthors(stritrm) {
		$.ajax({
			"url": "/ajax/ppaper/authors",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data.length>0){
						$("#aboutAuthors .lastBtn span").text(data.data.length);
						for(var i=0;i<data.data.length;i++){
							var authTy="",authTit="",baseInfo="",ifPoint="",imgbg="/images/default-photo.jpg";
							if(data.data[i].professorId.substring(0, 1) != "#"){
								$.ajax({
									type:"get",
									url:"/ajax/professor/editBaseInfo/" + data.data[i].professorId,
									async:false,
									success:function($proData){
										console.log($proData)
										if($proData.success){
											var showPro = $proData.data;
											if(showPro.hasHeadImage == 1) {
												imgbg = "/images/head/" + showPro.id + "_l.jpg";
											} else {
												imgbg = "/images/default-photo.jpg";
											}
											ifPoint = "pointThis";
											//认证
											var oSty = autho(showPro.authType,showPro.orgAuth,showPro.authStatus);
											authTy = oSty.sty;
											authTit = oSty.title;
											
											var title = showPro.title || "";
											var orgName = showPro.orgName || "";
											var office = showPro.office || "";
											if(orgName!=""){
												if(title != "") {
													baseInfo = title + "，" + orgName;
												}else{
													if(office!=""){
														baseInfo = office  + "，" + orgName;	
													}else{
														baseInfo = orgName;	
													}
												}
											}else{
												if(title != "") {
													baseInfo = title;
												}else{
													if(office!=""){
														baseInfo = office;	
													}else{
														baseInfo = "";	
													}
												}
											}
											var str="";
											str +='<li class="flexCenter"><a href="" class="'+ ifPoint +'" data-id="'+ showPro.id +'">'
											str +='<div class="madiaHead useHead" style="background-image:url('+ imgbg +')"></div>'
											str +='<div class="madiaInfo" style="margin-top:-4px" >'
											str +='<p class="ellipsisSty"><span class="h1Font">'+ showPro.name +'</span><em class="authiconNew '+ authTy +'" title="'+ authTit +'"></em></p>'
											str +='<p class="h2Font ellipsisSty">'+ baseInfo +'</p>'
											str +='</div></a>';
											if(showPro.id==userid){
												str +=''
											}else{
												str +='<div class="goSpan"><span class="attenSpan">关注</span></div>';
											}
											str +='</li>';
											var $str=$(str);
											$("#aboutAuthors .lastBtn").before($str);
											if(showPro.id!=userid){
												ifcollectionAbout(showPro.id,$str.find(".attenSpan"),1);
											}
										}
									}
								})
							}else{
								var str="";
								str +='<li class="flexCenter"><a data-id="'+ data.data[i].professorId +'">'
								str +='<div class="madiaHead useHead" style="background-image:url('+ imgbg +')"></div>'
								str +='<div class="madiaInfo">'
								str +='<p class="ellipsisSty"><span class="h1Font">'+ data.data[i].name +'</span></p>'
								str +='</div></a>';
								if(data.data[i].name==userName){
									str +='<div class="goSpan"><span class="ifMe" flag="1">是我本人</span></div>'
								}else{
									str +='<div class="goSpan"><span class="yaoqing">邀请'
									str +='<div class="shareCode clearfix"><div class="floatL qrcodeUser"></div>'
									str +='<div class="shareWord floatR"><p>打开微信“扫一扫”，<br/>打开网页后点击屏幕右上角“分享”按钮</p></div>'
									str +='</div></span></div>';
								}
								
								str +='</li>';
								var $str=$(str);
								$("#aboutAuthors .lastBtn").before($str);
							}
							
							if(data.data.length<5){
								$("#aboutAuthors li").css("display","block");
								$(".lastBtn").hide();
							}else{
								$("#aboutAuthors li:lt(3)").css("display","block");
							}
						}
						
						//邀请
						$('.goSpan').on("mouseenter",".yaoqing",function(){
							$(this).find('.shareCode').stop(true,false).fadeIn();
						}).on("mouseleave",".yaoqing",function(){
							$(this).find('.shareCode').stop(true,false).fadeOut();
						});
						//邀请作者
						var Qcu=document.getElementsByClassName("qrcodeUser");
						for(var i=0;i<Qcu.length;i++){
							var qrcode= new QRCode(Qcu[i], {
								width : 100,
								height : 100
							});
							makeCodePar();
						}
						function makeCodePar(){
							if(userid) {
								var elurl = "http://" + hurl + "/e/I.html?i=" + s16to64(paperId)+"&d="+s16to64(userid)+"&f=1";
							} else{
								var elurl = "http://" + hurl + "/e/I.html?i=" + s16to64(paperId)+"&f=1";
							}
							qrcode.makeCode(elurl);
						}
						
						//是我本人
						$('.goSpan').on("click",".ifMe",function(){
							var oF=$(this).attr("flag");
							if(oF==1){
								$.MsgBox.Confirm("提示", "确认这是您发表的论文？", daoRuPaper);
								$(this).attr("flag","0");
							}else{
								return;
							} 
						});
						

					}
				}
			},
			"data": {
				"id": stritrm
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	function daoRuPaper(){
		$.ajax({
			"url": "/ajax/ppaper/ass",
			"type": "POST",
			"data": {
				id:paperId,
				uid:userid,
				author: userName
			},
			dataType: "json",
			"success": function(data) {
				if(data.success) {
					if(data.data){
						$(".ifMe").text("导入成功").css("background","#ccc");
					}
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*处理论文html代码*/
	function paperHtml($da) {
		$("#paperName").text(window.staticPageData.name); //名字
		$("#pageView").text($da.pageViews); //浏览量
		$("#paperAbstract").text(window.staticPageData.summary); //摘要内容
		if(!$da.cn4periodical){
			$da.cn4periodical=""
		}
		if(!$da.en4periodical){
			$da.en4periodical=""
		}
		if(!$da.cn4periodical && !$da.en4periodical){
			$("#paperJournal").parents("li").hide();
		}else{
			$("#paperJournal").text($da.cn4periodical +" " + $da.en4periodical);
		}

		if(!$da.pubDay){
			$("#paperVolume").parents("li").hide();
		}else{
			$("#paperVolume").text($da.pubDay);
		}
		if($da.keywords != undefined && $da.keywords.length != 0 ){
			var subs = strToAry($da.keywords)
			if(subs.length>0){
				patentRelatedList(subs)
				for (var i = 0; i < subs.length; i++) 
				{
					$(".tagList").append('<li><p class="h2Font">'+ subs[i] +'</p></li>');
				};
			}else{
				$(".tagList").hide();
			}
		}		
		var weibopic = "http://" + window.location.host + "/images/default-paper.jpg"
		var weibotitle = $da.name;
		var weibourl = window.location.href;
		$("#weibo").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+encodeURIComponent(weibotitle)+"&url="+encodeURIComponent(weibourl)+"&pic="+encodeURIComponent(weibopic)+"&content=utf-8"+"&ralateUid=6242830109&searchPic=false&style=simple");
	}
	isAgreeNum()
	function isAgreeNum() {
		var data = {"id": paperId}
		$.ajax({		
			url:"/ajax/ppaper/agreeCount",
			data:data,
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				if(data.success){
					
					if(userid && userid != "null" && userid != null) {
						isAgree(data.data) //文章点赞
					} else {
						$(".thumbBtn").html("赞 <span>" + data.data + "</span>");
					}
				}
			},
//			complete:function(){
//				$("#advertisement a").attr("href","/"+$("#advertisement a").attr("href"));
//				$("#advertisement img").attr("src","/"+$("#advertisement img").attr("src"));
//			},
			error: function() {
				$.MsgBox.Alert('提示',"服务器链接超时");
			}
		});
	}
	/*判断论文是否被赞*/
function isAgree(articleAgree) {
	var data = {"id": paperId,"uid":userid ,"uname":$.cookie("userName")}
	$.ajax({		
		url:"/ajax/ppaper/agree",
		data:data,
		dataType: 'json', //数据格式类型
		type: 'get', //http请求类型
		timeout: 10000,
		async: true,
		success: function(data) {
			if(data.success){
				if(data.data){
					$(".thumbBtn").html("已赞 <span>"+articleAgree+"</span>");
					$(".thumbBtn").addClass("thumbedBtn").css("cursor","auto");
					
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
//论文点击点赞
$('.thumbBlock').on("click",".thunbgo",function(){
	if (userid && userid != "null" && userid != null) {
		addAgree();
	}else{
		quickLog();
		operatTab();
		closeLog();
	}
})
/*点赞*/
function addAgree() {
	console.log(paperId)
	var data = {"uid": userid,"id": paperId,"uname":$.cookie("userName")}
	$.ajax({		
		url:"/ajax/ppaper/agree",
		data:data,
		dataType: 'json', //数据格式类型
		type: 'POST', //http请求类型
		timeout: 10000,
		async: true,
		success: function(data) {
			if(data.success){
				var articleAgreeval = $(".thumbBtn span").text();
				$(".thumbBtn").html("已赞 <span>"+(parseInt(articleAgreeval)+1)+"</span>");
				$(".thumbBtn").addClass("thumbedBtn").css("cursor","auto");
				$(".thumbBtn").removeClass("thunbgo");
			}
		},
		error: function() {
			$.MsgBox.Alert('提示',"服务器链接超时");
		}
	});
}

	//您可能感兴趣的论文
	paperInterestingList()
	function paperInterestingList(){
		$.ajax({
			"url" : "/ajax/ppaper/ralatePapers",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{
				"paperId":paperId
			},
			//"async":false,
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				if(data.success) {
					var dataStr=data.data
					if(dataStr.length > 0){
						$("#interPaper").show();
						var itemlist = '';
						$("#paperList").html("");
						for(var i = 0; i < dataStr.length; i++) {
							var moreInf=""
							if(!dataStr[i].cn4periodical){
								dataStr[i].cn4periodical="";
							}
							if(!dataStr[i].en4periodical){
								dataStr[i].en4periodical="";
							}
							if(!dataStr[i].pubDay){
								dataStr[i].pubDay="";
							}
							moreInf = dataStr[i].cn4periodical+ " " +dataStr[i].en4periodical+ " " +dataStr[i].pubDay;
							var itemlist = '<li>';
							itemlist += '<a class="flexCenter" target="_blank" href="/' + pageUrl("pp",dataStr[i]) +'" class="linkhref"><div class="madiaHead paperHead"></div>';
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
							itemlist += '<p class="h2Font ellipsisSty">作者：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
							itemlist += '<p class="h2Font ellipsisSty">期刊：'+ moreInf +'</p>';
							itemlist += '</div></a></li>';
							$itemlist = $(itemlist);
							$("#paperList").append($itemlist);
					}	}
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
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
				"url": "/ajax/feedback/error/paper",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": paperId,
					"cnt":cntCon,
					"user":cntUser
				},
				"success": function(data) {
					if(data.success) {
						backSuccessed();
						suImg() 
					}
				},
				"error": function() {
					$.MsgBox.Alert('提示', '链接服务器超时')
				}
			});
		}
	})
	function patentRelatedList(array){
		$.ajax({
			"url":"/ajax/ppatent/assPatents",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{
				"kws":array
			},
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				if(data.success) {
					var dataStr=data.data
					if(dataStr.length > 0){
						$("#patentrelate").removeClass("displayNone");
						for(var i = 0; i < dataStr.length; i++) {
							var itemlist ='<li style="min-height:56px;"><a href="/'+pageUrl("pt",dataStr[i])+'"><p class="h2Font ellipsisSty-2" style="line-height:20px;"><em class="circlePre"></em>'+ dataStr[i].name +'</p></a></li>'
							$(".recentlyList").append(itemlist);
						}
					}
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
})