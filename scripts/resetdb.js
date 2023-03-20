const faunadb = require("faunadb");
const q = faunadb.query;

require("dotenv").config();

const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_KEY_SUPER,
  endpoint: process.env.REACT_APP_FAUNA_ENDPOINT,
  domain: process.env.REACT_APP_FAUNA_DOMAIN,
});

// Define function to delete all documents in a collection
async function deleteAllDocsInCollection(collection) {
  try {
    // Count all documents in collection
    const count = await client.query(
      q.Count(q.Match(q.Index(`all_${collection}`)))
    );

    // Delete all documents in collection
    const allDocs = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection(collection))),
        q.Lambda((x) => q.Delete(x))
      )
    );

    console.log(`Deleted ${count} documents from ${collection} collection.`);
  } catch (error) {
    console.log(error);
  }
}

// Call function to delete all documents in "applications" collection
deleteAllDocsInCollection("applications");
// Call function to delete all documents in "accounts" collection
deleteAllDocsInCollection("accounts");
