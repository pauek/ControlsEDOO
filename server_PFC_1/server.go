package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"net/http"
)

/*
var db sqlite.DB; ??

func init() {
	db = sqlite.Open('asdlkfasdl', sdkj¡)
}

*/

func crearBBDD(crear bool) {
	if crear == true {
		//os.Remove("./BBDD.db")
		db, err := sql.Open("sqlite3", "./BBDD.db")
		if err != nil {
			fmt.Printf("open: %v\n", err)
			return
		}

		defer db.Close()

		db.Exec("CREATE TABLE controls (tema TEXT, aula TEXT, data INTEGER, id_control TEXT);")
		db.Exec("CREATE TABLE proposats (tema TEXT, data TEXT, alumne TEXT);")
		db.Exec("CREATE TABLE usuaris (nom TEXT, password TEXT, tipus TEXT);")
		db.Exec("CREATE TABLE temes (tema TEXT, aula TEXT, data TEXT);")
		db.Exec("CREATE TABLE inscrits (alumne TEXT, id_control TEXT, nota TEXT);")
		//db.Exec("CREATE TABLE notes (alumne TEXT, id_control TEXT, nota TEXT);")
		//trans, err := db.Begin()
		//if err != nil {
		//	log.Printf("begin: %v\n", err)
		//}
		db.Exec("insert into usuaris(nom, password, tipus) values('alumne', '1234', '0');")
		db.Exec("insert into usuaris(nom, password, tipus) values('pau.fernandez', '1234', '1');")
		db.Exec("insert into usuaris(nom, password, tipus) values('admin', '1234', '1');")
		db.Exec("insert into usuaris(nom, password, tipus) values('marc', '1234', '0');")

		db.Exec("insert into controls(tema, aula, data,id_control) values('Objectes + Strings', '2.18', 0000950612511, '21434');")
		db.Exec("insert into controls(tema, aula, data, id_control) values('Getline + While cin', '1.08', 1408953473838, '49382');")
		db.Exec("insert into controls(tema, aula, data,id_control) values('Vectors', '2.18', 1401839340904, '31412');")
		db.Exec("insert into controls(tema, aula, data,id_control) values('Operadors', '2.18', 0000950612511, '36715');")

		db.Exec("insert into inscrits(alumne, id_control, nota) values('marc', '31412', 'Sense nota');")
		db.Exec("insert into inscrits(alumne, id_control, nota) values('marc', '36715', 'Sense nota');")
		db.Exec("insert into inscrits(alumne, id_control, nota) values('carles', '21434', 'Sense nota');")
		db.Exec("insert into inscrits(alumne, id_control, nota) values('roger', '31412', 'Sense nota');")
		db.Exec("insert into inscrits(alumne, id_control, nota) values('enric', '21434', 'Sense nota');")
		db.Exec("insert into inscrits(alumne, id_control, nota) values('anna', '31412', 'Sense nota');")
		db.Exec("insert into inscrits(alumne, id_control, nota) values('marta', '31412', 'Sense nota');")
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
	Tema, Aula, Id string
	Data           int
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
		log.Println("tema: " + ctrl.Tema)
		log.Println("aula: " + ctrl.Aula)
		req = append(req, ctrl)
	}
	log.Println("paso2")
	if err := res.Err(); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(req)
}

type Reserva struct {
	Id_control, Alumne, Nota string
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
		if err := stm.Scan(&rsrva.Alumne, &rsrva.Id_control, &rsrva.Nota); err != nil {
			log.Fatal(err)
		}
		log.Println(rsrva.Id_control)
		req = append(req, rsrva)
	}
	log.Println("reserves_paso2")
	if err := stm.Err(); err != nil {
		log.Fatal(err)
	}
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
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Printf("ERROR AL DECODIFICAR LA RESERVA: %s\n", err)
	}
	log.Println("adeu1")
	log.Println("nom" + req["nom"])
	log.Println("Id" + req["Id"])
	log.Println("Nota" + req["nota"])

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	log.Println("adeeeu3")
	defer db.Close()
	log.Println("adeeeu4")
	/*res, err := db.Query("select * from inscrits where alumne =" + req["nom"] + "and id_control =" + req["Id"])
	if err != nil {*/
	//log.Fatal(err)
	db.Exec("insert into inscrits(alumne,id_control,nota) values('" + req["nom"] + "', '" + req["Id"] + "', '" + req["nota"] + "');")
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
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Printf("ERROR AL DECODIFICAR LA PROPOSTA: %s\n", err)
	}
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
	/*res, err := db.Query("select * from inscrits where alumne =" + req["nom"] + "and id_control =" + req["Id"])
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

func hDeleteControl(w http.ResponseWriter, r *http.Request) {
	log.Println("hDeleteControl")
	//req := struct{ Title string }{}
	var result = "ok"
	req := make(map[string]string)
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Printf("ERROR AL DECODIFICAR DELETE CONTROL: %s\n", err)
	}
	log.Println("adeu1")
	log.Println("id: " + req["Id"])
	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	log.Println("adeeeu3")
	defer db.Close()
	log.Println("adeeeu4")

	db.Exec("delete from controls where id_control =" + req["Id"] + " ;")
	db.Exec("delete from inscrits where id_control =" + req["Id"] + " ;")

	/*} else {
		result = "REPETIT"
	}*/
	//log.Println(res)
	log.Println("paso1")
	log.Println("adeeeu2")
	json.NewEncoder(w).Encode(result)
}

