/**
 * Created by wbchengs on 2015/12/30.
 */
define([

    'angular',
    'angular-md5',
    'publicApi'
],function(angular){
    angular.module('myApp.Order.OrderService',['angular-md5','myApp.PublicApi.OrderApi'])
        .factory('orderservice',['$http','md5','orderapiservice', function($http,md5,orderapiservice){
            var appkey="YaYFr";
            var appTolen="2a7ff348-d5bc-43a9-a8ab-f1898cbff028";
            var time = Date.parse(new Date()).toString().substr(0, 10);
            //调用angularMD5进行加密
            var oauth = md5.createHash(appkey+time+appTolen);
            function getRequestUrl(name,parmename,parme){
                if(parmename==null ||parmename==''||parmename==undefined)
                {
                    return name+'?resultType=json&&oauth='+oauth+'&appKey='+appkey+'&timestamp='+time;
                }else{
                    return name+'?resultType=json&'+parmename+'='+parme+'&oauth='+oauth+'&appKey='+appkey+'&timestamp='+time;
                }
            }
            return {
                //获取订单信息
                getOrderData:function(){
                    return $http.get(orderapiservice.orderJsonUrl);
                },
                //获取产品线
                getCpsxData:function(){
                    return $http.get(getRequestUrl(orderapiservice.productLinegetAll));
                },
                //获取产品
                getCpData:function(){
                    return $http.get(getRequestUrl(orderapiservice.productgetAll));
                },
                getProductModule:function(productid){
                    return $http.get(getRequestUrl(orderapiservice.productModulegetByProduct,'ProductID',productid));
                },
                getOptions: function (pk) {
                    return $http.get(orderapiservice.dictionarygetOption + '?resultType=json&PK_Dictionary='+pk+'&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
                },
                getClientByManager:function(managerid){
                    return $http.get(orderapiservice.clientgetByManager+ '?resultType=json&ManagerID='+managerid+
                            '&ClientID=""&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
                },
                getProjectByManager:function(Managerid){
                    return $http.get(orderapiservice.projectgetByManager+'?resultType=json&ManagerID='+managerid
                        +'&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
                }
            }
        }]);


});
