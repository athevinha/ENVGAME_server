const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
  name: String, // #
  gmail: String, // #
  passsword: String, // #
  description: String, // #
  type: Number,
  avatar: String, // #
  time_playgame: Number,
  earned_money: Array, // money make for month
  played_games: Array, // list game played
  interests: Array, // list hobby
  tooken: String, // #
});
const users = mongoose.model("user", exerciseSchema);
module.exports = users;
