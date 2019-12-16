(function($) {
	$(document).ready(function() {
		var state;
		var imgUrl = "http://www.ekexiu.com/images/logo180.png";
		var lineLink = document.location.href;
		var descContent="赶快认领，上千家企业正在期待与您合作";
		var shareTitle;
		function Init() {
			this.id = s64to16(GetQueryString("i"));
			if(GetQueryString("d")) {
				this.inviteId =s64to16(GetQueryString("d"));
			}else{
				this.inviteId ="";
			}
			this.flag = GetQueryString("f");
			if(this.flag) {
				shareTitle="您的论文被科袖网收录了";
			}else{
				shareTitle="您的专利被科袖网收录了";
				$(".biaoti").attr("src","../images/share_bg_zhuanli_nor@3x.png")
			}
			this.passCode=false;
			this.ajax({
				url: (this.flag)?"/ajax/ppaper/qo":"/ajax/ppatent/qo",
				obj: {
					"id":this.id
				},
				type: "get",
				status:true,
				oFun: this.title
			});
			this.bindEvent(this);
		}
		Init.prototype.ajax = function(objec) {
			$.ajax({
				url: objec.url,
				data: objec.obj,
				dataType: 'json', //服务器返回json格式数据
				type: objec.type, //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				async:objec.status,
				traditional: true,
				success: function(data) {
						objec.oFun(data);
				},
				error: function(e) {
					console.log(e);
					bombox("服务器链接超时");
					return;
				}
			});
		}
		Init.prototype.title = function($data) {
			console.log($data);
			if($data.success) {
				$(".formTit").html("《"+$data.data.name+"》")
			}
			console.log($data);
		}
		Init.prototype.sendAuthentication = function($data) {
			if($data.success) {
				state = $data.data;
				doClick();
			}else{
				if($data.code==20001) {
					bombox("请输入正确的图形验证码");
					$("#changImage").attr("src","/ajax/PictureVC?"+new Date().getTime());
				}
			}
			
		}
		Init.prototype.code = function(data) {
			if(data.success) {
					if(data.data==false) {
						bombox("验证码错误，请检查后重新输入");
						return;
					}else{
						init.passCode=true;
						return;
					}
			}else{
					if(data.msg=="验证超时"){
						bombox("验证码已过期，请重新获取");
						return;
					}else{
						bombox("请填写正确的手机号,验证码");
						return;
					}
					
			}
		}
		Init.prototype.completeReg = function(data) {
			if (data.success) {
				if(init.flag) {
					location.href="../ekexiu/InviteResult.html?flag=1&code="+data.data
				}else{
					location.href="../ekexiu/InviteResult.html?code="+data.data
				}
			}else{
				bombox("收录失败，请重新填写信息");
				$("#changImage").attr("src","/ajax/PictureVC?"+new Date().getTime());
			}
		}
		Init.prototype.bindEvent = function(sel) {
			/*校验提交按钮显示状态*/
			$('.form-group').on('keyup', "#userphone,#code,#username", function() {
				if($("#userphone").val() == "" || $("#code").val() == "" || $("#username").val() == "") {
					$("#regbtn").attr("disabled", true);
				} else {
					
					$("#regbtn").attr("disabled", false);
				}
			});
			/*注册按钮*/
			$("#regbtn").on('click', function() {
				var oStringLength = $("#username").val().length;
				if(oStringLength > 10) {
					bombox("请输入您的真实姓名");
					return;
				}
				sel.ajax({
						url: "/ajax/validCode",
						obj: {
							"state": state,
							 "vc": $("#code").val()
						},
						status:false,
						type: "post",
						oFun: sel.code
					});
					
				if(sel.passCode) {
					sel.ajax({
						url: (sel.flag)?"/ajax/regAndAssPaper":"/ajax/regAndAssPatent",
						obj: (sel.flag)?{
							"state":state,
							"vc":$("#code").val(),
							"phone":$("#userphone").val(),
							"inviterId":sel.inviteId,
							"name":$("#username").val(),
							"paper":sel.id
						}:{
							"state":state,
							"vc":$("#code").val(),
							"phone":$("#userphone").val(),
							"inviterId":sel.inviteId,
							"name":$("#username").val(),
							"patent":sel.id
						},
						status:true,
						type: "post",
						oFun: sel.completeReg
					});
				}
			});
			$("#changImage").on("click",function(){
				$(this).attr("src","/ajax/PictureVC?"+new Date().getTime());
			})
			
			/*点击获取验证码*/
			$('#obtain-code').on('click', function() {
				if($("#imgCode").val()=="") {
					bombox("请输入图形验证码");
					return;
				}
				var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
				if(hunPhone.test($("#userphone").val())) {
					sel.ajax({
						url: "/ajax/phoneValidCode",
						obj: {
							"phone":$("#userphone").val(),
							"vcode":$("#imgCode").val()
						},
						status:true,
						type: "get",
						oFun: sel.sendAuthentication
					});
				} else {
					bombox("请输入正确的手机号码");
					return;
				}
			});

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
		/*微信分享*/
		$.ajax({
			url: "../ajax/weixin/jsapiTicket",
			type: 'get',
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			data: {
				'url': location.href.split('#')[0]
			},
			success: function(data) {
				if(data.data) {
					wx.config({
						debug: false, //调试模式好犀利
						appId: data.data.appId,
						timestamp: data.data.timestamp,
						nonceStr: data.data.nonceStr,
						signature: data.data.signature,
						jsApiList: [ // 所有要调用的 API 都要加到这个列表中
							"onMenuShareAppMessage",
							"onMenuShareTimeline",
							"onMenuShareQQ",
							"onMenuShareQZone",
							"scanQRCode",
						]
					});
					wx.ready(function() {
						// 在这里调用 API
						wx.onMenuShareAppMessage({ //分享给朋友
							title: shareTitle, // 分享标题
							desc: descContent, // 分享描述
							link: lineLink, // 分享链接
							imgUrl: imgUrl, // 分享图标
							success: share_success_callback,
							cancel: share_cancel_callback
						});
						wx.onMenuShareTimeline({ //分享到朋友圈
							title: shareTitle, // 分享标题
							desc: descContent, // 分享描述
							link: lineLink, // 分享链接
							imgUrl: imgUrl, // 分享图标
							success: share_success_callback,
							cancel: share_cancel_callback
						});
						wx.onMenuShareQQ({ //分享到QQ
							title: shareTitle, // 分享标题
							desc: descContent, // 分享描述
							link: lineLink, // 分享链接
							imgUrl: imgUrl, // 分享图标
							success: share_success_callback,
							cancel: share_cancel_callback
						});
						wx.onMenuShareQZone({ //分享到QQ空间
							title: shareTitle, // 分享标题
							desc: descContent, // 分享描述
							link: lineLink, // 分享链接
							imgUrl: imgUrl, // 分享图标
							success: share_success_callback,
							cancel: share_cancel_callback
						});
					});
					//分享成功后的回调函数	
					function share_success_callback() {}
					//用户取消分享后执行的回调函数	
					function share_cancel_callback() {}
	    		}
			}
		});
		var init=new Init();
	})
})(jQuery);