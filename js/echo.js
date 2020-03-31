/*
 * comunicacions amb backend amb Node i WebSockets
 * @author  sergi.grau@fje.edu
 * @version 2.0 19.02.2016
 * format del document UTF-8
 *
 * CHANGELOG
 * 19.02.2016
 * - comunicacions amb backend amb Node i WebSockets
 *
 * NOTES
 * ORIGEN
 * Desenvolupament Aplicacions Web. Jesuïtes el Clot
 */
window.onload = function () {
    var socket = io.connect('http://localhost:8888');
    var user = document.getElementById("usuario");
    var pass = document.getElementById("password");
    var botoLogin = document.getElementById("login");
    var botoRegister = document.getElementById("register");
    
    botoLogin.onclick = function () {
        var name = user.value;
        var password = pass.value;
        socket.emit('login', { us: name, p: password });
    };
    botoRegister.onclick = function () {
        var name = user.value;
        var password = pass.value;
        socket.emit('register', { us: name, p: password });
    };
    socket.on('redirect', function(destination) {
        window.location.href = destination;
    });
};