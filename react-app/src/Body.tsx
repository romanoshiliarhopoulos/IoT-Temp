function Body() {
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
          border: "1px solid black",
          padding: "8px",
          background: "grey",
          opacity: 0.25,
          borderRadius: 10,
          height: 100,
          width: "90%",
          alignItems: "center",
        }}
      ></div>
      <br />
      <div
        style={{
          border: "1px solid black",
          padding: "8px",
          background: "grey",
          opacity: 0.25,
          borderRadius: 10,
          height: 100,
          width: "90%",
          alignItems: "center",
        }}
      ></div>
    </div>
  );
}

export default Body;
