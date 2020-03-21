var socket = io.connect('http://localhost:8888');
socket.emit('dadesDesDelClient', {
    dades: '123456'
});
socket.on('dadesDesDelServidor', function (data) {
    console.log('CLIENT -> dades rebudes del servidor->' + data.dades);
});