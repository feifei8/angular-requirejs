/**
 * Created by wbchengs on 2016/1/8.
 */
/**
 * Created by wbchengs on 2015/12/31.
 */
define([
    'angular',
    'underscore',
    'angular-sanitize',
    'angular-ui-select',
    'ngtable',
    'publicGetData'
],function(angular,_){
    angular.module('myApp.Order.OrderManagerController',['publicApi.Itapi','ngTable','ui.select','ngSanitize'])
        .controller('orderCtrl',['Itapi','$scope','NgTableParams',
            function(Itapi,$scope,NgTableParams){
                /************非计算项目 ************/
                    //  ==========
                    //  = 对象 =
                    //  ==========
                $scope.AllOrderManagerList=[];//整体对象
                $scope.ContractData=null;//合同类型对象
                $scope.SaleType=null;//销售模式对象
                $scope.SaleTypeModel=null;//应用类型
                $scope.tableParams=null;//表格对象
                $scope.ProductLineData= null;//产品线数据对象
                $scope.productLine={};
                $scope.saleType={};
                $scope.ClientId={};
                $scope.saleTypeModel={};
                $scope.ProductData=null;//产品数据
                $scope.ProductModelData=[];//产品模块
                $scope.ClientInfo=null;//客户列表
                $scope.ProjectInfo=null;
                $scope.ManagerInfo=null;
                $scope.Project=null;
                $scope.ProjectManagerName=null;
                $scope.ManagerDep=null;
                $scope.ManagerCorp=null;
                $scope.daty=GetDate(1);
                $scope.isEditing={
                    isEditing:false,
                }
                $scope.isTableAddShow={
                    isShow:true
                }
                $scope.isDetailShow={
                    isShow:false
                }
                $scope.isSubmit={
                    isShow:false
                }
                /************计算项目 ************/
                $scope.RelCoustMoney=0.0;//成交价
                $scope.RelQuoteMoney=0.0;//折扣
                $scope.RelDiscountMoney=0.0;//总报价
                $scope.ProjectName=null;
                /* ========== 本地操作对象 ========== */
                var Orders=[];//订单对象
                var OrderManager={};
                var tempOrders=[];//临时订单数据，用于存储临撤销之前的订单数据。
                var OrderHistorys={};
               // var ClientId='HQ20120316000083'//暂定以后采用登录人获取方式

                /********************定义前端调用方法*******************/
                $scope.cancel=cancel;//行取消编辑
                $scope.tableAdd=tableAdd;//增加订单（表）
                $scope.tableCancle=tableCancle;//增加订单
                $scope.tableSave=tableSave;
                $scope.getProductModel=getProductModel;
                $scope.showOrder=showOrder;
                $scope.getProjectInfo=getProjectInfo;
                /**************行事件定义***************/
                $scope.rowSaveChange=rowSaveChange;
                $scope.rowDel=rowDel;
                $scope.changeDiscount=changeDiscount;
                /******************数据获取******************/
                var OrderHistory=window.localStorage.getItem('OrderHistory');
                if(OrderHistory!=null|OrderHistory!=undefined){
                   // console.log(JSON.parse(OrderHistory));
                    var temp =OrderHistory.split('|');
                    console.log(JSON.parse(temp[0]));
                    for(var i=0;i<temp.length;i++){
                        if(temp[i]!='')
                        {
                            $scope.AllOrderManagerList.unshift(JSON.parse(temp[i]));
                        }
                    }
                }
                //获取当前登录人员信息
                try{
                Itapi.getData({Keyword:'zhanglja'},'MDMPersonService','employee.getByKeyword','','Order','GET',false).success(function(data){
                    $scope.ManagerInfo=JSON.parse(data.message).Body.Employee;
                    var ManagerInfo={
                        ManagerID:$scope.ManagerInfo.PSNCode,
                        ClientID:'',
                        ClientName:'',
                        Sort:'',
                        PageIndex:0,
                        PageSize:0,
                        ReturnFields:''
                    };
                    Itapi.getData(ManagerInfo,'PSTClientService','client.getByManager','','Order','GET',false).success(function(data){
                        $scope.ClientInfo=JSON.parse(data.message).Body.Client;
                    });
                    Itapi.getData({PK_Corp:$scope.ManagerInfo.PK_Corp},'PSTClientService','project.get','','Order','GET',false).success(function(data){
                        $scope.ProjectInfo=JSON.parse(data.message).Body.Project;
                    });
                });}catch(e){
                    alert('基础数据获取失败！');
                    window.localStorage.setItem('Error',e.message);
                }
                //获取产品线数据
                Itapi.getData({},'PSTClientService','productLine.getAll','','Order','GET',false).success(function(data){
                    $scope.ProductLineData=JSON.parse(data.message).Body.ProductLine;
                });
                //获取产品
                Itapi.getData({},'PSTClientService','product.getAll','','Order','GET',false).success(function(data){
                    $scope.ProductData=JSON.parse(data.message).Body.Product;
                });
                //获取合同类型
                Itapi.getData({PK_Dictionary:'037'},'PSTClientService','dictionary.getOption','','Order','GET',false).success(function(data){
                    $scope.ContractData=JSON.parse(data.message).Body.DictionaryOption;
                });
                //获取基础数据中的销售类型
                Itapi.getData({PK_Dictionary:'003'},'PSTClientService','dictionary.getOption','','Order','GET',false).success(function(data){
                    $scope.SaleType=JSON.parse(data.message).Body.DictionaryOption;
                });
                //获取基础数据中的应用类型
                Itapi.getData({PK_Dictionary:'048'},'PSTClientService','dictionary.getOption','','Order','GET',false).success(function(data){
                    $scope.SaleTypeModel=JSON.parse(data.message).Body.DictionaryOption;
                });
                /**********************行定义事件*********************/
                function getProjectInfo(){
                    if($scope.ClientId.selected!=null) {
                        $scope.ProjectManagerName = $scope.ClientId.selected.ManagerName;
                        $scope.ManagerDep = $scope.ClientId.selected.DeptName;
                        $scope.ManagerCorp = $scope.ClientId.selected.CorpName;
                    }else{
                        $scope.ProjectManagerName =null;
                        $scope.ManagerDep = null;
                        $scope.ManagerCorp = null;
                    }
                }
                //改变折扣
                function changeDiscount(item){
                    if(item.StandardMoney!=0&&item.AcutalMoney!=0){
                        if(item.StandardMoney==item.AcutalMoney){
                            item.Discount=0.00;
                        }else{
                            item.Discount=parseFloat(((item.AcutalMoney/item.StandardMoney)*100).toFixed(2))
                        }
                    }
                }
                //行删除方法
                function rowDel(item){
                    for(var i=0;i<Orders.length;i++){
                        if(item.Id==Orders[i].Id){
                            Orders.splice(i,1);
                        }
                    }
                    tempOrders=angular.copy(Orders);
                    $scope.tableParams.settings().dataset=angular.copy(Orders);
                    $scope.tableParams.reload();
                }
                //行编辑保存事件
                function rowSaveChange(item,itemForm){
                    for(var i=0; i<Orders.length;i++){
                        if(Orders[i].Id === item.Id){
                            Orders[i].ProductLineName=item.ProductLineName;
                            Orders[i].ProductName=item.ProductName;
                            Orders[i].ProductModuleName=item.ProductModuleName;
                            Orders[i].AcutalMoney=item.AcutalMoney;
                            Orders[i].StandardMoney=item.StandardMoney;
                            Orders[i].Discount=item.Discount;
                        }
                    }
                    GetSum(Orders);
                    tempOrders=angular.copy(Orders);
                    item.isEditing=false;
                    $scope.isSubmit.isShow=true;
                    $scope.tableParams.settings().dataset=angular.copy(Orders);
                    $scope.tableParams.reload();
                }
                //  = 表格相关方法 =
                //表格整体增加数据*/
                function tableAdd(){
                    var Id=Orders[0]==undefined ?0:Orders[0].Id+1;
                    Orders.unshift({
                        Id:Id,
                        ProductLineName:'',
                        ProductLineId:'',
                        ProductName:'',
                        ProductID:'',
                        ProductModuleName:'',
                        ProductModuleID:'',
                        StandardMoney:0.0,
                        AcutalMoney:0.0,
                        Discount:0.0
                    });
                    $scope.isEditing.isEditing=true;
                    $scope.isTableAddShow.isShow=false;
                    if($scope.tableParams==null){
                        $scope.tableParams=new NgTableParams({count:5},{counts:[5,10,15,20]})
                    }
                    $scope.tableParams.settings().dataset=angular.copy(Orders);
                    $scope.tableParams.reload();
                };
                //表格数据还原操作
                function tableCancle(){
                    $scope.isEditing.isEditing=false;
                    $scope.isTableAddShow.isShow=true;
                    Orders=angular.copy(tempOrders);
                    $scope.tableParams.settings().dataset=angular.copy(tempOrders);
                    $scope.tableParams.reload();
                }
                //行还原指定行对象的数据
                function cancel(item,itemForm){
                    item.isEditing=false;
                    $scope.tableParams.settings().dataset=angular.copy(Orders);
                    $scope.tableParams.reload();
                }
                //表格添加
                function tableSave(){
                    var datas =$scope.tableParams.settings().dataset;
                    for(var i=0;i<datas.length;i++){
                        if(datas[i].ProductLineName==''){
                            alert("请选择产品线！");
                            return;
                        }
                        if(datas[i].ProductName==''){
                            alert("请选择产品！");
                            return;
                        }
                        if(datas[i].ProductModuleName=='')
                        {
                            alert("请选择产品模块！");
                            return;
                        }
                    }
                    Orders=angular.copy(datas);
                    GetSum(Orders);
                    tempOrders=angular.copy(Orders);
                    $scope.isEditing.isEditing=false;
                    $scope.isTableAddShow.isShow=true;
                    $scope.isSubmit.isShow=true;
                }

                //产品下拉时触发加载产品模块方法
                function getProductModel(item){
                    Itapi.getData({ProductID:item.ProductName.ProductID},'PSTClientService','productModule.getByProduct','','Order','GET',false).success(function(data){
                        var tempdata=JSON.parse(data.message).Body.ProductModule;
                        if(tempdata!=null||tempdata!=undefined){
                            item.ProductModuleName=undefined;
                            if(tempdata.length!=undefined||tempdata.length!=null){
                                $scope.ProductModelData=tempdata;
                            }else{
                                $scope.ProductModelData.push(tempdata);
                            }
                        }else{
                            item.ProductModuleName=undefined;
                            $scope.ProductModelData=[];
                        }
                    });
                }
                //展示数据
                function showOrder(){
                    //产品线不能为空
                    if($scope.productLine.selected==undefined){
                        alert("请选择合同类型！");
                        return;
                    }
                    //产品类型不能为空
                    if($scope.saleType.selected==undefined){
                        alert("请选择应用类型！");
                        return;
                    }
                    //产品模块不能为空
                    if($scope.saleTypeModel.selected==undefined){
                        alert("请选择销售模式！");
                        return;
                    }
                    if(Orders==null|Orders==undefined|Orders.length==0){
                        alert('请不要提交空订单！');
                        return;
                    }
                    OrderManager={};
                    OrderManager.Orders=ChangeOrder();
                    OrderManager.OrderId=parseInt(Math.random()*100000000);
                    OrderManager.ContractModel=$scope.productLine.selected;
                    OrderManager.SaleTypeModel=$scope.saleType.selected;
                    OrderManager.SaleTypeModuleModel=$scope.saleTypeModel.selected;
                    OrderManager.RelCoustMoney=$scope.RelCoustMoney;
                    OrderManager.RelQuoteMoney=$scope.RelQuoteMoney;
                    OrderManager.RelDiscountMoney=$scope.RelDiscountMoney;
                    $scope.AllOrderManagerList.unshift(OrderManager);
                    OrderHistorys=window.localStorage.getItem('OrderHistory');
                    OrderHistorys+=JSON.stringify(OrderManager)+"|";
                    window.localStorage.setItem('OrderHistory',OrderHistorys);
                    console.log($scope.AllOrderManagerList);
                    $scope.isDetailShow.isShow=true;
                    $scope.isSubmit.isShow=false;
                    var content ={};
                    content.PK_Project=$scope.ProjectInfo.PK_Project;
                    content.ProjectCode=$scope.ProjectInfo.ProjectCode;
                    content.ProjectName=$scope.ProjectName;
                    content.ClientID=$scope.ClientId.selected.ClientID;
                    content.StandardMoney=$scope.RelQuoteMoney;
                    content.AcutalMoney=$scope.RelCoustMoney;
                    content.Discount=$scope.RelDiscountMoney;
                    content.ManagerID=$scope.ManagerInfo.Email.substring(0,$scope.ManagerInfo.Email.indexOf('@'));
                    content.ManagerName=$scope.ManagerInfo.PSNname;
                    content.PK_Dept=$scope.ManagerInfo.PK_Dept;
                    content.DeptName=$scope.ManagerInfo.DeptName;
                    content.PK_Corp=$scope.ManagerInfo.PK_Corp;
                    content.CorpName=$scope.ManagerInfo.CorpName;
                    content.BusinessLine=$scope.saleType.selected.PK_Option;
                    content.BusinessLineText=$scope.saleType.selected.OptionText;
                    content.ProductLine=$scope.productLine.selected.PK_Option;
                    content.ProductLineText=$scope.productLine.selected.OptionText;
                    content.SaleMode=$scope.saleTypeModel.selected.PK_Option;
                    content.SaleModeText=$scope.saleTypeModel.selected.OptionText;
                    content.CreatorID=$scope.ManagerInfo.Email.substring(0,$scope.ManagerInfo.Email.indexOf('@'));
                    content.CreatorName=$scope.ManagerInfo.PSNname;
                    content.Requirement='';
                    content.Remark='';
                    content.Orders=ChangeOrder(Orders);
                   Itapi.getData({ProjectData:JSON.stringify(content)},'PSTClientService','project.update','','Order','POST',false).success(function(data){
                        console.log(data);
                        if(JSON.parse(data.message).Description=='项目信息保存成功'){
                            $scope.isDetailShow.isShow=true;
                            $scope.isSubmit.isShow=false;
                            alert('项目创建成功！');
                        }else{
                            alert('项目创建成功成功，同步未完成！');
                        }
                    });
                    Orders=[];
                    tempOrders=[];
                    $scope.tableParams.settings().dataset=angular.copy(Orders);
                    $scope.tableParams.reload();
                }
                //  = 公共方法 =

                //获取指定集合中指定的元素的总和
                function GetSum(datas){
                    var dismoney =0.0;
                    var qmoney=0.0;
                    var comoney=0.0;
                    for(var i=0;i<datas.length;i++){
                        dismoney+=parseFloat(datas[i]['Discount']);
                        qmoney+=parseFloat(datas[i]['StandardMoney']);
                        comoney+=parseFloat(datas[i]['AcutalMoney']);
                    }
                    $scope.RelQuoteMoney=qmoney;
                    $scope.RelDiscountMoney=dismoney;
                    $scope.RelCoustMoney=comoney;
                }
               //将订单的内容替换为单个对象
                function ChangeOrder(){
                    tempOrders=angular.copy(Orders);
                    for(var i=0;i<Orders.length;i++){
                        tempOrders[i].ProductID=tempOrders[i].ProductName.ProductID;
                        tempOrders[i].ProductLineId=tempOrders[i].ProductLineName.ProductLineID;
                        tempOrders[i].ProductModuleID=tempOrders[i].ProductModuleName.ProductModuleID;
                        tempOrders[i].ProductName=tempOrders[i].ProductName.ProductName;
                        tempOrders[i].ProductLineName=tempOrders[i].ProductLineName.ProductLineName;
                        tempOrders[i].ProductModuleName=tempOrders[i].ProductModuleName.ProductModuleName;
                    }
                    return tempOrders;
                }
                //获取当前系统时间
                function GetDate(type){
                    var da =new Date();
                    var year =da.getFullYear();
                    var month=da.getMonth()+1;
                    var day=da.getDate();
                    if(type==1){
                        return year+"年"+month+"月"+day+"日";
                    }else {
                        return year+'/'+month+'/'+day+' '+da.getHours()+':'+da.getMinutes()+':'+da.getSeconds();
                    }

                }
            }]);
});
