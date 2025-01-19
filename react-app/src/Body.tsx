import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function Body() {
  // State to store the last entries data
  const [data24, setData24] = useState<any[]>([]);
  const [temp24, setTemp24] = useState<number[]>(Array(24).fill(0));
  const [humidity24, setHumidity24] = useState<number[]>(Array(24).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data24 = await lastEntries(12 * 6); // Fetch data from Firestore
      console.log(data24);
      console.log(data24[1].humidity);

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
        temp24[count] = parseFloat(avgtemp.toFixed(2));
        humidity24[count] = parseFloat(avghum.toFixed(2));
        count++;
      }
      console.log(temp24);
      console.log(humidity24);
      setLoading(false); // Data fetching is complete
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
        {temp24[2]}
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

export default Body;
