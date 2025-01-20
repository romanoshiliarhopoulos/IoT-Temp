import Body from "./Body";
import Charts from "./Charts";
import Message from "./Message";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {" "}
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
