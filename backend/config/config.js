const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://ticket-booking:eaC41dCkPzgniCyV@cluster0.gwmydfp.mongodb.net/?retryWrites=true&w=majority"
);

module.exports = { connection };
