//账号绑定
$(function() {
	var emailCookieshow;
	var orgid = $.cookie('orgId');
	if(orgid == "" || orgid == null || orgid == "null"){
    	location.href = "cmp-settled-log.html";
    }
	var orgEmail = $.cookie('orgEmail');
	var setemail = false;
	$(".bindEmailbtn").click(function() {
		modelOpen();
	})
	$(".modelClosebtn").click(function() {
		modelClose();
	})

	/*回填cookie邮件*/
	showEmail();

	/*校验邮箱按钮显示状态*/
	$('#companyEmail').on('keyup', function() {
		if($(this).val() == "") {
			$("#saveSubmit").attr("disabled", true);
		} else {
			$("#saveSubmit").attr("disabled", false);
		}
	});

	/*校验企业邮箱*/
	$('#companyEmail').on('focus', function() {
		$(".msgBind1 span").text("");
	});
	$('#companyEmail').on('blur', function() {
		checkEmail();
	}); 

	/*发送验证邮件*/
	$('#saveSubmit').on('click', function() {
		reqBindOrgMail();
	});

	function emailhome(emailset) {
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

	function checkEmail() {
		companyEmailVal = $("#companyEmail").val();
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
						$(".msgBind1").prev().addClass("frmmsg-warning");
						$(".msgBind1 span").text("该邮箱已绑定，请使用其他邮箱");
					} else {
						$(".msgBind1").prev().removeClass("frmmsg-warning");
						$(".msgBind1 span").text("");
						setemail = true;
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败')
				},
			});
		} else {
			$(".msgBind1").prev().addClass("frmmsg-warning");
			$(".msgBind1 span").text("请输入正确是邮箱地址");
		}
	}

	function reqBindOrgMail() {
		if(setemail) {
			$.ajax("/ajax/reqBindOrgMail", {
				data: {
					"id": orgid,
					"mail": companyEmailVal
				},
				type: "GET",
				dataType: 'json',
				async: false,
				success: function($data) {
					console.log($data)
					if($data.data) {
						$("#emailone").addClass("displayNone");
						$("#emailtwo").removeClass("displayNone");
						$("#emailShow").text(companyEmailVal);
						$("#emailGo").on("click", function() {
							var url = companyEmailVal.split('@')[1];
							for(var j in hash) {
								if(hash[url]==undefined){
					        		window.open("http://mail." + url);
					        	}else{
					        	 	$(this).attr("href", hash[url]);
									window.open(hash[url]);
					        	}
							}
							location.reload(true);
						});
					} else {
						$.MsgBox.Alert('提示', '发送邮箱验证失败')
					}
				},
				error: function() {
					$.MsgBox.Alert('提示', '服务器请求失败')
				},
			});
		}else{
			checkEmail();
		}
	}
	
	function showEmail() {
		$.ajax("/ajax/orgUser/orgEmail", {
			data: {
				"id": orgid
			},
			type: "GET",
			dataType: 'json',
			async: false,
			success: function($data) {
				console.log($data)
				if($data.success) {
					var orgEmail = $data.data;
					emailhome(orgEmail);
					$("#orgEmail").text(emailCookieshow);
				}
			},
			error: function() {
				$.MsgBox.Alert('提示', '服务器请求失败')
			},
		});
	}


})