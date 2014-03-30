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
		db.Exec("CREATE TABLE alumnes (nom TEXT, login TEXT);")
		db.Exec("CREATE TABLE temes (tema TEXT, aula TEXT, data TEXT);")
		db.Exec("CREATE TABLE inscits (id_alumne INTEGER, id_control INTEGER);")
		db.Exec("CREATE TABLE notes (id_alumne INTEGER, id_control INTEGER, nota INTEGER);")
		db.Exec("CREATE TABLE professors (nom TEXT, loginUPC TEXT);")
		//trans, err := db.Begin()
		//if err != nil {
		//	log.Printf("begin: %v\n", err)
		//}
		db.Exec("insert into alumnes(nom, login) values('marc.andres.fontanet', '12345678');")
		db.Exec("insert into professors(nom, loginUPC) values('pau.fernandez', '12345678');")
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

	stmt, err := db.Prepare("select login from alumnes where nom = ?")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	//stmt2, err := db.Prepare("select loginUPC from professors where nom = ?")
	var name string
	//var name2 string
	err = stmt.QueryRow(req["user"]).Scan(&name)
	if err != nil {
		log.Fatal(err)
	}
	/*err = stmt2.QueryRow(req["user"]).Scan(&name2)
	if err != nil {
		log.Fatal(err)
	}*/
	if name == req["password"] /* || (name2 == req["password"])*/ {
		return
	} else {
		log.Println("adeu3")
		http.Error(w, "usuari incorrecte", http.StatusBadRequest)
		return
	}
}

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/acces_login", hLogin).Methods("POST")
	http.Handle("/acces_login", r)
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
