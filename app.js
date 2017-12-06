'use strict'

const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

//#region webhook router
router.route('/')
    .get((req, res, next) => {
        console.log('req.body:', req.body);
        res.status(httpStatus.OK);
    })
    .post((req, res, next) => {
        console.log('req.body:', req.body);
        res.status(httpStatus.OK);
    })
//#endregion
app.use('/atlassian-connect.json', (req, res) => {
    return res.sendFile(`${__dirname}/atlassian-connect.json`);
});
app.use('/webhook', router);

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`listening on *:${app.get('port')}`);
});

module.exports = server;
