package main

import (
	"AlphaBackend/mysqlDB"
	"fmt"
	f "fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

func Login(c *fiber.Ctx, store *session.Store) error {
	var loginData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}
	
	response := mysqlDB.LoginValidateDB(loginData.Username,loginData.Password)

	if (response == "Success") {

		//validation is successful, set the session ID
		session, err := store.Get(c)

		if err != nil {
			panic(err)
		}

		
		session.Set("username",loginData.Username)
		
		session.Save()
		fmt.Println("Session saved")

		fmt.Println("sjiowdjiw")
		// Set the session ID as a secure HTTP-only cookie
		
		
		fmt.Println(session.Get("username"))
		

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Login successful",
		})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"message": "Error",
	})

}

func GamePage(c *fiber.Ctx, store *session.Store) error {
	sess, err := store.Get(c)

	if err != nil {
		panic(err)
	}

	user := sess.Get("username")

	key := sess.Keys()

	for i := 0; i < len(key); i++ {
		println(len(key))
		println(key[i])	
	}
	
	fmt.Println(user)
	
	if user != nil {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"user": user,
		})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"message": "No Session found",
	})
}

func getStudent(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")

	if err != nil {
		return c.Status(401).SendString("Invalid ID")
	}


	S := mysqlDB.SelectOnedb(id)
	onetodos := []mysqlDB.Student{S}

	return c.JSON(onetodos)
}

func addStudent(c *fiber.Ctx) error {
	todos:= []Student{}
	todo:= &Student{}

	//if there are errors then return the errors				
	if err:= c.BodyParser(todo); err!=nil {
		return err
	}
	
	var studentInstance mysqlDB.Student

	studentInstance.ID = todo.ID
	studentInstance.FirstName = todo.FirstName
	studentInstance.LastName = todo.LastName
			
	mysqlDB.Insertdb(&studentInstance)
	
	//append the todo
	todos = append(todos, *todo)
	f.Println(todos)
	
	return c.JSON(todos)
}

func deleteStudent(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil{
		return c.Status(401).SendString("Invalid ID")
	}

	mysqlDB.DeleteRow(id)
	
	todos = mysqlDB.SelectAll()

	return c.JSON(todos)
}

func everyStudent(c *fiber.Ctx) error {
	students := mysqlDB.SelectAll()

	return c.JSON(students)
}

func startGame(c *fiber.Ctx) error {
	userID := "123456789"            // Replace with the actual user ID
	gameSessionID := "abc123def456"   // Replace with the actual game session ID
	credit := 100

	// Create the JWT token
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = userID
	claims["game_session_id"] = gameSessionID
	claims["credit"] = credit
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()  // Token expires in 24 hours

	// Sign the token with the secret key
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return c.Status(500).SendString("Token creation failed")
	}

	fmt.Println("Successful")
	// Send the token as a response
	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}

func endGame(c *fiber.Ctx) error {

	var EndGameData struct {
		Credit  int `json:"credit"`
		Session string `json:"game_session_id"`
		User_id string `json:"user_id"`
		Exp float64 `json:"exp"`
	}
	

	token := c.Get("Authorization")
		if token == "" {
			return c.Status(401).JSON(fiber.Map{"message": "Authorization token missing"})
		}

		decodedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil {
			return c.Status(401).JSON(fiber.Map{"message": "Invalid token"})
		}

		claims, ok := decodedToken.Claims.(jwt.MapClaims)
		fmt.Println(claims)
		if !ok || !decodedToken.Valid {
			return c.Status(401).JSON(fiber.Map{"message": "Invalid token"})
		}


		// Retrieve the request body
		if err := c.BodyParser(&EndGameData); err != nil {
			fmt.Println(EndGameData)
			return c.Status(fiber.StatusBadRequest).SendString("Error parsing request body")
		}

		// Print the win amount
		
		fmt.Printf("amount: %d\n", EndGameData.Credit)

		return c.SendString("Win amount processed successfully")
	
}