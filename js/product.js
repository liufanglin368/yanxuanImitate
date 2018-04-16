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
