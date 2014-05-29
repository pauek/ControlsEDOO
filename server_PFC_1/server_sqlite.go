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
	// "strconv"
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

		db.Exec("CREATE TABLE controls (tema TEXT, aula TEXT, data INTEGER, id_control TEXT);")
		db.Exec("CREATE TABLE proposats (tema TEXT, data TEXT, alumne TEXT);")
		db.Exec("CREATE TABLE usuaris (nom TEXT, password TEXT, tipus TEXT, id_alumne TEXT);")
		db.Exec("CREATE TABLE temes (tema TEXT, aula TEXT, data TEXT);")
		db.Exec("CREATE TABLE inscrits (id_alumne TEXT, id_control TEXT);")
		db.Exec("CREATE TABLE notes (id_alumne TEXT, id_control TEXT, nota TEXT);")
		//trans, err := db.Begin()
		//if err != nil {
		//	log.Printf("begin: %v\n", err)
		//}
		db.Exec("insert into usuaris(nom, password, tipus) values('alumne', '1234', '0');")
		db.Exec("insert into usuaris(nom, password, tipus) values('pau.fernandez', '1234', '1');")
		db.Exec("insert into usuaris(nom, password, tipus) values('admin', '1234', '1');")
		db.Exec("insert into usuaris(nom, password, tipus) values('marc', '1234', '0');")

		db.Exec("insert into controls(tema, aula, data,id_control) values('Objectes + Strings', '2.18', 0000950612511, 21434);")
		db.Exec("insert into controls(tema, aula, data, id_control) values('Getline + While cin', '1.08', 1408953473838, 49382);")
		db.Exec("insert into controls(tema, aula, data,id_control) values('Vectors', '2.18', 1401839340904, 31412);")
		db.Exec("insert into controls(tema, aula, data,id_control) values('Operadors', '2.18', 0000950612511, 36715);")

		db.Exec("insert into inscrits(id_alumne, id_control) values('marc', '21434');")
		db.Exec("insert into inscrits(id_alumne, id_control) values('carles', '31412');")
		db.Exec("insert into inscrits(id_alumne, id_control) values('roger', '31412');")
		db.Exec("insert into inscrits(id_alumne, id_control) values('enric', '48937');")
		db.Exec("insert into inscrits(id_alumne, id_control) values('anna', '31412');")
		db.Exec("insert into inscrits(id_alumne, id_control) values('marta', '31412');")
		log.Println("insert")
		/*if err != nil {

			log.Printf("prepare: %v\n", err)
		}*/
		//defer stmt.Close()
		//trans.Commit()
	}
}

func hLogin(w http.ResponseWriter, r *http.Request) {
	log.Println("hLogin")
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
		nom, passwd string
		tipus       int
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
	log.Println("AddUser")
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
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": stat,
	})
}

