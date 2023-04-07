package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/aosasona/bazooka/cmd/bazooka"
	"github.com/charmbracelet/log"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName:               "Bazooka",
		DisableStartupMessage: true,
		JSONEncoder:           json.Marshal,
		JSONDecoder:           json.Unmarshal,
	})

	port := flag.String("port", "22000", "port to run Bazooka on")

	flag.Parse()

	baz, err := bazooka.New(app)
	if err != nil {
		log.Error(fmt.Sprintf("Failed to start Bazooka: %s", err.Error()))
		os.Exit(1)
	}

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := baz.Start(*port); err != nil {
			log.Error(fmt.Sprintf("Error starting server: %s", err.Error()))
		}
	}()
	log.Info(fmt.Sprintf("Starting Bazooka on port %v", *port))

	<-done

	if err := baz.Stop(); err != nil {
		log.Error("Failed to kill server: %s", err.Error())
	}
	log.Info("-> Stopped Bazooka")
}
