package sudo

import "os"

func IsRunningAsSudo() bool {
	euid := os.Geteuid()

	return euid == 0
}
