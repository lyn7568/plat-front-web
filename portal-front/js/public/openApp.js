	// 判断浏览器
    var u = navigator.userAgent;
	//var ifChrome = u.match(/Chrome/i) != null && u.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null ? true : false;  
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? true : false; //ios终端
    var ifAndroid = (u.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true : false;
    var ifiPad = (u.match(/(iPad).*OS\s([\d_]+)/)) ? true : false;
    var ifiPhone = (!ifiPad && u.match(/(iPhone\sOS)\s([\d_]+)/)) ? true : false;
    var ifSafari = (ifiPhone || ifiPad) && u.match(/Safari/);
    var version = 0;
    ifSafari && (version = u.match(/Version\/([\d\.]+)/));
        version = parseFloat(version[1], 10);
    // 是否从微信打开
    var ifWeixin = u.indexOf("MicroMessenger") >= 0; // weixin    
	
	var j = false;//未安装
    // 微信相关操作
    function r() { // weixin api
        WeixinJSBridge.invoke("getInstallState", {
            packageName: "com.ekexiu",
            packageUrl: "ekexiu://"
        }, function(M) {
            var N = M.err_msg,
                L = 0;
            if (N.indexOf("get_install_state:yes") > -1) {
                j = true//已安装
            }
        })
    }
    // 微信操作
    if (ifWeixin) { // if navigitor is weixin 
        if (window.WeixinJSBridge && WeixinJSBridge.invoke) {
            r()
        } else {
            document.addEventListener("WeixinJSBridgeReady", r, !1)
        }
    }
    function IFAndroid(W){//Android中的操作
    	//if (ifChrome) { // 如果是chrome
	        if (ifAndroid) { //安卓浏览器
	            setTimeout(function() {
	                window.location.href = W ;
	            }, 50)
	        }
	    //}
    }
    function IFiOS(W){//IOS中的操作
        if(isiOS){
	        if (ifSafari && version >= 9) { // 判断safari版本 如果大于9
		        setTimeout(function() {  // 必须要使用settimeout
		            var ifr2 = document.createElement("a"); //创建a元素
		            ifr2.setAttribute("href", W), 
		            ifr2.style.display = "none", 
		            document.body.appendChild(ifr2);
		            var To = document.createEvent("HTMLEvents"); // 返回新创建的 Event 对象，具有指定的类型。
		            To.initEvent("click", !1, !1)// 初始化新事件对象的属性,   
		            ifr2.dispatchEvent(To)  // 绑定事件
		        }, 0)
		    }else{
		    	setTimeout(function() {
			    	var ifr = document.createElement("iframe");
			        ifr.src = W; 
			        ifr.style.display = "none"; 
			        document.body.appendChild(ifr);
			        var Tp = document.createEvent("HTMLEvents"); // 返回新创建的 Event 对象，具有指定的类型。
		            Tp.initEvent("click", !1, !1)// 初始化新事件对象的属性,   
		            ifr.dispatchEvent(Tp)  // 绑定事件
		        }, 0)
		    }
		}
    }
	function isInstalled(this_,flag){
		var myUrl = {
		  open: 'ekexiu://'+ this_,/***打开app的协议***/
		  download: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.ekexiu.app'/***下载app的地址***/
		};
		var g = [];
		var oUrl = myUrl.open;
		var downUrl=myUrl.download;
		console.log(oUrl)
		if (ifWeixin) { // 如果是微信端
			if(isiOS){
				if((window.location.href).indexOf("?")>0){
					window.location.href = window.location.href +"&ifOp=1";
				}else{
					window.location.href = window.location.href +"?ifOp=1";
				}
			}
			
			if (j) {
                window.location.href = oUrl;
            } else {
            	setTimeout(function() {
            		window.location.href = downUrl;
            	},1500)
            }
            return;
        }

		IFAndroid(oUrl);
		IFiOS(oUrl);
	    
	    var P = Date.now();
	    setTimeout(function() {
	        if (flag) {
	            var S = setTimeout(function() {
	                var L = Date.now();
		            if (P && (L - P) < (1500 + 200)) {
		                window.location.href = downUrl
		            }
	            }, 1500);
	            g.push(S)
	        }
	    }, 100) 
	}
	
	function wcFresh(this_){//刷新页面
		var ifOp=GetQueryString("ifOp");
		if(ifOp){
			if(ifWeixin){//指示浏览器打开
				if(isiOS){
					var str=document.createElement("div");
					str.setAttribute("class","strCss");
				   	document.body.appendChild(str);
				}
				
			}else{
				var oUrl2="ekexiu://"+this_;
				IFiOS(oUrl2);
			}
		}
	}
	
