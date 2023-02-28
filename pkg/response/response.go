package response

import (
	"github.com/gofiber/fiber/v2"
)

type Response struct {
	ctx *fiber.Ctx
}

type Data struct {
	Ok      bool                   `json:"ok"`
	Code    int                    `json:"code"`
	Message string                 `json:"message"`
	Data    any                    `json:"data,omitempty"`
	Meta    map[string]interface{} `json:"meta,omitempty"`
	Err     error                  `json:"-"`
}

func New(c *fiber.Ctx) *Response {
	return &Response{
		ctx: c,
	}
}

func (r *Response) Success(data *Data) error {
	data.Ok = true

	if data.Code == 0 {
		data.Code = 200
	}

	return r.ctx.Status(data.Code).JSON(data)
}

func (r *Response) Error(data *Data) error {
	data.Ok = false

	if data.Message == "" {
		data.Message = "An error occurred."
	}

	if data.Code == 0 {
		data.Code = 500
	}

	if data.Err != nil {
		data.Meta = map[string]interface{}{
			"trace_msg": data.Err.Error(),
		}
	}

	return r.ctx.Status(data.Code).JSON(data)
}
