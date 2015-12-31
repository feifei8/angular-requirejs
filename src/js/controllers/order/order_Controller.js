define([
    'angular',
	'underscore',
    'ngtable',
	'order_service'
],function(angular,_){
	angular.module('myApp.order_controller',['myApp.order_service','ngTable'])
	.controller('order_controller',['order_service','$scope','NgTableParams',
        function(orderManagerService,$scope,NgTableParams){
			//  ==========
			//  = 方法配置 =
			//  ==========

			$scope.orderdata={};
			$scope.saleTypeData=null;
			$scope.saleModelTypeData=null;
			$scope.baseProductdata=null;
			$scope.AllOrdersList=[];
			var AllOrders={};
			$scope.tableParams=null;//表格对象
			var temp=[];
			var orderDataCopy=null;//订单对象
			var tempData=null;
			var i=0;
			$scope.isShow={
				isShow:false
			};
			$scope.isSubmit={
				isSubmit:true
			}
			$scope.daty=GetDate();
			$scope.isShow2=false;
			$scope.deleteCount=0;
			$scope.cpsxdatas=[];//产品线对象
			$scope.propductdatas=[];//产品对象
			$scope.moduledata=[];//产品模块对象
			window.localStorage.setItem("id",1);
			$scope.cancel=cancel;
			$scope.del=del;
			$scope.save=save;
			$scope.add=add;
			$scope.getCpModule=getCpModule;
			$scope.showOrder=showOrder;
			$scope.cancelChanges=cancelChanges;
			$scope.saveChanges=saveChanges;
			//  ==========
			//  = 方法实现=
			//  ==========
			//获取产品线
			orderManagerService.getCpsxData().success(function(data){
				$scope.cpsxdatas=JSON.parse(data.message).Body.ProductLine;
			});
			//获取产品
			orderManagerService.getCpData().success(function(data){

				$scope.propductdatas=JSON.parse(data.message).Body.Product;
			});
			//获取基础数据中的产品线
			orderManagerService.getOptions("037").success(function (data) {
				//var datastr1 = JSON.parse(data.message);
				var datajson = JSON.parse(data.message);
				$scope.baseProductdata=datajson.Body.DictionaryOption;
			});
			//获取基础数据中的销售类型
			orderManagerService.getOptions("003").success(function (data) {
				//var datastr1 = JSON.parse(data.message);
				$scope.saleTypeData=JSON.parse(data.message).Body.DictionaryOption
			});
			//获取基础数据中的应用类型
			orderManagerService.getOptions("048").success(function (data) {
				//var datastr1 = JSON.parse(datastr);
				var datajson = JSON.parse(data.message).Body.DictionaryOption;
				$scope.saleModelTypeData=JSON.parse(data.message).Body.DictionaryOption;
			});
			//获取产品模块
			function getCpModule(productName){
				var product= _.find($scope.propductdatas,function(r){
					return r.ProductName==productName;
				});
				//加载产品模块
				orderManagerService.getProductModule(product.ProductID).success(function(data){
					if(JSON.parse(data.message).Body.ProductModule!=null)
					{
						if(JSON.parse(data.message).Body.ProductModule.length==undefined)
						{
							$scope.moduledata.push(JSON.parse(data.message).Body.ProductModule);
						}
						else{
							$scope.moduledata=JSON.parse(data.message).Body.ProductModule;
						}

					}else{
						$scope.moduledata=null;
					}
				});
			}
			//配置表格
			orderManagerService.getOrderData().success(function(data){
				orderDataCopy=angular.copy(data);
				tempData=angular.copy(data);
				ChangeSum();
				$scope.AllQuote=sum("Quote");
				$scope.AllCoust=sum("RelCost");
				$scope.AllDiscount=sum("Discount");
				$scope.tableParams=new NgTableParams({count:5},{
					counts:[5,10,15,20],
					dataset:orderDataCopy
				})
			});
			//取消修改
			function cancelChanges(){
				$scope.isEditing = false;
				$scope.isAdding = false;
				$scope.tableParams.settings().dataset=angular.copy(tempData);
				$scope.tableParams.reload();
			}
			//添加数据
			function add(){
				$scope.isEditing = true;
				$scope.isAdding = true;
				$scope.isSubmit.isSubmit=true;
				var id =parseInt(window.localStorage.getItem("id"))+1;
				window.localStorage.setItem("id",id);
				$scope.isEditing = true;
				$scope.isAdding = true;
				$scope.tableParams.settings().dataset.unshift({
					Id:id,
					ProductLineName: "",
					ProductLineID: "",
					ProductName: "",
					ProductID: "",
					ProductModuleName:"",
					ProductModuleID:"",
					Quote: 0,
					RelCost:0,
					Discount:0
				});
				orderDataCopy=  $scope.tableParams.settings().dataset;
				$scope.tableParams.sorting({});
				$scope.tableParams.page(1);
				$scope.tableParams.reload();
			}
			//取消操作
			function cancel(item,itemForm){
				var copyData=resetItem(item,itemForm);
				console.log(copyData);
				angular.extend(iorderManagerCtrltem,copyData);
			}
			//删除操作
			function del(item){
				$scope.tableParams.settings().dataset=remove(item);
				$scope.tableParams.reload();
				ChangeSum();
			}
			function saveChanges() {
				$scope.isEditing=false;
				$scope.isAdding=false;
				var currentPage = $scope.tableParams.page();
				tempData = angular.copy($scope.tableParams.settings().dataset);
				orderDataCopy=tempData;
				ChangeSum();
			}
			//保存操作
			function save(item,itemForm){
				var id=parseInt(window.localStorage.getItem("id"))+1;
				var productline = _.find($scope.cpsxdatas,function(r){
					return r.ProductLineName == item.ProductLineName;
				});
				var product=_.find($scope.propductdatas,function(r){
					return r.ProductName==item.ProductName;
				});
				var productmodule=_.find($scope.moduledata,function(r){
					return r.ProductModuleName==item.ProductModuleName;
				});
				for(var i=0;i<orderDataCopy.length;i++){
					if(orderDataCopy[i].Id==item.Id){
						orderDataCopy[i].ProductLineName=productline.ProductLineName;
						orderDataCopy[i].ProductLineID=productline.ProductLineID;
						orderDataCopy[i].ProductName=product.ProductName;
						orderDataCopy[i].ProductCode=product.ProductID;
						orderDataCopy[i].ProductModuleName=productmodule.ProductModuleName;
						orderDataCopy[i].ProductModuleID=productmodule.ProductModuleID;
						orderDataCopy[i].Quote=item.Quote;
						orderDataCopy[i].RelCost=item.RelCost;
						orderDataCopy[i].Discount=item.Discount;
					}
				}
				item.isEditing=false;
				ChangeSum();
			}
			//重置表单数据
			function resetTableStatus(){
				$scope.isEditing = false;
				$scope.isAdding = false;
				$scope.tableForm.$setPristine();
			}
			//重置表格
			function resetItem(item,itemForm)
			{
				orderDataCopy=tempData;
				item.isEditing=false;
				itemForm.$setPristine();
				for(var i=0;i<tempData.length-1;i++)
				{
					if(tempData[i].Id==item.Id)
					{
						return tempData[i];
					}
				}
				return null;
			}
			//移除指定数据
			function remove(item){
				for( var i=0;i<orderDataCopy.length;i++){
					if(item.Id==orderDataCopy[i].Id){
						orderDataCopy.splice(i,1);
					}
				}
				return orderDataCopy;
			}
			//展示所有的对象数据
			function showOrder(){
				$scope.isShow.isShow=true;
				$scope.isSubmit.isSubmit=false;
				AllOrders={};
				AllOrders.Orders=tempData;
				AllOrders.RelContract=$scope.productLine;
				AllOrders.RelSaleType=$scope.saleType;
				AllOrders.RelSaleTypeModel=$scope.saleTypeModel;
				AllOrders.RelDistinct=$scope.AllDiscount;
				AllOrders.RelQuote=$scope.AllQuote;
				AllOrders.RelCoust=$scope.AllCoust;
				AllOrders.OrderId=parseInt(Math.random()*100000000);
				$scope.AllOrdersList.push(AllOrders);
				tempData=[];
				orderDataCopy=[];
				$scope.tableParams.settings().dataset=[];
				$scope.tableParams.reload();
				console.log($scope.AllOrdersList);
				console.log(JSON.stringify(AllOrders));
			}
			//展示所有的对象数据
			//改变数据
			function ChangeSum(){
				$scope.AllQuote=sum("Quote");
				$scope.AllCoust=sum("RelCost");
				$scope.AllDiscount=sum("Discount");
			}
			//求和
			function sum(name){
				var temp=0;
				for(var i=0;i<orderDataCopy.length;i++){
					temp+=parseInt(orderDataCopy[i][name]);
				}
				return temp;
			}
			function GetDate(){
				var da=new Date();
				var year =da.getFullYear();
			}
			function findWhere(datas,data){
				for(var i=0;i<datas.length;i++)
				{
					if(datas[i].Id==data.Id){
						return datas[i];
					}else{
						return null;
					}
				}
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