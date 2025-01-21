
// Your existing config object
const firebaseConfig = {
  apiKey: "AIzaSyD38K9ZpLZpFQbGruwO3EnoGSOrhmY45Ug",
  authDomain: "iot-app-20b70.firebaseapp.com",
  databaseURL: "https://iot-app-20b70-default-rtdb.firebaseio.com",
  projectId: "iot-app-20b70",
  storageBucket: "iot-app-20b70.firebasestorage.app",
  messagingSenderId: "206130198957",
  appId: "1:206130198957:web:a8d92d4c0c923d92004924",
  measurementId: "G-HQCMWBSZK4"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const readingsRef = db.ref('readings');

readingsRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(`Temperature: ${data.tempdata}C`);
        console.log(`Humidity: ${data.humiditydata}%`);
        console.log(`Last updated: ${data.timestamp}`);
    }
});
