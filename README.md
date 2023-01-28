# Bazooka ⚡️

![Bazooka](./assets/screenshot.png)

Bazooka is a simple tool to find and kill processes on your machine by name or port. It provides a simple Web UI to view, search and kill processes without having to use the command line.

# Installation

## Homebrew

You can install Bazooka using Homebrew:

```bash
brew tap aosasona/bazooka
brew install bazooka
```

## Download

Download the latest release from the [releases page](https://github.com/aosasona/bazooka/releases) and extract the zip file. Run the executable file to start the application or run it from the command line like so:

```bash
cd bazooka && ./bazooka --port=8080
```

## Build from source

You can also build the application from source by cloning the repository to your machine and running the following Make command:

```bash
make build
```

This will create a `bazooka` executable file in the `/build` directory. You can run this file to start the application.

# Usage

Run the application with the following command:

```bash
bazooka --port=22000
```

> By default, Bazooka runs on port 22000. You can change this by passing the `--port` flag.

Once the application is running, you can access the Web UI by visiting `http://localhost:22000` in your browser. You can also change the port by passing the `--port` flag when starting the application.

## Contributing 🔖

If you find any bugs or have any suggestions, please feel free to open an issue or submit a pull request.
