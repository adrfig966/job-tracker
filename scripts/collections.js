const faunadb = require('faunadb')
const { query: q } = faunadb;

const createApplicationsCollection = q.CreateCollection({ name: "applications" });

const createAccountsCollection = q.CreateCollection({ name: "accounts" });

module.exports = {
    createApplicationsCollection,
    createAccountsCollection,
}