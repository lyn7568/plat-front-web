(function () {
    $.MsgBox = {
        Alert: function (title, msg,callback) {
            GenerateHtml("alert", title, msg);
            btnOk(callback);  //alert只是弹出消息，因此没必要用到回调函数callback
            btnNo();
        },
        Confirm: function (title, msg, callback) {
            GenerateHtml("confirm", title, msg);
            btnOk(callback);
            btnNo();
        }
    }
    //生成Html
    var GenerateHtml = function (type, title, msg) {
        var _html = "";
        _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">' + title + '</span>';
        _html += '<a id="mb_ico"></a><div id="mb_msg"><span id="mb_msgicon"></span><p id="mb_msgcontent">' + msg + '</p></div><div id="mb_btnbox">';
        if (type == "alert") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
        }
        if (type == "confirm") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        _html += '</div></div>';
        //必须先将_html添加到body，再设置Css样式
        $("body").append(_html); GenerateCss();
        
    }
    
    //生成Css
    var fontfamily='PingFang SC,Arial,Helvetica Neue,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif';
    var GenerateCss = function () {
    	
        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
            filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.5'
        });
        $("#mb_con").css({ zIndex: '999999', width: '400px', position: 'fixed',
            backgroundColor: 'White', borderRadius: '6px',overflow:'hidden',boxShadow:'1px 1px 20px 4px #666'
        });
        $("#mb_tit").css({ display: 'block', fontSize: '18px', color: '#fff', 
            backgroundColor: '#ff9900',lineHeight:'60px',textAlign: 'center',
            fontFamily: fontfamily
        });
        $("#mb_msg").css({position:'relative', padding: '30px 20px 20px', lineHeight: '24px',
            textAlign:'center', fontSize: '16px',overflow:'hidden',fontFamily: fontfamily
        });
        $("#mb_msgicon").css({display:'inline-block',width:'40px',height: '40px',marginRight: '6px',
    		background: 'url(images/sign_icon_gantan_nor.png)', backgroundSize: 'contain',overflow:'hidden'
        });
         $("#mb_msgcontent").css({margin:'10px'});
        
        $("#mb_ico").css({ display: 'block', position: 'absolute', right: '20px', top: '18px',
        	background:'url(images/sign_icon_guanbi_nor.png) center center no-repeat', width: '20px', height: '20px',cursor: 'pointer'
        });
        $("#mb_btnbox").css({ margin: '0 auto 30px', textAlign: 'center', position:'relative' });
        $("#mb_btn_ok,#mb_btn_no").css({ width: '100px', fontSize: '14px', height: '32px', color: 'white', border: 'none' });
        $("#mb_btn_ok").css({backgroundImage:'none', padding:'0',margin:'0', backgroundColor: '#ff9900',borderRadius: '6px',fontFamily: fontfamily});
        $("#mb_btn_no").css({padding:'0',margin:'0', background: 'none',color:'#666', marginLeft: '20px',borderRadius: '6px',fontFamily: fontfamily });

        var _widht = document.documentElement.clientWidth;  //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高
        var boxWidth = $("#mb_con").width();
        var boxHeight = $("#mb_con").height();
        //让提示框居中
        $("#mb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
    }
    //确定按钮事件
    var btnOk = function (callback) {
        $("#mb_btn_ok").click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    }
    //取消按钮事件
    var btnNo = function () {
        $("#mb_btn_no,#mb_ico").click(function () {
            $("#mb_box,#mb_con").remove();
        });
    }
})();