//公用方法调用
yx.public.navFn();
yx.public.backUpFn();

//url解析404
var params=yx.parseUrl(window.location.href);
params.id=1143021;
var pageId=params.id;
var curData=productList[pageId];
if(!pageId || !curData){
	window.location.href='404.html';
};

//面包屑功能
var positionFn=yx.g('#position');
positionFn.innerHTML='<a href="#">首页</a> > ';
/*var curDataA=productList[1143021];*/
for(var i=0;i<curData.categoryList.length;i++){
	positionFn.innerHTML+='<a href="#">'+curData.categoryList[i].name+'</a> > ';
};
positionFn.innerHTML+=curData.name;


//产品图功能
(function(){
	//左边图片
	var bigImg=yx.g('#productImg .left img');
	var smallImgs=yx.ga('#productImg .smallImg img');
	
	bigImg.src=smallImgs[0].src=curData.primaryPicUrl;
	
	var last=smallImgs[0];
	for(var i=0;i<smallImgs.length;i++){
		if(i){
			smallImgs[i].src=curData.itemDetail['picUrl'+i];
		};
		
		smallImgs[i].index=i;
		smallImgs[i].onmouseover=function(){
			bigImg.src=this.src;
			last.className='';
			this.className='active';
			
			last=this;
		};
	};
	
	
	//右边产品信息
	yx.g('#productImg .info h2').innerHTML=curData.name;
	yx.g('#productImg .info p').innerHTML=curData.simpleDesc;
	yx.g('#productImg .info .price').innerHTML=`<div><span>售价</span><strong>￥${curData.retailPrice}.00</strong></div>
					<div><span>促销</span><a href="${curData.hdrkDetailVOList[0].huodongUrlPc}" class="tag">${curData.hdrkDetailVOList[0].activityType}</a><a href="${curData.hdrkDetailVOList[0].huodongUrlPc}" class="discount">${curData.hdrkDetailVOList[0].name}</a></div>
					<div><span>服务</span><a href="#" class="service"><i></i>30天无忧退货 <i></i>48小时快速退款<i></i>满88元包邮费<i></i>网易自营品牌</a></div>`;
					
	
	console.log(productList);
	//创建规格Dom
	var format=yx.g('#productImg .fomat');
	var dds=[];		//存储所有dd标签
	for(var i=0;i<curData.skuSpecList.length;i++){
		var dl=document.createElement('dl');
		var dt=document.createElement('dt');
		dt.innerHTML=curData.skuSpecList[i].name;
		dl.appendChild(dt);
		
		for(var j=0;j<curData.skuSpecList[i].skuSpecValueList.length;j++){
			var dd=document.createElement('dd');
			dd.innerHTML=curData.skuSpecList[i].skuSpecValueList[j].value;
			dd.setAttribute('data-id',curData.skuSpecList[i].skuSpecValueList[j].id);
			
			dd.onclick=function(){
				changeProduct.call(this);
			};
			
			dds.push(dd);
			dl.appendChild(dd);
		};
		format.appendChild(dl);
		
	};
	
	function changeProduct(){
		//点击准备
		if(this.className.indexOf('noClick')!=-1){
			return;
		};
		
		var curId=this.getAttribute('data-id');		//点击的dd
		var othersDd=[];							//对方的所有dd
		var mergeId=[];								//组合到的所有id
		
		for(var attr in curData.skuMap){
			if(attr.indexOf(curId)!=-1){
				
				var otherId=attr.replace(curId,'').replace(';','');
				
				for(var i=0;i<dds.length;i++){
					if(dds[i].getAttribute('data-id')==otherId){
						othersDd.push(dds[i]);
					};
				};
				
				mergeId.push(attr);
			};
		};
		
		
		//点击开始
		var brothers=this.parentNode.querySelectorAll('dd');
		if(this.className=='active'){
			//选中
			this.className='';
			for(var i=0;i<othersDd.length;i++){
				if(othersDd[i].className=='noClick'){
					othersDd[i].className='';
				};
			};
			
		}else{
			//未选中
			for(var i=0;i<brothers.length;i++){
				if(brothers[i].className=='active'){
					brothers[i].className='';
				};
			};
			this.className='active';
			
			for(var i=0;i<othersDd.length;i++){
				if(othersDd[i].className=='noClick'){
					othersDd[i].className='';
				};
				if(curData.skuMap[mergeId[i]].sellVolume==0){
					othersDd[i].className='noClick';
				};
				
			};
		};
		addNum();
	};
	
	
	//加减数量
	addNum();
	function addNum(){
		var actives=yx.ga('#productImg .fomat .active');
		var btnParent=yx.g('#productImg .number div');
		var btns=btnParent.children;
		var ln=curData.skuSpecList.length;
		
		//是否打开加减功能
		if(actives.length==ln){
			btnParent.className='';
		}else{
			btnParent.className='noClick';
		};
		
		btns[0].onclick=function(){
			if(btnParent.className){
				return;
			};
			btns[1].value--;
			if(btns[1].value<0){
				btns[1].value=0;
			};
		};
		
		btns[1].onfocus=function(){
			if(btnParent.className){
				this.blur();
			};
		};
		
		btns[2].onclick=function(){
			if(btnParent.className){
				return;
			};
			btns[1].value++;
			/*if(btns[1].value>curData.skuMap){
				btns[1].value=0;
			};*/
		};
	};
	
})();


