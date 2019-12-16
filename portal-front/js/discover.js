//发现模块
$(function() {
	$(".headnav li").eq(1).addClass("navcurrent");
	$("#feedback").hide();
	loginStatus();//判断个人是否登录
	var userid = $.cookie("userid");
	var exculdeIds=[];
	var exculdeId2s;
	var rows="20",fTime,fId,QTime,QId;
	var sortColumn=["3","7","10","4","5","6","8"]//发现栏目显示顺序
	
	hotNews();
    importNews();
	var linkNum=0;//栏目类别导航
	if(linkNum==0){
        firstListShow(true);
	}
	navmenu();
	//轮播加载页面
	$.ajax({
		"url":"/data/inc/col_banner.html",
		"dataType":"html",
		"success":function(result){
			$(".slide-box").html(result);
			bannerRotate.bannerInit();// 轮播
			for(var i=0;i<5;i++){
				var dataId=$(".slide-item").eq(i).attr("data-id");
				exculdeIds.push(dataId);
				// exculdeId2s.push(dataId);
			}
			$(".slide-list").on("click",".slide-item",function(){
				var columId=$(this).attr("data-col");
				$.ajax({
					"url":"/ajax/operation/statist/bannerClick",
					"type":"POST" ,
					"dataType":"json",
					"data":{"id":columId},
					"success" : function(data) {
						console.log(data)
					}
				})
			})
		}
	})
	
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
	
	function navmenu(){
		var str='<li class="table-tab-slide table-tab-slide-active" data-col="0">推荐</li>'
		for(var i=0;i<sortColumn.length;i++){
			var key=sortColumn[i];
			str+='<li class="table-tab-slide" data-col="'+key+'">'+columnType[key].fullName+'</li>';
		}
		$(".table-tab-item").append(str);
		
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
                fTime = "", fId = "", QTime = "", QId = "";
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
				if(linkNum==0){
                    firstListShow(true);
				}else if(linkNum == 3){
					getWenda(true);
				}else{
					var thisNum=dataColNum;
					listShow(exculdeIds,1,thisNum,true,linkNum);
				}
			}else{
				$(this).find(".table-drop").show();
			}
		})
	
	}
	
	//重大新闻
	function importNews(obj) {
		$.ajax({
			"url" :"/ajax/article/find",
			"type" :  "GET" ,
			"dataType" : "json",
			"traditional": true,
			"async":false,
			"data" :{
				"exclude":obj,
				"col":9,//重大新闻
				"pageSize":1,
				"pageNo":1
			},
			"success" : function(data) {
				if (data.success){
					var $data=data.data.data;
					if($data.length>0){
						var divObj=$("#table-item-0 li:first")
						divObj.before('<li class="flexCenter"></li>');
						// exculdeId2s.push($data[0].articleId);
						exculdeId2s = $data[0].articleId;
						lastestColum($data[0],$("#table-item-0 li:first"),true);
						
					}
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}
	//热门文章
	function hotNews(){
		$.ajax({
			"url" :"/ajax/article/lastestPublished",
			"type" :  "GET" ,
			"dataType" : "json",
			"success" : function(data) {
				if (data.success){
					var $data=data.data;
					if($data.length>0){
						$("#hotNews").parents(".conItem").removeClass("displayNone");
						var oLeng=$data.length<10?$data.length:10;
						for(var i=0;i<oLeng;i++) {
							var listLi=$('<li class="flexCenter"></li>').appendTo($("#hotNews"));
							var str='<a target="_blank" href="/'+pageUrl('a',$data[i])+'"><p class="h2Font ellipsisSty-2">'+$data[i].articleTitle+'</p></a>'
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
	//栏目列表
	function listShow(obj,pageNo,colNum,isbind,index){
		$.ajax({
			"url" :"/ajax/article/find",
			"type" :  "GET" ,
			"dataType" : "json",
			"traditional": true,
			"data" :{
				"exclude":obj,
				"col":colNum,
				"pageSize":10,
				"pageNo":pageNo
			},
			"beforeSend": function() {
				// $(".table-body").append('<img src="../images/loading.gif" class="loading" />');
                $("#table-item-"+index).parent().find(".js-load-more").attr("disabled",true);
                $("#table-item-"+index).parent().find(".js-load-more").addClass("active");
			},
			"complete":function () {
                $("#table-item-"+index).parent().find(".js-load-more").removeAttr("disabled");
                $("#table-item-"+index).parent().find(".js-load-more").removeClass("active");
            },
			"success" : function(data) {
				if (data.success){
					var idItem=0
					if(colNum!=0){
						idItem=index;
					}
					// $("#table-item-"+idItem).html("");
					var strNo='<div class="nodatabox"><div class="nodata"><div class="picbox picNull"></div>'
						strNo+='<div class="txtbox"><p class="noContip">该栏目暂时没有任何动态</p></div></div></div>'
					var dataStr=data.data.data;
					if(dataStr.length>0){
                        for (var i = 0; i < dataStr.length; i++) {
                            var listLi = $('<li class="flexCenter"></li>').appendTo($("#table-item-" + idItem));
                            otherColum(dataStr[i], listLi);
                        }
                        if (colNum==0 && isbind==true){
							importNews(exculdeIds);
						}
					}else{
						$("#table-item-"+idItem).html(strNo);
					}
					//分页
					if(isbind==true){
                        $("#table-item-" + idItem).parent().find(".js-load-more").on("click", function () {
                            listShow(obj, ++pageNo, colNum, false, idItem);
                        });
					}
                    if (pageNo >= Math.ceil(data.data.total / 10)) {
                        $("#table-item-" + idItem).parent().find(".js-load-more").unbind("click");
                        $("#table-item-" + idItem).parent().find(".js-load-more").hide();
					}
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}

    function firstListShow(isbind){
        $.ajax({
            "url" :"/ajax/found/index",
            "type" :  "GET" ,
            "dataType" : "json",
            "traditional": true,
            "data" :{
            	"time":fTime,
				"id":fId,
                "rows":rows,
				"ex":exculdeId2s,
            },
            "beforeSend": function() {
                $("#table-item-0").parent().find(".js-load-more").attr("disabled",true);
                $("#table-item-0").parent().find(".js-load-more").addClass("active");
            },
			"complete":function () {
                $("#table-item-0").parent().find(".js-load-more").removeAttr("disabled");
                $("#table-item-0").parent().find(".js-load-more").removeClass("active");
            },
            "success" : function(data) {
                if (data.success){
                    var dataStr=data.data;
                    var idItem=0;
                    if (dataStr.length > 0) {
                        fTime = dataStr[dataStr.length - 1].tm;
                        fId = dataStr[dataStr.length - 1].id;
                    }
                    var strNo='<div class="nodatabox"><div class="nodata"><div class="picbox picNull"></div>'
                    strNo+='<div class="txtbox"><p class="noContip">该栏目暂时没有任何动态</p></div></div></div>'
                    if(dataStr.length>0){
                        for(var i=0;i<dataStr.length;i++) {
                            if(dataStr[i].ctype=="3"){
                                var listLi=$('<li class="flexCenter"></li>').appendTo($("#table-item-0"));
                                lastestQa(dataStr[i],listLi);
                            }else{
                                var listLi=$('<li class="flexCenter"></li>').appendTo($("#table-item-0"));
                                fillColum(dataStr[i],listLi);
                            }
                        }
                        if(isbind==true){
                            importNews(exculdeIds);
                        }
                    }else{
                        $("#table-item-0").html(strNo);
                    }
                    //分页
                    if(isbind==true){
                        $("#table-item-0").parent().find(".js-load-more").on("click", function () {
                            firstListShow(false);
                        });
                    }
                    if (dataStr.length < rows) {
                        $("#table-item-0").parent().find(".js-load-more").unbind("click");
                        $("#table-item-0").parent().find(".js-load-more").hide();
                    }
                    window.setTimeout(function() {
						//不随滚动条滚动的固定层广告代码
				        $('#scroll-fixed-ad').scrollFix({
				        	oflag:true,
				        	startTop:'#scroll-fixed-ad',
				        	startBottom:".privateInfo",
				            distanceTop: $("header").outerHeight(true) + 20,
				            endPos: 'footer',
				            zIndex: 998
				        });
					}, 300);
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }

	function getWenda(isbind){
		$.ajax({
			"url" :"/ajax/question/answer/byTime",
			"type" :  "GET" ,
			"dataType" : "json",
			"traditional": true,
			"data" :{
				"time":QTime,
				"id":QId,
				"rows":rows
			},
			"beforeSend": function() {
                $("#table-item-3").parent().find(".js-load-more").attr("disabled",true);
                $("#table-item-3").parent().find(".js-load-more").addClass("active");
			},
			"complete":function () {
                $("#table-item-3").parent().find(".js-load-more").removeAttr("disabled");
                $("#table-item-3").parent().find(".js-load-more").removeClass("active");
            },
			"success" : function(data) {
				if (data.success){
                    var dataStr=data.data;
                    var idItem = 3;
                    if (dataStr.length > 0) {
                        QTime = dataStr[dataStr.length - 1].createTime;
                        QId = dataStr[dataStr.length - 1].id;
                    }
                    var strNo = '<div class="nodatabox"><div class="nodata"><div class="picbox picNull"></div>';
                    strNo += '<div class="txtbox"><p class="noContip">该栏目暂时没有任何动态</p></div></div></div>';
					if(dataStr.length>0){
                        for (var i = 0; i < dataStr.length; i++) {
                            var listLi = $('<li class="flexCenter"></li>').appendTo($("#table-item-3"));
                            otherQa(dataStr[i], listLi);
                        }
					}else{
						$("#table-item-3").html(strNo);
					}
					//分页
                    if(isbind==true){
                        $("#table-item-" + idItem).parent().find(".js-load-more").on("click", function () {
                            getWenda(false);
                        });
                    }
                    if (dataStr.length < rows) {
                        $("#table-item-3").parent().find(".js-load-more").unbind("click");
                        $("#table-item-3").parent().find(".js-load-more").hide();
                    }
				}
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		});
	}

	function lastestColum(dataStr,listLi,iftop){
		var madiaHead="../images/default-artical.jpg";
		if(dataStr.articleImg) {
			madiaHead ='/data/article/' + dataStr.articleImg ;
		}
		var sowU="";
		if(dataStr.pageViews!=0){
			if(dataStr.articleAgree!=0){
				sowU='<span>阅读量 '+dataStr.pageViews+'</span><span>赞 '+dataStr.articleAgree+'</span>'
			}else{
				sowU='<span>阅读量 '+dataStr.pageViews+'</span>'
			}
		}
		var columTag='';
		if(dataStr.colNum>0){
			if(iftop){
				columTag='<span class="columTag">置顶</span>';
			}else{
				columTag='<span class="columTag">'+columnType[dataStr.colNum].shortName+'</span>';
			}
		}
		var strAdd = '';
		strAdd += '<a target="_blank" href="/'+ pageUrl('a',dataStr) +'" class="flexCenter urlgo">';
		strAdd += '<div class="lefthead articalhead" style="background-image:url('+ madiaHead +')">'+columTag+'</div>';
		strAdd += '<div class="centercon centercon2"><p class="h1font ellipsisSty-2">'+ dataStr.articleTitle +'</p>';
		strAdd += '<div class="h2font showInfo clearfix">';
		strAdd += '<span class="ownerName"></span>';
		strAdd += '<span class="time">'+ commenTime(dataStr.publishTime) +'</span>';
		strAdd += sowU
		strAdd += '<span class="leaveMsgCount"></span>';
		strAdd += '</div></div>';
		strAdd += '</a>';
		
		var $strAdd = $(strAdd);
		listLi.append( $strAdd);
		leaveMsgCount(dataStr.articleId,1, $strAdd);
		if(dataStr.articleType==1){
			userFun(dataStr.ownerId, $strAdd);
		}else if(dataStr.articleType==2){
			cmpFun(dataStr.ownerId, $strAdd);
		}else if(dataStr.articleType==3){
            platform(dataStr.ownerId, $strAdd);
		}
	}

	function fillColum(dataStr,ListLi){
        $.ajax({
            "url":"/ajax/article/query",
            "type": "GET",
            "dataType": "json",
            "data": {
                articleId:dataStr.id
            },
            "success": function(data) {
                if(data.success) {
                    lastestColum(data.data, ListLi);
                }
            },
            "error": function() {
            }
        });
	}
	
	function otherColum(dataStr,listLi){
		var madiaHead="../images/default-artical.jpg";
		if(dataStr.articleImg) {
			madiaHead ='/data/article/' + dataStr.articleImg ;
		}
		var sowU="";
		if(dataStr.pageViews!=0){
			if(dataStr.articleAgree!=0){
				sowU='<span>阅读量 '+dataStr.pageViews+'</span><span>赞 '+dataStr.articleAgree+'</span>'
			}else{
				sowU='<span>阅读量 '+dataStr.pageViews+'</span>'
			}
		}
		var strAdd = '';
		strAdd += '<a target="_blank" href="/'+ pageUrl('a',dataStr) +'" class="flexCenter urlgo">';
		strAdd += '<div class="lefthead articalhead" style="background-image:url('+ madiaHead +')"></div>';
		strAdd += '<div class="centercon centercon2"><p class="h1font ellipsisSty-2">'+ dataStr.articleTitle +'</p>';
		strAdd += '<div class="h2font showInfo clearfix">';
		strAdd += '<span class="ownerName"></span>';
		strAdd += '<span class="time">'+ commenTime(dataStr.publishTime) +'</span>';
		strAdd += sowU
		strAdd += '<span class="leaveMsgCount"></span>';
		strAdd += '</div></div>';
		strAdd += '</a>';
		
		var $strAdd = $(strAdd);
		listLi.append($strAdd);
		leaveMsgCount(dataStr.articleId,1, $strAdd);
		if(dataStr.articleType==1){
			userFun(dataStr.ownerId, $strAdd);
		}else if(dataStr.articleType==2){
			cmpFun(dataStr.ownerId, $strAdd);
		}else if(dataStr.articleType==3){
			platform(dataStr.ownerId, $strAdd);
		}
	}
	
	function lastestQa(dataStr,listLi){
        var baImg = "../images/default-q&a.jpg";
        var subs = new Array();
        if(dataStr.img) {
        	var subs = strToAry(dataStr.img)
            baImg = "/data/question"+ subs[0];
        }
        var hd = "";
        if (dataStr.num > 0) {
            hd = '<span>回答 ' + dataStr.num + '</span>'
        }
        var strAdd = '<a target="_blank" href="/qa-show.html?id='+dataStr.id+'" class="flexCenter">'
        	strAdd += '<div class="lefthead qa-Head" style="background-image:url('+ baImg +')"><span class="columTag">问答</span></div>';
			strAdd += '<div class="centercon centercon2"><p class="h1font ellipsisSty-2">'+ dataStr.title +'</p>';
			strAdd += '<div class="h2font showInfo clearfix">'
			strAdd += '<span class="time">'+commenTime(dataStr.tm)+'</span><span class="qaPageview"></span>'+hd+'<span class="attendCount"></span>'
            strAdd += '</div></div></a>'

		var $str = $(strAdd);
		listLi.append($str);
		questioninfo(dataStr.id, $str);
		attendCount(dataStr.id, $str);
	}

	function otherQa(dataStr,listLi){
        var strAdd = '<a target="_blank" href="/qa-show.html?id='+dataStr.qid+'&topid='+dataStr.id+'" class="flexCenter">'+
            '<div class="madiaInfo">' +
            '<div class="ellipsisSty qa-question"></div>' +
            '<div class="flexCenter qa-owner">' +
            '</div>' +
            '<div class="qa-con ellipsisSty-3">' + listConCut(dataStr.cnt) +'</div>' +
            '<div class="showspan">' +
            '<span>'+commenTime(dataStr.createTime)+'</span>' +
            '<span class="agree"></span>' +
            '<span class="leaveMsgCount"></span>' +
            '</div>' +
            '</div></a>';
		var $str = $(strAdd);
		listLi.append($str);
        if(dataStr.agree > 0) {
            $str.find(".agree").html("赞	" + dataStr.agree);
        }
		questioninfo(dataStr.qid, $str);
        proinfo(dataStr.uid, $str);
		leaveMsgCount(dataStr.id,4, $str);
	}
	
	function attendCount(id, $str) {
		$.ajax({
			"url":"/ajax/watch/countProfessor",
			"type": "GET",
			"dataType": "json",
			"data": {
				id:id,
				type: 8
			},
			"success": function(data) {
				if(data.success) {
					if(data.data > 0) {
						$str.find(".attendCount").html("关注 " + data.data);
					}
				}
			},
			"error": function() {
			}
		});
	}
	
	
	function proinfo(pid, $str) {
		$.ajax({
			"url":"/ajax/professor/baseInfo/" + pid,
			"type": "GET",
			"dataType": "json",
			"data": {},
			"success": function(data) {
				if(data.success) {
					var dataStr = data.data
		            var baImg = "../images/default-photo.jpg";
		            if (dataStr.hasHeadImage == 1) {
		                baImg = "/images/head/" + dataStr.id + "_l.jpg";
		            }
		            var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
		            var os = "";
		            if (dataStr.title) {
		                if (dataStr.orgName) {
		                    os = dataStr.title + "，" + dataStr.orgName;
		                } else {
		                    os = dataStr.title;
		                }
		            } else {
		                if (dataStr.office) {
		                    if (dataStr.orgName) {
		                        os = dataStr.office + "，" + dataStr.orgName;
		                    } else {
		                        os = dataStr.office;
		                    }
		                } else {
		                    if (dataStr.orgName) {
		                        os = dataStr.orgName;
		                    }
		                }
		            }
		            var str = '<div class="owner-head useHead" style="background-image:url(' + baImg + ')"></div>' +
		                '<div class="owner-info">' +
		                '<div class="owner-name">' + dataStr.name + '<em class="authiconNew ' + userType.sty + '" title="' + userType.title + '"></em></div>' +
		                '<div class="owner-tit ellipsisSty">' + os + '</div>' +
		                '</div>'
		            $str.find(".qa-owner").html(str)
				}
			},
			"error": function() {
			}
		});
    }
  	function questioninfo(qid, $str) {
  		$.ajax({
			"url":"/ajax/question/qo",
			"type": "GET",
			"dataType": "json",
			"data": {
				id:qid
			},
			"success": function(data) {
				if(data.success) {
					$str.find(".qa-question").html(data.data.title);
					if(data.data.pageViews>0){
						$str.find(".qaPageview").html("阅读量 "+data.data.pageViews);
					}else{
						$str.find(".qaPageview").hide()
					}
					
				}
			},
			"error": function() {
			}
		});
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

	/*平台信息*/
    function platform(id,$listItem) {
        $.ajax({
            "url": "/ajax/platform/info",
            "data":{id:id},
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
	
	function rightAllCon(){
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
	
})