var app = angular.module('angular_app',['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
   $routeProvider
      .when('/', {
         templateUrl: "login.html",
      })
      .when('/profe', {
         templateUrl: "profe.html",
      })
      .when('/alumne', {
         templateUrl: "alumne.html",
      })
      .otherwise({
         template: "Página no encontrada",
      });
});
 
app.controller('app_ctrl', function ($scope, $resource, $location, $http){

	/*$scope.dades = [
		{dni:"43566438E",nivell:"1"},
	];*/

	$scope.controls = [
		{id:"1",tema:"maps",aula:"2.12", data:"24/05/2014"},
		{id:"2",tema:"for",aula:"1.18", data:"14/04/2014"},
		{id:"3",tema:"while",aula:"Per determinar", data:"8/03/2014"},
	];

	$scope.proposats = [
		{tema: "if/else", data:"30/5/2014"},
		{tema: "for", data:"28/5/2014"},
	];

	$scope.inf = {};

	
	$scope.submit = function(){
		console.log($scope.inf);
		$http.post('/acces_login',$scope.inf).
		success(function(){
			$location.url('/profe');
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