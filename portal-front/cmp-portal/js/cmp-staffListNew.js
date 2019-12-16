$(document).ready(function() {
	$(".onlogin .headnavbtn li").eq(0).addClass("navcurrent");
	$(".workmenu>ul>li.staffIcon").addClass("nowLi");
	var orgId = $.cookie('orgId');
	if(orgId == "" || orgId == null || orgId == "null"){
    	location.href = "cmp-settled-log.html";
    }
	var pageSize = 10;
	
	resMgr(orgId);
	companyAuthStatus();
	getDefaultUser();
	authorizedUser(1,1,true);
	authorizedUser(1,0,true);
	/*判断企业是否认证*/
	function companyAuthStatus() {
		$.ajax({
			url: "/ajax/org/authStatus",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"id": orgId
			},
			success: function(data) {
				if(data.success) {
					if(data.data == 3) {
						$("#companyDemandList").show();
					} else {
						$("#identityState").show();
					}
				}
			}
		})
	}
	/*获取企业认证/待认证的用户*/
	function authorizedUser(pageNo,orgAuth,isbind) {
		var strId='',strPage='';
		if(orgAuth === 1){
			strId = "#authorizedUserList",
			strPage = "#authtcdPageCode"
		}else{
			strId = "#UnauthorizedUserList",
			strPage = "#UnauthtcdPageCode"
		}
		$.ajax({
			url: "/ajax/professor/pqOrgAuth",
			type: "GET",
			dataType: "json",
			data: {
				"orgId": orgId,
				"orgAuth": orgAuth,
				"pageSize":pageSize,
				"pageNo":pageNo
			},
			success: function(data) {
				if(data.success  && data.data.data != "") {
					console.log(data);
					var $data = data.data.data;
					$(strPage).show();
					$(strId).html('');
					$(strId).parents('.list-wrapper').show();
					$("#authStaffs").html(data.data.total)
					for(var i = 0; i < $data.length; i++) {
						$.ajax({
							url: "/ajax/professor/baseInfo/" + $data[i].id,
							type: "GET",
							dataType: "json",
							success: function(res) {
								if(res.success) {
									authorizedUserHtml(orgAuth, res.data, strId);
								}
							}
						})
					}
					//分页
					if(isbind) {
						$(strPage).createPage({
							pageCount: Math.ceil(data.data.total / pageSize),
							current: data.data.pageNo,
							backFn: function(p) {
								$(strId).html("");
								authorizedUser(p,orgAuth,false);
							}
						});
					}
				}else{
					if(orgAuth === 1){
						var str = '<div class="default-text default-text-2"><div>您还没有认证员工</div>'+
						   '<a class="goYaoqing" href="javascript:void(0)">点击邀请您的员工</a></div>';
						$(strId).html(str);
						$(strPage).hide();
					}else{
						$(strId).parents('.list-wrapper').hide();
					}
					
				}
			}
		})
	}
	/*获取默认联系人列表*/
	function getDefaultUser() {
		var strId = "#defaultUserList"
		$.ajax({
			url: "/ajax/org/linkman/queryAll",
			type: "GET",
			dataType: "json",
			data: {
				"oid": orgId
			},
			success: function(data) {
				if(data.success  && data.data != "") {
					$(strId).html('');
					var $data = data.data
					for(var i = 0; i < $data.length; i++){
						$.ajax({
							url: "/ajax/professor/baseInfo/" + $data[i].pid,
							type: "GET",
							dataType: "json",
							success: function(res) {
								if(res.success) {
									authorizedUserHtml(2, res.data, strId);
								}
							}
						})
					}
					
				}else{
					var str = '<div class="default-text default-text-3">您还没有设置默认联系人<br>用户可以通过他与您的企业取得联系</div>';
					$(strId).html(str);
				}
			}
		})
	}
	/*企业认证用户html*/
	function authorizedUserHtml(flag, $res, toHtm) {
		var img, tiof, deor, offt;
		if($res.hasHeadImage) {
			img = "/images/head/" + $res.id + "_l.jpg";
		} else {
			img = "../images/default-photo.jpg"
		}
		var userType = autho($res.authType, $res.orgAuth, $res.authStatus);
		if($res.title) {
			tiof = $res.title
		} else {
			if($res.office) {
				tiof = $res.office;
			} else {
				tiof = "";
			}
		}
		if($res.department) {
			if($res.orgName) {
				deor = $res.department + " ，" + $res.orgName;
			} else {
				deor = $res.department;
			}
		} else {
			if($res.orgName) {
				deor = $res.orgName;
			} else {
				deor = "";
			}
		}
		if(tiof == ''){
			if(deor == ''){
				offt=''
			}else{
				offt = deor
			}
		}else{
			if(deor == ''){
				offt = tiof
			}else{
				offt = tiof + '，' + deor
			}
		}
		var btnStr='';
			if(flag===1){
				btnStr='<div class="block-btn" data-id="'+ $res.id +'">'+
							'<span class="block-btn-1 setDefault">设为默认联系人</span>'+
					        '<span class="cancelAuth">取消认证</span>'+
				        '</div>'
			}else if(flag===0){
				btnStr='<div class="block-btn block-btnT" data-id="'+ $res.id +'">'+
							'<span class="block-btn-1 setAuth">认证</span>'+
				        '</div>'
			}
		var oString = '<div class="block-item">'+
				     	'<a class="block-item-child" href="../userInforShow.html?professorId='+ $res.id +'">'+
					        '<div class="show-head" style="background-image:url('+img+')"></div>'+
					        '<div class="show-info">'+
					          '<div class="info-tit ellipsisSty">' + $res.name + '<em class="authicon '+ userType.sty +'" title="'+userType.title+'"></em></div>'+
					          '<div class="info-tag ellipsisSty">' + offt + '</div>'+
					        '</div>'+
				        '</a>'+ btnStr +
				     '</div>'
		$(toHtm).append(oString);

	}
	/*设置默认联系人*/
	$("#authorizedUserList").on("click", ".setDefault", function() {
		var oDataId = $(this).parent().attr("data-id");
		var oDa = $(this);
		$.ajax({
			url: '/ajax/org/linkman/save',
			type: "POST",
			dataType: "json",
			data: {
				"oid": orgId,
				"pid": '1,'+oDataId
			},
			success: function(data) {
				if(data.success) {
					getDefaultUser()
				}
			}
		})
	})
	/*setAuth员工认证*/
	$("#UnauthorizedUserList").on("click", ".setAuth", function() {
		var oDataId = $(this).parent().attr("data-id");
		$.ajax({
			url: '/ajax/professor/passOrgAuth',
			type: "POST",
			dataType: "json",
			data: {
				"id": oDataId
			},
			success: function(data) {
				if(data.success) {
					authorizedUser(1,1,true);
					authorizedUser(1,0,true);
				}
			}
		})
	})
	/*取消认证员工*/
	$("#authorizedUserList").on("click", ".cancelAuth", function() {
		var oDataId = $(this).parent().attr("data-id");
		$.MsgBox.Confirm ('提示', '确认取消该员工的认证？<br><span style="color:#999;line-height:28px;font-size:13px;">确认后会同时取消该员工的所有联系人身份</span>', function(){
			$.ajax({
				url: "/ajax/professor/removeOrgAuth",
				type: "POST",
				dataType: "json",
				data: {
					"id": oDataId
				},
				success: function(data) {
					if(data.success) {
						authorizedUser(1,1,true);
						authorizedUser(1,0,true);
						getDefaultUser();
					}
				}
			})				
		})
	})
	
	$('#staffContent').on("click", ".goSpan,.goYaoqing", function() {
		$("#mailVal").val('');
		$('.mb_success').html('');
		$(".blackcover2").fadeIn();
		$(".modelContain").show(); 
		$("body").addClass("modelOpen");
	})
	$(".mb_close").click(function() {
		$(".modelContain").hide();
		$(".blackcover2").fadeOut();
		$("body").removeClass("modelOpen");
	})
	/*检验邮箱*/
	$("#mailVal").on({
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			}
		}
	})
	$("#mailPub").on("click", function() {
		var oMail = $("#mailVal").val();
		var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(oMail.trim().length == 0) {
			$.MsgBox.Alert('提示', '请输入您企业员工的邮箱地址');
			return;
		}
		if(!gunf.test(oMail.trim())) {
			$.MsgBox.Alert('提示', '请输入正确的邮箱地址');
			return;
		} else {
			$.ajax({
				url: "/ajax/sendMailWithInviteOrg",
				type: "POST",
				dataType: "json",
				data: {
					"oid": orgId,
					"mail": oMail
				},
				success: function(data) {
					if(data.success) {
						$('.mb_success').html('已发送邀请邮件！');
						$('#mailVal').val('');
					} else {
						$.MsgBox.Alert('提示', data.msg);
					}
				}
			})
		}
	})
})