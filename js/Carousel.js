/* 
 *轮播图组件api说明
 * 1.依赖move.js,用组件前一定要引入move.js
 * 2.轮播图需要有一个父级,这个父级一定要给一个id
 */

;(function(window,undefined){
	var Carousel=function(){
		this.settings={
			id:'pic',				//轮播图父级的id,比传的参数
			autoplay:true,			//自动播放,true为自动,false为不自动,默认为true
			intervalTime:1000,		//间隔时间,运动后停顿的时间,默认为1s
			loop:true,				//循环播放,true为循环,false为不循环,默认为true
			totalNum:5,				//图片总量
			moveNum:1,				//单次运动的图片数量(图片总量必须为运动数量的整倍数)
			circle:true,			//小圆点功能,true为显示,false为不显示,默认显示
			moveWay:'opacity'		//运动方式,opacity为透明度过度,position为位置过度
		};
	};
	
	Carousel.prototype={
		constructor:Carousel,
		init:function(opt){
			var opt=opt||this.settings;
			
			for(var attr in opt){
				this.settings[attr]=opt[attr];
			};
			
			this.createDom();
		},
		//创建Dom
		createDom:function(){
			var This=this;
			this.box=document.getElementById(this.settings.id);
			//上一个按钮
			this.prevBtn=document.createElement('div');
			this.prevBtn.className='prev';
			this.prevBtn.innerHTML='<';
			this.prevBtn.onclick=function(){
				This.prev();
				This.trigger('leftClick');
			};
			this.box.appendChild(this.prevBtn);
			
			//下一个按钮
			this.nextBtn=document.createElement('div');
			this.nextBtn.className='next';
			this.nextBtn.innerHTML='>';
			this.nextBtn.onclick=function(){
				This.next();
				This.trigger('rightClick');
			};
			this.box.appendChild(this.nextBtn);
			
			//小圆点
			this.circleWrap=document.createElement('div');
			this.circleWrap.className='circle';
			this.circles=[];		//存储圆点数组
			
			for(var i=0;i<this.settings.totalNum/this.settings.moveNum;i++){
				var span=document.createElement('span');
				span.index=i;
				
				span.onclick=function(){
					This.cn=this.index;
					This[This.settings.moveWay+'Fn']();
				};
				
				this.circleWrap.appendChild(span);
				this.circles.push(span);
			};
			
			this.circles[0].className='active';
			
			if(this.settings.circle){
				this.box.appendChild(this.circleWrap);
			};
			
			this.moveInit();
		},
		//运动前初始化
		moveInit:function(){
			this.cn=0;				//当前的索引
			this.ln=0;				//上一个的索引
			this.canClick=true;		//是否可以再次点击
			this.endNum=this.settings.totalNum/this.settings.moveNum;		//停止条件
			this.opacityItem=this.box.children[0].children;					//运动透明度的元素
			this.positionItemWrap=this.box.children[0].children[0];			//运动位置的元素的父级
			this.positionItem=this.positionItemWrap.children;				//运动位置的所有元素
			
			switch(this.settings.moveWay){
				case 'opacity':		//运动透明度时设置透明度与transtion
					for(var i=0;i<this.opacityItem.length;i++){
						this.opacityItem[i].style.opacity=0;
						this.opacityItem[i].style.transition='.3s opacity';
					};
					this.opacityItem[0].style.opacity=1;
					
					break;
					
				case 'position':	//运动位置时设置父级的宽度
					var leftMargin=parseInt(getComputedStyle(this.positionItem[0]).marginLeft);
					var rightMargin=parseInt(getComputedStyle(this.positionItem[0]).marginRight);
					
					//一个元素的宽度
					this.singleWidth=leftMargin+this.positionItem[0].offsetWidth+rightMargin;
					
					if(this.settings.loop){
						this.positionItemWrap.innerHTML+=this.positionItemWrap.innerHTML;
					};
					
					this.positionItemWrap.style.width=this.singleWidth*this.positionItem.length+'px';
					break;
			};
			
			if(this.settings.autoplay){
				this.autoPlay();
			};
		},
		//透明度运动
		opacityFn:function(){
			//左边到头
			if(this.cn<0){
				if(this.settings.loop){
					this.cn=this.endNum-1;
				}else{
					this.cn=0;
					This.canClick=true;	//不循环的时候单独设置此值
				};
			};
			
			//右边到头
			if(this.cn>this.endNum-1){
				if(this.settings.loop){
					this.cn=0;
				}else{
					this.cn=this.endNum-1;
					This.canClick=true;
				};
			};
			this.opacityItem[this.ln].style.opacity=0;
			this.circles[this.ln].className='';
			
			this.opacityItem[this.cn].style.opacity=1;
			this.circles[this.cn].className='active';
			
			var This=this;
			var en=0;
			
			this.opacityItem[this.cn].addEventListener('transitionend',function(){
				en++;
				if(en==1){
					This.canClick=true;
					This.ln=This.cn;
					
					This.endFn();
				};
			});
		},
		//位置运动
		positionFn:function(){
			//左边到头
			if(this.cn<0){
				if(this.settings.loop){
					this.positionItemWrap.style.left=-this.positionItemWrap.offsetWidth/2+'px';
					this.cn=this.endNum-1;
				}else{
					this.cn=0;
				};
			};
			
			//右边到头
			/*if(this.cn>this.endNum-1){
				if(this.settings.loop){
					this.cn=0;
				}else{
					this.cn=this.endNum-1;
				};
			};*/
			
			if(this.cn>this.endNum-1 && !this.settings.loop){
				this.cn=this.endNum-1;	
			};
			
			//不循环的时候修改小圆点
			if(!this.settings.loop){
				this.circles[this.ln].className='';
				this.circles[this.cn].className='active';
			};
			
			var This=this;
			move(this.positionItemWrap,{left:-this.cn*this.singleWidth*this.settings.moveNum},300,'linear',function(){
				if(This.cn==This.endNum){
					this.style.left=0;
					This.cn=0;
				};
				
				This.endFn();
				
				This.canClick=true;
				This.ln=This.cn;
			});
		},
		prev:function(){
			//运动完一次才可以点击
			if(!this.canClick){
				return
			};
			this.canClick=false;
			
			this.cn--;
			this[this.settings.moveWay+'Fn']();
		},
		next:function(){
			if(!this.canClick){
				return
			};
			this.canClick=false;
			
			this.cn++;
			this[this.settings.moveWay+'Fn']();
		},
		//自动播放
		autoPlay:function(){
			var This=this;
			this.timer=setInterval(function(){
				This.next()
			},this.settings.intervalTime);
			
			this.box.onmouseenter=function(){
				clearInterval(This.timer);
				This.timer=null;
			};
			
			this.box.onmouseleave=function(){
				This.autoPlay();
			};
		},
		//添加自定义事件
		on:function(type,listener){
			this.events=this.events||{};
			this.events[type]=this.events[type]||[];
			this.events[type].push(listener);
		},
		//调用自定义事件
		trigger:function(type){
			if(this.events && this.events[type]){
				for(var i=0;i<this.events[type].length;i++){
					this.events[type][i].call(this);
				};
			};
		},
		endFn:function(){
			if(!this.settings.loop){
				if(this.cn==0){
					this.trigger('leftEnd');
				};
				
				if(this.cn==this.endNum-1){
					this.trigger('rightEnd');
				};
			};
		}
	};
	
	window.Carousel=Carousel;
})(window,undefined);
