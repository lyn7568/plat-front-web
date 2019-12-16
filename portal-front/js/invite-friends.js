/*邀请好友*/
$(function(){
	
	var phoneCode = false;
	var ifCode = false;
	var ifpassword = false;
	var state;
	var inviterId = GetQueryString("professorId");
	var username = GetQueryString("professorName");
	
	$(".inviteTit span").text(username);
	
	$("#changImage").on("click",function(){
		$(this).attr("src","/ajax/PictureVC?"+new Date().getTime());
	})
	/*校验提交按钮显示状态*/
	$('.form-group').on('keyup', "#userphone,#code,#password,#username,#imgCode", function() {
		if($("#userphone").val() == "" || $("#code").val() == "" || $("#password").val() == "" || $("#username").val() == "") {
			$("#regbtn").attr("disabled",true);
		} else {
			$("#regbtn").attr("disabled",false);
		}
	});
	
	/*注册按钮*/
	$("#regbtn").on('click',function() {
		var oStringLength=$("#username").val().length;
		if(oStringLength>10){
			bombox("请输入您的真实姓名");
			return;
		}
		var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
		if(!hunPhone.test($("#userphone").val())) {
			bombox("请输入正确的手机号码");
			return;
		} 
		if($("#code").val().length==4) {
			ifCode=true;
		}else{
			bombox("短信验证码4位");
		}
		passwordVal();
		if(ifpassword && ifCode){
			completeReg();
		}
	});
		
	/*点击获取验证码*/
	$('#obtain-code').on('click',function() {
		phoneVal();
	});
	
	/*校验手机号*/
	function phoneVal() {
		var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
		if(hunPhone.test($("#userphone").val())) {
			isReg();
		} else {
			bombox("请输入正确的手机号码");
			return;
		}
	}
	
	/*校验用户名是否注册*/
	function isReg() {
		$.ajax({
			url:"/ajax/isReg?key=" + $("#userphone").val(),
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				if(data.data == false) {
					bombox("您的手机已被注册");
					return;
				} else {
					phoneCode = true;
					if(phoneCode){
						sendAuthentication();
					}
				}
			},
			error: function() {
				bombox("服务器链接超时");
				return;
			}
		});
	}
	
	/*手机发送验证码*/
	function sendAuthentication() {
		$.ajax({
			url:"/ajax/regmobilephone",
			data: {
				vcode:$("#imgCode").val(), 
				mobilePhone: $("#userphone").val()
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			async: false,
			timeout: 10000, //超时设置
			success: function(data) {
				//console.log(data);
				if(data.success) {
					state = data.data;
					doClick();
				}else{
					bombox("验证码不正确");
					$("#changImage").attr("src","/ajax/PictureVC?"+new Date().getTime());
				}
			},
			error: function() {
				bombox("服务器链接超时");
				return;
			}
		})
	}
	
	/*30s后重新获取验证码*/
	function doClick() {
		$("#obtain-code").attr("disabled",true);
		$("#obtain-code").text("60s后重新获取");
		var clickTime = new Date().getTime();
		var Timer = setInterval(function() {
			var nowTime = new Date().getTime();
			var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
			if(second > 0) {
				$("#obtain-code").text(second + "s后重新获取");
			} else {
				clearInterval(Timer);
				$("#obtain-code").attr("disabled",false);
				$("#obtain-code").text("获取验证码");
			}
		}, 1000);
	}

	
	/*校验验证码*/
	function codeVal() {
		$.ajax({
			url:"/ajax/validCode",
			data: {
				"state": state,
				"vc": $("#code").val()
			},
			dataType: 'json', //数据格式类型
			async: false,
			type: 'POST', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				//console.log(data.success);
				if(data.success) {
					if(data.data==false) {
						bombox("验证码不正确");		
					
						return;
					}else{
						passwordVal();
						ifCode =true;
						return;
					}
				}else{
					
					
						bombox("验证码错误");
					
					
				}
			},
			error: function() {
				bombox("服务器链接超时");
				return;
			}
		})
	}
	
    /*校验注册密码*/
	function passwordVal() {
		var passwordv = $("#password").val();
	    if(passwordv.length < 6) {
			bombox("请输入由6-24 个字符组成，区分大小写");
			return;
		}else{
			ifpassword = true;
			return;
		}
	}
	
	//注册提交
	function completeReg() {
		$.ajax({
			url:"/ajax/mobileReg",
			data: {
				state: state,
				mobilePhone: $("#userphone").val(),
				validateCode: $("#code").val(),
				password: $("#password").val(),
				inviterId:inviterId,
				name:$("#username").val()
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			async: false,
			success: function(data) {
				if(data.success) {
					bombox("注册成功");
					$(".formblock").hide();
					$(".inviteSucceed").show();
				}else{
					bombox("验证码错误");
				}
			},
			error: function() {
				bombox("服务器链接超时");
			}
		});
	}
		
	
});
