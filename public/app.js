document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('btn_search')
    const input = document.getElementById('input')
    const socket = io()

    btn.addEventListener('click', async () => {
        socket.emit('button-click', input.value)
    })

    socket.on('search-result', (r) => {
        console.log(r)
        var a = new Audio(r.videos[0].url)
        a.play()
    })

    socket.on('new-connection', id => {
        console.log(`Welcome ${id}`)
    })
})
