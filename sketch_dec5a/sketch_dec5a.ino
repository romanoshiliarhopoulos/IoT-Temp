#include <dummy.h>

#include <dummy.h>

#include <DHT.h>
DHT dht(26, DHT22);

void setup() {
  // put your setup code here, to run once:
  dht.begin();
  delay(3000);
  
Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:
  
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  Serial.print("Temperature ");
  Serial.print(temp);
  Serial.print(" C ");

  Serial.print("Humidity ");
  Serial.print(humidity);
  Serial.println(" % ");
  delay(3000);
}
