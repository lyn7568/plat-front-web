//重置企业账户密码
$(function() {
	var newPasswordval, newPasswordokval;
	var setnewP = false;
	var setnewPok = false;
	var sc = GetQueryString("sc");
	ifstate(); 
	/*校验注册按钮显示状态*/
	$('#cmpCoverUl').on('keyup', "#newPassword,#newPasswordok", function() {
		if($("#newPassword").val() == "" || $("#newPasswordok").val() == "") {
			$("#paswSubmit").attr("disabled", true);
		} else {
			$("#paswSubmit").attr("disabled", false);
		}
	});

	/*校验密码*/
	$('#newPassword').on('focus', function() {
		$(".msgReset1 span").text("");
	});
	$('#newPassword').on('blur', function() {
		checkNewPassword();
	});

	/*校验确认密码*/
	$('#newPasswordok').on('focus', function() {
		$(".msgReset2 span").text("");
	});
	$('#newPasswordok').on('blur', function() {
		checkNewPasswordOK();
	});

	/*重置密码提交*/
	$('#paswSubmit').on('click', function() {
		resetPwdfun() 
	});

	function checkNewPassword() {
		newPasswordval = $("#newPassword").val();
		if(newPasswordval.length < 6) {
			$(".msgReset1").prev().addClass("frmmsg-warning");
			$(".msgReset1 span").text("密码由6-24个字符组成，区分大小写");
		} else {
			$(".msgReset1").prev().removeClass("frmmsg-warning");
			$(".msgReset1 span").text("");
			setnewP = true;
		}
	}

	function checkNewPasswordOK() { 
		newPasswordokval = $("#newPasswordok").val();
		if(newPasswordokval.length < 6) {
			$(".msgReset2").prev().addClass("frmmsg-warning");
			$(".msgReset2 span").text("密码由6-24个字符组成，区分大小写");
		} else if(newPasswordval != newPasswordokval) {
			$(".msgReset2").prev().addClass("frmmsg-warning");
			$(".msgReset2 span").text("两次输入不一致，请重新输入");
		} else {
			$(".msgReset2").prev().removeClass("frmmsg-warning");
			$(".msgReset2 span").text("");
			setnewPok = true;
		}
	}
	
	function ifstate() {
		$.ajax("/ajax/validMailState", {
			data: {
				"state": sc,
			},
			type: "GET",
			dataType: 'json',
			async: false,
			success: function($data) {
				console.log($data)
				if($data.success) {
					if($data.data){
						$(".unreset").removeClass("displayNone");
						$(".onreset").addClass("displayNone");
					}else{
						$(".unreset").addClass("displayNone");
						$(".onreset").removeClass("displayNone");
						$("#butGo").on("click",function(){
							location.href = "cmp-pwdReset01.html";
						})
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', '服务器请求失败');
			}
		});
	}

	function resetPwdfun() {
		if(setnewP && setnewPok) {
			$.ajax("/ajax/resetPwByOrgEmail", {
				data: {
					"state": sc,
					"pw": newPasswordokval,
				},
				type: "POST",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.success && $data.data) {
						location.href = "cmp-pwdResetOk.html";
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