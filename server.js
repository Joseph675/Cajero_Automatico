var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();


// Crea una conexión a la base de datos
var db = mysql.createConnection({
  host: 'localhost',
  user: 'joseph',
  password: 'zuphoprezEcrichupr4c',
  database: 'atm'
});

// Conéctate a la base de datos
db.connect(function (err) {
  if (err) throw err;
  console.log('¡Conectado a la base de datos MySQL!');
});

app.use(bodyParser.json());

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static('public'));



app.get('/login', function (req, res) {

  var email = req.query.email;
  var password = req.query.password;

  db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password], function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});


app.get('/verifiuser', function (req, res) {
  var email = req.query.email;
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/insertarusuario', function (req, res) {
  var data = req.body;

  db.query('INSERT INTO usuarios(nombre, email, password, pin,numero_cuenta,cvv, fecha_expira,saldo) VALUES (?,?,?,?,?,?,?,?)', [data.nombre, data.email, data.password, data.pin, data.numero_cuenta, data.cvv, data.fecha_expira, data.saldo], function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).send('Hubo un error al insertar el estudiante');
      return;
    }
    res.json(results);
  });
});

app.post('/insertarcajero', function (req, res) {
  var data = req.body;

  db.query('INSERT INTO cajero(saldocajero, billetes_100000 , billetes_50000 , billetes_20000 , billetes_10000 , billetes_5000, billetes_2000 , billetes_1000 ) VALUES (?,?,?,?,?,?,?,?)', [data.saldocajero, data.billetes_100000, data.billetes_50000, data.billetes_20000, data.billetes_10000, data.billetes_5000, data.billetes_2000, data.billetes_1000], function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).send('Hubo un error al insertar el estudiante');
      return;
    }
    res.json(results);
  });
});


app.post('/insertarinvoice', function (req, res) {
  var data = req.body;

  db.query('INSERT INTO invoice(id_usuario, fecha, numero_invoice, tipo_transaccion,saldo,saldo_transaccion) VALUES (?,?,?,?,?,?)', [data.id_usuario, data.fecha, data.numero_invoice, data.tipo_transaccion, data.saldo, data.saldo_transaccion], function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).send('Hubo un error al insertar el estudiante');
      return;
    }
    res.json(results);
  });
});


app.get('/verifiuserretirar', function (req, res) {
  var cvv = req.query.cvv;
  var pin = req.query.pin;
  var numero_cuenta = req.query.numero_cuenta;


  db.query('SELECT * FROM usuarios WHERE cvv = ? and pin = ? and numero_cuenta = ?', [cvv, pin, numero_cuenta], function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});


app.get('/traerusuario', function (req, res) {
  
  var id_usuario = req.query.id_usuario;

  db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario], function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/editarusu/:id_usuario', function (req, res) {
  var id_usuario = req.params.id_usuario;
  var data = req.body; // Asegúrate de que 'data' contiene los nuevos valores para el usuario


  db.query('UPDATE usuarios SET saldo = ? WHERE id_usuario = ?', [data.saldo, id_usuario], function (err, results) {
    if (err) throw err;
    res.json(results);

  });
});

app.get('/verifisaldocajero', function (req, res) {
  db.query('SELECT * FROM cajero ORDER BY id DESC LIMIT 1', function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});


app.post('/editarsaldocajero/:id_cajero', function (req, res) {
  var id = req.params.id_cajero;
  var data = req.body; // Asegúrate de que 'data' contiene los nuevos valores para el usuario


  db.query('UPDATE cajero SET saldocajero = ?, billetes_100000 = ?, billetes_50000 = ?, billetes_20000 = ?, billetes_10000 = ?, billetes_5000 = ?, billetes_2000 = ?, billetes_1000 = ?  WHERE id = ?', [data.saldocajero, data.billetes_100000 , data.billetes_50000,  data.billetes_20000,  data.billetes_10000, data.billetes_5000, data.billetes_2000, data.billetes_1000, id], function (err, results) {
    if (err) throw err;
    res.json(results);

  });
});



app.get('/traerinvoice', function (req, res) {
  db.query('SELECT * FROM invoice ORDER BY id DESC LIMIT 1', function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});



app.get('/traerinvoicetodos', function (req, res) {
  
  var id_usuario = req.query.id_usuario;

  db.query('SELECT * FROM invoice WHERE id_usuario = ?', [id_usuario], function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});


app.get('/traerusus', function (req, res) {
  
  var id_usuario = req.query.id_usuario;

  db.query('SELECT * FROM usuarios WHERE id_usuario != ?', [id_usuario], function (err, results) {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/actualizarSaldo', function(req, res) {
  var id_usuario = req.body.id_usuario;
  var monto = req.body.monto;

  db.query('UPDATE usuarios SET saldo = saldo + ? WHERE id_usuario = ?', [monto, id_usuario], function(err, results) {
    if (err) throw err;
    res.json(results);
  });
});


app.get('/obtenerSaldo', function(req, res) {
  var id_usuario = req.query.id_usuario;

  db.query('SELECT saldo FROM usuarios WHERE id_usuario = ?', [id_usuario], function(err, results) {
    if (err) throw err;
    res.json(results[0]);
  });
});

var server = app.listen(3000, '0.0.0.0', function () {
  console.log('La aplicación está escuchando en http://0.0.0.0:' + server.address().port);


});