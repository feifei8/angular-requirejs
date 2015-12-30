/**
 * Created by Administrator on 15-12-28.
 */
define([
    'angular'

   ], function (angular) {
angular.module("aboutCtrl",[])
   .controller("aboutCtrl", function ($scope) {
        $scope.Message = "About Us";
    });
});