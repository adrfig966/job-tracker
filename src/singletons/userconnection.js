import faundadb from "faunadb";

var userClient = null;

export function setClient(token) {
  userClient = new faundadb.Client({
    secret: token,
    endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
    domain: process.env.REACT_APP_FAUNA_DOMAIN,
  });

  return userClient;
}

export function getClient() {
  return userClient;
}
