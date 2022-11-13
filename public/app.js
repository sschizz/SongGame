const SERVER = "http:/localhost:3000";
const SONG_ID = "79fzeNUqQbQ";

const getAudio = (id) => {
  return new Promise((resolve, reject) => {
    var context = new AudioContext();
    var request = new XMLHttpRequest();
    request.open("GET", `/song/${id}`, true);
    request.responseType = "arraybuffer";
    request.onload = () => {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(request.status);
      }
    };
    request.send();
  });
};

const ctx = new AudioContext();
let audio;

function PlayBack() {
  const play_sound = ctx.createBufferSource();
  play_sound.buffer = audio;
  play_sound.connect(ctx.destination);
  play_sound.start(ctx.currentTime);
}

window.addEventListener("load", async () => {
  const btn = document.getElementById("btn_search");
  const input = document.getElementById("input");

  btn.addEventListener("click", async () => {
    socket.emit("song-search", input.value);

    await fetch(`/song/${SONG_ID}`)
      .then((data) => data.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((decoded_audio) => {
        audio = decoded_audio;
      });

    PlayBack();
  });

  const socket = io();
  socket.on("search-result", (r) => {
    console.log(r);
  });

  socket.on("new-connection", (id) => {
    console.log(`Welcome ${id}`);
  });
});
