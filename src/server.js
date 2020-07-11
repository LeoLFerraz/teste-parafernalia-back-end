const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const utils = require('./utils');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MONGO DB

const mongo = require('./mongo');
let mongoRS;
mongo.initialize("Flights", "Flights", (collection) => {
    mongoRS = collection;
}, (err) => {
    throw (err);
});


// FLIGHTS API

app.get('/', (req, res) => {
    return res.redirect("/tester");
});

app.get('/tester', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname + '/tester.html'));
});

app.get('/flights/', (req, res) => {
    const departure = req.query.departure;
    const origin = req.query.from;
    const destination = req.query.to;
    const company = req.query.company;
    if(!departure || !origin || !destination) {
        return res.status(401).send(`Invalid query parameters. Please choose a place of origin (?from=SÃO+PAULO), a
                                     destination (?to=NEW+YORK) and a departure date. (?departure=2020-08-14)`);
    } else {
        let results = [];
        let filter = {
            "Partida.Prevista": utils.encapsulateInLikeRegex(departure),
            "Cidade.Origem": utils.encapsulateInLikeRegex(origin),
            "Cidade.Destino": utils.encapsulateInLikeRegex(destination)
        };
        company ? filter["Companhia.Aerea"] = utils.encapsulateInLikeRegex(company) : '';
        console.log(filter);
        mongoRS.find(filter).toArray((err, result) => {
            if(err) {
                res.status(500).send("Sorry, something bad happened :(");
                throw err;
            } else {
                res.status(200).send(result);
            }
        })
    }
});

app.post('/flights/', (req, res) => {
    console.log(req.body);
    return res.status(200).send("post is ok");
});

app.listen(process.env.PORT || 8080);
