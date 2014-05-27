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

	User.Admin = localStorage.admin || null;
	//User.isAdmin = false;

	User.copyData = function(inf) {
		console.log("nom: "+inf.nom+" , passwd: " +inf.passwd + ",  tipus: " +inf.tipus)
      User.Admin = parseInt(inf.tipus);
      console.log("copyData admin:  " + User.Admin );
      localStorage.admin = parseInt(inf.tipus);
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

   $scope.options = {};
   //$scope.options.isVisible = User.isAdmin();
   $scope.options.isVisible = parseInt(localStorage.admin);
   console.log("isVisible?: " + User.isAdmin());
   console.log("isVisible?: " + $scope.options.isVisible);
   
  // $scope.isAdding = false;
  // $scope.reservat = false;
   $scope.user = {};
	$scope.user.nom = localStorage.user || "";
   $scope.controls_fets = [];
	$scope.controls_per_fer =[];
	$scope.affControl = {};
	$scope.cntrl = {};
	$scope.affControl.tema ="";
	$scope.affControl.data = "";
	$scope.affControl.aula ="";
	$scope.affControl.Id ="";

	$scope.reservats = [];
	/*$scope.reservats.push({
              	id_control: "data[i].Id_control", 
                nom_user: "data[i].Nom_user",
      	   	});*/

 $scope.editar_Control = false;

    $scope.editar = function (index) {
        $scope.editar_Control = true;
        $scope.index_editar = index;
    };

    $scope.afegir_Control = false;

    $scope.afegir = function () {
    	console.log("afegir");
        $scope.afegir_Control = true;
    };

	$scope.onlyWeekdays = function(d) {
      dayIndex = d.getDay();
      return ((dayIndex != 0) && (dayIndex != 6));
   }
   	$scope.apuntarExamen = [];
	$scope.proposats = [
		{tema: "if/else", data:"30/05/2014"},
		{tema: "for", data:"28/05/2014"},
	];

	$scope.reservar_control = function(index){
		$scope.apuntarExamen.Id = $scope.controls_per_fer[index].Id;
		$scope.apuntarExamen.nom = User.getUserName();
		$http.post('/reservarControl',$scope.apuntarExamen).
		   success(function(data){
		   	alert("T'has apuntat correctament");
		   	$("#"+index).attr('value', 'apuntat');
			$("#"+index).css( "background-color", "green" );
		   }).error(function(){
			   alert("Error al apuntar-se");
		   });
		
	}

	$scope.get_controls = function() {
	   console.log("controls demanats");
      $http.get('/getControls').
         success(function(data) { 
      	   console.log(data);
      	   for(var i = 0; i < data.length; i++) {
      		   	var a = new Date();
      		   	if(a.getTime() <= data[i].Data){
      		   		a.setTime(data[i].Data);
      		   		$scope.controls_per_fer.push({
                  	tema: data[i].Tema, 
                  	data: a, 
                  	aula: data[i].Aula,
                  	Id: data[i].Id,
               	});
      			} else {
      		   		a.setTime(data[i].Data);
      		   		$scope.controls_fets.push({
                  	tema: data[i].Tema, 
                  	data: a, 
                  	aula: data[i].Aula,
                  	Id: data[i].Id,
               		});
                   }
      	   	}
         }).
         error(function(){
      	   alert("els controls no s'han pogut carregar");
      	   console.log("controls demanats!!!!!!!!!");
         });
	}


	$scope.get_reserves = function() {
	   console.log("reserves demanades");
      $http.get('/getReserves').
         success(function(data) { 
      	   console.log(data);
      	   console.log("nom user data: "+data[0].Nom_user);
      	   for(var i = 0; i < data.length; i++) {
      		   	$scope.reservats.push({
              	id_control: data[i].Id_control, 
                nom_user: data[i].Nom_user,
      	   	});
      	   }
        }).
         error(function(){
      	   alert("les reserves no s'han pogut carregar");
         });
					console.log($scope.reservats);
		for(var e = 0; i < $scope.reservats.length;i++){
			for(var i = 0; i< $scope.controls_per_fer.length;i++){
				if($scope.reservats[e].nom_user == User.getUserName){
					console.log("bucleee2");
					if($scope.reservats[e].id_control == $scope.controls_per_fer[i]){
							$("#"+i).attr('value', 'apuntat');
							$("#"+i).css( "background-color", "green" );
					}
				}
			}
		} 
	}
		
	$scope.get_reserves();

	
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
      	if($scope.affControl.tema !="" && $scope.affControl.data !="" && $scope.affControl.aula != ""){
      		var afegit = false;
      		while(afegit == false){
      			afegit = true;
      			console.log("bucleeeee");
      		   $scope.affControl.Id = Math.round(Math.random()*10000);
      		   $scope.affControl.Id = $scope.affControl.Id.toString();
      		   console.log($scope.affControl)
      		   console.log($scope.affControl.tema);
      		   $scope.cntrl.tema = $scope.affControl.tema;
      		   $scope.cntrl.data = $scope.affControl.data.getTime().toString();
      		   $scope.cntrl.aula = $scope.affControl.aula;
      		   $scope.cntrl.Id = $scope.affControl.Id;
      		   console.log($scope.cntrl);
      		  // $scope.variable = {tema:"funcionaa?",aula:"pliiiis",data:"1400953473838",Id:"857865"};
      		   console.log("enviant?");
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
		   }
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



app.directive('editarControl', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
'  <div class="modal fade" id="loginModal" tabindex="-1" + role = "dialog" aria-labelledby = "myModalLabel" aria-hidden = "true" > ' +
'    <div class = "modal-dialog" > ' +
'      <form name = "form" ng - submit = "submit()" > ' +
'        <div class = "modal-content" >' +
'          <div style="background-color:#F1BF4C;"  class = "modal-header" > <h2>Editar control</h2> ' +
'            <button type="button" class = "close" data-dismiss="modal" aria-hidden="true" ng-click="cancelar()" > Cancel </button>' +
'              <h3> </h3 > ' +
'          </div>' +
'          <div class="modal-body">' +
'            <table border="0"><tr><td>tema: </td><td><select" ng-model="affControl.tema" ng-options="t.tema for t in temes_proposta"></select></td></tr> ' +
'            <tr><td>Aula: </td><td><input type = "text" ng-model = "controls_per_fer[index_editar].aula" > </input></td></tr>' +
'            <tr><td>Data: </td><td><quick-datepicker ng-model="j"></quick-datepicker></td></tr>' +
'            <tr><td colsp an="2"><input type="submit" class="btn btn-primary" id="submit" ng-click="submit()" value="Acceptar"></input ></td></tr></table> ' +
'          </div>' +
'        </div > ' +
'      </form>' +
'    </div > ' +
'  </div>' +
'</div > ',
        controller: function ($scope) {
            
            $scope.submit = function() {
                $scope.login();
		        $("#loginModal").modal('hide');
            };
            
            $scope.cancelar = function() {
            	console.log("cancel");
                $scope.editar_Control = false;
		        $("#loginModal").modal('hide');
            };
            
            $scope.$watch('editar_Control', function() {
                if ($scope.editar_Control) {
		            $("#loginModal").modal('show');
                };
           });   
        }
    };
});




