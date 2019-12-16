$(document).ready(function() {
	var userid=$.cookie("userid");
	var patentId =window.staticPageData.id
	var hurl = window.location.host;
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	location.href="http://" + window.location.host + "/e/z.html?id="+patentId;
	}
	
	//分享关注按钮
	$('.shareWeixin').hover(function(){$(this).find('.shareCode').stop(true,false).fadeToggle();});
	//微信分享
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width : 100,
		height : 100
	});
	function makeCode(){
		var elurl = "http://" + hurl + "/e/z.html?id=" + patentId ; 
		qrcode.makeCode(elurl);
	}
	makeCode();
	
	$(".commentList").parent().append('<button class="js-load-more displayNone"></button>')
	pageViewLog(patentId,4)
	module.lWord(patentId,3,1);
	function Patent() {
		this.init();
		this.flag = GetQueryString("flag");
	}
	Patent.prototype.init = function() {
		loginYesOrNo()
		ifcollectionAbout(patentId,$("#collectBtn"),4);
		$("#paperName").text(window.staticPageData.name);
		if(window.staticPageData.summary) {
			$(".showCon").eq(5).text(window.staticPageData.summary);
		}
		this.ajax({
			url: "/ajax/ppatent/qo",
			data: {
				id: patentId
			},
			type: "get",
			Fun: this.patentMess
		});
		this.ajax({
			url: "/ajax/ppatent/authors",
			data: {
				id: patentId
			},
			type: "get",
			Fun: this.patentAuth
		});
	}
	Patent.prototype.ajax = function(obj) {
		var $this = this;
		$.ajax({
			url: obj.url,
			data: obj.data,
			dataType: 'json', //服务器返回json格式数据
			type: obj.type, //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			traditional: true,
			async:false,
			success: function(data) {
				if(data.success) {
					obj.Fun(data.data, $this);
				}
			},
			error: function() {
				$this.Fail();
			}
		});
	}
	Patent.prototype.Fail = function() {
		$.MsgBox.Alert('提示', "服务器链接超时");
	}
	Patent.prototype.keyword = function($key) {
		for(var i in $key.split(",")) {
			if(GetQueryString("flag")== 1) {
				if($key.split(",").length>=5) {
					$(".oinput").parents(".col-w-12").hide();
				}
				$("#paperSList").append("<li><p class='h2Font'>" + $key.split(",")[i] + "</p><div class='closeThis'></div></li>");
			} else {
				paperRelatedList($key.split(","));
				$(".tagList").append("<li><p class='h2Font'>" + $key.split(",")[i] + "</p></li>");
			}

		}
	}
	Patent.prototype.patentMess = function($data, $obj) {
		if(GetQueryString("flag") == 1) {
			$(".advertItem,.form-show").hide();
			hotKey(".oinput", 1);
			if($data.keywords) {
				$obj.keyword($data.keywords);
			}
			if($data.$data.cooperation) {
				$("#remarkContent").val($data.cooperation)
			}
		} else {
			$(".oinput").parents(".form-item").hide();
			$(".conItemFirst,#paperList").hide();
			if($data.keywords) {
				$obj.keyword($data.keywords);
			} else {
				$(".form-show").hide();
			}
		}
		if($data.name) {
			
			document.title=$data.name;
		}
		$("#pageview").text($data.pageViews);
		if($data.reqCode) {
			$(".showCon").eq(0).text($data.reqCode);
		} else {
			$(".showCon").eq(0).parents("li").hide();
		}
		if($data.code) {
			$(".showCon").eq(1).text($data.code);
		} else {
			$(".showCon").eq(1).parents("li").hide();
		}
		$(".showCon").eq(2).text(TimeTr($data.reqDay));
		$(".showCon").eq(3).text(TimeTr($data.pubDay));
		$(".showCon").eq(4).text($data.reqPerson);
		if($data.summary) {
			$(".showCon").eq(5).text($data.summary);
		}
		if($data.cooperation){
			$("#noteCo").parent().show()
			$("#noteCo").text($data.cooperation)
		}
		var weibotitle = $data.name;
		var weibourl = window.location.href;
		var weibopic = "http://" + window.location.host + "/images/default-patent.jpg";
		$("#weibo").attr("href", "http://service.weibo.com/share/share.php?appkey=3677230589&title=" + encodeURIComponent(weibotitle) + "&url=" + encodeURIComponent(weibourl) + "&pic=" + encodeURIComponent(weibopic) + "&content=utf-8" + "&ralateUid=6242830109&searchPic=false&style=simple");
		$obj.bindEvent($obj);
//		$("#advertisement img").attr("src","/"+$("#advertisement img").attr("src"));
	}
	Patent.prototype.patentAuth = function($data, $obj) {
		for(var i in $data) {
			if($data[i].professorId.substring(0, 1) == "#") {
				var otr = '<li class="flexCenter"><a data-id="'+ $data[i].professorId +'">' +
					'<div class="madiaHead useHead" id="userimg"></div>' +
					'<div class="madiaInfo">' +
					'<p class="ellipsisSty">' +
					'<span class="h1Font" id="name">' + $data[i].name + '</span>' +
					'</p>' +
					'</div></a>'
					if($data[i].name==$.cookie("userName")){
						otr += '<div class="goSpan"><span class="ifMe" nflag="1">是我本人</span></div>'
					}else{
						otr += '<div class="goSpan"><span class="yaoqing">邀请'+
						'<div class="shareCode clearfix"><div class="floatL qrcodeUser"></div>'+
						'<div class="shareWord floatR"><p>打开微信“扫一扫”，<br/>打开网页后点击屏幕右上角“分享”按钮</p></div>'+
						'</div></span></div>'
					}
					otr += '</li>'
				$("#faM .lastBtn").before(otr);
			} else {
				$obj.ajax({
					url: "/ajax/professor/editBaseInfo/" + $data[i].professorId,
					data: {},
					type: "get",
					Fun: $obj.profess
				});
			}
			if($data.length<5){
				$("#faM li").css("display","block");
				$(".lastBtn").hide();
			}else{
				$(".lastBtn").find("span").text($data.length);
				$("#faM li:lt(3)").css("display","block");
			}
			if(GetQueryString("flag") == 1){
				$("#faM li").css("display","block");
				$("#faM li .goSpan").hide();
				$(".lastBtn").hide();
			}

		}
		//邀请
		$(".goSpan").on("mouseenter",".yaoqing",function(){
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
			makeCodePat();
		}
		function makeCodePat(){
			if(userid) {
				var elurl = "http://" + hurl + "/e/I.html?i=" + s16to64(GetQueryString("patentId"))+"&d="+s16to64(userid);
			} else{
				var elurl = "http://" + hurl + "/e/I.html?i=" + s16to64(GetQueryString("patentId"));
			} 
			qrcode.makeCode(elurl);
		}
		//是我本人
		$(".goSpan").on("click",".ifMe",function(){
			var oF=$(this).attr("nflag");
			if(oF==1){
				$.MsgBox.Confirm("提示", "确认这是您发表的专利？", daoRuPatent);
				$(this).attr("nflag","0");
			}else{
				return;
			} 
			
		});
		function daoRuPatent(){
			$.ajax({
				"url": "/ajax/ppatent/ass",
				"type": "POST",
				"data": {
					id:patentId,
					uid:$.cookie("userid"),
					author:$.cookie("userName")
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
	}
	Patent.prototype.profess = function($data, $obj) {
		var img;
		var oClass = autho($data.authType, $data.orgAuth, $data.authStatus);
		var csAuto, oId;
		var arr = [];
		arr[0] = $data.title || $data.office;
		arr[1] = $data.orgName || "";
		if(arr[0]) {
			if(arr[1]) {
				arr[2] = arr[0] + "，" + arr[1]
			} else {
				arr[2] = arr[0];
			}
		} else {
			arr[2] = "";
		}
		if($data.hasHeadImage) {
			img = "/images/head/" + $data.id + "_l.jpg";
		} else {
			img = "/images/default-photo.jpg"
		}
		oId = $data.id;
		var otr = '<li class="flexCenter"><a href="" data-id="' + oId + '">' +
			'<div class="madiaHead useHead" id="userimg" style="background-image:url(' + img + ')"></div>' +
			'<div class="madiaInfo" style="margin-top:-4px">' +
			'<p class="ellipsisSty">' +
			'<span class="h1Font" id="name">' + $data.name + '</span><em class="authiconNew ' + oClass.sty + '" title="' + oClass.title + '"></em>' +
			'</p>' +
			'<p class="h2Font ellipsisSty">' + arr[2] + '<p>' +
			'</div></a>'
			if(oId==userid){
				 otr += ''
			}else{
				 otr += '<div class="goSpan"><span class="attenSpan">关注</span></div>'
			}
			otr += '</li>'
			var $otr=$(otr);
		$("#faM .lastBtn").before($otr);
		ifcollectionAbout(oId,$otr.find(".attenSpan"),1);
	}
	Patent.prototype.bindEvent = function($obj) {
		$("#faM").on("click", "li>a", function() {
			if(GetQueryString("flag") !=1){
				var oDataId = $(this).attr("data-id");
				if(oDataId.substring(0,1)!="#"){
					$(this).attr("href","/userInforShow.html?professorId="+oDataId);
				}else{
					$(this).attr("href","javascript:void(0)");
				}
			}else{
				$(this).attr("href","javascript:void(0)");
			}
		})
		$('#attention em').click(function() {
			if(userid && userid != "null" && userid != null) {
				if($(this).is('.icon-collected')) {
					cancelCollectionAbout(patentId,$(this), 4);
				} else {
					collectionAbout(patentId,$(this), 4);
				}
			} else {
				quickLog();
				operatTab();
				closeLog();
			}
		})
		$("body").on("click", ".closeThis", function() {
			if($(this).parent().length < 5) {
				$(this).parents(".keyResult").siblings("div").show();
			}
			$(this).parent().remove();

		});
		$("#release").on("click", function() {
			$.MsgBox.Confirm("提示", "确认发布该专利？", $obj.pubPatent);
		});
		$("#delete").on("click", function() {
			$.MsgBox.Confirm("提示", "确认删除该专利？", $obj.delePatent);
		});
		$(".lastBtn").on("click", function() {
			$("#faM li").css("display","block");
			$(this).hide();
		});
		$(".tagList").on("click","li",function() {
			location.href = "/searchNew.html?searchContent=" + $(this).text() + "&tagflag=5";
		});
		//点击关注按钮
		$("#faM").on('click',"span.attenSpan", function() {
			var pId=$(this).parent().siblings("a").attr("data-id");
			if(userid && userid != null && userid != "null") {
				if($(this).is('.attenedSpan')){
					cancelCollectionAbout(pId, $(this),1)
				} else {
					collectionAbout(pId, $(this),1);
				}
			}else{
				quickLog();
				operatTab();
				closeLog();
			}
		});
						

	}
	Patent.prototype.captiureSubInd = function(subIndu) {
		var industrys = $("#" + subIndu + "").find("li");
		var industryAll = "";
		if(industrys.size() > 0) {
			for(var i = 0; i < industrys.size(); i++) {
				industryAll += industrys[i].innerText.trim();

				industryAll += ',';
			};
			industryAll = industryAll.substring(0, industryAll.length - 1);
		}
		return industryAll;
	}
	Patent.prototype.pubPatent = function() {
		var $key = oPent.captiureSubInd("paperSList");
		oPent.ajax({
			url: "/ajax/ppatent/update",
			data: {
				id: GetQueryString("patentId"),
				keywords: $key,
				cooperation:$("#remarkContent").val()
			},
			type: "post",
			Fun: oPent.pubsucess
		});
	}
	Patent.prototype.pubsucess = function() {
		$.MsgBox.Alert('提示', '专利发布成功！');
		$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
		location.href = "/patentList.html"
	}
	Patent.prototype.delePatent = function() {
		oPent.ajax({
			url: "/ajax/ppatent/cAss",
			data: {
				id: patentId,
				uid:$.cookie("userid")
			},
			type: "post",
			Fun: oPent.delsucess
		});
	}
	Patent.prototype.delsucess = function() {
		location.href = "/patentList.html"
	}
	var oPent = new Patent();
	
	//纠错反馈
	$(".footer_tools").hide();
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
				"url": "/ajax/feedback/error/patent",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id":patentId,
					"cnt":cntCon,
					"user":cntUser
				},
				"success": function(data) {
					if(data.success) {
						console.log(data);
						backSuccessed();
						suImg();
					}
				},
				"error": function() {
					$.MsgBox.Alert('提示', '链接服务器超时')
				}
			});
		}
	})
	
	if( GetQueryString("flag")==1){
		$(".feedBack").click(function(){
			$("#feedbackBox").fadeToggle();
		})
		$(".closeFeed").click(function(){
			$("#feedbackBox").fadeOut();
		})
		
		
	}else{
		
		
		$(".footer_tools").show();
		$("#messagego").show();
		$(".thumbBlock").show();
		isAgreeNum()
	function isAgreeNum() {
	var data = {"id": patentId}
	$.ajax({		
		url:"/ajax/ppatent/agreeCount",
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
		error: function() {
			$.MsgBox.Alert('提示',"服务器链接超时");
		}
	});
}
	/*判断论文是否被赞*/
function isAgree(articleAgree) {
	var data = {"id": patentId,"uid":userid ,"uname":$.cookie("userName")}
	$.ajax({		
		url:"/ajax/ppatent/agree",
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
	
	var data = {"uid": userid,"id": patentId,"uname":$.cookie("userName")}
	$.ajax({		
		url:"/ajax/ppatent/agree",
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
//您可能感兴趣的论文
	paperInterestingList()
	function paperInterestingList(){
		$.ajax({
			"url" : "/ajax/ppatent/ralatePatents",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{
				"patentId":patentId
			},
			//"async":false,
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				if(data.success) {
					console.log(data);
					var dataStr=data.data
					if(dataStr.length > 0){
						$("#interPatent").show();
						var itemlist = '';
						$("#patentList").html("");
						for(var i = 0; i < dataStr.length; i++) {
							var itemlist = '<li>';
							itemlist += '<a class="flexCenter" target="_blank" href="/' + pageUrl("pt",dataStr[i]) +'"><div class="madiaHead patentHead"></div>';
							itemlist += '<div class="madiaInfo">';
							itemlist += '<p class="h1Font ellipsisSty">'+ dataStr[i].name +'</p>';
							itemlist += '<p class="h2Font ellipsisSty">发明人：'+ dataStr[i].authors.substring(0, dataStr[i].authors.length - 1) +'</p>';
							itemlist += '<p class="h2Font ellipsisSty">申请人：'+ dataStr[i].reqPerson +'</p>';
							itemlist += '</div></a></li>';
							$itemlist = $(itemlist);
							$("#patentList").append($itemlist);
						}
					}
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	}
	//根据关键词查询查找相关论文
	function paperRelatedList(array){
		$.ajax({
			"url"  :  "/ajax/ppaper/assPapers",
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{
				"kws":array
			},
			//"async":false,
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				if(data.success) {
					console.log(data);
					var dataStr=data.data
					if(dataStr.length > 0){
						$("#paperList").show();
						for(var i = 0; i < dataStr.length; i++) {
							var itemlist ='<li style="min-height:56px;"><a href="/'+pageUrl("pp",dataStr[i])+'"><p class="h2Font ellipsisSty-2" style="line-height:20px;"><em class="circlePre"></em>'+ dataStr[i].name +'</p></a></li>'
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