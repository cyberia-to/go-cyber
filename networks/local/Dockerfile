###########################################################################################
# Build cyber from local source
###########################################################################################
FROM ubuntu:20.04

ENV GO_VERSION '1.22.2'
ENV GO_ARCH 'linux-amd64'
ENV GO_BIN_SHA '5901c52b7a78002aeff14a21f93e0f064f74ce1360fce51c6ee68cd471216a17'
ENV DEBIAN_FRONTEND=noninteractive
ENV DAEMON_HOME /root/.cyber
ENV DAEMON_RESTART_AFTER_UPGRADE=true
ENV DAEMON_ALLOW_DOWNLOAD_BINARIES=false
ENV DAEMON_LOG_BUFFER_SIZE=1048
ENV UNSAFE_SKIP_BACKUP=true
ENV DAEMON_NAME cyber
ENV BUILD_DIR /build
ENV PATH="/usr/local/go/bin:/usr/local/cuda/bin:/root/.cargo/bin:$PATH"

# Install go
###########################################################################################
RUN apt-get update && apt-get install -y --no-install-recommends wget ca-certificates \
&& wget -O go.tgz https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz \
&& echo "${GO_BIN_SHA} *go.tgz" | sha256sum -c - \
&& tar -C /usr/local -xzf go.tgz \
&& rm go.tgz \
&& go version

# Install build tools
###########################################################################################
RUN apt-get -y install --no-install-recommends make gcc g++

# Copy and build go-cyber from local source (parent directory)
###########################################################################################
COPY . /sources/go-cyber
WORKDIR /sources/go-cyber
RUN mkdir -p /cyber/cosmovisor/genesis/bin \
&& make build CUDA_ENABLED=false \
&& cp ./build/cyber /cyber/cosmovisor/genesis/bin/ \
&& cp ./build/cyber /usr/local/bin \
&& rm -rf ./build

# Cleanup build tools
###########################################################################################
RUN apt-get purge -y make gcc g++ \
&& go clean --cache -i \
&& apt-get autoremove -y \
&& apt-get clean

# Install cosmovisor
###########################################################################################
RUN wget -O cosmovisor.tgz https://github.com/cosmos/cosmos-sdk/releases/download/cosmovisor%2Fv1.5.0/cosmovisor-v1.5.0-linux-amd64.tar.gz \
&& tar -xzf cosmovisor.tgz \
&& cp cosmovisor /usr/bin/cosmovisor \
&& chmod +x /usr/bin/cosmovisor \
&& rm cosmovisor.tgz

# Copy startup scripts
###########################################################################################
WORKDIR /
COPY networks/local/start_script.sh start_script.sh
COPY networks/local/entrypoint.sh /entrypoint.sh
RUN chmod +x start_script.sh \
&& chmod +x /entrypoint.sh \
&& cyber version

# Start
###########################################################################################
EXPOSE 26656 26657 1317 9090 26660
ENTRYPOINT ["/entrypoint.sh"]
CMD ["./start_script.sh"]
