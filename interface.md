# Connection of the banknote validator to the computer

The banknote validator (BV) we are working with is NV10USB+. It was
preconfigured when purchased to work with the protocol CCTALK. This
can be verified by pressing the configuration botton on the side of
the BV then the light start to blink 5x for the CCTALK protocol.

## Powering up

The BV is powered by connecting to the power source (PW). For that
purpose a flat cable was prepared to go to the plug on BV.
	
	*  12V: pin 15 (yellow) -> PW:  (orange)
	*  GND: pin 16 (black)  -> GND: (blue)

## CCtalk Bus

The cctalk bus is made by interconnecting the pin 1 (orange) and
pin 5 (violete) on the BV.

The communication should follow the serial line communication standard
on the 9600 baud 1 start bid, 8 bits information, 1 stop bit, and no
parity.

However this communication did no work, despite of trying several
different combination of the serial line port setup.

## CCtalk protocol

The CCtalk protocol itself is an open protocol and de facto
[standard][cctalk1] for communication in the BV industry. The protocol
has been implemented in many libraries, including python, arduino
etc. A large database or relevant [links can be found online][links].

The cctalk protocol specification is described in [the documents
included in this repository][cctalk2].

## USB communication

The BV can be connected to the prepared USB cables

	* data+: pin 11 (white) -> data-: (green)
	* data-: pin 12 (green) -> data+: (white)
	* 5V:    pin 13 (red)   -> 5V:    (red)
	* GND:   pin 16 (black) -> GND:   (black)

Running `sudo dmesg -Hw` and powering up the device the following message appears:
```
[Jul22 08:09] usb 1-2: new full-speed USB device number 31 using xhci_hcd
[  +0.150241] usb 1-2: New USB device found, idVendor=191c, idProduct=4104, bcdDevice= 1.10
[  +0.000005] usb 1-2: New USB device strings: Mfr=1, Product=2, SerialNumber=0
[  +0.000003] usb 1-2: Product: NV10US
[  +0.000002] usb 1-2: Manufacturer: Innovative Technology LTD
[  +0.006416] cdc_acm 1-2:1.0: ttyACM0: USB ACM device
```

and a description of the device can be found by `lsusb`
```
Bus 001 Device 031: ID 191c:4104 Innovative Technology LTD Banknote validator NV-150
```

Note: more details can be shown in verbose output (use `-v -d 191c:4104`
for information about BV.

## UART port

The BV is able to communicate through the serial line. If your compter
does not have serial ports, you can get a RS232 to usb converter as we
did. 

The second and, third and fifth pins on the RS232 male connector are
Rx, Tx and GND respectively. The Rx is always connected with Tx. The
USB to serial converter signs up to the system as `/dev/ttyUSB0`
device.

If connected to the Rpi, you can use pins 8 and 10 for Rx and Tx
respectively. The details about Rpi3 pins can be visualised using
pinout command or on the website http://pinout.xyz. Also the ground
should be connected. The serial line is then accessible through device
`/dev/ttyS0`. Also arduino provides some serial ports by default and
allows to send the serial communication to the computer via USB (hence
can effectively be used as serial to USB convertor).

There are several software utilities for the communication with the
serial line. In the gnome environment the `gtkterm` is very usable and
intuitive tool. In a headless command line the tools like `miniterm`
or `screen` can be used.

The input and output can be read also directly to and from the device
by stdin and stdout redirection. In this case the configuration of the
device can be read and changed using `stty` in this case.

## Display and other devices

Camera

https://www.gme.cz/raspberry-pi-camera-board-5mpx

Display

https://www.gme.cz/raspberry-5-palcovy-800x480-dotykovy-lcd-displej-hdmi


https://www.alza.cz/raspberry-pii-touch-display-7-d4268133.htm?o=11#discussionPosts



[links]:   https://cctalktutorial.wordpress.com/usefull-cctalk-links/
[tty]:     https://unix.stackexchange.com/questions/117037/how-to-send-data-to-a-serial-port-and-see-any-answer
[manual]:  resources/NV10manual.pdf
[cctalk1]: resources/cctalkpart1v4-7.pdf
[cctalk2]: resources/cctalkpart2v4-7.pdf
[cctalk3]: resources/cctalkpart3v4-7.pdf
[cctalk4]: resources/cctalkpart4v4-7.pdf
