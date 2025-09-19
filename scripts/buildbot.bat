@echo off
REM Build automation script for Docker on Windows
REM Usage: scripts\buildbot.bat

echo Starting build automation...

REM Run buildbot service
docker-compose --profile buildbot up --build buildbot

echo Build automation completed.