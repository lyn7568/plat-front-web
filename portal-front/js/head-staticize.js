
var headerHtml = '';
	headerHtml += 
			'<div class="container-fulid navheader">'+
			  '<div class="containerCon clearfix">'+
			  		'<div class="floatL">'+
						'<div class="headlogo floatL">'+
								'<a href="/index.html"><h1></h1></a>'+
						'</div>' +
						'<ul class="headnav floatL">'+
								'<li><a href="/index.html">首页</a></li>'+
								'<li><a href="/discover.html">发现</a></li>'+
						'</ul>' +
					'</div>' +
					'<div class="searchblock">'+
				    '<input type="text" placeholder="搜索专家、服务、资源" class="search-txt" id="hsearchContent">'+
						'<div class="search-btn" id="searchh"><span class="search-icon"></span></div>'+
					'</div>'+
					//未登录状态
					'<div class="unlogin floatR displayNone">'+
						'<ul class="headnavbtn floatR">'+
								'<li><a href="/login.html?tel=1" class="teyaologin">特邀专家登录</a></li>'+
								'<li><a href="/login.html">登录</a></li>'+
								'<li><a>|</a></li>'+
								'<li><a href="/register.html">注册</a></li>'+
						'</ul>' +
					'</div>' +
					//已登录状态
					'<div class="onlogin floatR displayNone">'+
						'<div class="headuserimg floatR">'+
								'<div class="headuser userRadius"><img class="portrait-p" src="/images/default-photo.jpg" /></div>'+
								'<div class="comuserSelf displayNone">' +
					                '<div class="triangleB"></div>'+
					                '<div class="personal-box bgRadius">'+
					                	'<a href="" class="goMyInf"><span class="icon icon1"></span>我的主页</a>'+
					                    '<a href="/information.html"><span class="icon icon2"></span>修改资料</a>'+
					                    '<a href="/account-set.html"><span class="icon icon3"></span>账户设置</a>'+
					                    '<a href="javascript:;" onClick="exitStaticize()"><span class="icon icon4"></span>退出登录</a>'+
					                '</div> '+            
					           ' </div>' + 
						'</div>' +
						'<ul class="headnavbtn floatR">'+
								'<li class="pr myinform"><a href="/inform.html">通知<span class="badge"></span></a></li>'+
								'<li class="pr mymessage"><a href="/tidings.html">消息<span class="badge"></span></a></li>'+
								'<li class="mywork"><a href="/myDemand.html">我的工作台</a></li>'+
						'</ul>' +
					'</div>' +
				'</div>' +
		'</div>';
	
document.write(headerHtml);

$(".headuserimg").hover(function(){
	$(".comuserSelf").stop(false,true).slideToggle();
})

