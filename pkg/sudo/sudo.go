package sudo

import "os"

func HasSudoPermissions() bool {
	euid := os.Geteuid()

	return euid == 0
}
