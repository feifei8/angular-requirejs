define([
    'angular',
    'NgTable',

],function(angular){
	angular.module('Order.OrderManagerController',[])
	.controller('orderManagerCtrl',['orderManagerService','$scope','NgTableParams','_',
        function(orderManagerService,$scope,NgTableParams,_){
		//  ==========
		//  = 方法配置 =
		//  ==========

		$scope.orderdata={};
		$scope.saleTypeData=null;
		$scope.saleModelTypeData=null;
		$scope.baseProductdata=null;
		$scope.tableParams=null;//表格对象
		var temp=[];
		var orderDataCopy=null;//订单对象
		$scope.cpsxdatas=[];//产品线对象
		$scope.propductdatas=[];//产品对象
		$scope.moduledata=[];//产品模块对象
		window.localStorage.setItem("id",0);
		$scope.cancel=cancel;
		$scope.del=del;
		$scope.save=save;
		$scope.add=add;
		$scope.getCpModule=getCpModule;
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
			console.dir(datajson);
		});
		//获取基础数据中的销售类型
		orderManagerService.getOptions("003").success(function (data) {
			//var datastr1 = JSON.parse(data.message);
			$scope.saleTypeData=JSON.parse(data.message).Body.DictionaryOption
			console.dir(JSON.parse(data.message).Body.DictionaryOption);
		});
		//获取基础数据中的应用类型
		orderManagerService.getOptions("048").success(function (data) {
			//var datastr1 = JSON.parse(datastr);
			var datajson = JSON.parse(data.message).Body.DictionaryOption;
			$scope.saleModelTypeData=JSON.parse(data.message).Body.DictionaryOption;
			console.dir(datajson);
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
			ChangeSum();
			$scope.AllQuote=sum("Quote");
			$scope.AllCoust=sum("RelCost");
			$scope.AllDiscount=sum("Discount");
			$scope.tableParams=new NgTableParams({count:5},{
				counts:[5,10,15,20],
				dataset:orderDataCopy
			})
		});
		//添加数据
		function add(){
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
		  $scope.tableParams.sorting({});
		  $scope.tableParams.page(1);
		  $scope.tableParams.reload();
		}
		//取消操作
		function cancel(item,itemForm){
			var copyData=resetItem(item,itemForm);
			angular.extend(item,copyData);
		}
		//删除操作
		function del(item){
			$scope.tableParams.dataset=remove(item);
			$scope.tableParams.reload();
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
			temp.unshift(
				{"Id":id,
			"ProductLineName":productline.ProductLineName,
			"ProductLineID":productline.ProductLineID,
			"ProductName":product.ProductName,
			"ProductCode":product.ProductID,
			"ProductModuleName":productmodule.ProductModuleName,
			"ProductModuleID":productmodule.ProductModuleID,
			"Quote":item.Quote,
			"RelCost":item.RelCost,
			"Discount":item.Discount
			});
			var originalRow =resetItem(item,itemForm);
			angular.extend(originalRow, item);
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
			item.isEditing=false;
			itemForm.$setPristine();
			return _.findWhere(orderDataCopy,function(r){

				return r.id==item.id;
			});
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
	}]);
});