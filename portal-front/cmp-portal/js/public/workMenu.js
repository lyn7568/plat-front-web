var colMgr = stringToBoolean($.cookie("colMgr"));
var resMgr = stringToBoolean($.cookie("resMgr"));
var Html = '';
	Html += '<ul>'+
			'<li><a>工作台</a></li>'+
	        '<li class="demandIcon"><a href="cmp-needList.html">需求</a></li>'
        	if(!colMgr && !resMgr){
        		Html += '<li class="productIcon"><a href="cmp-productList.html">产品</a></li>'
        	}
        	if(resMgr) {
        		Html +='<li class="serIcon"><a href="cmp-serviceList.html">服务</a></li>'+
        		       '<li class="resIcon"><a href="cmp-resourceList.html">资源</a></li>'
        	}
	Html += '<li class="artIcon"><a href="cmp-articalList.html">文章</a></li>'+
        	'<li class="staffIcon"><a href="cmp-staffList.html">员工</a></li>'+
	        '</ul>'+
	        '<ul>'+
	        	'<li><a href="cmpInformation.html">返回</a></li>'+
	        '</ul>';
	
document.write(Html);