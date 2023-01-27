package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/aosasona/bazooka/cmd/bazooka"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "Bazooka",
	})
	port := os.Getenv("PORT")

	if port == "" {
		port = "22000"
	}

	baz := bazooka.New(app)

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := baz.Start(port); err != nil {
			log.Fatalf("Error starting server: %s", err.Error())
		}
	}()
	log.Printf("Running Bazooka on %s", fmt.Sprintf("http://localhost:%v", port))

	<-done
	if err := baz.Stop(); err != nil {
		log.Printf("Failed to kill server: %s", err.Error())
	}
	log.Print("Stopped Bazooka successfully")

}
