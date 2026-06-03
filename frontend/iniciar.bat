@echo off
cd /d "%~dp0src"
echo.
echo  Sistema de Horarios - Frontend
echo  ==============================
echo  Abrindo em: http://localhost:8080
echo  Pressione Ctrl+C para parar o servidor.
echo.
start http://localhost:8080
python -m http.server 8080
