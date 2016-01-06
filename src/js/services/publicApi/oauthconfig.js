/**
 * Created by wbchengs on 2016/1/6.
 * 配置密钥和token服务，获取时使用名称进行调用
 */
define([
    'angular',
    'underscore'
],function(angular,_){
    angular.module('publicapi.getOauth',[]).factory('getOauth',[function(){
        var oauth={};
        //配置服务需要使用的appkey和apptoken
        oauth.Order={
            appKey:'YaYFr',
            appToken:'2a7ff348-d5bc-43a9-a8ab-f1898cbff028'
        }
        return{
            getOauth:function(oauthName){
                return oauth[oauthName];
            }
        }
    }]);
});