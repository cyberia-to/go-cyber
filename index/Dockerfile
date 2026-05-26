FROM ubuntu:22.04 as builder

ENV GO_VERSION '1.22.2'
ENV GO_ARCH 'linux-amd64'
ENV GO_BIN_SHA '5901c52b7a78002aeff14a21f93e0f064f74ce1360fce51c6ee68cd471216a17'

WORKDIR /app

COPY go.mod go.sum ./

RUN apt-get update && apt-get install -y --no-install-recommends make build-essential wget ca-certificates

RUN wget -O go.tgz https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz && \
    echo "${GO_BIN_SHA} *go.tgz" | sha256sum -c - && \
    tar -C /usr/local -xzf go.tgz &&\
    rm go.tgz

ENV PATH="/usr/local/go/bin:$PATH"

COPY . .

RUN go mod download

RUN make build

FROM ubuntu:22.04 

RUN apt-get update && apt-get install -y --no-install-recommends  build-essential ca-certificates

WORKDIR /app

COPY --from=builder /app/build/cyberindex /usr/bin/cyberindex

COPY --from=builder /root/go/pkg/mod/github.com/!cosm!wasm/wasmvm@v1.5.2/internal/api/libwasmvm.x86_64.so /root/go/pkg/mod/github.com/!cosm!wasm/wasmvm@v1.5.2/internal/api/libwasmvm.x86_64.so

COPY ./entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["cyberindex", "start"]
