$(document).ready(function() {
	$(".onlogin .headnavbtn li").eq(0).addClass("navcurrent");
	var id = $.cookie('orgId');
	if(id == "" || id == null || id == "null") {
		location.href = "cmp-settled-log.html";
	}
	var fileId = null;
	var cacheImageKey = null;
	/*企业信息*/
	function companyInformation() {
		$.ajax({
			url: "/ajax/org/" + id,
			type: "GET",
			timeout: 10000,
			dataType: "json",
			beforeSend: function() {},
			success: function(data, textState) {
				if(data.success) {
					console.log(data);
					var $data = data.data;
					$(".h1Font").text($data.name);
					var num=new Date().getTime();
					if($data.hasOrgLogo) {
						$("#oimg").attr("src", "/images/org/" + $data.id + ".jpg?"+num);
					}
					if($data.orgUrl) {
						$("#inteAddress").val($data.orgUrl);
					} else {
						$("#inteAddress").val("");
					}
					if($data.forShort) {
						$("#businessAbbreviation").val($data.forShort);
					} else {
						$("#businessAbbreviation").val("");
					}
					if($data.foundTime) {
						var oTime = timeGeshi($data.foundTime);
						$("#createTime").val(oTime);
					} else {
						$("#createTime").val("");
					}
					if($data.province) {
						$("#oprovince").text($data.province);
					} else {
						$("#oprovince").text("请选择企业总部所在省或直辖市");
					}
					if($data.city) {
						$("#ocity").text($data.city);
					} else {
						$("#ocity").text("请选择企业总部所在城市");
					}
					if($data.descp) {
						$("textarea").val($data.descp);
						$("textarea").siblings().find("em").text($("textarea").val().length)
					}
					if($data.orgSize) {
						$("#qualificationList").val($data.orgSize)
					}
					if($data.orgType) {
						$("#orgType").val($data.orgType)
					}
					if($data.industry) {
						indu($data.industry, '#industryList')
					}
					if($data.subject) {
						indu($data.subject, '#subjectList')
					}
					if($data.qualification) {
						indu($data.qualification, '.editUlistC')
					}
					if($data.fieldOfSupplier) {
						indu($data.fieldOfSupplier, '#subjectListOut')
					}
					if($data.fieldOfCustomer) {
						indu($data.fieldOfCustomer, '#subjectListIn')
					}
					if($data.addr) {
						$("#cmpAddress").val($data.addr);
					}
					if($data.contactNum) {
						$("#phone").val($data.contactNum);
					}
					if($data.email) {
						$("#mail").val($data.email);
					}
					//省份城市颜色
					if($("#oprovince").text() == "请选择企业总部所在省或直辖市") {
						$("#oprovince").removeClass("mr_select");
					} else {
						$("#oprovince").addClass("mr_select");
					}
					if($("#ocity").text() == "请选择企业总部所在城市") {
						$("#ocity").removeClass("mr_select");
					} else {
						$("#ocity").addClass("mr_select");
					}
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	companyInformation()
	/*时间格式*/
	function timeGeshi(otm) {
		var otme = otm.substring(0, 4) + "-" + otm.substring(4, 6) + "-" + otm.substring(6, 8);
		return otme;
	}
	/*企业简介限制在1000字内*/
	limitObj(".msgCont",1000)

	/*应用行业及领域及企业资质*/
	function indu(oString, oSelector) {
		var arr = oString.split(",");
		var oArr = new Array();
		var i;
		for(i in arr) {
			oArr.push('<li>' + arr[i] + '<div class="closeThis"></div></li>');
		}
		$(oSelector).html(oArr.join(""));
	}
	
	hotKey(".oinput");
	/*删除*/
	$("body").on("click", ".closeThis", function() {
		if($(this).parent().length < 5) {
			$(this).parents(".keyResult").siblings("div").show();
		}
		$(this).parent().remove();

	})
	/*保存*/
	$("button:contains('保存')").click(function() {
		var oBusinessAbbreviation = $("#businessAbbreviation").val().trim();
		if(!oBusinessAbbreviation) {
			$.MsgBox.Alert('提示', '企业简称不能为空');
			return;
		}
		if(oBusinessAbbreviation.length > 10) {
			$.MsgBox.Alert('提示', '企业简称不得超过10个字');
			return;
		}
		/*
		var oTextArea = $("textarea").val().trim();
		var oBusinessType = $("#orgType").find("option").length;
		var oBusinessDimensions = $("#qualificationList").find("li.cmpBg.listactive").length;
		var oIndustryNumber = $("#industryList").find("li").length;
		var oSubjectNumber = $("#subjectList").find("li").length;
		var oEditUlistCNumber = $(".editUlistC ").find("li").length;
			
		if(!oTextArea) {
			$.MsgBox.Alert('提示', '企业简介不能为空');
			return;
		}
		if(oBusinessType == 0) {
			$.MsgBox.Alert('提示', '请选择企业类型');
			return;
		}
		if(oIndustryNumber == 0) {
			$.MsgBox.Alert('提示', '企业所属行业必填一项');
			return;
		}
		if(oSubjectNumber == 0) {
			$.MsgBox.Alert('提示', '企业所属领域必填一项');
			return;
		}
		if(oBusinessDimensions == 0) {
			$.MsgBox.Alert('提示', '请选择企业规模');
			return;
		}
		if(oEditUlistCNumber == 0) {
			$.MsgBox.Alert('提示', '企业资质必填一项');
			return;
		}*/
		var $info = {};
		$info.id = id;
		if(cacheImageKey != null) {
			$info.fn = cacheImageKey;
		}
		$info.forShort = $("#businessAbbreviation").val();
		if($("#orgType").find("option:selected").text() != "请选择最符合的一项") {
			$info.orgType = $("#orgType").find("option:selected").val()
		}
		if($("#qualificationList").find("option:selected").text() != "请选择员工数量范围") {
			$info.orgSize = $("#qualificationList").find("option:selected").val();
		}
		if($("#inteAddress").val().trim()) {
			if($("#inteAddress").val().trim().length > 50) {
				$.MsgBox.Alert('提示', '企业官网不得超过50个字');
				return;
			}
			$info.orgUrl = $("#inteAddress").val();
		}
		if($("#oprovince").text() != "请选择企业总部所在省或直辖市") {
			$info.province = $("#oprovince").text();
		}
		if($("#ocity").text() != "请选择企业总部所在城市") {
			$info.city = $("#ocity").text();
		}
		if($("#createTime").val()) {
			$info.foundTime = st6($("#createTime").val());
		}
		if($("#cmpAddress").val().trim()) {
			if($("#cmpAddress").val().trim().length > 50) {
				$.MsgBox.Alert('提示', '企业地址不得超过50个字');
				return;
			} else {
				$info.addr = $("#cmpAddress").val();
			}
		}
		if($("#phone").val().trim()) {
			if($("#phone").val().trim().length > 50) {
				$.MsgBox.Alert('提示', '办公电话不得超过50个字');
				return;
			} else {
				$info.contactNum = $("#phone").val().trim();
			}
		}
		if($("#mail").val().trim()) {
			if($("#mail").val().trim().indexOf("@")!=-1) {
				$info.email = $("#mail").val();
			} else {
				$.MsgBox.Alert('提示', '邮箱格式不正确');
				return;
			}
		}
		$info.descp = $("textarea").val();
		$info.industry = oString("#industryList");
		$info.subject = oString("#subjectList");
		$info.qualification = oString(".editUlistC");
		$info.fieldOfCustomer=oString(subjectListIn);
		$info.fieldOfSupplier=oString(subjectListOut);
		$.ajax({
			url: "/ajax/org/update",
			type: "POST",
			data: $info,
			timeout: 10000,
			dataType: "json",
			beforeSend: function() {},
			success: function(data, textState) {
				if(data.success) {
					$.MsgBox.Alert('提示', '修改成功');
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
					setTimeout(function() {
						history.go(-1);
					}, 200);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	})
	/*应用行业,学术领域,企业纸质生成字符串*/
	function oString(sele) {
		var len = $(sele).find("li");
		var arry = new Array();
		for(var i = 0; i < len.length; i++) {
			arry.push(len[i].innerText);
		}
		return arry.join(",");
	}
	/*时间转换成6位传给后台*/
	function st6(osr) {
		var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10);
		return tim;
	}
	/*企业图片上传*/
	var uploader = WebUploader.create({
		auto: true,
		fileNumLimit: 1,
		swf: '../js/webuploader/Uploader.swf',
		server: '../ajax/cachedFileUpload',
		fileSingleSizeLimit: 5 * 1024 * 1024,
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
		var $li = $('<div id="' + file.id + '" class="file-item thumbnail">' + '<img>' + '</div>')
		$img = $li.find('img');
		var $list = $('#fileList');
		/*//判断上传文件格式
		var fileNameAll = file.name;
		var AllImgExt = ".jpg|.jpeg|.png|";
		var extName = fileNameAll.substring(fileNameAll.lastIndexOf(".")).toLowerCase(); //（把路径中的所有字母全部转换为小写）
		if(AllImgExt.indexOf(extName + "|") == -1) {
			var ErrMsg = "该文件类型不允许上传。请上传 " + AllImgExt + " 类型的文件，当前文件类型为" + extName;
			$.MsgBox.Alert('提示', ErrMsg);
			return false;
		}*/

	});
	uploader.onError = function(code) {
		$.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过5M')
	};
	uploader.on('uploadSuccess', function(file, data) {
		uploader.removeFile(fileId);
		cacheImageKey = data.data[0].cacheKey;
		$("#oimg").attr("src", "/images/tmp/" + cacheImageKey);
	});
	/*取消*/
	$("#Ocancel").click(function() {
		history.go(-1)
	})
	/*选择省份*/
	$(document).on("click", "#Province li a", function() {
		var aVal = $(this).text();
		$(this).parent().parent().parent().find('.mr_show').text(aVal);
		$(this).parent().parent().parent().find('input[name=cho_Province]').val(aVal);

		if($("#oprovince").text() == "请选择企业总部所在省或直辖市") {
			$("#oprovince").removeClass("mr_select");
			$("#ocity").removeClass("mr_select");
		} else {
			$("#oprovince").addClass("mr_select");
			$("#ocity").removeClass("mr_select");
		}
	});
	/*选择城市填充js	*/
	$(document).on("click", "#City li a", function() {
		var aVal = $(this).text();
		$(this).parent().parent().parent().find('.mr_show').text(aVal);
		$(this).parent().parent().parent().find('input[name=cho_City]').val(aVal);
		if($("#ocity").text() == "请选择企业总部所在城市") {
			$("#ocity").removeClass("mr_select");
		} else {
			$("#ocity").addClass("mr_select");
		}
	});

})