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
	//"os"
)

func crearBBDD(crear bool) {
	if crear == true {

		db, err := sql.Open("sqlite3", "BBDD.db")
		if err != nil {
			fmt.Printf("open: %v\n", err)
			return
		}

		db.Exec("CREATE TABLE controls (tema TEXT, aula TEXT, data TEXT);")
		db.Exec("CREATE TABLE alumnes (nom TEXT, login TEXT);")
		db.Exec("CREATE TABLE temes (tema TEXT, aula TEXT, data TEXT);")
		db.Exec("CREATE TABLE inscits (id_alumne INTEGER, id_control INTEGER);")
		db.Exec("CREATE TABLE notes (id_alumne INTEGER, id_control INTEGER, nota INTEGER);")
		db.Exec("CREATE TABLE professors (loginUPC TEXT, nom TEXT);")
	}
}

func hLogin(w http.ResponseWriter, r *http.Request) {
	req := make(map[string]string)
	json.NewDecoder(r.Body).Decode(&req)
	txt, ok := mux.Vars(r)["user"]
	log.Println(txt)
	if !ok {
		/*if txt  {

												}*/
		http.Error(w, "usuari incorrecte", http.StatusBadRequest)
		return
	}
	//return http.StatusOK
}

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/acces_login", hLogin).Methods("POST")
	crearBBDD(true)

	//db.Exec("INSERT INTO  alumnes (nom, login) VALUES ('Marc Andrés Fontanet','marc.andres.fontanet');")

	http.Handle("js/", http.StripPrefix("static/js/", http.FileServer(http.Dir("static/js"))))
	http.Handle("resources/", http.StripPrefix("static/resources/", http.FileServer(http.Dir("static/resources"))))
	http.Handle("/", http.FileServer(http.Dir("static")))
	http.ListenAndServe(":8080", nil)

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
