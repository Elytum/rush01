# Download Emscripten
curl https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz > emsdk-portable.tar.gz
# Unzip the downloaded file here
open emsdk-portable.tar.gz
# Go in Emscripten directory
cd emsdk-portable
# Fetch the latest registry of available tools.
./emsdk update
# Download and install the latest SDK tools.
./emsdk install latest
# Make the "latest" SDK "active"
./emsdk activate latest
# Set the current Emscripten path on Linux/Mac OS X
source ./emsdk_env.sh

# To compile into asm.js file, just run "./emcc -O1 -s ASM_JS=1 ./file.cpp"
# To run it, just run "node a.out.js"
