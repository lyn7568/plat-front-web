	var step = GetQueryString("step"),
		orgId = GetQueryString("aid"),
		orgName = GetQueryString("an"),
		orgLogo = GetQueryString("al");
	var namePass = false;
	var passwordPass = false;
	
	$(".cmpOrgName").text(orgName);
	$("#orgHeadLogo").attr("src", orgLogo);
	var foL = $('.cmp-invite-block').attr('data-step'),
		foR = $('.cmp-success-block').attr('data-step');
	
	if(step === foR){
		$('.cmp-success-block').show();
	}else{
		$('.cmp-invite-block').show();
	}
	
	$("#soonReg").on("click",function(){
		location.href = 'cmp-staff-invite.html?aid='+orgId+'&an='+orgName+'&al='+orgLogo
	})
	/*校验登录按钮显示状态*/
	function checkLoginButtn(_this) {
		var username = $(_this).parents(".cmpCoverUl").find(".username").val();
		var passwd = $(_this).parents(".cmpCoverUl").find(".passwd").val();
		if(username == "" || passwd == "") {
			$(_this).parents(".cmpCoverUl").find(".loginSubmit").attr("disabled", true);
		} else {
			$(_this).parents(".cmpCoverUl").find(".loginSubmit").attr("disabled", false);
		}
	}
	
	/*获取焦点*/
	function getFocus(_this) {
		$(_this).next().find("span").text("");
		$(_this).removeClass("frmmsg-warning");
	}
	
	//校验登录手机和邮箱账户
	function nameVal(_this) {
		var loginName = $(_this).val();
		var gunf = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
		if(loginName.length == "") {
			$(_this).next().find("span").text("请输入您的手机或邮箱");
			$(_this).addClass("frmmsg-warning");
		} else if(gunf.test(loginName.trim())) {
			userRegisterOk(_this);
			$(_this).next().find("span").text("");
			$(_this).removeClass("frmmsg-warning");
			namePass = true;
		} else if(hunPhone.test(loginName.trim())) {
			userRegisterOk(_this);
			$(_this).next().find("span").text("");
			$(_this).removeClass("frmmsg-warning");
			namePass = true;
		} else {
			$(_this).next().find("span").text("请输入正确的手机或邮箱");
			$(_this).addClass("frmmsg-warning");
		}
	}
	//判断账号是否注册
	function userRegisterOk(_this,org) {
		var loginName = $(_this).val();
		$.ajax("/ajax/isReg?key=" + loginName, {
			type: "GET",
			async: true,
			success: function($data) {
				if($data.data == true) {
					$(_this).next().find("span").text("该账号不存在，请检查后重试");
					$(_this).addClass("frmmsg-warning");
				} else {
					$(_this).next().find("span").text("");
					$(_this).removeClass("frmmsg-warning");
					if(org==1){
						doClick("#getcode");
						phoneVerificationCode("#getcode");
					}
				}
			}
		});
	}
	
	//校验登录密码
	function passwordVal(_this) {
		var passwd = $(_this).val();
		if(passwd.length == "") {
			$(_this).next().find("span").text("请输入您的登录密码");
			$(_this).addClass("frmmsg-warning");
		} else if(passwd.length < 6) {
			$(_this).next().find("span").text("密码由6-24个字符组成，区分大小写");
			$(_this).addClass("frmmsg-warning");
		} else {
			$(_this).next().find("span").text("");
			$(_this).removeClass("frmmsg-warning");
			passwordPass = true;
		}
	}
	var professorId;
	//密码登录
	function passwdLogin(_this) {
		var loginName = $(_this).parents(".cmpCoverUl").find(".username").val();
		var passwordd = $(_this).parents(".cmpCoverUl").find(".passwd").val();
		if(namePass && passwordPass) {
			$.ajax("/ajax/login", {
				type: "POST",
				data: {
					"pw": passwordd,
					"lk": loginName
				},
				dataType: 'json',
				async: false,
				success: function(data) {
					if(data.success) {
						if(data.data != "null" && data.data != null) {
							professorId=data.data.id;
							getUserInfo(data.data.id)
						} else {
							$(_this).parents(".cmpCoverUl").find(".msgLog2 span").text("账号与密码不匹配，请检查后重试");
						}
					}
				}
			});
		}
	}
	
	function getUserInfo(id){
		$.ajax("/ajax/professor/baseInfo/"+id, {
			type: "GET",
			dataType: 'json',
			success: function(data) {
				if(data.success) {
					var auth = data.data.orgAuth;
					$(".cmpOrgName2").text(data.data.orgName);
					if(auth === '1'){
						$('.loginBl').addClass('displayNone')
						$('.sureIBl').removeClass('displayNone')
					}else if(auth === '0'){
						joinOrg(id);
					}
				}
			}
		});
	}
	$('.sureIBl').on('click','.sureUpData',function(){
		joinOrg(professorId);
	})
	$('.sureIBl').on('click','.reject-btn',function(){
		$.cookie('userid', null);
		$.cookie('userAuth', null);
		$.cookie('userEmail', null);
		$.cookie('userMobilePhone', null);
		$.cookie('userName', null);
		$.cookie('userType', null);
		location.href = "../index.html"
	})
	$('.login-kexiu').on('click', function(){
		location.href = "../index.html"
	})
	//加入企业
	function joinOrg(id){
		$.ajax("/ajax/professor/joinAndPassOrgAuth", {
			type: "POST",
			async: true,
			data: {
				"pid": id,
				"oid": orgId
			},
			success: function(res) {
				if(res.success){
					$('.cmp-success-block').show();
					$('.cmp-invite-block').hide();
				}
			}
		})
	}
	//提交登录
	function login(_this) {
		passwdLogin(_this);
	}