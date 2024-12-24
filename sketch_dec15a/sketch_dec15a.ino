#include <DHT.h>
#include <WiFi.h>
#include <time.h>
#include <dummy.h>
#include <unordered_map>

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
// For Firestore
#define PROJECT_ID "iot-app-20b70"

const int hour = 3600;
//For the time keeping
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 2 * hour;  // Offset in seconds for GMT
const int daylightOffset_sec = 3600;  // Adjust for daylight saving time (if needed)

float temp = 0;      //variable to store temp data
float humidity = 0;  //variable to store humidity data.

//to compute averages for the firestore database.
float total_temp = 0;
float total_hum = 0;
float numReadings = 0;

const long sendInterval = 600000;  // 10 minute interval

//Define objects for database
FirebaseData data;      //used for real-time database
FirebaseData fbdo_fs;   // For Firestore database
FirebaseAuth auth;      //used for authentication
FirebaseConfig config;  //used for configuration

unsigned long sendDataPrevMillis = 0;  //to read and write on the firebase database in a specified interval
unsigned long sendFirestorePrevMillis = 0;
unsigned long lastReadingIndex = 0;
bool signupOK = true;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("");
  delay(15000);
  Serial.println("Starting setup...");

  dht.begin();

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");

  // ...........Initialize NTP for timestamp.......
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Waiting for NTP time sync...");

  // Wait for time to be set with timeout
  unsigned long startAttemptTime = millis();
  while (time(nullptr) < 1510592825) {
    Serial.print(".");
    delay(500);
    if (millis() - startAttemptTime > 10000) {
      Serial.println("\nFailed to get time from NTP. Continuing anyway...");
      break;
    }
  }
  Serial.println("\nTime synchronized");
  Serial.println("Time synchronization initialized.");

  //to setup the firebase database.
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;


  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("signUp OK");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }
  config.token_status_callback = tokenStatusCallback;


  Firebase.begin(&config, &auth);
  Serial.print("Firebase Begin...");
  Firebase.reconnectWiFi(true);
  // Wait for Firebase to initialize
  unsigned long firebaseStartTime = millis();
  //  while (!Firebase.ready() && (millis() - firebaseStartTime < 10000)) {

  while (!Firebase.ready()) {
    Serial.print(".");
    delay(200);
  }
  Serial.print(Firebase.ready());
  if (Firebase.ready()) {
    Serial.println("\nFirebase initialized successfully!");
  }

  Serial.println("\nSetup completed!");
}

void loop() {

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

  //Create the timestamp;
  // Get the current time
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }

  if (Firebase.RTDB.getInt(&data, "/readings/index")) {
    lastReadingIndex = data.intData();
    Serial.println(lastReadingIndex);
  }

  // Format the timestamp
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%d %H:%M:%S", &timeinfo);


  //send data to the databse periodically
  Serial.print(Firebase.ready());
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

    //for updating the humidity data
    if (Firebase.RTDB.setFloat(&data, "/readings/humiditydata", humidity)) {
      Serial.println("Saved humidity to: " + data.dataPath());
      Serial.print("Succesfully passed humidity reading: ");
      Serial.print(humidity);
      Serial.print("%");
    } else {
      Serial.println("FAILED: " + data.errorReason());
    }

    //to update the timestamp
    if (Firebase.RTDB.setString(&data, "/readings/timestamp", timestamp)) {
      Serial.println("Timestamp sent successfully!");
    } else {
      Serial.printf("Error sending timestamp: %s\n", data.errorReason().c_str());
    }



    total_temp = total_temp + temp;
    total_hum = total_hum + humidity;
    numReadings++;

    if (millis() - sendFirestorePrevMillis > sendInterval) {  //once every ten minutes
      sendFirestorePrevMillis = millis();
      Serial.println("Updating the Firestore Database...");

      //update the lastReadingIndex variable........
      if (Firebase.RTDB.getInt(&data, "/readings/index")) {
        lastReadingIndex = data.intData();
        // Increment for the next reading
        lastReadingIndex++;
      } else {
        Serial.println("Failed to get last index: " + data.errorReason());
        // If failed to get index, increment from current value
        lastReadingIndex++;
      }
      //update the RTDB

      if (Firebase.RTDB.setInt(&data, "/readings/index", lastReadingIndex)) {
        Serial.println("Index sent successfully!");
      } else {
        Serial.printf("Error sending index: %s\n", data.errorReason().c_str());
      }


      //for the average readings
      float avg_temp = total_temp / numReadings;
      float avg_hum = total_hum / numReadings;

      //re-set the total readings to zero for the next interval
      total_temp = 0;
      total_hum = 0;
      numReadings = 0;

      // For Firestore timestamp
      // Format timestamp in ISO 8601 format with 'Z' suffix
      char firestoreTimestamp[30];
      time_t now = time(nullptr);
      struct tm* ptm = gmtime(&now);
      strftime(firestoreTimestamp, sizeof(firestoreTimestamp), "%Y-%m-%dT%H:%M:%S.000Z", ptm);


      //writing to the firestore database
      FirebaseJson content;
      content.set("fields/temperature/doubleValue", String(avg_temp));
      content.set("fields/humidity/doubleValue", String(avg_hum));
      content.set("fields/time/timestampValue", String(firestoreTimestamp));

      // Get total seconds since midnight
      int totalSeconds = timeinfo.tm_hour * 3600 + timeinfo.tm_min * 60 + timeinfo.tm_sec;
      char timeStr[15];
      strftime(timeStr, sizeof(timeStr), "%Y%m%d", &timeinfo);

      //fetch the previous reading Id Index:
      //to make them arithmetically larger, we will use the lastReadingIndex.

      String documentPath = "readings/" + String(lastReadingIndex);
      Serial.println(documentPath);
      //saves in the following format: YYYYMMDDSSSSS where SSSS is the number of seconds since midnight of that day.
      // this allows for the next input to be algebraically greater than the previous
      if (Firebase.Firestore.createDocument(&fbdo_fs, PROJECT_ID, "", documentPath.c_str(), content.raw())) {
        Serial.println("Firestore write successful");
      } else {
        Serial.println("Firestore write failed");
        Serial.println(fbdo_fs.errorReason());
      }
    }
  }
  delay(2000);
}
