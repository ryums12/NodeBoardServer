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

    let data = {};
    let query = "select * from board order by idx desc limit 10 offset ?";
    const offset = Number(req.query.offset);

    connection.query(query, [offset], (err, rows) => {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
                data['tableData'] = rows;
            }
        }
    );

    query = "select count(*) as total from board";

    connection.query(query, (err, rows) => {
        if(err) {
            console.log(err);
            res.send(err);
        } else {
            data['pageData'] = rows;
            res.json(data);
        }
    });
});

app.post('/boards', (req, res) => {
    console.log("Here is Post");
    const query = "insert into board (title, note, reg_dt, chg_dt) values (?, ?, now(), now())"
    const title = req.body.title;
    const note = req.body.note;
    const params = [title, note];

    connection.query(query, params, (err, result) => {
            if(err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.put('/boards/:idx', (req, res) => {
    console.log("Here is Put");
    const idx = req.params.idx;
    const title = req.body.title;
    const note = req.body.note;
    const params = [title, note, idx];

    const query = 'update board set title = ?, note = ?, chg_dt = now() where idx = ?';

    connection.query(query, params, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

app.get('/boards/:idx', (req, res) => {
    console.log('Here is /board/idx');
    const idx = req.params.idx;
    const query = 'select * from board where idx = ?';

    connection.query(query, [idx], (err, result) => {
        if(err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.delete('/boards/:idx', (req, res) => {
    console.log("Here is Delete");
    const idx = req.params.idx;

    const query = 'delete from board where idx = ?';
    connection.query(query, [idx], (err, result) => {
        if(err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});


app.listen(3000, () => {
    console.log("Express server has started on port 3000")
});
