/**
 * Created by lujwa on 15-12-30.
 */
define([
    'angular',
    'angular-ui-router',
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
    'slimscroll'
], function(angular) {
    angular.module('myApp.adminLTE', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/doc_start', {
            templateUrl: 'document/index.html'
        });
        $routeProvider.when('/index', {
            templateUrl: 'pages/index.html'
        });
        $routeProvider.when('/index2', {
            templateUrl: 'pages/index2.html'
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
        //表单
        $routeProvider.when('/forms/general', {
            templateUrl: 'pages/forms/general.html'
        });
        $routeProvider.when('/forms/advanced', {
            templateUrl: 'pages/forms/advanced.html'
        });
        $routeProvider.when('/forms/editors', {
            templateUrl: 'pages/forms/editors.html'
        });
        //tables
        $routeProvider.when('/tables/simple', {
            templateUrl: 'pages/tables/simple.html'
        });
        $routeProvider.when('/tables/data', {
            templateUrl: 'pages/tables/data.html'
        });
        //日历
        $routeProvider.when('/calendar', {
            templateUrl: 'pages/calendar.html'
        });
        //mailbox
        $routeProvider.when('/mailbox/mailbox', {
            templateUrl: 'pages/mailbox/mailbox.html'
        });
        $routeProvider.when('/mailbox/read-mail', {
            templateUrl: 'pages/mailbox/read-mail.html'
        });
        //example
        $routeProvider.when('/examples/invoice', {
            templateUrl: 'pages/examples/invoice.html'
        });
        $routeProvider.when('/examples/profile', {
            templateUrl: 'pages/examples/profile.html'
        });
        $routeProvider.when('/examples/login', {
            templateUrl: 'pages/examples/login.html'
        });
        $routeProvider.when('/examples/register', {
            templateUrl: 'pages/examples/register.html'
        });
        $routeProvider.when('/examples/login', {
            templateUrl: 'pages/examples/login.html'
        });
        $routeProvider.when('/examples/lockscreen', {
            templateUrl: 'pages/examples/lockscreen.html'
        });
        $routeProvider.when('/examples/404', {
            templateUrl: 'pages/examples/404.html'
        });
        $routeProvider.when('/examples/500', {
            templateUrl: 'pages/examples/500.html'
        });
        $routeProvider.when('/examples/blank', {
            templateUrl: 'pages/examples/blank.html'
        });
        $routeProvider.when('/examples/pace', {
            templateUrl: 'pages/examples/pace.html'
        });
        }]);
});