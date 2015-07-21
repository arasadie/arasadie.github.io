	
	/**************************************************************************/
	
	(function($)
	{	
		/**********************************************************************/

		var Monaco=function()
		{
			/******************************************************************/
		
			var $this=this;

			$this.backgroundImage=
			[
				{image:'image/background/01.jpg'},	
				{image:'image/background/02.jpg'},
				{image:'image/background/03.jpg'},
				{image:'image/background/04.jpg'},
				{image:'image/background/05.jpg'}		
			];
			
			$this.page=
			{
				'about':
					{menuIndex:0,imageIndex:1},
				'services':
					{menuIndex:1,imageIndex:2},
				'portfolio-1':
					{menuIndex:2,imageIndex:3},
				'portfolio-2': 
					{menuIndex:2,imageIndex:3},
				'contact': 
					{menuIndex:3,imageIndex:4}
			}; 
			
			$this.enable=false;
			
			$this.currentId=-1;
			
			$this.currentHash='';
			$this.previousHash='';

			$this.scrollbar='';

			$this.twitterEntryCount=6;
			$this.twitterName='jaydhed';

			$this.pageList=$('ul.page-list');
			$this.pageListItem=this.pageList.children('li.page-list-item');
			
			$this.menu=$('ul.header-menu li a');
			
			$this.pageHeight=parseInt(this.pageList.find('li:first').css('height'));

			/******************************************************************/
			
			this.load=function()
			{		
				$this.createSupersizedSlider();

				$this.createPagePrealoder({onComplete:function()
				{	
					$('.page-preloader:first').fadeOut(300,function() 
					{
						$('.page-prealoder-wrapper:first').animate({height:0},500,'easeOutExpo',function() 
						{
							$(this).remove();						
							$('.main').css('display','block');
					
							$this.createTwitter();
							$this.createNivoSlider();
							//$this.createGoogleMap();
							$this.createPortfolio();
							
							$this.enable=true;

							if(window.location.hash=='') window.location.href='#!/';
							$this.currentHash=window.location.hash;					

							$(window).bind('hashchange',function(event) 
							{
								event.preventDefault();
								
								if($this.isEnable()==false) return;
								
								$this.currentHash=window.location.hash;
								$this.doHash();
								$this.previousHash=$this.currentHash;
							}); 
							
							if($this.currentHash!=$this.previousHash) $this.doHash();
						});
					});
				}});
			};
			
			/******************************************************************/
			
			this.getFirstPageId=function()
			{
				for(var id in $this.page) return(id);
			};
			
			/******************************************************************/
			
			this.getPageId=function(hash)
			{
				var position=hash.lastIndexOf('#!/');
				if(position!=0) return(false);
				
				var id=hash.substring(3);
				if(typeof($this.page[id])=='undefined') return(false);
				
				return(id);
			};
			
			/******************************************************************/
			
			this.getPrevPageId=function()
			{
				var prev='';
				for(var id in $this.page)
				{
					if(id==$this.currentId && prev!='') return(prev);
					else prev=id;
				}
			
				return(prev);
			};
			
			/******************************************************************/
			
			this.getNextPageId=function()
			{
				var n=false;
				var next=$this.getFirstPageId();
				
				for(var id in $this.page)
				{
					if(n) return(id);
					if(id==$this.currentId) n=id;
				}
			
				return(next);
			};
			
			/******************************************************************/

			this.setNavigation=function()
			{
				var prev=$this.getPrevPageId();				
				var next=$this.getNextPageId();	

				$('.navigation-prev').attr('href','#!/'+prev);
				$('.navigation-next').attr('href','#!/'+next);
			};
			
			/******************************************************************/
			
			this.doHash=function()
			{
				if(!$this.enable) return;
				$this.enable=false;
				
				var open=$this.isOpen();
				
				$this.currentId=$this.getPageId($this.currentHash);
				if($this.currentId==false)
				{
					$this.enable=true;
					window.location.href='#!/'+$this.getFirstPageId();
					return;
				}
				
				if(open) $this.close({'onComplete':function() { $this.open(); }})
				else $this.open();
			};
			
			/******************************************************************/
			
			this.isOpen=function()
			{		
				return(this.currentId==-1 ? false : true);
			};
			
			/******************************************************************/
			
			this.open=function()
			{
				$this.selectMenu(true);
				
 				$this.pageList.animate({height:$this.pageHeight},500,'easeOutExpo',function()	
				{											
					$this.createScrollbar();

					$('#'+$this.currentId).css('display','block');
					$this.setNavigation();
				
					api.goTo($this.page[$this.currentId].imageIndex);		
					
					//google.maps.event.trigger(map,'resize');
					//map.setZoom(map.getZoom());
					
					$this.previousHas=$this.currentHash;
					$this.enable=true;	
				});			
			};
			
			/******************************************************************/
			
			this.close=function(data)
			{
				$this.selectMenu(false);

				$this.destroyQtip();
				
				$this.pageListItem.css('display','none');
				
				$this.destroyScrollbar();
				
				$this.pageList.animate({height:'0px'},500,'easeOutExpo',function()
				{				
  					if(typeof(data)!='undefined')		
					{
						if(typeof(data.onComplete)!='undefined') data.onComplete.apply();
					}					
				});
			};
						
			/******************************************************************/
			
			this.selectMenu=function(select)
			{
				if(select)
				{
					$this.selectMenu(false);
					$this.menu.eq($this.page[$this.currentId].menuIndex).addClass('selected');
				}
				else $this.menu.removeClass('selected');
			};

			/******************************************************************/
			
			this.createScrollbar=function()
			{
				$this.scrollbar=$('#'+$this.currentId).jScrollPane({maintainPosition:false,autoReinitialise:true}).data('jsp');
			};
			
			/******************************************************************/
			
			this.destroyScrollbar=function()
			{
				if($this.scrollbar!='')
				{
					$this.scrollbar.destroy();
					$this.scrollbar='';						
				}
			};
			
			/******************************************************************/
			
			this.destroyQtip=function()
			{
				$(':input,a').qtip('destroy');
			};	
									
			/******************************************************************/
			
			this.createGoogleMap=function()
			{
				var coordinate=new google.maps.LatLng(1, -1);
				var mapOptions= 
				{
					zoom:16,
					center:coordinate,
					mapTypeId:google.maps.MapTypeId.ROADMAP
			   };
												
				map=new google.maps.Map(document.getElementById('gmap'),mapOptions);
			};
			
			/******************************************************************/
			
			this.createSupersizedSlider=function()
			{
				$.supersized(
				{
					autoplay:0,
					keyboard_nav:false,
					slides:$this.backgroundImage
				});					
			};
			
			/******************************************************************/
			
			this.createNivoSlider=function()
			{
				$('#slider').nivoSlider({directionNav:false,manualAdvance:true});
			};
			
			/******************************************************************/
			
			this.createPortfolio=function()
			{
				$('.fancybox-image').fancybox({});
				
				$('.fancybox-video-youtube').bind('click',function() 
				{
					$.fancybox(
					{
						'padding'		: 0,
						'autoScale'		: false,
						'transitionIn'	: 'none',
						'transitionOut'	: 'none',
						'width'			: 680,
						'height'		: 495,
						'href'			: this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
						'type':'swf',
						'swf':
						{
							'wmode'				: 'transparent',
							'allowfullscreen'	: 'true'
						}
					});

					return false;
				});


				$('.fancybox-video-vimeo').bind('click',function() 
				{
					$.fancybox(
					{
						'padding'		: 0,
						'autoScale'		: false,
						'transitionIn'	: 'none',
						'transitionOut'	: 'none',
						'title'			: this.title,
						'width'			: 600,
						'height'		: 338,
						'href'			: this.href.replace(new RegExp("([0-9])","i"),'moogaloop.swf?clip_id=$1'),
						'type'			: 'swf',
						'swf':
						{
							'wmode'				: 'transparent',
							'allowfullscreen'	: 'true'
						}
					});

					return false;
				});
			
				$('.portfolio-list').hover(
					function() {},
					function()
					{
						$(this).find('li img').animate({opacity:1},250);
					}	
				);
				
				$('.portfolio-list li').hover(
					function() 
					{
						$(this).siblings('li').find('img').css('opacity',0.5);
						$(this).find('img').animate({opacity:1},250);
					},
					function()
					{
						$(this).find('img').css('opacity',1);	
					}
				);
			};
			
			/******************************************************************/
			
			this.createTwitter=function()
			{
				$.getJSON('http://twitter.com/statuses/user_timeline.json?screen_name='+$this.twitterName+'&count='+$this.twitterEntryCount+'&callback=?',function(data) 
				{
					if(data.length)
					{
						var list=$(document.createElement('ul'));
						
						$(data).each(function(index,value)
						{
							var element=$(document.createElement('li'));							
							var paragraph=$(document.createElement('p'));	
							
							list.append(element.append(paragraph.html(linkify(value.text))));
						});
												
						$('#latest-tweets').append(list);
											
						list.bxSlider(
						{
							auto:true,
							pause:5000,
							nextText:null,
							prevText:null,							
							mode:'vertical',
							displaySlideQty:1
						});
										
						list.find('a').attr('target','_blank');
					}
				});			
			};
			
			/******************************************************************/
			
			this.createPagePrealoder=function(data)
			{
				var i=0;
				var count=$this.backgroundImage.length;

				var pagePreloader=$('.page-preloader:first');
				var pagePreloaderThumbnailList=$(document.createElement('ul'));
				
				pagePreloaderThumbnailList.attr('class','no-list box-center');
				
				pagePreloader.prepend(pagePreloaderThumbnailList);
				
				$this.textBlink(pagePreloader.find('p'));
							
				$($this.backgroundImage).each(function(index) 
				{			
					var image=$(document.createElement('img'));	
					var element=$(document.createElement('li'));
					
					pagePreloaderThumbnailList.append(element);
					
					if($.browser.msie) 
						image.attr('src',$this.backgroundImage[index].image+'?i='+getRandom(1,10000));
					else image.attr('src',$this.backgroundImage[index].image);
					
					$(image).bind('load',function() 
					{
						element.animate({opacity:1},100,function() 
						{
							if((++i)==count) data.onComplete.apply();
						});
					});
				});
			};
			
			/******************************************************************/
			
			this.textBlink=function(element)
			{
				$(element).animate({opacity:($(element).css('opacity')==1 ? 0.2 : 1)},500,function() { $this.textBlink($(this)); });
			};
			
			/******************************************************************/
			
            this.isEnable=function()
            {
                if(!$this.enable)
                {
					if($this.previousHash!='')
						window.location.href=$this.previousHash;
                    return(false);
                }  
                
                return(true);
            };
			
			/******************************************************************/
		};

		/**************************************************************/
		 
		$.fn.monaco=function()
		{
			/***********************************************************/
		
			var monaco=new Monaco();
			monaco.load();

			/***********************************************************/
		};
		
		/**************************************************************/
		
	})(jQuery);