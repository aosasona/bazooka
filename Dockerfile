FROM golang:1.20.1 as base

# we need Node >= 16.12.0 and yarn to build the Astro UI
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get update && \
  apt-get install -y nodejs && \
  npm install --global yarn

WORKDIR /go/src/app
COPY go.* .
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 make build TARGET_DIR=/go/bin/app

FROM gcr.io/distroless/static-debian11
COPY --from=base /go/bin/app /

EXPOSE 22000

CMD ["/app"]
