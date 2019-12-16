//*********个人企业主页  tab切换************//
	$(document).bind("click",function(e){ 
		var target = $(e.target); 
		if(target.closest(".moreBuUl>li.rightbtn").length == 0){ 
			$(".table-drop").hide(); 
		}
	})
	/* if in tab mode */
	$(".leftconItem").hide();
	$(".leftconItem:first").show();
	
	$(".moreNav").hide()
	
	$("ul.mainNavUl").on("click", "li", function() {
		$(".leftconItem").hide();
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).fadeIn();
	
		$("ul.mainNavUl li").removeClass("liNow");
		$(this).addClass("liNow");
		
		$(".moreNav").hide();
		if($(this).is('[tmp]')){//问答、更多
			var activeMoreTab = $(this).attr("tmp");
			$("#" + activeMoreTab).fadeIn();
		}
	});
	
	 /* if in tab-drop mode */
	$(".leftconItem>.dropconItem").hide();
	$(".leftconItem>.dropconItem:first").show();
	
	$("ul.moreNavUl").on("click", "li",function() {
		$(".moreNav").hide()
		$(this).parents(".moreNav").show()
		
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).parents(".leftconItem").find(".dropconItem").hide();
		$("#" + activeTab).fadeIn();
	
		$(this).parent().find("li").removeClass("liNow");
		$(this).addClass("liNow");
	});
	
	$(".table-drop").hide()
	$("ul.moreNavUl").on("click", "li.rightbtn",function() {
		$(this).find(".table-drop").show();
	});
	
	 /* if in tab-drop-2 mode */
	$(".dropconItem>.droplistcon").hide()
	$(".dropconItem>.droplistcon:first-child").show()
	
	$("ul.table-drop").on("click","li",function(){
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).parents(".dropconItem").find(".droplistcon").hide();
		$("#" + activeTab).fadeIn();
		
		$(this).parents(".rightbtn").find("span").html($(this).text()).attr("tmp",activeTab);
		$(".table-drop").fadeOut(1000);
	})
//*********个人企业主页  tab切换************//


//*********search tab 切换************//
	$(".listdiv .listbox").hide();
	$(".listdiv .listbox:first").show();
	
	$("ul.choosediv").on("click", "li", function() {
		var activeTab = $(this).attr("rel");
		$("#" + activeTab).parents(".listdiv").find(".listbox").hide();
		$("#" + activeTab).fadeIn();
	
		$("ul.choosediv li").removeClass("liactive");
		$(this).addClass("liactive");
		
	});
//*********search tab 切换************//