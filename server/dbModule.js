const mongoose = require("mongoose"),
	ObjectID = require("mongodb").ObjectID;
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
	mongoose.connect(dbLink, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", function () {
		console.log("Connected to MongoDB using " + collectionname);
	});
};

exports.updateStatus = async (Model, id, status) => {
	await Model.updateOne({ _id: ObjectID(id) }, { verified: status });
};

exports.updateHits = async (Model, link) => {
	await Model.updateOne({ link: link }, { $inc: { hits: 1 } });
};

exports.editLink = async (Model, id, name, desc, link) => {
	await Model.updateOne(
		{ _id: ObjectID(id) },
		{ name: name, link: link, desc: desc }
	);
};

exports.deleteLink = async (Model, id) => {
	await Model.deleteOne({ _id: ObjectID(id) });
};

exports.getInDB = async (Model, search) => {
	const regex = new RegExp(escapeRegex(search), "gi");
	return await Model.find({
		$and: [{ $or: [{ name: regex }, { link: regex }] }],
	}).limit(10);
};

exports.getAll = async (Model, search) => {
	return await Model.find();
};

exports.getInDBVerified = async (Model, search) => {
	const regex = new RegExp(escapeRegex(search), "gi");
	return await Model.find({
		$and: [{ $or: [{ name: regex }, { link: regex }] }, { verified: true }],
	})
		.sort({ hits: -1 })
		.limit(10);
};

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.getDB = async (Model) => {
	return await Model.find({});
};

exports.saveToDB = async (input) => {
	await input.save(async () => {
		console.log(`Successfully saved ${input} to the database!`);
	});
};
