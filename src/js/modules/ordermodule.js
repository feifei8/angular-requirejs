/**
 * Created by wbchengs on 2015/12/30.
 */
define([
    'angular',
    'jquery',
    'angularRoute',
    'ngStorage',
    'ngCookies',
    'orderCtrl'
], function(angular) {
    angular.module('myApp.order', ['ngRoute','myApp.orderctrl'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/order', {
                templateUrl: 'pages/order/index.html',
                controller: 'orderCtrl'

            });

        }]);

});