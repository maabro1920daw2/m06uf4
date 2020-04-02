window.onload = function () {
    var socket = io.connect('http://localhost:8888');
    var tablero = document.getElementById("tablero");
    var mongo = document.getElementById("mongo");
    var boto = document.getElementById("boto");
    var logout = document.getElementById("logout");
    mongo.onclick = function () {
        socket.emit('guardarMongo', "hola");
    };
    boto.onclick = function () {
        var height = document.getElementById("height").value;
        var width = document.getElementById("width").value;
        socket.emit('sendSize', { h: height, w: width });
    };
    logout.onclick = function () {
        window.location.href = '/..';
    };
    socket.on('crearTabla', function (data) {
        tablero.innerHTML = " ";
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");
        for (var i = 0; i < data.h; i++) {
            var row = document.createElement("tr");
            for (var j = 0; j < data.w; j++) {
                var cell = document.createElement("td");
                cell.setAttribute("id", "" + i + j);
                //var cellText = document.createTextNode("cell in row " + i + ", column " + j);
                //cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
        tbl.appendChild(tblBody);
        tablero.appendChild(tbl);
        tbl.setAttribute("border", "1");
        $('td').click(function () {
            var id = $(this).attr('id');
            socket.emit('clicked', { id: id, player: localStorage.getItem('name') });
        });
    });
    socket.on('color', function (data) {
        var cell = document.getElementById(data.id);
        cell.style.backgroundColor = data.color;

    });
    var completado = false;
    socket.on('completado', function (data) {
        completado = true;
    });
    socket.on('puntuacion', function (data) {
        var p = document.getElementById("puntuacion");
        var text = "";
        console.log(data.p);
        console.log(data.n[1]);
        for (var i = 0; i < data.n.length; i++) {
            text = text + "Puntuacion de " + data.n[i] + " es: " + data.p[i] + "<br>";
        }
        p.innerHTML = text;
    });
    socket.on('timer', function (distance) {
        var x = setInterval(function () {
            if (completado) distance = 0;
            distance = distance - 1000;
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("timer").innerHTML = seconds + "s ";
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("timer").innerHTML = "Time's Up";
            }
        }, 1000);
    });
};