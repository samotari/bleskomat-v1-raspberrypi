const SerialPort = require('serialport')
const CCTalk = require('@serialport/parser-cctalk')
const port = new SerialPort('/dev/ttyAMA0')

try {
  const parser = port.pipe(new CCTalk())

  const destinationAddress = 2;
  const zeroDataBytes = 0;
  const sourceAddress = 1;
  const command = 248; // Request status.

  // 8 = checksum ( 2 + 0 + 1 + 245 + 8 = 256 = 0 mod 256 )
  const checksum = destinationAddress + zeroDataBytes + sourceAddress + command;

  const data = Buffer.from([destinationAddress, zeroDataBytes, sourceAddress, command, checksum])
  parser.on('data', data => {
    console.log('data comming', data)
  })

  parser.write(data)
} catch(error) {
  console.error('error', error);
}
