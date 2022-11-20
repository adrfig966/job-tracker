import faundadb from 'faunadb';

var adminClient = null;

export default function getClient() {
    if(adminClient) {
        return adminClient;
    } else {
        adminClient = new faundadb.Client({
            secret: process.env.REACT_APP_FAUNA_KEY_SUPER,
            endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
            domain: process.env.REACT_APP_FAUNA_DOMAIN,
        });
        return adminClient;
    }
}