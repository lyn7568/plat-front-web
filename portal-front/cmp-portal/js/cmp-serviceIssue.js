$(function() {
	var orgId = $.cookie('orgId');
	var oProfessor = [];
	var sevriceId = GetQueryString("sevriceId");
	var re, reEnd, ue = UE.getEditor('editor', {}),
		temp = [];
	var defaultLinkMan=[];
	if(orgId == "" || orgId == null || orgId == "null") {
		location.href = "cmp-settled-log.html";
	}
	if(sevriceId) {
		$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
		getRecourceMe();
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
	} /*获取资源信息*/
	function getRecourceMe() {
		$.ajax({
			"url": "/ajax/ware/qo",
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					$("#uploadDd").siblings().remove();
					$("#fileList").append("<dd></dd><dd></dd>");
					temp = [];
					resourceHtml(data.data);
				}
			},
			"data": {
				"id": sevriceId
			},
			dataType: "json",
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
	}
	/*处理资源html代码*/
	function resourceHtml($da) {
		$("#resourceName").val($da.name); //名字
		if($da.cnt) { //厂商型号
			$("#modelNumber").val($da.cnt);
			autoGrow.call($("#modelNumber")[0])
		}
		if($da.cooperation) { //合作备注
			$("#remarkContent").val($da.cooperation);
		}
		if($da.keywords) {
			var oSub = $da.keywords.split(",");
			var oSt = "";
			for(var i = 0; i < oSub.length; i++) {
				oSt += '<li>' + oSub[i] + '<div class="closeThis"></div></li>'
			}
			$("#keyWordlist").html(oSt);
			if(oSub.length > 4) {
				$("#KeyWord").parent().addClass("displayNone");
			}
		} else {
			$("#keyWordlist").html("");
		}
		if($da.descp) { //编辑器
			ue.ready(function() {
				ue.setContent($da.descp);
			});

		}
		if($da.images) {
			var arr = [];
			var oImg = $da.images.split(",");
			for(var i = 0; i < oImg.length; i++) {
				var oString = '<dd>' +
					'<div class="imgItem">' +
					'<img src="' + "/data/ware" + oImg[i] + '"/>' +
					'</div>' +
					'<div class="file-panel">' +
					'<span class="cancel" flag=1></span>' +
					'</div>' +
					'</dd>'
				arr[i] = oString;
				temp[i] = oImg[i];
			}
			$("#fileList dd").eq(2).remove();
			if(oImg.length == 1) {
				$("#fileList").prepend(arr[0]);
			} else if(oImg.length == 2) {
				$("#fileList dd").eq(1).remove();
				$("#fileList").prepend(arr[1]);
				$("#fileList").prepend(arr[0]);
			} else if(oImg.length == 3) {
				$("#fileList dd").eq(1).remove();
				$("#fileList").prepend(arr[2]);
				$("#fileList").prepend(arr[1]);
				$("#fileList").prepend(arr[0]);
			}

		}
	}
	var uploader = WebUploader.create({
		auto: true,
		fileNumLimit: 3,
		swf: '../js/webuploader/Uploader.swf',
		server: '/ajax/ware/upload',
		fileSingleSizeLimit: 2 * 1024 * 1024,
		pick: {
			id: "#filePicker",
			multiple: false
		},
		accept: {
			title: 'Images',
			extensions: 'jpg,jpeg,png',
			mimeTypes: 'image/jpg,image/png,image/jpeg'
		}

	});

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {
		var $len = $("#fileList").find("img").length;
		fileId = file.id;
		if($len == 0 || $len == 1) {
			var oRemove = $("#fileList").find("dd");
			oRemove.eq(oRemove.length - 1).remove();
		}
		var $li = $(
				'<dd>' +
				'<div class="imgItem" id="' + file.id + '">' +
				'<img />' +
				'</div>' +
				//'<div class="info">' + file.name + '</div>' +
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
		$.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过2M')
	};
	uploader.on('uploadSuccess', function(file, data) {
		if(data.success) {
			temp.push(data.data[0].uri);
			uploader.removeFile(fileId);
		} else {
			$.MsgBox.Alert('提示', '只支持jpeg/jpg/png格式的图片');
		}
	});
	/*删除图片*/
	$("#fileList").on("click", ".cancel", function() {
		var flag = $(this).attr("flag");
		var oNum = $(this).parents("dd").index();
		temp.splice(oNum, 1);
		$(this).parent().parent().remove();
		var $len = $("#fileList").find("img").length;
		if($len != 2) {
			$("#fileList").append("<dd></dd>")
		}
	});
	/*服务名称*/
	$("#resourceName").bind({
		focus: function() {
			$("#resourceNamePrompt").show();
		},
		blur: function() {
			$("#resourceNamePrompt").hide();
		},
		keyup: function() {
			if($(this).val().length > 30) {
				$(this).val($(this).val().substr(0, 30));
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

	/*厂商型号*/
	$("#modelNumber").bind({
		focus: function() {
			$("#model").show();
		},
		blur: function() {
			$("#model").hide();
		},
		keyup: function() {
			if($(this).val().length > 250) {
				$(this).val($(this).val().substr(0, 250));
			}
		},
		input: function() {
			autoGrow.call(this);
		}
	});

	function autoGrow() {
		document.getElementById("tt").style.width = this.scrollWidth + "px";
		document.getElementById("tt").value = this.value;
		this.style.height = document.getElementById("tt").scrollHeight + "px";
	}
	$("#remarkContent").bind({
		focus: function() {
			$("#remark").show();
		},
		blur: function() {
			$("#remark").hide();
		}
	});
	/*合作备注*/
	limitObj("#remarkContent", 1000);
	/*发布*/
	$(".goFabu").click(function() {
		var oYes = term();
		if(oYes == 0) {
			return;
		}
		$.MsgBox.Confirm("提示", "确认发布该服务？", ajsPost);
	})
	/*预览*/
	$("#oPreview").click(function() {
		var oYes = term();
		if(oYes == 0) {
			return;
		}
		if(sevriceId) {
			ajsPost("/ajax/ware/draft/org/update", 1);
		} else {
			ajsPost("/ajax/ware/draft/org", 1);
		}
	})
	/*存草稿*/
	$("#oDraft").click(function() {
		var oYes = term();
		if(oYes == 0) {
			return;
		}
		if(sevriceId) {
			ajsPost("/ajax/ware/draft/org/update", 2);
		} else {
			ajsPost("/ajax/ware/draft/org", 2);
		}
	})
	/*删除*/
	$("#operateBlocko").on("click", ".deleteResource", function() {
		$.MsgBox.Confirm("提示", "确认删除该服务？", deleResource);
	})
	/*删除函数*/
	function deleResource() {
		$.ajax({
			"url": "/ajax/ware/delete",
			"type": "POST",
			"success": function(data) {
				if(data.success) {
					location.href = "cmp-serviceList.html"
				}
			},
			"data": {
				"id": sevriceId
			},
			"beforeSend": function() { /*console.log(this.data)*/ },
			"contentType": "application/x-www-form-urlencoded",
			dataType: "json"
		});
	}
	/*条件是否匹配*/
	function term() {
		var reName = $.trim($("#resourceName").val());
		var len=$("#expertli").find(".selectAdd");
		if(reName == "") {
			$.MsgBox.Alert('提示', '请输入服务名称。');
			return 0;
		}
		if(len.length==0) {
			$.MsgBox.Alert('提示', '请至少选择一个联系人。');
			return 0;
		}
	}

	function keyW() {
		var industrys = $("#keyWordlist li");
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
	/*发布函数*/
	function ajsPost(pa1, pa2) {
		var oUrl;
		if(sevriceId) {
			oUrl = "/ajax/ware/publish/org/update";
		} else {
			oUrl = "/ajax/ware/publish/org";
		}

		if(pa1) {
			oUrl = pa1
		}
		console.log(oProfessor)
		//return;
		var $data = {
			owner: orgId,
			name: $("#resourceName").val(),
			cooperation: $("#remarkContent").val(),
			keywords: keyW(),
			cnt: $("#modelNumber").val(),
			descp: ue.getContent(),
			images: temp.join(","),
			resource: resourcesli(),
			professor: oProfessor
		};
		if(sevriceId) {
			$data.id = sevriceId;
		}
		ajaxRequist(oUrl, $data, "POST", function(data) {
			if(data.success) {
				if(pa2 == 1) {
					if(!sevriceId)
						sevriceId = data.data;
					$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
					window.open("../sevricePreview.html?sevriceId=" + sevriceId);
					getRecourceMe();
					//弹出预览
				} else if(pa2 == 2) {
					$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
					if(!sevriceId)
						sevriceId = data.data;
					$.MsgBox.Alert('提示', '服务已保存草稿。');
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
					getRecourceMe();
				} else {
					$.MsgBox.Alert("提示", "服务发表成功！", function articalList() {
						location.href = "cmp-serviceList.html";
					});
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
					
				}

			} else {
				if(data.code == 90) {
					$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
				}
			}
		})

	}

	function UnauthorizedUser() {
		$.ajax({
			url: "/ajax/professor/qaOrgAuth",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: "false",
			data: {
				"orgId": orgId,
				"orgAuth": 1
			},
			success: function(data, textState) {
				if(data.success) {
					if(data.data.length>0){
						unauthUser(data.data);
					}else{
						var str = '<div class="default-text default-text-2" style="border:none"><div>您当前没有认证员工</div>'+
						   '<a href="cmp-staffList.html">点击这里进行认证</a></div>';
						$("#expertli").html(str);
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	UnauthorizedUser();
	getDefaultUser();
	function unauthUser($res) {
		if(sevriceId) {
			selUse();
		}
		var osting = ""
		for(var i = 0; i < $res.length; i++) {
			var img;
			var oClass = autho($res[i].authType, $res[i].orgAuth, $res[i].authStatus);
			var oTitle = "";
			for(var j=0; j<defaultLinkMan.length;j++){
				if($res[i].id === defaultLinkMan[j]){
					styC="selectAdd";
				}
			}
			if($res[i].title) {
				oTitle = $res[i].title;
			} else {
				if($res[i].office) {
					oTitle = $res[i].office;
				}
			}
			if($res[i].hasHeadImage) {
				img = "/images/head/" + $res[i].id + "_l.jpg";
			} else {
				img = "../images/default-photo.jpg"
			}
			var oSt = '<li class="flexCenter" style="cursor:pointer;" id="' + $res[i].id + '">'
			oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
			oSt += '<div class = "madiaInfo">'
			oSt += '<p class = "ellipsisSty">'
			oSt += '<span class = "h1Font" id="name">' + $res[i].name + '</span><em class="authicon ' + oClass.sty + '" title="' + oClass.title + '"></em >'
			oSt += '</p>'
			oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
			oSt += '</div>'
			oSt += '<div class="selectNull " flag=1></div>'
			oSt += '</li>'
			osting += oSt;
		}
		$("#expertli").html(osting);
	}
	
	function getDefaultUser() {
		$.ajax({
			url: "/ajax/org/linkman/queryAll",
			type: "GET",
			dataType: "json",
			data: {
				"oid": orgId
			},
			success: function(data) {
				if(data.success  && data.data != "") {
					var $data = data.data
					for(var i = 0; i < $data.length; i++){
						defaultLinkMan.push($data[i].pid)	
					}
					
				}
			}
		})
	}
	/*选择用户*/
	$("#expertli").on("click", "li", function() {
		var userL = $("#expertli").find(".selectAdd").length;
		var oSel = $(this).find(".selectAdd").length;
		var oId = $(this).attr("id");
		$("#linkman").text("");

		if(oSel == 0) {
			if(userL == 5) {
				$("#linkman").text("最多可选5个负责人");
				return;
			}
			$(this).find('[flag]').addClass("selectAdd");
			oProfessor.push(oId);
		} else {
			$(this).find('[flag]').removeClass("selectAdd");
			for(var i = 0; i < oProfessor.length; i++) {
				if(oId == oProfessor[i]) {
					oProfessor.splice(i, 1);
				}
			}
		}
	});

	function selUse() {
		$.ajax({
			url: "/ajax/ware/pro",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async: true,
			data: {
				"id": sevriceId,
			},
			success: function(data) {
				if(data.success) {
					var arr = [];
					var arr1 = [];
					var oLength = $("#expertli").find("li");
					for(var i = 0; i < data.data.length; i++) {
						arr1.push(data.data[i].professor);
					}
					for(var i = 0; i < oLength.length; i++) {
						arr.push(oLength.eq(i).attr("id"));
					}
					for(var i = 0; i < arr1.length; i++) {
						oProfessor.push(arr1[i]);
						oLength.eq(arr.indexOf(arr1[i])).find("[flag]").addClass("selectAdd")
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	$("#checkZy").on("keyup", function() {
		var ti = $(this).val();
		re = ti;
		if($(this).val() == "") {
			return;
		}
		var _this = this;
		setTimeout(function() {
			if(ti === re && ti !== reEnd) {
				checkZy(_this, ti);
			}

		}, 500)

	})
	$("#checkZy").on("focus", function() {
		$(this).prev().find("span").text("最多选择5个资源");
	})
	$("#checkZy").on("blur", function() {
		$(this).prev().find("span").text("");
	})

	function checkZy(_this, prd) {
		reEnd = prd;
		$.ajax({
			"url": "/ajax/resource/lq/publish/org",
			"type": "get",
			"data": {
				"orgid": orgId,
				"resourceName": $("#checkZy").val(),
				"rows": 5
			},
			"success": function(data) {
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
						$(_this).next().addClass("displayNone");
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
	$("#resouselist").on("click", "li", function() {
		var _this = this;
		expertlist(_this, "该资源已选择");
	});

	function resourcesli() {
		var resourcesarray = [];
		$("#resources li").each(function(i) {
			var liid = $(this).attr("data-id");
			resourcesarray.push(liid);
		});
		return resourcesarray;
	}
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
		if(plength.length >= 4) {
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
	if(!sevriceId)
	DefaultContact()
	function DefaultContact() {
		$.ajax({
			url: "/ajax/org/linkman/queryAll",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:"true",
			data: {
				"oid": orgId
			},
			success: function(data, textState) {
				if(data.success) {
					var $data = data.data;
					if($data.length) {
						oProfessor.push($data[0].pid);
						var oLength=$("#expertli").find("li");
							for(var i=0;i<oLength.length;i++) {
							var sid = oLength.eq(i).attr("id");
							if($data[0].pid ===sid) {
								oLength.eq(i).find("[flag]").addClass("selectAdd");
								break;
							}
						}
							oProfessor.push($data[0].pid);
					}
						
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	//删除右侧搜索出的专家和资源
	$(".addexpert").on("click", ".deleteThis", function() {
		var plength = $(this).parent().parent().find("li").length;
		if(plength < 6) {
			$(this).parents(".otherBlock").find("input").show();
		}
		$(this).parent().remove();
	})
	if(sevriceId) {
		ajaxRequist("/ajax/ware/res", {
			"id": sevriceId
		}, "get", function(data) {
			var $data = data.data;
			if($data.length>=5) {
				$("#checkZy").hide();
			}
			for(var i = 0; i < $data.length; i++) {
				(function(i) {
					ajaxRequist("/ajax/resource/queryOne", {
						"resourceId": $data[i].resource
					}, "get", function(data) {
						var $data = data.data;
						var itemlist = '<li id="usid" class="flexCenter" >' +
									'<p class="h1Font ellipsisSty-2 childElement" id="resourceName"></p>' +
									'<div class="deleteThis"></div></li>'
									var datalist = data.data;
									var $itemlist=$(itemlist);
									$("#resources").append($itemlist);
								$itemlist.attr("data-id", datalist.resourceId);
								$itemlist.find("#resourceName").text(datalist.resourceName);
								
					})
				})(i)
			}

		})
	}
})