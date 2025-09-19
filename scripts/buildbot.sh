#!/bin/bash

# Build automation script for Docker
# Usage: ./scripts/buildbot.sh

echo "Starting build automation..."

# Run buildbot service
docker-compose --profile buildbot up --build buildbot

echo "Build automation completed."