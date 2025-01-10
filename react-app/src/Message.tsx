import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

interface ReadingData {
  temperature: number;
  humidity: number;
  time: string;
}

function Message() {
  const [data, setData] = useState<ReadingData | string>("Loading...");
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
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

    const unsubscribe = onValue(
      readingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          setData({
            temperature: fetchedData.tempdata,
            humidity: fetchedData.humiditydata,
            time: fetchedData.time,
          });
          setLastUpdate(new Date().toLocaleTimeString());
        } else {
          setData({
            temperature: 0,
            humidity: 0,
            time: "No data available",
          });
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        setData("Error loading data");
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (typeof data === "string") {
    return <h1>{data}</h1>;
  }

  return (
    <div>
      <p>
        <span style={{ fontSize: "50px", fontFamily: "Roboto, sans-serif" }}>
          {data.temperature}°{" "}
        </span>

        <br />
        <span style={{ color: "#7eed9a" }}>
          ● Live ({lastUpdate.substring(0, lastUpdate.length - 3)})
        </span>
      </p>

      <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Measurement
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              Temperature
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {data.temperature}°C
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              Humidity
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {data.humidity}%
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: "10px", textAlign: "center" }}></div>
    </div>
  );
}

export default Message;
