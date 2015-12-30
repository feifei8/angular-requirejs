/**
 * Created by lujwa on 15-12-25.
 */
'use strict';

define([
    'angular',
    'angularRoute',
    'jquery',
    'bootstrap',
    'raphael',
    'knob-Chart',
    'sparkline',
    'LTEapp',
    'demo',
    'ionslider',
    'bootstrap-slider',
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
        //图表
        $routeProvider.when('/charts/chartjs', {
            templateUrl: 'pages/charts/chartjs.html'
        });
        $routeProvider.when('/charts/morris', {
            templateUrl: 'pages/charts/morris.html'
        });
        $routeProvider.when('/charts/flot', {
            templateUrl: 'pages/charts/flot.html'
        });
        $routeProvider.when('/charts/inline', {
            templateUrl: 'pages/charts/inline.html'
        });
        //UI
        $routeProvider.when('/UI/general', {
            templateUrl: 'pages/UI/general.html'
        });
        $routeProvider.when('/UI/icons', {
            templateUrl: 'pages/UI/icons.html'
        });
        $routeProvider.when('/UI/buttons', {
            templateUrl: 'pages/UI/buttons.html'
        });
        $routeProvider.when('/UI/sliders', {
            templateUrl: 'pages/UI/sliders.html'
        });
        $routeProvider.when('/UI/timeline', {
            templateUrl: 'pages/UI/timeline.html'
        });
        $routeProvider.when('/UI/modals', {
            templateUrl: 'pages/UI/modals.html'
        });

        $routeProvider.otherwise({redirectTo: '/index2'});
    }]);
});

