package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
)

func NewBasicAuth(username, password string) fiber.Handler {
	return basicauth.New(basicauth.Config{
		ContextUsername: "_username",
		ContextPassword: "_password",
		Users: map[string]string{
			username: password,
		},
	})
}
