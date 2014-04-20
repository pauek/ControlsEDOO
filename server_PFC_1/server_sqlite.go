package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	//"html/template"
	"log"
	//"io/ioutil"
	"net/http"
	"os"
)

func crearBBDD(crear bool) {
	if crear == true {
		os.Remove("./BBDD.db")
		db, err := sql.Open("sqlite3", "./BBDD.db")
		if err != nil {
			fmt.Printf("open: %v\n", err)
			return
		}

		defer db.Close()

		db.Exec("CREATE TABLE controls (tema TEXT, aula TEXT, data TEXT);")
		db.Exec("CREATE TABLE proposats (tema TEXT, data TEXT, alumne TEXT);")
		db.Exec("CREATE TABLE usuaris (nom TEXT, password TEXT, tipus TEXT);")
		db.Exec("CREATE TABLE temes (tema TEXT, aula TEXT, data TEXT);")
		db.Exec("CREATE TABLE inscrits (id_alumne INTEGER, id_control INTEGER);")
		db.Exec("CREATE TABLE notes (id_alumne INTEGER, id_control INTEGER, nota INTEGER);")
		//trans, err := db.Begin()
		//if err != nil {
		//	log.Printf("begin: %v\n", err)
		//}
		db.Exec("insert into usuaris(nom, password, tipus) values('marc.andres.fontanet', '12345678', 'alumne');")
		db.Exec("insert into usuaris(nom, password, tipus) values('pau.fernandez', '12345678', 'professor');")
		db.Exec("insert into usuaris(nom, password, tipus) values('user', '1234', 'professor');")
		log.Println("insert")
		/*if err != nil {

			log.Printf("prepare: %v\n", err)
		}*/
		//defer stmt.Close()
		//trans.Commit()
	}
}

func hLogin(w http.ResponseWriter, r *http.Request) {
	log.Println("adeu")
	//req := struct{ Title string }{}
	req := make(map[string]string)
	json.NewDecoder(r.Body).Decode(&req)
	log.Println("adeu2")

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	defer db.Close()

	stmt, err := db.Prepare("select nom, password, tipus from usuaris where nom = ?")
	if err != nil {
		log.Println(err)
		http.Error(w, "error intern", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()
	var (
		nom, passwd, tipus string
	)
	//var name string
	err = stmt.QueryRow(req["user"]).Scan(&nom, &passwd, &tipus)
	if err != nil {
		log.Println(err)
		http.Error(w, "error intern", http.StatusInternalServerError)
		return
	}
	if passwd != req["password"] /* || (name2 == req["password"])*/ {
		log.Println("adeu3")
		http.Error(w, "usuari incorrecte", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"nom":    nom,
		"passwd": passwd,
		"tipus":  tipus,
	})
}

func hAddUser(w http.ResponseWriter, r *http.Request) {
	log.Println("adeu")
	//req := struct{ Title string }{}
	req := make(map[string]string)
	json.NewDecoder(r.Body).Decode(&req)
	log.Println("adeu2")

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	defer db.Close()

	stmt, err := db.Prepare("select nom from usuaris where nom = ?")
	if err != nil {
		log.Println(err)
		http.Error(w, "error intern", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()
	var stat string
	stat = "NOok"
	var nom string
	//var name string
	err = stmt.QueryRow(req["user"]).Scan(&nom)
	if err != nil {
		db.Exec("insert into usuaris(nom, password, tipus) values('" + req["user"] + "', '" + req["password"] + "', '" + req["tipus"] + "');")
		log.Println(err)
		stat = "ok"
		//http.Error(w, "error intern", http.StatusInternalServerError)
		//return
	}
	/*if passwd != req["password"] {
		log.Println("adeu3")
		http.Error(w, "usuari incorrecte", http.StatusBadRequest)
		return
	}*/

	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": stat,
	})
}

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/acces_login", hLogin).Methods("POST")
	http.Handle("/acces_login", r)
	r.HandleFunc("/addUser", hAddUser).Methods("POST")
	http.Handle("/addUser", r)
	crearBBDD(true)

	//db.Exec("INSERT INTO  alumnes (nom, login) VALUES ('Marc Andrés Fontanet','marc.andres.fontanet');")

	http.Handle("js/", http.StripPrefix("static/js/", http.FileServer(http.Dir("static/js"))))
	http.Handle("resources/", http.StripPrefix("static/resources/", http.FileServer(http.Dir("static/resources"))))
	http.Handle("/", http.FileServer(http.Dir("static")))
	log.Fatal(http.ListenAndServe(":8080", nil))

	//var count int

	/*trans, err := db.Begin()
	if err != nil {
		fmt.Printf("begin: %v\n", err)
	}

	s, err := trans.Prepare("INSERT INTO test (user, name) VALUES (hola, marc);")
	if err != nil {
		fmt.Printf("prepare: %v\n", err)
	}

	err = db.QueryRow("SELECT count(user) FROM test;").Scan(&count)
	if err != nil {
		fmt.Printf("QueryRow: %v\n", err)
	}

	_, err = s.Exec("dajohi1", "David1")
	if err != nil {
		fmt.Printf("exec: %v\n", err)
	}
	db.Close()*/
}
