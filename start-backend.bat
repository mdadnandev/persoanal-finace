@echo off
echo Starting Spring Boot Backend on http://localhost:8080...
cd /d "%~dp0server"
call mvnw.bat spring-boot:run
