import React, { useEffect, useRef } from "react";

function Charts() {
  const temperatureChartRef = useRef(null);

  useEffect(() => {
    const Chart = window.Chart; // Ensure Chart.js is globally available
    const ctx = temperatureChartRef.current?.getContext("2d");
    if (!ctx) return; // Prevent errors if ref is null

    // Create the chart instance
    const chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        datasets: [
          {
            label: "Temperature (°C)",
            data: [22, 24, 19, 23, 25, 21, 20],
            borderColor: "#ff6384",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.4,
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
          },
          y: {
            grid: {
              color: "#bdbebf",
            },
          },
        },
      },
    });

    // Cleanup the chart instance on unmount
    return () => {
      chartInstance.destroy();
    };
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
      </div>
    </div>
  );
}
declare global {
  interface Window {
    Chart: typeof Chart;
  }
}

export default Charts;
