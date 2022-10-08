const fs = require('fs')
const http = require('http')


document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('btn_search')
    const input = document.getElementById('input')
    const socket = io()

    btn.addEventListener('click', async () => {
        socket.emit('song-search', input.value)
        document.getElementById('audio').play()
    })

    const audio = document.getElementById("audio")
    var res = fs.createWriteStream(audio)
    console.log(res)
    socket.on('search-result', (r) => {
        console.log(r)
    })

    socket.on('new-connection', id => {
        console.log(`Welcome ${id}`)
    })
})
