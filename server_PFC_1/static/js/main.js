var app = angular.module('angular_app',['ngResource']);
 
app.controller('app_ctrl', function ($scope, $resource, $location){

	$scope.dades = [
		{dni:"43566438E",nivell:"1"},
	];

	$scope.examens = [
		{id:"1",name:"maps", nivell:"3",aula:"2.12", data:"24/05/2014"},
		{id:"2",name:"for", nivell:"1",aula:"1.18", data:"14/04/2014"},
		{id:"3",name:"while", nivell:"2",aula:"Per determinar", data:"8/03/2014"},
	];

	$scope.user = "usuari";
	$scope.pasword = "contrasenya";
	$scope.ok = [
		{url:"index.html"},
	];

	$scope.user_aigua = function(){
		$scope.user = "";
	}

	$scope.pasword_aigua = function(){
		$scope.pasword = "";
	}

	$scope.submit = function(){
		
		if ($scope.user=="marc"&&$scope.pasword=="andres"){
			$location.url('');
		} else {
			$location.url('');
			}
	}	
}); 