.PHONY: build
TARGET_DIR ?= build/bazooka
build:
	go generate ./...
	go build -o ${TARGET_DIR}

start-dev:
	@echo "Starting dev server"
	@air -c ./.air.toml
	@echo "Dev server started"

docker-release:
	@echo "Building new image..."
	@docker build -t trulyao/bazooka:latest .
	@echo "Pushing to Docker Hub now"
	@docker push trulyao/bazooka && echo "Latest image released!"

release-binary:
	goreleaser release --clean
