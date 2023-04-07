package bazooka

import (
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/aosasona/bazooka/internal/handler"
	"github.com/aosasona/bazooka/pkg/sudo"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

type config struct {
	user        string
	password    string
	requireAuth bool
	isDev       bool
}

type bazooka struct {
	app    *fiber.App
	config config
}

func New(app *fiber.App) (*bazooka, error) {
	var baz bazooka
	baz.app = app

	c, err := readEnv()
	if err != nil {
		return &baz, err
	}

	baz.config = c

	return &baz, nil
}

func (b *bazooka) Start(port string) error {
	app := b.app
	if port == "" {
		port = "22000"
	}

	if b.config.isDev {
		app.Use(cors.New(cors.Config{
			AllowOrigins: "*",
		}))
	}
	app.Use(logger.New())
	app.Use(recover.New())

	h := handler.New(app)

	if b.config.requireAuth {
		h.AddBasicAuthCredential(b.config.user, b.config.password)
	}

	h.ServeUI()
	h.ServeAPI()

	if !sudo.IsRunningAsSudo() {
		log.Warn(
			"bazooka requires root permissions to function properly, please restart the program with sudo or it would require you to type in your password at a later time and leave requests hanging (not recommended)",
		)
	}

	return app.Listen(fmt.Sprintf("0.0.0.0:%s", port))
}

func (b *bazooka) Stop() error {
	if err := b.app.Shutdown(); err != nil {
		return err
	}
	return nil
}

func readEnv() (config, error) {
	var c config

	err := godotenv.Load()
	if err != nil {
		return c, errors.New("unable to load environment variables")
	}

	c.user = os.Getenv("AUTH_USER")
	c.password = os.Getenv("AUTH_PASSWORD")

	c.requireAuth = c.user != "" && c.password != ""
	c.isDev = strings.ToLower(os.Getenv("ENV")) == "development"

	return c, nil
}
