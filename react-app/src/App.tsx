import Message from "./Message";

function App() {
  return (
    <div
      style={{
        textAlign: "center",
        position: "absolute",
        top: "15%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {" "}
      <Message></Message>{" "}
    </div>
  );
}

export default App;
