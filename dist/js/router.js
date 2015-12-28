/**
 * Created by Administrator on 15-12-25.
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
        $routeProvider.otherwise({redirectTo: '/index2'});
    }]);
});

