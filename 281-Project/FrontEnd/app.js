var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var logger = require('./routes/logger');
var routes = require('./routes');
var home = require('./routes/home');
var mongodb = require('./routes/mongo');
var metadata = require('./routes/metadata');
var NinjaServices = require('./routes/NinjaServices');
var workspace = require('./routes/workspace');

// all environments
var app = express();
app.set('port', 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morganLogger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'cmpe281' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//API routes

app.get('/', routes.index);
app.get('/home/:id', home.homepage);
app.get('/newworkspaceid',workspace.generateWorkspaceID);
app.get('/signout',home.logout);
app.use('/common',metadata);
app.use('/NinjaServices',NinjaServices);
app.post('/login',home.login);
app.post('/signup',home.signup);
app.post('/createworkspace',workspace.createWorkspace);


app.get('/gantt',function(request,response){
  response.render('gantt');
});


// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}



app.listen(app.get('port'), function(){
  logger.log('info','[MAIN] Front-end Server listening on port ' + app.get('port'));
});