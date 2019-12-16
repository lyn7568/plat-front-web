//修改密码
$(function(){
	loginStatus();//判断个人是否登录
	valUser();
	var oldPass = false;
	var isPass = false;
	var isPass2 = false;
})
/*校验当前密码*/
function valOld() {
	var oldPassword = $("#oldPassword").val();
	if(oldPassword.length == 0) {
		$(".msg1").text("请输入密码");
		oldPass = false;
	} else if(oldPassword.length < 6) {
		$(".msg1").text("密码不少于6位，请输入正确的密码");
	} else {
		$(".msg1").text("");
		oldPass = true;
	}
}

/*校验新密码*/
function valNew() {
	var newPassword = $("#newPassword").val();
	var oldPassword = $("#oldPassword").val();
	if(newPassword.length == 0) {
		$(".msg2").text("密码不能为空");
	} else if(newPassword.length < 6) {
		$(".msg2").text("密码长度过短,至少六位");
	} else if(newPassword2 == newPassword) {
		$(".msg2").text("新旧密码不能一致");
	} else {
		isPass = true;
		$(".msg2").text("");
	}
}

/*校验确认密码*/
function valNew2() {
	var newPassword = $("#newPassword").val();
	var newPassword2 = $("#newPassword2").val();
	if(newPassword2.length == 0) {
		$(".msg3").text("密码不能为空");
	} else if(newPassword2 != newPassword) {
		$(".msg3").text("两次输入密码不一致");
	} else {
		isPass2 = true;
		$(".msg3").text("");
	}
}

/*提交修改密码*/
function restPassword() {
	valOld();
	valNew();
	valNew2();
	if(oldPass == true && isPass == true && isPass2 == true) {
		$.ajax("/ajax/cp", {
			type: "POST",
			async: false,
			success: function(data) {
				if(data.success) {
					if(data.data == true) {
						$.MsgBox.Confirm("消息提醒", "设置成功,请重新登录",function(){
							location.href="login.html";
						});
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
					} else {
						$.MsgBox.Alert("消息提醒", "设置失败,请检查密码是否正确!");
					}
				} else {
					$.MsgBox.Alert("消息提醒", "服务器链接超时!");
				}
			},
			error: function() {
				$.MsgBox.Alert('message', 'fail')
			},
			data: {
				"id": $.cookie("userid"),
				"npw": $("#newPassword2").val(),
				"onw": $("#oldPassword").val()
			},
			dataType: 'json'
		});
	} else {
		/*alert("请校验密码");*/
	}
}