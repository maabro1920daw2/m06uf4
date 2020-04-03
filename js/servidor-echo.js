var express = require("express");
var app = express();
var port = 8888;
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
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
            var x = setInterval(function () {
                distance = distance - 1000;
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                console.log(seconds + "s ");
                if (distance < 0) {
                    clearInterval(x);
                    console.log("Time's Up");
                }
            }, 1000);
            io.sockets.emit('timer', distance);
        }
    }
    checkTime() {
        if (distance < 0) {
            return false;
        }
        return true;
    }
    complete() {
        var xcomp = setInterval(function () {
            var b = true;
            for (var i = 0; i < tab.length; i++) {
                if (tab[i].color == "nada") {
                    b = false;
                    break;
                }
            }
            if (b) {
                if (!tiempo) {
                    tiempo = distance;
                }
                distance = 0;
                clearInterval(xcomp);
                io.sockets.emit("completado", "hola");
                return true;
            } else return false;
        }, 1000);
    }
    check(j, id) {
        var b = true;
        this.startTimer();
        this.complete();
        if (this.checkTime()) {
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
    guardarJugadoresMongo() {
        var ruta = 'mongodb://127.0.0.1:27017/puntuacions';
        MongoClient.connect(ruta, function (err, db) {
            assert.equal(null, err);
            console.log("Connexió correcta");
            afegirDocuments(db, err, function () { });
            db.close();
        });
        var tiempototal = (20000 - tiempo) / 1000;
        var afegirDocuments = function (db, err, callback) {
            for (var i = 0; i < js.length; i++) {
                db.collection('puntuacions').insertOne({
                    jugador: js[i].codi,
                    color: js[i].color,
                    puntuacion: js[i].puntuacion,
                    codiP: p.codi,
                    tiempo: tiempototal + "s"
                });
                assert.equal(err, null);
                console.log("Añadidas puntuaciones");
                callback();
            }
        };
    }
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
}
function loginCorrecto(user, pass) {
    var ruta = 'mongodb://127.0.0.1:27017/usuarios';
    MongoClient.connect(ruta, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        comprobarLogin(db, err, function () { });
        db.close();
    });
    var comprobarLogin = function (db, err, callback) {
        db.collection('usuarios').find({ nombre: user, pass: pass }).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                var j = new Jugador(user, colors[jus], 0, pass);
                js.push(j);
                jus++;
                if (jus>5) jus=0;
                io.sockets.emit('redirect', '/tablero');
            }
            db.close();
        });
        assert.equal(err, null);
        callback();
    }
};
function registrarCorrecto(user, pass) {
    var ruta = 'mongodb://127.0.0.1:27017/usuarios';
    MongoClient.connect(ruta, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        comprobarRegister(db, err, function () { });
        db.close();
    });
    var comprobarRegister = function (db, err, callback) {
        db.collection('usuarios').find({ nombre: user }).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                io.sockets.emit('existe', '/tablero');
            }
            else {
                insertarUsuario(user, pass);
            }
            db.close();
        });
        assert.equal(err, null);
        callback();
    };
}
function insertarUsuario(user, pass) {
    var ruta = 'mongodb://127.0.0.1:27017/usuarios';
    MongoClient.connect(ruta, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        usermongo(db, err, function () { });
        db.close();
    });
    var usermongo = function (db, err, callback) {
        db.collection('usuarios').insertOne({
            nombre: user,
            pass: pass
        });
        assert.equal(err, null);
        console.log("Añadido usuario a la base de datos");
        callback();
    };
}
function returnPunt() {
    var ruta = 'mongodb://127.0.0.1:27017/puntuacions';
    MongoClient.connect(ruta, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        returner(db, err, function () { });
        db.close();
    });
    var returner = function (db, err, callback) {
        db.collection('puntuacions').find().sort({ puntuacion: -1 }).toArray(function (err, result) {
            if (err) throw err;
            io.sockets.emit('puntu', result);
            db.close();
        });
        assert.equal(err, null);
        callback();
    };
}
var p;
var js = [];
var jus = 0;
var tab = [];
var distance = 20000;
var tiempo;
var lb = false;
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
        loginCorrecto(data.us, data.p)
    });
    socket.on('register', function (data) {
        registrarCorrecto(data.us, data.p);
    });
    socket.on('punt', function (data) {
        returnPunt();
    });
    socket.on('sendSize', function (data) {
        distance = 20000;
        lb = false;
        tiempo = false;
        p = new Partida(1, data.h, data.w);
        p.jugadors = js;
        p.generarTablero();
    });
    socket.on('guardarMongo', function (data) {
        p.guardarJugadoresMongo();
    });
    socket.on('logout', function (data) {
        p.guardarJugadoresMongo();


        var filteredAry = js.filter(e => e.codi != data);
        js=filteredAry;

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