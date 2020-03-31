window.onload = function () {
    var socket = io.connect('http://localhost:8888');
    var tablero = document.getElementById("tablero");
    var pass = document.getElementById("password");
    var boto = document.getElementById("boto");

    boto.onclick = function () {
        var height = document.getElementById("height").value;
        var width = document.getElementById("width").value;
        socket.emit('sendSize', { h: height, w: width });
    };
 
    socket.on('crearTabla', function(data) {
       
    
         // get the reference for the body
         

         // creates a <table> element and a <tbody> element
         var tbl = document.createElement("table");
         var tblBody = document.createElement("tbody");
 
         // creating all cells
         for (var i = 0; i < data.h; i++) {
             // creates a table row
             var row = document.createElement("tr");
 
             for (var j = 0; j < data.w; j++) {
                 // Create a <td> element and a text node, make the text
                 // node the contents of the <td>, and put the <td> at
                 // the end of the table row
                 var cell = document.createElement("td");
                 cell.setAttribute("id", "c"+i+j);
                 var cellText = document.createTextNode("cell in row " + i + ", column " + j);
                 cell.appendChild(cellText);
                 row.appendChild(cell);
             }
 
             // add the row to the end of the table body
             tblBody.appendChild(row);
         }
 
         // put the <tbody> in the <table>
         tbl.appendChild(tblBody);
         // appends <table> into <body>
         tablero.appendChild(tbl);
         // sets the border attribute of tbl to 2;
         tbl.setAttribute("border", "2");
         $('td').click(function () {
            var id = $(this).attr('id');
            socket.emit('clicked', { id: id, player: localStorage.getItem('name')});
        });
        });
    socket.on('color',function(data) {
        var cell= document.getElementById(data.id);
        cell.style.backgroundColor = data.color;

    });
};