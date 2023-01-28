package ui

import (
	"embed"
)

//go:generate yarn
//go:generate yarn build
//go:embed dist/*
var UIDir embed.FS
