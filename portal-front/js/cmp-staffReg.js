//接受企业邀请，注册「科袖」
$(function() {
	loginStatus();//判断个人是否登录
	var sc = GetQueryString("sc");
	var companyNameVal, companyPhoneVal, companyscVal, companyPswVal1, companyPswVal2;
	var setname = false;
	var phonePass = false;
	var phoneCode = false;
	var setnewpwd = false;
	var setnewpwd2 = false;
	var ifxuanze = true;

	initialVal()
		/*校验注册按钮显示状态*/
	$('#cmpSettledul').on('keyup', "#companyName,#companyPhone,#companysc,#companyPsw1,#companyPsw2", function() {
		if($("#companyName").val() == "" || $("#companyPhone").val() == "" || $("#companysc").val() == "" || $("#companyPsw1").val() == "" || $("#companyPsw2").val() == "") {
			$("#companyRet").attr("disabled", true);
		} else {
			$("#companyRet").attr("disabled", false);
		}
	});

	/*校验邀请人名称*/
	$('#companyName').on('focus', function() {
		$(".msgCmp01 span").text("");
	});
	$('#companyName').on('blur', function() {
		checkName();
	});

	/*校验邀请人手机*/
	$('#companyPhone').on('focus', function() {
		$(".msgCmp02").text("");
	});
	$('#companyPhone').on('keyup', function() {
		checkPhone();
	});
	$('#companyPhone').on('blur', function() {
		if($(".msgCmp02").text()!=""){
			$(".msgCmp02").prev().addClass("frmmsg-warning");
		}else{
			$(".msgCmp02").prev().removeClass("frmmsg-warning");
		}
	});
	/*校验邀请验证码*/
	$('#companysc').on('focus', function() {
		$(".msgCmp03").text("");
	});
	$('#companysc').on('blur', function() {
		checkSc();
	});

	/*校验新密码*/
	$('#companyPsw1').on('focus', function() {
		$(".msgCmp04 span").text("");
	});
	$('#companyPsw1').on('blur', function() {
		checkNewPwd();
	});

	/*校验新密码*/
	$('#companyPsw2').on('focus', function() {
		$(".msgCmp05 span").text("");
	});
	$('#companyPsw2').on('blur', function() {
		checkNewPwd2();
	});

	/*校验单选框*/
	$(".cmpAgree").on("click", function() {
		if($(this).hasClass("ifxuanze")) {
			$(this).removeClass("ifxuanze");
			$(this).attr("src", "images/c-sign-on_button_xuanze_nor.png")
			ifxuanze = false;
		} else {
			$(this).addClass("ifxuanze");
			$(this).attr("src", "images/c-sign-on_button_xuanze_hig.png");
			ifxuanze = true;
		}
	})

	/*提交校验*/
	$('#companyRet').on('click', function() {
		if(ifxuanze) {
			valEmail();
		} else {
			$.MsgBox.Alert('提示', '请确认后勾选此选项')
		}
	});

	function initialVal() {
		$.ajax("/ajax/inviteStaff/" + sc, {
			type: "POST",
			success: function($data) {
				//console.log($data)
				if($data.success) {
					$(".cmpOrgName").text($data.data.orgName);
					$(".companyEmail").val($data.data.email);
				} else {
					$.MsgBox.Alert('消息', '验证链接已失效')
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败')
			},
		});
	}

	function valEmail() {
		$.ajax("/ajax/isReg?key=" + $(".companyEmail").val(), {
			type: "GET",
			async: true,
			success: function($data) {
				if($data.data == false) {
					$.MsgBox.Alert('消息', '您的邮箱已被注册,请直接登录')
				} else {
					tijiaoFun();
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败')
			},
		});

	}

	function checkName() {
		companyNameVal = $("#companyName").val();
		if(companyNameVal.length == "") {
			$(".msgCmp01").prev().addClass("frmmsg-warning");
			$(".msgCmp01 span").text("请输入您的真实姓名");
		} else {
			$(".msgCmp01").prev().removeClass("frmmsg-warning");
			$(".msgCmp01 span").text("");
			setname = true;
		}
	}

	function checkPhone() {
		companyPhoneVal = $("#companyPhone").val();
		$.ajax("/ajax/isReg?key=" + companyPhoneVal, {
			type: "GET",
			async: true,
			success: function($data) {
				if(companyPhoneVal.length == 0) {
					$(".msgCmp02").text("请输入您的手机号码");
					$("#getcode").attr("disabled", true);
				} else {
					var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
					if(hunPhone.test(companyPhoneVal.trim())) {
						if($data.data == false) {
							$(".msgCmp02").text("该手机已注册账户，您可以直接登录");
						} else {
							$(".msgCmp02").prev().removeClass("frmmsg-warning");
							$(".msgCmp02").text("");
							phonePass = true;
							$("#getcode").attr("disabled", false);
							addEvent(btn, "click", handler); //手机必须验证正确，才执行
						}
					} else {
						phonePass = false;
						$(".msgCmp02").text("请输入正确的手机号码");
						$("#getcode").attr("disabled", true);
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败')
			},
		});
	}

	function checkSc() {
		companyscVal = $("#companysc").val();
		if(companyscVal.length == 0) {
			$(".msgCmp03").prev().addClass("frmmsg-warning");
			$(".msgCmp03").text("请输入您收到的验证码");
			phoneCode = false;
		} else {
			var d = /^[0-9a-zA-Z]{4}$/;
			if(d.test(companyscVal.trim())) {
				$(".msgCmp03").prev().removeClass("frmmsg-warning");
				$(".msgCmp03").text("");
				phoneCode = true;
			} else {
				$(".msgCmp03").prev().addClass("frmmsg-warning");
				$(".msgCmp03").text("验证码为4位数字，请检查后重试");
				phoneCode = false;
			}
		}
	}

	//手机发送验证码
	var btn = document.getElementById("getcode");
	var handler = function() {
		doClick();
		phoneVerificationCode(); //调用发送手机验证码接口
		removeEvent(btn, 'click', handler); //取消绑定该事件
	}

	function addEvent(obj, type, handler) {
		if(obj.addEventListener) {
			obj.addEventListener(type, handler, false);
		} else if(obj.attachEvent) {
			obj.attachEvent('on' + type, handler);
		}
	}

	function removeEvent(obj, type, handler) {
		if(obj.removeEventListener) {
			obj.removeEventListener(type, handler, false);
		} else if(obj.detachEvent) {
			obj.detachEvent("on" + type, handler);
		}
	}

	function doClick() {
		removeClass(btn, 'getcodeon');
		addClass(btn, 'getcodeoff');
		btn.innerHTML = "60s后重新获取";
		var clickTime = new Date().getTime();
		var Timer = setInterval(function() {
			var nowTime = new Date().getTime();
			var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
			if(second > 0) {
				btn.innerHTML = second + "s后重新获取";
			} else {
				clearInterval(Timer);
				removeClass(btn, 'getcodeoff');
				addClass(btn, 'getcodeon');
				btn.innerHTML = "免费获取验证码";
				addEvent(btn, "click", handler);
			}
		}, 1000);
	}

	function hasClass(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}

	function addClass(obj, cls) {
		if(!hasClass(obj, cls)) obj.className += " " + cls;
	}

	function removeClass(obj, cls) {
		if(hasClass(obj, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, ' ');
		}
	}

	//手机发送验证码结束
	var state;

	function phoneVerificationCode() {
		if(phonePass) {
			$.ajax("/ajax/regmobilephone_onlyphone", {
				type: "get",
				async: true,
				success: function(data) {
					if(data.success) {
						state = data.data;
					}
				},
				error: function() {
					$.MsgBox.Alert('消息', '服务器请求失败');
				},
				data: {
					"mobilePhone": $("#companyPhone").val()
				},
				dataType: 'json'
			});
		}
	};

	function checkNewPwd() {
		companyPswVal1 = $("#companyPsw1").val();
		if(companyPswVal1.length < 6) {
			$(".msgCmp04").prev().addClass("frmmsg-warning");
			$(".msgCmp04 span").text("密码由6-24个字符组成，区分大小写");
		} else {
			$(".msgCmp04").prev().removeClass("frmmsg-warning");
			$(".msgCmp04 span").text("");
			setnewpwd = true;
		}
	}

	function checkNewPwd2() {
		companyPswVal2 = $("#companyPsw2").val();
		if(companyPswVal2.length < 6) {
			$(".msgCmp05").prev().addClass("frmmsg-warning");
			$(".msgCmp05 span").text("密码由6-24个字符组成，区分大小写");
		} else if(companyPswVal1 != companyPswVal2) {
			$(".msgCmp05").prev().addClass("frmmsg-warning");
			$(".msgCmp05 span").text("两次输入不一致，请重新输入");
		} else {
			$(".msgCmp05").prev().removeClass("frmmsg-warning");
			$(".msgCmp05 span").text("");
			setnewpwd2 = true;
		}
	}

	function tijiaoFun() {
		if(setname && phonePass && phoneCode && setnewpwd && setnewpwd2) {
			$.ajax("/ajax/regInviteStaff", {
				data: {
					"key": sc,
					"state": state,
					"phone": companyPhoneVal,
					"validateCode": companyscVal,
					"name": companyNameVal,
					"passwd": companyPswVal2
				},
				type: "POST",
				dataType: 'json',
				async: true,
				success: function(data) {
					if(data.success) {
						location.href = "index.html";
					}
				},
				error: function() {
					$.MsgBox.Alert('消息', '服务器请求失败');
				}
			});
		}
	};

})