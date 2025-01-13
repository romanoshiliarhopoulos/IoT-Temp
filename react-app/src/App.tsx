import Body from "./Body";
import Charts from "./Charts";
import Message from "./Message";

function App() {
  return (
    <div
      style={{
        textAlign: "center",
        position: "absolute",
        top: "80%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "85%",
        display: "flex",
        justifyContent: "center", // Horizontally center
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {" "}
      <br />
      <br />
      <br />
      <Message></Message> <br />
      <Body></Body>
      <br />
      <h2>Data charts</h2>
      <Charts></Charts>
    </div>
  );
}

export default App;
