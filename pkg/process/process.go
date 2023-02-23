package process

import (
	"errors"
	"fmt"
	"os/exec"
	"strconv"
	"strings"

	ps "github.com/mitchellh/go-ps"
)

type Process struct {
	Name string `json:"name"`
	PID  int    `json:"pid"`
	PPID int    `json:"ppid"`
	Port int    `json:"port"`
}

type Processes []Process

/* sort interface implementation for Processes struct */
func (p Processes) Len() int {
	return len(p)
}

func (p Processes) Less(x, y int) bool {
	return p[x].Name < p[y].Name
}

func (p Processes) Swap(x, y int) {
	p[x], p[y] = p[y], p[x]
}

/* Process methods */

func GetProcesses() ([]ps.Process, error) {
	processes, err := ps.Processes()
	if err != nil {
		return nil, err
	}

	return processes, nil
}

func GetProcessByPID(pid int) (Process, error) {
	process, err := ps.FindProcess(pid)
	if err != nil {
		return Process{}, err
	}

	if process == nil {
		return Process{}, errors.New("process not found")
	}

	return Process{
		Name: process.Executable(),
		PID:  process.Pid(),
		PPID: process.PPid(),
	}, nil
}

func GetPIDByPort(rawPort string) (int, error) {
	var output int

	port, err := strconv.Atoi(rawPort)

	portFlag := fmt.Sprintf("-i:%v", port)

	raw, err := exec.Command("sudo", "lsof", "-t", portFlag).Output()
	if err != nil {
		return output, err
	}

	conv := strings.Fields(string(raw))[0]
	output, err = strconv.Atoi(conv)

	return output, nil
}

func GetPIDsByName(name string) ([]int, error) {
	var output []int

	raw, err := exec.Command("sudo", "pgrep", name).Output()
	if err != nil {
		return nil, nil
	}

	strs := strings.Fields(string(raw))
	for _, str := range strs {
		pid, err := strconv.Atoi(str)
		if err != nil {
			return nil, err
		}
		output = append(output, pid)
	}

	return output, nil
}

func KillProcess(pid string) error {
	_, err := exec.Command("kill", "-9", pid).Output()
	if err != nil {
		return err
	}
	return nil
}
