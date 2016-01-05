# Download Emscripten
curl https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-1.35.0-portable-64bit.zip > emsdk-1.35.0-portable-64bit.zip
# Create extraction directory for Emscripten
mkdir emsdk-1.35.0-portable-64bit
# Go in it
cd emsdk-1.35.0-portable-64bit
# Unzip the downloaded file here
unzip ../https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-1.35.0-portable-64bit.zip
# Fetch the latest registry of available tools.
./emsdk update
# Download and install the latest SDK tools.
./emsdk install latest
# Make the "latest" SDK "active"
./emsdk activate latest
# Set the current Emscripten path on Linux/Mac OS X
source ./emsdk_env.sh
