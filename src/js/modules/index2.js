/**
 * Created by Administrator on 15-12-26.
 */
'use strict';
define([
    'angular',
    'angularRoute',
    'jquery'

], function(angular) {
    angular.module('myApp.index2', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/index2', {
                templateUrl: 'pages/index2.html',
                controller: 'View2Ctrl'
            });
        }])
        // We can load the controller only when needed from an external file
        .controller('View2Ctrl', ['$scope', '$injector', function($scope, $injector) {
            require(['/ctrl2'], function(ctrl2) {
                // injector method takes an array of modules as the first argument
                // if you want your controller to be able to use components from
                // any of your other modules, make sure you include it together with 'ng'
                // Furthermore we need to pass on the $scope as it's unique to this controller
                $injector.invoke(ctrl2, this, {'$scope': $scope});
            });
        }]);
});