//加入购物车
(function(){
	
})();


//大家都在看
(function(){
	var ul=yx.g('#look ul');
	var str='';
	
	for(var i=0;i<recommendData.length;i++){
		str+=`<li>
				<a href="#"><img src="${recommendData[i].listPicUrl}"/></a>
				<a href="#">${recommendData[i].name}</a>
				<span>￥${recommendData[i].retailPrice}</span>
			</li>`;
	};
	ul.innerHTML=str;
	
	var allLook=new Carousel();
	allLook.init({
		id:'allLook',
		autoplay:false,
		intervalTime:3000,
		loop:false,
		totalNum:8,
		moveNum:4,
		circle:false,
		moveWay:'position'
	});
})();


//详情功能
(function(){
	//评价与详情选项卡
	var as=yx.ga('#bottom .title a');
	var tabs=yx.ga('#bottom .content>div');
	var ln=0;
	
	for(var i=0;i<as.length;i++){
		as[i].index=i;
		as[i].onclick=function(){
			as[ln].className='';
			tabs[ln].style.display='none';
			
			this.className='active';
			tabs[this.index].style.display='block';
			
			ln=this.index;
		};
	};
	
	//详情内容产品参数
	var tbody=yx.g('.details tbody');
	for(var i=0;i<curData.attrList.length;i++){
		if(i%2==0){
			var tr=document.createElement('tr');
		};
		
		var td1=document.createElement('td');
		td1.innerHTML=curData.attrList[i].attrName;
		var td2=document.createElement('td');
		td2.innerHTML=curData.attrList[i].attrValue;
		
		tr.appendChild(td1);
		tr.appendChild(td2);
		tbody.appendChild(tr);
	};
	
	//详情图片列表
	var img=yx.g('.details .img');
	img.innerHTML=curData.itemDetail.detailHtml;
})();


