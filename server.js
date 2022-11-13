const yts = require("yt-search");
const stream = require("youtube-audio-stream");

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const PORT = process.env.PORT || 3000;
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());

app.get("/song/:id", cors(corsOptions), (req, res) => {
  stream(`https://www.youtube.com/watch?v=${req.params.id}`).pipe(res);
});

app.get("/test", cors(corsOptions), (req, res) => {
  return res.json({msg: "test"});
});

app.get("/message/:id", cors(corsOptions), (req, res) => {
  console.log(`${req.params.id}`);
  return res.json({ msg: `${req.params.id}` });
});

io.on("connection", (socket) => {
  console.log(`New connection ${socket.id}`);
  socket.emit("new-connection", socket.id);

  socket.on("song-search", async (val) => {
    if (String(val) <= 0) return;

    var r = await yts(String(val));
    var res;
    for await (const chunk of stream(r.videos[0].url)) {
      res.write(chunk);
    }
    res.end();
    return res;
  });
});

app.use(express.static(path.join(__dirname, "public")));
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
