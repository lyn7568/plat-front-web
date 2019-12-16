$(function() {
	$(".headnav li").eq(2).addClass("navcurrent");
	$("#feedback").hide();
	loginStatus();//判断个人是否登录
	var userid = $.cookie("userid");
	
	var rows = 20,
		pageNo = 1,
		dataO = {
			patSortNum:"",
			patCreateTime:"",
			patId:""
		},
		linkNum=0;//栏目类别导航
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
	patentListVal = function(isbind, flag) {
		var aimId="table-item-2"
		if (flag) {
			aimId="table-item-3"
		}
		oAjax("/ajax/ppatent/index/search",{
			"sortNum": dataO.patSortNum,
			"createTime":dataO.patCreateTime,
			"id": dataO.patId,
			"rows": rows
		}, "get", function(res){
			var $info = res.data;
			if($info.length > 0) {
				$("#"+aimId).show()
				dataO.patSortNum = $info[$info.length - 1].sortNum;
				dataO.patCreateTime = $info[$info.length - 1].createTime;
				dataO.patId = $info[$info.length - 1].id;
		
				for(var i = 0; i < $info.length; i++) {
					var itemlist = '<li class="flexCenter">';
						itemlist += '<a target="_blank" href="/' + pageUrl("pt",$info[i]) +'" class="linkhref"><div class="lefthead patenthead"></div>';
						itemlist += '<div class="centercon centercon2">';
						itemlist += '<p class="h1font ellipsisSty">'+ $info[i].name +'</p>';
						itemlist += '<p class="h2font ellipsisSty">发明人：'+ $info[i].authors.substring(0, $info[i].authors.length - 1) +'</p>';
						itemlist += '<p class="h2font ellipsisSty">申请人：'+ $info[i].reqPerson +'</p>';
						itemlist += '</div></a></li>';
					$("#"+aimId).append(itemlist)
				}
			}
			var liLen=document.getElementById(aimId).querySelectorAll("li").length;
			removeNodata(aimId);
			if($info.length == 0 && liLen == 0 ){
				$("#"+aimId).hide()
				insertNodata(aimId);
			}
			if(isbind){
				$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					if (flag) {
						patentListVal(false, true)
					} else {
					 	patentListVal(false)
					}
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
	unpatentListVal = function(isbind) {
		var aimId="table-item-1"
		oAjax("/ajax/resResult/pq",{
			"status": ['1'],
			"pageSize": rows,
			"pageNo": pageNo
		}, "get", function(res){
			var $info = res.data.data;
			if($info.length > 0) {
				$("#"+aimId).show()
				if(res.data.pageNo !== pageNo){
					$("#"+aimId).parent().find(".js-load-more").unbind("click");
					$("#"+aimId).parent().find(".js-load-more").hide();
					return
				}
				for(var i = 0; i < $info.length; i++) {
					var resIM='<div class="lefthead patenthead"></div>'
					if ($info[i].pic) {
						var src = '/data/researchResult' + $info[i].pic.split(",")[0]
						resIM = '<div class="lefthead patenthead" style="background-image:url('+ src +')"></div>';
					}
					var itemlist = '<li class="flexCenter">';
						itemlist += '<a target="_blank" href="unPatentShow.html?id='+$info[i].id+'" class="linkhref">';
						itemlist += resIM
						itemlist += '<div class="centercon centercon2">';
						itemlist += '<p class="h1font ellipsisSty">'+ $info[i].name +'</p>';
						itemlist += '<p class="h2font ellipsisSty displayNone">研究者：<span class="researchers"></span></p>';
						if ($info[i].orgId) {
							itemlist += '<p class="h2font ellipsisSty">所属机构：<span class="resOrgName"></span></p>';
						}
						itemlist += '</div></a></li>';
					var $itemlist = $(itemlist);
					$("#"+aimId).append($itemlist)
					queryResearcher($info[i].id, $itemlist)
					if ($info[i].orgId) {
						queryReseOrgName($info[i].orgId, $itemlist)
					}
				}
			}
			var liLen=document.getElementById(aimId).querySelectorAll("li").length;
			removeNodata(aimId);
			if($info.length == 0 && liLen == 0 ){
				$("#"+aimId).hide()
				insertNodata(aimId);
			}
			if(isbind){
				$("#"+aimId).parent().find(".js-load-more").unbind("click").on("click",function(){
					pageNo++
					 unpatentListVal(false)
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
	recommendUnpatent = function(){
		var aimId="table-item-0"
		oAjax("/ajax/resResult/pq",{
			"status": ['1'],
			"pageSize": 5,
			"pageNo": 1
		}, "get", function(res){
			var $info = res.data.data;
			if($info.length > 0) {
				$("#"+aimId).show()
				for(var i = 0; i < $info.length; i++) {
					var resIM='<div class="lefthead patenthead"></div>'
					if ($info[i].pic) {
						var src = '/data/researchResult' + $info[i].pic.split(",")[0]
						resIM = '<div class="lefthead patenthead" style="background-image:url('+ src +')"></div>';
					}
					var itemlist = '<li class="flexCenter">';
						itemlist += '<a target="_blank" href="unPatentShow.html?id='+$info[i].id+'" class="linkhref">';
						itemlist += resIM
						itemlist += '<div class="centercon centercon2">';
						itemlist += '<p class="h1font ellipsisSty">'+ $info[i].name +'</p>';
						itemlist += '<p class="h2font ellipsisSty displayNone">研究者：<span class="researchers"></span></p>';
						if ($info[i].orgId) {
							itemlist += '<p class="h2font ellipsisSty">所属机构：<span class="resOrgName"></span></p>';
						}
						itemlist += '</div></a></li>';
					var $itemlist = $(itemlist);
					$("#"+aimId).append($itemlist)
					queryResearcher($info[i].id, $itemlist)
					if ($info[i].orgId) {
						queryReseOrgName($info[i].orgId, $itemlist)
					}
				}
			}
		})
	},
	hotUnpatentList = function() {
		var aimId="hotNews"
		oAjax("/ajax/resResult/pq",{
			"status": ['1'],
			"pageSize": 10,
			"pageNo": 1
		}, "get", function(res){
			var $data = res.data.data;
			if($data.length > 0) {
				$("#"+aimId).parents(".conItem").removeClass("displayNone");
				var oLeng=$data.length<10?$data.length:10;
				for(var i=0;i<oLeng;i++) {
					var listLi=$('<li class="flexCenter"></li>').appendTo($("#hotNews"));
					var str='<a target="_blank" href="unPatentShow.html?id='+$data[i].id+'"><p class="h2Font ellipsisSty-2">'+$data[i].name+'</p></a>'
					$(str).appendTo(listLi);
				}
			}
		})
	},
	navmenu=function(){
		$(document).bind("click",function(e){ 
			var target = $(e.target); 
			if(target.closest(".table-tab-item").length == 0){ 
				$(".table-drop").hide(); 
				$(".rightbtn").find("em").removeClass("unfoldtr").addClass("foldtr");
			} 
		})
		$(".table-tab-item").on("mouseenter","li.rightbtn",function(){
			$(this).find(".table-drop").show();
			$(this).find("em").removeClass("foldtr").addClass("unfoldtr");
		}).on("mouseleave","li.rightbtn",function(){
			$(this).find("em").removeClass("unfoldtr").addClass("foldtr");
			$(this).find(".table-drop").hide();
		})
		
		$(".table-drop").on("click","li",function(){
			$(".rightbtn").find("span").html($(this).text());
		})
		$(".table-tab-item").on("click","li",function(){
			if($(this).is('.table-tab-slide')){
                linkNum = $(this).index(".table-tab-slide");
                $(".haveData").find("ul").each(function () {
                    $(this).html("");
                    $(this).parent().find(".js-load-more").unbind("click");
                    $(this).parent().find(".js-load-more").show();
                });
                $("#table-item-"+linkNum).html("");
                dataColNum=$(this).attr('data-col');
				$(".table-tab-slide").removeClass("table-tab-slide-active");
				$(this).addClass("table-tab-slide-active");
				$(".table-drop").fadeOut(1000);
				$(".rightbtn").find("em").removeClass("unfoldtr").addClass("foldtr");
				$(".table-item-list").eq(linkNum).show().siblings().hide();
				if($(".rightbtn").find("li").is(".table-tab-slide-active")){
					$(".rightbtn").addClass("table-tab-slide-active");
				}else{
					$(".rightbtn").removeClass("table-tab-slide-active");
				}
				dataO = {
					patSortNum:"",
					patCreateTime:"",
					patId:""
				}
				pageNo=1
				if(linkNum==0){
					recommendUnpatent()
					patentListVal(true, true)
				}else if(linkNum == 1){
					unpatentListVal(true)
				}else if(linkNum == 2){
					patentListVal(true)
				}
			}else{
				$(this).find(".table-drop").show();
			}
		})
	},
	queryResearcher = function (id, $list) {
		if (id) {
			oAjax("/ajax/resResult/researcher",{
				"id": id
			}, 'get', function($data) {
				var arr = []
				if($data.data.length) {
					$list.find('.researchers').parent().removeClass('displayNone')
					for (var i = 0; i < $data.data.length;i++) {
						arr.push($data.data[i].name)
					}
					$list.find('.researchers').html(arr.join(','))
				}			
			})
		}
	},
	queryReseOrgName = function (id, $list) {
		if (id) {
			cacheModel.getCompany(id,function(sc,value){
				if(sc){
					if(value.forShort){
						$list.find(".resOrgName").html(value.forShort)
					}else{
						$list.find(".resOrgName").html(value.name)
					}
				}
			})
		}
	},
	rightAllCon=function(){
		$.ajax({
			type:"get",
			url:"/ajax/professor/editBaseInfo/"+userid,
			success:function(data){
				if(data.success){
					var dataStr=data.data
					var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
					var baImg = "../images/default-photo.jpg";
					if(dataStr.hasHeadImage == 1) {
						baImg = "/images/head/" + dataStr.id + "_l.jpg";
					}
					var str='<div class="madiaHead useHead" style="background-image:url('+baImg+')"></div>'+
							'<div class="h2Font">'+dataStr.name+'<span class="authiconNew ' + userType.sty + '" title="' + userType.title + '"></span></div>'
					$(".onlogined .owener-info").html(str)
				}
			}
		});
		$.ajax({
			url: "/ajax/article/pqProPublish",
			dataType: 'json',
			type: 'GET', 
			data: {
				"ownerId": userid,
			},
			success:function(data){
				if(data.success){
					$("#myPubedArt").html(data.data.total)
				}
			}
		});
		$.ajax({//回答数
			type:"get",
			url:"/ajax/question/answer/count",
			data: {
				uid: userid
			},
			async:true,
			success:function(data){
				if(data.success){
					$("#myPubedAnswer").html(data.data)
				}
			}
		});
		$.ajax({//总获赞
			type:"get",
			url:"/ajax/professor/agree/sum",
			data: {
				id: userid,
			},
			async:true,
			success:function(data){
				if(data.success){
					$("#agreeMecount").html(data.data)
				}
			}
		});
	}

	recommendUnpatent()
	patentListVal(true, true)
	navmenu();
	hotUnpatentList();
	if(userid && userid != null && userid != "null") {
		$(".privateInfo .onlogined").removeClass("displayNone")
		$(".privateInfo .unlogined").addClass("displayNone")
		rightAllCon()
		$(".pubArt").on("click",function(){
			window.open('../articalIssue.html')
		})
		$(".pubQuestion").on("click",function(){
			$(".questionCover").fadeIn();
			$("body").css("position", "fixed");
		})
		$(".goarrow").on("click",function(){
			window.open('../userInforShow.html?professorId='+ userid +'&iLike=1')
		})
		$("#workclose").on("click",function(){
			$(".questionCover").fadeOut();
		    $("body").css("position", "");
		})
		hotKey(".oinput");
		//校验关键字
		$("#KeyWord").on({
			focus: function() {
				$("#keyPrompt").text("最多可添加5个关键词，每个关键词15字以内");
			},
			blur: function() {
				$("#keyPrompt").text("");
			}
		})
		$("#keyWordlist").on("click", ".closeThis", function() {
			$(this).parent().remove();
			var liNum = $("#keyWordlist").find("li").length;
			if(liNum < 5) {
				$("#keyWordlist").parents(".keyResult").siblings("div.col-w-12").show();
			}
		})
		limitObj("#queTit",50)
		$("#queTit").on({
			focus: function() {
				$(this).parents("li").find(".frmconmsg").text("提问不得少于5个字，不可超过50个字");
			},
			blur: function() {
				$(this).parents("li").find(".frmconmsg").text("");
			}
		})
		limitObj("#queCnt",500)
		$("#queCnt").on({
			focus: function() {
				$(this).parents("li").find(".frmconmsg").text("提问描述不可超过500个字");
			},
			blur: function() {
				$(this).parents("li").find(".frmconmsg").text("");
			}
		})
		
		var imgStr=[];
		var uploader =new WebUploader.create({
			auto: true,
			fileNumLimit: 3,
			swf: '../js/webuploader/Uploader.swf',
			server: '../ajax/question/upload',
			fileSingleSizeLimit: 2 * 1024 * 1024,
			pick: {
				id: "#filePicker",
				multiple: false
			},
			accept: {
				title: 'Images',
				extensions: 'jpg,jpeg,png',
				mimeTypes: 'image/jpg,image/jpeg,image/png'
			}
	
		});
	
		// 当有文件添加进来的时候
		uploader.on('fileQueued', function(file) {
			fileId = file.id;
			var $len = $("#fileList").find("img").length;
			if($len == 0 || $len == 1) {
				var oRemove = $("#fileList").find("dd");
				oRemove.eq(oRemove.length - 1).remove();
			} 
			var $li = $(
					'<dd>' +
						'<div class="imgItem" id="' + file.id + '">'+
							'<img />' +
						'</div>'+
					'</dd>'
				),
				$btns = $('<div class="file-panel">' +
					'<span class="cancel"></span>' +
					'</div>').appendTo($li),
				$img = $li.find('img');
			var $list = $("#fileList");
			if($len == 1) {
				$list.find("dd").eq(0).after($li)
			} else if($len == 2) {
				$list.find("dd").eq(1).after($li)
			} else {
				$list.prepend($li);
			}
	
			// 创建缩略图
			// 如果为非图片文件，可以不用调用此方法。
			// thumbnailWidth x thumbnailHeight 为 100 x 100
			uploader.makeThumb(file, function(error, src) {
				if(error) {
					$img.replaceWith('<span>不能预览</span>');
					return;
				}
				$img.attr('src', src);
			}, 1, 1);
		});
		uploader.onError = function(code) {
			if(code=="F_EXCEED_SIZE"){
				$.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过2M')	
			}
		};
		uploader.on('uploadSuccess', function(file, data) {
			if(data.success) {
					uploader.removeFile(fileId);
					//console.log(data)
					var orldUrl = imgStr.push(data.data[0].uri);
					
			}else{
				$.MsgBox.Alert('提示', '只支持jpeg/jpg/png格式的图片');
			}
		});
		/*删除图片*/
		$("#fileList").on("click", ".cancel", function() {
			var flag=$(this).attr("flag");
			var oNum=$(this).parents("dd").index();
			if(flag==1) {
				array.splice(oNum,1);
			}else{
				imgStr.splice(oNum,1);
			}
			$(this).parent().parent().remove();
			
			var $len = $("#fileList").find("img").length;
			if($len != 2) {
				$("#fileList").append("<dd></dd>")
			}
			
		});
		
		//提问下一步
		$("#nextSte").on("click",function(){
			if($("#queTit").val().length>50) {
				$("#queTit").parents("li").find(".frmconmsg").text("提问不可超过50个字");
				$("#queTit").parent().css("border-color","#e03b43");
				return;
			}
			if($("#queTit").val().length<5 || $("#queTit").val().length==0) {
				$("#queTit").parents("li").find(".frmconmsg").text("提问不得少于5个字");
				$("#queTit").parent().css("border-color","#e03b43");
				return;
			}
			if($("#keyWordlist>li").length==0){
				$("#keyPrompt").text("请至少添加1个关键词");
				$("#KeyWord").css("border-color","#e03b43");
				return;
			}
			
			$(".queStep01").addClass("displayNone")
			$(".queStep02").removeClass("displayNone")

		})
		//提问上一步
		$("#preSte").on("click",function(){
			$(".queStep01").removeClass("displayNone")
			$(".queStep02").addClass("displayNone")
		})
		//提问发布
		$("#pubSte").on("click",function(){
			var title=$("#queTit").val();
			var cnt=$("#queCnt").val();
			var subjects = $("#keyWordlist>li");
			var subjectAll = "";
			if(subjects.length > 0) {
				for(var i = 0; i < subjects.length; i++) {
					subjectAll += subjects[i].innerText.replace(/删除/, "");
					subjectAll += ',';
				};
				subjectAll = subjectAll.substring(0, subjectAll.length - 1);
			}
			console.log(cnt+"++++++"+imgStr);
			
			var dataSt={
					"title": title,
					"cnt": cnt,
					"img": imgStr.join(","),
					"keys": subjectAll,
					"uid": userid
				}
			$.ajax({
				url:'/ajax/question', 
				data: dataSt,
				dataType: 'json',
				traditional: true,
				type: 'POST', 
				success: function(data) {
					if(data.success) {
						console.log(data)
						$(".questionCover").fadeOut();
						$("body").css("position", "");
						$(".queStep").find("textarea").val("")
						$("#keyWordlist").html("")
						var $len = $("#fileList").find("img").length;
						for(var i=0;i<$len;i++) {
							$("#fileList").find(".imgItem").parent().remove()
							$("#fileList").append("<dd></dd>")
						}
						
						$(".queStep").find("input").val("")
						$(".queStep01").removeClass("displayNone")
						$(".queStep02").addClass("displayNone")
						$.MsgBox.Alert("提示","问题发布成功");
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
						
					}
				}
			});
			
		})
	}else{
		$(".privateInfo .unlogined").removeClass("displayNone")
		$(".privateInfo .onlogined").addClass("displayNone")
		$(".unlogined").on("click",function(){
			quickLog();
			operatTab();
			closeLog();
		})
	}
})