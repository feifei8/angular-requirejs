/**
 * Created by Administrator on 15-12-28.
 */
define([
    'angular',
    'jquery',
    'angularRoute',
    'ngStorage',
    'ngCookies',
    'aboutCtrl'
 ], function(angular) {
    angular.module('myApp.home', ['ngRoute','aboutCtrl'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/about', {
                templateUrl: 'pages/userdemo/about.html',
                controller: 'aboutCtrl'
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