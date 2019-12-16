$(function() {
	loginStatus(); //判断个人是否登录
	$("#gophone").on("click",function(){
		location.href = "pwdFindNew.html?slef=1";
	})
})

var passwordPass = false;
var passwordPass2 = false;

/*校验密码找回按钮显示状态*/
function checkLoginButtn(_this) {
	var newPassword = $(_this).parents(".cmpCoverUl").find("#newPassword").val();
	var newPasswordok = $(_this).parents(".cmpCoverUl").find("#newPasswordok").val();
	if(newPassword == "" || newPasswordok == "") {
		$(_this).parents(".cmpCoverUl").find("#paswSubmit").attr("disabled", true);
	} else {
		$(_this).parents(".cmpCoverUl").find("#paswSubmit").attr("disabled", false);
	}
}

/*获取焦点*/
function getFocus(_this) {
	$(_this).next().find("span").text("");
	$(_this).removeClass("frmmsg-warning");
}

//校验登录密码
function passwordVal(_this) {
	var passwd = $(_this).val();
	var passwd2 = $("#newPassword").val();
	if(passwd.length == "") {
		$(_this).next().find("span").text("请设置您的登录密码");
		$(_this).addClass("frmmsg-warning");
	} else if(passwd.length < 6) {
		$(_this).next().find("span").text("密码由6-24个字符组成，区分大小写");
		$(_this).addClass("frmmsg-warning");
	} else if(passwd != passwd2) {
		$(_this).next().find("span").text("两次输入不一致，请重新输入");
		$(_this).addClass("frmmsg-warning");
	} else {
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		passwordPass = true;
	}
}

function resetPassword(_this) {
	console.log(passwordPass)
	if(passwordPass ==false) {
		return;
	}
	var mailCode = GetQueryString('sc');
	var oldPassword = $("#newPasswordok").val();
	if(passwordPass) {
		$.ajax("/ajax/resetPasswordWith", {
			type: "post",
			success: function(data) {
				console.log(data);
				if(data.success) {
					if(data.data == true) {
						location.href = "pwdResult.html?num=1";
					} else {
						$(_this).next().find("span").text("重置密码失败");
					}
				} else {
					location.href = "pwdResult.html?num=0";
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器链接失败');
			},
			data: {
				"state": mailCode,
				"pw": oldPassword
			},
			dataType: 'json'
		});
	}
}