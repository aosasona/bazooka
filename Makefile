.PHONY: build
build:
	go generate ./...
	go build -o build/bazooka

start-dev:
	@echo "Starting dev server"
	@air -c ./.air.toml
	@echo "Dev server started"
