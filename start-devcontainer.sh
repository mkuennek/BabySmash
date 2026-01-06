#!/bin/bash
# Start the devcontainer using Podman as the runtime

set -e

# Check if podman is installed
if ! command -v podman &> /dev/null; then
    echo "Error: Podman is not installed."
    echo "Install it with: brew install podman"
    exit 1
fi

# Check if devcontainer CLI is installed
if ! command -v devcontainer &> /dev/null; then
    echo "Error: devcontainer CLI is not installed."
    echo "Install it with: npm install -g @devcontainers/cli"
    exit 1
fi

# Check if 1Password CLI is installed
if ! command -v op &> /dev/null; then
    echo "Error: 1Password CLI is not installed."
    echo "Install it with: brew install 1password-cli"
    exit 1
fi

# Retrieve GitHub token from 1Password
echo "Retrieving GitHub token from 1Password..."
GH_TOKEN=$(op read "op://Personal/Github Token Devcontainer/credential")
if [ -z "$GH_TOKEN" ]; then
    echo "Error: Failed to retrieve GitHub token from 1Password."
    exit 1
fi
export GH_TOKEN
export GITHUB_TOKEN="$GH_TOKEN"

# Ensure podman machine is running
if ! podman machine info &> /dev/null; then
    echo "Starting Podman machine..."
    podman machine start
fi

# Start the devcontainer with Podman and publish ports
echo "Starting devcontainer with Podman..."
devcontainer up --workspace-folder . --docker-path podman \
    --remote-env GH_TOKEN="$GH_TOKEN" \
    --remote-env GITHUB_TOKEN="$GH_TOKEN"

# Open a shell in the container
echo "Opening shell in devcontainer..."
devcontainer exec --workspace-folder . --docker-path podman \
    --remote-env GH_TOKEN="$GH_TOKEN" \
    --remote-env GITHUB_TOKEN="$GH_TOKEN" \
    bash
