import Body from "./Body";
import Message from "./Message";

function App() {
  return (
    <div
      style={{
        textAlign: "center",
        position: "absolute",
        top: "30%",
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
      <Message></Message> <br />
      <Body></Body>
    </div>
  );
}

export default App;
