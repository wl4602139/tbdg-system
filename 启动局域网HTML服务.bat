@echo off
chcp 65001 >nul
title 特变电工能碳双中心 - 局域网原型服务
echo ========================================================
echo   正在启动 特变电工能碳双中心平台 HTML 原型局域网服务...
echo ========================================================
echo.
py -3 serve_lan_html.py
if %errorlevel% neq 0 (
    python serve_lan_html.py
)
pause
