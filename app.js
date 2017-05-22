require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var decoder = require('./server/modules/decoder');
var user = require('./server/routes/user-routes');
var event = require ('./server/routes/event-routes');
var mongoConnection = require('./server/modules/mongo-connection');
var bodyParser = require('body-parser');




// Handle index file separately
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Serve back static files
app.use(express.static(path.join(__dirname, './public')));

// bodyparser middleware.  We'll probably need urlEncoded: true as well
//right now these are located in the server routes files.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



//open connection to MongoDb
mongoConnection.connect();




//decodes the token in the request header and attaches to decoded token to the //req.decodedToken on the req. Everything that happens here will require auth.
//that means is has to be sent from the Client as well.
app.use(decoder.token);

// application routes
app.use('/user', user);
app.use('/event', event);



app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
