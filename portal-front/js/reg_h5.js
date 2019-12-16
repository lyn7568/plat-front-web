/*邀请好友*/
$(function(){
	/*校验提交按钮显示状态*/
	$('.form-group').on('keyup', "#username,#userphone,#usermail,#userorg", function() {
		if($("#username").val() == "" || $("#userphone").val() == "" || $("#usermail").val() == "" || $("#userorg").val() == "") {
			$("#regbtn").attr("disabled",true);
		} else {
			$("#regbtn").attr("disabled",false);
		}
	});
	
	/*注册按钮*/
	$("#regbtn").on('click',function() {
		var hunPhone = $("#userphone").val();
		var hunMail = $("#usermail").val();
		if(hunPhone.length!=11){
			bombox("请输入正确的手机号码");
			return;
		}else if(hunMail.indexOf("@")<0){
			bombox("请输入正确的邮箱地址");
			return;
		}
		completeReg();
	});
	//注册提交
	function completeReg() {
		$.ajax({
			url:"http://www.ekexiu.com:8080/portal/regcustom.jsp",
			data: {
				username:$("#username").val(),
				userphone: $("#userphone").val(),
				usermail: $("#usermail").val(),
				userorg: $("#userorg").val()
			},
			dataType : "jsonp",
        	jsonp: "callback",
			async: false,
			success: function(data) {
				if(data.success) {
					bombox("您的信息提交成功！");
					$(".formblock").hide();
					$(".inviteSucceed").show();
				}
			},
			error: function() {
				bombox("服务器链接超时");
			}
		});
	}
		
	
});
