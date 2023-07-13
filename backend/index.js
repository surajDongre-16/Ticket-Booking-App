const express = require("express");
const { connection } = require("./config/config");
const SeatModel = require("./models/Seat.module");
const seatRouter = require("./routes/seat.routes");

const app = express();

app.use(express.json());

app.use("/", seatRouter);

// app.get("/", (req, res) => {
//   res.send("Welcome");
// });

app.get("/seat", async (req, res) => {
  const allSeats = await SeatModel.find({});
  res.send({ result: allSeats });
});

app.post("/seat", async (req, res) => {
  try {
    for (let i = 1; i <= 80; i++) {
      const seat = new SeatModel({ seatNumber: i });
      await seat.save();
    }

    res.send({ message: "Seats are stored succesfuly" });
  } catch (err) {
    res.send({ message: err });
  }
});

app.post("/reserve", async (req, res) => {
  const { number } = req.body;

  try {
    // Find available seats
    const availableSeats = await SeatModel.find({ isBooked: false });

    const seatNumbers = availableSeats.reduce((acc, item) => {
      const { seatNumber } = item;
      return [...acc, seatNumber];
    }, []);

    res.send({ result: seatNumbers });

    // if (availableSeats.length < numberOfSeats) {
    //   res.status(400).json({ message: 'Insufficient seats available.' });
    //   return;
    // }

    // Update seat statuses to booked
    // const seatIds = availableSeats.map((seat) => seat._id);
    // await Seat.updateMany({ _id: { $in: seatIds } }, { isBooked: true });

    // res.status(200).json({
    //   message: 'Seats reserved successfully.',
    //   seats: availableSeats,
    // });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.patch("/seat", (req, res) => {
  res.send("patch req");
});

app.listen(5000, async () => {
  try {
    await connection;
    console.log("connected to db");
    console.log("Server is listening on port 5000");
  } catch (err) {
    console.log(err);
  }
});

// ticket-booking
// eaC41dCkPzgniCyV
