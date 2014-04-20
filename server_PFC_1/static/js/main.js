$('.dropdown-toggle').dropdown()
console.log("localStorage = " + localStorage.user);
localStorage.user = (localStorage.user || "");
var app = angular.module('angular_app',['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
   $routeProvider
      .when('/', {
         templateUrl: "login.html",
      })
      .when('/login', {
         templateUrl: "login.html",
      })
      .when('/user', {
         templateUrl: "user.html",
      })
      .when('/afegir_alumnes', {
         templateUrl: "afegir_alumnes.html",
      })
      .otherwise({
         template: "Página no encontrada",
      });
});
 
app.controller('app_ctrl', function ($scope, $resource, $location, $http){

	/*$scope.dades = [
		{dni:"43566438E",nivell:"1"},
	];*/

	$scope.controls_per_fer = [
		{id:"1",tema:"maps",aula:"2.12", data:"24/05/2014"},
		{id:"2",tema:"for",aula:"1.18", data:"14/04/2014"},
		{id:"3",tema:"while",aula:"Per determinar", data:"8/03/2014"},
	];

	$scope.proposats = [
		{tema: "if/else", data:"30/5/2014"},
		{tema: "for", data:"28/5/2014"},
	];

	$scope.inf = {};
	$scope.user = {};
	$scope.user.nom = localStorage.user;
	$scope.text_ = {};
	$scope.addUser = {};
	$scope.addUser.tipus = "alumne";

	$scope.login_out = function(){
		$scope.user.nom = "";
		$scope.inf.user = "";
		$scope.inf.password = "";
		localStorage.user = "";
		$location.path('/login')
	}

	$scope.click_edit = function(index){
		$scope.text_[index] = !$scope.text_[index]; 
		
	}

	$scope.menu = [
		{name: 'holaa', click:'', link: '', visible: true},
		{name: 'Afegir alumnes',click:'', link: '#/afegir_alumnes', visible: true}
		//{name: 'Tancar sessió',click: '',link: '#', visible: true}
	];
	
	$scope.isVisible = "true"; 

	$scope.submit = function(){
		console.log($scope.inf);
		$http.post('/acces_login',$scope.inf).
		success(function(data){
				$scope.user.nom = data.nom;
			if (data.tipus == "alumne") {
				localStorage.user = $scope.user.nom;
				$scope.isVisible = false; 
				$location.url('/user');
			} else {
				localStorage.user = $scope.user.nom;
				console.log(localStorage.user);
				$scope.isVisible = true;
				$location.url('/user');
		};
		}).error(function(){
			alert("Login failed!");
		});
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

/*app.factory('User', function($http, $rootScope, $route, $location, Status, Data, Graph) {
   var User = {};

   User.profe = function(tipus){
   	User.tipus = tipus;
   }
   User.isProfe = function(){
   	return User.tipus;
   }
   return User;
});*/

/*app.directive("poposats", function() {
      	//if(scope.profe == true){
      function link($scope, element, attributes){
      	var expression = attributes.ngShow;
      	if(!$scope.$eval(expression)){
      		element.hide();
      	}

      }

      return{
      	restrict: 'E',
      	link: link,
        templateUrl: 'proposats.html'
      };
  //};
    });*/

 
        app.directive(
            "proposats",
            function() {
 
                // I allow an instance of the directive to be hooked
                // into the user-interaction model outside of the
                // AngularJS context.
                function link( $scope, element, attributes ) {
 
                    // I am the TRUTHY expression to watch.
                    var expression = attributes.ngShow;
 					console.log("jiiiah");
                    // I check to see the default display of the
                    // element based on the link-time value of the
                    // model we are watching.
                    if ( ! $scope.$eval( expression ) ) {
 
                       	element.hide();
 
                    } else element.show();
 
                }
 
 
                // Return the directive configuration.
                return({
                    link: link,
                    //restrict: "E",
                    restrict: "A",
                    //templateUrl: 'proposats.html'
                });
 
            }
        );