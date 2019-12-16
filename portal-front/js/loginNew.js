$(function() {
	$(".loginWaySort").on("click", "li", function() {
		$(this).parents("#container").find("input").val("");
		$(this).parents("#container").find(".frmmsg span").text("");
		$(this).parents("#container").find("input").removeClass("frmmsg-warning");
		$(this).parents("#container").find(".loginSubmit").attr("disabled", true);
		$(this).addClass("liactive").siblings().removeClass("liactive");
		$(".loginWays ul").eq($(this).index()).removeClass("displayNone").siblings().addClass("displayNone");
	})
})
 if(GetQueryString("tel")==1) {
 	$(".loginWaySort li").eq(2).addClass("liactive").siblings().removeClass("liactive");
 	$(".loginWays ul").eq(2).removeClass("displayNone").siblings().addClass("displayNone");
 }
var namePass = false;
var passwordPass = false;
var codePass = false;
var verification = false;
var namePasstt = false;
/*校验登录按钮显示状态*/
function checkLoginButtn(_this) {
	var username = $(_this).parents(".cmpCoverUl").find(".username").val();
	var passwd = $(_this).parents(".cmpCoverUl").find(".passwd").val();
	if(username == "" || passwd == "") {
		$(_this).parents(".cmpCoverUl").find(".loginSubmit").attr("disabled", true);
	} else {
		$(_this).parents(".cmpCoverUl").find(".loginSubmit").attr("disabled", false);
	}
}

/*获取焦点*/
function getFocus(_this) {
	$(_this).next().find("span").text("");
	$(_this).removeClass("frmmsg-warning");
}

//校验登录手机和邮箱账户
function nameVal(_this) {
	var loginName = $(_this).val();
	var gunf = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
	if(loginName.length == "") {
		$(_this).next().find("span").text("请输入您的手机或邮箱");
		$(_this).addClass("frmmsg-warning");
	} else if(gunf.test(loginName.trim())) {
		userRegisterOk(_this);
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		namePass = true;
	} else if(hunPhone.test(loginName.trim())) {
		userRegisterOk(_this);
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		namePass = true;
	} else {
		$(_this).next().find("span").text("请输入正确的手机或邮箱");
		$(_this).addClass("frmmsg-warning");
	}
}

//校验登录手机账户
function phoneVal(_this,org) {
	var loginName = $(_this).val();
	var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
	if(loginName.length == "") {
		$(_this).next().find("span").text("请输入您的手机号码");
		$(_this).addClass("frmmsg-warning");
	} else if(hunPhone.test(loginName.trim())) {
		userRegisterOk(_this,org);
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		namePass = true;
	} else {
		$(_this).next().find("span").text("请输入正确的手机号码");
		$(_this).addClass("frmmsg-warning");
	}
}

//判断账号是否注册
function userRegisterOk(_this,org) {
	var loginName = $(_this).val();
	$.ajax("/ajax/isReg?key=" + loginName, {
		type: "GET",
		async: true,
		success: function($data) {
			if($data.data == true) {
				$(_this).next().find("span").text("该账号不存在，请检查后重试");
				$(_this).addClass("frmmsg-warning");
			} else {
				$(_this).next().find("span").text("");
				$(_this).removeClass("frmmsg-warning");
				if(org==1){
					doClick("#getcode");
					phoneVerificationCode("#getcode");
				}
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器请求失败')
		},
	});
}

//校验登录密码
function passwordVal(_this) {
	var passwd = $(_this).val();
	if(passwd.length == "") {
		$(_this).next().find("span").text("请输入您的登录密码");
		$(_this).addClass("frmmsg-warning");
	} else if(passwd.length < 6) {
		$(_this).next().find("span").text("密码由6-24个字符组成，区分大小写");
		$(_this).addClass("frmmsg-warning");
	} else {
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		passwordPass = true;
	}
}

//验证短信验证码
function codeVerification(_this) {
	var code = $(_this).val();
	var reg = /^\d{4}$/;
	if(code.length == "") {
		$(_this).next().find("span").text("请输入您收到的短信验证码");
		$(_this).addClass("frmmsg-warning");
	} else if(!reg.test(code)) {
		$(_this).next().find("span").text("验证码为4位数字");
		$(_this).addClass("frmmsg-warning");
	} else {
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		verification = true;
	}
}

//手机发送验证码
function phoneSend(_this) {
	phoneVal(".phoneuser",1)
}

function doClick(_this) {
	$(_this).attr("disabled", true);
	$(_this).text("60s后重新获取");
	var clickTime = new Date().getTime();
	var Timer = setInterval(function() {
		var nowTime = new Date().getTime();
		var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
		if(second > 0) {
			$(_this).text(second + "s后重新获取");
		} else {
			clearInterval(Timer);
			$(_this).text("获取验证码");
			$(_this).attr("disabled", false);
		}
	}, 1000);
}

//手机发送验证码结束
var state;

function phoneVerificationCode(_this) {
	var lp_phone = $(_this).parents(".cmpCoverUl").find(".username").val();
	$.ajax("/ajax/sendMobileForLogin", {
		type: "get",
		dataType: 'json',
		data: {
			"mobilePhone": lp_phone
		},
		async: true,
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.success) {
				state = data.data;
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器请求失败')
		}
	});
};

