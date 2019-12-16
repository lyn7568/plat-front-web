//找回企业账号
$(function() {

	var companyNameVal, companyEmailVal, companyPaswVal;
	var setname = false;
	var setpass = false;
	var setemail = false;
	var ifxuanze = true;
	var temp = [];

	/*校验提交按钮显示状态*/
	$('#containerCon').on('keyup', "#companyName,.companyEmail,#companyPasw", function() {
		if($("#companyName").val() == "" || $("#companyEmail").val() == "" || $("#companyPasw").val() == "") {
			$("#znameSubmit").attr("disabled", true);
		} else {
			$("#znameSubmit").attr("disabled", false);
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
		$(".msgReg3 span").text("");
	});

	/*校验登录密码*/
	$('#companyPasw').on('focus', function() {
		checkPasw();
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

	/*找回企业账号提交*/
	$('#znameSubmit').on('click', function() {
		var fileoneVal = $("#fileone1").attr("data-id");
		var filetwoVal = $("#fileone2").attr("data-id");
		if(ifxuanze == false) {
			$.MsgBox.Alert('提示', '请确认后勾选此选项')
		} else if(fileoneVal == "") {
			$.MsgBox.Alert('提示', '请上传《企业法人营业执照》');
		} else if(filetwoVal == "") {
			$.MsgBox.Alert('提示', '请上传加盖公章的《入驻科袖授权证明》');
		} else {
			temp.push(fileoneVal);
			temp.push(filetwoVal);
			mailRegistration(temp);
		}
	});

	function checkName() {
		companyNameVal = $("#companyName").val();
		if(companyNameVal.length == "") {
			$(".msgReg1").prev().addClass("frmmsg-warning");
			$(".msgReg1 span").text("请输入您的企业名称");
		} else {
			$.ajax("/ajax/isOrgUser", {
				data: {
					"orgName": companyNameVal
				},
				type: "GET",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.success && $data.data == true) {
						$(".msgReg1").prev().addClass("frmmsg-warning");
						$(".msgReg1 span").html('该企业名称还未注册企业账号，<a class="cmpColor" href="cmp-settled-reg.html">请先注册</a>');
					} else if(!$data.success && !$data.data) {
						if($data.code == 2) {
							$(".msgReg1").prev().removeClass("frmmsg-warning");
							$(".msgReg1 span").text("");
							setname = true;
						} else if($data.code == 3) {
							$(".msgReg1").prev().addClass("frmmsg-warning");
							$(".msgReg1 span").text("该企业已成为【科袖认证企业】，若有问题请联系客服 010-62343359");
						} else if($data.code == 4) {
							$(".msgReg1").prev().addClass("frmmsg-warning");
							$(".msgReg1 span").html('该企业正在进行认证审核，暂时无法找回账户');
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
				data: {
					"email": companyEmailVal
				},
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
			$(".msgReg2 span").text("请输入正确是邮箱地址");
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

	function mailRegistration(temp) {
		if(setname && setpass && setemail) {
			$.ajax("/ajax/orgRetrieve", {
				data: {
					"Name": companyNameVal,
					"Email": companyEmailVal,
					"passwd": companyPaswVal,
					"fns": temp,
				},
				type: "POST",
				dataType: 'json',
				async: false,
				traditional: true, //传数组必须加这个
				success: function($data) {
					console.log($data)
					if($data.success) {
						location.href = "cmp-settled-rebackOk.html";
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