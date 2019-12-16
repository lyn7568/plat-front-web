$(document).ready(function () {
  var userid = $.cookie("userid");
  var objp = {};
  var imgUrl = "";
  var timerset;
  var oflag = false;
  var pd = false;
  loginStatus(); //判断个人是否登录
  $(".list_body").niceScroll({
    cursorcolor: "#999999"
  });
  $(".chat_body.clearfix").niceScroll({
    cursorcolor: "#999999"
  });
  messageList();
  setInterval(messageList,5000)
  function messageList() {
    $.ajax({
      "url": "/ajax/platform/msg/idx",
      "type": "get",
      "async": true,
      "data": {
        'provider': userid
      },
      "success": function (data) {
        if (data.success) {
          getTotalMessage();
          unReadedCount(userid)
          $(".list_body").html("");
          var $data = data.data;
          for (var i = 0; i < $data.length; i++) {
            var num = "none"
            if ($data[i].unread) {
              num = "block";
            }
            var ostr = '<div class="list_item clearfix" data-id="' + $data[i].requestor + '">' +
              '<i class="close_icon"></i>' +
              '<div class="avatar fl">' +
              '<img src="images/default-photo.jpg">' +
              '<span class="tips_num" style="display:' + num + '">' + $data[i].unread + '</span>' +
              '</div>' +
              '<div class="list_item_info fl">' +
              '<div class="user_infos">' +
              '<span class="user_name"> </span><em class="authiconNew"></em>' +
              '</div>' +
              '<span class="time">' + commenTime($data[i].opTime) + '</span><span class="last_news">' + ($data[i].cnt).replace(/\n/g, "<br />") + '</span>' +
              '</div>' +
              '</div>'
            var $str = $(ostr);
            if(oflag) {
              if (objp.requestor === $data[i].requestor) {
                $str.addClass('active');
              }
            }
            $(".list_body").append($str);
            var oMess = {
              "provider": $data[i].provider,
              "pid": $data[i].pid,
              "requestor": $data[i].requestor
            }
            $str.attr("dataobj", JSON.stringify(oMess))
            personMess($data[i].requestor, $str.find('img'), $str.find(".user_name"), $str.find(".authiconNew"));
          }
          if ($data.length === 0) {
            $(".list_body").html('<div class="list_item clearfix" style="text-align:center;margin-top:15px;">暂无消息</div>');
          }
        }
      },
      "error": function () {
        $.MsgBox.Alert('提示', '服务器连接超时');
      }
    });
  }
  //专家信息
  function personMess(id, pImg, pName, pTitle) {
    $.ajax({
      "url": platUrl + "/ajax/sys/user/get",
      "data": {
        id: id
      },
      "type": "GET",
      "traditional": true,
      "dataType": "json",
      "success": function (data) {
        if (data.success) {
          var $data = data.data;
          var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
          pTitle.attr("title", userType.title).addClass(userType.sty);
          pName.text($data.name || $data.account);
          var img="";
          if ($data.head) {
            pImg.attr("src", $data.head);
            img = $data.head;
          } else {
            pImg.attr("src", '/images/default-photo.jpg');
            img = '/images/default-photo.jpg';
          }
          var str = ''
          if ( $data.comp) {
            if ($data.job) {
              str = $data.comp+"，"+ $data.job;
            } else {
              str = $data.comp
            }
          } else {
            if ($data.job) {
              str = $data.job;
            }
          }
          var oMess = {
            "name": $data.name || $data.account,
            "idf": userType,
            "id": $data.id,
            "duties": str,
            "img":img
          }
          pImg.parents(".list_item").attr("data", JSON.stringify(oMess))
        }
      },
      "error": function (err) {
        $.MsgBox.Alert('提示', '服务器连接超时');
      }
    });
  }
  function ci(e) {
    var elem = e.target;
    if (elem.tagName.toLowerCase() === 'img') {
      var $this = $(elem);
      $this.attr("src", "/images/default-photo.jpg");

    }
  }
  document.addEventListener("error", ci, true /*指定事件处理函数在捕获阶段执行*/);
  /*切换*/
  $(".list_body").on("click", ".list_item", function () {
    oflag = true;
    pd = true;
    if(timerset) {
      clearInterval(timerset);
    }
    $(this).addClass("active").siblings().removeClass("active");
    if ($(this).find(".tips_num").css("display") == "block") {
      $('.mymessage .badge').text(Number($('.mymessage .badge').text()) - Number($(this).find(".tips_num").text()));
      if ($('.mymessage .badge').text() == 0) {
        $(".mymessage .badge").text("");
      }
    }
    $(this).find(".tips_num").text(0).hide();
    if ($(".usepro .user_name").css("display") == "block") {
      if ($(this).find(".user_name").text() == $(".usepro .user_name").text()) {
        return;
      }
    }
    $(".chat_content_nodata").hide();
    $(".chat_content").show();
    var pro = JSON.parse($(this).attr("data"));
    $(".usepro").find(".user_name").text(pro.name).siblings(".authiconNew").addClass(pro.idf.sty).attr("title", pro.idf.title).parent().siblings(".chating_resume_status").text(pro.duties);
    var dataobj = JSON.parse($(this).attr('dataobj'));
    objp = dataobj;
    imgUrl = JSON.parse($(this).attr('data')).img;
    if (Number($(this).find(".tips_num").text())) {
      angleMessageList(dataobj, true);
    } else {
      angleMessageList(dataobj);
    }
    getPlatName(objp.pid)
    timerset=setInterval(function() {
      angleMessageList(dataobj);
    },5000)
  });
  function getPlatName(pid) {
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
               $('#cUserPage').text('来自：'+data.data.name);                          
            }
        },
        error: function() {
            $.MsgBox.Alert('提示', '链接服务器超时')
        }
    })
}	
getKexiuTotal()
	function getKexiuTotal() {
		$.ajax({
		  url: "ajax/webMsg/unReadedCount",
		  type: "GET",
		  timeout: 10000,
		  dataType: "json",
		  traditional:true,
		  data:{
			  id: userid
		  },
		  success: function(data) {
			  if(data.success) {
				if(data.data) {
				  $('.kexiuTotal').text('（'+data.data+'）');  
				} else {
					$('.kexiuTotal').text('');  
				}                       
			  }
		  },
		  error: function() {
			  $.MsgBox.Alert('提示', '链接服务器超时')
		  }
	  })
	  }
