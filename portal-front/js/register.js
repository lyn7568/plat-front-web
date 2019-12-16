$(document).ready(function(){
	var userName=false;
	var phoneNumber=false;
	var phoneMa=false;
	var regNumber=false;
	var state;
	/*点击切换手机注册或者邮箱注册*/
	$(".loginWaySort").on("click","li",function(){
		$(this).addClass("liactive").siblings().removeClass("liactive");
		$(".loginWays ul").eq($(this).index()).removeClass("displayNone").siblings().addClass("displayNone");
		$(".cmpAllFrm").find("input").val("").find("button").attr("disabled","disabled");
		$(".frmmsg").find("span").text("");
	})
	/*校验名字*/
	//失去焦点后校验：1、输入框为空，提示：请输入您的真实姓名
	$("#yourName").blur(function(){
		if($("#yourName").val().length==0){
			$(".msgLog0").find("span").text("请输入您的真实姓名");
			userName=false;
			$(this).addClass("frmmsg-warning");
		}else{
			var inputval = $("#yourName").val().replace(/[^\u0000-\u00ff]/g, "aa").length;
			if(inputval > 20) {
				$(".msgLog0").find("span").text("姓名最长为10个汉字或20个英文字符");
				userName=false;
				$(this).addClass("frmmsg-warning");
			}else{
				$(".msgLog0").find("span").text("");
				$(this).removeClass("frmmsg-warning");
				userName=true;
			}
			
		}
	})
	$("#yourName").focus(function(){
		$(".msgLog0").find("span").text("");
		$(this).removeClass("frmmsg-warning");
	})
	/*校验手机号*/
	$("#lp_phone").blur(function(){
		phoneYesOrNo($(this));
	});
	$("#lp_phone").focus(function(){
		$(".msgLog1").find("span").text("");
		$(this).removeClass("frmmsg-warning");
	})
	/*校验手机是否已经注册函数*/
	function phoneYesOrNo($this) {
		var arg2=arguments[1];
		var phone = $("#lp_phone").val();
		if(phone.length==0) {
			$(".msgLog1").find("span").text("请输入您的手机号码");
			phoneNumber=false;
			$this.addClass("frmmsg-warning");
			return;
		}else{
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
				if(!hunPhone.test(phone.trim())) {
					$(".msgLog1").find("span").text("请输入正确的手机号码");
					phoneNumber=false;
					$this.addClass("frmmsg-warning");
					return;
				}
		}
		$.ajax("/ajax/isReg?key=" + phone, {
			type: "GET",
			async: false,
			success: function($data) {
				if($data.success) {
					if($data.data == false) {
						$(".msgLog1").find("span").text("该账号已存在，请直接登录");
						phoneNumber=false;
						$this.addClass("frmmsg-warning");
						return;
					} else {
						$(".msgLog1").find("span").text("");
						phoneNumber=true;
						$this.removeClass("frmmsg-warning");
						if(arg2==1) {
							getPhoneCode();
						}
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败')
			},
		});
	}
	/*校验手机验证码*/
	$(".companysc").focus(function(){
		$(".msgCmp03").find("span").text("");
		$(this).removeClass("frmmsg-warning");
	})
	$(".companysc").blur(function() {
		var authCode = $(this).val();
		if(authCode.length == 0) {
			$(".msgCmp03").find("span").text("请输入您收到的短信验证码");
			phoneMa=false;
			$(this).addClass("frmmsg-warning");
		} else {
			var d = /^\d{4}$/;
			if(d.test(authCode.trim())) {
				$(".msgCmp03").find("span").text("");
				phoneMa=true;
				$(this).removeClass("frmmsg-warning");
			} else {
				$(".msgCmp03").find("span").text("验证码为4位数字");
				phoneMa=false;
				$(this).addClass("frmmsg-warning");
			}
		}
	})
	/*获取验证码*/
	$("#getcode").on("click",function(){
		phoneYesOrNo($("#lp_phone"),1);
		
			
		
	});
	function doClick() {
	$("#getcode").html("60s后重新获取");
	$("#getcode").attr("disabled","disabled");
	var clickTime = new Date().getTime();
	var Timer = setInterval(function() {
		var nowTime = new Date().getTime();
		var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
		if(second > 0) {
			$("#getcode").html(second + "s后重新获取");
			if(second==1) {
				$("#changImage").attr("src","/ajax/PictureVC?"+new Date().getTime());
				$("#imgCode").val("");
			}
		} else {
			clearInterval(Timer);
			$("#getcode").html("免费获取验证码");
			$("#getcode").removeAttr("disabled");
		}
	}, 1000);
}
	$("#imgCode").on("blur",function(){
		if($("#imgCode").val().length==0) {
			$(".msgImage").text("请输入图形验证码");
			return;
		}else if($("#imgCode").val().length==4){
			$(".msgImage").text("");
			$(this).removeClass("frmmsg-warning");
		}else{
			$(".msgImage").text("图形验证码4位");
		}
	})
	$("#imgCode").on("focus",function(){
			$(".msgImage").text("");
			$(this).removeClass("frmmsg-warning");
	})
	/*发送手机验证码*/
	function getPhoneCode() {
		if($("#imgCode").val().length==0) {
			$(".msgImage").text("请输入图形验证码");
			return;
		}else if($("#imgCode").val().length==4){
			$(".msgImage").text("");
			$(this).removeClass("frmmsg-warning");
		}else{
			$(".msgImage").text("图形验证码4位");
			return;
		}
			$.ajax("/ajax/regmobilephone", {
				type: "get",
				async: true,
				success: function(data) {
					if(data.success) {
						state = data.data;
						doClick();
					}else{
						if(data.code==20001) {
							$(".msgImage").text("请输入正确的图形验证码");
							$("#changImage").attr("src","/ajax/PictureVC?"+new Date().getTime());
						}
					}
				},
				error: function() {
					$.MsgBox.Alert('message', '服务器连接超时')
				},
				data: {
					"mobilePhone": $("#lp_phone").val(),
					"vcode":$('#imgCode').val(),
				},
				dataType: 'json'
			});
	}
	$("#changImage").on("click",function(){
		$(this).attr("src","/ajax/PictureVC?"+new Date().getTime());
	})
	
	/*登录密码校验*/
	
	$("#phone_password").focus(function(){
		$(this).removeClass("frmmsg-warning");
		$(".msgLog3").find("span").text("");
	})
	$("#phone_password").blur(function(){
		setPassword();
	})
	function setPassword() {
		var password = $("#phone_password").val();
		if(password.length == 0) {
			$(".msgLog3").find("span").text("请设置您的登录密码");
			$("#phone_password").addClass("frmmsg-warning");
			regNumber=false;
		} else {
			var hunPhone = /^[0-9a-zA-Z]{6,}$/;
			if(hunPhone.test(password.trim())) {
				$(".msgLog3").find("span").text("");
				regNumber=true;
				$("#phone_password").removeClass("frmmsg-warning");
			} else {
				$(".msgLog3").find("span").text("密码由6-24个字符组成，区分大小写");
				regNumber=false;
				$("#phone_password").addClass("frmmsg-warning");
			}
		}
	}

	/*注册*/
	$("#regMess").on("keyup","#yourName,#lp_phone,.companysc,#phone_password",function(){
		if($("#yourName").val().length != 0 && $("#lp_phone").val().length != 0&&$("#imgCode").val().length != 0&&$(".companysc").val().length != 0&&$("#phone_password").val().length != 0) {
			$("#reg").removeAttr("disabled");
		}else{
			$("#reg").attr("disabled","disabled");
		}
	})
	/*注册函数*/
	function userReg() {
		console.log(state)
		$.ajax("/ajax/mobileReg", {
			type: "POST",
			async: true,
			success: function(data) {
				console.log(data);
				if(data.success) {
					loginagain();
				}else{
					if(data.code==-1){
						$.MsgBox.Alert('消息', '验证码已过期，请重新获取');
					}else if(data.code==-2){
						$(".msgCmp03 span").text('验证码错误，请检查后重试');
					}else if(data.code==-3){
						$(".msgCmp03 span").text('验证码错误，请检查后重试')
					}else if(data.code==0){
						$(".msgCmp03 span").text('验证码错误，请检查后重试')
					}
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败');
			},
			data: {
				"state": state,
				"mobilePhone": $("#lp_phone").val(),
				"validateCode": $(".companysc").val(),
				"password": $("#phone_password").val(),
				"name" :$("#yourName").val()
			},
			dataType: 'json'
		});
	}
	function loginagain() {
	$.ajax("/ajax/login", {
		type: "POST",
		async: false,
		success: function(data) {
			console.log(data);
			if (data.success) {
				location.href = "fillinfo-select.html";
			}
		},
		error: function() {
			$.MsgBox.Alert('消息', '服务器请求失败');
		},
		data: {
			"pw": $("#phone_password").val(),
			"lk": $("#lp_phone").val()
		},
		dataType: 'json'
	});
}
	/*手机注册*/
	$("#reg").click(function(){
		if(userName==true && phoneNumber==true && phoneMa==true && regNumber==true) {
			userReg();
		}
	})
	
	/*邮箱注册*/
	var oMailName=false;
	var oRegNumber=false;
	var emailPass=false;
	$("#mailName").focus(function(){
		$(".msgLog0").find("span").text("");
		$(this).removeClass("frmmsg-warning");
	})
	$("#mailName").blur(function(){
		if($("#mailName").val().length==0){
			$(".msgLog0").find("span").text("请输入您的真实姓名");
			$(this).addClass("frmmsg-warning");
			oMailName=false;
		}else{
			var inputval = $("#mailName").val().replace(/[^\u0000-\u00ff]/g, "aa").length;
			if(inputval > 20) {
				$(".msgLog0").find("span").text("姓名最长为10个汉字或20个英文字符");
				oMailName=false;
				$(this).addClass("frmmsg-warning");
			}else{
				$(".msgLog0").find("span").text("");
				oMailName=true;
				$(this).removeClass("frmmsg-warning");
			}
			
		}
	})
	/*邮箱登录密码校验*/
	$("#mailLoginPassword").focus(function(){
		$(".msgLog3").find("span").text("");
		$(this).removeClass("frmmsg-warning");
	})
	$("#mailLoginPassword").blur(function(){
		mailSetPassword();
	})
	function mailSetPassword() {
		passw();
	}
	/*校验登录密码函数*/
	function passw() {
		var password = $("#mailLoginPassword").val();
		if(password.length == 0) {
			$(".msgLog3").find("span").text("请设置您的登录密码");
			$("#mailLoginPassword").addClass("frmmsg-warning");
			oRegNumber=false;
		} else {
			var hunPhone = /^[0-9a-zA-Z]{6,}$/;
			if(hunPhone.test(password.trim())) {
				$(".msgLog3").find("span").text("");
				$("#mailLoginPassword").removeClass("frmmsg-warning");
				oRegNumber=true;
			} else {
				$(".msgLog3").find("span").text("密码由6-24个字符组成，区分大小写");
				$("#mailLoginPassword").addClass("frmmsg-warning");
				oRegNumber=false;
			}
		}
	}
	/*校验邮箱地址*/
	$("#mailAddress").focus(function(){
		$(".msgLog1").find("span").text("");
		$(this).removeClass("frmmsg-warning");
	})
	$("#mailAddress").blur(function(){
		oEmail();
	})
	/*校验邮箱地址函数*/
	function oEmail(){
		var email = $("#mailAddress").val();
		
		var gunf = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if(email.length==0) {
			$(".msgLog1").find("span").text("请输入您的邮箱地址");
			$("#mailAddress").addClass("frmmsg-warning");
			emailPass = false;
		}else{
			if(gunf.test(email.trim())) {
					valEmail();
				} else {
					/*alert("请输入正确是邮箱地址");*/
					$(".msgLog1").find("span").text("请输入正确的邮箱地址");
					emailPass = false;
					$("#mailAddress").addClass("frmmsg-warning");
				}
		}
	}
	function valEmail() {
		$.ajax("/ajax/isReg?key=" + $("#mailAddress").val(), {
			type: "GET",
			async: true,
			success: function($data) {
				console.log($data);
				if($data.data == false) {
					$(".msgLog1").find("span").text("该账号已存在，请直接登录");
					$("#mailAddress").addClass("frmmsg-warning");
					emailPass = false;
				} else {
					$(".msgLog1").find("span").text("");
					$("#mailAddress").removeClass("frmmsg-warning");
					emailPass = true;
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '服务器请求失败')
			},
		});
	}
	/*注册是否点击*/
	$("#mailMess").on("keyup","#mailName,#mailAddress,#mailLoginPassword",function(){
			if ($("#mailName").val().length != 0 && $("#mailAddress").val().length != 0 && $("#mailLoginPassword").val().length != 0) {
				$("#mailReg").removeAttr("disabled");
				
			} else{
				$("#mailReg").attr("disabled","disabled");
			}
		
	})
	$("#mailReg").on("click",function(){
		if(oMailName==true && oRegNumber==true && emailPass==true) {
			mailRegistration();
		}
		
	})
	//邮箱注册提交
function mailRegistration() {
	var mailVal = $("#mailAddress").val();
	var maiName = $("#mailName").val();
	var passwordVal = $("#mailLoginPassword").val();
		$.ajax("/ajax/emailReg", {
			type: "POST",
			async: true,
			success: function(data) {
				if(data.success) {
					/*$.cookie('mailVal', mailVal);
					location.href = "bind-mail.html";*/
					$(".waysBlock").hide();
					$(".maliTo").show();
					$(".loginWaySort").off("click");
					$(".loginWaySort li").css("cursor","auto"); 
					$("#omaile").text(mailVal);
				} else {
					$.MsgBox.Alert('消息', '邮箱发送失败');
				}
			},
			error: function() {
				$.MsgBox.Alert('消息', '邮箱发送失败');
			},
			data: {
				"mail": mailVal,
				"password": passwordVal,
				"name" : maiName
			},
			dataType: 'json'
		});
}
/*登录邮箱*/
	$("#loginMail").click(function(){
	var url = $("#mailAddress").val().split('@')[1];
        for (var j in hash){  
            if(hash[url]==undefined){
            	window.open("http://mail." + url);
            	break;
        	}else{
           		window.open(hash[url]);	
           		break;
        	}
        }  
	})
})
