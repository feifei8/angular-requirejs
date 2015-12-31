/**
 * Created by lujwa on 15-12-25.
 */
require.config({
    baseUrl:'src/js',           //依赖相对路径
    paths:{
        //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
        'jquery': '../../public/lib/jQuery/jQuery',
        'morris':'../../plugins/morris/morris.min',
        'sparkline':'../../plugins/sparkline/jquery.sparkline.min',
        'jvectormap':'../../plugins/jvectormap/jquery-jvectormap-1.2.2.min',
        'jvectormap-world':'../../plugins/jvectormap/jquery-jvectormap-world-mill-en',
        'knob-Chart':'../../plugins/knob/jquery.knob',
        'daterangepicker':'../../plugins/daterangepicker/daterangepicker',
        'bootstrap-datepicker':'../../plugins/datepicker/bootstrap-datepicker',
        'bootstrap3-wysihtml5':'../../plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all',
        'slimscroll':'../../plugins/slimScroll/jquery.slimscroll.min',
        'fastclick':'../../plugins/fastclick/fastclick',
        'daterangepicker_deps':'../../plugins/daterangepicker/moment',
        'Chart':'../../plugins/chartjs/Chart.min',
        'html5shiv':'https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min',
        'respond':'https://oss.maxcdn.com/respond/1.4.2/respond.min',
        'jquery-ui':'../../public/lib/jquery-ui/jquery-ui',
        'raphael':'../../public/lib/raphael/raphael',
        //angularjs
        'angular': '../../public/lib/angular/angular',
        'angularRoute': '../../public/lib/angular-route/angular-route',
        'angular-ui':'../../public/lib/angular-ui/angular-ui',
        'angular-ui-router':'../../public/lib/angular-ui-router/angular-ui-router',
        //bootstrap文件
        'bootstrap': "../../public/lib/bootstrap/bootstrap",
        //adminLTE
        'LTEapp': '../../public/lib/AdminLTE/app',
        'dashboard':'../../dist/js/pages/dashboard',
        'dashboard2':'../../dist/js/pages/dashboard2',
        'demo':'../../dist/js/demo',
        'ionslider':'../../plugins/ionslider/ion.rangeSlider.min',
        'bootstrap-slider':'../../plugins/bootstrap-slider/bootstrap-slider',
        //user_demo

        'ngStorage': '../../public/lib/angularLocalStorage/angularLocalStorage',
        'ngCookies': '../../public/lib/angular-cookies/angular-cookies',

        //USER DEMO
        'service': 'serRvices/service',
        'homeCtrl': "controllers/homeCtrl",
        'aboutCtrl': "controllers/accountCtrl",
        'homeModule':"modules/homeModule",
        //'filter': "js/filters/filter"
        //ADMINLTE_MODULES
        'adminLTEmodule':"modules/adminLTE",
        //order
        //orderModule
        'ordermodule':'modules/ordermodule',
        //MD5加密文件
        'angular-md5':'../../public/lib/angular-md5/angular-md5',
        //ngtable表格
        'ngtable':'../../plugins/ngtable/ngtable.v1.0.0',
        'underscore':'../../plugins/Underscore/underscore-min',
        //service
        //订单api服务
        'publicApi':'services/publicApi/orderApi',
        //订单服务
        'orderservice':'services/order/orderservice',
        //undscoreservice
        'underscoreservice':'services/publicTools/underscoreservice',
        //controller
        'orderCtrl':'controllers/order/orderctrl'

},
    shim:{
        //引入没有使用requirejs模块写法的类库。例如underscore这个类库，本来会有一个全局变量'_'。这里shim等于快速定义一个模块，
        // 把原来的全局变量'_'封装在局部，并导出为一个exports，变成跟普通requirejs模块一样

        'angular':{
            exports:'angular'
        },
        'angularRoute':{
            deps:['angular','jquery'],
            exports: 'angular'
        },
        'underscore':{
            exports: '_'
        },
        'angular-ui-router': {
            deps: ['angular'],
            exports: 'angular'
        },
        ngStorage: {
            deps: ['angular'],
            exports: 'angular'
        },
        ngCookies: {
            deps: ['angular'],
            exports: 'angular'
        },
        'bootstrap': {
            "deps" :['jquery']
        },
        'LTEapp':{
            "deps" :['jquery','bootstrap']
        },
        'demo':{
            "deps" :['jquery','bootstrap']
        },
        'ionslider':{
            "deps" :['jquery']
        },
        'slimscroll':{
            "deps" :['jquery']
        }
        //'bootstrap-slider':{
        //    "deps" :['jquery']
        //}


},
    priority: [
        "angular"
    ],
    deps:['boot'],
    urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});
