const express = require("express");
const dbModule = require("./dbModule");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const Link = require("./models/Link.js");
const url = require("url");
const app = express();
const port = 3000;
const clientdir = __dirname + "/client";
const cookieParser = require("cookie-parser");
let key;

app.use(express.static(clientdir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.set("view engine", "ejs");
connectToMongo("SearchEngine", "mongodb://localhost:27017/");
security();

app.get("/", async (req, res) => {
	res.render("index", {});
});

app.get("/about", async (req, res) => {
	res.render("about", {});
});

app.get("/getSearch", async (req, res) => {
	let url_parts = url.parse(req.url, true);
	let urlquery = url_parts.query;
	let search = urlquery.search ? urlquery.search : "";

	res.setHeader("Content-Type", "application/json");
	let searchThing = await dbModule.getInDBVerified(Link, search);
	res.send(searchThing);
});

app.get("/login", (req, res) => {
	if (req.cookies.authstring && req.cookies.authstring == key) {
		res.redirect("/siteVerification");
	} else {
		res.sendFile(clientdir + "/login.html");
	}
});

app.get("/siteVerification", (req, res) => {
	if (req.cookies.authstring && req.cookies.authstring == key) {
    res.sendFile(clientdir + "/verify.html");
	} else {
		res.redirect("/login");
	}
});

app.get("/getAll", async (req, res) => {
	if (req.cookies.authstring && req.cookies.authstring == key) {
		let result = await dbModule.getAll(Link);

		res.send(result);
	} else {
		res.send("No auth");
	}
});

app.post("/verify", (req, res) => {
	if (req.body.authstring == key) {
		console.log("Auth success");
		res.cookie("authstring", req.body.authstring);
		res.sendFile(clientdir + "/verify.html");
	} else {
		res.redirect("/");
	}
});

app.get("/insert", (req, res) => res.sendFile(clientdir + "/insert.html"));

app.post("/newLink", async (req, res) => {
	try {
		await dbModule.saveToDB(
			createLink(req.body.name, req.body.link, req.body.desc)
		);
		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

function security() {
	if (!fs.existsSync("security/security.txt")) {
		console.log("File doesn't exist");

		fs.writeFile("security/security.txt", generateP(), function (err) {
			if (err) return console.log(err);
			console.log("Created authentication string");
		});
	}
	key = fs.readFileSync("./security/security.txt");
}

function generateP() {
	var pass = "";
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 1; i <= 32; i++) {
		var char = Math.floor(Math.random() * str.length + 1);

		pass += str.charAt(char);
	}

	return pass;
}

function connectToMongo(dbName, connectURL) {
	if (fs.existsSync("mongoauth.json")) {
		const mongAuth = require("./mongoauth.json");
		dbModule.cnctDBAuth(dbName, connectURL);
	} else {
		dbModule.cnctDB(dbName, connectURL);
	}
}

function createLink(nameIN, linkIN, descIN) {
	let tmp = new Link({
		name: nameIN,
		link: linkIN,
		desc: descIN,
		verified: false,
	});
	return tmp;
}
