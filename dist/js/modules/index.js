/**
 * Created by Administrator on 15-12-26.
 */
'use strict';
define([
    'angular',
    'angularRoute',
    'jquery',
    'LTEapp',
    'demo'

], function(angular) {
    angular.module('myApp.index', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/index', {
                templateUrl: 'pages/index.html',
                controller: 'View1Ctrl'
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

         }])
        .controller('View1Ctrl', [function() {

        }]);
});

