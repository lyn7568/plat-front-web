//新版footer
var footerHtml = '';
footerHtml += '<div class="container-fulid">'+
				  '<div class="containerCon">'+	
						'<div class="bottom-block clearfix">'+
							'<div class="help-block floatL">' + 
								'<div class="logo-block"></div>'+
								'<p>' +
									'<a class="listlink" href="about.html" target="_blank" rel="nofollow">关于我们</a>' +
									'<a class="listlink" href="javascript:void(0);" rel="nofollow" id="cmpSet2">企业入驻</a>' +
									'<a class="listlink" href="javascript:void(0);" rel="nofollow" id="perso">我是专家</a>' +
									'<a class="listlink" href="privacy.html" target="_blank" rel="nofollow">用户协议</a>' +
									'<a class="listlink" href="download.html" target="_blank" rel="nofollow">产品下载</a>' +
								'</p>' +
								'<p>' +
									'<span class="listlink">客服热线： 010-62343359</span>' +
									'<span class="listlink">客服邮箱：<a rel="nofollow" href="mailto:service@ekexiu.com"> service@ekexiu.com</a></span>' +
								'</p>' +
								'<p>' +
									'<span class="listlink">工作时间： 周一至周五  9:00-18:00 </span>' +
								'</p>' +
							'</div>' +
							
							'<div class="code-block floatR">' + 
									'<div class="floatL">' +
										'<p class="codelist appcode"><span></span></p>' +
										'<p>下载移动端app</p>' +
									'</div>' +
									'<div class="floatL">' +
										'<p class="codelist weixincode"><span></span></p>' +
										'<p>关注微信公众平台</p>' +
									'</div>' +
							'</div>' +
							'<div class="copy-block clearfix">' +
								'<span>Copyright © 2016-2018 北京科袖科技有限公司 | 京ICP备16042588号-1 | </span>' +
								'<a class="beianbox" target="_black" rel="nofollow" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802022306">' +
									'<em></em> 京公网安备11010802022306号' +
								'</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
			'</div>';

document.write(footerHtml);
$("#perso").click(function(){
	var userid = $.cookie('userid');
if(userid=="null"||userid==undefined){
			location.href="login.html";
		}
	location.href="expert-authentication.html";
})
