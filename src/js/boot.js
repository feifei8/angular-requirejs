/**
 * Created by lujwa on 15-12-25.
 */
require([
    'angular',
    'angularRoute',
    'router'
  ],

    function(angular){
    var $html =angular.element(document.getElementsByTagName('html')[0]);
    angular.element().ready(function() {
        // bootstrap the app manually
        angular.bootstrap(document, ['myApp']);
    });
});

