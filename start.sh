#!/bin/sh
export NODE_OPTIONS="--max-old-space-size=4096"

adb start-server
adb connect host.docker.internal:5555
adb devices
sleep 10
npm start
