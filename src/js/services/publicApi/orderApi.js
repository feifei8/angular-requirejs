/**
 * Created by wbchengs on 2015/12/30.
 */
define([
    'angular'
],function(angular){
angular.module('myApp.PublicApi.OrderApi',[]).factory('orderapiservice',['$http',function($http){
    var baseUrl='http://itapiway.yonyou.com/gateway/PSTClientService/1.0/';
    return {
        directionaryUrl:baseUrl+'dictionary.getAll',
        dictionarygetOption:baseUrl+'dictionary.getOption',
        productLinegetAll:baseUrl+'productLine.getAll',
        productgetAll:baseUrl+'product.getAll',
        productModulegetByProduct:baseUrl+'productModule.getByProduct',
        clientgetByManager:baseUrl+'client.getByManager',
        projectgetByManager:baseUrl+'project.getByManager',
        projectDetailgetByProject:baseUrl+'projectDetail.getByProject',
        projectupdate:baseUrl+'project.update',
        projectDetailupdate:baseUrl+'projectDetail.update',
        flowOwnergetByStep:baseUrl+'flowOwner.getByStep',
        orderJsonUrl:'../../dist/json/OrderData.json'
    }
}]);
});

