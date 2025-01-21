import Body from "./Body";
import Charts from "./Charts";
import Message from "./Message";

function App() {
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "110%", // Fixed percentage width
        maxWidth: "100vw", // Limit to 80% of the viewport width
        minHeight: "100vh", // Full viewport height
        boxSizing: "border-box", // Include padding and borders in size
        padding: "1rem", // Avoid content touching the edges
        overflow: "hidden", // Prevent layout shift from overflowing content
        maxHeight: "100vh", // Limit height to the viewport
        overflowY: "auto", // Allow vertical scrolling when content overflows
      }}
    >
      {" "}
      <Message></Message> <br />
      <Body></Body>
      <br />
      <h2>Data charts</h2>
      <Charts></Charts>
    </div>
  );
}

export default App;
