//接受企业邀请，注册「科袖」
$(function() {
	var orgId = GetQueryString("aid"),
		orgName = GetQueryString("an"),
		orgLogo = GetQueryString("al");
	var sc = GetQueryString("sc");
	var companyNameVal, companyPhoneVal, companyscVal, companyPswVal1;
	var setname = false;
	var phonePass = false;
	var phoneCode = false;
	var setnewpwd = false;
	
	$(".cmpOrgName").text(orgName);
	$("#orgHeadLogo").attr("src", orgLogo);
	if(sc){
		initialVal()	
	}
	/*校验注册按钮显示状态*/
	$('#cmpSettledul').on('keyup', "#companyName,#companyPhone,#imgCode,#companysc,#companyPsw1", function() {
		if($("#companyName").val() == "" || $("#companyPhone").val() == "" || $("#companysc").val() == "" || $("#companyPsw1").val() == "" || $("#imgCode").val() == "") {
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
	/*改变图形验证码*/
	$("#changImage").on("click",function(){
		$(this).attr("src","/ajax/PictureVC?"+new Date().getTime());
	})
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

	/*校验单选框*/
//	$(".cmpAgree").on("click", function() {
//		if($(this).hasClass("ifxuanze")) {
//			$(this).removeClass("ifxuanze");
//			$(this).attr("src", "images/business_button_xuanze_nor.png")
//			ifxuanze = false;
//		} else {
//			$(this).addClass("ifxuanze");
//			$(this).attr("src", "images/business_button_xuanze_hig.png");
//			ifxuanze = true;
//		}
//	})
	function initialVal() {
		$.ajax("/ajax/queryOrgByOrgInviteLogId", {
			type: "GET",
			data:{
				code:sc
			},
			success: function($data) {
				if($data.success || $data.data!=='') {
					var imgS="/images/default-icon.jpg"
					if($data.data.hasOrgLogo){
						imgS="/images/org/" + $data.data.id + ".jpg";
					}
					$("#orgHeadLogo").attr("src", imgS);
					orgId = $data.data.id;
					orgName = $data.data.name;
					orgLogo = imgS
					$(".cmpOrgName").text(orgName);
				} else {
					$.MsgBox.Alert('消息', '验证链接已失效')
				}
			}
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
			}
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
		getPhoneCode(); //调用发送手机验证码接口
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
		$("#getcode").html("60s后重新获取");
		$("#getcode").attr("disabled",true);
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
				$("#getcode").attr("disabled",false);
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
	
	$("#goLogin").on("click",function(){
		location.href = 'cmp-staff-invite-log.html?aid='+orgId+'&an='+orgName+'&al='+orgLogo
	})

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
	
	var state;
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
			data: {
				"mobilePhone": $("#companyPhone").val(),
				"vcode":$('#imgCode').val(),
			},
			dataType: 'json'
		});
	}

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
	function userReg() {
		$.ajax("/ajax/mobileReg", {
			type: "POST",
			async: true,
			data: {
				"state": state,
				"mobilePhone": $("#companyPhone").val(),
				"validateCode": $("#companysc").val(),
				"password": $("#companyPsw1").val(),
				"name" :$("#companyName").val()
			},
			dataType: 'json',
			success: function(data) {
				if(data.success) {
					var pid = data.data;
					$.ajax("/ajax/professor/joinAndPassOrgAuth", {
						type: "POST",
						async: true,
						data: {
							"pid": pid,
							"oid": orgId
						},
						success: function(res) {
							location.href = 'cmp-staff-invite-log.html?step=2&aid='+orgId+'&an='+orgName+'&al='+orgLogo
						}
					})
				}else{
					if(data.code==-1){
						$.MsgBox.Alert('消息', '验证超时');
					}else if(data.code==-2){
						$(".msgCmp03 span").text('手机号与验证手机不匹配');
					}else if(data.code==-3){
						$(".msgCmp03 span").text('验证码错误，请检查后重试')
					}
				}
			}
			
		});
	}

	/*手机注册*/
	$("#companyRet").click(function(){
		if(setname==true && phonePass==true && phoneCode==true && setnewpwd==true) {
			userReg();
		}
	})
})