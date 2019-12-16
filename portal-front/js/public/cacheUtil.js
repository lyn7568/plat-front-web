(function(window) {
	var objCache={"professor":{},"company":{},"platform":{}};
	var objHCache={"professor":{},"company":{},"platform":{}};//队列（processing）

	var objCacheHandler={
		"professor":function(id){
			jQuery.ajax({
				url:"/ajax/professor/baseInfo/"+id,
				type:"GET",
				success:function(res){
					var ha = objHCache.professor[id];//jilu
					delete objHCache.professor[id];
					
					if(res.success){
						objCache.professor[id]=res.data;
						for(var i = 0 ;i < ha.length;++i){
							ha[i](true,res.data);
						}
					}else{
						for(var i = 0 ;i < ha.length;++i){
							ha[i](false);
						}
					}
				},
				error:function(dfd){
					ha[i](false);
				}
			})
		},
		"company":function(id){
			jQuery.ajax({
				url:"/ajax/org/"+id,
				type:"GET",
				success:function(res){
					var ha = objHCache.company[id];//jilu
					delete objHCache.company[id];
					
					if(res.success){
						objCache.company[id]=res.data;
					for(var i = 0 ;i < ha.length;++i){
							ha[i](true,res.data);
						}
					}else{
						for(var i = 0 ;i < ha.length;++i){
							ha[i](false);
						}
					}
				},
				error:function(dfd){
					ha[i](false);
				}
			});
		},
		"platform":function (id) {
            jQuery.ajax({
                url:"/ajax/platform/info",
				data:{id:id},
                type:"GET",
                success:function(res){
                    var ha = objHCache.platform[id];//jilu
                    delete objHCache.platform[id];

                    if(res.success){
                        objCache.platform[id]=res.data;
                        for(var i = 0 ;i < ha.length;++i){
                            ha[i](true,res.data);
                        }
                    }else{
                        for(var i = 0 ;i < ha.length;++i){
                            ha[i](false);
                        }
                    }
                },
                error:function(dfd){
                    ha[i](false);
                }
            });
        }
	};
	
	var cacheModel={
		getProfessor:function(id,cb){
			var val =objCache.professor[id]
			if(val){
				cb(true,val);
			}else{
				if(objHCache.professor[id]){
					objHCache.professor[id].push(cb);		
				}else{
					objHCache.professor[id]=[];
					objHCache.professor[id].push(cb);	
					objCacheHandler.professor(id);
				}
			}
		},
		getCompany:function(id,cb){
			var val =objCache.company[id]
			if(val){
				cb(true,val);
			}else{
				if(objHCache.company[id]){
					objHCache.company[id].push(cb);		
				}else{
					objHCache.company[id]=[];
					objHCache.company[id].push(cb);	
					objCacheHandler.company(id);
				}
			}
		},
		getPlatform:function(id,cb){
			var val =objCache.platform[id]
			if(val){
				cb(true,val);
			}else{
				if(objHCache.platform[id]){
					objHCache.platform[id].push(cb);
				}else{
					objHCache.platform[id]=[];
					objHCache.platform[id].push(cb);
					objCacheHandler.platform(id);
				}
			}
		}
	};
	window.cacheModel = cacheModel;
})(window)
