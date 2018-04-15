//公用方法调用
yx.public.navFn();
yx.public.backUpFn();

//url解析404
var params=yx.parseUrl(window.location.href);
var pageId=params.id;
var curData=productList[pageId];
/*if(!pageId || !curData){
	window.location.href='404.html';
};*/

//面包屑功能
var positionFn=yx.g('#position');
positionFn.innerHTML='<a href="#">首页</a> > ';
var curDataA=productList[1143021];
for(var i=0;i<curDataA.categoryList.length;i++){
	positionFn.innerHTML+='<a href="#">'+curDataA.categoryList[i].name+'</a> > ';
};
positionFn.innerHTML+=curDataA.name;