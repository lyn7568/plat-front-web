//账号绑定
$(function() {
	loginStatus();//判断个人是否登录
	valUser();
	//邮箱绑定，手机绑定，点击关闭隐藏这两个部分
	$(".times").click(function() {
		$(".cover,.coverset,.cover2").hide();
	});
	//邮箱绑定，手机绑定，点击返回，隐藏这两个部分
	$(".back-btn").click(function() {
		$(".cover").hide();
		$(".cover2").hide();
	});
	//这个标签已经隐藏了，点击手机账号绑定
	$(".replace2").click(function() {
		$(".cover2").show();
	});
	//这个标签已经隐藏了，点击邮箱账号绑定
	$(".replace1").click(function() {
		$(".cover").show();
	});
	//点击邮箱账号绑定
	$(".replace5").click(function() {
			$(".cover").show();
		})
		//点击手机账号绑定
	$(".replace6").click(function() {
		$(".cover2").show();
	});
	//判断是否绑定了邮箱
	var emailCookie = $.cookie("userEmail");
	var phoneCookie = $.cookie("userMobilePhone");
	if(emailCookie != "" && emailCookie != null && emailCookie != "null") {
		//alert(emailCookieshow);
		emailhome(emailCookie);
		$("#emailShow").text(emailCookieshow);
		$(".replace1").hide();
		$(".replace3").show();
	} else {
		$(".replace1").show();
		$(".replace3").hide();
	}
	//判断是否绑定了手机号
	if(phoneCookie != "" && phoneCookie != null && phoneCookie != "null") {
		$("#phoneShow").text(phoneCookie.substring(0, 3) + "****" + phoneCookie.substring(7, 11));
		$(".replace2").hide();
		$(".replace4").show();
	} else {
		$(".replace2").show();
		$(".replace4").hide();
	}

})

function emailhome(emailset) {
		//var emailCookieshow;
		var emailq = emailset.replace(/@.*/, "");
		var emailh = emailset.replace(emailq, "");
		if(emailq.length >= 6) {
			emailCookieshow = emailq.substring(emailq.length - 4, 0) + "****" + emailh;
		}
		if(emailq.length == 5) {
			emailCookieshow = emailq.substring(emailq.length - 3, 0) + "***" + emailh;
		}
		if(emailq.length == 4) {
			emailCookieshow = emailq.substring(emailq.length - 2, 0) + "**" + emailh;
		}
		if(emailq.length == 3) {
			emailCookieshow = emailq.substring(emailq.length - 1, 0) + "*" + emailh;
		}
		if(emailq.length < 3) {
			emailCookieshow = emailq + emailh;
		}
		return emailCookieshow;
	}

//重新绑定邮箱
var emailPass = false;
var emailOk = false;
//页面需要验证展示的位置，先用alert替代
function valEmail() {
	var email = $("#email").val();
	//var gunf=/^\w+@\w+\.((cn)|(com)|(com\.cn))$/;
	var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(gunf.test(email.trim())) {
		userRegisterOk();
		emailPass = true;
		emailSuccess();
	} else {
		/*alert("请输入正确是邮箱地址");*/
		$(".msg11 span").text("请输入正确的邮箱地址。");
		emailPass = false;
	}
}
//获取邮箱，填写地址
function emailSuccess() {
	var mailVal = $('#email').val();
	$(".sett").each(function() {
		var url = mailVal.split('@')[1];
		for(var j in hash) {
			if(hash[url]==undefined){
        		$(this).attr("href", "http://mail." + url);
        	}else{
        	 	$(this).attr("href", hash[url]);
        	}
		}
	});
}

