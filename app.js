'use strict'

const fs = require('fs');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const { promisify } = require('util');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');
const JiraClient = require('jira-connector');

const promiseGetAuthorizeURL = promisify(JiraClient.oauth_util.getAuthorizeURL);
const promiseSwapToken = promisify(JiraClient.oauth_util.swapRequestTokenWithAccessToken);

const app = express();
const jiraRouter = express.Router();
const webHookRouter = express.Router();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

//#region webhook route
webHookRouter.route('/')
    .post((req, res, next) => {
        console.log('request body from jira: %j', JSON.stringify(req.body));
        return res.status(httpStatus.OK);
    })
//#endregion

//#region jira connector route
jiraRouter.route('/')
    .post((req, res, next) => {
        let oauth = promiseGetAuthorizeURL({ host: req.body.hostName, oauth: { consumer_key: req.body.consumer_key ,private_key: fs.readFileSync('jira.pem', 'utf8') } });
        console.log(`oauth: ${oauth}`);
        let accessToken = promiseSwapToken({ host: req.body.hostName, oauth: { token: oauth.token, token_secret: oauth.token_secret, oauth_verifier: oauth.oauth_verifier, consumer_key: req.body.consumer_key, private_key: fs.readFileSync('jira.pem', 'utf8') } })
        console.log(`access_token: ${accessToken}`);
        let jira = JiraClient({ host: req.body.hostName, oauth: { token: accessToken.access_token, token_secret: oauth.token_secret, consumer_key: req.body.consumer_key, private_key: fs.readFileSync('jira.pem', 'utf8') } });
        console.log(`jira: ${jira}`);
    });
//#endregion
app.use('/atlassian-connect.json', (req, res) => {
    return res.sendFile(`${__dirname}/atlassian-connect.json`);
});
app.use('/webhook', webHookRouter);
app.use('/jira', jiraRouter);

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`listening on *:${app.get('port')}`);
});

module.exports = server;
