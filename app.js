const express = require("express");
const socket = require("socket.io");
const path = require("path");
const http = require("http");
const {Chess} = require("chess.js");

const app = express();

const server = http.createServer(app)
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", {title: "Chess Game"});
});

io.on("connection", function(usocket) {
    console.log("Connected");
})

server.listen(3000, function() {
    console.log("Server listening on Port 3000");
})