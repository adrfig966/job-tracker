require("dotenv").config();

const faunadb = require('faunadb')
const accounts = require('./collections/accounts');
const applications = require('./collections/applications');
const errorhandler = require('./helpers/errorhandler');
const { query: q } = faunadb;


const client = new faunadb.Client({
    secret: process.env.REACT_APP_FAUNA_KEY_SUPER,
    endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
    domain: process.env.REACT_APP_FAUNA_DOMAIN,
});

async function setupAccountsCollection() {
    await errorhandler(client.query(accounts.createUpdatePasswordFunction));
}

setupAccountsCollection();