//公用方法调用
yx.public.navFn();
yx.public.lazyImgFn();
yx.public.backUpFn();


var bannerPic=new Carousel();
bannerPic.init({
	id:'bannerPic',
	autoplay:true,
	intervalTime:3000,
	loop:true,
	totalNum:5,
	moveNum:1,
	circle:true,
	moveWay:'opacity'
});


var newProduct=new Carousel();
newProduct.init({
	id:'newProduct',
	autoplay:false,
	intervalTime:3000,
	loop:false,
	totalNum:8,
	moveNum:4,
	circle:false,
	moveWay:'position'
});

newProduct.on('rightEnd',function(){
	//alert('右边到头了');
	this.nextBtn.style.background='#e7e2d7';
});
newProduct.on('leftEnd',function(){
	//alert('左边到头了');
	this.prevBtn.style.background='#e7e2d7';
});
newProduct.on('rightClick',function(){
	//alert('右边点击了');
	this.prevBtn.style.background='#d0c4af';
});
newProduct.on('leftClick',function(){
	//alert('左边点击了');
	this.nextBtn.style.background='#d0c4af';
});