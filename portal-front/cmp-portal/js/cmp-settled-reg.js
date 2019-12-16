//企业注册
$(function() {

	var companyNameVal, companyEmailVal, companyPaswVal;
	var setname = false;
	var setpass = false;
	var setemail = false;
	var ifxuanze = true;

	/*校验注册按钮显示状态*/
	$('#cmpSettledul').on('keyup', "#companyName,.companyEmail,#companyPasw", function() {
		if($("#companyName").val() == "" || $(".companyEmail").val() == "" || $("#companyPasw").val() == "") {
			$("#registerSubmit").attr("disabled", true);
		} else {
			$("#registerSubmit").attr("disabled", false);
		}
	});

	/*校验企业名称*/
	$('#companyName').on('focus', function() {
		$(".msgReg1 span").text("");
	});
	$('#companyName').on('blur', function() {
		checkName();
	});

	/*校验企业邮箱*/
	$('.companyEmail').on('focus', function() {
		$(".msgReg2 span").text("");
	});
	$('.companyEmail').on('blur', function() {
		checkEmail();
	});

	/*校验登录密码*/
	$('#companyPasw').on('focus', function() {
		$(".msgReg3 span").text("");
	});
	$('#companyPasw').on('blur', function() {
		checkPasw();
	});

	/*校验单选框*/
	$(".cmpAgree").on("click", function() {
		if($(this).hasClass("ifxuanze")) {
			$(this).removeClass("ifxuanze");
			$(this).attr("src", "images/business_button_xuanze_nor.png")
			ifxuanze = false;
		} else {
			$(this).addClass("ifxuanze");
			$(this).attr("src", "images/business_button_xuanze_hig.png");
			ifxuanze = true;
		}
	})

	/*注册提交*/
	$('#registerSubmit').on('click', function() {
		if(ifxuanze) {
			mailRegistration();
		} else {
			$.MsgBox.Alert('提示', '请确认后勾选此选项')
		}
	});

	function checkName() {
		companyNameVal = $("#companyName").val();
		if(companyNameVal.length==""){
			$(".msgReg1").prev().addClass("frmmsg-warning");
			$(".msgReg1 span").text("请输入您的企业名称");
		}else{
			$.ajax("/ajax/isOrgUser", {
				data: {
					"orgName": companyNameVal
				},
				type: "GET",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.success && $data.data) {
						$(".msgReg1").prev().removeClass("frmmsg-warning");
						$(".msgReg1 span").text("");
						setname = true;
					} else if(!$data.success && !$data.data){
						if($data.code == 2 || $data.code == 4) {
							$(".msgReg1").prev().addClass("frmmsg-warning");
							$(".msgReg1 span").html('该企业已注册企业账户，若您是企业管理者，<a class="cmpColor" href="cmp-settled-reback.html">您可以点击这里找回账户</a>');
						} else if($data.code == 3) {
							$(".msgReg1").prev().addClass("frmmsg-warning");
							$(".msgReg1 span").text("该企业已成为【科袖认证企业】，若有问题请联系客服 010-62343359");
						}
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败')
				},
			});
		}
	}

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
					console.log($data)
					if($data.data == false) {
						$(".msgReg2").prev().addClass("frmmsg-warning");
						$(".msgReg2 span").text("该邮箱已注册企业账户，请使用其他邮箱");
					} else {
						$(".msgReg2").prev().removeClass("frmmsg-warning");
						$(".msgReg2 span").text("");
						setemail = true;
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败')
				},
			});
		} else {
			$(".msgReg2").prev().addClass("frmmsg-warning");
			$(".msgReg2 span").text("请输入正确的邮箱地址");
		}
	}

	function checkPasw() {
		companyPaswVal = $("#companyPasw").val();
		if(companyPaswVal.length < 6) {
			$(".msgReg3").prev().addClass("frmmsg-warning");
			$(".msgReg3 span").text("密码由6-24个字符组成，区分大小写");
		} else {
			$(".msgReg3").prev().removeClass("frmmsg-warning");
			$(".msgReg3 span").text("");
			setpass = true;
		}
	}

	function mailRegistration() {
		if(setname && setpass && setemail) {
			$.ajax("/ajax/regOrgMail", {
				data: {
					"orgName": companyNameVal,
					"mail": companyEmailVal,
					"password": companyPaswVal
				},
				type: "POST",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.success) {
						location.href = "cmp-settled-active.html?companyEmailVal=" + companyEmailVal;
					} else {
						if($data.code == -1) {
							$.MsgBox.Alert('提示', '该邮箱已注册企业账户，请使用其他邮箱');
						} else if($data.code == -2) {
							$.MsgBox.Alert('提示', '邮箱发送失败');
						}
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败');
				}
			});
		} else {
			checkName();
			checkEmail();
			checkPasw();
		}
	}

})