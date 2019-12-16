$(function() {
	loginStatus();//判断个人是否登录
	$("#feedback").hide();
	var userid = $.cookie("userid"),
		username = $.cookie("userName")
	var questionId = GetQueryString("id"),
	    topAnswerId = GetQueryString("topid");
	var hurl = window.location.host,
		weibourl = window.location.href
		weibopic = "http://" + hurl + "/images/logo180.png",
		weibotitle = "";
	var oanswer = document.getElementsByClassName("go-answer")[0];
	
	//分享关注按钮
	$('.shareWeixin').hover(function(){$(this).find('.shareCode').stop(true,false).fadeToggle();});
	//微信分享
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width : 100,
		height : 100
	});
	function makeCode(){
		var elurl = "http://" + hurl + "/e/wen.html?id=" + questionId ; 
		qrcode.makeCode(elurl);
	}
	makeCode();
	
	module.lWord;
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
		if(topAnswerId){
			location.href="http://" + hurl + "/e/da.html?id="+topAnswerId;
		}else{
			location.href="http://" + hurl + "/e/wen.html?id="+questionId;
		}
	}
	var rows = 10,
		dataO = {
			time: "",
			id: "",
			score:"",
			agree:""
		};
	var	rowsR = 10,
		dataC = {
			count: "",
			pid: "",
			proSortFirst:"",
			proStarLevel: "",
			proId: ""
		}
	var dataT={
			id: "",
			score:"",
			agree:""
		}
	var oAjax = function(url, dataS, otype, oFun,beforeFun,completeFun) {
			$.ajax({
				url:url,
				dataType: 'json',
				type: otype,
				data: dataS,
				traditional: true,
				beforeSend: beforeFun,
				success: function(res) {
					if(res.success) {
						oFun(res)
					}
				},
				complete:completeFun
	            
			});
		},	
		waitingA=function(){
			oAjax("/ajax/question", {
				"rows": rows
			},"get", function(res){
				var $info = res.data;
				if($info.length>0){
					$("#waitingA").parents(".conItem").removeClass("displayNone")
					var oLeng=$info.length<5?$info.length:5;
					for(var i = 0; i < oLeng; i++) {
						var itemlist = '<li class="flexCenter"><a class="urlgo" target="_blank" href="qa-show.html?id='+$info[i].id+'">';
							itemlist += '<p class="h2Font ellipsisSty-2"><em class="circlePre"></em>'+$info[i].title+'</p>';
							itemlist += '</a></li>';
							$itemlist = $(itemlist);
						$("#waitingA").append($itemlist);
					}
				}
				
			})
		},
		getConmain = function() {
			oAjax('/ajax/question/qo', {
				"id": questionId
			}, "get", function(res) {
				var $da = res.data
				weibotitle = $da.title;
				document.getElementById("questionId").setAttribute("data-id", $da.id);
				document.getElementById("questionTit").innerHTML = $da.title;
				document.getElementById("pageview").innerHTML = $da.pageViews;
				document.getElementById("replyCount").innerHTML = $da.replyCount;
				if($da.cnt) {
					document.getElementById("questionCnt").innerHTML =($da.cnt).replace(/\n/g,"<br />");
				}
				attendCount();
				if($da.keys != undefined && $da.keys.length != 0) {
					var subs=strToAry($da.keys)
					var pstr = ""
					if(subs.length > 0) {
						for(var i = 0; i < subs.length; i++) {
							pstr += '<li><span class="h2Font">' + subs[i] + '</span></li>'
						};
						document.getElementsByClassName("tagList")[0].innerHTML = pstr;
					} else {
						document.getElementsByClassName("tagList")[0].style.display = "none";
					}
				}
				
				if($da.img) {
					var subs=strToAry($da.img)
					weibopic="http://" + hurl + "/data/question"+subs[0].replace(/\.(jpg|jpeg|png)$/,"_s.jpg")
					var pstr = ""
					if(subs.length > 0) {
						for(var i = 0; i < subs.length; i++) {
							var imgu= "/data/question"+subs[i]
							pstr += '<li><span class="imgspan" style="background-image: url('+imgu+');"><img src="'+imgu+'" data-preview-src="" /></span></li>'
						};
						document.getElementsByClassName("list_image")[0].style.display = "block";
						document.getElementsByClassName("list_image")[0].innerHTML = pstr;
					} 
					$('.list_image img').zoomify();
				}
				$("#weibo").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+encodeURIComponent(weibotitle)+"&url="+encodeURIComponent(weibourl)+"&pic="+encodeURIComponent(weibopic)+"&content=utf-8"+"&ralateUid=6242830109&searchPic=false&style=simple");
			})
		},
		attendCount=function() {
			oAjax("/ajax/watch/countProfessor", {
				id:questionId,
				type:"8"
			}, "get", function(data) {
				if(data.success) {
					if(data.data > 0) {
						document.getElementById("attenCountQ").innerHTML =data.data;
					}else{
						document.getElementById("attenCountQ").innerHTML ="";
					}
				}
			})
		},
		anExist = function() {
			oAjax("/ajax/question/answer", {
				"qid": questionId,
				"uid": userid,
			}, "get", function(res) {
				if(res.data) {
					if(res.data.state=="1"){
						oanswer.setAttribute("data-can", "0"); //回答过
						oanswer.classList.add("answered");
						oanswer.innerText = "我已回答"
					}else{
						oanswer.setAttribute("data-anid",res.data.id);
						oanswer.setAttribute("data-can", "2"); //回答过但已删除
						oanswer.classList.add("answerDel");
						oanswer.innerText = "撤销删除"
					}
				} else {
					oanswer.setAttribute("data-can", "1");
				}
			})
		},
		answerList = function(isbind) {
			wlog("question",questionId,"1");
			var byway = document.querySelector('.list-hold-count>ul').querySelector("li.active").getAttribute("data-type");
			var typeurl,dataStr={};
			if(byway == 1) {
				typeurl = "/ajax/question/answer/qes/byScore"
				dataStr={
					"qid": questionId,
					"score": dataO.score,
					"agree":dataO.agree,
					"id": dataO.id,
					"rows": rows
				}
			} else if(byway == 2) {
				typeurl = "/ajax/question/answer/qes/byTime"
				dataStr={
					"qid": questionId,
					"time": dataO.time,
					"id": dataO.id,
					"rows": rows
				}
			}
			oAjax(typeurl,dataStr, "get", function(res){
				var aimId="curAnswers",newStr="还没有人回答该问题，<span class='nowAn'>点击这里马上抢答</span>"
				var $info = res.data;
				if($info.length > 0) {
					if(byway == 1) {
						dataO.score = $info[$info.length - 1].score;
						dataO.agree = $info[$info.length - 1].agree;
						dataO.id = $info[$info.length - 1].id;
					}else if(byway == 2) {
						dataO.time = $info[$info.length - 1].createTime;
						dataO.id = $info[$info.length - 1].id;
					}
			
					for(var i = 0; i < $info.length; i++) {
						var liStr = document.createElement("li");
						document.getElementById(aimId).appendChild(liStr);
						answerModule($info[i], liStr);
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeAfter(aimId);
                if($info.length == 0 && liLen == 0 ){
                    insertAfter(newStr,aimId);
                }
                if(isbind){
                	$("#curAnswers").parent().find(".js-load-more").on("click",function(){
					 	answerList(false)
					})
                }
				if ($info.length < rows) {
                    $("#curAnswers").parent().find(".js-load-more").unbind("click");
                    $("#curAnswers").parent().find(".js-load-more").hide();
                }
				//点击马上抢答
				 $("#curAnswers").parent().find(".nowAn").on('click', function() {
					if(userid && userid != null && userid != "null") {
						if($(".answerQu").is(':hidden')){
							goAnswerFn($(".answerQu"))
						}
					}else{
						quickLog();
						operatTab();
						closeLog();
					}
				});
			},function(){
				$("#curAnswers").parent().find(".js-load-more").attr("disabled",true);
	       		$("#curAnswers").parent().find(".js-load-more").addClass("active");
			},function(){
				$("#curAnswers").parent().find(".js-load-more").removeAttr("disabled");
	        	$("#curAnswers").parent().find(".js-load-more").removeClass("active");
			})
		},
		answerTop=function(answerId){
			wlog("answer",answerId,"1");
			oAjax('/ajax/question/answer', {
				"id": answerId
			}, "get", function(res) {
				var $da = res.data
				var liStr = document.createElement("li");
				document.getElementById("topAnshow").appendChild(liStr);
				answerModule($da, liStr);
			})
		},
		answerThisShow=function(){
			
			var typeurl = "/ajax/question/answer/qes/byScore",
				dataStr={
					"qid": questionId,
					"score": dataT.score,
					"id": dataT.id,
					"agree":dataT.agree,
					"rows": rows
				}
			oAjax(typeurl,dataStr, "get", function(res){
				console.log(res)
				var $info = res.data;
				if($info.length > 0) {
					if($info.length>1){
						$(".otherAn").removeClass("displayNone")
					}
					dataT.score = $info[$info.length - 1].score;
					dataT.agree = $info[$info.length - 1].agree;
					dataT.id = $info[$info.length - 1].id;
					for(var i = 0; i < $info.length; i++) {
						if($info[i].id==topAnswerId){
							
						}else{
							var liStr = document.createElement("li");
							document.getElementById("otherAnshow").appendChild(liStr);
							answerModule($info[i], liStr);
						}
					}
				}
                $("#otherAnshow").parent().find(".js-load-more").on("click",function(){
				 	answerThisShow()
				})
				if ($info.length < rows) {
                    $("#otherAnshow").parent().find(".js-load-more").unbind("click");
                    $("#otherAnshow").parent().find(".js-load-more").hide();
                }
				
			},function(){
				$("#otherAnshow").parent().find(".js-load-more").attr("disabled",true);
	       		$("#otherAnshow").parent().find(".js-load-more").addClass("active");
			},function(){
				$("#otherAnshow").parent().find(".js-load-more").removeAttr("disabled");
	        	$("#otherAnshow").parent().find(".js-load-more").removeClass("active");
			})
		},
		insertAfter = function (newStr, targetE) {
            var parent = document.getElementById(targetE).parentNode;
            var kong = document.createElement("div");
            kong.className = "con-kong";
            kong.innerHTML = newStr;
            if (parent.firstChild.className == "con-kong") {
                return
            } else {
                parent.insertBefore(kong,parent.firstChild);
            }

        },
        removeAfter = function (targetE) {
            var parent = document.getElementById(targetE).parentNode;
            if (parent.firstChild.className == "con-kong") {
                parent.removeChild(parent.firstChild);
            } else {
                return
            }
        },
		answerModule = function(dataStr, liStr) {
			var time="发布于 "+commenTime(dataStr.createTime)
			if(dataStr.modifyTime > dataStr.createTime){
				time="修改于 "+commenTime(dataStr.modifyTime)
			}
			var opertStr='<span class="jubao">举报</span>'
			var zancai='<div class="zan canZan"><em class="hold-icon icon-zan"></em><span class="agreeCount"></span></div>'+
						'<div class="cai canCai"><em class="hold-icon icon-cai"></em></div>'
			if(dataStr.uid==userid){
				opertStr='<span class="xiugai">修改</span><span class="shanchu">删除</span>'
				zancai='<div class="zan noZan"><em class="hold-icon icon-zan"></em><span class="agreeCount"></span></div>'+
						'<div class="cai noCai"><em class="hold-icon icon-cai"></em></div>'
			}
			liStr.className="list-qa"
			liStr.setAttribute("data-id", dataStr.id);
			var operatStr='<div class="list_hander clearfix" data-type="2">'+
					'<div class="holdSpan floatL">'+zancai+
					'</div>'+
					'<div class="operateBlock bottomShow floatL">'+
	            		'<ul class="clearfix">'+
	            			'<li><span>留言 </span><span class="leaveMsgCount2"></span><em class="operateicon operateicon2 icon-leavemsg leaveWo"></em></li>'+
	            			'<li class="attention"><span>收藏</span><em class="operateicon operateicon2 icon-collect collectBtn"></em></li>'+
							'<li>'+
								'<span>分享到</span>'+
								'<a class="weiboA" href="" target="_blank"><em class="operateicon operateicon2 icon-sina"></em></a>'+
								'<em class="operateicon operateicon2 icon-wechat shareWeixin">'+
									'<div class="shareCode clearfix">'+
										'<div class="floatL qrcodeQA"></div>'+
										'<div class="shareWord floatR">'+
											'<p>打开微信“扫一扫”，<br/>打开网页后点击屏幕右上角“分享”按钮</p>'+
										'</div>'+
									'</div>'+
								'</em>'+
							'</li>'+
	            		'</ul>'+
	            	'</div>'+
	            	'<div class="operateBlock tip-offs floatR">'+opertStr+'</div>'+
				'</div>'
			
			liStr.innerHTML = '<div class="madiaInfo answerInfo">' +
				'<div class="flexCenter qa-owner"></div>' +
				'<div class="qa-con">' + dataStr.cnt + '</div>' +
				'<div class="item_info"><span class="time">' + time + '</span></div>'+
				operatStr+
				'</div>'+
				'<div class="answerUpdate"></div>'+
				'<div class="answerWord"></div>'
				
			var $str = $(liStr)
			proinfo(dataStr.uid, $str);
			leaveMsgCount(dataStr.id,4, $str);
			answerAgreeNum(dataStr.id, $str);
			if(userid && userid != null && userid != "null") {
				isAgree(dataStr.id, $str)
				ifcollectionAbout(dataStr.id,$str.find(".collectBtn"),9);
			}
			answerBindE(dataStr.id, $str)
		},
		goAnswerFn=function(objN,anid,text,aflag){
			var dataStr={},typeUrl="",tip="";
			var str='<div class="madiaInfo"><div class="flexCenter qa-owner"></div></div>'+
					'<script id="editor" name="content" type="text/plain" style="height:240px"></script>'+
					'<div class="buttonbox">'+
						'<button type="button" class="frmcontype btnModel fontLink">取消</button>'+
						'<button type="button" class="frmcontype btnModel saveGo">保存</button>'+
					'</div>'
			objN.html(str);
			var ue = UE.getEditor('editor', {//初始引用编辑器
			    toolbars: [
			        [ 'undo', 'redo', '|','spechars', '|', 'simpleupload','link']
			    ],
			    autoHeightEnabled: true,
			    autoFloatEnabled: true
			});
			proinfo(userid,objN);
			
			if(aflag){
				objN.show();
				ue.ready(function() {
			        ue.setContent(text);
			    });
				objN.parents(".list-qa").find(".answerInfo").hide()
			}else{
				objN.slideDown(300);
			}
			objN.find(".buttonbox").on("click",".saveGo",function(){
				var conV=ue.getContent();
				if(conV.length<10) {
					$.MsgBox.Alert("提示", "回答不得少于10个字");
					return;
				}
				if(aflag){
					typeUrl='/ajax/question/answer/modify'
					dataStr={
						"id": anid,
						"cnt": conV,
						"uid": userid,
						"uname": username
					}
					tip="回答修改成功"
				}else{
					typeUrl='/ajax/question/answer'
					dataStr={
						"qid": questionId,
						"cnt": conV,
						"uid": userid,
						"uname": username
					}
					tip="回答发布成功"
				}
				oAjax(typeUrl,dataStr, "post", function(res) {
					if(aflag){
						objN.hide()
						objN.parents(".list-qa").find(".answerInfo").show()
					}else{
						objN.slideUp(300);	
					}
					ue.destroy();
					objN.html("");
					$.MsgBox.Alert("提示", tip);
					$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
					window.location.reload();
				})
				
			})
			objN.find(".buttonbox").on("click",".fontLink",function(){
				if(aflag){
					objN.hide()
					objN.parents(".list-qa").find(".answerInfo").show()
				}else{
					objN.slideUp(300);	
				}
				ue.destroy();
				objN.html("");
			})
		},
		answerAgreeNum=function(anid,$str){
			oAjax("/ajax/question/answer", {
				id:anid
			}, "get", function(data) {
				if(data.success) {
					if(data.data.agree == 0) {
						data.data.agree=""
						$str.find(".agreeCount").css("margin-left","0")
					}
					$str.find(".agreeCount").css("margin-left","6px")
					$str.find(".agreeCount").html(data.data.agree);
				}
			})
		},
		answerBindE=function(anid,$str){
			//收藏
			$str.find(".collectBtn").on('click', function() {
				if(userid && userid != null && userid != "null") {
					if($(this).is('.icon-collected')){
						cancelCollectionAbout(anid,$(this),9)
					} else {
						collectionAbout(anid,$(this),9);
					}
				}else{
					quickLog();
					operatTab();
					closeLog();
				}
			});
			//留言
			$str.find(".leaveWo").on('click', function() {
				$(".list-qa").find(".answerWord").html("");
				if(userid && userid != null && userid != "null") {
					module.lWord.init($(this).parents(".list-qa").find(".answerWord"),{sid:anid,stype:4});
				}else{
					quickLog();
					operatTab();
					closeLog();
				}
			});
			//点赞回答
			$str.find(".canZan").on("click",function(){
				var that =$(this)
				if(userid && userid != null && userid != "null") {
					if(that.is('.active')){
						oAjax('/ajax/question/answer/agree/cancle', {
							"id": anid,
							"uid":userid,
							"uname":username
						}, "POST", function(res) {
							$str.find(".canZan").removeClass("active")
							answerAgreeNum(anid, that.parents(".holdSpan"));
						})
					}else{
						oAjax('/ajax/question/answer/agree', {
							"id": anid,
							"uid":userid,
							"uname":username
						}, "POST", function(res) {
							$str.find(".canZan").addClass("active")
							$str.find(".canCai").removeClass("active")
							answerAgreeNum(anid, that.parents(".holdSpan"));
						})
					}
				}else{
					quickLog();
					operatTab();
					closeLog();
				}
			})
			//踩回答
			$str.find(".canCai").on("click",function(){
				var that =$(this)
				if(userid && userid != null && userid != "null") {
					if(that.is('.active')){
						oAjax('/ajax/question/answer/oppose/cancle', {
							"id":anid,
							"uid":userid,
							"uname":username
						}, "POST", function(res) {
							$str.find(".canCai").removeClass("active")
							answerAgreeNum(anid,that.parents(".holdSpan"));
						})
						
					}else{
						oAjax('/ajax/question/answer/oppose', {
							"id":anid,
							"uid":userid,
							"uname":username
						}, "POST", function(res) {
							$str.find(".canCai").addClass("active")
							$str.find(".canZan").removeClass("active")
							answerAgreeNum(anid, that.parents(".holdSpan"));
						})
					}
					
				}else{
					quickLog();
					operatTab();
					closeLog();
				}
			})
			//删除
			$str.find(".tip-offs").on("click",".shanchu",function(){
				$.MsgBox.Confirm("提示", "确认删除该回答?",function(){
					oAjax('/ajax/question/answer/delete', {
						"id":anid,
						"qid":questionId,
					}, "get", function(res) {
						$.MsgBox.Alert("提示", "该回答已删除");
						$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
						window.location.reload(); 
					})
				})
			})
			//修改
			$str.find(".tip-offs").on("click",".xiugai",function(){
				var objStr=$(this).parents(".list-qa").find(".answerUpdate");
				var objTex=$(this).parents(".list-qa").find(".qa-con").html().replace(/<br\s*\/?\s*>/ig, '\n');
				goAnswerFn(objStr,anid,objTex,1)
			})
			//举报
			$str.find(".tip-offs").on("click",".jubao",function(){
				$("#correctBlock").fadeIn();
				$(".correctSubmit").attr("data-type","answer")
				$(".correctSubmit").attr("data-tyId",anid)
			})
			//微信分享
			$str.find('.shareWeixin').on("mouseenter",function(){
				$(this).find('.shareCode').stop(true,false).fadeIn();
			}).on("mouseleave",function(){
				$(this).find('.shareCode').stop(true,false).fadeOut();
			});
			var Qcu=$str.find(".qrcodeQA");
			for(var i=0;i<Qcu.length;i++){
				var qrcode= new QRCode(Qcu[i], {
					width : 100,
					height : 100
				});
				makeCodeQA();
			}
			function makeCodeQA(){
				var elurl = "http://" + hurl + "/e/da.html?id="+anid;
				qrcode.makeCode(elurl);
			}
			//微博分享
			$str.find(".weiboA").attr("href","http://service.weibo.com/share/share.php?appkey=3677230589&title="+encodeURIComponent(weibotitle)+"&url="+encodeURIComponent(weibourl)+"&pic="+encodeURIComponent(weibopic)+"&content=utf-8"+"&ralateUid=6242830109&searchPic=false&style=simple");
		},
		proinfo = function(pid, $str,Fflag) {
			oAjax("/ajax/professor/baseInfo/" + pid, {}, "get", function(res) {
				var dataStr = res.data
				var baImg = "../images/default-photo.jpg";
				if(dataStr.hasHeadImage == 1) {
					baImg = "/images/head/" + dataStr.id + "_l.jpg";
				}
				var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
				var os = "";
				var spanStr="";
				if(Fflag){
					spanStr='<span class="yaoqing">邀请回答</span>'
				}else{
					spanStr='<span class="attenSpan">关注</span>'
				}
				if(dataStr.title) {
					if(dataStr.orgName) {
						os = dataStr.title + "，" + dataStr.orgName;
					} else {
						os = dataStr.title;
					}
				} else {
					if(dataStr.office) {
						if(dataStr.orgName) {
							os = dataStr.office + "，" + dataStr.orgName;
						} else {
							os = dataStr.office;
						}
					} else {
						if(dataStr.orgName) {
							os = dataStr.orgName;
						}
					}
				}
				var str = '<a class="urlgo" target="_blank" href="userInforShow.html?professorId=' + dataStr.id +'"><div class="owner-head useHead" style="background-image:url(' + baImg + ')"></div>' +
					'<div class="owner-info">' +
					'<div class="owner-name">' + dataStr.name + '<em class="authiconNew ' + userType.sty + '" title="' + userType.title + '"></em></div>' +
					'<div class="owner-tit ellipsisSty h2Font">' + os + '</div>' +
					'</div></a>'+
					'<div class="goSpan">'+spanStr+'</div>'

				$str.find(".qa-owner").html(str);
				if(dataStr.id!=userid){
					ifcollectionAbout(dataStr.id,$str.find(".attenSpan"),1);
				}else{
					$str.find(".attenSpan").hide()
				}
				if(Fflag){
					inviteStatus(dataStr.id, $str);
				}
				//关注专家
				$str.find(".attenSpan").on('click', function() {
					if(userid && userid != null && userid != "null") {
						if($(this).is('.attenedSpan')){
							cancelCollectionAbout(dataStr.id,$(this),1)
						} else {
							collectionAbout(dataStr.id,$(this),1);
						}
					}else{
						quickLog();
						operatTab();
						closeLog();
					}
				});
			});
		},
		isAgree=function(id,$str){
			oAjax('/ajax/question/answer/agree', {
				"aid": id,
				"uid":userid
			}, "get", function(res) {
				if(res.success){
					console.log(res)
					if(res.data==null){
						
					}else if(res.data.flag){
						$str.find(".canZan").addClass("active")
					}else{
						$str.find(".canCai").addClass("active")
					}
				}
			})
		},
		requestA=function(){
			oAjax("/ajax/question/commendatoryPro", {
				"id": questionId,
				"uid": userid,
				"rows": rowsR,
				"pid": dataC.pid,
				"count": dataC.count
			}, "get",function(res){
				var aimId="requestA",newStr="抱歉，没有搜到可以邀请的人<br>您可以通过分享该问题的方式获得更多答案"
				var $info = res.data;
				if($info.length > 0) {
					dataC.count = $info[$info.length - 1].kws;
					dataC.pid = $info[$info.length - 1].id;
	
					for(var i = 0; i < $info.length; i++) {
						var liStr = document.createElement("li");
						liStr.setAttribute("data-id", $info[i].id);
						liStr.innerHTML = '<div class="flexCenter qa-owner"></div>'
						document.getElementById(aimId).appendChild(liStr);
						var $str = $(liStr)
						proinfo($info[i].id, $str,1);
					}
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeAfter(aimId);
                if($info.length == 0 && liLen == 0 ){
                    insertAfter(newStr,aimId);
                }
                $("#requestA").parent().find(".js-load-more").on("click",function(){
				 	requestA()
				})
				if ($info.length < rowsR) {
                    $("#requestA").parent().find(".js-load-more").unbind("click");
                    $("#requestA").parent().find(".js-load-more").hide();
                }
				
			},function(){
				$("#requestA").parent().find(".js-load-more").attr("disabled",true);
	       		$("#requestA").parent().find(".js-load-more").addClass("active");
			},function(){
				$("#requestA").parent().find(".js-load-more").removeAttr("disabled");
	        	$("#requestA").parent().find(".js-load-more").removeClass("active");
			})
		},
		inviteStatus = function(id, $str) {
			oAjax("/ajax/question/invite", {
				"qid": questionId,
				"pid": id,
				"uid": userid,
			}, "get", function(res) {
				console.log(res)
				if(res.data.length>0){
					$str.find(".yaoqing").addClass("yiyaoqing");
					$str.find(".yaoqing").html("已邀请");
					$str.find(".yaoqing").attr("data-type","");
				}else{
					$str.find(".yaoqing").text("邀请回答")
					$str.find(".yaoqing").attr("data-type","1");
				}
			});
		},
		searchPage = function(searchval,isbind) {
			var aimId="requestA",newStr="抱歉，没有搜到可以邀请的人<br>您可以通过分享该问题的方式获得更多答案"
			oAjax("/ajax/professor/index/search", {
				"key": searchval,
				"sortFirst": dataC.proSortFirst,
				"starLevel":dataC.proStarLevel,
				"id": dataC.proId,
				"rows": rowsR
			}, "get", function(res){
				var $info = res.data;
				if($info.length > 0) {
					dataC.proSortFirst = $info[$info.length - 1].sortFirst;
					dataC.proStarLevel = $info[$info.length - 1].starLevel;
					dataC.proId = $info[$info.length - 1].id;
					
					for(var i = 0; i < $info.length; i++) {
						if($info[i].id==userid){
							
						}else{
							var liStr = document.createElement("li");
							liStr.innerHTML = '<div class="flexCenter qa-owner"></div>'
							liStr.setAttribute("data-id", $info[i].id);
							document.getElementById(aimId).appendChild(liStr);
							var $str = $(liStr)
							proinfo($info[i].id, $str,1);
							inviteStatus($info[i].id, $str);
						}
					}
				}
				if(isbind){
					$("#requestA").parent().find(".js-load-more").on("click", function () {
	                    searchPage(searchval);
	                });
				}
				var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeAfter(aimId);
                if($info.length == 0 && liLen == 0 ){
                    insertAfter(newStr,aimId);
                }
                if ($info.length < rowsR) {
                    $("#requestA").parent().find(".js-load-more").unbind("click");
                    $("#requestA").parent().find(".js-load-more").hide();
                }
			},function(){
				$("#requestA").parent().find(".js-load-more").attr("disabled",true);
	       		$("#requestA").parent().find(".js-load-more").addClass("active");
			},function(){
				$("#requestA").parent().find(".js-load-more").removeAttr("disabled");
	        	$("#requestA").parent().find(".js-load-more").removeClass("active");
			})
		}
				
		
	pageViewLog(questionId,8)		
	getConmain();
	waitingA();
	if(topAnswerId){
		$(".show-list-allAn").addClass("displayNone")
		$(".show-list-thisAn").removeClass("displayNone")
		answerTop(topAnswerId)
		answerThisShow();
	}else{
		$(".show-list-allAn").removeClass("displayNone")
		$(".show-list-thisAn").addClass("displayNone")
		answerList(true);
	}

	if(userid && userid != null && userid != "null") {
		anExist(); //判断是否回答过该问题
		ifcollectionAbout(questionId, $("#attention"), 8);
	}	
	$(".list-hold-count>ul").on('click', 'li', function(e) {
		var sortlist = document.querySelector('.list-hold-count>ul').querySelectorAll("li");
		for(var i = 0; i < sortlist.length; i++) {
			sortlist[i].classList.remove('active');
		}
		this.classList.add('active');
		byway = this.getAttribute("data-type");
		document.getElementById("curAnswers").innerHTML = "";
		$("#curAnswers").parent().find(".js-load-more").unbind("click");
		$("#curAnswers").parent().find(".js-load-more").show();
		dataO = {time: "",id: "",score:"",agree:""}
		answerList(true)
	});	
	$("#attention").on('click', function() {
		if(userid && userid != null && userid != "null") {
			if($(this).is('.icon-collected')){
				cancelCollectionAbout(questionId,$(this),8)
			} else {
				collectionAbout(questionId,$(this),8);
			}
			attendCount()
		}else{
			quickLog();
			operatTab();
			closeLog();
		}
	});
	$(".go-answer").on('click', function() {
		var can = this.getAttribute("data-can");
		if(userid && userid != null && userid != "null") {
			if(can=="1") {
				if($(".answerQu").is(':hidden')){
					goAnswerFn($(".answerQu"))
				}
			} else if(can=="2") {
				var anid= this.getAttribute("data-anid");
				oAjax("/ajax/question/answer/unDel", {
					"qid": questionId,
					"id": anid,
				}, "get", function(res) {
					if(res.data=="1") {
						oanswer.setAttribute("data-can", "0"); //回答过
						oanswer.classList.add("answered");
						oanswer.innerText = "我已回答"
					}
					window.location.reload(); 
				})
			}else{
				return
			}
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	})
	$(".invite-answer").on('click', function() {
		if(userid && userid != null && userid != "null") {
			var objN=$(".request-qa")
			objN.slideToggle(300);
			document.getElementById("searchAval").value=""
			document.getElementById("requestA").innerHTML = ""
			dataC = {count: "",pid: ""}
			$("#requestA").parent().find(".js-load-more").unbind("click");
			$("#requestA").parent().find(".js-load-more").show();
			requestA()
		} else {
			quickLog();
			operatTab();
			closeLog();
		}
	})
	$("#requestA").on("click", ".yaoqing", function() {
		var id = $(this).parents("li").attr("data-id");
		var type = $(this).attr("data-type");
		var that=$(this)
		if(type) {
			oAjax("/ajax/question/invite", {
				"qid": questionId,
				"pid": id,
				"uid": userid,
				"uname": username,
			}, "post", function(res) {
				that.attr("data-type", "");
				that.addClass("yiyaoqing");
				that.text("已邀请");
				$.MsgBox.Alert("提示", "邀请成功");
				$("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
			})
		}
	})
	$("#searchAbtn").on("click", function() {
		document.getElementById("requestA").innerHTML = ""
		dataC = {
			proSortFirst:"",
			proStarLevel: "",
			proId: ""
		}
		var searchval = document.getElementById("searchAval").value;
		searchPage(searchval,1)
		$("#requestA").parent().find(".js-load-more").unbind("click");
		$("#requestA").parent().find(".js-load-more").show();
	});
	$("#jubao").on("click",function(){
		$("#correctBlock").fadeIn();
		$(".correctSubmit").attr("data-type","question")
		$(".correctSubmit").attr("data-tyId",questionId)
	})
	$(".correctSubmit").on("click",function(){
		var type=$(this).attr("data-type"),
			tyId=$(this).attr("data-tyId")
		if(type=="answer"){
			tyurl='/ajax/feedback/error/answer'
		}else if(type=="question"){
			tyurl='/ajax/feedback/error/question'
		}
		var cntUser=""
		var cntCon=$(".correctCon").val();
		if(userid && userid != null && userid != "null") {
			cntUser = userid;
		}
		if(cntCon.length>500){
			$.MsgBox.Alert('提示', '纠错反馈内容不得超过500个字');
			return;
		}
		oAjax(tyurl,{
			"id": tyId,
			"cnt":cntCon,
			"user":cntUser
		}, "post", backSuccessed)
	})
	
})

