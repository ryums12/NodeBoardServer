const express = require('express');

const app = express();

app.get('/', (req, res) => {

});

app.put('/boards', (req, res) => {

});

app.delete('/boards/:idx', (req, res) => {

});

app.get('/boards/:idx', (req, res) => {

});

app.listen(3000, () => {
    console.log("Express server has started on port 3000")
});
