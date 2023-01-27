package process

import (
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

func GetProcesses() ([]ps.Process, error) {
	processes, err := ps.Processes()
	if err != nil {
		return nil, err
	}

	return processes, nil
}

func GetProcess(pid int) (Process, error) {
	process, err := ps.FindProcess(pid)
	if err != nil {
		return Process{}, err
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

func KillProcess(pid int) error {
	return nil
}
