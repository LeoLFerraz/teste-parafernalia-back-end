const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const utils = require('./utils');
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

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
    // TODO: Replace special characters (big regex, lazy);
    const departure = req.query.departure;
    const origin = req.query.from;
    const destination = req.query.to;
    const company = req.query.company;
    if(!departure || !origin || !destination) {
        return res.status(401).send(`Invalid query parameters. Please choose a place of origin (?from=SÃO+PAULO), a
                                     destination (?to=NEW+YORK) and a departure date. (?departure=2020-08-14)`);
    } else {
        let filter = {
            "departure": utils.encapsulateInLikeRegex(departure),
            "from": utils.encapsulateInLikeRegex(origin),
            "to": utils.encapsulateInLikeRegex(destination)
        };
        company ? filter["company"] = utils.encapsulateInLikeRegex(company) : '';
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
    let data = req.body;
    // Validate if all required fields are present
    if(data.from && data.to && data.departure && data.company) {
        // Validate datetime format
        if(utils.validateDateTimeFormat(data.departure)) {
            // TODO: check for double entries
            mongoRS.insertOne(data).then((response) => {
                return res.status(200).send(response);
            });
        } else {
            return res.status(400).send(`Bad post request. Please send the following required data: 
                                    departure: datetime in YYYY-MM-DDTHH:MM:SSZ format`);
        }
    } else {
        return res.status(400).send(`Bad post request. Please send the following required data: 
                                    to: string
                                    from: string
                                    departure: datetime in YYYY-MM-DDTHH:MM:SSZ format
                                    company: string`);
    }
});

app.listen(process.env.PORT || 8080);
