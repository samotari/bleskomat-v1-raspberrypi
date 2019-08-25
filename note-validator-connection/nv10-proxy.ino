#include <SoftwareSerial.h>

SoftwareSerial NoteAcceptor(10, 11); // RX, TX

void setup() {

  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect. Needed for native USB port only.
  }
  // Send initalized message 0 bytes.
  Serial.write(0);
  // Set the data rate for the SoftwareSerial port.
  NoteAcceptor.begin(300);
}

void loop() {
  if (NoteAcceptor.available())
  {
    byte byteIn = NoteAcceptor.read();
    Serial.write(byteIn);
  }

  if (Serial.available() > 0)
  {
    byte ByteReceived = Serial.read();
    NoteAcceptor.write(ByteReceived);
  }
}
