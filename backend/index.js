const express = require("express");
const cors = require("cors");

const { connection } = require("./config/config");
const seatRouter = require("./routes/seat.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", seatRouter);

app.listen(5000, async () => {
  try {
    await connection;
    console.log("connected to db");
    console.log("Server is listening on port 5000");
  } catch (err) {
    console.log(err);
  }
});