type Nota struct {
	Alumne, Id_control, Nota string
}

func hEditarNotes(w http.ResponseWriter, r *http.Request) {
	log.Println("hDeleteControl")
	//req := struct{ Title string }{}
	var result = "ok"
	//req := make(map[string]string)
	req := []Nota{}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Printf("ERROR AL DECODIFICAR EDITAR NOTA: %s\n", err)
	}
	log.Println("adeu1")
	log.Println("Alumne: " + req[0].Alumne)
	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	log.Println("adeeeu3")
	defer db.Close()
	log.Println("adeeeu4")

	for i := 0; i < len(req); i++ {
		db.Exec("UPDATE inscrits SET nota='" + req[i].Nota + "' WHERE id_control='" + req[i].Id_control + "' and alumne='" + req[i].Alumne + "';")
	}

	//db.Exec("delete from inscrits where id_control =" + req["Id"] + " ;")

	/*} else {
		result = "REPETIT"
	}*/
	//log.Println(res)
	//log.Println("paso1")
	//log.Println("adeeeu2")
	json.NewEncoder(w).Encode(result)
}

func hInfoAlumne(w http.ResponseWriter, r *http.Request) {
	Alumne, ok := mux.Vars(r)["alumne"]
	if !ok {
		fmt.Print("ERROR AL DECODIFICAR INFO ALUMNE")
	} else {
		log.Println(Alumne)

	}

	Tipus, ok2 := mux.Vars(r)["tipus"]
	if !ok2 {
		fmt.Print("ERROR AL DECODIFICAR INFO ALUMNE")
	}

	db, err := sql.Open("sqlite3", "./BBDD.db")
	if err != nil {
		fmt.Printf("open: %v\n", err)
		return
	}

	defer db.Close()

	if Tipus == "controls" {
		req := []Control{}

		stm, err := db.Query("select * from controls")
		if err != nil {
			log.Fatal(err)
		}
		for stm.Next() {
			ctrl := Control{}
			if err := stm.Scan(&ctrl.Tema, &ctrl.Aula, &ctrl.Data, &ctrl.Id); err != nil {
				fmt.Printf("controls ERROR: %v\n", err)
				log.Fatal(err)
			}
			//log.Println(rsrva.Id_control)
			req = append(req, ctrl)
		}
		log.Println("reserves_paso2")
		if err := stm.Err(); err != nil {
			log.Fatal(err)
		}
		json.NewEncoder(w).Encode(req)
	}

	if Tipus == "inscrits" {
		req := []Reserva{}

		stm, err := db.Query("select * from inscrits where alumne='" + Alumne + "'")
		if err != nil {
			fmt.Printf("inscrits ERROR: %v\n", err)
			log.Fatal(err)
		}
		for stm.Next() {
			rsrva := Reserva{}
			if err := stm.Scan(&rsrva.Alumne, &rsrva.Id_control, &rsrva.Nota); err != nil {
				log.Fatal(err)
			}
			log.Println("alumne inscrits: " + rsrva.Alumne)
			req = append(req, rsrva)
		}
		log.Println("reserves_paso3")
		if err := stm.Err(); err != nil {
			log.Fatal(err)
		}
		json.NewEncoder(w).Encode(req)
	}

	/*req := []interface{
		controls: []Control{},
		[]Reserva{},
		[]Proposta{},
	}*/
	/*log.Println("GetPropostes")
	req := []Proposta{}





	if len(req) == 0 {
		json.NewEncoder(w).Encode("BUIT")
	} else {
		json.NewEncoder(w).Encode(req)
	}
	/*log.Println("req id: " + req[0].Id_control)
	log.Println("req nom: " + req[0].Nom_user)
	log.Println("req id2: " + req[1].Id_control)
	log.Println("req nom2: " + req[1].Nom_user)*/
	//json.NewEncoder(w).Encode(req)
}

func main() {
	Prefix := "/server/"
	r := mux.NewRouter()
	r.HandleFunc(Prefix+"acces_login", hLogin).Methods("POST")
	r.HandleFunc(Prefix+"addUser", hAddUser).Methods("POST")
	r.HandleFunc(Prefix+"getControls", hGetControls).Methods("GET")
	r.HandleFunc(Prefix+"addControl", hAddControl).Methods("POST")
	r.HandleFunc(Prefix+"reservarControl", hReservarControl).Methods("POST")
	r.HandleFunc(Prefix+"getReserves", hGetReserves).Methods("GET")
	r.HandleFunc(Prefix+"addProposta", hAddProposta).Methods("POST")
	r.HandleFunc(Prefix+"getPropostes", hGetPropostes).Methods("GET")
	r.HandleFunc(Prefix+"deleteControl", hDeleteControl).Methods("POST")
	r.HandleFunc(Prefix+"editarNotes", hEditarNotes).Methods("POST")
	r.HandleFunc(Prefix+"infoAlumne/"+"{alumne}"+"/"+"{tipus}", hInfoAlumne).Methods("GET")
	http.Handle(Prefix, r)
	crearBBDD(true)

	http.Handle("js/", http.StripPrefix("static/js/", http.FileServer(http.Dir("static/js"))))
	http.Handle("resources/", http.StripPrefix("static/resources/", http.FileServer(http.Dir("static/resources"))))
	http.Handle("/", http.FileServer(http.Dir("static")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
