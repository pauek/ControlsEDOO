$('.dropdown-toggle').dropdown()
var d = new Date();
console.log(d);
console.log(localStorage.day);
console.log("localStorage = " + localStorage.user);
localStorage.user = (localStorage.user || "");
if(d > localStorage.day){
	localStorage.user = "";
} else {localStorage.user = (localStorage.user || "");}
localStorage.day = d;
var app = angular.module('angular_app',['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
   $routeProvider
      .when('/', {
         templateUrl: "login.html",
         controller: function($scope, $location){
         	console.log("eeeeeei");
         	if($scope.user.nom !== ""){
		         $location.url('/user');
            }
     	   }
      })
      .when('/login', {
         templateUrl: "login.html",
         controller: function($scope, $location){
         	console.log("eeeeeei");
         	if($scope.user.nom !== ""){
		         $location.url('/user');
            }
     	   }
      })
      .when('/user', {
         templateUrl: "user.html",
         controller: function($scope, $location, $route){
         	console.log("eeeeeei");
         	console.log($scope.user.nom);
         	if($scope.user.nom === ""){
		         $location.url('/login');
            }
     	   }
      })
      .when('/afegir_alumnes', {
         templateUrl: "afegir_alumnes.html",
      })
      .otherwise({
         template: "Página no encontrada",
      });
});

app.controller('user_ctrl', function ($scope, $resource, $location, $http){
	if($scope.user.nom !== ""){
		$location.url('/user');
	}

});
app.controller('app_ctrl', function ($scope, $resource, $location, $http, $route) {
	/*$scope.dades = [
	  {dni:"43566438E",nivell:"1"},
	  ];*/
	$scope.controls_fets = [
		{id:"1",tema:"maps",aula:"2.12", data:"24/05/2014"},
		{id:"2",tema:"for",aula:"1.18", data:"14/04/2014"},
		{id:"3",tema:"while",aula:"Per determinar", data:"8/03/2014"},
	];
	//$scope.controls_fets = [];
	$scope.controls_per_fer =[];
	/*$scope.controls_per_fer = [
		{id:"1",tema:"maps",aula:"2.12", data:"24/05/2014"},
		{id:"2",tema:"for",aula:"1.18", data:"14/04/2014"},
		{id:"3",tema:"while",aula:"Per determinar", data:"8/03/2014"},
	];*/

	$scope.proposats = [
		{tema: "if/else", data:"30/05/2014"},
		{tema: "for", data:"28/05/2014"},
	];


	//$scope.reloaded = false;

	$scope.inf = {};
	$scope.user = {};
	$scope.user.nom = localStorage.user;
	$scope.text_ = {};
	$scope.addUser = {};
	$scope.addUser.tipus = "alumne";
	$scope.affControl = {tema:"",data:"",aula:""};



	$scope.login_out = function(){
		$scope.user.nom = "";
		$scope.inf.user = "";
		$scope.inf.password = "";
		localStorage.user = "";
		$location.path('/login');
	}

	
	$scope.isVisible = (localStorage.visible || true); 

	$scope.menu = [
		{name: 'holaa', click:'', link: '', visible: true},
		{name: 'Afegir alumnes',click:'', link: '#/afegir_alumnes', visible: $scope.isVisible}
		//{name: 'Tancar sessió',click: '',link: '#', visible: true}
	];
	console.log("afegir alumnes? : " + $scope.menu[1].visible);
	console.log("localstorage.visible : " + localStorage.visible);

	$scope.get_controls = function() {
	console.log("controls demanats");
      $http.get('/getControls').
      success(function(data) { 
      	console.log(data);
      	for(var i=0;i<data[9][0] ;i++){
      		//if(d.getYear() >)
      		//if(d.getMonth() > data[i][1].substring(3,5)){
      		$scope.controls_per_fer.push({tema:data[i][0], data:data[i][1], aula:data[i][2]});
      	}
      }).
      error(function(){
      	alert("els controls no s'han pogut carregar");
      	console.log("controls demanats!!!!!!!!!");
      });

	}

	$scope.submit = function(){
		console.log($scope.inf);
		$http.post('/acces_login',$scope.inf).
		   success(function(data){
			   $scope.user.nom = data.nom;
			   if (data.tipus === "alumne") {
				   localStorage.user = $scope.user.nom;
				   $scope.isVisible = false; 
				   localStorage.visible = false;
				   console.log("localstorage a false");
				   console.log("localstorage: "+ localStorage.visible);
				   $location.url('/user');
			   } else {
				   localStorage.user = $scope.user.nom;
				   console.log(localStorage.user);
				   $scope.isVisible = true;
				   localStorage.visible = true;
				   $location.url('/user');
		      };
		   }).error(function(){
			   alert("Login failed!");
		   });
	}	
   

	$scope.delete_exam = function(exam){
		var r = confirm("Estàs segur?");
		if (r==true){
  			$scope.controls_per_fer.splice(exam,1);
  		}  
	}

	$scope.get_controls();

   $scope.isAdding = false;

   $scope.cancelar_affControl = function(){
   		$scope.isAdding = false;
   }
	$scope.afegir_control = function() {
		console.log("id adding: " + $scope.isAdding );
      if (!$scope.isAdding) {
         $scope.isAdding = true;
      } else {
      		/*$http.post('/addControl',$scope.addUser).
		   success(function(data){
			   console.log(data.ok);
			   console.log(data.ok === "ok");
			   if(data.ok === "ok"){
				   console.log("oleeee");
				   $("#resposta_addUser").html("L'usuari s'ha afegit correctament");
				   $("#resposta_addUser").css( "color", "green" );
			   } else {
					console.log("cacaaaaa");
					$("#resposta_addUser").html("Aquest usuari ja existeix");
					$("#resposta_addUser").css( "color", "red" );
				}

		   }).error(function(){
			   alert("error");
		   });*/
	
	if($scope.affControl.tema !="" && $scope.affControl.data !="" && $scope.affControl.aula != ""){
		$scope.controls_per_fer.push({tema:$scope.affControl.tema, data:$scope.affControl.data, aula:$scope.affControl.aula});
		$scope.isAdding = false;
		console.log("Ara si que afegeixo");
		$scope.affControl.tema = "";
		$scope.affControl.aula = "";
		$scope.affControl.data = "";
		}
         
         
      }
	}

	$scope.add_user = function(){
		$http.post('/addUser',$scope.addUser).
		   success(function(data){
			   console.log(data.ok);
			   console.log(data.ok === "ok");
			   if(data.ok === "ok"){
				   console.log("oleeee");
				   $("#resposta_addUser").html("L'usuari s'ha afegit correctament");
				   $("#resposta_addUser").css( "color", "green" );
			   } else {
					console.log("cacaaaaa");
					$("#resposta_addUser").html("Aquest usuari ja existeix");
					$("#resposta_addUser").css( "color", "red" );
				}

		   }).error(function(){
			   alert("error");
		   });
	}
}); 

app.directive("proposats", function() {
   return {
      restrict: "E",
      templateUrl: 'proposats.html'
   };
});
