#!/bin/bash

# Start the dev server in the background
bun run dev > /dev/null 2>&1 &

while true; do
  opencode run "$(cat Prompt.md)"
done
