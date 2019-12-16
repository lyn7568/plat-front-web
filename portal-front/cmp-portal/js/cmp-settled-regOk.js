//企业注册激活成功
$(function() {
	var sc = GetQueryString("sc");
	activationFun();

	function activationFun() {
		$.ajax("/ajax/regOrgMail/" + sc, {
			type: "GET",
			dataType: 'json',
			async: false,
			success: function($data) {
				console.log($data)
				if($data.success) {
					$(".tit-hh4").find("span").text("注册成功");
					$(".importTip").text("您的企业账户已注册成功！");
					$("#successImg").removeClass("failImg").addClass("successImg");
					$("#butGo").text("登录企业账户");
					$("#butGo").on("click", function() {
						location.href = "cmp-settled-log.html";
					})
				} else {
					$(".tit-hh4").find("span").text("注册失败");
					$("#successImg").removeClass("successImg").addClass("failImg");
					if($data.code == -1) {
						$(".importTip").text("很抱歉，当前的链接已失效");
						$("#smalltip").text("小提醒：邮件内的链接有效时长为10分钟。");
						$("#butGo").text("重新注册");
						$("#butGo").on("click", function() {
							location.href = "cmp-settled-reg.html";
						})
					} else if($data.code == -3) {
						$(".importTip").text("当前邮箱已注册企业账户");
						$("#smalltip").text("请更换一个邮箱重新注册");
						$("#butGo").text("重新注册");
						$("#butGo").on("click", function() {
							location.href = "cmp-settled-reg.html";
						})
					} else if($data.code == 2) {
						$(".importTip").text("您输入的企业已注册企业账户");
						$("#smalltip").text("您可以点击下方按钮找回企业账户，或直接联系客服 010-62343359");
						$("#butGo").text("找回企业账户");
						$("#butGo").on("click", function() {
							location.href = "cmp-settled-reback.html";
						})
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', '服务器请求失败')
			},
		});
	}
})