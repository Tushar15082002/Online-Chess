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
    if(!players.white) {
        players.white = usocket.id;
        usocket.emit("playerRole","w");
    }
    else if(!players.black) {
        players.black = usocket.id;
        usocket.emit("playerRole","b");
    }
    else {
        usocket.emit("spectatorRole");
    }

    usocket.on("disconnect", function() {
        if(usocket.id == players.white) {
            delete players.white;
        }
        else if(usocket.id == players.black) {
            delete players.black;
        }
    });

    usocket.on("move", (move) => {
        try {
            if(chess.turn() == "w" && usocket.id != players.white) return;
            if(chess.turn() == "b" && usocket.id != players.black) return; 

            const result = chess.move(move);
            if(result) {
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                console.log("Invalid move : ", move);
                usocket.emit("invalidMove", move);
            }
        }
        catch(err) {
            console.log(err);
            usocket.emit("Invalid move :", move);
        }
    });
});

server.listen(3000, function() {
    console.log("Server listening on Port 3000");
})