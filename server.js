const express = require('express')
const http = require('http')
const path = require('path')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const YouTubeMusicApi = require('youtube-music-api')
const yts = require('yt-search')
const api = new YouTubeMusicApi()
const yap = require('youtube-audio-stream')
const decoder = require('node-lame').Lame
const speaker = require('speaker')

api.initalize()
app.use(express.static(path.join(__dirname, "public")))
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))


io.on('connection', socket => {
    console.log(`New connection ${socket.id}`)
    socket.emit('new-connection', socket.id)

    socket.on('button-click', async val => {
        const res = await yts(val)
        socket.emit('search-result', res)
    })

    socket.on('play-song', url => {
        yap(url)
            .pipe(decoder())
            .pipe(speaker())
    })
})
