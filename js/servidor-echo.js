var express = require("express");
var app = express();
var port = 8888;

var colors = ["#EAC910", "#EA1710", "#104FEA", "#10EA17", "#10EAE0", "#E010EA"];
class Partida {

    constructor(codi, height, width) {
        this.codi = codi;
        this.height = height;
        this.width = width;
        this.jugadors = [];
    }
    colorid(color, x, y) {
        var id = "" + x + y;
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].id == id) {
                if (tab[i].color == color) {
                    return true;
                }
            }

        }
        return false;
    }
    startTimer() {
        var b = true;
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].color != "nada") {
                b = false;
                break;
            }

        }
        if (b) {
            var distance = 20000;
            var x = setInterval(function () {
                distance = distance - 1000;
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                console.log(seconds + "s ");

                if (distance < 0) {
                    clearInterval(x);
                    console.log("Time's Up");
                }
            }, 1000);
            io.sockets.emit('timer',distance);
        }
    }
    check(j, id) {
        var b = true;
        this.startTimer();
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].color == j.color) {
                b = false;
                break;
            }

        }
        if (b) {
            for (var i = 0; i < tab.length; i++) {
                if (tab[i].id == id) {
                    if (tab[i].color == "nada") {
                        tab[i].color = j.color;
                        return true;
                    }
                }

            }
        }
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].id == id) {
                if (tab[i].color == "nada") {
                    var x = parseInt(id.substr(0, 1));
                    var y = parseInt(id.substr(1, 1));
                    if (this.colorid(j.color, x + 1, y) || this.colorid(j.color, x, y + 1) || this.colorid(j.color, x - 1, y) || this.colorid(j.color, x, y - 1) || this.colorid(j.color, x + 1, y + 1) || this.colorid(j.color, x + 1, y - 1) || this.colorid(j.color, x - 1, y + 1) || this.colorid(j.color, x - 1, y - 1)) {
                        tab[i].color = j.color;
                        return true;
                    }
                }
            }

        }
        return false;
    }
    generarTablero() {
        tab = [];
        for (var i = 0; i < this.height; i++) {

            for (var j = 0; j < this.width; j++) {
                tab.push({ id: "" + i + j, color: "nada" });
            }
        }
        io.sockets.emit('crearTabla', { h: this.height, w: this.width });
    }
    guardarJugadoresMongo() { }
}
class Jugador {
    constructor(codi, color, puntuacion, password) {
        this.codi = codi;
        this.color = color;
        this.puntuacion = puntuacion;
        this.password = password;
    }
    calculaPuntuacion() {
        var puntuacion = 0;
        for (var i = 0; i < tab.length; i++) {
            if (tab[i].color == this.color) {
                puntuacion++;
            }
        }

        this.puntuacion = puntuacion;
    }
    guardarMongo(codiP) { }
}

var p;
var js = [];
var jus = 0;
var tab = [];
app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/../views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/tablero", function (req, res) {
    res.render("tablero");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
    socket.emit('missatge', { missatge: 'Benvingut' });
    socket.on('login', function (data) {
        var j = new Jugador(data.us, colors[jus], 0, data.p);
        js.push(j);
        jus++;

        io.sockets.emit('redirect', '/tablero');
    });
    socket.on('sendSize', function (data) {
        p = new Partida(1, data.h, data.w);
        p.jugadors = js;
        p.generarTablero();
    });
    socket.on('clicked', function (data) {
        var j = js.find(obj => { return obj.codi === data.player });
        if (p.check(j, data.id)) {
            j.calculaPuntuacion();
            var ps = [];
            var ns = [];
            for (var i = 0; i < js.length; i++) {
                ps.push(js[i].puntuacion);
                ns.push(js[i].codi);
            }
            io.sockets.emit('puntuacion', { p: ps, n: ns });
            io.sockets.emit('color', { id: data.id, color: j.color });
        }
    });

});
