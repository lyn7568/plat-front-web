//密码修改
$(function() {
	
	var oldPwdVal, newPwdVal, newPwdOkVal;
	var orgid = $.cookie('orgId');
	if(orgid == "" || orgid == null || orgid == "null"){
    	location.href = "cmp-settled-log.html";
    }
	var setoldpwd = false;
	var setnewpwd = false;
	var setnewpwd2 = false;

	/*校验保存按钮显示状态*/
	$('#cmpAllUl').on('keyup', "#oldPwd,#newPwd,#newPwdOk", function() {
		if($("#oldPwd").val() == "" || $("#newPwd").val() == "" || $("#newPwdOk").val() == "") {
			$("#newpwdSubmit").attr("disabled", true);
		} else {
			$("#newpwdSubmit").attr("disabled", false);
		}
	});

	/*校验旧密码*/
	$('#oldPwd').on('focus', function() {
		$(".msgPwd1 span").text("");
	});
	$('#oldPwd').on('blur', function() {
		checkOldPwd();
	});

	/*校验新密码*/
	$('#newPwd').on('focus', function() {
		$(".msgPwd2 span").text("");
	});
	$('#newPwd').on('blur', function() {
		checkNewPwd();
	});

	/*校验新密码*/
	$('#newPwdOk').on('focus', function() {
		$(".msgPwd3 span").text("");
	});
	$('#newPwdOk').on('blur', function() {
		checkNewPwd2();
	});

	/*注册提交*/
	$('#newpwdSubmit').on('click', function() {
		newpwdSubmitFun();
	});

	function checkOldPwd() {
		oldPwdVal = $("#oldPwd").val();
		if(oldPwdVal.length < 6) {
			$("#oldPwd").addClass("frmmsg-warning");
			$(".msgPwd1 span").text("密码由6-24个字符组成，区分大小写");
		} else {
			$("#oldPwd").removeClass("frmmsg-warning");
			$(".msgPwd1 span").text("");
			setoldpwd = true;
		}
	}

	function checkNewPwd() {
		newPwdVal = $("#newPwd").val();
		if(newPwdVal.length < 6) {
			$("#newPwd").addClass("frmmsg-warning");
			$(".msgPwd2 span").text("密码由6-24个字符组成，区分大小写");
		} else {
			$("#newPwd").removeClass("frmmsg-warning");
			$(".msgPwd2 span").text("");
			setnewpwd = true;
		}
	}

	function checkNewPwd2() {
		newPwdOkVal = $("#newPwdOk").val();
		if(newPwdOkVal.length < 6) {
			$("#newPwdOk").addClass("frmmsg-warning");
			$(".msgPwd3 span").text("密码由6-24个字符组成，区分大小写");
		} else if(newPwdVal != newPwdOkVal) {
			$("#newPwdOk").addClass("frmmsg-warning");
			$(".msgPwd3 span").text("两次输入不一致，请重新输入");
		} else {
			$("#newPwdOk").removeClass("frmmsg-warning");
			$(".msgPwd3 span").text("");
			setnewpwd2 = true;
		}
	}
	
	function newpwdSubmitFun() {
		if(setoldpwd && setnewpwd && setnewpwd){
			$.ajax("/ajax/cpOrg", {
				data: {
					"id": orgid,
					"onw": oldPwdVal,
					"npw": newPwdOkVal
				},
				type: "POST",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.data) {
						$.MsgBox.Alert('提示', '密码修改成功！');
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
						$("#cmpAllUl input").val("");
						$("#newpwdSubmit").attr("disabled", true);
					}else{
						$.MsgBox.Alert('提示', '请输入正确的当前密码');
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败');
				}
			});	
		}
	}

	
})