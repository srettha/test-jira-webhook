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
    .post((req, res, next) => {
        console.log('req.body:', req.body);
        console.log(`webhookEvent: ${req.body.webhookEvent}`);
        console.log(`issue_event_type_name: ${req.body.issue_event_type_name}`);
        console.log(`user: ${req.body.user}`);
        console.log(`issue: ${req.body.issue}`);
        console.log(`issue fields: ${req.body.issue.fields}`);
        console.log(`issue fields issuetype: ${req.body.issue.fields.issuetype}`);
        console.log(`issue fields project: ${req.body.issue.fields.project}`);
        console.log(`issue fields watches: ${req.body.issue.fields.watches}`);
        console.log(`issue fields priority: ${req.body.issue.fields.priority}`);
        console.log(`issue fields status: ${req.body.issue.fields.status}`);
        console.log(`issue fields aggregateprogress: ${req.body.issue.fields.aggregateprogress}`);
        console.log(`issue fields progress: ${req.body.issue.fields.progress}`);
        console.log(`issue fields comment: ${req.body.issue.fields.comment}`);
        console.log(`issue fields votes: ${req.body.issue.fields.votes}`);
        console.log(`changelog: ${req.body.changelog}`);
        console.log(`changelog items: ${req.body.changelog.items}`);
        
        return res.status(httpStatus.OK);
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
