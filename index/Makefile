VERSION := $(shell echo $(shell git describe --tags) | sed 's/^v//')
COMMIT  := $(shell git log -1 --format='%H')

export GO111MODULE = on

###############################################################################
###                                   All                                   ###
###############################################################################

all: build

###############################################################################
###                                Build flags                              ###
###############################################################################

LD_FLAGS = -X github.com/desmos-labs/juno/version.Version=$(VERSION) \
	-X github.com/desmos-labs/juno/version.Commit=$(COMMIT)

BUILD_FLAGS := -ldflags '$(LD_FLAGS)'

###############################################################################
###                                  Build                                  ###
###############################################################################

build: go.sum
	@echo "building cyberindex binary..."
	@go build -mod=readonly $(BUILD_FLAGS) -o build/cyberindex ./cmd/cyberindex
.PHONY: build

###############################################################################
# Build / Run in Docker
###############################################################################

docker:
	@sh scripts/start-docker.sh
.PHONY: docker

###############################################################################
###                                 Install                                 ###
###############################################################################

install: go.sum
	@echo "installing cyberindex binary..."
	@go install -mod=readonly $(BUILD_FLAGS) ./cmd/cyberindex
.PHONY: install

###############################################################################
###                           Tools / Dependencies                          ###
###############################################################################

go-mod-cache: go.sum
	@echo "--> Download go modules to local cache"
	@go mod download

go.sum: go.mod
	@echo "--> Ensure dependencies have not been modified"
	go mod verify
	go mod tidy
.PHONY: go.sum

.PHONY: go.sum go-mod-cache
