# Bleskomat

[![Build Status](https://travis-ci.org//samotari/bleskomat.svg?branch=master)](https://travis-ci.org/samotari/bleskomat)

Open source software (+hardware) project to create a prototype Lightning Network ATM

<img src="images/ux-flows/ux-flow-v0-simple.png" width="800">

If you would like to contribute to the project, the following should help get you started:
* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [License](#license)


## Requirements

The following is a list of requirements needed to contribute to this project.

* [nodejs](https://nodejs.org/) - For Linux and Mac install node via [nvm](https://github.com/creationix/nvm).
* [lnd](https://github.com/lightningnetwork/lnd)


## Getting Started

Clone this git repository:
```bash
git clone git@github.com:samotari/bleskomat.git
```

Change into the app directory, install dependencies, build and run the app:
```bash
cd app
npm install
npm start
```

If you would like to have _partial_ hot reload while developing, run the following command in a separate terminal window:
```bash
npm run build:dev:watch
```
If you make any modifications in `app/renderer`, the build process will trigger automatically and you can see your changes in the Electron app by reloading the app (e.g. <kbd>CMD</kbd>+<kbd>R</kbd> on Mac, <kbd>CTRL</kbd>+<kbd>R</kbd> on Windows and Linux).


### Mock Paper Money Reader

If you don't have the physical paper money reader - no worries! It is possible to create a virtual paper-money-reader device that you can use to mock the serial output of the real thing.

First step is to create a mock serialport device. Run the following in a bash terminal:
```bash
npm run mock:serialports
```
Note that this script requires the `socat` utility - which you should be able to install under a debian-based system as follows: `sudo apt-get install socat`

In another terminal window, run the following:
```bash
npm run mock:paper-money-reader
```
Press <kbd>1</kbd> to send the serial inputs as if a 5 EUR note was entered into the real paper money reader.

Restart the app in yet another terminal and now you should be able to send mock notes.


## Building App Packages

This project uses [electron-builder](https://www.electron.build/) to build packages for various platforms.

To build development app package(s):
```bash
npm run builder:dev
```
This will build packages according to the current system - e.g on Linux a `.deb` package should be built with the same architecture as the current system.

To build app package(s) for production:
```bash
npm run builder:prod
```

To target a different architecture (e.g for raspberry pi):
```bash
npm run builder:prod -- --armv7l
```
Prebuilt bindings are included with the project where needed - e.g the serialport module bindings for armv7l. Prebuilt bindings are located [here](https://github.com/samotari/bleskomat/tree/master/app/prebuilt).


## License

This project is licensed under the [GNU Affero General Public License v3 (AGPL-3.0)](https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)).

> The AGPL license differs from the other GNU licenses in that it was built for network software. You can distribute modified versions if you keep track of the changes and the date you made them. As per usual with GNU licenses, you must license derivatives under AGPL. It provides the same restrictions and freedoms as the GPLv3 but with an additional clause which makes it so that source code must be distributed along with web publication. Since web sites and services are never distributed in the traditional sense, the AGPL is the GPL of the web.
