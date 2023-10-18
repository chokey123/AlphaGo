package mysqlDB

import (
	"database/sql"
	f "fmt"
	"log"
)

var DB *sql.DB

type Student struct {
	ID int `json:"id"`
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
}

func ConnectionDB() {
	db, err := sql.Open("mysql", "root:Thesb@0928@tcp(localhost:3306)/testdb")

	if err != nil {
		f.Println("error validating sql.Open arguments")
		panic(err.Error())
	}

	DB = db
}

func ConnectionDBAlpha() {
	db, err := sql.Open("mysql", "root:Thesb@0928@tcp(localhost:3306)/alpha")

	if err != nil {
		f.Println("error validating sql.Open arguments")
		panic(err.Error())
	}

	DB = db
}

func LoginValidateDB(username string, password string) string{
	stmt := "SELECT userID FROM user WHERE username = ? AND password = ?"
	
	row := DB.QueryRow(stmt,username,password)

	var userID string
	err := row.Scan(&userID)

	if err == sql.ErrNoRows {
		return "Invalid Credentials"
	} else if err != nil {
		log.Printf("Error querying the database: %v", err)
	}

	return "Success"
}

func SelectOnedb (id int) Student {
	var S Student

	stmt := "SELECT * FROM students WHERE id = ?;"

	row := DB.QueryRow(stmt,id )

	err := row.Scan(&S.ID,&S.FirstName,&S.LastName)

	if err !=nil {
		panic(err)
	}

	f.Println(S.ID)
	f.Println(S.FirstName)
	f.Println(S.LastName)

	return S;
}

func Insertdb(student *Student){

	stmt := "INSERT INTO `testdb`.`students` (`id`, `firstname`, `lastname`) VALUES (?, ?, ?);"
	
	insert, err := DB.Query(stmt, student.ID, student.FirstName, student.LastName)
	if err != nil {
		panic(err.Error())
	}
	defer insert.Close()
	f.Println("Successful Connection to Database!")
}



func SelectAll() []Student {
	stmt := "SELECT * FROM students"
	rows, err := DB.Query(stmt)

	if err != nil {
		panic(err)
	}

	defer rows.Close()

	var students []Student
	for rows.Next() {
		var s Student

		err = rows.Scan(&s.ID, &s.FirstName, &s.LastName)
		if err!= nil {
			panic(err)
		}

		students = append(students, s)
	}
	return students
}

func DeleteRow(id int) {
	//  func (db *DB) Prepare(query string) (*Stmt, error)
	del, err := DB.Prepare("DELETE FROM `testdb`.`students` WHERE (`id` = ?);")
	if err != nil {
		panic(err)
	}
	defer del.Close()
	var res sql.Result
	res, err = del.Exec(id)

	rowsAff, _ := res.RowsAffected()
	f.Println("rows Affected: ", rowsAff)

	if err != nil || rowsAff != 1 {
		f.Println( "Error deleting product")
		return
	}
	
	/*
		if err != nil {
			fmt.Fprint(w, "Error deleting product")
			return
		}
	*/
	f.Println("err: ", err)
}