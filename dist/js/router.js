/**
 * Created by lujwa on 15-12-25.
 */
'use strict';

define([
    'angular',
    'angularRoute',
    'jquery',
    'bootstrap',
    'LTEapp',
    'demo',
    'modules/index',
    'modules/index2'

], function(angular, angularRoute, index, index2) {
    // Declare app level module which depends on views, and components
    return angular.module('myApp', [
        'ngRoute',
        'myApp.index',
        'myApp.index2'
    ]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/doc_start', {
            templateUrl: 'document/index.html'
            //controller: 'View1Ctrl'
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
        $routeProvider.when('/layout/boxed', {
            templateUrl: 'pages/layout/boxed.html'
        });
        $routeProvider.when('/layout/fixed', {
            templateUrl: 'pages/layout/fixed.html'
        });
        $routeProvider.when('/layout/collapsed-sidebar', {
            templateUrl: 'pages/layout/collapsed-sidebar.html'
        });
        $routeProvider.when('/widgets', {
            templateUrl: 'pages/widgets.html'
        });
        $routeProvider.otherwise({redirectTo: '/index2'});
    }]);
});

