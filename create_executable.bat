@ECHO off
echo "Cleaning previous build"
if exist "dist\Artillery-Calculator" rmdir /s /q "dist\Artillery-Calculator"
if exist "dist\Artillery-Calculator-Windows.zip" del "dist\Artillery-Calculator-Windows.zip"

IF NOT EXIST venv\ (
    ECHO Venv doesn't exist, creating venv.
    python -m venv venv
)

IF "%VIRTUAL_ENV%"=="" (
    call venv\Scripts\activate.bat
)

echo "Upgrading requirements"
call python -m pip install -r requirements --upgrade
call python -m pip install pyinstaller

echo "Building executable"
pyinstaller -y -n "Artillery-Calculator" -D src\bridge.py --paths=.\modules || exit /b 1

echo "Creating WebUI folders"
mkdir "dist\Artillery-Calculator\_internal\modules\WebUI\static" || exit /b 1

echo "Copying WebUI assets"
robocopy "src\modules\WebUI\static" "dist\Artillery-Calculator\_internal\modules\WebUI\static" /e /copy:DAT /r:0

echo "Creating zip file"
cd dist
tar -a -cvf "Artillery-Calculator-Windows.zip" "Artillery-Calculator" || exit /b 1
echo "Done"