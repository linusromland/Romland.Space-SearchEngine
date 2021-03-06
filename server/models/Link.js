const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  name: String,
  link: String,
  desc: String,
  verified: Boolean,
  hits: Number
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;
