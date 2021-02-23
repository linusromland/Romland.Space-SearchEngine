const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  name: String,
  link: String,
  desc: String
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;
