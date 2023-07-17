import React, { useEffect, useState } from "react";
import axios from "axios";

const Seats = () => {
  const totalSeats = 80;
  const seatsInRow = 7;
  const lastRowSeats = 3;

  const [seats, setSeats] = useState(new Array(totalSeats).fill(false));
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatCount, setSeatCount] = useState("");

  useEffect(() => {
    fetchBookedSeats();
  }, []);

  // GET
  const fetchBookedSeats = () => {
    axios
      .get("https://ticket-booking-app-fkin.onrender.com/bookedseats")
      .then((data) => {
        let bookedSeatsLengh = data.data.bookedSeats.length;
        for (let i = 0; i < bookedSeatsLengh; i++) {
          const newSeats = [...seats];
          let seatNumbers = data.data.bookedSeats[i].seatNumber;
          seatNumbers.forEach((seatNumber) => {
            const seatIndex = getSeatIndex(seatNumber.seatNumber);
            if (seatIndex !== -1) {
              newSeats[seatIndex] = true;
            }
          });
          setSeats(newSeats);
          setBookedSeats(seatNumbers);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
        // setTimeout(() => {
        //   alert("");
        // }, 3000);
      });
  };

  // DELETE (RESET)
  const handleReset = () => {
    axios
      .delete("https://ticket-booking-app-fkin.onrender.com/deleteall")
      .then((res) => {
        console.log(res.data);
        alert(`${res.data.msg}`);
        // setTimeout(() => {
        //   alert("");
        // }, 3000);
        fetchBookedSeats();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
        // setTimeout(() => {
        //   alert("");
        // }, 3000);
      });
  };

  // POST
  const handleSeatBooking = () => {
    if (seatCount === "" || parseInt(seatCount) <= 0) {
      alert("Please enter a valid number of seats");
      // setTimeout(() => {
      //   alert("");
      // }, 3000);
      return;
    } else if (parseInt(seatCount) > 7) {
      alert("You can book only 7 seats at a time");
      // setTimeout(() => {
      //   alert("");
      // }, 3000);
      return;
    }

    axios
      .post("https://ticket-booking-app-fkin.onrender.com/booked", {
        headers: {
          "Content-Type": "application/json",
        },
        number: parseInt(seatCount),
      })
      .then((data) => {
        alert("Seat Book SuccessFully");
        // setTimeout(() => {
        //   alert("");
        // }, 3000);
        fetchBookedSeats();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
        // setTimeout(() => {
        //   alert("");
        // }, 3000);
      });
  };

  const generateSeatNumber = (seatIndex) => {
    let rowLetter = String.fromCharCode(
      "A".charCodeAt(0) + Math.floor(seatIndex / seatsInRow)
    );
    let seatNumber = (seatIndex % seatsInRow) + 1;
    if (seatIndex >= totalSeats - lastRowSeats) {
      rowLetter = "Z";
      seatNumber = seatIndex - (totalSeats - lastRowSeats) + 1;
    }
    return rowLetter + seatNumber;
  };

  const getSeatIndex = (seatNumber) => {
    for (let i = 0; i < totalSeats; i++) {
      if (generateSeatNumber(i) === seatNumber) {
        return i;
      }
    }
    return -1;
  };

  const handleChange = (event) => {
    setSeatCount(event.target.value);
  };
  return (
    <div
      style={{
        textAlign: "center",
        width: "80%",
        height: "100%",
        margin: "0px auto",
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      <h1 style={{ margin: "20px", textDecoration: "underline" }}>
        Seat Booking System
      </h1>
      <p>Enter the number of seats you want to book:</p>
      <input
        type="number"
        value={seatCount}
        onChange={handleChange}
        placeholder="No. of seats you want to book. eg. 1"
        style={{
          margin: "5px auto",
          width: "40%",
          height: "30px",
          border: "1px solid gray",
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
          paddingLeft: "10px",
        }}
      />
      <button
        onClick={handleSeatBooking}
        style={{
          padding: "9px 20px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
          cursor: "pointer",
        }}
      >
        Book
      </button>
      <br />
      <button
        onClick={handleReset}
        style={{
          color: "white",
          cursor: "pointer",
          padding: "9px 25px",
          fontWeight: "bold",
          border: "none",
          borderRadius: "10px",
          backgroundColor: "#f44336",
        }}
      >
        RESET
      </button>
      <br />
      <h3
        style={{
          color: "blue",
          fontWeight: "bold",
        }}
      >
        {"hello"}
      </h3>
      <br />
      <br />
      <hr />

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
        <strong>Booked Seat no.</strong>
        {bookedSeats.length > 0 &&
          bookedSeats.map((el) => (
            <p
              style={{
                padding: "3px 10px",
                margin: "3px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
              }}
            >
              {el.seatNumber}
            </p>
          ))}
      </div>

      <br />
      <hr />
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
        }}
      >
        {seats.map((isBooked, index) => (
          <div
            key={index}
            style={{
              display: "inline-block",
              backgroundColor: isBooked ? "red" : "green",
              padding: "5px",
              margin: "5px",
              color: "white",
              borderRadius: "3px",
            }}
          >
            {generateSeatNumber(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seats;