app.directive('afegirControl', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
'  <div class="modal fade" id="afegirModal" tabindex="-1" + role = "dialog" aria-labelledby = "myModalLabel" aria-hidden = "true" > ' +
'    <div class = "modal-dialog" > ' +
'      <form name = "form" ng - submit = "submit()" > ' +
'        <div class = "modal-content" >' +
'          <div style="background-color:#39DC3D;"  class = "modal-header" > <h2>Afegir control</h2> ' +
'            <button type="button" class = "close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()" > Cancel </button>' +
'              <h3> </h3 > ' +
'          </div>' +
'          <div class="modal-body">' +
'            <table border="0"><tr><td>tema: </td><td><select ng-model="affControl" ng-options=" t.tema for t in temes_proposta"></select></td></tr> ' +
'            <tr><td>Aula: </td><td><input type = "text" ng-model = "affControl.aula" > </input></td></tr>' +
'            <tr><td>Data: </td><td><quick-datepicker ng-model="affControl.data"></quick-datepicker></td></tr>' +
'            <tr><td colsp an="2"><input type="submit" class="btn btn-primary" id="submit" ng-click="submit()" value="Acceptar"></input ></td></tr></table> ' +
'          </div>' +
'        </div > ' +
'      </form>' +
'    </div > ' +
'  </div>' +
'</div > ',
        controller: function ($scope) {
            
            $scope.submit = function() {
                $scope.afegir_control();
                $scope.afegir_Control = false;
		        $("#afegirModal").modal('hide');
            };
            
            $scope.cancel = function() {
                $scope.afegir_Control = false;
		        $("#afegirModal").modal('hide');
            };
            
            $scope.$watch('afegir_Control', function() {
                if ($scope.afegir_Control) {
		            $("#afegirModal").modal('show');
                };
           });   
        }
    };
});