func hAddControl(w http.ResponseWriter, r *http.Request) {
	log.Println("AddControl")
	var stat string
	stat = ""
	//req := struct{ Title string }{}
	req := make(map[string]string)
	json.NewDecoder(r.Body).Decode(&req)
	log.Println("req passat")
	log.Println(req["tema"])
	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	defer db.Close()
	stmt, err := db.Prepare("select id_control from controls where id_control = ?")
	if err != nil {
		log.Println(err)
		http.Error(w, "error intern", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	var nom string
	//var name string
	err = stmt.QueryRow(req["Id"]).Scan(&nom)
	if err != nil {
		res, err := db.Query("select data from controls where tema ='" + req["tema"] + "'")
		if err != nil {
			log.Fatal(err)
		}
		log.Println("paso1")
		match := false
		for res.Next() {
			var dataCntrl = ""
			if err := res.Scan(&dataCntrl); err != nil {
				log.Fatal(err)
			}
			if dataCntrl == req["data"] {
				match = true
			}
			//req = append(req, ctrl)
		}
		log.Println("paso2")
		if err := res.Err(); err != nil {
			log.Fatal(err)
		}
		if match == false {
			log.Println("CONTROL GUARDAT ")
			log.Println("tema" + req["tema"])
			log.Println("aula" + req["aula"])
			log.Println("data" + req["data"])
			log.Println("Id" + req["Id"])
			db.Exec("insert into controls(tema, aula, data,id_control) values('" + req["tema"] + "', '" + req["aula"] + "'," + req["data"] + "	,'" + req["Id"] + "');")
			stat = "ok"
		} else {
			stat = "SameData"
		}
	} else {
		stat = "SameID"
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"stat": stat,
	})
}

type Control struct {
	Tema, Aula string
	Id, Data   int
}

func hGetControls(w http.ResponseWriter, r *http.Request) {
	log.Println("GetControls")

	req := []Control{}

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	defer db.Close()

	res, err := db.Query("select * from controls")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("paso1")
	for res.Next() {
		ctrl := Control{}
		if err := res.Scan(&ctrl.Tema, &ctrl.Aula, &ctrl.Data, &ctrl.Id); err != nil {
			log.Fatal(err)
		}
		log.Println(ctrl.Tema)
		req = append(req, ctrl)
	}
	log.Println("paso2")
	if err := res.Err(); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(req)
}

type Reserva struct {
	Id_control, Nom_user string
}

func hGetReserves(w http.ResponseWriter, r *http.Request) {
	log.Println("GetReserves")
	req := []Reserva{}

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	defer db.Close()

	stm, err := db.Query("select * from inscrits")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("reserves_paso1")
	for stm.Next() {
		rsrva := Reserva{}
		if err := stm.Scan(&rsrva.Nom_user, &rsrva.Id_control); err != nil {
			log.Fatal(err)
		}
		log.Println(rsrva.Id_control)
		req = append(req, rsrva)
	}
	log.Println("reserves_paso2")
	if err := stm.Err(); err != nil {
		log.Fatal(err)
	}
	log.Println("req id: " + req[0].Id_control)
	log.Println("req nom: " + req[0].Nom_user)
	log.Println("req id2: " + req[1].Id_control)
	log.Println("req nom2: " + req[1].Nom_user)
	json.NewEncoder(w).Encode(req)
}

type Proposta struct {
	Tema, Data, Nom string
}

func hGetPropostes(w http.ResponseWriter, r *http.Request) {
	log.Println("GetPropostes")
	req := []Proposta{}

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	defer db.Close()

	stm, err := db.Query("select * from proposats")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("proposats_paso1")
	for stm.Next() {
		prop := Proposta{}
		if err := stm.Scan(&prop.Tema, &prop.Data, &prop.Nom); err != nil {
			log.Fatal(err)
		}
		//log.Println(rsrva.Id_control)
		req = append(req, prop)
	}
	log.Println("reserves_paso2")
	if err := stm.Err(); err != nil {
		log.Fatal(err)
	}

	if len(req) == 0 {
		json.NewEncoder(w).Encode("BUIT")
	} else {
		json.NewEncoder(w).Encode(req)
	}
	/*log.Println("req id: " + req[0].Id_control)
	log.Println("req nom: " + req[0].Nom_user)
	log.Println("req id2: " + req[1].Id_control)
	log.Println("req nom2: " + req[1].Nom_user)*/

}

func hReservarControl(w http.ResponseWriter, r *http.Request) {
	log.Println("hReservarControl")
	//req := struct{ Title string }{}
	var result = ""
	req := make(map[string]string)
	json.NewDecoder(r.Body).Decode(&req)
	log.Println("adeu1")
	log.Println("nom" + req["nom"])
	log.Println("Id" + req["Id"])

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	log.Println("adeeeu3")
	defer db.Close()
	log.Println("adeeeu4")
	/*res, err := db.Query("select * from inscrits where id_alumne =" + req["nom"] + "and id_control =" + req["Id"])
	if err != nil {*/
	//log.Fatal(err)
	db.Exec("insert into inscrits(id_alumne,id_control) values('" + req["nom"] + "', '" + req["Id"] + "');")
	result = "OK"
	/*} else {
		result = "REPETIT"
	}*/
	//log.Println(res)
	log.Println("paso1")
	log.Println("adeeeu2")
	json.NewEncoder(w).Encode(result)
}

func hAddProposta(w http.ResponseWriter, r *http.Request) {
	log.Println("hAddProposta")
	//req := struct{ Title string }{}
	var result = ""
	req := make(map[string]string)
	json.NewDecoder(r.Body).Decode(&req)
	log.Println("adeu1")
	log.Println("nom: " + req["user"])
	log.Println("tema: " + req["tema"])
	log.Println("data: " + req["data"])
	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	log.Println("adeeeu3")
	defer db.Close()
	log.Println("adeeeu4")
	/*res, err := db.Query("select * from inscrits where id_alumne =" + req["nom"] + "and id_control =" + req["Id"])
	if err != nil {*/
	//log.Fatal(err)
	db.Exec("insert into proposats(tema,data,alumne) values('" + req["tema"] + "','" + req["data"] + "', '" + req["user"] + "');")
	result = "OK"
	/*} else {
		result = "REPETIT"
	}*/
	//log.Println(res)
	log.Println("paso1")
	log.Println("adeeeu2")
	json.NewEncoder(w).Encode(result)
}

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/acces_login", hLogin).Methods("POST")
	http.Handle("/acces_login", r)
	r.HandleFunc("/addUser", hAddUser).Methods("POST")
	http.Handle("/addUser", r)
	r.HandleFunc("/getControls", hGetControls).Methods("GET")
	http.Handle("/getControls", r)
	r.HandleFunc("/addControl", hAddControl).Methods("POST")
	http.Handle("/addControl", r)
	r.HandleFunc("/reservarControl", hReservarControl).Methods("POST")
	http.Handle("/reservarControl", r)
	r.HandleFunc("/getReserves", hGetReserves).Methods("GET")
	http.Handle("/getReserves", r)
	r.HandleFunc("/addProposta", hAddProposta).Methods("POST")
	http.Handle("/addProposta", r)
	r.HandleFunc("/getPropostes", hGetPropostes).Methods("GET")
	http.Handle("/getPropostes", r)
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
