@echo off
REM Commit automation script for Docker on Windows
REM Usage: scripts\commit.bat

echo Starting commit automation...

REM Run commit service
docker-compose --profile commit up --build commit-bot

echo Commit automation completed.