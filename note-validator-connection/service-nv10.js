const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
});

port.on('data', function (data) {
  const buffer = Buffer.from(data);
  const command = buffer[0];
  console.log('command', command);

  switch (command) {
    case 1:
      console.log('5 €');
      break;
    case 2:
      console.log('10 €');
      break;
    case 3:
      console.log('20 €');
      break;
    case 4:
      console.log('50 €');
      break;
    case 5:
      console.log('100 €');
      break;
    case 6:
      console.log('200 €');
      break;
    case 7:
      console.log('100 CZK');
      break;
    case 8:
      console.log('200 CZK');
      break;
    case 9:
      console.log('500 CZK');
      break;
    case 10:
      console.log('1000 CZK');
      break;
    case 11:
      console.log('2000 CZK');
      break;
    case 12:
      console.log('5000 CZK');
      break;
  }
});

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (key) {
  if (key === '\u0003') {
    process.exit();
  }
  switch (key) {
    case 'S':
      console.log('Status');
      port.write(182);
      break;
    case 'Y':
      console.log('Accept Escrow');
      port.write(172);
      break;
    case 'N':
      console.log('Rejected Escrow');
      port.write(173);
      break;
    case 'E':
      console.log('Acceptor Enabled');
      port.write(184);
      break;
    case 'D':
      console.log('Acceptor Disabled');
      port.write(185);
      break;
    default:
      console.log(`Not recognized key: ${key}`);
  }
});

