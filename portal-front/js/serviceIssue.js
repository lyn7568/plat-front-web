$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	valUser();
	var sevriceId = GetQueryString("sevriceId"),
		flag = GetQueryString("flag");
	if(sevriceId) {
		$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
		getRecourceMe();
	}
	var userid = $.cookie("userid");
	var temp = [];
	var ue = UE.getEditor('editor', {});

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
	/*获取资源信息*/
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
	limitObj("#remarkContent", 1000)
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
			ajsPost("/ajax/ware/draft/update", 1);
		} else {
			ajsPost("/ajax/ware/draft", 1);
		}
	})
	/*存草稿*/
	$("#oDraft").click(function() {
		var oYes = term();
		if(oYes == 0) {
			return;
		}
		if(sevriceId) {
			ajsPost("/ajax/ware/draft/update", 2);
		} else {
			ajsPost("/ajax/ware/draft", 2);
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
					location.href = "serviceList.html"
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
		if(reName == "") {
			$.MsgBox.Alert('提示', '请输入服务名称。');
			return 0;
		}
	}

	function relaResource() {
		var arr1 = $("#expertli").find(".selectAdd"),
			arr2 = [];
		for(var i = 0; i < arr1.length; i++) {
			arr2.push(arr1.eq(i).parents("li").attr("data-id"));
		}
		return arr2;
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
			oUrl = "/ajax/ware/publish/update";
		} else {
			oUrl = "/ajax/ware/publish";
		}

		if(pa1) {
			oUrl = pa1
		}
		var $data = {
			owner: userid,
			name: $("#resourceName").val(),
			cooperation: $("#remarkContent").val(),
			keywords: keyW(),
			cnt: $("#modelNumber").val(),
			descp: ue.getContent(),
			images: temp.join(","),
			resource: relaResource()
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
					window.open("sevricePreview.html?sevriceId=" + sevriceId);
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
						location.href = "serviceList.html";
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
	$("#expertli").on("click", "li", function() {
		if(!$(this).find(".selectNull").hasClass("selectAdd"))
		if($("#expertli").find(".selectAdd").length>=5) {
			$.MsgBox.Alert('提示','相关资源最多选择5个');
			return;
		}
		$(this).find(".selectNull").toggleClass("selectAdd");
	});
	ajaxRequist("/ajax/resource/qaProPublish", {
		"professorId": userid
	}, "get", function(data) {
		var data = data.data,
			oArr = [];
		if(data.length == 0) {
			$("#expertli").addClass("displayNone").siblings(".seRe").removeClass('displayNone');
		} else {
			for(var i = 0; i < data.length; i++) {
				oArr.push(data[i].resourceId);
				var str = '<li class="listy" data-id="' + data[i].resourceId + '">' +
					'<p class="col-w-9 h2font ellipsisSty-2 col childElement">' + data[i].resourceName + '</p>' +
					'<div class="selectNull"></div></li>'
				$("#expertli").append(str);
			}

			if(sevriceId)
				ajaxRequist("/ajax/ware/res", {
					"id": sevriceId
				}, "get", function(data) {
					var $data = data.data;
					outomost:
						for(var i = 0; i < $data.length; i++) {
							for(var j = 0; j < oArr.length; j++) {
								if($data[i].resource === oArr[j]) {
									$("#expertli").find(".selectNull").eq(j).addClass("selectAdd");
									continue outomost;
								}
							}
						}
				})
		}
	})

})