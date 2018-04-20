window.yx={
	g:function(name){
		return document.querySelector(name);
	},
	ga:function(name){
		return document.querySelectorAll(name);
	},
	addEvent:function(obj,ev,fn){
		if(obj.addEventListener){
			obj.addEventListener(ev,fn);
		}else{
			obj.attachEvent('on'+ev,fn);
		};
	},
	removeEvent:function(obj,ev,fn){
		if(obj.removeEventListener){
			obj.removeEventListener(ev,fn);
		}else{
			obj.detachEvent('on'+ev,fn);
		};
	},
	//获取元素离html的距离
	getTopValue:function(obj){
		var top=0;
		while(obj.offsetParent){
			top+=obj.offsetTop;
			obj=obj.offsetParent;
		};
		
		return top;
	},
	//倒计时
	cutTime:function(target){	
		var currentDate=new Date();
		var v=Math.abs(target-currentDate);
		
		return {
			d:parseInt(v/(24*3600000)),
			h:parseInt(v%(24*3600000)/3600000),
			m:parseInt(v%(24*3600000)%3600000/60000),
			s:parseInt(v%(24*3600000)%3600000%60000/1000)
		};
	},
	//给时间补0
	format:function(v){
		return v<10?'0'+v:v;
	},
	formatDada:function(time){
		var d=new Date(time);
		return d.getFullYear()+'-'+yx.format(d.getMonth()+1)+'-'+yx.format(d.getDate())+' '+yx.format(d.getHours())+':'+yx.format(d.getMinutes());
	},
	//url解析成对象
	parseUrl:function(url){
		//id=1140214
		var reg=/(\w+)=(\w+)/ig;
		var result={};
		
		url.replace(reg,function(a,b,c){
			result[b]=c;
		});
		
		return result;
	},
	public:{
		//吸顶导航功能
		navFn:function(){	
			var nav=yx.g(".nav");
			var lis=yx.ga(".navBar li");
			var subNav=yx.g(".subNav");
			var uls=yx.ga(".subNav ul");
			var newLis=[];	//存储实际有用的li
			
			//挑出不用的li
			for(var i=1;i<lis.length-3;i++){
				newLis.push(lis[i]);
			};
			
			for(var i=0;i<newLis.length;i++){
				newLis[i].index=uls[i].index=i;
				newLis[i].onmouseenter=uls[i].onmouseenter=function(){
					newLis[this.index].className='active';
					subNav.style.opacity=1;
					uls[this.index].style.display="block";
				};
				newLis[i].onmouseleave=uls[i].onmouseleave=function(){
					newLis[this.index].className='';
					subNav.style.opacity=0;
					uls[this.index].style.display="none";
				};
			};
			
			yx.addEvent(window,'scroll',setNavPos);
			setNavPos();
			function setNavPos(){
				nav.id=window.pageYOffset>nav.offsetTop?'navFix':'';
			};
		},
		//购物车功能
		shopFn:function(){
			
			//购物车添加商品展示
			var productNum=0;	//买了几个商品
			(function(local){
				var totalPrice=0;	//商品合计
				var ul=yx.g(".cart ul");
				var li='';
				ul.innerHTML='';
				
				for(var i=0;i<local.length;i++){
					var attr=local.key(i);	//取到每个key
					var value=JSON.parse(local[attr]);
					
					if(value && value.sign=='productLocal'){
						li+=`<li data-id="${value.id}">
								<a href="#" class="img"><img src="${value.img}"/></a>
								<div class="message">
									<p><a href="#">${value.name}</a></p>
									<p>${value.spec.join(' ')} x ${value.num}</p>
								</div>
								<div class="price">￥${value.price}</div>
								 <div class="close">x</div>
							</li>`;
							
						totalPrice+=parseFloat(value.price)*value.num;
					};
				};
				ul.innerHTML=li;
				
				productNum=ul.children.length;				//买了多少个商品
				yx.g('.cartWrap i').innerHTML=productNum;	//更新商品数量的值
				yx.g('.cartWrap .total span').innerHTML='￥'+totalPrice+'.00';	//更新总价格
				
				//删除商品功能
				var closeBtns=yx.ga('.cart .list .close');
				for(var i=0;i<closeBtns.length;i++){
					closeBtns[i].onclick=function(){
						localStorage.removeItem(this.parentNode.getAttribute('data-id'));	//本地存储中删除某条数据
						
						yx.public.shopFn();  //更新数据
						
						if(ul.children.length==0){
							yx.g('.cart').style.display='none';
						};
					};
				};
				
				//小红圈添加事件
				var cartWrap=yx.g('.cartWrap ');
				var timer;		//购物车弹出层移入移出间隙问题,解决的定时器
				
				//购物车里有商品显示购物车
				
				cartWrap.onmouseenter=function(){
					if(ul.children.length>0){
						clearTimeout(timer);
						yx.g('.cart').style.display='block';
						scrollFn();
					};
				};
				cartWrap.onmouseleave=function(){
					timer=setTimeout(function(){
						yx.g('.cart').style.display='none';
					},100);
				};
				
				
				
			})(localStorage);
			
			//滚动条功能
			function scrollFn(){
				var contentWarp=yx.g('.cart .list');
				var content=yx.g('.cart .list ul');
				var scrollBar=yx.g('.cart .scrollBar');
				var slide=yx.g('.cart .slide');
				var slideWrap=yx.g('.cart .slideWrap');
				var btns=yx.ga('.scrollBar span');
				var timer;
				
				//滚动条系数
				var coefficient=content.offsetHeight/contentWarp.offsetHeight;
				scrollBar.style.display=coefficient<=1?'none':'block';		//滚动条显示与否
				
				//给系数一个最大值
				if(coefficient>20){
					coefficient=20;
				};
				
				//滑块的高度
				slide.style.height=slideWrap.offsetHeight/coefficient+'px';
				
				//滑块拖拽
				var scrollTop=0;
				var maxHeight=slideWrap.offsetHeight-slide.offsetHeight;	//滑块可走的最大距离
				
				slide.onmousedown=function(ev){
					var disY=ev.clientY-slide.offsetTop;
					
					document.onmousemove=function(ev){
						scrollTop=ev.clientY-disY;
						scroll();
					};
					document.onmouseup=function(){
						this.onmousemove=null;
					};
					
					ev.cancelBubble=true;
					return false;
				};
				
				//滚轮事件
				myScroll(contentWarp,function(){
					scrollTop-=10;
					scroll();
					
					clearInterval(timer);
				},function(){
					scrollTop+=10;
					scroll();
					
					clearInterval(timer);
				});
				
				//滑块点击
				slideWrap.onmousedown=function(ev){
					timer=setInterval(function(){
						var slideTop=slide.getBoundingClientRect().top+slide.offsetHeight/2;
						
						if(ev.clientY<slideTop){
							scrollTop-=5;
						}else{
							scrollTop+=5;
						};
						if(Math.abs(ev.clientY-slideTop)<=5){
							clearInterval(timer);
						};
						scroll();
					},16);
				};
				
				//滚动条的主体功能
				function scroll(){
					if(scrollTop<0){
						scrollTop=0;
					}else if(scrollTop>maxHeight){
						scrollTop=maxHeight;
					};
					
					var scaleY=scrollTop/maxHeight;
					
					slide.style.top=scrollTop+'px';
					content.style.top=-(content.offsetHeight-contentWarp.offsetHeight)*scaleY+'px';
				};
				
				//上下箭头点击
				for(var i=0;i<btns.length;i++){
					btns[i].index=i;
					btns[i].onmousedown=function(){
						var n=this.index;
						timer=setInterval(function(){
							scrollTop=n?scrollTop+5:scrollTop-5;
							scroll();
						},16);
					};
					btns[i].onmouseup=function(){
						clearInterval(timer);
					};
				};
				
				function myScroll(obj,fnUp,fnDown){
					obj.onmousewheel=fn;
					obj.addEventListener('DOMMouseScroll',fn);
					
					function fn(ev){
						if(ev.wheelDelta>0 || ev.detail<0){
							fnUp.call(obj);
						}else{
							fnDown.call(obj);
						}
						
						ev.preventDefault();
						return false;
					};
				};
			};
		},
		//图片懒加载功能
		lazyImgFn:function(){
			yx.addEvent(window,'scroll',delayImg);
			delayImg();
			function delayImg(){
				var originals=yx.ga('.original');
				var scrollTop=window.innerHeight+window.pageYOffset;
				
				for(var i=0;i<originals.length;i++){
					if(yx.getTopValue(originals[i])<scrollTop){
						originals[i].src=originals[i].getAttribute('data-original');
						originals[i].removeAttribute('class');
					}
				};
				
				if(originals[originals.length-1].getAttribute('src')!="images/empty.gif"){
					yx.removeEvent(window,'scroll',delayImg);
				};
			};
		},
		//回到顶部功能
		backUpFn:function(){
			var back=yx.g('.back');
			var timer;
			back.onclick=function(){
				var top=window.pageYOffset;
				timer=setInterval(function(){
					top-=150;
					if(top<=0){
						top=0;
						clearInterval(timer);
					};
					
					window.scrollTo(0,top)
				},16)
			};
		}
	}
};
