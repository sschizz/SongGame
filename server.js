const yts = require('yt-search')
const stream = require('youtube-audio-stream')
const { Writable } = require('stream')
const fs = require('fs')

const express = require('express')
const http = require('http')
const path = require('path')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.get('/song', (req, res) => {
    stream('http://www.youtube.com/watch?v=rtL5oMyBHPs').pipe(res)
})

app.put('/song', (req, res) => {

})

app.use(express.static(path.join(__dirname, "public")))
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

io.on('connection', socket => {
    console.log(`New connection ${socket.id}`)
    socket.emit('new-connection', socket.id)

    socket.on('song-search', async val => {
        if (String(val) <= 0)
            return

        var r = await yts(String(val))
        var res = fs.createWriteStream('./output')
        for await (const chunk of stream(r.videos[0].url)) {
            res.write(chunk)
        }
        res.end()
    })
})