//判断邮箱是否绑定
function userRegisterOk() {
	var email = $("#email").val();
	//console.log(email);
	$.ajax("/ajax/isReg?key=" + email, {
		type: "GET",
		async: false,
		success: function($data) {
			//console.log($data);
			if($data.data == true) {
				$(".msg11").text("");
				emailOk = true;
			} else {
				$(".msg11").text("该邮箱已绑定账号，请使用其他邮箱地址。");
				emailOk = false;
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器请求失败')
		},
	});
}

var mailCode = GetQueryString('sc');
//获取邮箱验证码传值注册
if(mailCode != '') {
	$(".account-set a").eq(1).addClass("bgcolor").siblings().removeClass("bgcolor");
	$(".contentbox .content-set").eq(1).show().siblings().hide();
	$.ajax("/ajax/bindMail/" + mailCode, {
		type: "get",
		async: true,
		success: function(data) {
			userpe();
		},
		error: function() {
			$.MsgBox.Alert('消息提醒', '邮箱绑定失败')
		},
		data: {},
		dataType: 'json'
	});
}

//查询用户手机号和邮箱
function userpe() {
	$.ajax("/ajax/qaUser", {
		type: "get",
		async: true,
		success: function(data) {
			//console.log(data)
			$.MsgBox.Alert('消息提醒', '邮箱绑定成功')
			$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
			var emaild = data.data.email;
			emailhome(emaild);
			$.cookie('userEmail', emaild, {
				path: "/"
			});
			$("#emailShow").text(emailCookieshow);
		},
		error: function() {
			$.MsgBox.Alert('消息提醒', '邮箱绑定失败')
		},
		data: {
			"id": $.cookie("userid")
		},
		dataType: 'json'
	});
}

//点击邮箱激活
function bindEmail() {
	valEmail();
	var email = $("#email").val();
	if(emailPass == true && emailOk == true) {
		$.ajax("/ajax/reqBindMail", {
			type: "GET",
			async: false,
			success: function(data) {
				//console.log(data);
				if(data.success) {
					//console.log(data);
					if(data.data == true) {
						//$.cookie('userEmail',email); 
						$(".cover").hide();
						$("#vovernext").show();
						$(".emalvel").text(email);
					} else {
						$.MsgBox.Alert("消息提醒", "邮箱发布失败!");
					}
				} else {
					$.MsgBox.Alert("消息提醒", "服务器链接超时!");
				}
			},
			error: function() {
				$.MsgBox.Alert('message', 'fail')
			},
			data: {
				"userid": $.cookie("userid"),
				"mail": $("#email").val()
			},
			dataType: 'json'
		});
	} else {
		/*alert("请输入正确是邮箱地址");*/
	}
}

$("#bindgo").on("click", function() {
	var mailVal = $('.sett').attr("href");
	location.href = mailVal;
})

//判断手机是否绑定
function phoneRegisterOk() {
	var phoneVal = $("#phone").val();
	$.ajax("/ajax/isReg?key=" + phoneVal, {
		type: "GET",
		async: false,
		success: function($data) {
			//console.log($data);
			if($data.data == true) {
				$(".msg12").text("");
				phonePass = true;
			} else {
				$(".msg12").text("该手机已绑定账号，请使用其他手机号码。");
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器请求失败')
		},
	});
}

//验证手机号是否合法
var phonePass = false;

function valPhone() {
	var phoneVal = $("#phone").val();
	var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
	if(hunPhone.test(phoneVal.trim())) {
		phoneRegisterOk();
	} else {
		phonePass = false;
		/*alert("手机格式正确,请输入正确的手机号码");*/
		$(".msg12").text("请输入正确的手机号码");
	}
}
//验证手机验证码
var codePass = false;

function valCode() {
	var phoneCode = $("#phoneCode").val();
	if(phoneCode.length == 0) {
		/*alert("请输入验证码");*/
		$(".msg13").text("请输入验证码");
	} else {
		if(!isNaN(phoneCode)) {
			codePass = true;
		} else {
			codePass = false;
			$(".msg13").text("请填写数字");
			/*alert("请填写数字");*/
		}
	}

}
//发送手机验证码
var phoneState;

function sendPhoneCode() {
	valPhone();
	if(phonePass == true) {
		$.ajax("/ajax/vcWithBind", {
			type: "GET",
			async: false,
			success: function(data) {
				//console.log(data);
				if(data.success) {
					if(data.data == null) {
						$(".msg13").text("验证码发送失败,请确认手机号码正确!");
						/*alert("验证码发送失败,请确认手机号码正确!");*/
					} else {
						phoneState = data.data;
						$(".msg13").text("发送成功,请检查验证码");
					}
				} else {
					$.MsgBox.Alert("消息提醒", "系统异常!");
					// alert("系统异常!");
				}
			},
			error: function() {
				$.MsgBox.Alert('message', 'fail')
			},
			data: {
				"userid": $.cookie("userid"),
				"mobilePhone": $("#phone").val()
			},
			dataType: 'json'
		});
	} else {
		/*alert("请输入正确是手机号码");*/
	}
}
//绑定手机号
function bindPhone() {
	valCode();
	if(codePass == true) {
		/*alert($.cookie("userid"));
		alert($("#phone").val());
		alert(phoneState);
		alert($("#phoneCode").val());*/
		var phoneVal = $("#phone").val();
		$.ajax("/ajax/bindMobilePhone", { 
			type: "POST",
			async: false,
			success: function(data) {
				if(data.success) {
					/*alert(2);*/
					if(data.data == true) {
						$.cookie('userMobilePhone', phoneVal, {
							path: "/"
						});
						$(".cover2").hide();
						$.MsgBox.Alert("消息提醒", "手机绑定成功!");
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
						location.reload(true);
					} else {
						$.MsgBox.Alert("消息提醒", "短信验证不正确，请检查后重新输入。");
					}
				} else {
					$.MsgBox.Alert("消息提醒", "系统异常!");
					// alert("系统异常!");
				}
			},
			error: function() {
				$.MsgBox.Alert('message', 'fail')
			},
			data: {
				"userid": $.cookie("userid"),
				"mobilePhone": $("#phone").val(),
				"validateCode": $("#phoneCode").val(),
				"state": phoneState
			},
			dataType: 'json'
		});
	} else {
		/*alert("请输入验证码是否正确");*/
	}
}