import "./App.css";
import Seats from "./components/Seats";
import SlotsBooking from "./components/SlotsBooking";

function App() {
  return (
    <div className="App">
      <div className="container" >
        <Seats />
        <SlotsBooking />
      </div>
    </div>
  );
}

export default App;
