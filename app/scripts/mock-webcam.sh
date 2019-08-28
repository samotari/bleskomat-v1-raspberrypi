#!/bin/bash

video="../assets/sample-qrcode-video-short.mp4"
video="$( cd "$( dirname "$0" )" && pwd )/$video"
device="/dev/video7"

command -v ffmpeg > /dev/null
if [ $? -ne 0 ]; then
	echo 'This script requires `ffmpeg`'
	echo 'On Ubuntu try to install with `sudo apt-get install ffmpeg`'
	exit 1
fi;

command -v v4l2-ctl > /dev/null
v4l2-ctl -d "$device" -l > /dev/null
if [ $? -ne 0 ]; then
	echo 'No loopback video device found'
	echo 'Build and install latest `v4l2loopback` (see https://github.com/umlaeute/v4l2loopback)'
	echo 'Then run `sudo modprobe v4l2loopback devices=1 video_nr=7 exclusive_caps=1` to initialize a new loopback video device'
	exit 1
fi;

ffmpeg -re -f concat -safe 0 -i <( for i in {1..9999}; do echo "file '$video'"; done ) -map 0:v -f v4l2 "$device" && !!
