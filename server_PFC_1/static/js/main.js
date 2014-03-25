var app = angular.module('angular_app',['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
   $routeProvider
      .when('/', {
         templateUrl: "login.html",
      })
      .when('/alumne', {
         templateUrl: "alumne.html",
      })
      .otherwise({
         template: "Página no encontrada",
      });
});
 
app.controller('app_ctrl', function ($scope, $resource, $location){

	$scope.dades = [
		{dni:"43566438E",nivell:"1"},
	];

	$scope.examens = [
		{id:"1",name:"maps", nivell:"3",aula:"2.12", data:"24/05/2014"},
		{id:"2",name:"for", nivell:"1",aula:"1.18", data:"14/04/2014"},
		{id:"3",name:"while", nivell:"2",aula:"Per determinar", data:"8/03/2014"},
	];

	$scope.info = {};

	$scope.ok = [
		{url:"index.html"},
	];

	$scope.submit = function(){
		console.log($scope);
		$http.post('/acces_login', $scope.info).
		success(function(){
			$location.url('/alumne');
		}).error(function(){
			alert("Login failed!");
		});
		/*if ($scope.info.user=="marc" && $scope.info.password=="andres"){
         $location.url('/alumne');
		} else {
         alert("Login failed!");
		}*/
	}	
}); 