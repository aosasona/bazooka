package bazooka

import (
	"fmt"

	"github.com/aosasona/bazooka/internal/handler"
	"github.com/aosasona/bazooka/pkg/sudo"
	"github.com/charmbracelet/log"
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
	endpoints.ServeUI()
	endpoints.ServeAPI()

	if !sudo.IsRunningAsSudo() {
		log.Warn(
			"Bazooka requires root permissions to function properly, please restart the program with sudo or it would require you to type in your password at a later time and leave requests hanging (not recommended)",
		)
	}

	return app.Listen(fmt.Sprintf("0.0.0.0:%s", port))
}

func (b *Bazooka) Stop() error {
	if err := b.app.Shutdown(); err != nil {
		return err
	}
	return nil
}
