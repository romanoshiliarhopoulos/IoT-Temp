import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "./WeatherScroll.css";

let live: number[] = Array(2).fill(0);
function Body() {
  // State to store the last entries data
  const [temp24] = useState<number[]>(Array(24).fill(0));
  const [humidity24] = useState<number[]>(Array(24).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      const data24 = await lastEntries(12 * 6); // Fetch data from Firestore
      console.log(data24);
      console.log(data24[1].humidity);

      //get the current time

      let count = 0;

      for (let i = 0; i < 72; i = i + 3) {
        let avgtemp =
          (data24[i].temperature +
            data24[i + 1].temperature +
            data24[i + 2].temperature) /
          3;
        let avghum =
          (data24[i].humidity +
            data24[i + 1].humidity +
            data24[i + 2].humidity) /
          3;
        temp24[count] = parseFloat(avgtemp.toFixed(1));
        humidity24[count] = parseFloat(avghum.toFixed(1));
        count++;
      }
      let timeArray = Array(24).fill(" ");
      timeArray[0] = "Now";
      let date = new Date();
      let stringDate = date.getHours() + ":" + date.getMinutes();

      for (let i = 1; i < timeArray.length; i++) {
        //populate the time array
        date.setMinutes(date.getMinutes() - 30);
        if (date.getMinutes() < 10) {
          timeArray[i] = date.getHours() + ":0" + date.getMinutes();
        } else {
          timeArray[i] = date.getHours() + ":" + date.getMinutes();
        }
      }
      console.log(stringDate);
      date.setMinutes(date.getMinutes() - 30);
      //get the live temperature
      getLiveReadings();
      temp24[0] = live[0];
      humidity24[0] = live[1];
      updateTemperatures(timeArray, temp24);
      updateHumidities(timeArray, humidity24);
      console.log(timeArray);
      console.log(temp24);
      console.log(humidity24);

    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: "8px",
          background: "#496481",
          borderRadius: 10,
          height: 150,
          width: "90%",
          color: "white",
          display: "flex",
          flexDirection: "column", // Stack items vertically
          alignItems: "flex-start", // Align items to the left
          justifyContent: "space-between", // Space out items vertically
          position: "relative", // Enable absolute positioning for children
        }}
      >
        <span
          style={{
            position: "absolute",
            textAlign: "left",
            flex: 1,
            fontFamily: "Arial",
            fontSize: 12.5,
            fontWeight: 600,
          }}
        >
          Temperature:
        </span>{" "}
        <span
          style={{
            position: "absolute",
            top: "8px", // Distance from the top
            right: "10px", // Distance from the right
            fontFamily: "Arial",
            fontWeight: 600,
            fontSize: 12.5,
          }}
        >
          {" "}
          Past 12h
        </span>
        <br />
        <br />
        <div
          className="temperature-scroll"
          id="tempScroll"
          style={{
            width: "95%",
            borderRadius: "10px",
            alignContent: "center",
            marginInline: "auto",
          }}
        ></div>
      </div>
      <br />
      <div
        style={{
          padding: "8px",
          background: "#496481",
          borderRadius: 10,
          height: 150,
          width: "90%",
          color: "white",
          display: "flex",
          flexDirection: "column", // Stack items vertically
          alignItems: "flex-start", // Align items to the left
          justifyContent: "space-between", // Space out items vertically
          position: "relative", // Enable absolute positioning for children
        }}
      >
        <span
          style={{
            position: "absolute",
            textAlign: "left",
            flex: 1,
            fontFamily: "Arial",
            fontSize: 12.5,
            fontWeight: 600,
          }}
        >
          Humidity:
        </span>{" "}
        <span
          style={{
            position: "absolute",
            top: "8px", // Distance from the top
            right: "10px", // Distance from the right
            fontFamily: "Arial",
            fontWeight: 600,
            fontSize: 12.5,
          }}
        >
          {" "}
          Past 12h
        </span>
        <br />
        <br />
        <div
          className="humidity-scroll"
          id="humScroll"
          style={{
            width: "95%",
            borderRadius: "10px",
            alignContent: "center",
            marginInline: "auto",
          }}
        ></div>
      </div>
    </div>
  );
}

async function lastEntries(n: number) {
  //function that fetches the last n entries from the firestore database.
  
  // Firestore
  const dbFirestore = getFirestore();
  const readingsCollection = collection(dbFirestore, "readings");

  // Query to get the last n documents
  try {
    const q = query(readingsCollection, orderBy("time", "desc"), limit(n));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents!");
      return [];
    }
    const documents: any[] = [];
    querySnapshot.forEach((doc) => {
      documents.push(doc.data());
    });
    //console.log("Last entries:", documents);
    return documents;
  } catch (error) {
    console.error("Error getting last entries: ", error);
    return [];
  }
}

async function getLiveReadings() {
  const firebaseConfig = {
    apiKey: "AIzaSyD38K9ZpLZpFQbGruwO3EnoGSOrhmY45Ug",
    authDomain: "iot-app-20b70.firebaseapp.com",
    databaseURL: "https://iot-app-20b70-default-rtdb.firebaseio.com",
    projectId: "iot-app-20b70",
    storageBucket: "iot-app-20b70.firebasestorage.app",
    messagingSenderId: "206130198957",
    appId: "1x:206130198957:web:a8d92d4c0c923d92004924",
    measurementId: "G-HQCMWBSZK4",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const readingsRef = ref(db, "readings");

  onValue(
    readingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const fetchedData = snapshot.val();
        live[0] = fetchedData.tempdata;
        live[1] = fetchedData.humiditydata;
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
    }
  );
}

function updateTemperatures(time: any[], temp: any) {
  const container = document.getElementById("tempScroll");
  if (!container) {
    console.error("Temperature scroll container not found");
    return;
  }
  container.innerHTML = ""; // Clear existing content

  for (let i = 0; i < temp.length; i++) {
    const tempItem = document.createElement("div");
    tempItem.className = "temp-item";

    tempItem.innerHTML = `
                    <span class="time">${time[i]}</span>
                    <span class="temp">${temp[i]}°</span>
                `;

    container.appendChild(tempItem);
  }
}
function updateHumidities(time: any[], hum: any) {
  const container = document.getElementById("humScroll");

  for (let i = 0; i < hum.length; i++) {
    const tempItem = document.createElement("div");
    if (!container) {
      console.error("Temperature scroll container not found");
      return;
    }
    tempItem.className = "temp-item";

    tempItem.innerHTML = `
                    <span class="time">${time[i]}</span>
                    <span class="temp">${hum[i]}%</span>
                `;

    container.appendChild(tempItem);
  }
}

export default Body;
