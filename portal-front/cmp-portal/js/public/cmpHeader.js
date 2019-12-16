//新版header

	var headerHtml = '';
	headerHtml += '<div class="container-fulid topheader">'+
								'<div class="containerCon">'+
										'<a class="downicon" href="../download.html">科袖app</a>'+
										'<a href="../index.html">返回科袖网首页</a>'+
								'</div>' +
						'</div>' +	
					'<div class="container-fulid navheader">'+
					  '<div class="containerCon clearfix">'+
					  		'<div class="floatL">'+
									'<div class="headlogo floatL">'+
											'<a href="cmpInformation.html"><h1></h1></a>'+
									'</div>' +
								'</div>' +
								//未登录状态
								'<div class="unlogin floatR displayNone">'+
									'<ul class="headnavbtn floatR">'+
											'<li><a href="cmp-settled-log.html">登录</a></li>'+
									'</ul>' +
								'</div>' +
								//已登录状态
								'<div class="onlogin floatR displayNone">'+
									'<div class="headuserimg floatR">'+
											'<div class="headuser cmpRadius"><img src="../images/default-icon.jpg" id="imglogo" /></div>'+
											'<div class="comuserSelf displayNone">' +
					                '<div class="triangleB"></div>'+
					                '<div class="personal-box bgRadius">'+
					                    '<a href="cmp-setPwd.html"><span class="icon icon3"></span>账户设置</a>'+
					                    '<a href="javascript:;" id="exitLogin"><span class="icon icon4"></span>退出登录</a>'+
					                '</div> '+            
					           ' </div>' + 
									'</div>' +
									'<ul class="headnavbtn floatR">'+
											'<li><a href="cmp-needList.html">企业工作台</a></li>'+
									'</ul>' +
								'</div>' +
						'</div>' +
				'</div>';
	
	document.write(headerHtml);
	
	$(".headuserimg").hover(function(){
		$(".comuserSelf").stop(false,true).slideToggle();
	})
	
	

