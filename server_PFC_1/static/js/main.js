$('.dropdown-toggle').dropdown()
var d = new Date();
/*console.log(d);
  console.log(localStorage.day);
  console.log("localStorage = " + localStorage.user);
  //localStorage.user = (localStorage.user || null);
  //localStorage.visible = (localStorage.visible || null);*/
console.log(localStorage.visible);
localStorage.day = d;
var app = angular.module('angular_app',['ngResource', 'ngRoute', "ngQuickDate"]);





/*app.config(function(ngQuickDateDefaultsProvider) {
// Configure with icons from font-awesome
return ngQuickDateDefaultsProvider.set({
closeButtonHtml: "<i class='fa fa-times'></i>",
buttonIconHtml: "<i class='fa fa-clock-o'></i>",
nextLinkHtml: "<i class='fa fa-chevron-right'></i>",
prevLinkHtml: "<i class='fa fa-chevron-left'></i>",
// Take advantage of Sugar.js date parsing
parseDateFunction: function(str) {
d = Date.create(str);
return d.isValid() ? d : null;
}
});
});*/





app.config(function($routeProvider) {
   $routeProvider
      .when('/', {
         redirectTo: '/login',
      })
      .when('/login', {
         templateUrl: "login.html",
         controller: "login_ctrl",
      })
      .when('/user', {
         templateUrl: "user.html",
         controller: "user_ctrl",
      })
      .when('/afegir_alumnes', {
         templateUrl: "afegir_alumnes.html",
         controller: "affAlumnes_ctrl",
      })
      .otherwise({
         template: "Página no encontrada",
      });
});



app.factory('User', function($http, $rootScope, $route, $location) {
	var User = {};
	if(localStorage.user == "null"){
		User.nom = null;
	} else{
	   User.nom = localStorage.user || null;}

	User.Admin = localStorage.visible || null;
	//User.isAdmin = false;

	User.copyData = function(inf) {
		console.log("noom: "+inf.nom+" , passwd: " +inf.passwd + ",  tipus: " +inf.tipus)
      User.Admin = parseInt(inf.tipus);
      console.log("copyData admin:  " + User.Admin );
      localStorage.visible = parseInt(inf.tipus);
      //User.UserID   = data.User.UserID;
      //User.Contols = data.U
      User.nom = inf.nom;
      User.password = inf.passwd;
   }

   User.getUserName = function(){
   	return User.nom;
   }

   User.isLoggedIn = function () {
      return (User.nom != null || User.nom != undefined);
   }

   User.isAdmin = function(){

   	return User.Admin;
   }

   User.isReservar = function(index){
		/*if(!User.Admin){
		  return $scope.User.controls[].reservat;
		  }else {return false;}
		*/
	}

   User.login = function(_user){
		$http.post('/acces_login',_user).
		   success(function(data){
		   	console.log("noom: "+data.nom+" , passwd: " +data.passwd + ",  tipus: " +data.tipus)
			  	User.copyData(data);
			   //	localStorage.user = "holaaaaaa";
			   //localStorage.visible = User.tipus;
			   localStorage.user = User.nom;
			  	console.log(localStorage.user);
				$location.url('/user');
				//$route.reload();
		   }).error(function(){
			   alert("Login failed!");
			   $route.reload();
		   });
		console.log("islogged in: " + User.isLoggedIn());
   }

   User.logout = function(){
   	User.nom = null;
      delete User.password;
      delete User.Admin;
      delete localStorage.user;
      console.log(User.nom);
      console.log("islogged in: " + User.isLoggedIn());
   }
   return User;
});

app.controller('menu_ctrl', function ($scope, $resource, $location, $http, $route,User) {
	$scope.user = User;
	var a = {
		"isAdmin": function(){
		   return true;
	   }}

	$scope.login_out = function(){
		User.logout();
		//$scope.user.nom = "";
		$scope.inf = {};
		$location.path('/login');
	}
	//console.log(User);
	$scope.menu = [
		{name: 'El meu compte', click:'', link: '', visible: a},
		{name: 'Afegir alumnes',click:'', link: '#/afegir_alumnes', visible: User}
		//{name: 'Tancar sessió',click: '',link: '#', visible: true}
	];
});
d

