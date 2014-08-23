var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    path            = require('path'),
    mysql           = require('mysql'),
    pool            = mysql.createPool({
      connectionLimit : 10,
      host            : process.env.MYSQL_HOST,
      user            : process.env.MYSQL_USER,
      password        : process.env.MYSQL_PASSWORD,
      database        : process.env.MYSQL_DATABASE
    });

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.post('/', function(req, res){
  var query = pool.query('INSERT INTO _img_values SET ?', req.body, function(err, result) {
    res.status(200).send('Submitted to MYSQL. \n');
  });
});

app.get('/', function(req, res){
  var rows  = [],
      query = pool.query('SELECT file_name from _img_values');
  query
    .on('result', function(row) {
      rows.push(row);
    })
    .on('end', function() {
      res.render('index', { mysqldata : rows} );
    });
});


app.listen(process.env.PORT || 5000);