//评价功能
(function(){
	var evealuateNum=commentData[pageId].data.result.length;	//当前评论的数量
	var evealuateText=evealuateNum>1000?'999+':evealuateNum;
	
	yx.ga('#bottom .title a')[1].innerHTML='评价<span> ('+evealuateText+') </span>';
	
	var allData=[[],[]];		//第一个全部评价，第二个有图的评价
	for(var i=0;i<evealuateNum;i++){
		allData[0].push(commentData[pageId].data.result[i]);
		
		if(commentData[pageId].data.result[i].picList.length){
			allData[1].push(commentData[pageId].data.result[i]);
		};
	};
	
	yx.ga('#bottom .eTitle span')[0].innerHTML='全部 ('+allData[0].length+')';
	yx.ga('#bottom .eTitle span')[1].innerHTML='有图 ('+allData[1].length+')';
	
	var curData=allData[0];
	var btns=yx.ga('#bottom .eTitle div');
	var ln=0;
	for(var i=0;i<btns.length;i++){
		btns[i].index=i;
		btns[i].onclick=function(){
			btns[ln].className='';
		
			this.className='active';
			ln=this.index;
			
			curData=allData[this.index];
			showComment(10,0);
			
			createPage(10,curData.length);		//生成页码
		};
	};
	
	
	//显示评价数据
	showComment(10,0);
	function showComment(pn,cn){
		//pn一页几行 cn当前页
		
		var ul=yx.g('#bottom .border>ul');
		var dataStart=pn*cn;		//起始值
		var dataEnd=dataStart+pn;	//结束值
		
		if(dataEnd>curData.length){
			dataEnd=curData.length;
		};
		
		//主体结构
		var str='';
		ul.innerHTML='';
		for(var i=dataStart;i<dataEnd;i++){
			var avatart=curData[i].frontUserAvatar?curData[i].frontUserAvatar:'images/avatar.png';
			var smallImg='';	//小图的父级
			var dialog='';		//轮播图的父级
			if(curData[i].picList.length){
				var span='';
				var li='';
				for(var j=0;j<curData[i].picList.length;j++){
					span+=`<span><img src="${curData[i].picList[j]}"/></span>`;
					li+=`<img src="${curData[i].picList[j]}"/>`;
				};
				smallImg=`<div class="smallImg clearfix">${span}</div>`;
				dialog=`<div class="dialog" id="commentImg${i}" data-imgnum="${curData[i].picList.length}">
							<div class="carouselImgCon">
								<ul>${li}</ul>
							</div>
							<div class="close">X</div>
						</div>`;
			};
			
			str+=`<li>
					<div class="avatar">
						<img src="${avatart}"/>
						<a href="#" class="vip1"></a>
						<span>${curData[i].frontUserName}</span>
					</div>
					<div class="text">
						<p>${curData[i].content}</p>
						${smallImg}
						<div class="color clearfix">
							<span class="left">
								${curData[i].skuInfo}
							</span>
							<span class="right">
								${yx.formatDada(curData[i].createTime)}
							</span>
						</div>
						${dialog}
					</div>
				</li>`;
		};
		
		ul.innerHTML=str;
		shouImg();
	};
	
	//轮播图
	function shouImg(){
		var spans=yx.ga('#bottom .smallImg span');
		
		for(var i=0;i<spans.length;i++){
			spans[i].onclick=function(){
				var dialog=this.parentNode.parentNode.lastElementChild;
				dialog.style.opacity=1;
				dialog.style.height='510px';
				
				var en=0
				dialog.addEventListener('transitionend',function(){
					en++;
					if(en==1){
						var id=this.id;
						var commentImg=new Carousel();
						commentImg.init({
							id:id,
							autoplay:false,
							intervalTime:3000,
							loop:false,
							totalNum:dialog.getAttribute('data-imgnum'),
							moveNum:1,
							circle:false,
							moveWay:'position'
						});
					};
				});
				
				var closeBtn=dialog.querySelector('.close');
				closeBtn.onclick=function(){
					dialog.style.opacity=0;
					dialog.style.height=0;
				};
			};
		};
	};
	
	
	//页码功能
	createPage(10,curData.length);
	function createPage(pn,tn){
		//pn 显示页码的数量
		//tn 数据的总数
		var page=yx.g('.page');
		var totalNum=Math.ceil(tn/pn);		//最多显示的页码数量
		
		//如果给的页数比总页数大,改成总页数
		if(pn>totalNum){
			pn=totalNum;
		};
		
		page.innerHTML='';
		
		var cn=0;	//当前点击的页码索引
		var spans=[];	//存储数字页码
		var div=document.createElement("div");
		div.className='minPage';
		
		//首页
		var indexPage=pageFn('首页',function(){
			for(var i=0;i<pn;i++){
				spans[i].innerHTML=i+1;
			};
			cn=0;
			showComment(10,0);
			changePage();
			
		});
		
		if(indexPage){	//页码小于2返回undefined,报错
			indexPage.style.display='none';
		};
		
		//上一页
		var prvePage=pageFn('<上一页',function(){
			cn--;
			if(cn<0){
				cn=0;
			};
			
			showComment(10,spans[cn].innerHTML-1);
			changePage();
		});
		
		if(prvePage){	
			prvePage.style.display='none';
		};
		
		
		//创建数字页码
		for(var i=0;i<pn;i++){
			var span=document.createElement("span");
			span.index=i;
			span.innerHTML=i+1;
			spans.push(span);
			//第一个选中
			span.className=i?'':'active';
			
			span.onclick=function(){
				cn=this.index;
				showComment(10,this.innerHTML-1);
				changePage();
			};
			
			div.appendChild(span);
		};
		page.appendChild(div);
		
		//下一页
		var nextPage=pageFn('下一页>',function(){
			/*cn++;
			if(cn>spans.length-1){
				cn=spans.length-1
			};*/
			
			if(cn<spans.length-1){
				cn++;
			};
			
			showComment(10,spans[cn].innerHTML-1);
			changePage();
		});
		
		//尾页
		var endPage=pageFn('尾页',function(){
			var end=totalNum;
			for(var i=pn-1;i>=0;i--){
				spans[i].innerHTML=end--;
			};
			cn=spans.length-1;
			
			showComment(10,totalNum-1);
			changePage();
		});
		
		//更新页码
		function changePage(){
			var cur=spans[cn];		//当前点击的页码(数字)
			var curInner=cur.innerHTML;	//存储当前页码内容 后面修改
			var differ=spans[spans.length-1].innerHTML-spans[0].innerHTML;	//差值
			
			//最后页码点击
			if(cur.index==spans.length-1){
				if(Number(cur.innerHTML)+differ>totalNum){
					differ=totalNum-cur.innerHTML;
				}
			};
			
			//最前页码点击
			if(cur.index==0){
				if(Number(cur.innerHTML)-differ<1){
					differ=cur.innerHTML-1;
				}
			};
			
			for(var i=0;i<spans.length;i++){
				//点击最后 页码
				if(cur.index==spans.length-1){
					spans[i].innerHTML=Number(spans[i].innerHTML)+differ;
				};
				
				//最前页码点击
				if(cur.index==0){
					spans[i].innerHTML-=differ;
				};
				
				//设置class
				spans[i].className='';
				if(spans[i].innerHTML==curInner){
					spans[i].className='active';
					cn=spans[i].index;
				};
				
			};
				
			//显示与隐藏功能页码
			if(pn>1){
				//点第一个页码时,隐藏上一页/首页
				var dis=curInner==1?'none':'inline-block';
				indexPage.style.display=prvePage.style.display=dis;
				
				//点最后面页码时,隐藏下一页/尾页
				var dis=totalNum==curInner?'none':'inline-block';
				nextPage.style.display=endPage.style.display=dis;
			};
		};
		
		
		
		//创建非数字页码的公用函数
		function pageFn(inner,fn){
			if(pn<2){	//页码小于2返回
				return;
			};
			var span=document.createElement("span");
			span.innerHTML=inner;
			span.onclick=fn;
			page.appendChild(span);
			
			return span;
		};
	};
	
})();