app.controller('login_ctrl', function ($scope, $resource, $location, $http, $route,User) {
	if(User.isLoggedIn() == true){
      console.log("holaaaaaa");
		$location.url('/user');
   }

	$scope.inf = {};

	$scope.submit = function(){
		User.login($scope.inf);
		$scope.isVisible = User.isAdmin();
		console.log("login is tipus:  "+ $scope.inf.tipus);
		console.log("login is Admin:  "+ User.isAdmin()); 
		//localStorage.visible = User.isAdmin();
	}	
});

app.controller('user_ctrl', function ($scope, $resource, $location, $http, $route, User) {
	console.log("user_ctrl");
   console.log(User.nom);
   console.log(User.isLoggedIn());
   if(!User.isLoggedIn()){
		$location.url('/login');
   }

   console.log("isVisible?: " + User.isAdmin());
   $scope.options = {};
   $scope.options.isVisible = User.isAdmin();
   

   $scope.date1 = new Date();
   console.log("data: "+$scope.date1);
   
   $scope.isAdding = false;
   $scope.reservat = false;
   $scope.user = {};
	$scope.user.nom = localStorage.user || "";
   $scope.controls_fets = [
		{id:"1",tema:"maps",aula:"2.12", data:"24/05/2014"},
		{id:"2",tema:"for",aula:"1.18", data:"14/04/2014"},
		{id:"3",tema:"while",aula:"Per determinar", data:"8/03/2014"},
	];
	//$scope.controls_fets = [];
	$scope.controls_per_fer =[];
	$scope.affControl = {};
	$scope.affControl.tema ="";
	$scope.affControl.data ="";
	$scope.affControl.aula ="";
	$scope.affControl.Id ="";

	
	$scope.onlyWeekdays = function(d) {
      dayIndex = d.getDay();
      return ((dayIndex != 0) && (dayIndex != 6));
   }

	$scope.proposats = [
		{tema: "if/else", data:"30/05/2014"},
		{tema: "for", data:"28/05/2014"},
	];

	$scope.reservar_control = function(indx){
		$scope.reservat = !$scope.reservat;
	}

	$scope.get_controls = function() {
	   console.log("controls demanats");
      $http.get('/getControls').
         success(function(data) { 
      	   console.log(data);
      	   for(var i = 0; i < data.length; i++) {
      		   //if(d.getYear() >)
      		   //if(d.getMonth() > data[i][1].substring(3,5)){
      		   $scope.controls_per_fer.push({
                  tema: data[i].Tema, 
                  data: data[i].Data, 
                  aula: data[i].Aula,
               });
      	   }
         }).
         error(function(){
      	   alert("els controls no s'han pogut carregar");
      	   console.log("controls demanats!!!!!!!!!");
         });

	}

	$scope.get_controls();


	$scope.proposta = {};
	$scope.proposta.tema ="tema";
	$scope.add_proposta = function(){
		console.log($scope.proposta);
		return;
	}

	$scope.temes_proposta =  [
	   {tema:"Getline + While cin"},
	   {tema:"Objectes + Strings"},
	   {tema:"Fitxers + StringStreams"},
	   {tema:"Vectors"},
	   {tema:"Iteradors"},
	   {tema:"Classes"},
	   {tema:"Maps"},
	   {tema:"Llistes"},
	   {tema:"Classes Compostes"},
	   {tema:"Eficiencia 1"},
	   {tema:"Operadors"},
	   {tema:"Eficiencia 2"},
	];
  	
	$scope.afegir_control = function() {
		console.log("id adding: " + $scope.isAdding );
      if (!$scope.isAdding) {
         $scope.isAdding = true;
         console.log($scope.date1.getDay());
      } else {
      	if($scope.affControl.tema !="" && $scope.affControl.data !="" && $scope.affControl.aula != ""){
      		var afegit = false;
      		while(afegit == false){
      			afegit = true;
      			console.log("bucleeeee");
      		   $scope.affControl.Id = Math.round(Math.random()*10000);
      		   $scope.affControl.Id = $scope.affControl.Id.toString();
      		   console.log($scope.affControl)
      		   console.log($scope.affControl.tema);
      		   $scope.cntrl = {};
      		   $scope.cntrl.tema = $scope.affControl.tema;
      		   $scope.cntrl.data = $scope.affControl.data;
      		   $scope.cntrl.aula = $scope.affControl.aula;
      		   $scope.cntrl.Id = $scope.affControl.Id;
      		   console.log($scope.cntrl);
      		   $http.post('/addControl',$scope.cntrl).
		            success(function(data){
			            console.log(data.stat);
			            if(data.stat === "ok"){
			   	         console.log("if correcte");
			   	         afegit = true;
			   	         $scope.controls_per_fer.push({
                           tema: $scope.affControl.tema, 
                           data: $scope.affControl.data, 
                           aula: $scope.affControl.aula, 
                           Id: $scope.affControl.Id
                        });
		                  $scope.isAdding = false;
		                  console.log("Ara si que afegeixo");
		                  $scope.affControl.tema = "";
		                  $scope.affControl.aula = "";
		                  $scope.affControl.data = "";
			            } else if(data.stat = "SameData") {
			   		      alert("Examen repetit!");
			   		      afegit = true;
			   	      } else { 
			   		      console.log("mareix ID! repetimos?");
					         
					      }

		            }).error(function(){
			            alert("error");
		            });
	         }
	         
		      /*$scope.controls_per_fer.push({tema:$scope.affControl.tema, data:$scope.affControl.data, aula:$scope.affControl.aula, Id: $scope.affControl.Id});
		        $scope.isAdding = false;
		        console.log("Ara si que afegeixo");
		        $scope.affControl.tema = "";
		        $scope.affControl.aula = "";
		        $scope.affControl.data = "";*/
		   }
         
         
      }
	}

	$scope.cancelar_affControl = function(){
   	$scope.isAdding = false;
   }

	$scope.delete_exam = function(exam){
		var r = confirm("Estàs segur?");
		if (r==true){
  			$scope.controls_per_fer.splice(exam,1);
  		}  
	}

});

