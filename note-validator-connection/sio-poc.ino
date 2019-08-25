/*
This script is for testing connection from NV10 to arduino serial console.
 */

#include <SoftwareSerial.h>

SoftwareSerial NoteAcceptor(10, 11); // RX, TX

void setup() {

  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("--- Start NV10 Bleskomat script ---");

  // set the data rate for the SoftwareSerial port
  NoteAcceptor.begin(300);

  NoteAcceptor.write(184); // Enable all channels.
  NoteAcceptor.write(170); // Enable escrow mode.
}

void loop() {
  if (NoteAcceptor.available())
  {
    byte byteIn = NoteAcceptor.read();
    Serial.print("CODE - ");
    Serial.print(byteIn);
    Serial.println("***");

    switch (byteIn) {
      case 20:
        Serial.println("Note not recognized");
        break;
      case 70:
        Serial.println("Abort during escrow");
      case 120:
        Serial.println("Busy");
        break;
      case 121:
        Serial.println("Not Busy");
    }

    if (byteIn >= 1 && byteIn <= 12)
    {
      Serial.print("You inserted: ");
      switch (byteIn) {
        case 1:
          Serial.print("5 €");
          break;
        case 2:
          Serial.print("10 €");
          break;
        case 3:
          Serial.print("20 €");
          break;
        case 4:
          Serial.print("50 €");
          break;
        case 5:
          Serial.print("100 €");
          break;
        case 6:
          Serial.print("200 €");
          break;
        case 7:
          Serial.print("100 CZK");
          break;
        case 8:
          Serial.print("200 CZK");
          break;
        case 9:
          Serial.print("500 CZK");
          break;
        case 10:
          Serial.print("1000 CZK");
          break;
        case 11:
          Serial.print("2000 CZK");
          break;
        case 12:
          Serial.print("5000 CZK");
          break;
        default:
          // if nothing else matches, do the default
          Serial.print("Nothing");
          break;
      }

      Serial.println("***");
    }
  }

  if (Serial.available() > 0)
  {
    byte ByteReceived = Serial.read();
    Serial.print(ByteReceived);
    Serial.print("        ");
    Serial.print(ByteReceived, HEX);
    Serial.print("       ");
    Serial.print(char(ByteReceived));
    Serial.println();

    if (ByteReceived == 'S')
    {
        NoteAcceptor.write(182);
        Serial.println("Status");
    }
    if (ByteReceived == 'Y')
    {
        NoteAcceptor.write(172);
        Serial.println("Accept Escrow");
    }
    if (ByteReceived == 'N')
    {
        NoteAcceptor.write(173);
        Serial.println("Rejected Escrow");
    }
    if (ByteReceived == 'E')
    {
        NoteAcceptor.write(184);
        Serial.println("Acceptor Enabled");
    }
    if (ByteReceived == 'D')
    {
        NoteAcceptor.write(185);
        Serial.println("Acceptor Disabled");
    }
  }
}
