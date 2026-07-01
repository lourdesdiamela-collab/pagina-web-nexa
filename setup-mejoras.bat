@echo off
REM ============================================================
REM  Setup de mejoras - Proyecto NEXA (pagina-web-nexa)
REM  1) Instala "motion" (Framer Motion, nombre nuevo)
REM  2) Instala la skill UI/UX Pro Max (global, para Claude Code)
REM  Hace doble clic sobre este archivo, o ejecutalo desde la
REM  terminal DENTRO de la carpeta del proyecto.
REM ============================================================

cd /d "%~dp0"
echo.
echo ============================================================
echo  [1/2] Instalando Framer Motion (paquete "motion")...
echo ============================================================
call npm install motion
if errorlevel 1 (
  echo.
  echo  ATENCION: fallo "npm install motion". Revisa el error de arriba.
) else (
  echo  OK: "motion" instalado.
)

echo.
echo ============================================================
echo  [2/2] Instalando skill UI/UX Pro Max (global)...
echo  Requiere Python 3.x instalado.
echo ============================================================
call npm install -g uipro-cli
call uipro init --ai claude --global

echo.
echo ============================================================
echo  Listo. Revisa los mensajes de arriba por si hubo errores.
echo  Para Cowork: activa la skill en Settings ^> Capabilities.
echo ============================================================
pause
