angular.module('Order.OrderManagerService',[]).factory('orderManagerService',['$http','MD5Service',function($http,MD5Service){
	var orderDataUrl='../../src/json/OrderData.json';
	var orderCpsxDataUrl='../../src/json/productLine.json';
	var orderCpDataUrl='../../src/json/products.json';
	
	var appkey="YaYFr";
	var appTolen="2a7ff348-d5bc-43a9-a8ab-f1898cbff028";
	var time = Date.parse(new Date()).toString().substr(0, 10);
	var times ="1451266715";
	var directionaryUrl='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/dictionary.getAll';
	var dictionarygetOption='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/dictionary.getOption';
	var productLinegetAll='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/productLine.getAll';
	var productgetAll='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/product.getAll';
	var productModulegetByProduct='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/productModule.getByProduct';
	var clientgetByManager='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/client.getByManager';
	var projectgetByManager='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/project.getByManager';
	var projectDetailgetByProject='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/projectDetail.getByProject';
	var projectupdate='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/project.update';
	var projectDetailupdate='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/projectDetail.update';
	var flowOwnergetByStep='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/flowOwner.getByStep';
	//等待MD5加密
	var oauth=MD5Service.md5(appkey+times+appTolen);
	var requestUrl=productLinegetAll+'?resultType=json&&oauth='+oauth+'&appKey='+appkey+'&timestamp'+time;
	function getRequestUrl(name,parmename,parme){
		if(parmename==null ||parmename==''||parmename==undefined)
		{
			return name+'?resultType=json&&oauth='+oauth+'&appKey='+appkey+'&timestamp='+times;
		}else{
			return name+'?resultType=json&'+parmename+'='+parme+'&oauth='+oauth+'&appKey='+appkey+'&timestamp='+times;
		}
	}
	return {
		//获取订单信息
		getOrderData:function(){
			return $http.get(orderDataUrl);
		},
		//获取产品线
		getCpsxData:function(){
			return $http.get(getRequestUrl(productLinegetAll));
		},
		//获取产品
		getCpData:function(){
			return $http.get(getRequestUrl(productgetAll));
		},
		getProductModule:function(productid){
			return $http.get(getRequestUrl(productModulegetByProduct,'ProductID',productid));
		},   
		getOptions: function (pk) {
            var time = Date.parse(new Date()).toString().substr(0, 10);
            var oauth = MD5Service.md5(appkey + time + appTolen);
            return $http.get(dictionarygetOption + '?resultType=json&PK_Dictionary='+pk+'&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
	    }
//      //获取产品线
//      getCpsxData: function () {
//          var time = Date.parse(new Date()).toString().substr(0, 10);
//          var oauth = MD5Service.md5(appkey + time + appTolen);
//          return $http.get(productLinegetAll + '?resultType=json&&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
//      },
//      //获取产品
//      getCpData: function (cpsxid) {
//          var time = Date.parse(new Date()).toString().substr(0, 10);
//          var oauth = MD5Service.md5(appkey + time + appTolen);
//          return $http.get(productgetAll + '?resultType=json&&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
//      },
//      //获取模块
//      getModule: function (productid) {
//          var time = Date.parse(new Date()).toString().substr(0, 10);
//          var oauth = MD5Service.md5(appkey + time + appTolen);
//          return $http.get(productModulegetByProduct + '?resultType=json&ProductID=' + pk + '&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
//      }
	}
}]);
