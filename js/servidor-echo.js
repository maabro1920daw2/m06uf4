var express = require("express");
var app = express();
var port = 8888;


class Partida {

    constructor(codi, height, width) {
        this.codi = codi;
        this.height = height;
        this.width = width;
        this.jugadors = [];
    }
    addJugador(j) {
        if (this.jugadors.length <= 4) {
            this.jugadors.push(j);
        }
    }
    check(){

    }
    generarTablero(){
        
        io.sockets.emit('crearTabla',  { h: this.height, w: this.width });
    }
    guardarJugadoresMongo(){}
}
class Jugador {
    constructor(codi, color, puntuacion, password) {
        this.codi = codi;
        this.color = color;
        this.puntuacion = puntuacion;
        this.password = password;
    }
    calculaPuntuacion(){}
    guardarMongo(codiP){}
}
var p;
app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/../views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("index");
});
app.get("/tablero", function(req, res){
    res.render("tablero");
});
 
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
    socket.emit('missatge', { missatge: 'Benvingut' });
    socket.on('login', function (data) {
        console.log(data.us);
        io.sockets.emit('redirect', '/tablero');

        
    });
    socket.on('sendSize', function (data) {
        
        p= new Partida(1,data.h,data.w);
        p.generarTablero();
        

        
    });
});