app.controller('affAlumnes_ctrl', function ($scope, $resource, $location, $http, $route,User) {
	
	$scope.addUser = {};
	$scope.addUser.tipus = 0;
	$scope.tipus = "Privilegis"
	/*$scope.user = {};
	  $scope.user.nom = localStorage.user || "";*/
	$scope.admin = function(){
		console.log("Professor!!!");
		$scope.tipus = "Professor";
		$scope.addUser.tipus = 1;
	}

	$scope.alumne = function(){
		console.log("Alumne!!!");
		$scope.tipus = "Alumne";
		$scope.addUser.tipus = 0;
	}
	$scope.add_user = function(){
		var a = false;
		if($scope.tipus == "Professor" ||$scope.tipus == "professor"){
			$scope.addUser.tipus = 1;
			a = true;
		}
		if($scope.tipus == "Alumne" ||$scope.tipus == "alumne"){
			$scope.addUser.tipus = 0;
			a = true;
		}
		if(a == true){
			console.log($scope.addUser);
			$scope.affUser = {};
			$scope.affUser.user = $scope.addUser.user;
			$scope.affUser.password = $scope.addUser.password;
			$scope.affUser.tipus = $scope.addUser.tipus.toString();
			$http.post('/addUser',$scope.affUser).
		   	success(function(data){
			   	console.log(data.ok);
			   	console.log(data.ok === "ok");
			   	if(data.ok === "ok"){
				   	console.log("oleeee");
				   	$("#resposta_addUser").html("L'usuari s'ha afegit correctament");
				   	$("#resposta_addUser").css( "color", "green" );
				   	$scope.addUser.user = "";
				   	$scope.addUser.password = "";
			   	} else {
						console.log("cacaaaaa");
						$("#resposta_addUser").html("Aquest usuari ja existeix");
						$("#resposta_addUser").css( "color", "red" );
					}

		   	}).error(function(){
			   	alert("error");
		   	});
		} else {
			$("#resposta_addUser").html("Aquest tipus d'usuari no existeix");
			$("#resposta_addUser").css( "color", "red" );
		}
	}
}); 

app.directive("proposats", function() {
   return {
      restrict: "E",
      templateUrl: 'proposats.html'
   };
});


app.directive("proposar", function() {
   return {
      restrict: "E",
      templateUrl: 'proposar.html'
   };
});