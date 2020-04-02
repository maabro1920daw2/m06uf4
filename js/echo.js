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
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");
        for (var i = 0; i < 5; i++) {
            var row = document.createElement("tr");
            for (var j = 0; j < 3; j++) {
                switch (j) {
                    case 0:
                        var cell = document.createElement("td");
                        
                        var cellText = document.createTextNode("Nombre: "+data[i].jugador);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        break;
                    case 1:
                        var cell = document.createElement("td");
                        
                        var cellText = document.createTextNode("Puntuación: "+data[i].puntuacion);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        break;
                    case 2:
                        var cell = document.createElement("td");
                        
                        var cellText = document.createTextNode("Tiempo: "+data[i].tiempo);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        break;
                }
            }
            tblBody.appendChild(row);
        }
        tbl.appendChild(tblBody);
        tablaPuntuaciones.appendChild(tbl);
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