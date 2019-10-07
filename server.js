const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const connections = [null, null];

io.on("connection", function(socket) {
  // Find an available player number
  let playerIndex = -1;
  for (var i in connections) {
    if (connections[i] === null) {
      playerIndex = i;
    }
  }
  // Tell the connecting client what player number they are
  socket.emit("player-number", playerIndex);

  // Ignore player 3
  if (playerIndex == -1) return;

  connections[playerIndex] = socket;

  // Tell everyone else what player number just connected
  socket.broadcast.emit("player-connect", playerIndex);

  socket.on("disconnect", function() {
    console.log(`Player ${playerIndex} Disconnected`);
    connections[playerIndex] = null;
  });
});

io.on("connection", function(socket) {
  socket.on("move", function(obj) {
    io.emit("move", obj);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
