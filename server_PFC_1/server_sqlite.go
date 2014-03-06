package main

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	//"html/template"
	//"log"
	//"io/ioutil"
	"net/http"
	//"os"
)

/**func GETuser_Handler(w http.ResponseWriter, r *http.Request) {
	response, _, err := http.Get("/")
	if err != nil {
		fmt.Printf("%s", err)
		os.Exit(1)
	} else {
		defer response.Body.Close()
		contents, err := ioutil.ReadAll(response.Body)
		if err != nil {
			fmt.Printf("%s", err)
			os.Exit(1)
		}
		fmt.Printf("%s\n", string(contents))
	}
}*/

func main() {

	/*response, err := http.Get("http://golang.org/")
	if err != nil {
		fmt.Printf("%s", err)
		os.Exit(1)
	} else {
		defer response.Body.Close()
		contents, err := ioutil.ReadAll(response.Body)
		if err != nil {
			fmt.Printf("%s", err)
			os.Exit(1)
		}
		fmt.Printf("%s\n", string(contents))
	}*/

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

	db.Exec("INSERT INTO  alumnes (nom, login) VALUES ('Marc Andrés Fontanet','marc.andres.fontanet');")

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
