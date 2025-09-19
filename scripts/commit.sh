#!/bin/bash

# Commit automation script for Docker
# Usage: ./scripts/commit.sh

echo "Starting commit automation..."

# Run commit service
docker-compose --profile commit up --build commit-bot

echo "Commit automation completed."