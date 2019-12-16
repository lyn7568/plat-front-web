$(document).ready(function() {
	loginStatus(); //判断个人是否登录
	var userid=$.cookie("userid");
    var demandId = GetQueryString("demandId");
    var pid = GetQueryString("pid");
	getDemandinfo();
    getPlatName();
    userFun();
	$(".showStatus").on('click',".meSendBack",function(){
		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			$(".questionCover").fadeIn();
        $("body").css("position", "fixed");
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
    });
    $("#workclose,#preSte").on("click",function(){
        $("#queTit").val('');
        $(".questionCover").fadeOut();
        $("body").css("position", "");
    })
	$(".showStatus").on("click",".flexCenter",function(){
		location.href="userInforShow.html?professorId="+userid;
    })
    $("#pubSte").on("click",function(){
        if (!$('#queTit').val()) {
            $.MsgBox.Alert('提示', '留言不能为空')
            return;
        }
        replayDemand();
	})
	function getPlatName() {
        $.ajax({
            url: "/ajax/platform/info",
            type: "GET",
            timeout: 10000,
            dataType: "json",
            traditional:true,
            data:{
                id: pid
            },
            success: function(data) {
                if(data.success) {
                   $('.platName').text(data.data.name);                             
                }
            },
            error: function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        })
    }	
	function getDemandinfo(){
		$.ajax({
			"url": "/ajax/platform/demand/qo",
			"type": "GET",
			"data": {
                "id": demandId,
                "pid": pid,
			 },
			"dataType": "json",
			"success": function(data) {
				console.log(data);
				if(data.success) {
					var $da=data.data;
					$("#demandTit").text($da.title); //名字
                    var thisNum="";
                    thisNum+='<li><span>需求方：</span> <span>'+$da.linkOrg+'</span></li>';	
					thisNum+='<li><span>发布时间：</span><span>'+commenTime($da.publishTime)+'</span></li>';								
					$("#demandNum").prepend(thisNum);
					$("#demandDesp")[0].innerText=$da.descp; //内容									
					document.title = $da.title + "-科袖网";
					var strCon="";
					if($da.city){ strCon+='<li>所在城市：'+$da.city+'</li>' }
					if($da.duration){ strCon+='<li>预计周期：'+$da.duration+'</li>' }
					if($da.cost){ strCon+='<li>费用预算：'+$da.cost+'</li>' }
					if($da.invalidDay){ strCon+='<li>有效期至：'+TimeTr($da.invalidDay)+'</li>' }
					$(strCon).appendTo($("#demandInf"));
				}
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
		});
		
    }
    function replayDemand() {
        $.ajax({
			"url": "/ajax/platform/demand/reply",
			"type": "POST",
			"data": {
                "id": demandId,
                "pid": pid,
                "uid": userid,
                "descp": $('#queTit').val()
			 },
			"dataType": "json",
			"success": function(data) {
				console.log(data);
				if(data.success) {
                    $(".questionCover").fadeOut();
					$("body").css("position", "");
                    $(".queStep").find("textarea").val("")
                    $.MsgBox.Alert("提示","留言发布成功");
                    $("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
                    userFun(); 
                }
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
    })
}
    function getProfessor(id,descp,timer) {
        $.ajax({
			"url": "/ajax/professor/baseInfo/"+id,
			"type": "get",
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
                    var $data=data.data;
					var img;
					var oClass = autho($data.authType, $data.orgAuth, $data.authStatus);
					var oTitle = "";
					if($data.title) {
						oTitle = $data.title;
					} else {
						if($data.office) {
							oTitle = $data.office;
						}
					}
					if($data.hasHeadImage==1) {
						img = "/images/head/" + $data.id + "_l.jpg";
					} else {
						img = "../images/default-photo.jpg"
                    }
                    var oSt = '<li>您已回复该需求</li>'
					oSt += '<li class="flexCenter" style="cursor:pointer" data-id="'+$data.id +'">'
					oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url(' + img + ');"></div>'
					oSt += '<div class = "madiaInfo" style="padding-right:0">'
					oSt += '<p class = "ellipsisSty">'
					oSt += '<span class = "h1Font" id="name">' + $data.name + '</span><em class="authiconNew ' + oClass.sty + '" title="' + oClass.title + '"></em >'
					oSt += '</p>'
					oSt += '<p class="h2Font ellipsisSty">' + oTitle + '</p>'
                    oSt += '</div>'
                    oSt += '</li>'
                    oSt += '<li><span style="margin-right:10px;">留言：</span>'+descp+'<span style="float:right;">'+timer+'</span></li>'
                    $(".showStatus").html(oSt);
                }
			},
			'error': function() {
				$.MsgBox.Alert('提示', '服务器连接超时！');
			}
    })
    }
	function userFun() {
		$.ajax({
			"url": "/ajax/platform/demand/pro",
            "type": "get",
            "data": {
                "id":demandId ,
                "pid":pid,
                "uid":userid
            },
			"async": true,
			"datatype":"json",
			"success": function(data) {
				if(data.success) {
                    console.log(data);
                    if(data.data) {
                        getProfessor(userid,data.data.descp,commenTime(data.data.assTime));
                        $(".showStatus").addClass("showStatusY")
                    } else {
                        $(".showStatus").html('<input type="button" class="frmconbtn btnModel meSendBack" value="立即回复">')
                    }
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		});
		
	}
})