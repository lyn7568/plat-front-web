//专家和实名认证
$(function() {
	loginStatus();//判断个人是否登录
	valUser();
	isexpert();
	var temp = [];
	var temp2 = [];

	/*专家认证提交上传*/
	$('.webupArea').on("click", ".expertSubmit", function() {
		var imglen = $("#fileList2 .thumbnail").length;
		if(imglen == 0) {
			$.MsgBox.Alert("消息提醒", "请上传能够证明您身份的相关证件，如工作证、在职证明、学生证、在读证明等");
		} else if(imglen > 5) {
			$.MsgBox.Alert("消息提醒", "最多上传5张照片。");
		} else {
			$.MsgBox.Confirm("消息提醒", "确认提交实名信息？一旦审核通过后，将不可更改。", function() {
				expertimg(temp2);
			});

		}
	})

	/*专家和实名认证提交上传*/
	$('.webupArea').on("click", ".realnameSubmit", function() {
		var imglen = $("#fileList2 .thumbnail").length;
		var imglen2 = $("#fileList .thumbnail").length;
		if(imglen2 == 0) {
			$.MsgBox.Alert("消息提醒", "请上传您身份证的正反面。");
		} else if(imglen2 > 3) {
			$.MsgBox.Alert("消息提醒", "最多上传3张照片。");
		} else if(imglen == 0) {
			$.MsgBox.Alert("消息提醒", "请上传能够证明您身份的相关证件，如工作证、在职证明、学生证、在读证明等");
		} else if(imglen > 5) {
			$.MsgBox.Alert("消息提醒", "最多上传5张照片。");
		} else {
			$.MsgBox.Confirm("消息提醒", "确认提交实名信息？一旦审核通过后，将不可更改。", function() {
				realnameimg(temp)
				expertimg(temp2);
			});

		}
	})

	expertuploader();
	realnameuploader();

	/*实名认证图片上传*/
	function realnameuploader() {
		/*图片上传*/
		var uploader = WebUploader.create({
			auto: true, // 选完文件后，是否自动上传。
			swf: 'webuploader/Uploader.swf', // swf文件路径
			server: '../ajax/cachedFileUpload',
			// 添加的文件数量
			//fileNumLimit: 3,
			pick: '#filePicker', // 选择文件的按钮。可选。
			duplicate: true, //允许图片重复上传
			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/*'
			}
		});

		// 当有文件添加进来的时候
		uploader.on('fileQueued', function(file) {
			var $li = $(
					'<div id="' + file.id + '" class="file-item thumbnail">' +
					'<img>' +
					//'<div class="info">' + file.name + '</div>' +
					'</div>'
				),
				$btns = $('<div class="file-panel">' +
					'<span class="cancel">删除</span>' +
					'</div>').appendTo($li),
				$img = $li.find('img');
			var $list = $("#fileList");
			$list.prepend($li);
			// 创建缩略图
			// 如果为非图片文件，可以不用调用此方法。
			// thumbnailWidth x thumbnailHeight 为 100 x 100
			uploader.makeThumb(file, function(error, src) {
				$img.attr('src', src);
			}, 1000, 1000);

			$li.on('mouseenter', function() {
				$btns.stop().animate({
					height: 30
				});
			});

			$li.on('mouseleave', function() {
				$btns.stop().animate({
					height: 0
				});
			});

		});

		/*图片上传成功*/
		uploader.on('uploadSuccess', function(file, data) {
			var cacheImageKey = data.data[0].cacheKey;
			temp.push(cacheImageKey);
		})

		/*删除图片*/
		$("#fileList").on("click", ".cancel", function() {
			$(this).parent().parent().remove();
		})
	}

	/*专家认证图片上传*/
	function expertuploader() {
		var uploader2 = WebUploader.create({
			auto: true, // 选完文件后，是否自动上传。
			swf: 'webuploader/Uploader.swf', // swf文件路径
			server: '../ajax/cachedFileUpload',
			// 添加的文件数量
			//fileNumLimit: 3,
			pick: '#filePicker2', // 选择文件的按钮。可选。
			duplicate: true, //允许图片重复上传
			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/*'
			}
		});

		// 当有文件添加进来的时候
		uploader2.on('fileQueued', function(file) {
			var $li = $(
					'<div id="' + file.id + '" class="file-item thumbnail">' +
					'<img>' +
					//'<div class="info">' + file.name + '</div>' +
					'</div>'
				),
				$btns = $('<div class="file-panel">' +
					'<span class="cancel">删除</span>' +
					'</div>').appendTo($li),
				$img = $li.find('img');
			var $list2 = $("#fileList2");
			$list2.prepend($li);
			// 创建缩略图
			// 如果为非图片文件，可以不用调用此方法。
			// thumbnailWidth x thumbnailHeight 为 100 x 100
			uploader2.makeThumb(file, function(error, src) {
				$img.attr('src', src);
			}, 1000, 1000);

			$li.on('mouseenter', function() {
				$btns.stop().animate({
					height: 30
				});
			});

			$li.on('mouseleave', function() {
				$btns.stop().animate({
					height: 0
				});
			});

		});

		/*图片上传成功*/
		uploader2.on('uploadSuccess', function(file, data) {
			var cacheImageKey = data.data[0].cacheKey;
			temp2.push(cacheImageKey);
		})

		/*删除图片*/
		$("#fileList2").on("click", ".cancel", function() {
			$(this).parent().parent().remove();
		})
	}

})

/*专家认证*/
function isexpert() {
	$.ajax("/ajax/professor/auth", {
		data: {
			"id": $.cookie("userid")
		},
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000, //超时设置
		async: false,
		success: function(data) {
			//console.log(JSON.stringify(data));
			var $info = data.data || {};
			if(data.success && data.data) {
				authStatusExpert = $info.authStatusExpert;
				authStatus = $info.authStatus;
				//console.log(authStatusExpert)
				if(authStatusExpert == -1) {
					$("#identProcess").text("很遗憾，您没有通过认证。");
					$("#identts").text("请更换符合要求的认证材料再试试。");
					$("#identBtn").show().text("重新认证");
				} else if(authStatusExpert == 0) {
					$("#identProcess").text("成为科袖认证专家用户，与企业开展合作，将您的科研价值变现！");
					$("#identProcess").css({
						"width": "300px"
					});
					$("#identBtn").show().text("开始认证");
				} else if(authStatusExpert == 1) {
					$("#identProcess").text("认证信息提交成功！");
					$("#identts").text("我们将尽快对您的信息进行认证，通过后您将成为科袖认证专家，获得特殊功能权限！");
				} else if(authStatusExpert == 2) {
					$("#identProcess").text("我们正在对您的材料进行认证，请稍等片刻。");
					$("#identProcess").css({
						"width": "280px"
					});
				} else if(authStatusExpert == 3) {
					$("#identProcess").text("恭喜您已成为科袖认证专家！");
					$("#identts").text("在【我的工作台】可以查看发布中的需求，与企业展开合作，将科研价值变现。");
					$("#identBtn").show().text("进入[我的工作台]");
					$("#identBtn").on("click", function() {
						window.location.href = "myConsult.html";
					})
				}
				if(authStatus == 3) {
					if(authStatusExpert == -1 || authStatusExpert == 0) {
						$("#identBtn").on("click", function() {
							$(".IdentityState,.realname").hide();
							$(".IdentityUp").show();
							$(".subUp").addClass("expertSubmit");
						})
					}
				} else if(authStatus == -1 || authStatus == 0) {
					if(authStatusExpert == -1 || authStatusExpert == 0) {
						$("#identBtn").on("click", function() {
							$(".IdentityState").hide();
							$(".IdentityUp").show();
							$(".subUp").addClass("realnameSubmit");
						})
					}
				} else if(authStatus == 1 || authStatus == 2) {
					$("#identBtn").hide();
					$("#identProcess").text("我们正在对您的材料进行认证，请稍等片刻。");
					$("#identProcess").css({
						"width": "280px"
					});
				}
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器链接超时');
			return;
		}
	});
}

/*提交专家认证图片*/
function expertimg(temp) {
	$.ajax("/ajax/authApply/expert", {
		data: {
			"professorId": $.cookie("userid"),
			"fns": temp
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		async: false,
		timeout: 10000, //超时设置
		traditional: true, //传数组必须加这个
		success: function(data) {
			//console.log(JSON.stringify(data));
			if(data.success) {
				$(".IdentityUp").hide();
				$(".IdentityState").show();
				location.reload(true);
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器链接超时');
		}
	});
}

/*提交实名认证图片*/
function realnameimg(temp2) {
	$.ajax("/ajax/authApply/realName", {
		data: {
			"professorId": $.cookie("userid"),
			"fns": temp2
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		async: false,
		timeout: 10000, //超时设置
		traditional: true, //传数组必须加这个
		success: function(data) {
			//console.log(JSON.stringify(data));
			if(data.success) {
				$(".IdentityUp").hide();
				$(".IdentityState").show();
				location.reload(true);
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器链接超时');
		}
	});
}