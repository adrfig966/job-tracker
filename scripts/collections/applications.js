const faunadb = require('faunadb')
const { query: q } = faunadb;

//Application Collection Setup

const createApplicationsCollection = q.CreateCollection({ name: "applications" });

const createIndexAllApplications = q.CreateIndex({
  name: "all_applications",
  source: q.Collection("applications"),
  values: [{ field: ["ref"] }],
  serialized: true,
});

const createIndexApplicationsByReference = q.CreateIndex({
  name: "applications_by_refrence",
  source: q.Collection("applications"),
  terms: [{ field: ["ref"] }],
  values: [{ field: ["data", "company"] }, { field: ["ref"] }],
  serialized: true,
});

const createIndexApplicationsByOwner = q.CreateIndex({
  name: "applications_by_owner",
  source: q.Collection("applications"),
  terms: [{ field: ["data", "owner"] }],
  values: [{ field: ["data", "company"] }, { field: ["ref"] }],
  serialized: true,
});

const createAddJobApplicationFunction = q.CreateFunction({
  name: "addjobapplication",
  role: null,
  body: q.Query(
    q.Lambda(
      ["company", "position", "date", "status", "notes"],
      q.Create(q.Collection("applications"), {
        data: {
          company: q.Var("company"),
          position: q.Var("position"),
          date: q.Date(q.Var("date")),
          status: q.Var("status"),
          notes: q.Var("notes"),
          owner: q.CurrentIdentity()
        }
      })
    )
  )
});

const createUpdateJobApplicationFunction = q.CreateFunction({
  name: "updatejobapplication",
  role: null,
  body: q.Query(
    q.Lambda(
      ["ref", "company", "position", "status", "notes"],
      q.Update(q.Ref(q.Collection("applications"), q.Var("ref")), {
        data: {
          company: q.Var("company"),
          position: q.Var("position"),
          status: q.Var("status"),
          notes: q.Var("notes"),
        }
      })
    )
  )
});

const createDeleteJobApplicationFunction = q.CreateFunction({
  name: "deletejobapplication",
  role: null,
  body: q.Query(
    q.Lambda(
      ["ref"],
      q.Delete(q.Ref(q.Collection("applications"), q.Var("ref")))
    )
  )
});

const createGetAllApplicationsFunction = q.CreateFunction({
  name: "getallapplications",
  role: null,
  body: q.Query(
    q.Lambda(
      [],
      q.Map(
        q.Paginate(q.Match(q.Index("all_applications"))),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
  )
});

//Probably redudant as there is a predicate function for auth role
const createGetApplicationsByOwnerFunction = q.CreateFunction({
  name: "getapplicationsbyowner",
  role: null,
  body: q.Query(
    q.Lambda(
      [],
      q.Map(
        q.Paginate(q.Match(q.Index("applications_by_owner"), q.CurrentIdentity())),
        q.Lambda(["company", "ref"], q.Get(q.Var("ref")))
      )
    )
  )
});


module.exports = {
  createApplicationsCollection,
  createIndexAllApplications,
  createIndexApplicationsByReference,
  createIndexApplicationsByOwner,
  createAddJobApplicationFunction,
  createGetAllApplicationsFunction,
  createGetApplicationsByOwnerFunction,
  createUpdateJobApplicationFunction,
  createDeleteJobApplicationFunction
};