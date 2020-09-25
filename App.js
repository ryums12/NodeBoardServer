const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

app.get('/', (req, res) => {
    console.log("Here is get")
    const query = "select * from board order by reg_dt desc limit 10 offset ?";
    const offset = Number(req.query.offset);

    connection.query(query, [offset],
        (err, rows) => {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(rows);
            }
        }
    );
});

app.put('/boards', (req, res) => {
    console.log("Here is Put");
    const query = "insert into board (title, note, reg_dt) values (?, ?, now())"
    const title = req.body.title;
    const note = req.body.note;
    const params = [title, note];

    connection.query(query, params,
        (err, rows) => {
            if(err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        }
    );
});

app.get('/boards/:idx', (req, res) => {

});

app.delete('/boards/:idx', (req, res) => {

});


app.listen(3000, () => {
    console.log("Express server has started on port 3000")
});
