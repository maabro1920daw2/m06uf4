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
    var tablaPuntuaciones = document.getElementById("puntuaciones");

    socket.emit('punt', "algo");
    socket.on('puntu', function (data) {

        tablaPuntuaciones.innerHTML = " ";


        // creates a <table> element and a <tbody> element
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");
        console.log(data[1].jugador);
        // creating all cells
        for (var i = 0; i < 4; i++) {
            // creates a table row
            var row = document.createElement("tr");

            for (var j = 0; j < 3; j++) {
                switch (j) {
                    case 0:
                        var cell = document.createElement("td");
                        
                        var cellText = document.createTextNode("nombre: "+data[i].jugador);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        break;
                    case 1:
                        var cell = document.createElement("td");
                        
                        var cellText = document.createTextNode("puntuacion: "+data[i].puntuacion);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        break;
                    case 2:
                        var cell = document.createElement("td");
                        
                        var cellText = document.createTextNode("tiempo: "+data[i].tiempo);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        break;

                }

            }

            // add the row to the end of the table body
            tblBody.appendChild(row);
        }

        // put the <tbody> in the <table>
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        tablaPuntuaciones.appendChild(tbl);
        // sets the border attribute of tbl to 2;
        tbl.setAttribute("border", "2");
    });

    botoLogin.onclick = function () {
        var name = user.value;
        var password = pass.value;
        localStorage.setItem('name', user.value);

        socket.emit('login', { us: name, p: password });
    };
    botoRegister.onclick = function () {
        var name = user.value;
        var password = pass.value;
        socket.emit('register', { us: name, p: password });
    };
    socket.on('redirect', function (destination) {
        window.location.href = destination;
    });
    socket.on('existe', function (destination) {
        alert("Usuario ya existe");
    });

};