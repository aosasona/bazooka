package bazooka

import (
	"fmt"

	"github.com/aosasona/bazooka/internal/handler"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

type Bazooka struct {
	app *fiber.App
}

func New(app *fiber.App) *Bazooka {
	return &Bazooka{
		app: app,
	}
}

func (b *Bazooka) Start(port string) error {
	app := b.app
	if port == "" {
		port = "22000"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))
	app.Use(logger.New())
	app.Use(recover.New())

	endpoints := handler.New(app)
	endpoints.Serve()

	return app.Listen(fmt.Sprintf(":%s", port))
}

func (b *Bazooka) Stop() error {
	if err := b.app.Shutdown(); err != nil {
		return err
	}
	return nil
}
