set -e
echo "Cleaning previous build"
rm -f "dist/Artillery-Calculator-Linux.tar.gz"
rm -rf "dist/Artillery-Calculator"

echo "Upgrading dependencies"
pip install -r dependencies.txt --upgrade
pip install pyinstaller

echo "Building executable"
pyinstaller -y -n "Artillery-Calculator" -D src/bridge.py --paths=./modules

echo "Creating WebUI folders"
mkdir -p "./dist/Artillery-Calculator/_internal/modules/WebUI"

echo "Copying WebUI assets"
cp -r "src/modules/WebUI/static" "dist/Artillery-Calculator/_internal/modules/WebUI/static"

echo "Copying pdf"
cp "dist/readme.pdf" "dist/Artillery-Calculator/readme.pdf"

echo "Creating tar.gz file"
tar -czvf "dist/Artillery-Calculator-Linux.tar.gz" "dist/Artillery-Calculator"
echo "Done"
