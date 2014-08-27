var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    path            = require('path'),
    uuid            = require('uuid'),
    mysql           = require('mysql'),
    promptColors    = {
      'RESET'   : '\033[m',
      'red'    : '\033[1;31m',
      'blue'   : '\033[1;34m',
    },
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

app.post('/register', function (req, res){
  if (req.body.table === 'register') {
    res.status(403).send('Sorry, bro.');
  }
  else {
    pool.query({sql : 'SHOW TABLES LIKE "' + req.body.table + '"', timeout : 60000}, function (err, rows){
      if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
        res.status(504).send(promptColors.red+'Sorry, MYSQL timed out. '+promptColors.RESET+' \n');
      }
      if (err) {
        res.status(500).send(promptColors.red+'Sorry, MYSQL did something else? ' + err.code + ' ' + promptColors.RESET + ' \n');
      }
      else {
        if (rows.length === 0){
          var key = uuid.v4();
          pool
            .query({sql : 'CREATE TABLE `' + req.body.table + '` (`id` int(255) unsigned NOT NULL AUTO_INCREMENT, `date` varchar(10) NOT NULL DEFAULT "", `file_name` varchar(255) NOT NULL DEFAULT "", PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;', timeout : 60000}, function (err, rows){
              if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
                res.status(504).send(promptColors.red+'Sorry, MYSQL timed out. '+promptColors.RESET+' \n');
              }
              if (err) {
                res.status(500).send(promptColors.red+'Sorry, MYSQL did something else? ' + err.code + ' ' + promptColors.RESET + ' \n');
              }
              else {
                pool.query('INSERT INTO _table_keys SET ?', {'table_name' : req.body.table, 'table_key' : key}, function(err, result) {
                  res.status(201).send(promptColors.blue + 'Created a MYSQL table! Use, ' + key + ' for future access.' + promptColors.RESET + ' \n');
                });
              }
            });
        }
        else {
          res.status(403).send(promptColors.red+'Sorry. The table, ' + req.body.table + ', already exists.'+promptColors.RESET+' \n');
        }
      }
    });
  }
});

app.post('/:table', function (req, res){
  pool.query({sql : 'SELECT table_key FROM _table_keys WHERE table_name = "' + req.params.table + '"', timeout : 60000}, function (err, result){
    if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
      res.status(504).send(promptColors.red+'Sorry, MYSQL timed out. '+promptColors.RESET+' \n');
    }
    if (err) {
      res.status(500).send(promptColors.red+'Sorry, MYSQL did something else? ' + err.code + ' ' + promptColors.RESET + ' \n');
    }
    else {
      if (result.length === 1 && result[0].table_key === req.body.key) {
        pool.query('INSERT INTO ' + req.params.table + ' SET ?', {'date' : req.body.date, 'file_name' : req.body.file_name}, function (err, result){
          if (err) {
            res.status(500).send(promptColors.red+'Sorry, MYSQL did something else? ' + err.code + promptColors.RESET + ' \n');
          }
          else {
            res.status(200).send(promptColors.blue + 'Submitted to MYSQL.' + promptColors.RESET + ' \n');
          }
        });
      }
      else {
        res.status(403).send(promptColors.red+'Sorry, bro. Wrong key.' + promptColors.RESET + ' \n');
      }
    }
  });
});

app.get('/:table', function (req, res){
  pool.query({sql : 'SELECT file_name from ' + req.params.table, timeout : 60000}, function (err, result){
    if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
      res.render('error', {error : 'MYSQL timed out. Try again?'});
    }
    if (err && err.code === 'ER_NO_DB_ERROR') {
      res.render('error', {error : 'Sorry, bro. No table with that name.'});
    }
    if (err) {
      res.render('error', {error : err.code});
    }
    else {
      res.render('index', {mysqldata : result});
    }
  });
});


app.listen(process.env.PORT || 5000);
