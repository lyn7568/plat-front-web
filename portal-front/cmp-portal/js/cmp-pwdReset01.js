//重置企业账户密码
$(function() {
	var companyEmailVal;
	var setemail = false;

	/*校验按钮显示状态*/
	$('.companyEmail').on('keyup', function() {
		if($(this).val() == "") {
			$("#nxetseep").attr("disabled", true);
		} else {
			$("#nxetseep").attr("disabled", false);
		}
	});

	/*校验企业邮箱*/
	$('.companyEmail').on('focus', function() {
		$(".msgLog1 span").text("");
	});
	$('.companyEmail').on('blur', function() {
		checkEmail();
	});

	/*重置密码提交*/
	$('#nxetseep').on('click', function() {
		mailRegistration();
	});

	function checkEmail() {
		companyEmailVal = $(".companyEmail").val();
		var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(gunf.test(companyEmailVal.trim())) {
			$.ajax("/ajax/isRegOrg", {
				data:{"email":companyEmailVal},
				type: "GET",
				dataType: 'json',
				async: false,
				success: function($data) {
					if($data.data == true) {
						$(".msgLog1").prev().addClass("frmmsg-warning");
						$(".msgLog1 span").text("该企业账号不存在，请检查后重试");
					} else {
						$(".msgLog1").prev().removeClass("frmmsg-warning");
						$(".msgLog1 span").text("");
						setemail = true;
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败')
				},
			});
		} else {
			$(".msgLog1").prev().addClass("frmmsg-warning");
			$(".msgLog1 span").text("请输入正确是邮箱地址");
		}
	}

	function mailRegistration() {
		if(setemail) {
			$.ajax("/ajax/resetWithOrgEmail", {
				data: {
					"mail": companyEmailVal,
				},
				type: "GET",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.success) {
						if($data.data){
							location.href = "cmp-pwdReset02.html?companyEmailVal=" + companyEmailVal;
						}else{
							$.MsgBox.Alert('提示', '邮箱验证发送失败');
						}
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败');
				}
			});
		} else {
			checkEmail();
		}
	}

})