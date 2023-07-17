const express = require("express");
const seatRouter = express.Router();
const SeatModel = require("../models/Seat.module");

// Book seats
const totalSeats = 80;
const seatsInRow = 7;
const lastRowSeats = 3;

const seats = new Array(totalSeats).fill(false);

const bookSeats = (seatCount) => {
  const result = [];
  for (let i = 0; i <= totalSeats - seatCount; i++) {
    let seatsPerRow = i < totalSeats - lastRowSeats ? seatsInRow : lastRowSeats;
    console.log(seatsPerRow, "seatsPerRow");
    if (
      (i % seatsPerRow) + seatCount <= seatsPerRow &&
      seats.slice(i, i + seatCount).every((x) => x === false)
    ) {
      const newSeats = [...seats];
      for (let j = 0; j < seatCount; j++) {
        const seatIndex = i + j;
        newSeats[seatIndex] = true;
        const seatNumber = generateSeatNumber(seatIndex);
        result.push({ seatNumber: seatNumber, isBooked: false });
      }
      seats.splice(0, totalSeats, ...newSeats);
      break;
    }
  }

  return result;
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

// Fetching the booked seats
seatRouter.get("/bookedseats", async (req, res) => {
  try {
    const bookedSeats = await SeatModel.find();
    // const arr = bookedSeats.reduce((acc, item) => {
    //   const { seats } = item;

    //   const a = seats.reduce((ac, i) => {
    //     const { seatNumber } = i;
    //     return [...ac, seatNumber];
    //   }, []);
    //   return [...acc, ...a];
    // }, []);
    res.status(200).send({ bookedSeats });
    // res.status(200).send({ bookedSeats: arr });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// Delete all booked seats (RESET)
seatRouter.delete("/deleteall", async (req, res) => {
  try {
    await SeatModel.deleteMany({});
    res.status(200).send({ msg: "All Booked Seats Record Deleted" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// Book seats
seatRouter.post("/booked", async (req, res) => {
  const seatCount = req.body.number;
  const newBookedSeats = bookSeats(seatCount);
  console.log(newBookedSeats, "NEWbOOKKED");
  if (newBookedSeats.length > 0) {
    const seatDocuments = newBookedSeats.map((seat) => {
      return {
        seatNumber: seat.seatNumber,
        isBooked: seat.isBooked,
      };
    });

    try {
      const newSeatBook = new SeatModel({ seatNumber: seatDocuments });
      await newSeatBook.save();
      res.status(200).send({ msg: "New seats booked" });
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  } else {
    res.status(400).json({ error: "No seats available" });
  }
});

module.exports = seatRouter;
