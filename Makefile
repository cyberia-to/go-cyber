#!/usr/bin/make -f
NODE ?= false
VERSION := $(shell echo $(shell git describe --tags) | sed 's/^v//')
COMMIT := $(shell git log -1 --format='%H')
BFT_VERSION := $(shell go list -m github.com/cometbft/cometbft | sed 's:.* ::')

BINDIR ?= $(GOPATH)/bin
BUILDDIR ?= $(CURDIR)/build/

# for dockerized protobuf tools
DOCKER := $(shell which docker)
BUF_IMAGE=bufbuild/buf@sha256:3cb1f8a4b48bd5ad8f09168f10f607ddc318af202f5c057d52a45216793d85e5 #v1.4.0
DOCKER_BUF := $(DOCKER) run --rm -v $(CURDIR):/workspace --workdir /workspace $(BUF_IMAGE)
HTTPS_GIT := https://github.com/cybercongress/go-cyber.git

export GO111MODULE = on

###############################################################################
###                              Build Flags/Tags                           ###
###############################################################################

ifeq ($(NODE),true)
  # cyber — full node binary (CGO + CUDA + Ledger)
  BINARY_NAME := cyber
  APP_NAME := cyber
  CGO_FLAG := 1
  build_tags = netgo ledger cuda

  # Verify CUDA
  NVCC_RESULT := $(shell which nvcc 2> /dev/null)
  ifeq ($(NVCC_RESULT),)
    $(error CUDA not installed — required for NODE=true)
  endif

  # Verify gcc
  GCC_RESULT := $(shell command -v gcc 2> /dev/null)
  ifeq ($(GCC_RESULT),)
    $(error gcc not installed — required for NODE=true)
  endif
else
  # cyb — CLI binary (CGO=0, static)
  BINARY_NAME := cyb
  APP_NAME := cyb
  CGO_FLAG := 0
  build_tags = netgo
  EXTRA_LDFLAGS := -s -w
endif

build_tags += $(BUILD_TAGS)
build_tags := $(strip $(build_tags))

whitespace :=
empty = $(whitespace) $(whitespace)
comma := ,
build_tags_comma_sep := $(subst $(empty),$(comma),$(build_tags))

ldflags = -X github.com/cosmos/cosmos-sdk/version.Name=cyber \
		  -X github.com/cosmos/cosmos-sdk/version.AppName=$(APP_NAME) \
		  -X github.com/cosmos/cosmos-sdk/version.Version=$(VERSION) \
		  -X github.com/cosmos/cosmos-sdk/version.Commit=$(COMMIT) \
		  -X "github.com/cosmos/cosmos-sdk/version.BuildTags=$(build_tags_comma_sep)" \
		  -X github.com/cometbft/cometbft/version.BFTVer=$(BFT_VERSION) \
		  $(EXTRA_LDFLAGS)

ldflags += $(LDFLAGS)
ldflags := $(strip $(ldflags))
BUILD_FLAGS := -tags "$(build_tags_comma_sep)" -ldflags '$(ldflags)' -trimpath

include contrib/devtools/Makefile

all: build format lint test
.PHONY: all

###############################################################################
###                                Build                                    ###
###############################################################################

build: go.sum
	CGO_ENABLED=$(CGO_FLAG) go build $(BUILD_FLAGS) -o $(BUILDDIR)$(BINARY_NAME) ./cmd/cyber

install: build
	install -m 755 $(BUILDDIR)$(BINARY_NAME) $(BINDIR)/$(BINARY_NAME)

.PHONY: build install

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

###############################################################################
###                                Localnet                                 ###
###############################################################################

# TODO update localnet flow
#build-docker-cybernode: build-linux
#	$(MAKE) -C networks/local
#
## Run a 4-node testnet locally
#localnet-start: localnet-stop
#	@if ! [ -f build/node0/cyber/config/genesis.json ]; then docker run --rm -v $(CURDIR)/build:/cyber:Z cybercongress/cyber testnet --v 4 -o . --starting-ip-address 192.168.10.2 --keyring-backend=test --chain-id=chain-local ; fi
#	docker-compose up -d
#
## Stop testnet
#localnet-stop:
#	docker-compose down

###############################################################################
###                                Linting                                  ###
###############################################################################

format-tools:
	go install mvdan.cc/gofumpt@v0.4.0
	go install github.com/client9/misspell/cmd/misspell@v0.3.4
	go install golang.org/x/tools/cmd/goimports@latest

lint: format-tools
	golangci-lint run --tests=false
	find . -name '*.go' -type f -not -path "./vendor*" -not -path "*.git*" -not -path "*_test.go" | xargs gofumpt -d

format: format-tools
	find . -name '*.go' -type f -not -path "./vendor*" -not -path "*.git*" -not -path "./client/docs/statik/statik.go" | xargs gofumpt -w
	find . -name '*.go' -type f -not -path "./vendor*" -not -path "*.git*" -not -path "./client/docs/statik/statik.go" | xargs misspell -w
	find . -name '*.go' -type f -not -path "./vendor*" -not -path "*.git*" -not -path "./client/docs/statik/statik.go" | xargs goimports -w -local github.com/cybercongress/go-cyber

###############################################################################
###                                Protobuf                                 ###
###############################################################################

protoVer=0.13.1
protoImageName=ghcr.io/cosmos/proto-builder:$(protoVer)
protoImage=$(DOCKER) run --rm -v $(CURDIR):/workspace --workdir /workspace $(protoImageName)

proto-all: proto-format proto-lint proto-gen

proto-gen:
	@echo "Generating Protobuf files"
	@$(protoImage) sh ./scripts/protocgen.sh

proto-format:
	@echo "Formatting Protobuf files"
	@$(protoImage) find ./ -name "*.proto" -exec clang-format -i {} \;

# npm install -g swagger2openapi swagger-merger swagger-combine
proto-swagger-gen:
	@echo "Generating Protobuf Swagger OpenAPI"
	@./scripts/protoc_swagger_openapi_gen.sh

proto-lint:
	@$(DOCKER_BUF) lint --error-format=json

proto-check-breaking:
	@$(DOCKER_BUF) breaking --against $(HTTPS_GIT)#branch=main
