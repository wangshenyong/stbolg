const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const route = require('./router/router');
const con = require('./mysql/mysql');
const urlencodeParser = bodyParser.urlencoded({ extended: false });
// const con = require('./mysql/mysql');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'stblog',
    resave: true,
    saveUninitialized: true,
    rolling: true
}));
route.gestesRoute(app, urlencodeParser);
route.adminRoute(app,urlencodeParser);
app.listen(8084, function(req, res) {

});

app.get("/ok", urlencodeParser, function(req, res) {
    con.query(`SELECT title_tb.id,title_tb.title FROM stblog.title_tb order by title_tb.createDate ASC`, function(data) {
         res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(data);
    });
})
app.get("/title", urlencodeParser, function(req, res) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    var k = {
        ad: "ok",
        kk: "jj"
    }
    res.send(k);
});
