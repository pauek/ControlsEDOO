$('.dropdown-toggle').dropdown()

var app = angular.module('angular_app',['ngResource', 'ngRoute', "ngQuickDate"]);


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
      .when('/info_alumne/:alumne', {
         templateUrl: "info_alumne.html",
         controller: "infoAlumne_ctrl",
      })
      .otherwise({
         template: "Página no encontrada",
      });
});



app.factory('User', function($http, $route, $location) {
	var User = {};
	User.nom = localStorage.user || null;
   User.Admin = localStorage.admin || null;

	User.copyData = function(inf) {
      User.Admin = parseInt(inf.tipus);
      localStorage.admin = parseInt(inf.tipus);
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

   User.login = function(_user){
		$http.post('/server/acces_login',_user).
		   success(function(data){
		   	console.log("noom: "+data.nom+" , passwd: " +data.passwd + ",  tipus: " +data.tipus)
			  	User.copyData(data);
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

app.controller('menu_ctrl', function ($scope, $location, User) {
	$scope.user = User;
   
   $scope.login_out = function(){
		User.logout();
		$location.path('/login');
	}
});


app.controller('login_ctrl', function ($scope, $location,User) {
	if(User.isLoggedIn() == true){
		$location.url('/user');
   }

	$scope.inf = {};

	$scope.submit = function(){
		User.login($scope.inf);
		$scope.isVisible = User.isAdmin();
	}	
});


//$scope, $resource, $location, $http, $route, User,$routeParams
app.controller('infoAlumne_ctrl', function ($scope, $location,$http, User,$routeParams) {
	if(!User.isLoggedIn() || !parseInt(localStorage.admin)){
      console.log("holaaaaaa");
		$location.url('/PaginaNoEncontrada');
   }



	$scope.alumne = $routeParams.alumne;
	$scope.controls = [];
	$scope.controls_alumnes = [];
	$scope.inscrits = [];
	$scope.inscrits_alumnes = [];
	$scope.get_info_alumne = function() {
		 console.log("reserves demanades");
      $http.get('/server/infoAlumne/' + $routeParams.alumne + '/controls' ).
         success(function(data) { 
      	   console.log(data);
      	   $scope.controls = data;
      	   $scope.get_inscrits_alumne();
			 console.log("controls",$scope.controls); 
        }).
         error(function(){
      	   alert("les reserves no s'han pogut carregar");
         });
     }

     $scope.get_inscrits_alumne = function() {
      $http.get('/server/infoAlumne/' + $routeParams.alumne + '/inscrits' ).
         success(function(data) { 
      	   console.log(data);
      	   $scope.inscrits = data;
      	   for (var i=0; i < $scope.inscrits.length; i++) {
      	   	for (var e=0; e < $scope.controls.length; e++) {
      	   		console.log("id inscrits",$scope.inscrits[i].Id_control);
      	   		console.log("id control",$scope.controls[e].Id);
      	 		if($scope.inscrits[i].Id_control == $scope.controls[e].Id){
      	 			a = new Date();
      	   			if($scope.controls[e].Data < a.getTime()){
      	   				a.setTime($scope.controls[e].Data);
      	 				$scope.controls[e].Data = a.toString().substring(0,24);
      	   				$scope.inscrits_alumnes.push({
      	   					Id_control: $scope.inscrits[i].Id_control,
      	   					Nota: $scope.inscrits[i].Nota,
      	   					Tema : $scope.controls[e].Tema,
      	   					Data : $scope.controls[e].Data
      	   				});
      	   				console.log("inscrits alumne",$scope.inscrits_alumnes[i]);
      	   			} else{
      	 			a.setTime($scope.controls[e].Data);
      	 			$scope.controls[e].Data = a.toString().substring(0,24);
      	 			$scope.controls_alumnes.push($scope.controls[e]);
      	 		}
      	 		}
      	   	};
      	   };
      	   console.log("controls alumnes", $scope.controls_alumnes)
			 console.log("inscrits",$scope.inscrits); 
        }).
         error(function(){
      	   alert("les reserves no s'han pogut carregar");
         });

	}

	$scope.get_info_alumne();


});

app.controller('user_ctrl', function ($scope, $http, $location, User) {
	console.log("user_ctrl");
   console.log(User.nom);
   console.log(User.isLoggedIn());
   if(!User.isLoggedIn()){
		$location.url('/login');
   }

   $scope.options = {};
   $scope.options.isVisible = parseInt(localStorage.admin);
   console.log("isVisible?: " + User.isAdmin());
   console.log("isVisible?: " + $scope.options.isVisible);
   if($scope.options.isVisible == false){
   	console.log("link foraaaa");
   	$("#link_cntrls_fets").css( "pointer-events", "none" );
   }

   
   $scope.user = {};
	$scope.user.nom = localStorage.user || "";
   $scope.controls_fets = [];
   $scope.proposats = [];
	$scope.controls_per_fer =[];
	$scope.affControl = {};
	$scope.cntrl = {};
	$scope.affControl.tema ="";
	$scope.affControl.data = new Date();
	$scope.affControl.aula ="";
	$scope.affControl.Id ="";
	$scope.options.editant_notes = false;
	$scope.alumnes_notes = [];
	$scope.examen_notes = {};
	$scope.reservats = [];

 $scope.editar_Control = false;
$scope.notes_ex = false;

 	$scope.click_notes = function(index){
 		$scope.alumnes_notes = [];
   		$scope.examen_notes.Tema = $scope.controls_fets[index].Tema;
   		$scope.examen_notes.Data = $scope.controls_fets[index].Data;
   		//console.log("inscrits.tema: "+$scope.inscrits.Tema);
   		//console.log($scope.controls_per_fer);
   		//console.log($scope.reservats);
   		for(var i = 0; i< $scope.reservats.length;i++){
   					console.log("id: "+$scope.reservats[i].Id_control);
   					console.log("id2: "+$scope.controls_fets[index].Id);
					if($scope.controls_fets[index].Id == $scope.reservats[i].Id_control){
						console.log("for?");
							$scope.alumnes_notes.push({
								Alumne: $scope.reservats[i].Alumne,
								Nota: $scope.reservats[i].Nota,
								Id_control: $scope.reservats[i].Id_control
							});
				}
			}
		$scope.notes_ex = true;
 	}


 	$scope.editar_notes = function(){
 		$scope.options.editant_notes = true;
 	}

 	$scope.guardar_notes = function(){
 		$scope.options.editant_notes = false;
 	}

 	$scope.acceptar_notes = function(){
 		if($scope.options.editant_notes == true){
 			alert("Guarda els canvis abans");
 			return;
 		}
 		$http.post('/server/editarNotes',$scope.alumnes_notes).
		   success(function(data){
		   }).error(function(){
			   alert("Error al apuntar-se");
		   });
 		for(var i = 0; i< $scope.alumnes_notes.length;i++){
 			for(var e = 0; e< $scope.reservats.length; e++){
					if(($scope.alumnes_notes[i].Id_control == $scope.reservats[e].Id_control) && ($scope.alumnes_notes[i].Alumne == $scope.reservats[e].Alumne)){
						console.log("for?");
						$scope.reservats[e].Nota = $scope.alumnes_notes[i].Nota;
				}
			}
			}
 		$scope.notes_ex = false;
 		$("#notesModal").modal('hide');
 	}


 	$scope.infoAlumne = function(index){
 		console.log("info alumnes");
 		 $scope.notes_ex = false;
 		 $("#notesModal").modal('hide');
 		 $location.url('/info_alumne/'+ $scope.alumnes_notes[index].Alumne);
 	}

    $scope.editar = function (index) {
    	console.log("editar!");
        $scope.editar_Control = true;
        $scope.index_editar = index;
    };

    $scope.afegir_Control = false;
    $scope.inscrits_ex = false;

    $scope.afegir = function () {
    	console.log("afegir");
        $scope.afegir_Control = true;
    };

	$scope.onlyWeekdays = function(d) {
	  a = new Date();
	  now = a.getTime();
	  dayIndex = d.getDay();
	  timeIndex = d.getTime();
      return ((dayIndex != 0) && (dayIndex != 6) && (now < timeIndex));
   }
   	$scope.apuntarExamen = {};
   	$scope.inscrits_examen = [];
	$scope.inscrits = {}

	
   	$scope.inscrits_control = function(index){
   		$scope.inscrits_examen = [];
   		$scope.inscrits.Tema = $scope.controls_per_fer[index].Tema;
   		console.log("inscrits.tema: "+$scope.inscrits.Tema);
   		console.log($scope.controls_per_fer);
   		console.log($scope.reservats);
   		for(var i = 1; i< $scope.reservats.length;i++){
   			console.log("$scope.controls_per_fer[index].Id: "+ $scope.controls_per_fer[index].Id);
   			console.log("$scope.reservats[i].Id_control: " + $scope.reservats[i].Id_control);
					if($scope.controls_per_fer[index].Id == $scope.reservats[i].Id_control){
						console.log("for?");
							$scope.inscrits_examen.push({
								Alumne: $scope.reservats[i].Alumne,
							})
				}
			}
			$scope.inscrits_ex = true;
			console.log($scope.inscrits_examen);
   	}



	$scope.reservar_control = function(index){
		$scope.apuntarExamen.Id = $scope.controls_per_fer[index].Id;
		$scope.apuntarExamen.nom = User.getUserName(); 
		$scope.apuntarExamen.nota = "Sense nota";
		console.log("typeof: " + typeof($scope.apuntarExamen.Id));
		console.log("typeof: " + typeof($scope.apuntarExamen.nom));
		console.log("reservar control");
		console.log($scope.apuntarExamen);
		$http.post('/server/reservarControl',$scope.apuntarExamen).
		   success(function(data){
		   	alert("T'has apuntat correctament");
		   	$("#"+index).attr('value', 'apuntat');
		   	$("#"+index).attr('style', 'pointer-events: none;');
			$("#"+index).css( "background-color", "green" );
		   }).error(function(){
			   alert("Error al apuntar-se");
		   });
		
	}

	$scope.get_reserves = function() {
		 console.log("reserves demanades");
      $http.get('/server/getReserves').
         success(function(data) { 
      	   console.log(data);
      	   for(var i = 0; i < data.length; i++) {
      		   	$scope.reservats.push(data[i]);
      	   }

      	   console.log("reservats",$scope.reservats);
					console.log("bucleee: " + $scope.reservats.length );
      	   for(var e = 0; e < $scope.reservats.length;e++){
			console.log("bucleee3");
			for(var i = 0; i< $scope.controls_per_fer.length;i++){
				console.log("alumne",$scope.reservats[e].Alumne);
				if($scope.reservats[e].Alumne == User.getUserName()){
					console.log("bucleee2");
					console.log("id_control1",$scope.reservats[e].Id_control);
					console.log("id_control2",$scope.controls_per_fer[i].Id);
					if($scope.reservats[e].Id_control == $scope.controls_per_fer[i].Id){
						console.log("finn");
							$("#"+i).attr('value', 'apuntat');
							$("#"+i).attr('style', 'pointer-events: none;');
							$("#"+i).css( "background-color", "green" );
					}
				}
			}
		} 
        }).
         error(function(){
      	   alert("les reserves no s'han pogut carregar");
         });
	}

	$scope.get_controls = function() {
	   console.log("controls demanats");
      $http.get('/server/getControls').
         success(function(data) { 
      	   console.log(data);
      	   for(var i = 0; i < data.length; i++) {
      		   	var a = new Date();
      		   	if(a.getTime() <= data[i].Data){
      		   		a.setTime(data[i].Data);
      		   		data[i].Data = a.toString().substring(0,24);
      		   		$scope.controls_per_fer.push(data[i]);
      			} else {
      		   		a.setTime(data[i].Data);
      		   		data[i].Data = a.toString().substring(0,24);
      		   		$scope.controls_fets.push(data[i]);
                   }
      	   	}
      	   	 //console.log("controls per fer",$scope.controls_per_fer[i]);
      	   	 $scope.get_reserves();
         }).
         error(function(){
      	   alert("els controls no s'han pogut carregar");
      	   console.log("controls demanats!!!!!!!!!");
         });
	}




	$scope.get_propostes = function() {
	   console.log("get propostess");
      $http.get('/server/getPropostes').
         success(function(data) { 
         	if(data != ""){
      	      console.log(data);
      	      console.log("nom user data: "+data[0].Nom_user);
      	      for(var i = 0; i < data.length; i++) {
      	      	a = new Date();
      	      	a.setTime(data[i].Data);
				data[i].Data = a.toString().substring(0,24);
      		      $scope.proposats.push({
              	      tema: data[i].Tema, 
                     data: data[i].Data,
                     nom : data[i].Nom,
      	   	   });
      	      }
               console.log("proposats: ", $scope.proposats);
     	      } 
         }).
         error(function(){
      	   alert("les propostes no s'han pogut carregar");
         });
	}
	
	$scope.get_controls();	

	//$scope.get_reserves();
	
	$scope.get_propostes();
	
	$scope.proposta = {};
	$scope.proposta_send = {};
	$scope.tema_proposta = {}
	$scope.proposta.tema ="tema";
	$scope.proposta.data = new Date();
	
	$scope.add_proposta = function(){
		console.log("reservar control");
		$scope.proposta_send.tema = $scope.tema_proposta.tema;
		$scope.proposta_send.user = User.getUserName();
		$scope.proposta_send.data = $scope.proposta.data.getTime().toString();
		console.log($scope.proposta_send);
		$http.post('/server/addProposta',$scope.proposta_send).
		   success(function(data){
		   	$scope.proposats.push({
		   		tema: $scope.tema_proposta.tema,
		   		data: $scope.proposta.data.toString().substring(0,15),
		   		nom: $scope.proposta_send.user,
		   	});
		   	alert("Proposta feta");
		   }).error(function(){
			   alert("Error al apuntar-se");
		   });
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
  	
   $scope.affControl2 = [];

	$scope.afegir_control = function() {
      console.log("control2.tema: " +$scope.affControl2.tema);
      console.log("control.data: " +$scope.affControl.data);
      console.log($scope.affControl2.tema !== undefined);
      	if($scope.affControl2.tema !== undefined){
            console.log("control.aula: " +$scope.affControl.aula);
      		if($scope.affControl.aula == ""){
      			$scope.affControl.aula = "Per determinar";
      		}
      		var afegit = false;
      		while(afegit == false){
      			afegit = true;
      			console.log("bucleeeee");
      		   $scope.affControl.Id = Math.round(Math.random()*10000);
      		   $scope.affControl.Id = $scope.affControl.Id.toString();
      		   console.log($scope.affControl)
      		   console.log($scope.affControl.tema);
      		   $scope.cntrl.tema = $scope.affControl2.tema;
      		   $scope.cntrl.data = $scope.affControl.data.getTime().toString();
      		   $scope.cntrl.aula = $scope.affControl.aula;
      		   $scope.cntrl.Id = $scope.affControl.Id;
      		   console.log($scope.cntrl);
      		   console.log("enviant?");
      		   $http.post('/server/addControl',$scope.cntrl).
		            success(function(data){
			            console.log(data.stat);
			            if(data.stat === "ok"){
			   	         console.log("if correcte");
			   	         afegit = true;
			   	         $scope.controls_per_fer.push({
                           Tema: $scope.affControl2.tema, 
                           Data: $scope.affControl.data.toString().substring(0,24), 
                           Aula: $scope.affControl.aula, 
                           Id: $scope.affControl.Id
                        });
		                  $scope.isAdding = false;
		                  console.log("Ara si que afegeixo");
		                  $scope.affControl2.tema = "";
		                  $scope.affControl.aula = "";
		                  $scope.affControl.data = new Date();
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
         $scope.afegir_Control = false;
         $("#afegirModal").modal('hide');
         }
	}


	$scope.delete_exam = function(exam){
		var r = confirm("Estàs segur?");
		console.log("index: "+ exam);
		if (r == true){
			console.log("delete: ",$scope.controls_per_fer[exam]);
  			$http.post('/server/deleteControl', $scope.controls_per_fer[exam]).
		   success(function(data){
		   }).error(function(){
			   alert("Error al suprimir");
		   });
		$scope.controls_per_fer.splice(exam,1);
  		}  
	}

});

app.controller('affAlumnes_ctrl', function ($scope, $http, $location, User) {
	
	if(!User.isLoggedIn()){
		$location.url('/login');
   }

	$scope.addUser = {};
	$scope.addUser.tipus = 0;
	$scope.tipus = "Privilegis";
	
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
			$http.post('/server/addUser',$scope.affUser).
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
'            <table border="0"><tr><td>tema: </td><td><select" ng-model="affControl" ng-options="t.tema for t in temes_proposta"></select></td></tr> ' +
'            <tr><td>Aula: </td><td><input type = "text" ng-model = "controls_per_fer[index_editar].Aula" > </input></td></tr>' +
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
                	$scope.editar_Control = false;
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
'            <table border="0"><tr><td>tema: </td><td><select ng-model="affControl2" ng-options=" t.tema for t in temes_proposta"></select></td></tr> ' +
'            <tr><td>Aula: </td><td><input type = "text" ng-model = "affControl.aula" > </input></td></tr>' +
'            <tr><td>Data: </td><td><quick-datepicker date-filter="onlyWeekdays" ng-model="affControl.data"></quick-datepicker></td></tr>' +
'            <tr><td colsp an="2"><input type="submit" class="btn btn-primary" id="submit" ng-click="click()" value="Acceptar"></input ></td></tr></table> ' +
'          </div>' +
'        </div > ' +
'      </form>' +
'    </div > ' +
'  </div>' +
'</div > ',
        controller: function ($scope) {
            
            $scope.click = function() {
            	console.log("afageeeeeeeeix");
                $scope.afegir_control();
                
		        
            };
            
            $scope.cancel = function() {
                $scope.afegir_Control = false;
		        $("#afegirModal").modal('hide');
            };
            
            $scope.$watch('afegir_Control', function() {
                if ($scope.afegir_Control) {
                	$scope.afegir_Control = false;
		            $("#afegirModal").modal('show');
                };
           });   
        }
    };
});






app.directive('veureInscrits', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
'  <div class="modal fade" id="inscritsModal" tabindex="-1" + role = "dialog" aria-labelledby = "myModalLabel" aria-hidden = "true" > ' +
'    <div class = "modal-dialog" > ' +
'        <div class = "modal-content" >' +
'          <div style="background-color:#39DC3D;"  class = "modal-header" > <h2>{{inscrits.Tema}}</h2> ' +
'          </div>' +
'          <div class="modal-body">' +
'            <table border="0"><tr ng-repeat="i in inscrits_examen" ><td>{{i.Alumne}}</td></tr></table>' +
'          </div>' +
'        </div > ' +
'    </div > ' +
'  </div>' +
'</div > ',
        controller: function ($scope) {
            
            $scope.submit = function() {
                $scope.inscrits_ex = false;
		        $("#inscritsModal").modal('hide');
            };
            
            $scope.cancel = function() {
                 $scope.inscrits_ex = false;
		        $("#inscritsModal").modal('hide');
            };
            
            $scope.$watch('inscrits_ex', function() {
                if ($scope.inscrits_ex) {
                	$scope.inscrits_ex = false;
		            $("#inscritsModal").modal('show');
                };
           });   
        }
    };
});


app.directive('veureNotes', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div>' +
'  <div class="modal fade" id="notesModal" tabindex="-1" + role = "dialog" aria-labelledby = "myModalLabel" aria-hidden = "true" > ' +
'    <div class = "modal-dialog" > ' +
'        <div class = "modal-content" >' +
'          <div style="background-color:#24BADD;"  class = "modal-header" >' +
'            <ul style="list-style-type:none;">' +		
' 				<li>' +
'					<div><h3>{{examen_notes.Tema}}</h3></div>' +
'					<div><h3>{{examen_notes.Data}}</h3></div>' +
'				</li>' +
'  			 </ul>' +
'            <button type="button" class = "close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()" > Cancel </button>' +
'              <h3> </h3 > ' +
'          </div>' +
'          <div class="modal-body">' +
'            <ul style="list-style-type:none;">' +
' 				<li>' +
'					<div style="display: inline-block;width: 16em; font-weight:bold;">' +
'						<h4>Alumne</h4>' +
'					</div>' +
'					<div style="display: inline-block;">' +
'						<div style="display: inline-block;"><h4>Nota</h4></div>' +
'						<div ng-show="!options.editant_notes" style="display: inline-block;"><span class="button_pen">' +
'							<button type="button" ng-show="options.isVisible" class="button_pen" ng-click="editar_notes()" class="btn btn-default btn-lg" >' +
'      							<span class="glyphicon glyphicon-pencil"></span>' +
'      						</button>' +
'      					</span></div>' +
'						<div ng-show="options.editant_notes" style="display: inline-block;"><span class="button_pen">' +
'							<button type="button" ng-show="options.isVisible" class="button_ok" ng-click="guardar_notes()" class="btn btn-default btn-lg" >' +
'      							<span class="glyphicon glyphicon-ok"></span>' +
'      						</button>' +
'      					</span></div>' +
'					</div>' +
'				</li>' +			
' 				<li ng-repeat="alumne in alumnes_notes">' +
'					<div style="display: inline-block;width: 16em;"><a href="" ng-click="infoAlumne($index)">{{alumne.Alumne}}</a></div>' +
'					<div ng-show="!options.editant_notes" style="display: inline-block;">{{alumne.Nota}}</div>' +
'					<div ng-show="options.editant_notes" style="display: inline-block;"><input type = "text" ng-model = "alumne.Nota" ></input></div>' +
'				</li>' +
'				<li><input style="margin-top: 30px;" type="submit" class="btn btn-primary" id="submit" ng-click="acceptar_notes()" value="Acceptar"></input><li>' +
'  			 </ul>' +
'          </div>' +
'        </div > ' +
'    </div > ' +
'  </div>' +
'</div > ',
        controller: function ($scope) {
            
            $scope.submit = function() {
                $scope.notes_ex = false;
              $("#notesModal").modal('hide');
            };
            
            $scope.cancel = function() {
                 $scope.notes_ex = false;
		        $("#notesModal").modal('hide');
              $scope.options.editant_notes = false;
            };
            
            $scope.$watch('notes_ex', function() {
                if ($scope.notes_ex) {
                	$scope.notes_ex = false;
		            $("#notesModal").modal('show');
                };
           });   
        }
    };
});
