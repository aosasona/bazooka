.PHONY: build-client
build-client:
	@cd ui && yarn build

.PHONY: build
build:
	@build-client
	@go build -o build/rabbid

start-dev:
	@echo "Starting dev server"
	@air -c ./.air.toml
	@echo "Dev server started"
