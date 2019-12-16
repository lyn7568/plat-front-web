$(document).ready(function() {
	var resourceId = GetQueryString("productId");
	if(resourceId) {
		$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
		getRecourceMe();
		document.title = "修改产品-科袖网"
	}
	var orgId = $.cookie('orgId');
	if(orgId == "" || orgId == null || orgId == "null"){
    	location.href = "cmp-settled-log.html";
    }
	var temp = [];
	var array = [];
	var oProfessor=[];
	var hbur,hburEnd;
	ue = UE.getEditor('editor', {});
	/*获取资源信息*/
	function getRecourceMe() {
		$.ajax({
			"url": "/ajax/product/qo",
			"type": "GET",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					$("#uploadDd").siblings().remove();
					$("#fileList").append("<dd></dd><dd></dd>");
					temp=[];
					resourceHtml(data.data);
				}
			},
			"data": {
				"id": resourceId
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
		$("#application").val($da.cnt); //应用用途
		if($da.spec) { //厂商型号
			$("#modelNumber").val($da.spec);
		}
		if($da.parameter) { //性能参数
			$("#performancePa").val($da.parameter);
		}
		if($da.keywords) {
			var oSub = $da.keywords.split(",");
			var oSt = "";
			for(var i = 0; i < oSub.length; i++) {
				oSt += '<li>' + oSub[i] + '<div class="closeThis"></div></li>'
			}
			$("#keyWordlist").html(oSt);
			if(oSub.length>4){
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
		if($da.price) {
			$("#priceInput").val($da.price);
		}
		if($da.producingArea) {
			$("#productAddressInput").val($da.producingArea);
		}
		if($da.images) {
			var arr = [];
			var oImg = $da.images.split(",");
			for(var i = 0; i < oImg.length; i++) {
				var oString = '<dd>' +
					'<div class="imgItem">' +
					'<img src="' + "/data/product/" + oImg[i] + '"/>' +
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
		server: '/ajax/product/upload',
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
		fileId = file.id;
		var $len = $("#fileList").find("img").length;
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
		uploader.makeThumb(file, function(error, src) {
			if(error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr('src', src);
		}, 1, 1);
	});
	uploader.onError = function(code) {
		console.log(code)
		$.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过2M')
	};
	uploader.on('uploadSuccess', function(file, data) {
		if(data.success) {
				temp.push(data.data[0].uri);
				console.log(temp)
				uploader.removeFile(fileId);
				
		}else{
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
	/*资源名称*/
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
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}

	});
	$("#productAddressInput").bind({
		focus: function() {
			$("#productAddress").show();
		},
		blur: function() {
			$("#productAddress").hide();
		},
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}

	});
	$("#priceInput").bind({
		focus: function() {
			$("#price").show();
		},
		blur: function() {
			$("#price").hide();
		},
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}

	});
	/*应用用途*/
	limitObj("#application",250)
	/*性能参数*/
	limitObj("#performancePa",1000)
	/*发布*/
	$(".goFabu").click(function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		var oYes = term();
		if(oYes == 0) {
			return;
		}
		$.MsgBox.Confirm("提示", "确认发布该产品？", ajsPost);
	})
	/*预览*/
	$("#oPreview").click(function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		var oYes = term();
		if(oYes == 0) {
			return;
		}
		if(resourceId) {
			ajsPost("/ajax/product/draft/update", 1);
		}else {
			ajsPost("/ajax/product/draft", 1);
		}
		
	})
	/*存草稿*/
	$("#oDraft").click(function() {
		if($(this).hasClass("disableLi")){
			return;
		}
		var oYes = term();
		if(oYes == 0) {
			return;
		}
		if(resourceId) {
			ajsPost("/ajax/product/draft/update", 2);
		}else {
			ajsPost("/ajax/product/draft", 2);
		}
	})
	/*删除*/
	$("#operateBlocko").on("click", ".deleteResource", function() {
		$.MsgBox.Confirm("提示", "确认删除该产品？", deleResource);
	})
	/*删除函数*/
	function deleResource() {
		$.ajax({
			"url": "/ajax/product/delete",
			"type": "POST",
			"success": function(data) {
				console.log(data)
				if(data.success) {
					location.href = "cmp-productList.html"
				}
			},
			"data": {
				"id": resourceId
			},
			"beforeSend": function() { /*console.log(this.data)*/ },
			"contentType": "application/x-www-form-urlencoded",
			dataType: "json"
		});
	}
	/*条件是否匹配*/
	function term() {
		var $len = $("#fileList").find("img").length;
		var reName = $("#resourceName").val();
		var oIndustry = $("#application").val();
		var oLen=$("#expertli").find(".selectAdd").length
		if($len == 0) {
			$.MsgBox.Alert('提示', '请上传产品图片。');
			return 0;
		}
		if(reName == "") {
			$.MsgBox.Alert('提示', '请填写产品名称。');
			return 0;
		}
		if(oIndustry == "") {
			$.MsgBox.Alert('提示', '请填写产品简介。');
			return 0;
		}
		if(oLen==0) {
			$.MsgBox.Alert('提示', '至少选择一个联系人');
			return 0;
		}
	}
	/*发布函数*/
	function ajsPost(pa1, pa2) {
		
		var sdd=[];
		var sdf = $("#expertli").find(".selectAdd");
		for(var i=0;i<sdf.length;i++) {
			sdd.push(sdf.eq(i).parents("li").attr("id"));
		}
		var industrys = $("#keyWordlist li");
		var industryAll = "";
		if(industrys.size() > 0) {
			for(var i = 0; i < industrys.size(); i++) {
				industryAll += industrys[i].innerText.trim();
				industryAll += ',';
			};
			industryAll = industryAll.substring(0, industryAll.length - 1);
		}
		$(".operateBlock").find("li").addClass("disableLi");
		var oUrl = "/ajax/product/publish";
		if(resourceId) {
			oUrl = "/ajax/product/publish/update";
		}
		if(pa1) {
			oUrl = pa1
		}
		var $data = {};
		if(resourceId) {
			$data.id = resourceId;
		}
		$data.owner = orgId;
		$data.name = $("#resourceName").val(); //资源名字
		$data.keywords = industryAll;
		$data.cnt = $("#application").val();
		$data.spec = $("#modelNumber").val();
		$data.parameter = $("#performancePa").val();
		$data.descp = ue.getContent();
		$data.images = temp.join(",");
		$data.professor=sdd;
		$data.producingArea=$("#productAddressInput").val();
		$data.price = $("#priceInput").val()
		$.ajax({
			"url": oUrl,
			"type": "POST",
			"complete":function(){
						$(".operateBlock").find("li").removeClass("disableLi");
					},
			"success": function(data) {
				console.log(data)
				if(data.success) {
					if(pa2 == 1) {
						if(!resourceId)
						resourceId = data.data;
						$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
						window.open("../productPreview.html?productId=" + resourceId);
						getRecourceMe();
						//弹出预览
					} else if(pa2 == 2) {
						$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
						if(!resourceId)
						resourceId = data.data;
						$.MsgBox.Alert('提示', '产品已保存草稿。');
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
						getRecourceMe();
					} else {
						$.MsgBox.Alert("提示", "产品发表成功！", function articalList() {
						location.href = "cmp-productList.html";
						});
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
						
					}

				}else {
						if(data.code==90) {
							$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
						}
					}
			},
			"data": $data,
			"beforeSend": function() { /*console.log(this.data)*/ },
			"contentType": "application/x-www-form-urlencoded",
			"traditional": true,
			dataType: "json"
		});
	}
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
					}
						
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	function UnauthorizedUser() {
		$.ajax({
			url: "/ajax/professor/qaOrgAuth",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:"false",
			data: {
				"orgId": orgId,
				"orgAuth": 1
			},
			success: function(data, textState) {
				if(data.success) {
					console.log(data);
					unauthUser(data.data);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	UnauthorizedUser();
	function unauthUser($res) {
		if(resourceId) {
		selUse();
	}
	var osting=""
	for(var i = 0; i < $res.length; i++) {
		var img;
		//var styC="";
		var oClass = autho($res[i].authType, $res[i].orgAuth, $res[i].authStatus);
		var oTitle="";
		if(!resourceId) {
				/*if(i<5) {
				styC="selectAdd";
				oProfessor.push($res[i].id);
			}*/
		}
		
		if($res[i].title) {
			oTitle=$res[i].title;
		}else{
			if($res[i].office) {
				oTitle=$res[i].office;
			}
		}
		if($res[i].hasHeadImage) {
				img = "/images/head/" + $res[i].id + "_l.jpg";
			} else {
				img = "../images/default-photo.jpg"
			}
		var oSt = '<li class="flexCenter" style="cursor:pointer;" id="'+$res[i].id+'">'
		oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url('+img+');"></div>'
		oSt += '<div class = "madiaInfo">'
		oSt += '<p class = "ellipsisSty">'
		oSt += '<span class = "h1Font" id="name">'+$res[i].name+'</span><em class="authicon '+oClass.sty+'" title="'+oClass.title+'"></em >'
		oSt += '</p>'
		oSt += '<p class="h2Font ellipsisSty">'+oTitle+'</p>'
		oSt += '</div>'
		oSt += '<div class="selectNull " flag=1></div>'
		oSt += '</li>'
		osting+=oSt;
	}
	$("#expertli").html(osting);
	if(!resourceId) {
		DefaultContact()
	}
}
	/*选择用户*/
	$("#expertli").on("click","li",function(){
		var userL=$("#expertli").find(".selectAdd").length;
		var oSel=$(this).find(".selectAdd").length;
		var oId=$(this).attr("id");
		$("#linkman").text("");
		
		if(oSel == 0) {
			if(userL == 5) {
				$("#linkman").text("最多可选5位联系人");
				return;
			}
			$(this).find('[flag]').addClass("selectAdd");
			oProfessor.push(oId);
		} else {
			$(this).find('[flag]').removeClass("selectAdd");
			for(var i=0;i<oProfessor.length;i++) {
				if(oId==oProfessor[i]) {
					oProfessor.splice(i, 1);
				}
			}
		}
	});
	
	function selUse() {
		$.ajax({
			url: "/ajax/product/pro",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			async:true,
			data: {
				"id": resourceId,
			},
			success: function(data, textState) {
				console.log(data)
				if(data.success) {
					var arr=[];
					var arr1=[];
					var oLength=$("#expertli").find("li");
					for(var i=0;i<data.data.length;i++) {
						arr1.push(data.data[i].professor);
					}
					for(var i=0;i<oLength.length;i++) {
						arr.push(oLength.eq(i).attr("id"));
					}
					for(var i=0;i<arr1.length;i++) {
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
	
})