/**
 * Created by wbchengs on 2015/12/30.
 */
define([
    'angular',
    'jquery',
    'angularRoute',
    'ngStorage',
    'ngCookies',
    'orderCtrl',

], function(angular) {
    angular.module('myApp.home.order', ['ngRoute','myApp.Order.OrderManagerController'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/order', {
                templateUrl: 'pages/order/index.html',
                controller: 'orderCtrl'
                //resolve: {
                //    delay: function($q) {
                //        var delay = $q.defer(),
                //            load = function(){
                //                $.getScript('dist/js/pages/dashboard.js',function(){
                //                    delay.resolve();
                //                });
                //            };
                //        load();
                //        return delay.promise;
                //    }
                //
                //}
            });

        }]);

});