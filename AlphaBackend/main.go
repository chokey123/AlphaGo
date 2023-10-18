package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"AlphaBackend/mysqlDB"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

var DB *sql.DB

type Student struct {
	ID int `json:"id"`
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
}

var todos = []mysqlDB.Student{}

const secretKey = "your_secret_key"




func main() {
	
	// mysqlDB.ConnectionDB()
	mysqlDB.ConnectionDBAlpha()

	// defer mysqlDB.DB.Close()

	// app := fiber.New()

	// app.Use(cors.New(cors.Config{
	// 		AllowCredentials: true,
	// 		AllowOrigins: "http://localhost:5173",
	// 		AllowMethods: "GET, PUT, POST, DELETE, OPTIONS",
	// 		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	// }))


	

	// expirationTime := 5 * time.Minute
	// store := session.New(session.Config{
	// 	Expiration: expirationTime,
	// })
	
	
		
	// app.Post("/login",func(c *fiber.Ctx) error {
	// 	return Login(c, store)})
	// app.Get("/game", func(c *fiber.Ctx) error {
	// 	return GamePage(c,store)
	// })

	// //testdb
	// app.Get("/api/todos/:id", getStudent)
	// app.Post("/api/todos", addStudent)
	// app.Delete("/api/todos/:id", deleteStudent)
	// app.Get("/api/todos", everyStudent)

	// //Game Thing
	// app.Get("/start_game", startGame)
	// app.Post("/end_game", endGame)
	
	// log.Fatal(app.Listen(":4000"))

	app := fiber.New()

	// Initialize session middleware
	
	app.Use(cors.New(cors.Config{
			AllowCredentials: true,
			AllowOrigins: "http://localhost:5173",
			AllowMethods: "GET, PUT, POST, DELETE, OPTIONS",
			AllowHeaders: "Origin, Content-Type, Accept, Authorization",
			
	}))


	app.Get("/set-session", func(c *fiber.Ctx) error {
		// Set a value in the session
		
		cookie := new(fiber.Cookie)
		cookie.Name = "yourCookieName"
		cookie.Value = "yourCookieValue"
		cookie.Expires = time.Now().Add(24 * time.Hour) // Set the cookie expiration time
		cookie.SameSite = "None"
	
		// Add the cookie to the response
		c.Cookie(cookie)

		
		//return c.Redirect("/get-session")

		return c.SendString("Session set")
	})

	app.Get("/get-session", func(c *fiber.Ctx) error {
		// Get a value from the session
		//sess, err := store.Get(c)

		session := c.Cookies("yourCookieName")

		log.Println(session)

		user := session


		fmt.Println(user)


		return c.SendString("Username from session: "+ user)
	})

	app.Listen(":3001")

	
}


