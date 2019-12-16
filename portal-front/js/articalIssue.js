$(function() {
	loginStatus(); //判断个人是否登录
	valUser();
	var experarray = [];
	var resourcesarray = [];
	var $data = {};
	var articleId;
	var fa = false;
  	var userid = $.cookie("userid");   
  	var hbur,hburEnd;
  	var pr,prEnd;
  	var re,reEnd;
	//校验标题
	$("#newstitle").on({
		focus: function() {
			$(this).prev().find("span").text("50字以内");
		},
		blur: function() {
			$(this).prev().find("span").text("");
		},
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}
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

	//校验右侧专家和资源
	$("#checkZj").on("focus", function() {
		$(this).prev().find("span").text("最多选择5位专家");
	})
	$("#checkZy").on("focus", function() {
		$(this).prev().find("span").text("最多选择5个资源");
	})
	$("#checkZj,#checkZy").on("blur", function() {
		$(this).prev().find("span").text("");
	})

	$("#checkZj").on("keyup", function() {
		var _this = this;
		var ti=$(this).val();
		pr=ti;
		if($(this).val()=="") {
			return;
		}
		setTimeout(function(){
				if( ti===pr && ti!== prEnd) {
					checkZj(_this,ti);
				}
				
			},500)
		
	})

	$("#checkZy").on("keyup", function() {
		var ti=$(this).val();
		re=ti;
		if($(this).val()=="") {
			return;
		}
		var _this = this;
		setTimeout(function(){
				if( ti===re && ti!== reEnd) {
					checkZy(_this,ti);
				}
				
			},500)
		
	})

	$("#expertlist").on("click", "li", function() {
		var _this = this;
		expertlist(_this, "该专家已选择");
	});
	$("#resouselist").on("click", "li", function() {
		var _this = this;
		expertlist(_this, "该资源已选择");
	});

	//点击右侧搜索出的专家和资源列表
	function expertlist(_this, title) {
		var liId = $(_this).html();
		var plength = $(_this).parents(".otherBlock").find(".addexpert li");
		for(var i = 0; i < plength.length; i++) {
			if(plength[i].innerHTML == liId) {
				$(_this).parents(".otherBlock").find(".aboutTit span").text(title);
				$(_this).parents(".otherBlock").find(".form-drop").addClass("displayNone");
				$(_this).parents(".otherBlock").find("input").val("");
				return;
			}
		}
		if(plength.length > 3) {
			$(_this).parents(".otherBlock").find("input").hide();
			$(_this).parents(".otherBlock").find(".addexpert").append($(_this).clone());
			$(_this).parents(".otherBlock").find("input").val("");
			$(_this).parents(".otherBlock").find(".form-drop").addClass("displayNone");
		} else {
			$(_this).parents(".otherBlock").find(".addexpert").append($(_this).clone());
			$(_this).parents(".otherBlock").find("input").val("");
			$(_this).parents(".otherBlock").find(".form-drop").addClass("displayNone");
		}
	}

	//删除右侧搜索出的专家和资源
	$(".addexpert").on("click", ".deleteThis", function() {
		var plength = $(this).parent().parent().find("li").length;
		if(plength < 6) {
			$(this).parents(".otherBlock").find("input").show();
		}
		$(this).parent().remove();
	})

	function checkZj(_this,prd) {
		prEnd=prd;
		$.ajax({
			"url": "/ajax/professor/qaByName",
			"type": "get",
			"data": {
				"name": $("#checkZj").val(),
				"total": 3
			},
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data != "") {
							if(prEnd == prd){
								$(_this).next().removeClass("displayNone");
								var itemlist = '';
								$("#expertlist").html("");
								for(var i = 0; i < data.data.length; i++) {
									var itemlist = '<li id="usid" class="flexCenter">';
									itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
									itemlist += '<div class="madiaInfo">';
									itemlist += '<p class="ellipsisSty"><span class="h1Font" id="name"></span><span class="h2Font" style="margin-left:10px;" id="title"></span></p>';
									itemlist += '<p class="h2Font ellipsisSty" id="orgName"></p>';
									itemlist += '</div><div class="deleteThis"></div></li>';
									$itemlist = $(itemlist);
									$("#expertlist").append($itemlist);
									var datalist = data.data[i];
									$itemlist.attr("data-id", datalist.id);
									$itemlist.find("#name").text(datalist.name);
									$itemlist.find("#title").text(datalist.title);
									$itemlist.find("#orgName").text(datalist.orgName);
									if(datalist.hasHeadImage == 1) {
										$itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + datalist.id + "_l.jpg);");
									}
							}		
						}
					} else {
						$(_this).next().addClass("displayNone");
					}
				} else {
					$(_this).next().addClass("displayNone");
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}

	function checkZy(_this,prd) {
		reEnd=prd;
		$.ajax({
			"url": "/ajax/resource/qaByName",
			"type": "get",
			"data": {
				"resourceName": $("#checkZy").val(),
				"rows": 3
			},
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data != "") {
						if(reEnd==prd) {
								$(_this).next().removeClass("displayNone");
								var itemlist = '';
								$("#resouselist").html("");
								for(var i = 0; i < data.data.length; i++) {
									var itemlist = '<li id="usid" class="flexCenter">';
									itemlist += '<div class="madiaHead resouseHead" id="userimg"></div>';
									itemlist += '<div class="madiaInfo">';
									itemlist += '<p class="h1Font ellipsisSty" id="resourceName"></p>';
									itemlist += '<p class="h2Font ellipsisSty" id="name"></p>';
									itemlist += '</div><div class="deleteThis"></div></li>';
									$itemlist = $(itemlist);
									$("#resouselist").append($itemlist);
									var datalist = data.data[i];
									$itemlist.attr("data-id", datalist.resourceId);
									$itemlist.find("#resourceName").text(datalist.resourceName);
									if(datalist.resourceType==1){
										$itemlist.find("#name").text(datalist.professor.name);
									}else{
										$itemlist.find("#name").text(datalist.organization.name);
									}
									if(datalist.images.length > 0) {
										$itemlist.find("#userimg").attr("style", "background-image: url(/data/resource/" + datalist.images[0].imageSrc + ");");
									}
								}
							}	
					} else {
						$(_this).next().addClass("displayNone");
					}
				} else {
					$(_this).next().addClass("displayNone");
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}
	
	var titleflase = false;
	var imgflase = false;
	//交验图片和标题不能为空
	function noTitleImg() {
		var ImageKey = $("#uploader").attr("data-id");
		var newstitle = $("#newstitle").val();
		if(ImageKey == "") {
			//$(".imgtis").text("请上传封面图片");
			$.MsgBox.Alert('提示', '请上传封面图片');
			return;
		} else {
			$(".imgtis").text("");
			imgflase = true;
		}
		if(newstitle == "") {
			$.MsgBox.Alert('提示', '请输入文章标题')
			//$("#aboutTit span").text("请输入文章标题");
			return;
		} else {
			$("#aboutTit span").text("");
			titleflase = true;
		}
	}

	//获取相关专家
	function expertli() {
		experarray=[];
		$("#expertli li").each(function(i) {
			var liid = $(this).attr("data-id");
			experarray.push(liid);
		});
		return $.unique(experarray);
	}

	//获取相关资源
	function resourcesli() {
		resourcesarray=[];
		$("#resources li").each(function(i) {
			var liid = $(this).attr("data-id");
			resourcesarray.push(liid);
		});
		return $.unique(resourcesarray);
	}

	//文章发布
	$("#release").on("click", function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		noTitleImg();
		if(imgflase && titleflase) {
			$.MsgBox.Confirm("提示", "确认发布该文章?", newsAdd);
		}
	})
	var seleTime = '<div class="mb-list mb-listR"><p class="msg-tit">请设置文章发布的时间：</p>'+
			'<div style="position:relative"><div class="input-append date form_date form_datetime" data-link-field="dtp_input2" >'+
				'<em class="mr_sj"></em>'+
				'<input size="16" type="text" readonly class="frmtype frmcontype fColor" placeholder="请设置文章发布的时间">'+
				'<span class="dateIcon"><i class="icon-calendar displayNone"></i></span>'+
				'<span class="add-on"><i class="icon-th displayNone"></i></span>'+
			'</div>'+
			'<input type="hidden" id="dtp_input2"/>'+
			'<span></span></div></div>'
	var a = new Date();
	var c = a.getFullYear() + "-" + (Number(a.getMonth()) + 1) + "-" + (Number(a.getDate()));
	//定时文章发布
	$("#setTimeIssue").on("click", function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		noTitleImg();
		if(imgflase && titleflase) {
			$(".blackcover2").fadeIn();
			$(".modelContain").show();
			$("body").addClass("modelOpen");
			$(".mb-listR").remove(); $("#promotTh").append(seleTime);//时间选择器
			$(".mb-listR .form_datetime").datetimepicker({
				language:  'ch',
				format: 'yyyy-mm-dd hh:ii',
				forceParse: 1,
				autoclose: 1,
				todayBtn: 1,
				todayHighlight: 1,
				startDate: c,
				oflag: 1,
			});
			$(".mb-listR .form_datetime .frmcontype").val(getNowFormatDate());
			$(".mb_btnOk").on("click", function() {
				var publishTime = $(".mb-listR .form_datetime .frmcontype").val();
				console.log(st6(publishTime));
				setTimeIssue(st6(publishTime));

			})
		}
	})

	//文章存草稿
	$("#draft").on("click", function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		noTitleImg();
		if(imgflase && titleflase) {
			draftAdd(1);
		}
	})

	//文章预览
	$("#preview").on("click", function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		noTitleImg();
		if(imgflase && titleflase) {
			draftAdd(2);
		}
	})

	/*获取数据*/
	function getdata(publishTime) {
		var industrys = $("#keyWordlist li");
		var industryAll = "";
		if(industrys.size() > 0) {
			for(var i = 0; i < industrys.size(); i++) {
				industryAll += industrys[i].innerText.trim();
				industryAll += ',';
			};
			industryAll = industryAll.substring(0, industryAll.length - 1);
		}
		expertli(); //相关专家
		resourcesli(); //相关咨询
		$data.ownerId = userid;
        $data.articleType = "1";
		$data.articleTitle = $("#newstitle").val();
		$data.subject = industryAll;
		$data.articleImg = $("#uploader").attr("data-id");
		$data.articleContent = ue.getContent();
		$data.professors = experarray;
		$data.resources = relaResource("resouceli");
		$data.colNum=1;
		$data.wares=relaResource("sevriceli");
		if($("#hidearticleId").val().length != 0) {
			$data.articleId = $("#hidearticleId").val();
		}
		if(publishTime!="") {
			$data.publishTime = publishTime;
		}
		console.log($data);
	}

	/*文章发布*/
	function newsAdd() {
		$(".operateBlock").find("li").addClass("disableLi");
		getdata();
		$.ajax({
			"url": "/ajax/article/save",
			"type": "post",
			"dataType": "json",
			"data": $data,
			"traditional": true, //传数组必须加这个
			"complete":function(){
				$(".operateBlock").find("li").removeClass("disableLi");
			},
			"success": function(data) {
				console.log(data);
				if(data.success) {
					$("#hidearticleId").val(data.data);
					$.MsgBox.Alert("提示", "文章发表成功！", function articalList() {
						location.href = "articalList.html";
					});
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
				} else {
					if(data.code==90) {
						$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
					}else{
						$.MsgBox.Alert("提示", "文章发表失败！");
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}

	/*文章定时发布*/
	function setTimeIssue(publishTime) {
		var opublishTime=publishTime+"01";
		getdata(opublishTime);
		$(".operateBlock").find("li").addClass("disableLi");
		$.ajax({
			"url": "/ajax/article/timing",
			"type": "post",
			"dataType": "json",
			"data": $data,
			"traditional": true, //传数组必须加这个
			"complete":function(){
				$(".operateBlock").find("li").removeClass("disableLi");
			},
			"success": function(data) {
				if(data.success) {
					console.log(data)
					$("#hidearticleId").val(data.data);
					location.href = "articalList.html";
				} else {
					if(data.code==90) {
						$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
					}else{
						$.MsgBox.Alert("提示", "文章发表失败！");
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}

	/*文章添加草稿和文章预览*/
	function draftAdd(num) {
		$(".operateBlock").find("li").addClass("disableLi");
		getdata();
		$.ajax({
			"url": "/ajax/article/draft",
			"type": "post",
			"dataType": "json",
			"data": $data,
			"traditional": true, //传数组必须加这个
			complete:function(){
				$(".operateBlock").find("li").removeClass("disableLi");
			},
			"success": function(data) {
				console.log(data);
				if(num == 1) {
					if(data.success) {
						$("#hidearticleId").val(data.data);
						articleId = data.data;
						$.MsgBox.Alert("提示", "文章已保存草稿。");
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
						$("#delete").removeClass("disableLi").addClass("odele");
					}else{
						if(data.code==90) {
							$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
						}else{
							$.MsgBox.Alert("提示", "文章发表失败！");
						}
					}
				}
				if(num == 2) {
					if(data.success) {
						$("#hidearticleId").val(data.data);
						articleId = data.data;
						$("#delete").removeClass("disableLi").addClass("odele");
						fa = true;
					}else{
						if(data.code==90) {
							$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
						}else{
							$.MsgBox.Alert("提示", "文章发表失败！");
						}
					}
					if(fa) {
						window.open("articalPreview.html?articleId=" + articleId)
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
	}

	function st6(osr) {
		var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10) + osr.substring(11, 13) + osr.substring(14, 16);
		return tim;
	}
	/*删除文章*/
	$(".operateBlock").on("click",".odele",function(){
		$.MsgBox.Confirm("提示","确认删除该文章？",newsDelet);
	})
	/*文章删除*/
    function newsDelet() {
    	$.ajax({
			"url" : "/ajax/article/deleteArticle",
			"type" : "POST",
			"dataType" : "json",
			"data": {
				"articleId": articleId
			},
			"success" : function($data) {							
				if ($data.success) {
					location.href = "articalList.html";	
				} 
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		})
	}
    $("#sevriceli,#resouceli").on("click", "li", function() {
		$(this).find(".selectNull").toggleClass("selectAdd");
	});
	 function relaResource(select) {
		var arr1 = $("#"+select).find(".selectAdd"),
			arr2 = [];
		for(var i = 0; i < arr1.length; i++) {
			arr2.push(arr1.eq(i).parents("li").attr("data-id"));
		}
		return arr2;
	}
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
	ajaxRequist("/ajax/ware/publish", {
		category:1, 
		owner:userid,
		rows:1111,
	}, "get", function(data) {
		var data = data.data,
			oArr = [];
		if(data.length == 0) {
			$("#sevriceli").addClass("displayNone").siblings(".seRe").removeClass('displayNone');
		} else {
			for(var i = 0; i < data.length; i++) {
				oArr.push(data[i].id);
				var str = '<li class="listy" data-id="' + data[i].id + '" style="margin-left:-20px;margin-right:-20px;">' +
					'<p class="col-w-9 h2font ellipsisSty-2 col childElement">' + data[i].name + '</p>' +
					'<div class="selectNull"></div></li>'
				$("#sevriceli").append(str);
			}
		}
	})
	ajaxRequist("/ajax/resource/qaProPublish", {
		"professorId": userid
	}, "get", function(data) {
		console.log(data)
		var data = data.data,
			oArr = [];
		if(data.length == 0) {
			$("#resouceli").addClass("displayNone").siblings(".seRe").removeClass('displayNone');
		} else {
			for(var i = 0; i < data.length; i++) {
				oArr.push(data[i].resourceId);
				var str = '<li class="listy" style="margin-right:-20px;margin-left:-20px;"data-id="' + data[i].resourceId + '">' +
					'<p class="col-w-9 h2font ellipsisSty-2 col childElement">' + data[i].resourceName + '</p>' +
					'<div class="selectNull"></div></li>'
				$("#resouceli").append(str);
			}
		}
	})
});
