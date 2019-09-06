#!/bin/bash

command -v socat > /dev/null;
if [ $? -ne 0 ]; then
	echo 'This script requires `socat`'
	echo 'On Ubuntu try to install with `sudo apt-get install socat`'
	exit 1
fi;

dir="../dev"
dir="$( cd "$( dirname "$0" )" && pwd )/$dir"
device0="$dir/ttyMOCK0"
device1="$dir/ttyMOCK1"
mkdir -p "$dir"
socat -d -d -d PTY,echo=1,link=$device0 PTY,echo=1,link=$device1
