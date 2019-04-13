const express       = require('express'); 
const request       = require('request'); 
const cors          = require('cors');
const querystring   = require('querystring');
const cookieParser  = require('cookie-parser');

const app = express();
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

const loginRoutes = require('./routes/login');
const indexRoutes = require('./routes/index');   

app.use("/login", loginRoutes);
app.use("/", indexRoutes);

console.log('Listening on 8888');
app.listen(8888);
