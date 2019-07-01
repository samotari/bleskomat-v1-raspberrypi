const SerialPort = require('serialport')
const CCTalk = require('@serialport/parser-cctalk')
const port = new SerialPort('/dev/ttyUSB0')

const parser = port.pipe(new CCtalk())
parser.on('data', console.log)
