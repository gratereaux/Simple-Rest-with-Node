/** Web service en Node creado por Jose Gratereaux
 *
 * Ejemplo de consulta
 *
 * <<URL>>/servicio/<USERID>/<TOKEN>/<CAMPOS A SELECCIONAR>/<TABLA>
 *  http://localhost:8080/servicio/jose/1234567890/status,username,passowrd/user
 *  mysql>> select status, username, password from user
 *
 * <<URL>>/servicio/<USERID>/<TOKEN>/<CAMPOS A SELECCIONAR>/<TABLA>/<ID CONDICION>/<VALOR CONDICION>
 *  http://localhost:8080/servicio/jose/1234567890/status,username,passowrd/user/username/jose
 *  mysql>> select status, username, password from user where username = 'jose'
 */

var mysql   = require('mysql'),
    http    = require('http');

var connection  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '11121980',
    database: 'emergencia'
});

app = http.createServer(function(req, res){

    var urlparts = req.url.split("/"),
        userid = urlparts[2],
        token = urlparts[3],
        select = urlparts[4],
        from = urlparts[5],
        where = urlparts[6],
        equal = urlparts[7];


        if(select && from && where && equal)
            var querygen = "SELECT " + select + " FROM " + from + " WHERE " + where + " = '" + equal + "'";

        if(select && from && !where && !equal)
            var querygen = "SELECT " + select + " FROM " + from;

        if(querygen){
            checktoken(userid,token,function(err, data){
                if(data){
                    basededatos(querygen, function(err, dato){
                        var json = JSON.stringify(dato);
                        res.writeHead(200, {'Content-Type' : 'application/json'});
                        res.end(json);
                    });
                }else{
                    res.writeHead(200, {'Content-Type' : 'text/html'});
                    res.end("<h4>Usted no tiene permiso para visualizar el contenido! inserte credenciales validas.</h4>");
                }
            });
        }
});

app.listen(8080, "localhost");
console.log("Server corriendo en Localhost port 8080");

//Coneccion a la base de datos
connection.connect();


function basededatos(q, callback){
        connection.query(q, function(err, rows, fields) {
            callback(null, rows);
        });
}



function checktoken(u,p,callback){
    connection.query("SELECT userid FROM restfull WHERE userid = '"+ u +"' AND token = '"+ p +"'", function(err, rows, fields) {
        if (rows.length > 0){
            callback(null, true);
        }else{
            callback(null, false);
        }

    });
}
