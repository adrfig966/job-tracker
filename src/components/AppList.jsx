import faundadb, { query as q } from 'faunadb';
import {useState, useEffect} from 'react';

console.log("Test", process.env.REACT_APP_FAUNA_KEY);
const client = new faundadb.Client({ 
    secret: process.env.REACT_APP_FAUNA_KEY,
    endpoint: 'https://db.us.fauna.com',
    domain: 'db.us.fauna.com'});

const ApplicationList = () => {

    useEffect(() => {
        let query = client.query(
            q.Map(
                q.Paginate(q.Match(q.Index('all_accounts'))),
                q.Lambda(x => q.Get(x))
            )
        );

        query.then((ret) => {
            console.log(ret);
        });

    }, []);

    return (
        <div className="application-list">
        </div>
    )

}

export default ApplicationList;