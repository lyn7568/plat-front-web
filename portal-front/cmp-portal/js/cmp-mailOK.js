//账号绑定成功
$(function() {
	var sc = GetQueryString("sc");
	var emaild = GetQueryString("emaild");
	activationFun();

	function activationFun() {
		$.ajax("/ajax/bindOrgMail/" + sc, {
			type: "GET",
			dataType: 'json',
			async: false,
			success: function($data) {
				console.log($data)
				if($data.success){
					$("#importTip").text("恭喜您，您的企业邮箱绑定成功！");
					$("#successImg").removeClass("failImg").addClass("successImg");
					$("#alignCenter").text("您可以使用该邮箱登录您的企业账户了。");
					var emaild = $data.data;
					$.cookie('orgEmail', emaild, {path: "/"});
				}else if($data.code == -1){
					$("#importTip").text("很抱歉，当前的链接已失效");
					$("#successImg").addClass("failImg").removeClass("successImg");
					$("#alignCenter").text("小提醒：邮件内的链接有效时长为10分钟。");
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', '服务器请求失败')
			},
		});
	}
})