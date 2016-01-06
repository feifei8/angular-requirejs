/**
 * Created by wbchengs on 2016/1/6.
 */
define([
    'angular',
    'oauthService'
],function(angular){
 angular.module('publicapi.postDataLikeJq',[],['$httpProvider',function($httpProvider){
     // 头部配置
     $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
     $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
     $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
     /**
      * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
      * @param {Object} obj
      * @return {String}
      */
     var param = function (obj) {
         var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
         for (name in obj) {
             value = obj[name];
             if (value instanceof Array) {
                 for (i = 0; i < value.length; ++i) {
                     subValue = value[i];
                     fullSubName = name + '[' + i + ']';
                     innerObj = {};
                     innerObj[fullSubName] = subValue;
                     query += param(innerObj) + '&';
                 }
             }
             else if (value instanceof Object) {
                 for (subName in value) {
                     subValue = value[subName];
                     fullSubName = name + '[' + subName + ']';
                     innerObj = {};
                     innerObj[fullSubName] = subValue;
                     query += param(innerObj) + '&';
                 }
             }
             else if (value !== undefined && value !== null)
                 query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
         }

         return query.length ? query.substr(0, query.length - 1) : query;
     };

     // Override $http service's default transformRequest
     $httpProvider.defaults.transformRequest = [function (data) {
         return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
     }];
 }]).factory('postDataLikeJq'[function(){
        var baseUrl=''
 }]);
});
