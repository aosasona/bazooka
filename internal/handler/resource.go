package handler

import (
	"fmt"
	"time"

	"github.com/aosasona/bazooka/pkg/response"
	"github.com/aosasona/bazooka/pkg/system"
	"github.com/gofiber/fiber/v2"
)

type Resources struct {
	CPU    system.CPUStats    `json:"cpu"`
	Memory system.MemoryStats `json:"memory"`
}

func (h *handler) getResources(c *fiber.Ctx) error {
	res := response.New(c)

	var (
		resources Resources
		err       error
	)

	if resources.CPU, err = system.GetCPUStats(); err != nil {
		return res.Error(&response.Data{Err: err})
	}

	if resources.Memory, err = system.GetMemoryStats(); err != nil {
		return res.Error(&response.Data{Err: err})
	}

	lastUpdated := time.Now().Format("2006-01-02 15:04:05")

	return res.Success(&response.Data{
		Message: fmt.Sprintf("Last updated: %s", lastUpdated),
		Data:    resources,
	})
}
