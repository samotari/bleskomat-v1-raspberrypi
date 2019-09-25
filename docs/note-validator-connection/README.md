# Notes Validator (NV)
This file tries to describe the connections to communicate with NV10 Notes Validator.

## NV10 - Arduino
Having `arduino` and NV10 connected together as described bellow is usefull as a proof of concept and for testing connection. Arduino serial console can be used as interface.

For that you required to load the script `sio-poc.ino` in your arduino and connect with NV10 as described bellow:

|                   | NV10 pin | arduino pin |
|:-----------------:|----------|-------------|
|    RX             |        1 |          10 |
|    TX             |        5 |          11 |
|   Ground          |       16 |         GND |
| +12/110VDC Supply |       15 |             |

It is important that ground from NV10 and arduino are connected.

## NV10 Notes Validator - Arduino - Raspberry Pi
Arduino can be used as proxy for serial communication between NV10 and Raspberry Pi. For that purpose you can use the scripts:

* `nv10-proxy.ino` for arduino
* `service-nv10.js` for raspberry pi.

The arduino is connected to `Raspberry Pi` with USB.
