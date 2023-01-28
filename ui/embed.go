package ui

import (
	"embed"
	"io/fs"
)

//go:generate yarn
//go:generate yarn build
//go:embed dist/*
var UIDir embed.FS
var (
	UIFS fs.FS
)

func init() {
	var err error
	UIFS, err = fs.Sub(UIDir, "dist")
	if err != nil {
		panic(err)
	}
}