//验证邀请码
function codeVal(_this) {
	var code = $(_this).val();
	var reg = /^\d{6}$/;
	if(code.length == "") {
		$(_this).next().find("span").text("请输入您收到的邀请码");
		$(_this).addClass("frmmsg-warning");
	} else if(!reg.test(code)) {
		$(_this).next().find("span").text("邀请码为6位数字");
		$(_this).addClass("frmmsg-warning");
	} else {
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
		codePass = true;
	}
}

//判断用户第一次登录，是否填写了个人信息
function firstLogin() {
	var professorId = $.cookie('userid');
	$.ajax({
		"url": "ajax/professor/" + professorId,
		"type": "get",
		"async": false,
		"success": function(data) {
			console.log(data)
			if(data.success) {
				if(data.data.authentication || data.data.authentication===0){
					location.href = "index.html";	
				}else{
					location.href = "fillinfo-select.html?id=" + professorId;	
				}
			}	
		},
		"error": function() {
			$.MsgBox.Alert('消息', '服务器请求失败')
		}
	})
}

//密码登录
function passwdLogin(_this) {
	var loginName = $(_this).parents(".cmpCoverUl").find(".username");
	var passwordd = $(_this).parents(".cmpCoverUl").find(".passwd");
	if(namePass && passwordPass) {
		$.ajax("/ajax/login", {
			type: "POST",
			data: {
				"pw": passwordd.val(),
				"lk": loginName.val()
			},
			dataType: 'json',
			async: false,
			success: function(data) {
				if(data.success) {
					if(data.data != "null" && data.data != null) {
						firstLogin();
					} else {
						$(_this).parents(".cmpCoverUl").find(".msgLog2 span").text("账号与密码不匹配，请检查后重试");
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败');
			}
		});
	}
}

//手机验证码登录
function VerificationLogin(_this) {
	var loginName = $(_this).parents(".cmpCoverUl").find(".username");
	var code = $(_this).parents(".cmpCoverUl").find(".passwd");
	if(namePass && verification) {
		$.ajax("/ajax/mobileLogin", {
			type: "POST",
			dataType: 'json',
			data: {
				"state": state,
				"mobilePhone": loginName.val(),
				"validateCode": code.val()
			},
			async: false,
			success: function(data) {
				console.log(data)
				if(data.success) {
					if(data.data != "null" && data.data != null) {
						firstLogin();
					}
				} else {
					if(data.code == -1) {
						$(_this).parents(".cmpCoverUl").find(".msgCmp03 span").text("验证码已过期，请重新获取");
					} else if(data.code == -3 || data.code == 0) {
						$(_this).parents(".cmpCoverUl").find(".msgCmp03 span").text("验证码错误，请检查后重试");
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败');
			},
		});
	}
}

//邀请码登录
function InvitationLogin(_this) {
	var loginName = $(_this).parents(".cmpCoverUl").find(".username");
	var code = $(_this).parents(".cmpCoverUl").find(".passwd");
	if(namePass && codePass) {
		$.ajax("/ajax/invitelogin", {
			type: "POST",
			dataType: 'json',
			data: {
				"code": code.val(),
				"key": loginName.val()
			},
			async: false,
			success: function(data) {
				if(data.success) {
					if(data.data != "null" && data.data != null) {
						if(data.data.auth == true) {
							location.href = "index.html";
						} else {
							location.href = "loginInviteFirst.html";
						}
					} else {
						$(_this).parents(".cmpCoverUl").find(".msgLog2 span").text("邀请码错误，请检查后重试");
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败');
			},
		});
	}
}

//提交登录
function login(_this, num) {
	if(num == 1) {
		passwdLogin(_this);
	} else if(num == 2) {
		InvitationLogin(_this);
	} else if(num == 3) {
		VerificationLogin(_this);
	}
}
