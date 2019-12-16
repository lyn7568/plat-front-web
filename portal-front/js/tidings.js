$(document).ready(function() {
	$(".onlogin .headnavbtn li.mymessage").addClass("navcurrent");

	loginStatus(); //判断个人是否登录
	$("#feedback").hide();
	var professorId = GetQueryString("id");
	var firstFlag;
	$(".list_body").niceScroll({
		cursorcolor: "#999999"
	});
	$(".chat_body.clearfix").niceScroll({
		cursorcolor: "#999999"
	});

	var userid = $.cookie("userid");
	if(userid=='null') {
		location.href="login.html";
	}
	function websocrket() {
		var ws = new WebSocket("ws://192.168.3.233:8081/portal/websocket/msg?id=" + userid + "&pm=www");
		ws.onopen = function() {
			console.log(userid);
		};
		ws.onmessage = function(a) {
			var fol = true;
			var $info = JSON.parse(a.data);
			for(var i = 0; i < $(".list_body").find('.list_item').length; i++) {
				if($(".list_body").find('.list_item').eq(i).attr('data-id') == $info.sender) {
					fol = false;
					$(".list_body").find('.list_item .last_news').eq(i).html(($info.cnt).replace(/\n/g,"<br />"));
					$(".list_body").find('.list_item .time').eq(i).text(commenTime($info.sendTime));
					if($('.chat_content_nodata').css('display') == "none") {
						if($(".list_body").find('.list_item .user_name').eq(i).text() == $(".usepro .user_name").text()) {
							setRead($info.sender, $info.sendTime);
							var time1 = $(".chat_body_list").find(".time").last().attr("data-createtime");
							if(time1) {
								var str1 = '<span class="time" data-createtime="' + $info.sendTime + '">' + compareTime(time1, $info.sendTime) + '</span>'
							} else {
								var str1 = '<span class="time" data-createtime="' + $info.sendTime + '">' + anTime($info.sendTime) + '</span>'
							}

							var oStr1 = '<div class="chat_item ">' +
								'<div class="clearfix">' +
								'<div class="item_avatar fl">' +
								'<img src="/images/head/' + $info.sender + '_l.jpg">' +
								'</div>' +
								'<div class="item_content fl">' +
								'<em class="is_readed"></em>' +
								'<div class="bubble message C_end">' + ($info.cnt).replace(/\n/g,"<br />") + '</div>' +
								'</div>' +
								'</div>' +
								'</div>'
							$(".chat_body_list").append(str1 + oStr1);
							$(".chat_body.clearfix").getNiceScroll().hide().show().resize();
							$(".chat_body.clearfix").getNiceScroll(0).doScrollTop($(".chat_body_list").height(), 100)
						} else {
							var oNu = Number($(".list_body").find('.list_item .tips_num').eq(i).text()) + 1;
							$(".list_body").find('.list_item .tips_num').eq(i).text(oNu).show();
							$('.mymessage .badge').text(Number($('.mymessage .badge').text())+1)
							getTotalMessage()
						}
					} else {
						var oNu = Number($(".list_body").find('.list_item .tips_num').eq(i).text()) + 1;
						$(".list_body").find('.list_item .tips_num').eq(i).text(oNu).show();
						$('.mymessage .badge').text(Number($('.mymessage .badge').text())+1)
						getTotalMessage()
					}
					if(i > 0)
						$(".list_body").find('.list_item').eq(i).remove().clone().prependTo($(".list_body"));

				} else {

				}

			}
			if(fol) {
				var ostr = '<div class="list_item clearfix active" data-id="' + $info.sender + '">' +
					'<i class="close_icon"></i>' +
					'<div class="avatar fl">' +
					'<img src="images/default-photo.jpg">' +
					'<span class="tips_num" >1</span>' +
					'</div>' +
					'<div class="list_item_info fl">' +
					'<div class="user_infos">' +
					'<span class="user_name"> </span><em class="authiconNew"></em>' +
					'</div>' +
					'<span class="time">' + commenTime($info.sendTime) + '</span><span class="last_news">' + ($info.cnt).replace(/\n/g,"<br />") + '</span>' +
					'</div>' +
					'</div>'
				var $str = $(ostr);
				$(".list_body").prepend($str);
				personMess($info.sender, $str.find('img'), $str.find(".user_name"), $str.find(".authiconNew"));
				
						$('.mymessage .badge').text(Number($('.mymessage .badge').text())+1)
						getTotalMessage()
			}
		};
		ws.onclose = function() {

		}
	}
	getPlatTotal()
	function getPlatTotal() {
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
				}                        
			  }
		  },
		  error: function() {
			  $.MsgBox.Alert('提示', '链接服务器超时')
		  }
	  })
	  }
	if(professorId) {
		firstFlag = 1;
		$(".chat_content_nodata").hide();
		$(".chat_content").show();
		angleMessageList(professorId);
		persons(professorId)
	}else{
		myMessageList()
		
	}

	/*消息内容*/
	function angleMessageList(opId) {
		$.ajax({
			"url": "/ajax/webMsg/cnt/load",
			"type": "get",
			"async": true,
			"data": {
				sender: opId,
				reciver: userid,
				both: true
			},
			"success": function(data) {
				console.log(data)
				if(data.success) {
					$(".chat_body_list").html("")
					var $data = data.data;
					if($data.length) {
						if(arguments[1]) {
							setRead(opId, $data[$data.length - 1].sendTime)
							getTotalMessage();
						}
						if(firstFlag==1) {
							var ostr1 = '<div class="list_item clearfix active" data-id="' + professorId + '">' +
								'<i class="close_icon"></i>' +
								'<div class="avatar fl">' +
								'<img src="images/default-photo.jpg" >' +
								'<span class="tips_num" style="display:none;">0</span>' +
								'</div>' +
								'<div class="list_item_info fl">' +
								'<div class="user_infos">' +
								'<span class="user_name"> </span><em class="authiconNew"></em>' +
								'</div>' +
								'<span class="time">' + commenTime($data[$data.length-1].sendTime) + '</span><span class="last_news">'+$data[$data.length-1].cnt.replace(/\n/g,"<br />")+'</span>' +
								'</div>' +
								'</div>'
							var $str1 = $(ostr1);
							$(".list_body").prepend($str1);
							personMess(professorId, $str1.find('img'), $str1.find(".user_name"), $str1.find(".authiconNew"));
							var m=0;
							for(var j=0;j<$data.length;j++) {
								if(professorId==$data[j].sender) {
									m=m+1;
								}
							}
							if(m==0) {
								setRead(professorId, $data[$data.length-1].sendTime)
							}
							myMessageList();
						}
						firstFlag = 0;
						for(var i = 0; i < $data.length; i++) {
							var le = "";
							var flo = 'fl';
							var wei = "";
							var fCo = "C_end";
							var timeG = '';
							if(userid == $data[i].sender) {
								le = "me";
								flo = "fr";
								if($data[i].readed) {
									wei = '<em class="is_readed"></em>';
								} else {
									wei = '<em class="is_readed"></em>';
								}

								fCo = "B_end";
							}
							if(i == 0) {
								timeG = anTime($data[i].sendTime);
							} else {
								timeG = compareTime($data[i - 1].sendTime, $data[i].sendTime)
							}
							var oStr = '<span class="time" data-createtime="' + $data[i].sendTime + '">' + timeG + '</span>' +
								'<div class="chat_item ' + le + '">' +
								'<div class="clearfix">' +
								'<div class="item_avatar fl">' +
								'<img src="/images/head/' + $data[i].sender + '_l.jpg">' +
								'</div>' +
								'<div class="item_content ' + flo + '">' +
								wei +
								'<div class="bubble message ' + fCo + '">' + ($data[i].cnt).replace(/\n/g,"<br />") + '</div>' +
								'</div>' +
								'</div>' +
								'</div>'

							$(".chat_body_list").append(oStr);
						}
						$(".chat_body.clearfix").getNiceScroll().hide().show().resize();
						$(".chat_body.clearfix").getNiceScroll(0).doScrollTop($(".chat_body_list").height(), 100)

					} else {
						if(firstFlag) {
							firstFlag = 0;
							var ostr = '<div class="list_item clearfix active" data-id="' + professorId + '">' +
								'<i class="close_icon"></i>' +
								'<div class="avatar fl">' +
								'<img src="images/default-photo.jpg">' +
								'<span class="tips_num" style="display:none;"></span>' +
								'</div>' +
								'<div class="list_item_info fl">' +
								'<div class="user_infos">' +
								'<span class="user_name"> </span><em class="authiconNew"></em>' +
								'</div>' +
								'<span class="time"></span><span class="last_news"></span>' +
								'</div>' +
								'</div>'
							var $str = $(ostr);
							$(".list_body").prepend($str);
							personMess(professorId, $str.find('img'), $str.find(".user_name"), $str.find(".authiconNew"));
							$(".chat_content_nodata").hide();
							$(".chat_content").show();
							myMessageList();
						}
					}			
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	/*关于我的消息列表*/
	function myMessageList(pageNum) {
		$.ajax({
			"url": "/ajax/webMsg/idx/qm",
			"type": "get",
			"async": true,
			"data": {
				id: userid,
				/*pageSize: 1,
				pageNo: pageNum*/
			},
			"success": function(data) {
				if(data.success) {
					var $data = data.data;
					/*if(pageNum != data.data.pageNo) {
						pa = false;
						return;
					}*/
					if($data.length) {
						fillHtml($data);
					} else {
						return;
					}
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	/*填充页面*/
	function fillHtml($data) {
		for(var i in $data) {
			var num = "none"
			if($data[i].num) {
				num = "block";
			}
			var ostr = '<div class="list_item clearfix" data-id="' + $data[i].id + '">' +
				'<i class="close_icon"></i>' +
				'<div class="avatar fl">' +
				'<img src="images/default-photo.jpg">' +
				'<span class="tips_num" style="display:' + num + '">' + $data[i].num + '</span>' +
				'</div>' +
				'<div class="list_item_info fl">' +
				'<div class="user_infos">' +
				'<span class="user_name"> </span><em class="authiconNew"></em>' +
				'</div>' +
				'<span class="time">' + commenTime($data[i].timeStr) + '</span><span class="last_news">' + ($data[i].cnt).replace(/\n/g,"<br />") + '</span>' +
				'</div>' +
				'</div>'
			var $str = $(ostr);
			if(professorId) {
				if(professorId == $data[i].id) {
					
				} else {
					$(".list_body").append($str);
				}

			} else {
				$(".list_body").append($str);
			}
		
			personMess($data[i].id, $str.find('img'), $str.find(".user_name"), $str.find(".authiconNew"));
		}
		$(".list_body").getNiceScroll().hide().show().resize();
		websocrket();
	}
	//专家信息
	function personMess(id, pImg, pName, pTitle) {
		$.ajax({
			"url": "/ajax/professor/baseInfo/" + id,
			"type": "GET",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					console.log(data);
					var $data = data.data;
					var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
					pTitle.attr("title", userType.title).addClass(userType.sty);
					pName.text($data.name);
					if($data.hasHeadImage) {
						pImg.attr("src", "/images/head/" + $data.id + "_l.jpg");
					}
					var str = '';
					if($data.title) {
						if($data.orgName) {
							if($data.office) {
								str = $data.title + " " + $data.orgName + "，" + $data.office;
							} else {
								str = $data.title + " " + $data.orgName;
							}
						} else {
							if($data.office) {
								str = $data.title + " " + $data.office;
							} else {
								str = $data.title;
							}
						}
					} else {
						if($data.orgName) {
							if($data.office) {
								str = $data.orgName + "，" + $data.office;
							} else {
								str = $data.orgName;
							}
						} else {
							if($data.office) {
								str = $data.office;
							}
						}
					}
					var oMess = {
						"name": $data.name,
						"idf": userType,
						"id": $data.id,
						"duties": str
					}
					pImg.parents(".list_item").attr("data", JSON.stringify(oMess))
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	/*个人信息*/
	function persons(id) {
		$.ajax({
			"url": "/ajax/professor/baseInfo/" + id,
			"type": "GET",
			"traditional": true,
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					console.log(data);
					var $data = data.data;
					var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
					$(".usepro").find('.authiconNew').attr("title", userType.title).addClass(userType.sty);
					$(".usepro").find('.user_name').text($data.name);
					$("#cUserPage").attr("href", "userInforShow.html?professorId=" + $data.id)
					var str = '';
					if($data.title) {
						if($data.orgName) {
							if($data.office) {
								str = $data.title + " " + $data.orgName + "," + $data.office;
							} else {
								str = $data.title + " " + $data.orgName;
							}
						} else {
							if($data.office) {
								str = $data.title + " " + $data.office;
							} else {
								str = $data.title;
							}
						}
					} else {
						if($data.orgName) {
							if($data.office) {
								str = $data.orgName + "," + $data.office;
							} else {
								str = $data.orgName;
							}
						} else {
							if($data.office) {
								str = $data.office;
							}
						}
					}
					$('.chating_resume_status').text(str);

				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	/*发送信息*/
	function sendMessage() {
		$.ajax({
			"url": "/ajax/webMsg",
			"type": "POST",
			"traditional": true,
			"data": {
				sender: userid,
				reciver: professorId,
				cnt: $(".messContent").val()
			},
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					console.log(data);
					$(".btnModel").attr("disabled", "disabled");
					var time1 = $(".chat_body_list").find(".time").last().attr("data-createtime");
					if(time1) {
						var str1 = '<span class="time" data-createtime="' + data.data + '" style="">' + compareTime(time1, data.data) + '</span>'
					} else {
						var str1 = '<span class="time" data-createtime="' + data.data + '" style="">' + anTime(data.data) + '</span>'
					}

					var oStr = '<div class="chat_item me">' +
						'<div class="clearfix">' +
						'<div class="item_avatar fl">' +
						'<a href="#" ><img src="/images/head/' + userid + '_l.jpg"></a>' +
						'</div>' +
						'<div class="item_content fr">' +
						'<em class="is_readed"></em>' +
						'<div class="bubble message B_end">' + $(".messContent").val().replace(/\n/g,"<br />") + '</div>' +
						'</div>' +
						'</div>' +
						'</div>'
					$(".chat_body_list").append(str1 + oStr);

					$(".chat_body.clearfix").getNiceScroll().hide().show().resize();
					$(".chat_body.clearfix").getNiceScroll(0).doScrollTop($(".chat_body_list").height(), 100)
					for(var i = 0; i < $(".list_body").find('.list_item').length; i++) {
						if($(".list_body").find('.list_item .user_name').eq(i).text() == $(".usepro .user_name").text()) {
							$(".list_body").find('.list_item .last_news').eq(i).text($(".messContent").val());
							$(".list_body").find('.list_item .time').eq(i).text(commenTime(data.data));
							if(i != 0) {
								$(".list_body").find('.list_item').eq(i).remove().clone().prependTo($(".list_body"))
							}
						}
					}
					$(".messContent").val("");
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	$(".btnModel").click(function() {
		sendMessage();
	})
	$(".messContent").on("input", function() {
		if($.trim($(this).val()) == "") {
			$('.btnModel').attr("disabled", "disabled");
		} else {
			$('.btnModel').removeAttr("disabled");
		}
	})
	function ci(e) {
			var elem = e.target;
			if(elem.tagName.toLowerCase() === 'img') {
				var $this = $(elem);
					$this.attr("src", "/images/default-photo.jpg");
				
			}
		}
	document.addEventListener("error", ci, true /*指定事件处理函数在捕获阶段执行*/ );
	getTotalMessage()
	function getTotalMessage() {
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
	/*切换*/
	$(".list_body").on("click", ".list_item", function() {
		$(this).addClass("active").siblings().removeClass("active");
		if($(this).find(".tips_num").css("display")=="block") {
			$('.mymessage .badge').text(Number($('.mymessage .badge').text())-Number($(this).find(".tips_num").text()));
			if($('.mymessage .badge').text()==0) {
				$(".mymessage .badge").text("");
			}
		}
		$(this).find(".tips_num").text(0).hide();
		if($(".usepro .user_name").css("display")=="block") {
			if($(this).find(".user_name").text() == $(".usepro .user_name").text()) {
				return;
			}
		}
		$(".chat_content_nodata").hide();
		$(".chat_content").show();
		var pro = JSON.parse($(this).attr("data"));
		$("#cUserPage").attr("href", "userInforShow.html?professorId=" + pro.id)
		$(".usepro").find(".user_name").text(pro.name).siblings(".authiconNew").addClass(pro.idf.sty).attr("title", pro.idf.title).parent().siblings(".chating_resume_status").text(pro.duties);
		professorId = pro.id;
		if(Number($(this).find(".tips_num").text())) {
			angleMessageList(pro.id, true);
		} else {
			angleMessageList(pro.id);
		}
		getTotalMessage()
	});
	/*让消息置为已读*/
	function setRead(opid, time) {
		$.ajax({
			"url": "/ajax/webMsg/readed",
			"type": "POST",
			"traditional": true,
			"data": {
				sender: opid,
				reciver: userid,
				time: time
			},
			"dataType": "json",
			"success": function(data) {
				if(data.success) {

				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	/*超过时间10min*/
	function timeC(startTime) {
		var startdate = new Date();
		startdate.setFullYear(parseInt(startTime.substring(0, 4)));
		startdate.setMonth(parseInt(startTime.substring(4, 6)) - 1);
		startdate.setDate(parseInt(startTime.substring(6, 8)));
		startdate.setHours(parseInt(startTime.substring(8, 10)));
		startdate.setMinutes(parseInt(startTime.substring(10, 12)));
		startdate.setSeconds(parseInt(startTime.substring(12, 14)));
		startdate.setMilliseconds(parseInt(startTime.substring(14, 17)));
		return startdate.getTime();
	}

	function compareTime(startTime, secondTime) {
		var date3 = timeC(secondTime) - timeC(startTime); //时间差的毫秒数
		if(date3 >= 600000) {
			if(new Date().getFullYear() == secondTime.substring(0, 4)) {

				return secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
			} else {

				return secondTime.substring(0, 4) + "年" + secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
			}
		} else {
			return '';
		}
	}

	function anTime(secondTime) {
		if(new Date().getFullYear() == secondTime.substring(0, 4)) {

			return secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
		} else {

			return secondTime.substring(0, 4) + "年" + secondTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + secondTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + secondTime.substring(8, 10) + ":" + secondTime.substring(10, 12);
		}
	}

	/*滚动加载
	$('.list_body').scroll(function() {
		var $me = $(this);
		var scrollTop = $me.scrollTop();
		var height = $me.height();
		var scrollHeight = $me.prop('scrollHeight');
		/*console.log(scrollTop)
		console.log(height)
		console.log(scrollHeight)*/
	/*if(scrollHeight - scrollTop - height < 1) {

			if(pa) {
				pageNo++;
				myMessageList(pageNo)
			}

		}
	});*/
	/*删除会话*/
	var $that;
	$(".list_body").on("click", ".close_icon", function() {
		$that = $(this)
		$.MsgBox.Confirm("提示", "确定删除？", deleChat);
		return false;
	})
	/*会话删除函数*/
	function deleChat() {
		$.ajax({
			"url": "/ajax/webMsg/disable/show",
			"type": "POST",
			"traditional": true,
			"data": {
				owner: userid,
				actor: $that.parents(".list_item").attr('data-id')
			},
			"context": $that.parents(".list_item"),
			"dataType": "json",
			"success": function(data) {
				if(data.success) {
					$(this).remove();
					$(".chat_content_nodata").show();
					$(".chat_content").hide();
					unReadedCount(userid);
				}
			},
			"error": function() {
				$.MsgBox.Alert('提示', '服务器连接超时');
			}
		});
	}
	$("#repo").click(function() {
		$("#report").toggle();
	})
	$("#report").on("click",function(){
		$(".cBacktit>span").text("举报")
		$(".correctCon")[0].placeholder="请具体说明举报对方的原因，以便我们为您快速解决";
		$("#correctBlock").fadeToggle();
		$(this).hide();
	})
	/*纠错反馈*/
	$(".correctSubmit").on("click",function(){
		var cntCon=$(this).siblings(".correctCon").val();
		if(cntCon.length>500){
			$.MsgBox.Alert('提示', '举报内容不得超过500个字');
			return;
		}else{
			$.ajax({
				"url": "/ajax/feedback/error/professor",
				"type": "POST",
				"dataType": "json",
				"async": true,
				"data": {
					"id": professorId,
					"cnt":cntCon,
					"user":userid
				},
				"success": function(data) {
					if(data.success) {
						backSuccessed();
						$("#mb_msgcontent").text("很抱歉为您带来不好的体验我们会为您尽快解决");
					}
				},
				"error": function() {
					$.MsgBox.Alert('提示', '链接服务器超时')
				}
			});
		}
	})
})
