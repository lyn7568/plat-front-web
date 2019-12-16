$(function() {
	var experarray = [];
	var resourcesarray = [];
	var $data = {};
	var articleId;
	var fa = false;
    var orgId = $.cookie("orgId");
    var colMgr = stringToBoolean($.cookie("colMgr"));
	var resMgr = stringToBoolean($.cookie("resMgr"));
	
	if(!colMgr && !resMgr) {
		$(".conItem").eq(5).show();
	}
	if(resMgr) {
		$(".conItem").eq(2).show();
		$(".conItem").eq(3).show();
	}
	if(colMgr) {
		$(".conItem").show().eq(5).hide();
	}
    var hbur,hburEnd;
  	var pr,prEnd;
  	var re,reEnd;
  	var orgr,orgrEnd;
    if(orgId == "" || orgId == null || orgId == "null"){
    	location.href = "cmp-settled-log.html";
    }
    // 上传附件
	var uploaderFile =new WebUploader.create({
			auto: true,
			fileNumLimit: 5,
			server: '../ajax/article/files/upload',
			fileSingleSizeLimit: 50 * 1024 * 1024,
			pick: {
				id: "#upAttachPicker",
				multiple: false
			}
		});
		uploaderFile.on('error', function(code) {
			if(code=="F_EXCEED_SIZE"){
				$.MsgBox.Alert('提示', '上传附件的大小不超过50M')
			}
		});
		var fileId;
		// 当有文件添加进来的时候
		uploaderFile.on('fileQueued', function(file) {
			fileId = file.id;
		});
		uploaderFile.on('uploadError', function(file, data) {
			$.MsgBox.Alert('提示', '该附件上传失败，请重试')
		});
		uploaderFile.on('uploadSuccess', function(file, data) {
			if(data.success) {
				var $li = $(
					'<li class="file_list ellipsisSty-2" data-id="'+file.id+'" data-size="'+file.size+'" data-name="'+file.name+'">'+
						file.name +
						'<div class="deleteThis"></div>'+
					'</li>'
				),
					$file = $li.find('li');
				var $list = $("#fileAttachList");
				$list.prepend($li);
				var $len = $("#fileAttachList").find("li").length;
				if($len>0 && $len<5){
					$("#upAttachPicker").addClass("upAtteched")
					$("#upAttachPicker>.webuploader-pick").text('继续上传')
				}
				if($len>=5){
					$("#upAttachPicker").hide()
				}
				uploaderFile.removeFile(fileId);
				$("#fileAttachList li:first-child").attr("data-url",data.data[0].uri);
			}
		});
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
	$("#sevrice").on("focus", function() {
		$(this).prev().find("span").text("最多选择5个服务");
	})
	$("#product").on("focus", function() {
		$(this).prev().find("span").text("最多选择5个产品");
	})
	$("#checkZj,#checkZy,#sevrice,#product").on("blur", function() {
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
	var se,seEnd;
	$("#sevrice").on("keyup", function() {
		var ti=$(this).val();
		se=ti;
		if($(this).val()=="") {
			return;
		}
		var _this = this;
		setTimeout(function(){
			if( ti===se && ti!== seEnd) {
				checkSy(_this,ti);
			}
		},500)
		
	})
	var proD,proDEnd;
	$("#product").on("keyup", function() {
		var ti=$(this).val();
		proD=ti;
		if($(this).val()=="") {
			return;
		}
		var _this = this;
		setTimeout(function(){
			if( ti===proD && ti!== proDEnd) {
				checkProDy(_this,ti);
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
	$("#sevricelist").on("click", "li", function() {
		var _this = this;
		expertlist(_this, "该服务已选择");
	});
	$("#productlist").on("click", "li", function() {
		var _this = this;
		expertlist(_this, "该产品已选择");
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
		if(plength.length > 5) {
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
	
	$("#fileAttachList").on("click", ".deleteThis",function() {
		var filid = $(this).parent().attr("data-id");
		var $len = $("#fileAttachList li").length;
		if($len>0 && $len<5){
			$("#upAttachPicker").show()
			$("#upAttachPicker").addClass("upAtteched")
			$("#upAttachPicker>.webuploader-pick").text('继续上传')
		}
		if($len>=5){
			$("#upAttachPicker").hide()
		}
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
						$(_this).next().removeClass("displayNone");
						var itemlist = '<div class="null-data">没有找到相关专家</div>'
						$("#expertlist").html(itemlist);
						return;
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
	function checkZy(_this, prd) {
		reEnd = prd;
		$.ajax({
			"url": "/ajax/resource/lq/publish/org",
			"type": "get",
			"data": {
				"orgid": orgId,
				"resourceName": $("#checkZy").val(),
				"rows": 3
			},
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data != "") {
						if(reEnd == prd) {
							$(_this).next().removeClass("displayNone");
							$("#resouselist").html("");
							for(var i = 0; i < data.data.length; i++) {
								var itemlist = '<li id="usid" class="flexCenter" >' +
									'<p class="h1Font ellipsisSty-2 childElement" id="resourceName"></p>' +
									'<div class="deleteThis"></div></li>'
								$itemlist = $(itemlist);
								$("#resouselist").append($itemlist);
								var datalist = data.data[i];
								$itemlist.attr("data-id", datalist.resourceId);
								$itemlist.find("#resourceName").text(datalist.resourceName);

							}
						}
					} else {
						$(_this).next().removeClass("displayNone");
						var itemlist = '<div class="null-data">没有找到相关资源</div>'
						$("#resouselist").html(itemlist);
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
	function checkSy(_this, prd) {
		seEnd = prd;
		$.ajax({
			"url": "../ajax/ware/publish",
			"type": "get",
			"data": {
				category:2,
				owner:orgId,
				rows:5
			},
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data != "") {
						if(seEnd == prd) {
							$(_this).next().removeClass("displayNone");
							$("#sevricelist").html("");
							for(var i = 0; i < data.data.length; i++) {
								
								var itemlist = '<li id="usid" class="flexCenter" >' +
									'<p class="h1Font ellipsisSty-2 childElement" id="resourceName"></p>' +
									'<div class="deleteThis"></div></li>'
								$itemlist = $(itemlist);
								$("#sevricelist").append($itemlist);
								var datalist = data.data[i];
								$itemlist.attr("data-id", datalist.id);
								$itemlist.find("#resourceName").text(datalist.name);

							}
						}
					} else {
						$(_this).next().removeClass("displayNone");
						var itemlist = '<div class="null-data">没有找到相关服务</div>'
						$("#sevricelist").html(itemlist);
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
	function checkProDy(_this, prd) {
		proDEnd = prd;
		$.ajax({
			"url": "../ajax/product/publish",
			"type": "get",
			"data": {
				owner:orgId,
				rows:5
			},
			"success": function(data) {
				console.log(data);
				if(data.success) {
					if(data.data != "") {
						if(proDEnd == prd) {
							$(_this).next().removeClass("displayNone");
							$("#productlist").html("");
							for(var i = 0; i < data.data.length; i++) {
								var itemlist = '<li id="usid" class="flexCenter" >' +
									'<p class="h1Font ellipsisSty-2 childElement" id="resourceName"></p>' +
									'<div class="deleteThis"></div></li>'
								$itemlist = $(itemlist);
								$("#productlist").append($itemlist);
								var datalist = data.data[i];
								$itemlist.attr("data-id", datalist.id);
								$itemlist.find("#resourceName").text(datalist.name);

							}
						}
					} else {
						$(_this).next().removeClass("displayNone");
						var itemlist = '<div class="null-data">没有找到相关产品</div>'
						$("#productlist").html(itemlist);
					}
				} else {
					$(_this).next().addClass("displayNone");
				}
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
			$.MsgBox.Alert('提示', '请上传封面图片');
			return;
		} else {
			$(".imgtis").text("");
			imgflase = true;
		}
		if(newstitle == "") {
			$.MsgBox.Alert('提示', '请输入文章标题');
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
	function seli() {
		var arr=[];
		$("#sevriceli li").each(function(i) {
			var liid = $(this).attr("data-id");
			arr.push(liid);
		});
		return $.unique(arr);
	}
	function productli() {
		var arr=[];
		$("#productli li").each(function(i) {
			var liid = $(this).attr("data-id");
			arr.push(liid);
		});
		return $.unique(arr);
	}
	function fileArrli() {
		var arr=[];
		$("#fileAttachList li").each(function(i){
			var liid = $(this).attr("data-id"),
				liurl = $(this).attr("data-url")
				liname = $(this).attr("data-name"),
				lisize = $(this).attr("data-size");
			var item
			item=liurl+','+i+','+lisize+','+liname;
			arr.push(item)
		})
		return $.unique(arr);
	}
	var seleClum ='<div class="mb-list mb-listL"><p>请选择文章发布的栏目：</p>'+
		'<select class="form-control form-column" id="seletColum"></select></div>';
	var seleTime = '<div class="mb-list mb-listR"><p class="msg-tit">请设置文章发布的时间：</p>'+
			'<div style="position:relative"><div class="input-append date form_date form_datetime" data-link-field="dtp_input2" >'+
				'<em class="mr_sj"></em>'+
				'<input size="16" type="text" readonly class="frmtype frmcontype fColor" placeholder="请设置文章发布的时间">'+
				'<span class="dateIcon"><i class="icon-calendar displayNone"></i></span>'+
				'<span class="add-on"><i class="icon-th displayNone"></i></span>'+
			'</div>'+
			'<input type="hidden" id="dtp_input2"/>'+
			'<span></span></div></div>';
	var a = new Date();
	var c = a.getFullYear() + "-" + (Number(a.getMonth()) + 1) + "-" + (Number(a.getDate()));
	//文章发布
	$("#release").on("click", function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		noTitleImg();
		if(imgflase && titleflase) {
			if(colMgr){
				$(".blackcover2").fadeIn();
				var btnOk='<input class="mb_btn mb_btnOk mb_btnOkpub" type="button" value="确定">'
				$(".mb_btnOk").remove(); $("#promotGt").prepend(btnOk);
				$(".modelContain").show(); $("body").addClass("modelOpen");
				$(".mb-listR").remove();
				$(".mb-listL").remove();
				$("#promotTh").prepend(seleClum);
				fillColum(7);//填充select栏目
				$(".mb_btnOkpub").on("click", function() {
					$(".blackcover2").fadeOut();
					$(".modelContain").hide();
					$("body").removeClass("modelOpen");
					$.MsgBox.Confirm("提示", "确认发布该文章?", newsAdd);
				})
			}else{
				$.MsgBox.Confirm("提示", "确认发布该文章?", newsAdd);
			}
			
		}
	})

	//定时文章发布
	$("#setTimeIssue").on("click", function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		noTitleImg();
		if(imgflase && titleflase) {
			$(".blackcover2").fadeIn();
			var btnOk='<input class="mb_btn mb_btnOk mb_btnOkset" type="button" value="确定">'
			$(".mb_btnOk").remove(); $("#promotGt").prepend(btnOk);
			$(".modelContain").show(); $("body").addClass("modelOpen");
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
			if(colMgr){
				$(".mb-listL").remove();
				$("#promotTh").prepend(seleClum);
				fillColum(7);//填充select栏目
			}
			$(".mb_btnOkset").on("click", function() {
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
function getAttrId() {
		var arr=[];
		this.each(function(){
			 arr.push( $(this).attr("data-id"));
		});
		return arr;
	}
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
		$data.ownerId = orgId;
        $data.articleType = "2";
		if($("#companys li").length) {
			$data.orgs = getAttrId.call($("#companys li"));
		}
		$data.articleTitle = $("#newstitle").val();
		$data.subject = industryAll;
		$data.articleImg = $("#uploader").attr("data-id");
		$data.articleContent = ue.getContent();
		$data.professors = experarray;
		$data.resources = resourcesarray;
		$data.wares=seli();
		$data.products=productli();
		if(colMgr){
			$data.colNum = $("#seletColum").val();
			if(publishTime!="") {
				$data.publishTime = publishTime;
			}
			$data.files=fileArrli();
		}else{
			if(publishTime!="") {
				$data.publishTime = publishTime;
			}
			$data.colNum=2;
		}
		if($("#hidearticleId").val().length != 0) {
			$data.articleId = $("#hidearticleId").val();
		}
		console.log($data);
	}

	/*文章发布*/
	function newsAdd() {
		getdata();
		$(".operateBlock").find("li").addClass("disableLi");
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
						location.href = "cmp-articalList.html";
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
				console.log(data);
				if(data.success) {
					$("#hidearticleId").val(data.data);
					location.href = "cmp-articalList.html";
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
		getdata();
		$(".operateBlock").find("li").addClass("disableLi");
		$.ajax({
			"url": "/ajax/article/draft",
			"type": "post",
			"dataType": "json",
			"data": $data,
			"traditional": true, //传数组必须加这个
			"complete":function(){
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
							$.MsgBox.Alert("提示", "文章保存草稿失败！");
						}
					}
				}
				if(num == 2) {
					var fa=false;
					if(data.success) {
						$("#hidearticleId").val(data.data);
						articleId = data.data;
						$("#delete").removeClass("disableLi").addClass("odele");
						fa = true;
					}else{
						if(data.code==90) {
							$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
						}else{
							$.MsgBox.Alert("提示", "文章预览失败！");
						}
					}
					if(fa) {
						window.open("../articalPreview.html?articleId=" + articleId)
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
					location.href = "cmp-articalList.html";	
				} 
			},
			"error":function(){
				$.MsgBox.Alert('提示','链接服务器超时')
			}
		})
	}
    relatCompanies("#company");
    /*添加相关企业*/
    function  relatCompanies(sel) {
		$(sel).bind({
			paste: function(e) {
				var pastedText;
				if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
					            
					pastedText  = $(this).val() +  window.clipboardData.getData('Text');          
				} 
				else  {            
					pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
					          
				}
				$(this).val(pastedText);
				e.preventDefault();
			},
			cut: function(e) {
				var $this = $(this);
			},
			blur: function() {
				var $this = $(this);
				$(this).siblings(".aboutTit").find("span").text("");
				setTimeout(function() {
					$this.siblings(".form-drop").hide();
				}, 500)
			},
			focus: function() {
				$(this).siblings(".form-drop").show();
				$(this).siblings(".aboutTit").find("span").text("最多选择5家企业");
			},
			keyup: function(e) {
				 var ti=$(this).val();
				 orgr=ti;
				 var $this=$(this);
				if($(this).val().trim()) {
					var lNum = $.trim($(this).val()).length;
					if(0 < lNum) {
						setTimeout(function(){
							if( ti===orgr && ti!== orgrEnd) {
								var tt=ti;
								orgrEnd=tt;
								$("#companylist").parent().show();
								$.ajax({
									"url": "/ajax/org/qr",
									"type": "GET",
									"data":{
										kw: $this.val(),
										limit:3
									},
									"success": function(data) {
										console.log(data);
										if(data.success) {
											if(orgrEnd==tt) {
												if(data.data.length == 0) {
													$this.parent().removeClass("displayNone");
													var itemlist = '<div class="null-data">没有找到相关企业</div>'
													$("#companylist").html(itemlist);
												} else {
													$this.siblings(".form-drop").removeClass("displayNone");
													var oSr = "";
													for(var i = 0; i < data.data.length; i++) {
														var busName=(data.data[i].forShort)?data.data[i].forShort:data.data[i].name;
														oSr += '<li style="min-height:40px;position:static;"data-id="'+data.data[i].id+'">' + busName + '</li>';
													}
													$this.siblings(".form-drop").find("ul").html(oSr);
												}
											}
										} else {
											$this.siblings(".form-drop").addClass("displayNone");
											$this.siblings(".form-drop").find("ul").html("");
										}
									},
									dataType: "json"
								});
							}
						},500)
					}
				} else {
					$(this).siblings(".form-drop").addClass("displayNone");
					$(this).siblings(".form-drop").find("ul").html("");
				}
			}
		})
		$("#company").siblings(".form-drop").on("click", "li", function() {
			var oValue = $(this).text();
			var oJudge = $(this).parents(".form-drop").siblings(".form-result").find("ul li");
			for(var i = 0; i < oJudge.length; i++) {
				if(oValue == oJudge[i].innerText) {
					$.MsgBox.Alert('提示', '该企业已选择.');
					return;
				}
			}
			$(this).parents(".form-drop").siblings(".form-result").find("ul").append('<li class="ellipsisSty" style="min-height:40px;padding-right:42px;" data-id="'+$(this).attr("data-id")+'">' + oValue + '<div class="deleteThis"></div></li>');
			$(this).parents(".form-drop").siblings("input").val("");
			if(oJudge.length == 4) {
				$(this).parents(".form-drop").siblings("input").val("");
				$("#company").hide();
			}
			$(this).parent("ul").html("")
		})
	}
});
