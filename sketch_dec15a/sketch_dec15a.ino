#include <DHT.h>
#include <WiFi.h>
#include <time.h>
#include <dummy.h>

//things to include for the firebase app
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// Instantiate a temperature sensor object
DHT dht(26, DHT22);
//Wifi information
const char* ssid = "COSMOTE-128043";
const char* password = "36bbhhekxdanxpc3";

//define API Key for database in Firebase
const char* API_KEY = "AIzaSyBtE__1HiSrImr4dnFx4wWFjOzGnez-SIM";
const char* DATABASE_URL = "https://iot-app-20b70-default-rtdb.firebaseio.com/";

//For the time keeping
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;         // Offset in seconds for GMT
const int daylightOffset_sec = 3600;  // Adjust for daylight saving time (if needed)

float temp = 0;      //variable to store temp data
float humidity = 0;  //variable to store humidity data.


//Define objects for database
FirebaseData data;      //used for data
FirebaseAuth auth;      //used for authentication
FirebaseConfig config;  //used for configuration

unsigned long sendDataPrevMillis = 0;  //to read and write on the firebase database in a specified interval
bool signupOK = false;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  dht.begin();
  delay(3000);

  // ...........Initialize NTP for timestamp.......
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Time synchronization initialized.");

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Connected!");

  //to setup the firebase database.
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  /*
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("signUp OK");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }
  config.token_status_callback = tokenStatusCallback;
  */
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Inital setup");
}

void loop() {
  Serial.println("Entered loop...");
  //If the wifi looses connection, try to reconnect...
  // Ensure Wi-Fi connection is active
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Reconnecting to Wi-Fi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(50);
      Serial.print(".");
    }
    Serial.println(" Reconnected!");
  }
/*
  //Create the timestamp;
  // Get the current time
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }
  // Format the timestamp
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%d %H:%M:%S", &timeinfo);

*/
  //send data to the databse periodically
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    //...............................storing the sensor data..................
    //assign the latest reading to the temp variable
    temp = dht.readTemperature();
    humidity = dht.readHumidity();

    //storing the reading to the firebase realtime database.
    //passing the temperature data onto the database in the "Sensor/tempdata path"
    if (Firebase.RTDB.setFloat(&data, "/readings/tempdata", temp)) {
      Serial.println("Saved temp to: " + data.dataPath());
      Serial.print("Succesfully passed temperature reading: ");
      Serial.print(temp);
      Serial.print("C");
    } else {
      Serial.println("FAILED: " + data.errorReason());
    }

    //for saving the humidity data

    if (Firebase.RTDB.setFloat(&data, "/readings/humiditydata", humidity)) {
      Serial.println("Saved humidity to: " + data.dataPath());
      Serial.print("Succesfully passed humidity reading: ");
      Serial.print(humidity);
      Serial.print("%");
    } else {
      Serial.println("FAILED: " + data.errorReason());
    }

/*
    if (Firebase.RTDB.setString(&data, "/readings/timestamp", timestamp)) {
      Serial.println("Timestamp sent successfully!");
    } else {
      Serial.printf("Error sending timestamp: %s\n", data.errorReason().c_str());
    }
    */
  }
  // put your main code here, to run repeatedl
  /*
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  Serial.print("Temp: ");
  Serial.print(temp); Serial.print("C");

  Serial.print("Humidity ");
  Serial.print(humidity);
  Serial.println(" % ");
  */

  delay(2000);
}
