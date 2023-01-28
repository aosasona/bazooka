package ui

import (
	"embed"
)

//go:generate yarn
//go:generate yarn build
//go:embed all:dist
var files embed.FS
