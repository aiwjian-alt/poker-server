const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = [];

io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    players.push(socket.id);

    io.emit("player_list", players);

    socket.on("bet", (data) => {

        console.log("Bet:", data);

        io.emit("bet_update", data);

    });

    socket.on("disconnect", () => {

        console.log("Player disconnected");

        players = players.filter(p => p !== socket.id);

        io.emit("player_list", players);

    });

});

app.get("/", (req,res)=>{
    res.send("Poker realtime server running");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
    console.log("Server running on", PORT);
});