function getTotalMessage() {
  $.ajax({
    url: "/ajax/platform/msg/unread",
    type: "GET",
    timeout: 10000,
    dataType: "json",
    traditional:true,
    data:{
        provider: userid
    },
    success: function(data) {
        if(data.success) {
          if(data.data) {
            $('.mesTotal').text('（'+data.data+'）');  
          } else {
            $('.mesTotal').text('');  
          }                   
        }
    },
    error: function() {
        $.MsgBox.Alert('提示', '链接服务器超时')
    }
})
}
  function angleMessageList(info) {
    $.ajax({
      "url": "/ajax/platform/msg/rec",
      "type": "get",
      "async": true,
      "data": info,
      "success": function (data) {
        if (data.success) {
          $(".chat_body_list").html("")
          var $data = data.data;
          if ($data.length) {
            if (arguments[1]) {
              setRead(info);
            }
            for (var i = $data.length - 1; i >= 0; i--) {
              var le = "";
              var flo = 'fl';
              var wei = "";
              var fCo = "C_end";
              var timeG = '';
              var headImg = '';
              if ($data[i].msgType) {
                le = "me";
                flo = "fr";
                if ($data[i].readed) {
                  wei = '<em class="is_readed"></em>';
                } else {
                  wei = '<em class="is_readed"></em>';
                }
                fCo = "B_end";
                headImg = '/images/head/' + userid + '_l.jpg';
              } else {
                headImg = imgUrl;
              }
              if (i == 0) {
                timeG = anTime($data[i].opTime);
              } else {
                timeG = compareTime($data[i].opTime, $data[i - 1].opTime)
              }
              var oStr = '<span class="time" data-createtime="' + $data[i].opTime + '">' + timeG + '</span>' +
                '<div class="chat_item ' + le + '">' +
                '<div class="clearfix">' +
                '<div class="item_avatar fl">' +
                '<img src="'+headImg+'">' +
                '</div>' +
                '<div class="item_content ' + flo + '">' +
                wei +
                '<div class="bubble message ' + fCo + '">' + ($data[i].cnt).replace(/\n/g, "<br />") + '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
              $(".chat_body_list").append(oStr);
            }
            $(".chat_body.clearfix").getNiceScroll().hide().show().resize();
            if (pd) {
              $(".chat_body.clearfix").getNiceScroll(0).doScrollTop($(".chat_body_list").height(), 100);
              pd = false;
            }
          }
        }
      },
      "error": function () {
        $.MsgBox.Alert('提示', '服务器连接超时');
      }
    });
  }
  /*让消息置为已读*/
  function setRead(data) {
    $.ajax({
      "url": "/ajax/platform/msg/readed",
      "type": "POST",
      "traditional": true,
      "data": data,
      "dataType": "json",
      "success": function (data) {
        if (data.success) {

        }
      },
      "error": function () {
        $.MsgBox.Alert('提示', '服务器连接超时');
      }
    });
  }
  /*超过时间10min*/
  function timeC(startTime) {
    var startdate = new Date(); 20190124155759
    startdate.setFullYear(parseInt(startTime.substring(0, 4)));
    startdate.setMonth(parseInt(startTime.substring(4, 6)) - 1);
    startdate.setDate(parseInt(startTime.substring(6, 8)));
    startdate.setHours(parseInt(startTime.substring(8, 10)));
    startdate.setMinutes(parseInt(startTime.substring(10, 12)));
    startdate.setSeconds(parseInt(startTime.substring(12, 14)));
    return startdate.getTime();
  }

  function compareTime(startTime, secondTime) {
    var date3 = timeC(secondTime) - timeC(startTime); //时间差的毫秒数
    if (date3 >= 600000) {
      if (new Date().getFullYear() == secondTime.substring(0, 4)) {

        return secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
      } else {

        return secondTime.substring(0, 4) + "年" + secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
      }
    } else {
      return '';
    }
  }

  function anTime(secondTime) {
    if (new Date().getFullYear() == secondTime.substring(0, 4)) {

      return secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
    } else {

      return secondTime.substring(0, 4) + "年" + secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
    }
  }

  /*发送信息*/
  function sendMessage(par) {
    par.cnt = $('.messContent').val();
    $.ajax({
      "url": "/ajax/platform/msg/send",
      "type": "POST",
      "traditional": true,
      "data": par,
      "dataType": "json",
      "success": function (data) {
        if (data.success) {
          $(".btnModel").attr("disabled", "disabled");
          angleMessageList(objp)
          $(".messContent").val("");
          pd = true;
        }
      },
      "error": function () {
        $.MsgBox.Alert('提示', '服务器连接超时');
      }
    });
  }
  $(".btnModel").click(function () {
    sendMessage(objp);
  })
  $(".messContent").on("input", function () {
    if ($.trim($(this).val()) == "") {
      $('.btnModel').attr("disabled", "disabled");
    } else {
      $('.btnModel').removeAttr("disabled");
    }
  })
  /*删除会话*/
	var $that;
	$(".list_body").on("click", ".close_icon", function() {
    var dataobj = JSON.parse($(this).parents('.list_item').attr('dataobj'));
    objp = dataobj;
    if(timerset) {
      clearInterval(timerset);
    }
    oflag = false;
		$that = $(this)
		$.MsgBox.Confirm("提示", "确定删除？", deleChat);
		return false;
	})
	/*会话删除函数*/
	function deleChat() {
		$.ajax({
			"url": "/ajax/platform/msg/delete",
			"type": "POST",
			"traditional": true,
			"data": objp,
			"context": $that.parents(".list_item"),
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					$(this).remove();
					$(".chat_content_nodata").show();
          $(".chat_content").hide();
          getTotalMessage();
          unReadedCount(userid)
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
})
