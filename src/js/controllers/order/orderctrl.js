/**
 * Created by wbchengs on 2015/12/31.
 */
define([
    'angular',
    'underscore',
    'ngtable',
    'orderservice'

],function(angular,_){
angular.module('myApp.orderctrl',['myApp.Order.OrderService','ngTable'])
    .controller('orderCtrl',['orderservice','$scope','NgTableParams',
        function(orderservice,$scope,NgTableParams){
           // _.each([1, 2, 3], alert);
        /************非计算项目 ************/
            //  ==========
            //  = 对象 =
            //  ==========
        $scope.AllOrderManagerList=[];//整体对象

        $scope.ContractData=null;//合同类型对象
        $scope.SaleType=null;//销售模式对象
        $scope.SaleTypeModel=null;//应用类型
        $scope.tableParams=null;//表格对象
        $scope.ProductLineData= null;
        $scope.ProductData=null;
        $scope.ProductModelData=[];
        $scope.daty=GetDate();
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

        /* ========== 本地操作对象 ========== */
        var Orders=[];//订单对象
        var OrderManager={};
        var tempOrders=[];//临时订单数据，用于存储临撤销之前的订单数据。

        /********************定义前端调用方法*******************/
        $scope.cancel=cancel;//行取消编辑
        $scope.tableAdd=tableAdd;//增加订单（表）
        $scope.tableCancle=tableCancle;//增加订单
        $scope.tableSave=tableSave;
        $scope.getProductModel=getProductModel;
        $scope.showOrder=showOrder;
        /**************行事件定义***************/
        $scope.rowSaveChange=rowSaveChange;
            $scope.rowDel=rowDel;
            $scope.changeDiscount=changeDiscount;
        /******************数据获取******************/

            //获取产品线数据
        orderservice.getCpsxData().success(function(data){
            $scope.ProductLineData=JSON.parse(data.message).Body.ProductLine;
        });
            orderservice.getCpData().success(function(data){
            $scope.ProductData=JSON.parse(data.message).Body.Product;
        });
        //获取合同类型
            orderservice.getOptions("037").success(function (data) {
            $scope.ContractData=JSON.parse(data.message).Body.DictionaryOption;
        });
        //获取基础数据中的销售类型
            orderservice.getOptions("003").success(function (data) {
            $scope.SaleType=JSON.parse(data.message).Body.DictionaryOption
        });
        //获取基础数据中的应用类型
            orderservice.getOptions("048").success(function (data) {
            $scope.SaleTypeModel=JSON.parse(data.message).Body.DictionaryOption;
        });
        /*****************表格操作****************/
            //获取订单数据并初始化表格
        orderservice.getOrderData().success(function(data){
            tempOrders=angular.copy(data);
            Orders=angular.copy(data);
            GetSum(data);
            $scope.tableParams=new NgTableParams({count:5},{
                counts:[5,10,15,20],
                dataset:angular.copy(data)
            });
        });
        /***********************方法*********************/
        /**********************行定义事件*********************/
        function changeDiscount(item){
            if(item.RelCost!=0&&item.Quote!=0){
                item.Discount=parseFloat(((item.RelCost/item.Quote)*100).toFixed(2))
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
            console.log(item);
            var productlimemodel=GetProcuctLineModel(item.ProductLineName);
            var prodoctmodel=GetProductModel(item.ProductName);
            var prodoctmoduleModel=GetProductModuleModle(item.ProductModuleName);
            for(var i=0; i<Orders.length;i++){
                if(Orders[i].Id === item.Id){
                    Orders[i].ProductLineName=productlimemodel.ProductLineName;
                    Orders[i].ProductLineId=productlimemodel.ProductLineID;
                    Orders[i].ProductName=prodoctmodel.ProductName;
                    Orders[i].ProductID=prodoctmodel.ProductID;
                    Orders[i].ProductModuleName=prodoctmoduleModel.ProductModuleName;
                    Orders[i].ProductModuleID=prodoctmoduleModel.ProductModuleID;
                    Orders[i].Quote=item.Quote;
                    Orders[i].RelCost=item.RelCost;
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
                Quote:0.0,
                RelCost:0.0,
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
            for(var i=0;i<Orders.length;i++){
                if(Orders[i].ProductLineId==''){
                    var productlimemodel=GetProcuctLineModel(Orders[i].ProductLineName);
                    var prodoctmodel=GetProductModel(Orders[i].ProductName);
                    var prodoctmoduleModel=GetProductModuleModle(Orders[i].ProductModuleName);
                    Orders[i].ProductLineId=productlimemodel.ProductLineID;
                    Orders[i].ProductID=prodoctmodel.ProductID;
                    Orders[i].ProductModuleID=prodoctmoduleModel.ProductModuleID;
                }
            }
            GetSum(Orders);
            tempOrders=angular.copy(Orders);
            $scope.isEditing.isEditing=false;
            $scope.isTableAddShow.isShow=true;
            $scope.isSubmit.isShow=true;
        }

        //产品下拉时触发加载产品模块方法
        function getProductModel(productName){
            var producrModel =_.find($scope.ProductData,function(r){
                return r.ProductName==productName;
            });
            orderservice.getProductModule(producrModel.ProductID).success(function(data){
                var tempdata=JSON.parse(data.message).Body.ProductModule;
                if(tempdata!=null||tempdata!=undefined){
                    if(tempdata.length!=undefined||tempdata.length!=null){
                        $scope.ProductModelData=tempdata;
                    }else{
                        $scope.ProductModelData.push(tempdata);
                    }
                }else{
                    $scope.ProductModelData=[];
                }
            });
        }
        function showOrder(){
            if($scope.productLine==undefined){
                alert("请选择合同类型！");
                return;
            }
            if($scope.saleType==undefined){
                alert("请选择应用类型！");
                return;
            }
            if($scope.saleTypeModel==undefined){
                alert("请选择销售模式！");
                return;
            }
            OrderManager={};
            OrderManager.Orders=Orders;
            OrderManager.OrderId=parseInt(Math.random()*100000000);
            OrderManager.ContractModel=_.find($scope.ContractData,{OptionText:$scope.productLine});
            OrderManager.SaleTypeModel=_.find($scope.SaleType,{OptionText:$scope.saleType});;
            OrderManager.SaleTypeModuleModel=_.find($scope.SaleTypeModel,{OptionText:$scope.saleTypeModel});;
            OrderManager.RelCoustMoney=$scope.RelCoustMoney;
            OrderManager.RelQuoteMoney=$scope.RelQuoteMoney;
            OrderManager.RelDiscountMoney=$scope.RelDiscountMoney;
            $scope.AllOrderManagerList.unshift(OrderManager);
            console.log($scope.AllOrderManagerList);
            $scope.isDetailShow.isShow=true;
            $scope.isSubmit.isShow=false;
            var content ={};
            content.userName='lujwa';
            content.time='2016-01-04';
            content.contractName=OrderManager.ContractModel.OptionText;
            content.contractCode=OrderManager.ContractModel.PK_Option;
            content.saleTypeName=OrderManager.SaleTypeModel.OptionText;
            content.saleTypeCode=OrderManager.SaleTypeModel.PK_Option;
            content.saleTypeModuleName=OrderManager.SaleTypeModuleModel.OptionText;
            content.saleTypeModuleCode=OrderManager.SaleTypeModuleModel.PK_Option;
            content.orders=Orders;
            content.allQuote=$scope.RelQuoteMoney;
            content.allCost=$scope.RelCoustMoney;
            content.allDiscount=$scope.RelDiscountMoney;
            console.log(JSON.stringify(content));
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
                qmoney+=parseFloat(datas[i]['Quote']);
                comoney+=parseFloat(datas[i]['RelCost']);
            }
            $scope.RelQuoteMoney=qmoney;
            $scope.RelDiscountMoney=dismoney;
            $scope.RelCoustMoney=comoney;
        }
        //本地集合中获取产品线对象
        function GetProcuctLineModel(productLineName){
            return _.find($scope.ProductLineData,function(r){
                return r.ProductLineName==productLineName;
            })
        }
        //本地获取产品对象
        function GetProductModel(productName){
            return _.find($scope.ProductData,function(r){
                return r.ProductName==productName;
            })
        }
        //本地获取产品模块对象
        function GetProductModuleModle(productModuleName){
            return _.find($scope.ProductModelData,function(r){
                return r.ProductModuleName == productModuleName;
            })
        }
        function GetDate(){
            var da =new Date();
            var year =da.getFullYear();
            var month=da.getMonth()+1;
            var day=da.getDate();
            return year+"年"+month+"月"+day+"日";
        }
    }]);
});
