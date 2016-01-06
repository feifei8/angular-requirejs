/**
 * Created by wbchengs on 2015/12/30.
 */
define([
    'angular',
    'angular-md5',
    'publicApi'
],function(angular){
    angular.module('myApp.Order.OrderService',['angular-md5','myApp.PublicApi.OrderApi'],['$httpProvider',function($httpProvider){
            // 头部配置
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
            $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
            $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

            /**
             * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null)
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function (data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];
    }]).factory('orderservice',['$http','md5','orderapiservice', function($http,md5,orderapiservice){
            var appkey="YaYFr";
            var appTolen="2a7ff348-d5bc-43a9-a8ab-f1898cbff028";
            var time = Date.parse(new Date()).toString().substr(0, 10);
            //调用angularMD5进行加密
            var oauth = md5.createHash(appkey+time+appTolen);
            function getRequestUrl(name,parmename,parme){
                if(parmename==null ||parmename==''||parmename==undefined)
                {
                    return name+'?resultType=json&&oauth='+oauth+'&appKey='+appkey+'&timestamp='+time;
                }else{
                    return name+'?resultType=json&'+parmename+'='+parme+'&oauth='+oauth+'&appKey='+appkey+'&timestamp='+time;
                }
            }
            return {
                //获取订单信息
                getOrderData:function(){
                    return $http.get(orderapiservice.orderJsonUrl);
                },
                //获取产品线
                getCpsxData:function(){
                    return $http.get(getRequestUrl(orderapiservice.productLinegetAll));
                },
                //获取产品
                getCpData:function(){
                    return $http.get(getRequestUrl(orderapiservice.productgetAll));
                },
                getProductModule:function(productid){
                    return $http.get(getRequestUrl(orderapiservice.productModulegetByProduct,'ProductID',productid));
                },
                getOptions: function (pk) {
                    return $http.get(orderapiservice.dictionarygetOption + '?resultType=json&PK_Dictionary='+pk+'&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
                },
                getClientByManager:function(managerid){
                    return $http.get(orderapiservice.clientgetByManager+ '?resultType=json&ManagerID='+managerid+
                            '&ClientID=&ClientName=&Sort=&PageIndex=0&PageSize=0&ReturnFields=&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
                },
                getProjectByManager:function(Managerid,ClientId,ClientName,ProjectCode,ProjectName,Sort,PageIndex,PageSize,ReturnFields){
                    return $http.get(orderapiservice.projectgetByManager+'?resultType=json&ManagerID='+Managerid+
                       '&ClientId='+ClientId+ '&ClientName='+ClientName+ '&ProjectCode='+ProjectCode+ '&ProjectName='+ProjectName
                       + '&Sort='+Sort+ '&PageIndex='+PageIndex+'&PageSize='+PageSize+'&ReturnFields='+ReturnFields
                       +'&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
                },
                getProject:function(pkcorp,pkproject){
                return $http.get(orderapiservice.projectget+ '?resultType=json&PK_Corp='+pkcorp+'&PK_Project='
                    +pkproject+'&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time);
                },
                getManagerInfoBySpid:function(spid){
                    return $http.get(orderapiservice.employeegetByKeyword+'?resultType=json&Keyword='+spid
                        +'&oauth=' + oauth + '&appKey=' + appkey + '&timestamp=' + time
                    );
                },
                projetUpdate:function(parmes){
                    var formData=new Object();
                    formData["resultType"]="json";
                    formData["ProjectData"]=JSON.stringify(parmes);
                    formData["oauth"]=oauth;
                    formData["appKey"]=appkey;
                    formData["timestamp"]=time;
                    return $http.post(orderapiservice.projectupdate,formData);
                }
            }
        }]);


});
