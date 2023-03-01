.PHONY: build
TARGET_DIR ?= build/bazooka
build:
	go generate ./...
	go build -o ${TARGET_DIR}

start-dev:
	@echo "Starting dev server"
	@air -c ./.air.toml
	@echo "Dev server started"
