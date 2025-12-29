# Build stage for github-mcp-server
FROM golang:1.23-bullseye AS github-builder
RUN git clone https://github.com/github/github-mcp-server.git /tmp/github-mcp-server \
    && cd /tmp/github-mcp-server \
    && go build -o github-mcp-server ./cmd/github-mcp-server

# Build stage for similarity-ts
FROM rust:latest AS similarity-builder
RUN cargo install similarity-ts

# Base stage for development environment
FROM ubuntu:24.04 AS development

# Set environment to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Set locale for Japanese support
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8

# Install essential packages and Japanese language support
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    jq \
    build-essential \
    ca-certificates \
    gnupg \
    sudo \
    locales \
    language-pack-ja \
    fonts-noto-cjk \
    ripgrep \
    vim \
    python3 \
    python3-pip \
    python3-venv \
    && locale-gen ja_JP.UTF-8 \
    && update-locale LANG=ja_JP.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22.x
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally and configure settings
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PNPM_STORE_DIR="/home/node/.pnpm-store"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm config set ignore-scripts true
RUN npm install -g pnpm \
    && pnpm config set minimum-release-age 7200

# Create node user with sudo privileges (for development)
RUN useradd -ms /bin/bash node \
    && usermod -aG sudo node \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Set up basic git configuration
RUN git config --global init.defaultBranch main


# Install additional packages for development
RUN apt-get update && apt-get install -y \
    fcitx-mozc \
    && rm -rf /var/lib/apt/lists/*


# Copy built binaries from build stages
COPY --from=github-builder /tmp/github-mcp-server/github-mcp-server /usr/local/bin/
COPY --from=similarity-builder /usr/local/cargo/bin/similarity-ts /usr/local/bin/

# Make binaries executable
RUN chmod +x /usr/local/bin/github-mcp-server \
    && chmod +x /usr/local/bin/similarity-ts

# Switch back to node user
USER node
WORKDIR /home/node

# Ensure pnpm dirs are writable for the node user
RUN mkdir -p "$PNPM_HOME" "$PNPM_STORE_DIR"
RUN pnpm config set store-dir "$PNPM_STORE_DIR"

# Install uv (Python package manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Claude Code CLI
# RUN npm install -g @anthropic-ai/claude-code
RUN curl -fsSL https://claude.ai/install.sh | bash

# Update PATH to include uv and claude
ENV PATH="/home/node/.local/bin:/home/node/.cargo/bin:${PATH}"

# Install specify-cli using uv
RUN uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Set up workspace
WORKDIR /workspace

# Configure git to use rebase by default and set up useful aliases
RUN git config --global pull.rebase true \
    && git config --global alias.co checkout \
    && git config --global alias.br branch \
    && git config --global alias.ci commit \
    && git config --global alias.st status \
    && git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit" \
    && git config --global init.defaultBranch main 


# Expose port for MCP server (using 8765 instead of 3001)
EXPOSE 8770

# Default command
CMD ["/bin/bash"]
