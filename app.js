const express       = require('express'); 
const cors          = require('cors');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');

const app = express();


app.set('view engine', 'pug');
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

const loginRoutes = require('./routes/login');
const indexRoutes = require('./routes/index');   
const folderRoutes = require('./routes/folder');

app.use("/login", loginRoutes);
app.use("/", indexRoutes);
app.use("/folder", folderRoutes);

console.log('Listening on 8888');
app.listen(8888);
