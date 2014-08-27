# Git commit gifs as a service

## GCGAS

I want to share my love of gifs with everyone. 

### Registering

This is really simple. Just a simple curl request, with a tiny amount of JSON attached. 

```
curl -d '{"table":$MYTABLE}' -H 'content-type:application/json' http://shots.drupo.co/register
```

Make sure to replace `$MYTABLE` with you desired name. If you've picked a good one, hopefully it's not taken, you'll get a pretty response back. 

```
Created a MYSQL table! Use, $UUID for future access.
```

That `$UUID` is your key for future access. 

### Posting

Again, really simple. Curl, seeing a theme here?

```
curl -d '{"date" : $POSIXDATE, "file_name" : $FILENAME, "key" : $UUID}' -H 'content-type:application/json' http://shots.drupo.co/$TABLENAME
```

Alright. Create a post request containing `$POSIXDATE`, `$FILENAME` and `$UUID`. Send that to `http://shots.drupo.co/$TABLENAME` where `$TABLENAME` is the table you created when you registered. If you've done this correctly, you'll get a pretty message, `Submitted to MYSQL.`.

### Viewing

Open up your browser and vist `http://shots.drupo.co/$TABLENAME`. Again, `$TABLENAME` is the one you created when registering. Enjoy all your funny gifs.

## Possible issues?

Sure. I did this in an evening. This is backed by a tiny MYSQL instance, and one Heroku dyno. Enjoy it. 
