/**
 * Created by wbchengs on 2015/12/31.
 */
define([
    'angular',
    'underscore'
],function(angular){
   angular.module('UnderscoreService',[]).factory('_',[function(){
        return window._;
   }]);
});

