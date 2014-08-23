var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mysql           = require('mysql'),
    connection      = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

app.use(bodyParser.json());
connection.connect();

app.post('/', function(req, res){
  var query = connection.query('INSERT INTO _img_values SET ?', req.body, function(err, result) {
    res.status(200).send('Submitted to MYSQL. \n');
  });
});


app.listen(process.env.PORT || 5000);
console.log('Listening on :' + process.env.PORT || '5000');
