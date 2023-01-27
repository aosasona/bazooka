package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/aosasona/bazooka/pkg/process"
	"github.com/aosasona/bazooka/pkg/response"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) killProcesses(c *fiber.Ctx) error {
	res := response.New(c)

	var body PostBody

	if err := c.BodyParser(&body); err != nil {
		return res.Error(&response.Data{Err: err, Code: http.StatusUnprocessableEntity})
	}

	pidsCount := len(body.Pids)
	if pidsCount <= 0 {
		return res.Error(&response.Data{Message: "No PIDs provided!", Code: http.StatusBadRequest})
	}

	for idx, pid := range body.Pids {
		_, err := process.GetProcessByPID(pid)
		if err != nil {
			if pidsCount > 1 && idx != (pidsCount-1) {
				continue
			}
			return res.Error(
				&response.Data{
					Message: fmt.Sprintf("Process %v not found!", pid),
					Err:     err,
					Meta: map[string]interface{}{
						"extra": "Some processes might have been terminated already",
					},
				},
			)
		}

		pidStr := strconv.Itoa(pid)
		err = process.KillProcess(pidStr)
		if err != nil {
			return res.Error(
				&response.Data{
					Message: fmt.Sprintf("Failed to kill process %v", pid),
					Err:     err,
					Meta: map[string]interface{}{
						"extra": "Some processes might have been terminated already",
					},
				},
			)
		}
	}

	return res.Success(&response.Data{Message: "All processes specified have been terminated"})
}
