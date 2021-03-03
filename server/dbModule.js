const mongoose = require('mongoose');
let db;

//Connect to MongoDB With Authentication.
exports.cnctDBAuth = (collectionname, connectURL) => {
  const mongAuth = require("./mongoauth.json");
  mongoose.connect(connectURL + collectionname, {
    auth: {
      authSource: "admin",
    },
    user: mongAuth.username,
    pass: mongAuth.pass,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB using collection " + collectionname);
  });
};

//Connect to MongoDB
exports.cnctDB = (collectionname, connectURL) => {
  let dbLink = connectURL + collectionname;
  mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB using " + collectionname);
  });
};

exports.getInDB = async (Model, search) => {
  const regex = new RegExp(escapeRegex(search), 'gi');
  return await Model.find({ 
    $and: [{ $or: [{ "name": regex }, { "link": regex }] }, ] }).limit(10)
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.getDB = async (Model) => {
  return await Model.find({})
}

exports.saveToDB = (input) => {
  input.save(() => {
    console.log(`Successfully saved ${input} to the database!`)
    return true
  })
  return false
}