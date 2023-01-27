package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/aosasona/bazooka/internal/process"
	"github.com/aosasona/bazooka/pkg/response"
	"github.com/gofiber/fiber/v2"
)

type GetParams struct {
	Name string `json:"name"`
	Pid  string `json:"pid"`
	Port string `json:"port"`
}

func (h *Handler) getProcessByPort(c *fiber.Ctx) error {
	res := response.New(c)

	var (
		params GetParams
	)
	if err := c.ParamsParser(&params); err != nil {
		return res.Error(&response.Data{Err: err, Code: http.StatusUnprocessableEntity})
	}

	pid, err := process.GetPIDByPort(params.Port)
	if err != nil {
		return res.Error(&response.Data{Err: err})
	}

	port, _ := strconv.Atoi(params.Port)
	data, err := process.GetProcess(pid)

	if err != nil {
		return res.Error(
			&response.Data{
				Err:     err,
				Message: "Unable to get process",
				Code:    http.StatusNotFound,
			},
		)
	}

	data.Port = port
	return res.Success(
		&response.Data{
			Message: fmt.Sprintf("Result for process running on port %v", port),
			Data:    data,
		},
	)
}

func (h *Handler) getProcessesByName(c *fiber.Ctx) error {
	res := response.New(c)

	var (
		processes []process.Process
		params    GetParams
	)
	if err := c.ParamsParser(&params); err != nil {
		return res.Error(&response.Data{Err: err, Code: http.StatusUnprocessableEntity})
	}

	pids, err := process.GetPIDsByName(params.Name)
	if err != nil {
		return res.Error(&response.Data{Err: err})
	}

	for _, pid := range pids {

		data, err := process.GetProcess(pid)

		if err != nil {
			return res.Error(
				&response.Data{
					Err:     err,
					Message: "Unable to get process",
					Code:    http.StatusNotFound,
				},
			)
		}

		processes = append(processes, data)
	}

	return res.Success(
		&response.Data{
			Message: fmt.Sprintf("Results for processes with name '%v'", params.Name),
			Data:    processes,
		},
	)
}

func (h *Handler) getAllProcesses(c *fiber.Ctx) error {
	res := response.New(c)

	var processes []process.Process

	rawProcesses, err := process.GetProcesses()
	if err != nil {
		return res.Error(&response.Data{Message: "Unable to load processes", Err: err})
	}

	for _, proc := range rawProcesses {
		pid := proc.Pid()
		ppid := proc.PPid()
		processes = append(
			processes,
			process.Process{Name: proc.Executable(), PID: pid, PPID: ppid},
		)
	}

	return res.Success(&response.Data{Message: "Here you go!", Data: processes})
}

func (h *Handler) getProcess(c *fiber.Ctx) error {
	res := response.New(c)

	var (
		pid    int
		params GetParams
	)
	if err := c.ParamsParser(&params); err != nil {
		return res.Error(&response.Data{Err: err, Code: http.StatusUnprocessableEntity})
	}

	pid, err := strconv.Atoi(params.Pid)
	if err != nil {
		return res.Error(&response.Data{Err: err, Code: http.StatusUnprocessableEntity})
	}

	process, err := process.GetProcess(pid)
	if err != nil {
		return res.Error(&response.Data{Message: "Unable to find process", Err: err})
	}

	return res.Success(&response.Data{Message: "Here you go", Data: process})
}
