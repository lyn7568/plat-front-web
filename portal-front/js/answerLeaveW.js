(function(window) {
	function ajaxRequist(url, obj, type, fn) {
		$.ajax({
			url:url,
			data: obj,
			dataType: 'json', //服务器返回json格式数据
			type: type, //支持'GET'和'POST'
			traditional: true,
			success: function(data) {
				if(data.success) {
					fn(data.data)
				}
			},
			error: function(xhr, type, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败');
			}
		});
	}
	var LeaveWord = function() {
		var self = this;
		self.addHtml();
		self.bindEvent();
		
	}

	function lgin() {
		if($.cookie('userid') !="null") {
			return true;
		}
		quickLog();
		operatTab();
		closeLog();
		return false;
	}
	LeaveWord.prototype.addHtml=function() {
		$("body").append('<textarea class="txtArea" id="tt" style="position:absolute;top:0;left:-999px;"></textarea>')
	}
	LeaveWord.prototype.init = function(selecter,obj) {
		obj.rows=5;
		var self = this;
		ajaxRequist("/ajax/leavemsg/subject",obj, "GET", function(data) {
			if(!obj.id) {
				var strer='<div class="ifLogin">' +
					    '<form class="ifLoginOn clearfix">' +
					    	'<div class="msgContbox">' +
					    		'<textarea class="msgCont" placeholder="请输入您的留言内容..."  maxlength="200"></textarea>' +
					    		'<span class="msgconNum"><em>0</em>/200</span>'+
					    	'</div>'+
					    	'<input type="button" class="frmconbtn btnModel floatR" disabled="" value="留言">' +
					    '</form>' +
				'</div>' +
				'<div class="form-item commentsArea">'+
					'<ul class="commentList">' +
					'</ul><div class="con-kong displayNone">暂无留言</div>' +
					'<button class="js-load-more displayNone"></button>' +
				'</div>'
				var $strer=$(strer);
				selecter.append($strer);
				
				if(data.length==0) {
					$strer.find(".con-kong").removeClass("displayNone");
				}
				$strer.find("input").data("ouse",obj);
				if(data.length>4){
					$strer.find(".js-load-more").removeClass("displayNone").data("obj",{
						sid:obj.sid,
						sType:4,
						time:data[data.length-1].createTime,
						id:data[data.length-1].id
					})
				}else{
					$strer.find(".js-load-more").addClass("displayNone")
				}
			}else{
				if(data.length>4){
					$strer.find(".js-load-more").removeClass("displayNone").data("obj",{
						sid:obj.sid,
						sType:4,
						time:data[data.length-1].createTime,
						id:data[data.length-1].id
					})
				}else{
					selecter.siblings(".js-load-more").addClass("displayNone")
				}
			}
			if(data.length == 0) {
				return;
			}
			if(selecter[0].className!="commentList") {
				self.topHtml($strer.find("ul"),data);
			}else{
				self.topHtml(selecter,data);
			}
			
		})
	}
	LeaveWord.prototype.topHtml=function(selector,data) {
		var id = $.cookie('userid');
		var self = this;
		for(var i = 0; i < data.length; i++) {
				var reply="";
				if(data[i].reciver) {
					reply = '<span class="huifu">回复 </span><a href="userInforShow.html?professorId='+data[i].reciver+'" class="userhref"><span class="h2Font messageName">张某某</span><em class="authiconNew" title="科袖认证专家"></em></a>'
				}
				var itemlist = '<li class="li-item">';
				itemlist += '<a href class="userhref"> <div class="madiaHead useHead useHeadMsg"></div></a>';
				itemlist += '<div class="madiaInfo">';
				itemlist += '<p><a href="userInforShow.html?professorId='+data[i].sender+'" class="userhref"><span class="h2Font messageName">张某某</span></a><em class="authiconNew" title="科袖认证专家"></em>'+reply+'<span class="commenttime" style="float:right;">'+commenTime(data[i].createTime)+'</span></p>';
				itemlist += '<p class="h2Font messageContent">'+data[i].cnt+'</p>';
				itemlist += '<div class="operateSpan">'
				itemlist += '<span class="dzthumb dzthumbCan"><em class="hold-icon icon-zan"></em><em class="agreeCount" style="margin-left: 6px;">'+data[i].agreeCount+'</em></span>'
				itemlist += '<span class="callBack">回复</span>'
				itemlist += '<span class="messageDel displayNone">删除</span></div>';
				itemlist += '<div class="displayNone replyLeword"><textarea class="txtArea"></textarea><p class="pTxt"><span class="qCancel">取消</span><button class="hReply btnModel" disabled>回复</button></p></div></div></li>';
				$itemlist = $(itemlist);
				selector.append($itemlist); 
				$itemlist.attr('data-obj',JSON.stringify(data[i]));
				if(id == data[i].sender) {
					$itemlist.find(".dzthumb").removeClass("dzthumbCan");
					$itemlist.find(".messageDel").removeClass("displayNone").end().find(".callBack").hide();
				}
				if(data[i].reciver) {
					self.userInfo(data[i].sender, $itemlist, 0);
					self.userInfo(data[i].reciver, $itemlist, 1)
				} else {
					self.userInfo(data[i].sender, $itemlist, 0);
				}
				if(data[i].agreeCount)
					self.referThup(data[i].id, $itemlist);
			}
	}
	LeaveWord.prototype.userInfo = function(uId, li, parNum) {
		ajaxRequist("/ajax/professor/editBaseInfo/" + uId, {}, "GET", function($data) {
			if(parNum == 0) {  
				if($data.hasHeadImage == 1) {
					li.find(".useHead")[0].style.backgroundImage = "url(../images/head/" + $data.id + "_l.jpg" + ")";
				}
				li.find("textarea").attr("placeholder","回复  "+$data.name+"：")
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			li.find(".messageName").eq(parNum).html($data.name).end().end().find(".authiconNew").eq(parNum).addClass(userType.sty).attr("title",userType.title);
		})
	}
	LeaveWord.prototype.size = function() {
		if(this.val().length > 200) {
			$.MsgBox.Alert('提示', '留言不得超过200个字');
			return false;
		}
		return true;
	}
	LeaveWord.prototype.topLw = function($this) {
		var self = this;
		if(!self.size.call($($this).siblings(".msgContbox").find("textarea")) ){
			return;
		}
        $.ajax({
            url:"/ajax/leavemsg",
            data: {
                cnt: $($this).siblings(".msgContbox").find("textarea").val(),
                refId: $($this).data("ouse").sid,
                refType: $($this).data("ouse").stype,
                sender: $.cookie('userid'),
                uname: $.cookie('userName')
            },
            dataType: 'json',
            type: "POST",
            beforeSend: function() {
            	$(".list-hold-list .ifLoginOn input").attr("disabled","true");
            },
            traditional: true,
            success: function (data) {
                if (data.success) {
                    $($this).siblings(".msgContbox").find("textarea").val("").siblings(".msgconNum").find("em").text(0);
                    ajaxRequist("/ajax/leavemsg/qo", {id: data.data}, "GET", function (data) {
                        self.topHtml($($this).parents(".ifLogin").siblings(".commentsArea").find("ul"), [data])
                    })
                }
            }
        });
	}
	LeaveWord.prototype.autoGrow=function(){
		document.getElementById("tt").style.width=this.scrollWidth+"px";
		document.getElementById("tt").value=this.value;
		this.style.height=this.scrollHeight+"px";
	}
	LeaveWord.prototype.bindEvent = function() {
		var self = this;
		$(".list-hold-list").on('click',".ifLogin input",function() {
			if(!lgin()) {
				return;
			}
			self.topLw(this);
			self.LwordTotal($(this),$(this).data("ouse"));
		});
		$(".list-hold-list").on("click", ".commentList li", function(e) {
			if(!lgin()) {
				return;
			}
			var obj=JSON.parse($(this).attr("data-obj")),
			target=e.target;
			switch (target.className){
				case "dzthumb dzthumbCan":self.thub.call(target, obj.id,obj.agreeCount);
					break;
				case "callBack":self.LwordBack(target, obj);
					break;
				case "messageDel":self.LwordDel(target, obj);
					break;
				case "hReply btnModel":self.replyLword(target,obj)
					break;
				case "qCancel": $(target).parent().siblings("textarea").val("").parents(".replyLeword").addClass("displayNone").siblings(".operateSpan").removeClass("displayNone");
								$(target).parent().siblings("textarea").css("height",'38px');
					break;
			}
		});
		$(".list-hold-list").on("click", ".answerWord .js-load-more", function(e) {
				var $obj=$(this).data('obj');
				self.init($(this).siblings("ul"),{sid: $obj.sid,stype: $obj.sType,time: $obj.time,id: $obj.id});
		})
		$(".list-hold-list").on("input",".ifLogin textarea",function(){
			if($.trim($(this).val()).length>0) {
					$(this).siblings(".msgconNum").find("em").text($(this).val().length).parents(".msgContbox").siblings("input").removeAttr("disabled");
				}else{
					$(this).parents(".msgContbox").siblings("input").attr("disabled","true");
				}
		})
		$(".list-hold-list").on("input", ".commentList textarea", function(e) {
				if($.trim($(this).val()).length>0) {
					$(this).siblings().find(".btnModel").removeAttr("disabled");
					self.autoGrow.call(this);
				}else{
					$(this).siblings().find(".btnModel").attr("disabled","true");
				}
		})
		
		
	}
	LeaveWord.prototype.referThup = function(lid, li, num) {
		ajaxRequist("/ajax/leavemsg/agree", { 
			id: lid,
			uid: $.cookie('userid')
		}, "GET", function(data) {
			if(data) {
				li.find(".dzthumbCan").addClass("dzthumbed");
			}
		})
	}
	LeaveWord.prototype.thub = function(lid,num) {
		var self = this;
		ajaxRequist("/ajax/leavemsg/agree", {
			id: lid,
			uid: $.cookie('userid'),
			uname: $.cookie('userName')
		}, "POST", function(data) {
			$(self).addClass('dzthumbed').find(".agreeCount").html(num+1)
		})
	}
	LeaveWord.prototype.replyLword = function( $th,lid) {
		var self = this;
		if(!self.size.call($($th).parents(".pTxt").siblings("textarea")) ){
			return;
		}
		ajaxRequist("/ajax/leavemsg/reply", {
			cnt: $($th).parents(".pTxt").siblings("textarea").val(),
			id: lid.id,
			uid: $.cookie('userid'),
			uname: $.cookie('userName')
		}, "POST", function(data) {
			$($th).parents(".pTxt").siblings("textarea").val("").parents(".replyLeword").addClass("displayNone").siblings(".operateSpan").removeClass("displayNone")
			ajaxRequist("/ajax/leavemsg/qo", {id:data},"GET",function(data) {
				self.topHtml($($th).parents(".commentList"),[data])
			})
			self.LwordTotal($($th),{sid:lid.refId,stype:lid.refType});
		})
	}
	LeaveWord.prototype.LwordDel = function($this, lid) {
		var self = this;
		ajaxRequist("/ajax/leavemsg/del", {
			id: lid.id
		}, "GET", function(data) {
			self.LwordTotal($($this).parents(".commentList"),{sid:lid.refId,stype:lid.refType});
			$($this).parents(".li-item").remove();
		})
		
	}
	LeaveWord.prototype.LwordBack = function($this, lid) {
		$(".replyLeword").each(function(item){
			$(".replyLeword").eq(item).addClass("displayNone").siblings(".operateSpan").removeClass("displayNone");
		})
		$($this).parents(".operateSpan").addClass("displayNone").siblings(".replyLeword").removeClass("displayNone")
	}
	LeaveWord.prototype.LwordTotal = function($th,lid) {
		var self = this;
		ajaxRequist("/ajax/leavemsg/count", {
			sid: lid.sid,
			stype: lid.stype
		}, "get", function($data) {
			$th.parents(".list-qa").find(".leaveMsgCount").text($data);
			$th.parents(".list-qa").find(".con-kong").addClass("displayNone");
			if($data==0) {
				$th.parents(".list-qa").find(".con-kong").removeClass("displayNone");
			}
		})
	}

	var module = {
		lWord: new LeaveWord()
	}
	window.module = module;
})(window)		