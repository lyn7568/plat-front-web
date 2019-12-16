//企业登录
$(function() {

	var companyNameVal, companyEmailVal;
	var setpass = false;
	var setemail = false;

	/*校验登录按钮显示状态*/
	$('#cmpCoverUl').on('keyup', ".companyEmail,#companyPasw", function() {
		if($(".companyEmail").val() == "" || $("#companyPasw").val() == "") {
			$("#loginSubmit").attr("disabled", true);
		} else {
			$("#loginSubmit").attr("disabled", false);
		}
	});

	/*校验企业邮箱*/
	$('.companyEmail').on('focus', function() {
		$(".msgLog1 span").text("");
	});
	$('.companyEmail').on('blur', function() {
		checkEmail();
	});

	/*校验登录密码*/
	$('#companyPasw').on('focus', function() {
		$(".msgLog2 span").text("");
	});
	$('#companyPasw').on('blur', function() {
		checkPasw();
	});

	/*注册提交*/
	$('#loginSubmit').on('click', function() {
		mailRegistration();
	});

	function checkEmail() {
		companyEmailVal = $(".companyEmail").val();
		//var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		var gunf = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if(gunf.test(companyEmailVal.trim())) {
			$.ajax("/ajax/isRegOrg", {
				data:{"email":companyEmailVal},
				type: "GET",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data);
					if($data.success && $data.data) {
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
			$(".msgLog1 span").text("请输入正确的邮箱地址");
		}
	}

	function checkPasw() {
		companyPaswVal = $("#companyPasw").val();
		if(companyPaswVal.length < 6) {
			$(".msgLog2").prev().addClass("frmmsg-warning");
			$(".msgLog2 span").text("密码由6-24个字符组成，区分大小写");
		} else {
			$(".msgLog2").prev().removeClass("frmmsg-warning");
			$(".msgLog2 span").text("");
			setpass = true;
		}
	}

	function mailRegistration() {
		if(setpass && setemail) {
			$.ajax("/ajax/orgLogin", {
				data: {
					"lk": companyEmailVal,
					"pw": companyPaswVal
				},
				type: "POST",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.success && $data.data!==null) {
						$(".msgLog2").prev().removeClass("frmmsg-warning");
						location.href = "cmpInformation.html";
					} else if($data.success && $data.data == null){
						$(".msgLog2").prev().addClass("frmmsg-warning");
						$(".msgLog2 span").text("登录账号与密码不匹配");
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败');
				}
			});
		} else {
			checkEmail();
			checkPasw();
		}
	}
})