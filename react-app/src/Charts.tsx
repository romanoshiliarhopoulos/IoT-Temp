import React, { useEffect, useReducer, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

function Charts() {
    const temperatureChartRef = useRef(null);
    const humidityChartRef = useRef(null);

  useEffect(() => {
    const Chart = window.Chart; // Ensure Chart.js is globally available
    const ctx = temperatureChartRef.current?.getContext("2d");
    const ctx2 = humidityChartRef.current?.getContext("2d");

    if (!ctx) return; // Prevent errors if ref is null

    //get the temperature data first.

    //find the first reading after midnight to base the rest of the readings.
    //fetch the previous 144 readings (past 24hours)
    const getPastDayReadings = async () => {
      return await lastEntries(144); // Fetch the last 144 readings
    };
    let rawdata24;
    (async () => {
      rawdata24 = await getPastDayReadings();
      console.log("Past day readings:", rawdata24);

      let processedData = new Array(144);
        processedData.fill(0);
         let processedDataHum = new Array(144);
         processedDataHum.fill(0);
      let timedata = new Array(149);
      timedata.fill(" ");
      rawdata24 = rawdata24.reverse();

      //make the counter equal to the 24 hour timstamp of the first reading...
      let unixTimestamp = rawdata24[0].time.seconds;
      const date = new Date(unixTimestamp * 1000); //create a new js date object multiplied by 1000 for miliseconds
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;
      console.log(time, unixTimestamp);
      let counter = Number(time.substring(0, 2));
      console.log(counter);

      //to populate the timedata array properly
      for (let i = 0; i < timedata.length + 1; i = i + 18) {
        if (counter % 24 < 10) {
          timedata[i] = "0" + String(counter % 24) + ":00";
        } else {
          timedata[i] = String(counter % 24) + ":00";
        }
        counter = counter + 3;
      }
      for (let i = 0; i < 144; i = i + 1) {
          processedData[i] = rawdata24[i].temperature;
          processedDataHum[i] = rawdata24[i].humidity;
      }
      console.log(processedData);
        drawChartTemp(processedData, timedata);
        drawChartHum(processedDataHum, timedata);
    })();

    function drawChartTemp(tempdata: any[], timedata: any[]) {
      // Create the chart instance
      const chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: timedata,
          datasets: [
            {
              label: "Temperature (°C)",
              data: tempdata,
              borderColor: "#ff6384",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              spanGaps: true,
              pointRadius: 0, // This removes the data points
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                autoSkip: false,
                maxTicksLimit: 8, // Display a maximum of 8 labels
                maxRotation: 45,
                minRotation: 0,
              },
            },
            y: {
              grid: {
                color: "#bdbebf",
              },
            },
          },
        },
      });
    }
    // Cleanup the chart instance on unmount
    return () => {
      //chartInstance.destroy();
    };
      function drawChartHum(humdata: any[], timedata: any[]) {
        // Create the chart instance
        const chartInstance2 = new Chart(ctx2, {
          type: "line",
          data: {
            labels: timedata,
            datasets: [
              {
                label: "Humidity (%)",
                data: humdata,
                borderColor: "#ff6384",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                spanGaps: true,
                pointRadius: 0, // This removes the data points
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  autoSkip: false,
                  maxTicksLimit: 8, // Display a maximum of 8 labels
                  maxRotation: 45,
                  minRotation: 0,
                },
              },
              y: {
                grid: {
                  color: "#bdbebf",
                },
              },
            },
          },
        });
      }
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
          height: 400,
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
          Temperature:{" "}
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
          <select name="timeframe-temperature">
            <option value="24">24h</option>
            <option value="3">3 days</option>
            <option value="5">5 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="1">1 Month</option>
            <option value="30">3 Months</option>
            <option value="60">6 Months</option>
          </select>
        </span>
        <br />
        <canvas
          ref={temperatureChartRef}
          style={{
            width: "100%",
            height: "100%",
            marginTop: "40px",
            marginBottom: "40px",
            marginRight: "10px",
            marginLeft: "10px",
            borderRadius: "10px",
            background: "#d0e0f7",
          }}
        ></canvas>{" "}
      </div>

      <br />
      <div
        style={{
          padding: "8px",
          background: "#496481",
          borderRadius: 10,
          height: 400,
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
          <select name="timeframe-humidity">
            <option value="24">24h</option>
            <option value="3">3 days</option>
            <option value="5">5 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="1">1 Month</option>
            <option value="30">3 Months</option>
            <option value="60">6 Months</option>
          </select>
        </span>
        <canvas
          ref={humidityChartRef}
          style={{
            width: "100%",
            height: "100%",
            marginTop: "40px",
            marginBottom: "40px",
            marginRight: "10px",
            marginLeft: "10px",
            borderRadius: "10px",
            background: "#d0e0f7",
          }}
        ></canvas>{" "}
      </div>
    </div>
  );
}
async function lastEntries(n: number) {
  //function that fetches the last n entries from the firestore database.

  //firebase config to fetch data from the firestore database
  const firebaseConfig = {
    apiKey: "AIzaSyD38K9ZpLZpFQbGruwO3EnoGSOrhmY45Ug",
    authDomain: "iot-app-20b70.firebaseapp.com",
    databaseURL: "https://iot-app-20b70-default-rtdb.firebaseio.com",
    projectId: "iot-app-20b70",
    storageBucket: "iot-app-20b70.firebasestorage.app",
    messagingSenderId: "206130198957",
    appId: "1:206130198957:web:a8d92d4c0c923d92004924",
    measurementId: "G-HQCMWBSZK4",
  };
  // Firestore
  const dbFirestore = getFirestore();
  const readingsCollection = collection(dbFirestore, "readings");

  // Query to get the last n documents
  try {
    const q = query(readingsCollection, orderBy("time", "desc"), limit(n));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents");
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

declare global {
  interface Window {
    Chart: typeof Chart;
  }
}

export default Charts;
