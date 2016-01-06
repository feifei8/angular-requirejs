/**
 * Created by wbchengs on 2016/1/6.
 */

define([
    'angular',
    'angular-md5',
],function(angular){
    angular.module('publicApi.Itapi',['angular-md5'],['$httpProvider',function($httpProvider){
        // 头部配置
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
        /**
         * 重写angular的param方法，使angular使用jquery一样的数据序列化方式  The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param =  function (obj) {
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
    }]).factory('Itapi',['$http','md5',function($http,md5){
        var baseUrl ='http://itapiway.yonyou.com/gateway/';
        var oauth={};
        //配置服务需要使用的appkey和apptoken
        oauth.Order={
            appKey:'YaYFr',
            appToken:'2a7ff348-d5bc-43a9-a8ab-f1898cbff028'
        }
        var getPar='';
        return {
            getData:function(paramas,callName,apiName,edition,oauthName,requestmethod){
                for(name in paramas){
                    getPar+='&'+name+'='+paramas[name]
                }
                if(edition==null||edition==undefined||edition==''){
                    //版本为空时，采用默认的版本号
                    edition='1.0';
                }else if(edition.indexOf('.')<0){
                    //当版本为整数时
                    edition=edition+'.0';
                }
                if(apiName==''||apiName==undefined||apiName==null){
                    console.log('调用方法不能为空');
                    return '调用方法不能为空';
                }
                if(callName==''||callName==undefined||callName==null){
                    console.log('请填写调用名称');
                    return '请填写调用名称';
                }
                if(oauthName==''||oauthName==undefined||oauthName==null){
                    console.log('请填写oatuth名称');
                    return '请填写oatuth名称';
                }
                var oauths= oauth[oauthName];//根据配置的oauth名获取oauth对象
                var time=Date.parse(new Date()).toString().substr(0, 10);
                var token =md5.createHash(oauths.appKey+time+oauths.appToken);
                var urls=baseUrl+callName+'/'+edition+'/'+apiName+'?resultType=json'+(getPar==''?'&':getPar)+'&oauth='+token+'&appKey='+oauths.appKey+'&timestamp='+time;
                if (requestmethod==''||requestmethod.toLowerCase()=='get'||requestmethod==undefined||requestmethod==null){
                    return $http.get(urls);
                }else{
                    var urls=baseUrl+callName+'/'+edition+'/'+apiName;
                    return $http.post(urls,paramas);
                }
              return  $http({
                    url:baseUrl,
                    method:'POST',
                    data:paramas,
                    headers:{'Content-Type':'application/x-www-form-urlencoded' },
                    transformRequest:function(obj){
                        var str=[];
                        for(var p in obj){
                            str.push(encodeURIComponent(p)+'='+encodeURIComponent(obj[p]));
                        }
                        return str.join('&');
                    }
                });
            }
        }
    }])
})

