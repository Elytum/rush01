# Download Emscripten
url https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz > emsdk-portable.tar.gz
# Unzip the downloaded file here
tar -zxvf emsdk-portable.tar.gz
# Fetch the latest registry of available tools.
./emsdk_portable/emsdk update
# Download and install the latest SDK tools.
./emsdk_portable/emsdk install latest
# Make the "latest" SDK "active"
./emsdk_portable/emsdk activate latest
# Set the current Emscripten path on Linux/Mac OS X
source ./emsdk_portable/emsdk_env.sh
