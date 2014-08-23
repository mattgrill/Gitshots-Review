var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    path            = require('path'),
    mysql           = require('mysql'),
    connection      = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

connection.connect();

app.post('/', function(req, res){
  var query = connection.query('INSERT INTO _img_values SET ?', req.body, function(err, result) {
    res.status(200).send('Submitted to MYSQL. \n');
  });
});

app.get('/', function(req, res){
  var rows  = [],
      query = connection.query('SELECT file_name from _img_values');
  query
    .on('result', function(row) {
      rows.push(row);
    })
    .on('end', function() {
      res.render('index', { mysqldata : rows} );
    });
});


app.listen(process.env.PORT);
