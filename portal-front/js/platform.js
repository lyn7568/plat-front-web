$(document).ready(function() {
	$(".onlogin .headnavbtn li.mywork").addClass("navcurrent");
	$(".workmenu>ul>li:contains('需求')").addClass("nowLi");
	loginStatus();//判断个人是否登录
	valUser();
	function getYYYYMMDD() {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var day = time.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        return year + '' + month +'' + day;
    }
    var plat = {
        info: {},
        catch: {},
        request: function(id,$this) {
            const funArray = this.catch.id;
            var that = this;
            $.ajax({
                url: "/ajax/platform/info",
                type: "GET",
                timeout: 10000,
                dataType: "json",
                traditional:true,
                data:{
                    id: id
                },
                success: function(data) {
                    delete that.catch.id;
                    if(data.success) {
                        var $data = data.data;
                        that.info.id = $data;
                        for(var i = 0; i < funArray.length; i++ ) {
                            funArray[i]($data);
                        }                                  
                    }
                },
                error: function() {
                    $.MsgBox.Alert('提示', '链接服务器超时')
                }
            })
        },
        judge: function(id, callback) {
            if(this.info.id) {
                callback(this.info.id)
            } else {
                if(this.catch.id) {
                    this.catch.id.push(callback)
                } else {
                    this.catch.id = [callback]
                    this.request(id)
                }
            }
        }
    }
	demandList(true,10, 1);
	/*点击搜索*/
	$(".searchSpan").click(function(){
		$(".tcdPageCode").remove();
		$(".aboutRes").append('<div class="tcdPageCode"></div>');
		demandList(true,10,1);
	})
	/*需求列表*/
	function demandList(isbind, pageSize, pageNo) {
		$.ajax({
			url: "/ajax/platform/demand/pq",
			type: "GET",
			timeout: 10000,
			dataType: "json",
			traditional:true,
			data: {
                'invalidDay': getYYYYMMDD(),
				"key":$("#needKey").val(),
				"pageNo": pageNo,
				"pageSize":pageSize
			},
			beforeSend: function() {
				$("#demandList").append('<img src="../images/loading.gif" class="loading" />');
			},
			success: function(data) {
				if(data.success) {
                    $("#demandList").html(" ");
					var $info = data.data.data;
					if($info.length > 0){
						for(var i = 0; i < $info.length; i++) {
							var liStr=$("<li></li>").appendTo("#demandList");
							demandHtml($info[i],liStr);
						}
						if(isbind == true) {
							$(".tcdPageCode").createPage({
								pageCount: Math.ceil(data.data.total / pageSize),
								current: data.data.data.pageNo,
								backFn: function(p) {
									demandList(false,5, p);
								}
							});
						}
					}else{
						$("#demandList").parent().find(".nodatabox").removeClass("displayNone")
					}
				}
				$(".loading").remove();
			},
			error: function() {
				$.MsgBox.Alert('提示', '链接服务器超时')
			}
		})
    }
    
	function demandHtml($data,liStr) {
		var strCon='';
			strCon+='<a class="" target="_blank" href="platDemond.html?demandId='+$data.id+'&pid='+ $data.pid +'" class="madiaInfo">'
			strCon+='<p class="h1Font ellipsisSty">'+ $data.title +'</p>'
			strCon+='<ul class="showliTop h3Font clearfix">'
			strCon+='<li><span class="cmpName">'+ $data.linkOrg +'</span></li><li><span>发布于 '+TimeTr($data.publishTime)+'</span></li>'
			strCon+= '<li>来自<span class="platName">123</span></li>'
			strCon+='</ul>'
			strCon+='<p class="h2Font ellipsisSty-2">'+$data.descp+'</p>'
			strCon+='<ul class="showli clearfix h3Font">'
			if($data.city){ strCon+='<li>所在城市：'+$data.city+'</li>' }
			if($data.duration){ strCon+='<li>预计周期：'+$data.duration+'</li>' }
			if($data.cost){ strCon+='<li>费用预算：'+$data.cost+'</li>' }
			if($data.invalidDay){ strCon+='<li class="invaliTime">有效期至：'+TimeTr($data.invalidDay)+'</li>' }
			strCon+='</ul>'
            strCon+='</a>'
            var  $strCon = $(strCon);
            $strCon.appendTo(liStr);
            var localTime =  Number( getYYYYMMDD());
            var invaTime = Number($data.invalidDay);
            if(invaTime - localTime <= 7) {
                $strCon.find('.invaliTime').addClass('colorRed');
            }
        plat.judge($data.pid,function(data) {
            $strCon.find('.platName').text(data.name)
        })
	}
});