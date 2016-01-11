/**
 * Created by wbchengs on 2016/1/6.
 */

define([
    'angular',
    'angular-md5',
],function(angular){
    angular.module('publicApi.Itapi',['angular-md5']).factory('Itapi',['$http','md5',function($http,md5){
        var baseUrl ='http://itapiway.yonyou.com/gateway/';
        var oauth={};
        //配置服务需要使用的appkey和apptoken
        oauth.Order={
            appKey:'YaYFr',
            appToken:'2a7ff348-d5bc-43a9-a8ab-f1898cbff028'
        }
        return {
            //paramas   参数对象，必须为对象的实例 例如：{ManagerId:'2342'},异常提示：参数必须为对象 无参数式采用传空对象{}
            //callName  api平台接口调用名称 例如：审批系统测试服务调用名:PSTClientService，非空
            //apiName   api平台服务方法名称，例如：获取数据字典列表：dictionary.getAll 非空
            //edition   api平台服务版本号，例如：1或1.5 可为空，为空时将采用默认值1.0
            //oauthName api平台下申请的服务验证密钥，在服务中进行配置完毕后使用名称进行调用。如使用上面配置的订单服务的密钥：Order 非空
            //requestmethod 请求方式，GET或POST 为空时将采用默认的GET方式进行请求  非空
            //isStream  是否采用stream流的方式进行传送数据，仅对POST请求方式有效 值为false采用普通方式传送数据，值为true采用stream流进行发送 非空
            getData:function(paramas,callName,apiName,edition,oauthName,requestmethod,isStream){
                var getPar='';
                if(paramas instanceof Object){
                    for(name in paramas){
                        getPar+='&'+name+'='+paramas[name]
                    }
                }else {
                    console.log('参数必须为对象');
                    return '参数必须为对象'
                }
                if(callName==''||callName==undefined||callName==null){
                    console.log('请填写调用名称');
                    return '请填写调用名称';
                }
                if(apiName==''||apiName==undefined||apiName==null){
                    console.log('调用方法不能为空');
                    return '调用方法不能为空';
                }
                if(edition==null||edition==undefined||edition==''){
                    //版本为空时，采用默认的版本号
                    edition='1.0';
                }else if(edition.indexOf('.')<0){
                    //当版本为整数时
                    edition=edition+'.0';
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
                }else if(isStream){
                    var urls=baseUrl+callName+'/'+edition+'/'+apiName;
                    paramas.resultType='json';
                    paramas.oauth=token;
                    paramas.appKey=oauths.appKey;
                    paramas.timestamp=time;
                    return $http.post(urls,paramas);
                }else{
                    paramas.resultType='json';
                    paramas.oauth=token;
                    paramas.appKey=oauths.appKey;
                    paramas.timestamp=time;
                    return  $http({
                        url:baseUrl+callName+'/'+edition+'/'+apiName,
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
        }
    }])
})

